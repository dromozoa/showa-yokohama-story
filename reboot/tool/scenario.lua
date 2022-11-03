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

local parser = require "parser"

local filename = ...
local scenario = parser():parse({}, filename)

local quote_map = {
  ["&"] = "&amp;";
  ["<"] = "&lt;";
  [">"] = "&gt;";
  ["\""] = "&quot;"; ["\'"] = "&apos;";
}

local function quote(s)
  return (s:gsub("[&<>\"\']", quote_map))
end

for _, paragraph in ipairs(scenario) do
  io.write "<div>\n"
  for i, line in ipairs(paragraph) do
    for _, v in ipairs(line) do
      if type(v) == "string" then
        io.write("<span>", quote(v), "</span>")
      elseif v.ruby then
        io.write("<ruby>", quote(v[1]), "<rt>", quote(v.ruby), "</rt></ruby>")
      else
        io.write("<span>", quote(v[1]), "</span>")
      end
    end
    if i < #paragraph then
      io.write "<br>"
    end
    io.write "\n"
  end
  io.write "</div>\n"
end
