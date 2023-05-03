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

-- convert source.png -depth 8 graya:output.raw
-- lua lum_to_alpha.lua 240 192 output.raw result.raw
-- convert -depth 8 -size 240x192 graya:result.raw result.png

local W, H, source_pathname, result_pathname = ...
local W = assert(tonumber(W))
local H = assert(tonumber(H))

local handle = assert(io.open(source_pathname, "rb"))
local data = handle:read "a"
handle:close()
assert(#data == W * H * 2)

local handle = assert(io.open(result_pathname, "wb"))

local p = 1
for y = 1, H do
  for x = 1, W do
    local y, a = string.unpack("BB", data, p)
    p = p + 2
    handle:write(string.pack("BB", 0, math.floor(y * a / 255 + 0.5)))
  end
end

handle:close()
