-- Copyright (C) 2022,2023 煙人計画 <moyu@vaporoid.com>
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
local quote_shell = require "quote_shell"

-- Voicepeakが出力したwavファイルを読む。
local function parse_wav(source_pathname)
  local handle = assert(io.open(source_pathname, "rb"))
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
  assert(samples_per_sec == 44100)
  assert(avg_bytes_per_sec == 88200)
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

local output_dirname, output_name = ...
local output_basename = output_dirname.."/"..output_name
local source_pathnames = { table.unpack(arg, 3) }

local result = {}
local handle = assert(io.open(output_basename..".txt", "w"))
for i, source_pathname in ipairs(source_pathnames) do
  assert(tonumber(basename(source_pathname):match "^(%d+).*%.wav$") == i - 1)
  local _, duration = parse_wav(source_pathname)
  local padded = math.ceil(duration) + 1
  result[i] = {
    duration = duration;
    padded = padded;
  }
  execute(("ffmpeg -y -i %s -filter:a apad=whole_dur=%d %s-%04d.wav"):format(quote_shell(source_pathname), padded, quote_shell(output_basename), i - 1))
  handle:write(("file '%s-%04d.wav'\n"):format(output_name, i - 1))
end
handle:close()

execute(("ffmpeg -y -f concat -i %s.txt -c copy %s.wav"):format(quote_shell(output_basename), quote_shell(output_basename)))

for i = 1, #result do
  os.remove(("%s-%04d.wav"):format(output_basename, i - 1))
end

execute(("ffmpeg -y -i %s.wav -b:a 64k -dash 1 %s.webm"):format(quote_shell(output_basename), quote_shell(output_basename)))
execute(("ffmpeg -y -i %s.wav -q:a 4 %s.mp3"):format(quote_shell(output_basename), quote_shell(output_basename)))

os.remove(output_basename..".txt")
os.remove(output_basename..".wav")

local handle = assert(io.open(output_basename..".js", "w"))

handle:write [[
(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.voiceSprite) {
  return;
}

D.voiceSprite = {
]]

local offset = 0
for i = 1, #result do
  local sprite = result[i]
  handle:write(('"%04d":[%d,%d],\n'):format(i - 1, offset * 1000, math.ceil(sprite.duration * 1000)))
  offset = offset + sprite.padded
end

handle:write [[
};

})();
]]

handle:close()
