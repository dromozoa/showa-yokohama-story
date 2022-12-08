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
local escape_html = require "escape_html"

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
  write(('<div data-pid="%d" data-speaker="%s">'):format(paragraph.index, paragraph.speaker))
  for _, text in ipairs(paragraph) do
    n = n + 1
    write(('<div data-tid="%d">'):format(n))
    for _, v in ipairs(text) do
      if type(v) == "string" then
        write(escape_html(v))
      elseif v.ruby then
        write("<ruby>", escape_html(v[1]), "<rt>", escape_html(v.ruby), "</rt></ruby>")
      else
        assert(v.voice)
        write(escape_html(v[1]))
      end
    end
    write "</div>"
  end
  if paragraph.jumps then
    write "<!--\n"
    for _, jump in ipairs(paragraph.jumps) do
      write("label=", escape_html(jump.label), "\n")
      if jump.choice then
        write "choice="
        for _, v in ipairs(jump.choice) do
          if type(v) == "string" then
            write(escape_html(v))
          elseif v.ruby then
            write("<ruby>", escape_html(v[1]), "<rt>", escape_html(v.ruby), "</rt></ruby>")
          else
            assert(v.voice)
            write(escape_html(v[1]))
          end
        end
        write "\n"
      end
      if jump.when then
        write("when=", escape_html(jump.when), "\n")
      end
    end
    write "-->\n"
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
  for _, text in ipairs(paragraph) do
    for _, v in ipairs(text) do
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
