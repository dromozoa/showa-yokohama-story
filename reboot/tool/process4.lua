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

--[[

シナリオの構造をGraphvizのdot形式で出力する。
変換結果のSVGを整理する。

SVGの単位系は
  1in = 72pt = 90px

GraphvizのSVG出力はpt単位で行われる。
72dpi以外を設定すると、<svg>直下の<g>でscaleがかかる。

基本高さ
  8pt = 0.11111111in

基本幅 (box)
  24pt = 0.33333333in

分岐の幅 (diamond)
  36pt = 0.5in

選択肢の幅 (trapezium)
  30pt = 0.41666667in

終端の直径 (circle)
  12pt = 0.16666667in

]]


local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local handle = assert(io.open(result_pathname, "w"))

local function get_entry(paragraph)
  if paragraph.when_jumps then
    return "when"..paragraph.index
  else
    return "paragraph"..paragraph.index
  end
end

local E = "--"

handle:write [[
graph {
dpi=72;
ranksep=0.11111111;
nodesep=0.11111111;
node [shape=box,width=0.33333333,height=0.11111111,label=""];
]]
for i, paragraph in ipairs(scenario) do
  if paragraph.when_jumps then
    handle:write("when", i, "[shape=diamond,width=0.5];\n")
    for _, jump in ipairs(paragraph.when_jumps) do
      handle:write("when", i, E, get_entry(scenario[scenario.labels[jump.label].index]), ";\n")
    end
    handle:write("when", i, E, "paragraph", i, ";\n")
  end

  if paragraph.choice_jumps then
    handle:write("paragraph", i, "[shape=trapezium,width=0.41666667];\n");
    for _, jump in ipairs(paragraph.choice_jumps) do
      handle:write("paragraph", i, E, get_entry(scenario[scenario.labels[jump.label].index]), ";\n")
    end
  else
    handle:write("paragraph", i, ";\n");
    if paragraph.jump then
      local jump = paragraph.jump
      handle:write("paragraph", i, E, get_entry(scenario[scenario.labels[jump.label].index]), ";\n")
    elseif paragraph.finish then
      handle:write("finish", i, "[shape=circle,width=0.16666667,height=0.16666667];\n");
      handle:write("paragraph", i, E, "finish", i, ";\n");
    else
      handle:write("paragraph", i, E, get_entry(scenario[i + 1]), ";\n")
    end
  end
end
handle:write "}\n"
