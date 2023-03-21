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

local headless = false
local width = 800
local height = 800

-- https://love2d.org/wiki/Config_Files
function love.conf(t)
  if headless then
    t.window = false
  else
    t.gammacorrect = true
    t.window.title = "昭和横濱物語"
    t.window.width = width
    t.window.height = height
    t.window.resizable = true
  end
end
