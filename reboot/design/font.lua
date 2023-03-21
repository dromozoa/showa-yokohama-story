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

local filename = ...

--[[
  +812 ascent

  +800 ...

     0 baseline

  -200 ...

  +212 descent


  bboxは 左下xy 右上xy
  <glyph glyph-name="uni%06X" unicode="&#x%06X;" d="M12 -200 v1000 h1000 v-1000 h-1000 z"/>

]]

local handle = assert(io.open(filename, "w"))
handle:write(([[
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<metadata>
</metadata>
<defs>
<font id="%s" horiz-adv-x="1024" vert-adv-y="1024">
  <font-face
    font-family="%s"
    font-style="all"
    font-variant="normal"
    font-weight="normal"
    font-stretch="normal"
    font-size="all"
    unicode-range="U+20-FFFD"
    units-per-em="1024"
    panose-1="0 0 0 0 0 0 0 0 0 0"
    cap-height="800"
    x-height="400"
    accent-height="800"
    ascent="800"
    descent="-200"
    bbox="0 -212 1024 812"
    underline-position="-32"
    underline-thickness="64"
  />
  <missing-glyph d="M12 -200 v1000 h1000 v-1000 h-1000 z"/>
]]):format("sys1", "sys"))

for i = 0x20, 0xFFFF do
  if (i < 0xD800 or i > 0xDFFF) and i ~= 0xFFFE and i ~= 0xFFFF then
    handle:write(([[
  <glyph glyph-name="uni%06X" unicode="&#x%06X;" d="M12 -200 v1000 h1000 v-1000 h-1000 z"/>
]]):format(i, i))
  end
end

handle:write [[
</font>
</defs>
</svg>
]]

handle:close()
