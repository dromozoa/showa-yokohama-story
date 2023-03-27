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

local parse = require "parse"
local speaker_definitions = require "speaker_definitions"

local scenario_pathname, source_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local speakers = {}
for _, paragraph in ipairs(scenario) do
  for _, line in ipairs(paragraph) do
    speakers[#speakers + 1] = speaker_definitions[paragraph.speaker]
  end
end

local handle = assert(io.open(source_pathname))
local source = handle:read "a"
handle:close()

-- VPPファイルは\0で終端する疑似JSON形式とみられる。Voicepeakで読みなおせるよう
-- にナレーター・設定・感情の部分を文字列として修正する。具体的には下記の文字列
-- を対象とする。
--
-- {"narrator": {"key": "Speaker/f1"},
--  "time-offset-mode": 2,
--  "time-offset": 0.0,
--  "params": {"speed": 1.0, "pitch": 0.0, "pause": 1.0, "volume": 1.0},
--  "emotions": {"happy": 0.0, "fun": 0.0, "angry": 0.0, "sad": 0.0},

local params = { "speed", "pitch", "pause", "volume", "happy", "fun", "angry", "sad" }

local i = 0
local result = source:gsub([[{"narrator": .-, "emotions": {"happy": .-},]], function (s)
  i = i + 1
  local speaker = assert(speakers[i])
  s = s:gsub('"key": "[^"]*"', '"key": "'..speaker.speaker..'"')
  for _, param in ipairs(params) do
    s = s:gsub('"'..param..'": [%-%.0-9]+', '"'..param..'": '..speaker[param])
  end
  return s
end)

local handle = assert(io.open(result_pathname, "w"))
handle:write(result)
handle:close()
