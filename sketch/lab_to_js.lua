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
local parse = require "parse"

local scenario_pathname, output_pathname = ...
local scenario = parse(scenario_pathname)
local source_pathnames = { table.unpack(arg, 3) }

local segments = {}
local map = {}

for i, source_pathname in ipairs(source_pathnames) do
  assert(tonumber(basename(source_pathname):match "^(%d+)%.lab$") == i)
  local segment = {}
  local prev = "0.0000"
  for line in io.lines(source_pathname) do
    local t, u, v = assert(line:match "^(%d+%.%d%d%d%d)000 (%d+%.%d%d%d%d)000 ([%a:]+)$")
    assert(prev == t)
    prev = u
    segment[#segment + 1] = { t = t, u = u, v = v }
    map[v] = (map[v] or 0) + 1
  end
  segments[i] = segment
end

-- for v, n in pairs(map) do
--   print(v, n)
-- end

local handle = assert(io.open(output_pathname, "w"))

handle:write [[
/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.voiceSegments) {
  return;
}

D.voiceSegments = [
]]

local index = 0
for _, paragraph in ipairs(scenario) do
  handle:write "{\n"

  for i in ipairs(paragraph) do
    index = index + 1
    handle:write(('"%d":['):format(i))
    for _, s in ipairs(assert(segments[index], "segment not found: "..index)) do
      handle:write(('[%s,"%s"],\n'):format(s.u, s.v))
    end
    handle:write "],\n"
  end

  handle:write "},\n"
end

handle:write [[
];

})();
]]

handle:close()
