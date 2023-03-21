#! /usr/bin/env lua

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

local W = 640
local H = 640
local N = 16

local handle = io.stdout
handle:write(([[
<svg xmlns="http://www.w3.org/2000/svg" width="%.17g" height="%.17g" viewBox="%.17g %.17g %.17g %.17g">
<defs>
  <style>
    rect.bg {
      fill: #000;
    }
    rect.a {
      /*
      fill: rgba(255, 255, 255, %.17g);
      */
      stroke: #fff;
      fill: none;
    }
  </style>
</defs>
<rect class="bg" x="%.17g" y="%.17g" width="%.17g" height="%.17g"/>
]]):format(W, H, -W/2, -H/2, W, H, 1/N, -W/2, -H/2, W, H))

for i = 0, N do
  local a = i / N
  -- local h = 80 + 80 * a
  -- local h = 80 * a
  -- 0度で1
  -- 45度でsqrt(2)
  -- 90度で1
  local h = math.cos(math.pi * (a - 0.5) / 2) * 100
  local h = h * (1 + a) / 2

  handle:write(([[
<rect class="a" x="%.17g" y="%.17g" width="%.17g" height="%.17g" transform="rotate(%.17g)"/>
]]):format(-W, -h/2, W*2, h, 90*a))

end

handle:write [[
</svg>
]]


