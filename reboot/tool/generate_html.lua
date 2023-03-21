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

local template_pathname, loader_pathname, graph_pathname, credits_pathname, result_pathname = ...

local function read_all(pathname)
  local handle = assert(io.open(pathname))
  local result = handle:read "a"
  handle:close()
  return result
end

local template = read_all(template_pathname)
local loader = read_all(loader_pathname)
local graph = read_all(graph_pathname)
local credits = read_all(credits_pathname)

local handle = assert(io.open(result_pathname, "w"))
handle:write((template:gsub("$loader\n", loader):gsub("$graph\n", graph):gsub("$credits\n", credits)))
handle:close()
