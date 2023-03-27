#! /usr/bin/env lua

-- Copyright (C) 2022,2023 煙人計画 <moyu@vaporoid.com>
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

local function add(a, b)
  local ax = a >> 16
  local ay = a & 0xFFFF
  local bx = b >> 16
  local by = b & 0xFFFF

  ax = ax + bx
  ay = ay + by
  print(ax, ay)
  ax = ax + (ay >> 16)
  ax = ax % 65536
  ay = ay % 65536

  print(("%08x %04x%04x"):format((a + b) & 0xFFFFFFFF, ax, ay))

  assert((a + b) & 0xFFFFFFFF == (ax * 65536) | ay)
end


--[[

  A = (ax<<24) + (ay<<16) + (az<<8) + aw
  B = (bx<<24) + (by<<16) + (bz<<8) + bw

  A * B

  ax*bx                         <<48
  ax*by + ay*bx                 <<40
  ax*bz + ay*by + az*bx         <<32
  ax*bw + ay*bz + az*by + aw*bx <<24  -- 下位8bitだけ使う
          ay*bw + az*bz + aw*by <<16
                  az*bw + aw*bz <<8
                          aw*bw


]]

local function mul(a, b)
  local ax = (a >> 24) & 0xFF
  local ay = (a >> 16) & 0xFF
  local az = (a >>  8) & 0xFF
  local aw = (a      ) & 0xFF

  local bx = (b >> 24) & 0xFF
  local by = (b >> 16) & 0xFF
  local bz = (b >>  8) & 0xFF
  local bw = (b      ) & 0xFF

  -- dot(A.xyzw, b.wzyx)
  local x = ax*bw + ay*bz + az*by + aw*bx -- <<24
  -- dot(A.yzw, B.wzy)
  local y = ay*bw + az*bz + aw*by         -- <<16
  -- dot(A.zw, B.wz)
  local z = az*bw + aw*bz                 -- <<8
  -- a.w*b.w
  local w = aw*bw

  local zw = ((z & 0xFF) << 8) + w
  local xy = ((x & 0xFF) << 8) + y + (z >> 8) + (zw >> 16)
  xy = xy & 0xFFFF
  zw = zw & 0xFFFF

  print(("%08x %04x%04x"):format((a*b)&0xFFFFFFFF, xy, zw))

  assert((a*b)&0xFFFFFFFF == (xy<<16) | zw)
end


sub(12345678, 11111111)



