-- Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
--
-- This file is part of 昭和横濱物語.
--
-- 昭和横濱物語 is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- 昭和横濱物語 is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

local basename = require "basename"
local generate_wav = require "generate_wav"
local quote_js = require "quote_js"
local quote_shell = require "quote_shell"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local output_dirname = ...
local source_pathnames = { table.unpack(arg, 2) }
local source_durations = {}

for i, source_pathname in ipairs(source_pathnames) do
  local duration

  local command = ("ffprobe -i %s -hide_banner -show_entries format=duration 2>/dev/null"):format(
    quote_shell(source_pathname))
  local handle = assert(io.popen(command))
  for line in handle:lines() do
    local v = line:match "^duration=([%.%d]+)$"
    if v then
      duration = tonumber(v)
    end
  end
  handle:close()

  source_durations[i] = assert(duration)
end

-- 400ミリ秒の無音区間を生成しておく。
generate_wav(output_dirname.."/silent.wav", 0.4)
execute(("ffmpeg -y -i %s/silent.wav -ac 2 %s/silent-stereo.wav"):format(
  quote_shell(output_dirname),
  quote_shell(output_dirname)))

local handle_js = assert(io.open(output_dirname.."/demeter-effect-sprite.js", "w"))
handle_js:write [[
(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.effectSprite) {
  return;
}

D.effectSprite = {
]]

local handle = assert(io.open(output_dirname.."/concat.txt", "w"))
local offset = 0
for i, source_pathname in ipairs(source_pathnames) do
  if i > 1 then
    -- 無音区間をはさむ。
    handle:write("file '"..output_dirname.."/silent-stereo.wav'\n")
  end
  handle:write("file '"..source_pathname.."'\n")

  local key = basename(source_pathname):gsub("%.[^%.]+$", "")
  local duration = source_durations[i]
  handle_js:write(('%s:[%d,%d],\n'):format(quote_js(key), math.ceil(offset * 1000), math.ceil(duration * 1000)))
  offset = offset + duration + 0.4
end
handle:close()

execute(("ffmpeg -y -safe 0 -f concat -i %s/concat.txt -b:a 64k -dash 1 %s/effect.webm"):format(
  quote_shell(output_dirname),
  quote_shell(output_dirname)))

execute(("ffmpeg -y -safe 0 -f concat -i %s/concat.txt -q:a 4 %s/effect.mp3"):format(
  quote_shell(output_dirname),
  quote_shell(output_dirname)))

handle_js:write [[
};

})();
]]

handle_js:close()
