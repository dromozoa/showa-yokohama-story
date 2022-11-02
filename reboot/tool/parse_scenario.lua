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

--[[




]]

return function (buffer)
  -- bufferを先頭から読んでいく。

-- local result = { "return function (context) return {\n" }
-- local s = buffer
--   :gsub("%-%-%[(%=*)%[.-%]%1%]", "")
--   :gsub("%-%-[^\n]*", "")
--   :gsub("[ \t]+\n", "\n")
--   :gsub("\n\n+", "\n")
--   :gsub("^\n+", "")
--   :gsub("(.-)%$([A-Za-z_][0-9A-Za-z_]*)", function (a, b)
--     append(result, quote_lua(a), ";\ncontext[", quote_lua(b), "];\n")
--     return ""
--   end)
-- append(result, quote_lua(s), ";\n} end\n")

  local position = 1
  local _1
  local _2
  local _3
  local _4

  local function match(pattern)
    local i, j, a, b, c, d = buffer:find(pattern, position)
    if i then
      position = j + 1
      _1 = a
      _2 = b
      _3 = c
      _4 = d
      return true
    else
      return false
    end
  end

  while position <= #buffer do
    if match "^%%#([^\r\n]*)" then
      print("comment", _1)
    elseif match "^\r\n?" or match "^\n\r?" then
      print("newline")
    elseif match "^#([^\r\n]*)" then
      print("speaker", _1)
    elseif match "^([^%%#@\r\n]+)" then
      print("chars", _1)
    elseif match "^@r{(.-)}{(.-)}" then
      print("ruby", _1, _2)
    else
      error("unknown text: "..buffer:sub(position))
    end
  end
end
