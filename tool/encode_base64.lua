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

local encoder = {
  [62] = "+";
  [63] = "/";
}

local n = ("A"):byte()
for i = 0, 25 do
  encoder[i] = string.char(i + n)
end

local n = ("a"):byte() - 26
for i = 26, 51 do
  encoder[i] = string.char(i + n)
end

local n = ("0"):byte() - 52
for i = 52, 61 do
  encoder[i] = string.char(i + n)
end

return function (s)
  local result = {}
  for i = 1, #s, 3 do
    local a, b, c = s:byte(i, i + 2)
    if c then
      local a = a << 16 | b << 8 | c
      local d = a & 0x3F a = a >> 6
      local c = a & 0x3F a = a >> 6
      local b = a & 0x3F a = a >> 6
      result[#result + 1] = encoder[a]
      result[#result + 1] = encoder[b]
      result[#result + 1] = encoder[c]
      result[#result + 1] = encoder[d]
    elseif b then
      local a = a << 10 | b << 2
      local c = a & 0x3F a = a >> 6
      local b = a & 0x3F a = a >> 6
      result[#result + 1] = encoder[a]
      result[#result + 1] = encoder[b]
      result[#result + 1] = encoder[c]
      result[#result + 1] = "="
    else
      local a = a << 4
      local b = a & 0x3F a = a >> 6
      result[#result + 1] = encoder[a]
      result[#result + 1] = encoder[b]
      result[#result + 1] = "=="
    end
  end
  return table.concat(result)
end
