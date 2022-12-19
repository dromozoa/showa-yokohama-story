-- Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
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
local write_json = require "write_json"

local source_pathname = ...

local handle = assert(io.open(source_pathname))
local source = handle:read "a"
handle:close()

-- VPPファイルから音素を抽出する。
local vpp = parse_json(source:gsub("\0$", ""))
for _, block in ipairs(vpp.project.blocks) do
  for _, sentence in ipairs(block["sentence-list"]) do
    for _, token in ipairs(sentence.tokens) do
      for _, syl in ipairs(token.syl) do
        -- syl.sとsyl.p.sを取得する。
        local ps = {}
        for _, p in ipairs(syl.p) do
          ps[#ps + 1] = p.s
        end
        io.write(table.concat(ps), "\t", syl.s, "\n")
      end
    end
  end
end