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

local parse = require "parse"
local quote_js = require "quote_js"

local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local handle = assert(io.open(result_pathname, "w"))

for i, paragraph in ipairs(scenario) do
  if paragraph.choice_jumps then
    for j, jump in ipairs(paragraph.choice_jumps) do
      if jump.action then
        handle:write("// ", jump.file, ":", jump.line, "\n")
        handle:write("const paragraph", i, "_choice", j, "_action = async ($, ctx) => {\n")
        handle:write(jump.action, ";\n")
        handle:write "};\n\n"
      end
    end
  end
  if paragraph.when_jumps then
    handle:write("const paragraph", i, "_when = async ($, ctx) => {\n")
    for _, jump in ipairs(paragraph.when_jumps) do
      handle:write("// ", jump.file, ":", jump.line, "\n")
      handle:write("if (", jump.when, ") { return ", quote_js(jump.label), "; }\n")
    end
    handle:write "};\n\n"
  end
  if paragraph.enter then
    local info = paragraph.enter_info
    handle:write("// ", info.file, ":", info.line, "\n")
    handle:write("const paragraph", i, "_enter = async ($, ctx) => {\n")
    handle:write(paragraph.enter, ";\n")
    handle:write "};\n\n"
  end
  if paragraph.leave then
    local info = paragraph.leave_info
    handle:write("// ", info.file, ":", info.line, "\n")
    handle:write("const paragraph", i, "_leave = async ($, ctx) => {\n")
    handle:write(paragraph.leave, ";\n")
    handle:write "};\n\n"
  end
end

handle:close()
