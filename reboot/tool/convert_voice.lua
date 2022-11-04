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

local basename = require "basename"

for i, source_pathname in ipairs(arg) do
  local source_filename = basename(source_pathname)
  local source_number = assert(source_filename:match "^(%d+).*%.wav$")
  assert(tonumber(source_number) + 1 == i)
  local command = ("ffmpeg -y -i '%s' -dash 1 '%04d.webm'"):format(source_pathname, i)
  print(command)
  os.execute(command)
end
