-- Copyright (C) 2022,2023 Tomoyuki Fujimori <moyu@vaporoid.com>
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

local quote = {
  ["\b"] = [[\b]];
  ["\t"] = [[\t]];
  ["\n"] = [[\n]];
  ["\f"] = [[\f]];
  ["\r"] = [[\r]];
  ["\""] = [[\"]];
  ["\\"] = [[\\]];

  [string.char(0x7F)]             = [[\u007F]]; -- DELETE
  [string.char(0xE2, 0x80, 0xA8)] = [[\u2028]]; -- LINE SEPARATOR
  [string.char(0xE2, 0x80, 0xA9)] = [[\u2029]]; -- PARAGRAPH SEPARATOR
}

for byte = 0, 31 do
  local char = string.char(byte)
  if not quote[char] then
    quote[char] = ([[\u%04X]]):format(byte)
  end
end

return function (s)
  return [["]]..s:gsub("[%z\1-\31\"\\\127]", quote):gsub("\226\128[\168\169]", quote)..[["]]
end
