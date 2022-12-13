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
local quote_js = require "quote_js"

local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local handle = assert(io.open(result_pathname, "w"))

handle:write [[
(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = [
]]

for _, paragraph in ipairs(scenario) do
  handle:write("[{speaker:", quote_js(paragraph.speaker), "},[\n")

  for _, text in ipairs(paragraph) do
    handle:write "["
    for i, v in ipairs(text) do
      if i > 1 then
        handle:write ","
      end
      if type(v) == "string" then
        handle:write(quote_js(v))
      elseif v.ruby then
        handle:write("[", quote_js(v[1]), ",", quote_js(v.ruby), "]")
      else
        assert(v.voice)
        handle:write(quote_js(v[1]))
      end
    end
    handle:write "],\n"
  end

  handle:write "]],\n"
end

handle:write [[
];

})();
]]

handle:close()
