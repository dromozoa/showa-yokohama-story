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

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

local function append(t, v)
  assert(v ~= nil)
  if not t then
    t = {}
  end
  t[#t + 1] = v
  return t
end

return function (buffer)
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

  local scenario = {}
  local paragraph
  local line

  while position <= #buffer do
    if match "^%%#([^\r\n]*)" then
      -- line comment
    elseif match "^%%choose" then
    elseif match "^%%end" then
    elseif match "^#([^\r\n]*)" then
      paragraph = { speaker = trim(_1) }
      append(scenario, paragraph)
    elseif match "^@@" then
      line = append(line, "@")
    elseif match "^@r{(.-)}{(.-)}" then
      line = append(line, {
        base = trim(_1);
        ruby = trim(_2);
      })
    elseif match "^([^%%#@\r\n]+)" then
      line = append(line, _1)
    elseif match "^\r\n?" or match "^\n\r?" then
      -- new line
      if line then
        append(paragraph, line)
        line = nil
      end
    else
      error("unknown text: "..buffer:sub(position))
    end
  end

  return scenario
end
