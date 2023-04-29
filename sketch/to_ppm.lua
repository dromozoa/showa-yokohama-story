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

local min =  math.huge
local max = -math.huge

local dataset = {}
local cols

for line in io.lines() do
  local data = {}
  for v in line:gmatch "[^\t]+" do
    local v = assert(tonumber(v))
    min = math.min(v, min)
    max = math.max(v, max)
    data[#data + 1] = v
  end
  if not cols then
    cols = #data
  end
  dataset[#dataset + 1] = data
end

local mode
local width = 10
assert(cols == 20 or cols == 128)
if cols == 20 then
  mode = function (v)
    if v < 0 then
      return 0, math.floor(0.5 - v / 4), 0
    else
      return math.floor(0.5 + v / 4), 0, 0
    end
  end
  assert(-1024 <= min and min <= 1024)
  assert(-1024 <= max and max <= 1024)
elseif cols == 128 then
  local size = max - min
  mode = function (v)
    local u = math.floor((v - min) / size * 255 + 0.5)
    return u, u, u
  end
  assert(-81 < min and min < 1)
  assert(-81 < max and max < 1)
else
  error "unknown mode"
end

io.write "P3\n"
io.write(cols * width, " ", #dataset, "\n")
io.write "255\n"

for _, data in ipairs(dataset) do
  for _, v in ipairs(data) do
    local r, g, b = mode(v)
    for i = 1, width do
      io.write(r, " ", g, " ", b, " ")
    end
  end
  io.write "\n"
end
