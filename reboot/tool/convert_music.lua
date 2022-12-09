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
local quote_shell = require "quote_shell"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local output_dirname, output_name = ...
local source_pathnames = { table.unpack(arg, 3) }
table.sort(source_pathnames, function (a, b)
  return tonumber(basename(a):match "^(%d+).*%.wav$") < tonumber(basename(b):match "^(%d+).*%.wav$")
end)

for i, source_pathname in ipairs(source_pathnames) do
  assert(tonumber(basename(source_pathname):match "^(%d+).*%.wav$") == i)

  -- webm
  execute(("ffmpeg -y -i %s -b:a 128k -dash 1 %s/%s%02d.webm"):format(quote_shell(source_pathname), quote_shell(output_dirname), quote_shell(output_name), i))

  -- mp3
  execute(("ffmpeg -y -i %s -q:a 2 %s/%s%02d.mp3"):format(quote_shell(source_pathname), quote_shell(output_dirname), quote_shell(output_name), i))
end
