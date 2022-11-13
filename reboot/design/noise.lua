#! /usr/bin/env lua

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

-- https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
-- https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

-- sinの結果に43758.5453をかける
-- 43758.5453123というのもあった

local f64 = 43758.5453123
local f32 = string.unpack("<f", string.pack("<f", f64))

--[[
print(("43758.5453... => f32 %a"):format(f32)) -- 0x1.55dd18p+15
print(("43758.5453... => f64 %a"):format(f64)) -- 0x1.55dd17318fc5p+15

print(0x1.55dd1731p+15)
print(0x1.55dd1732p+15)
print(0x1.55dd1733p+15)
print(0x1.55dd1734p+15)

for i = -3, 3 do
  local x = 0x155dd173 + i
  print(("0x%08x (%d) / 8192 => %.17g"):format(x, x, x / 8192))
end

for i = -3, 3 do
  local x = 0xaaee8b9 + i
  print(("0x%08x (%d) / 4096 => %.17g"):format(x, x, x / 4096))
end
]]

-- 43758  = 0xAAEE       = 0b1010 1010 1110 1110
-- 0.5453 = 0x8B98/65536 = 0b1000 1011 1001 1000 / 65536
--
-- 0x1010 1010 1110 1110 1010 1000

local function bitstring(v, m, n)
  local buffer = {}
  for i = m or 0, n or 3 do
    buffer[#buffer + 1] = (v >> i) & 1
  end
  return table.concat(buffer)
end

-- 4bit整数の演算の結果
for x = 0, 15 do
  for y = 0, 15 do
    local v = x ~ y
    -- print(bitstring(x), bitstring(y), bitstring(v))
    -- print(bitstring((x*x)%209, 0, 3))
  end
end

local handle = assert(io.open("test.pgm", "w"))

handle:write [[
P2
256 256
255
]]

-- a+b == a~b
local n = 0
for x = 0, 255 do
  for y = 0, 255 do
    -- local u = (x * y) >> 4 & 0xFF
    local u = (x + y) >> 1
    local v = x ~ y
    if u == v then
      handle:write "255 "
      n = n + 1
      print(bitstring(x, 0, 7))
      -- print(bitstring(u, 0, 7), bitstring(x, 0, 7), bitstring(y, 0, 7))
    else
      handle:write "0 "
    end
  end
  handle:write "\n"
end

handle:close()

-- io.stderr:write(n, "\n")

