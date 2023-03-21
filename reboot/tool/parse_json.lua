-- Copyright (C) 2022 Tomoyuki Fujimori <moyu@vaporoid.com>
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

local unquote = {
  ["\\\""] = "\"";
  ["\\\\"] = "\\";
  ["\\b"]  = "\b";
  ["\\f"]  = "\f";
  ["\\n"]  = "\n";
  ["\\r"]  = "\r";
  ["\\t"]  = "\t";
}

return function (source)
  local position = 1
  local _1
  local _2

  local function match(pattern)
    local i, j, a, b = source:find(pattern, position)
    if i then
      position = j + 1
      _1 = a
      _2 = b
      return true
    else
      return false
    end
  end

  local function skip_ws()
    match "^[ \t\r\n]+"
  end

  local parse_value

  local function parse_string()
    local result = {}
    while true do
      if match '^"' then
        return table.concat(result)
      elseif match [[^([^"\]+)]] then
        result[#result + 1] = _1
      elseif match [[^(\["\/bfnrt])]] then
        result[#result + 1] = unquote[_1]
      elseif match [[^\u([Dd][89ABab]%x%x)\u([Dd][C-Fc-f]%x%x)]] then
        local a = tonumber(_1, 16) & 0x3FF
        local b = tonumber(_2, 16) & 0x3FF
        result[#result + 1] = utf8.char((a << 10 | b) + 0x10000)
      elseif match [[^\u(%x%x%x%x)]] then
        result[#result + 1] = utf8.char(tonumber(_1, 16))
      else
        error("parse error at position "..position)
      end
    end
  end

  local function parse_array()
    local result = {}
    local first = true
    while true do
      skip_ws()
      if match "^]" then
        return result
      elseif first then
        first = false
      elseif not match "^," then
        error("parse error at position "..position)
      end
      skip_ws()
      result[#result + 1] = parse_value()
    end
  end

  local function parse_object()
    local result = {}
    local first = true
    while true do
      skip_ws()
      if match "^}" then
        return result
      elseif first then
        first = false
      elseif not match "^," then
        error("parse error at position "..position)
      end
      skip_ws()
      if not match '^"' then
        error("parse error at position "..position)
      end
      local name = parse_string()
      skip_ws()
      if not match "^:" then
        error("parse error at position "..position)
      end
      skip_ws()
      result[name] = parse_value()
    end
  end

  function parse_value()
    skip_ws()
    if match "^false" then
      return false
    elseif match "^null" then
      return nil
    elseif match "^true" then
      return true
    elseif match "^{" then
      return parse_object()
    elseif match "^%[" then
      return parse_array()
    elseif match "^(%-?%d+%.?[%dEe+%-]*)" then
      local v = tonumber(_1)
      if not v then
        error("parse error at position "..position)
      end
      return v
    elseif match '^"' then
      return parse_string()
    else
      error("parse error at position "..position)
    end
  end

  return parse_value(source)
end
