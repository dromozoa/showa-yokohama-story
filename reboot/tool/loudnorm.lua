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

local parse_json = require "parse_json"
local quote_shell = require "quote_shell"

local LRA = "7.0"
local TP = "-2.0"
local integrated_loudness_target, source_pathname, result_name = ...

local function execute(command)
  print(command)
  assert(os.execute(command))
end

-- ラウドネスを調べる
local audio_filter = "loudnorm"
  .."=I="..integrated_loudness_target
  ..":LRA="..LRA
  ..":TP="..TP
  ..":print_format=json"
execute(("ffmpeg -y -i %s -filter:a %s -f:a null - 2>&1 | tee %s-loudnorm.txt"):format(quote_shell(source_pathname), quote_shell(audio_filter), quote_shell(result_name)))

local handle = assert(io.open(result_name.."-loudnorm.txt"))
local source = handle:read "a"
handle:close()
local result = parse_json(assert(source:match "\n{\n.-\n}\n"))

local audio_filter = "loudnorm"
  .."=I="..integrated_loudness_target
  ..":LRA="..LRA
  ..":TP="..TP
  ..":measured_I="..result.input_i
  ..":measured_TP="..result.input_tp
  ..":measured_LRA="..result.input_lra
  ..":measured_thresh="..result.input_thresh
  ..":offset="..result.target_offset
  ..":print_format=json,"
  .."channelmap=channel_layout=stereo,"
  .."aresample=48000:resampler=soxr"

execute(("ffmpeg -y -i %s -filter:a %s %s.wav"):format(quote_shell(source_pathname), quote_shell(audio_filter), quote_shell(result_name)))


