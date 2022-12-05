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

local output_dirname = arg[1]

local function quote_shell(s)
  return (([[']]..s:gsub([[']], [['\'']])..[[']]):gsub([[\''']], [[\']]):gsub([[''\']], [[\']]))
end

local function execute(command)
  print(command)
  os.execute(command)
end

for i = 1, #arg - 1 do
  local source_pathname = arg[i + 1]
  local source_filename = basename(source_pathname)
  local source_number = assert(source_filename:match "^(%d+).*%.wav$")
  print(source_filename, source_number, i)
  assert(tonumber(source_number) + 1 == i)

  -- webm
  execute(("ffmpeg -y -i %s -b:a 64k -dash 1 %s/%04d.webm"):format(quote_shell(source_pathname), quote_shell(output_dirname), i))

  -- mp3
  execute(("ffmpeg -y -i %s -q:a 2 %s/%04d.mp3"):format(quote_shell(source_pathname), quote_shell(output_dirname), i))
end
