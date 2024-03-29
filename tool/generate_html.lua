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

local parse_json = require "parse_json"
local quote_shell = require "quote_shell"
local read_all = require "read_all"

local template_pathname, loader_pathname, graph_pathname, credits_pathname, trophies_pathname, version_pathname, result_pathname = ...

local template = read_all(template_pathname)
local loader = read_all(loader_pathname)
local graph = read_all(graph_pathname)
local credits = read_all(credits_pathname)
local trophies = read_all(trophies_pathname)
local version = parse_json(read_all(version_pathname))

local pattern = "<style>\n[^<]*</style>\n"
local graph_style = assert(graph:match(pattern))
local graph = graph:gsub(pattern, "")
local credits_style = assert(credits:match(pattern))
local credits = credits:gsub(pattern, "")

local handle = io.popen("git log -1 --date='format:%Y年%m月%d日' --pretty='%ad' "..quote_shell(template_pathname))
local updated = handle:read():gsub("%d+", function (v) return (v:gsub("^0+", "")) end)
handle:close();

local handle = assert(io.open(result_pathname, "w"))
local result = template
  :gsub("$graph_style\n", graph_style)
  :gsub("$credits_style\n", credits_style)
  :gsub("$loader\n", loader)
  :gsub("$graph\n", graph)
  :gsub("$credits\n", credits)
  :gsub("$trophies\n", trophies)
  :gsub("$version", version.web)
  :gsub("$updated", updated)
handle:write(result)
handle:close()
