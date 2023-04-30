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

local basename = require "basename"
local quote_shell = require "quote_shell"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local output_dirname = ...
local source_pathnames = { table.unpack(arg, 2) }

for i, source_pathname in ipairs(source_pathnames) do
  assert(tonumber(basename(source_pathname):match "^(%d+).*%.wav$") == i - 1)
  execute(("ffmpeg -y -i %s -codec:a libvorbis -qscale:a 4 %s/%04d.oga"):format(
      quote_shell(source_pathname),
      quote_shell(output_dirname),
      i))
end
