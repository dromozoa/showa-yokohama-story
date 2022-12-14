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

local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local index = 0

local handle = assert(io.open(result_pathname, "w"))
for _, paragraph in ipairs(scenario) do
  handle:write(('<div data-pid="%d" data-speaker="%s">'):format(paragraph.index, paragraph.speaker))
  for _, text in ipairs(paragraph) do
    index = index + 1
    handle:write(('<div data-tid="%d">'):format(index))
    for _, v in ipairs(text) do
      if type(v) == "string" then
        handle:write(escape_html(v))
      elseif v.ruby then
        handle:write("<ruby>", escape_html(v[1]), "<rt>", escape_html(v.ruby), "</rt></ruby>")
      else
        assert(v.voice)
        handle:write(escape_html(v[1]))
      end
    end
    handle:write "</div>"
  end
  handle:write "</div>\n"
end
handle:close()
