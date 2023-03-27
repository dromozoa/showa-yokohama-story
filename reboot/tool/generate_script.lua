-- Copyright (C) 2022,2023 煙人計画 <moyu@vaporoid.com>
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

local function encode_text(text)
  local result = {}
  for i, v in ipairs(text) do
    if type(v) == "string" then
      result[#result + 1] = quote_js(v)
    elseif v.ruby then
      result[#result + 1] = "["..quote_js(v[1])..","..quote_js(v.ruby).."]"
    else
      result[#result + 1] = quote_js(v[1])
    end
  end
  return "["..table.concat(result, ",").."]"
end

local handle = assert(io.open(result_pathname, "w"))

handle:write [[
(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
]]

local total = 0
handle:write "paragraphs:[\n"
for i, paragraph in ipairs(scenario) do
  handle:write("[{speaker:", quote_js(paragraph.speaker))
  if paragraph.jump then
    handle:write(",jump:", scenario.labels[paragraph.jump.label].index)
  end
  if paragraph.choice_jumps then
    handle:write ",choices:[\n"
    for _, jump in ipairs(paragraph.choice_jumps) do
      handle:write("{choice:", encode_text(jump.choice))
      if jump.action then
        handle:write(",action:async($,ctx)=>{", jump.action, ";}")
      end
      if jump.barcode then
        handle:write(",barcode:", quote_js(jump.barcode))
      end
      handle:write(",label:", scenario.labels[jump.label].index, "},\n")
    end
    handle:write "]"
  end
  if paragraph.when_jumps then
    handle:write ",when:async($,ctx)=>{\n"
    for _, jump in ipairs(paragraph.when_jumps) do
      handle:write("if(", jump.when, ")return ", scenario.labels[jump.label].index, ";\n")
    end
    handle:write "}"
  end
  if paragraph.enter then
    handle:write(",enter:async($,ctx)=>{", paragraph.enter, ";}")
  end
  if paragraph.leave then
    handle:write(",leave:async($,ctx)=>{", paragraph.leave, ";}")
  end
  if paragraph.start then
    handle:write(",start:", quote_js(paragraph.start))
  end
  if paragraph.finish then
    handle:write(",finish:", quote_js(paragraph.finish))
  end
  if paragraph.system then
    handle:write ",system:true"
  else
    total = total + 1
  end
  if paragraph.music then
    handle:write(",music:", quote_js(paragraph.music))
  end
  if paragraph.place then
    handle:write(",place:", quote_js(paragraph.place))
  end
  if paragraph.background then
    handle:write(",background:", quote_js(paragraph.background))
  end
  if paragraph.dialog then
    handle:write ",dialog:["
    for _, choice in ipairs(paragraph.dialog.choices) do
      handle:write("{choice:", quote_js(choice.choice), ",result:", quote_js(choice.result), "},")
    end
    handle:write "]"
  end
  handle:write "},[\n"

  for _, text in ipairs(paragraph) do
    handle:write(encode_text(text), ",\n")
  end

  handle:write "]],\n"
end
handle:write "],\n"
handle:write("total:", total, ",\n")

handle:write "labels:{\n"
for _, label in ipairs(scenario.labels) do
  handle:write(quote_js(label.label), ":", label.index, ",\n")
end
handle:write "},\n"

handle:write "dialogs:{\n"
for _, dialog in ipairs(scenario.dialogs) do
  handle:write(quote_js(dialog.dialog), ":", dialog.index, ",\n")
end
handle:write "},\n"


handle:write [[
};

})();
]]

handle:close()
