-- Copyright (C) 2022 Tomoyuki Fujimori <moyu@vaporoid.com>
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

local source_filename, result_filename = ...

local base64 = {
  [62] = "+";
  [63] = "/";
}

for i = 0, 25 do
  local byte = ("A"):byte() + i
  base64[i] = string.char(byte)
end
for i = 26, 51 do
  local byte = ("a"):byte() + i - 26
  base64[i] = string.char(byte)
end
for i = 52, 61 do
  local byte = ("0"):byte() + i - 52
  base64[i] = string.char(byte)
end

local handle = assert(io.open(source_filename, "rb"))
local source = handle:read "*a"
handle:close()

local buffer = {}

for i = 1, #source, 3 do
  local a, b, c = source:byte(i, i + 2)
  if c then
    local v = a << 16 | b << 8 | c
    local d = v & 0x3F
    local c = (v >> 6) & 0x3F
    local b = (v >> 12) & 0x3F
    local a = v >> 18
    buffer[#buffer + 1] = base64[a]..base64[b]..base64[c]..base64[d]
  elseif b then
    local v = a << 10 | b << 2
    local c = v & 0x3F
    local b = (v >> 6) & 0x3F
    local a = v >> 12
    buffer[#buffer + 1] = base64[a]..base64[b]..base64[c].."="
  else
    local v = a << 4
    local b = v & 0x3F
    local a = v >> 6
    buffer[#buffer + 1] = base64[a]..base64[b].."=="
  end
end

local handle = assert(io.open(result_filename, "w"))
handle:write([[
@font-face {
  font-family: 'Showa Yokohama Story';
  font-display: swap;
  src: url(data:font/woff2;base64,]], table.concat(buffer), [[) format('woff2');
  unicode-range: U+E000-E002;
}
]])
handle:close()
