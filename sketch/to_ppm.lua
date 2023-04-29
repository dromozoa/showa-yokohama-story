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
for line in io.lines() do
  local data = {}
  for v in line:gmatch "[^\t]+" do
    local v = assert(tonumber(v))
    min = math.min(v, min)
    max = math.max(v, max)
    data[#data + 1] = v
  end
  -- 次元数は20固定
  assert(#data == 20)
  dataset[#dataset + 1] = data
end

assert(-1024 <= min and min <= 1024)
assert(-1024 <= max and max <= 1024)

local width = 10

io.write "P3\n"
io.write(20 * width, " ", #dataset, "\n")
io.write "255\n"

for _, data in ipairs(dataset) do
  for _, v in ipairs(data) do
    local r = 0
    local g = 0
    local b = 0
    if v > 0 then
      r = math.floor(0.5 + v / 4)
    elseif v < 0 then
      g = math.floor(0.5 - v / 4)
    end

    for i = 1, width do
      io.write(r, " ", g, " ", b, " ")
    end
  end
  io.write "\n"
end
