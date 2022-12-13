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

SVGの単位系は
  1in = 72pt = 90px
GraphvizのSVG出力はpt単位で行われる。
72dpi以外を設定すると、<svg>直下の<g>でscaleがかかる。

基本高さ
  8pt = 0.11111111in

種別 [c]
  分岐の幅 (diamond)
    36pt = 0.5in

種別 [p]
  段落の幅 (box)
    24pt = 0.33333333in
  選択肢付き段落の幅 (trapezium)
    30pt = 0.41666667in

種別 [f]
  終端の直径 (circle)
    12pt = 0.16666667in

矢印はSVGのmark-endで実現し、Graphvizでは描画しない。

]]

local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local function get_entry(paragraph)
  if paragraph.when_jumps then
    return "c"..paragraph.index
  else
    return "p"..paragraph.index
  end
end

local function jump_entry(jump)
  return get_entry(scenario[scenario.labels[jump.label].index])
end

local to = "--"

local handle = assert(io.open(result_pathname, "w"))
handle:write [[
graph {
dpi=72;
ranksep=0.11111111;
nodesep=0.11111111;
node [shape=box,width=0.33333333,height=0.11111111,label=""];
]]
for i, paragraph in ipairs(scenario) do
  if paragraph.when_jumps then
    handle:write("c", i, "[shape=diamond,width=0.5];\n")
    for _, jump in ipairs(paragraph.when_jumps) do
      handle:write("c", i, to, jump_entry(jump), ";\n")
    end
    handle:write("c", i, to, "p", i, ";\n")
  end

  if paragraph.choice_jumps then
    handle:write("p", i, "[shape=trapezium,width=0.41666667];\n");
    for _, jump in ipairs(paragraph.choice_jumps) do
      handle:write("p", i, to, jump_entry(jump), ";\n")
    end
  else
    handle:write("p", i, ";\n");
    if paragraph.jump then
      handle:write("p", i, to, jump_entry(paragraph.jump), ";\n")
    elseif paragraph.finish then
      handle:write("f", i, "[shape=circle,width=0.16666667,height=0.16666667];\n");
      handle:write("p", i, to, "f", i, ";\n");
    else
      handle:write("p", i, to, get_entry(scenario[i + 1]), ";\n")
    end
  end
end
handle:write "}\n"
handle:close()
