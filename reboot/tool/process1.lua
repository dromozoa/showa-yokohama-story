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

local parse = require "parse"
local quote_html = require "quote_html"

local scenario_pathname, template_pathname, html_pathname, text_pathname = ...
local scenario = parse(scenario_pathname)

local buffer = {}
local function write(...)
  local n = #buffer
  for i = 1, select("#", ...) do
    buffer[n + i] = select(i, ...)
  end
end

local n = 0
for _, paragraph in ipairs(scenario) do
  write(('<div id="p%04d" class="paragraph">\n'):format(paragraph.index))
  for i, line in ipairs(paragraph) do
    n = n + 1
    write(('<span id="n%04d" class="line">'):format(n))
    for _, v in ipairs(line) do
      if type(v) == "string" then
        write(quote_html(v))
      elseif v.ruby then
        write("<ruby>", quote_html(v[1]), "<rt>", quote_html(v.ruby), "</rt></ruby>")
      else
        assert(v.voice)
        write(quote_html(v[1]))
      end
    end
    write "</span>"
    if i < #paragraph then
      write "<br>"
    end
    write "\n"
  end
  write "</div>\n"
end

local handle = assert(io.open(template_pathname))
local template = handle:read "a"
handle:close()

local handle = assert(io.open(html_pathname, "w"))
handle:write((template:gsub("$scenario\n", table.concat(buffer))))
handle:close()

local handle = assert(io.open(text_pathname, "w"))
local function write(...)
  handle:write(...)
end
for _, paragraph in ipairs(scenario) do
  for _, line in ipairs(paragraph) do
    for _, v in ipairs(line) do
      if type(v) == "string" then
        write(v)
      else
        assert(v.voice)
        write(v.voice)
      end
    end
    write "\n"
  end
end
handle:close()
