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

local parse_json = require "parse_json"
local write_json = require "write_json"

local source_pathname, output_dirname = ...

local handle = assert(io.open(source_pathname))
local source = handle:read "a"
handle:close()

local vpp = parse_json(source:gsub("\0$", ""))

-- VPPファイルから、JuliusのSegment Tookitに渡すテキストファイルを作成する。
for i, block in ipairs(vpp.project.blocks) do
  local buffer = {}

  for _, sentence in ipairs(block["sentence-list"]) do
    for _, token in ipairs(sentence.tokens) do
      for _, syl in ipairs(token.syl) do
        local s = syl.s
        if s == "" then
          s = " "
        end
        buffer[#buffer + 1] = s
      end
    end
  end

  local output_pathname = output_dirname..("/%04d.txt"):format(i)
  local handle = assert(io.open(output_pathname, "w"))

  local buffer = table.concat(buffer):gsub("^ +", ""):gsub(" +$", "")
  for _, code in utf8.codes(buffer) do
    if code == 0x20 then
      handle:write " sp "
    elseif 0x30A1 <= code and code <= 0x30F3 then
      handle:write(utf8.char(code - 0x60))
    elseif code == 0x30F4 then
      -- segment_julius.plは「ゔ」を受け付けない。
      handle:write "う゛"
    else
      error("cannot convert: "..utf8.char(code))
    end
  end

  handle:write "\n"
  handle:close()
end
