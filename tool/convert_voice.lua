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
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

local basename = require "basename"
local generate_wav = require "generate_wav"
local parse = require "parse"
local quote_shell = require "quote_shell"

-- Voicepeakが出力したwavファイルを読む。
local function parse_wav(pathname)
  local handle = assert(io.open(pathname, "rb"))
  assert(handle:read(4) == "RIFF")

  local file_size = string.unpack("<I4", handle:read(4))
  assert(handle:read(4) == "WAVE")

  local format_tag
  local channels
  local samples_per_sec
  local avg_bytes_per_sec
  local block_align
  local bits_per_sample
  local data_size
  local data_duration

  while true do
    local tag = handle:read(4)
    if not tag then
      break
    end
    local size = string.unpack("<I4", handle:read(4))
    if tag == "fmt " then
      format_tag, channels, samples_per_sec, avg_bytes_per_sec, block_align, bits_per_sample = string.unpack("<I2I2I4I4I2I2", handle:read(size))
    elseif tag == "data" then
      assert(not data_size)
      data_size = size
      data_duration = size * 8 / bits_per_sample / samples_per_sec
      handle:seek("cur", size)
    else
      assert(tag == "JUNK" or tag == "LIST")
      handle:seek("cur", size)
    end
  end

  handle:close()

  assert(format_tag == 1)
  assert(channels == 1)
  assert(samples_per_sec == 48000)
  assert(avg_bytes_per_sec == 96000)
  assert(block_align == 2)
  assert(bits_per_sample == 16)
  assert(data_size)
  assert(data_duration)

  return data_size, data_duration
end

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local scenario_pathname, output_dirname = ...
local scenario = parse(scenario_pathname)
local source_pathnames = { table.unpack(arg, 3) }
local source_durations = {}

for i, source_pathname in ipairs(source_pathnames) do
  assert(tonumber(basename(source_pathname):match "^(%d+).*%.wav$") == i - 1)
  local _, duration = parse_wav(source_pathname)
  source_durations[i] = duration
end

-- 400ミリ秒の無音区間を生成しておく。
generate_wav(output_dirname.."/silent.wav", 0.4)

local handle_js = assert(io.open(output_dirname.."/demeter-voice-sprites.js", "w"))

handle_js:write [[
/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.voiceSprites) {
  return;
}

D.voiceSprites = [
]]

local index = 0
for i, paragraph in ipairs(scenario) do
  local offset = 0
  handle_js:write "{"

  local handle = assert(io.open(output_dirname.."/concat.txt", "w"))
  for j, text in ipairs(paragraph) do
    index = index + 1
    if j > 1 then
      -- 無音区間をはさむ。
      handle:write("file '"..output_dirname.."/silent.wav'\n")
    end
    handle:write("file '"..source_pathnames[index].."'\n")

    local duration = source_durations[index]
    handle_js:write(('"%d":[%d,%d],'):format(j, math.ceil(offset * 1000), math.ceil(duration * 1000)))
    offset = offset + duration + 0.4
  end
  handle:close()

  handle_js:write "},\n"

  execute(("ffmpeg -y -safe 0 -f concat -i %s/concat.txt -b:a 64k -dash 1 %s/%04d.webm"):format(
    quote_shell(output_dirname),
    quote_shell(output_dirname),
    i))

  execute(("ffmpeg -y -safe 0 -f concat -i %s/concat.txt -q:a 4 %s/%04d.mp3"):format(
    quote_shell(output_dirname),
    quote_shell(output_dirname),
    i))
end

handle_js:write [[
];

})();
]]

handle_js:close()
