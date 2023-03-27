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

local quote_js = require "quote_js"

local function write(handle, u)
  local t = type(u)
  if t == "number" then
    return handle:write(("%.17g"):format(u))
  elseif t == "string" then
    return handle:write(quote_js(u))
  elseif t == "boolean" then
    return handle:write(u and "true" or "false")
  elseif t == "table" then
    if next(u) == nil then
      return handle:write "[]"
    end
    local keys = {}
    for k, v in pairs(u) do
      if type(k) == "string" then
        keys[#keys + 1] = k
      else
        handle:write "["
        for i, v in ipairs(u) do
          if i > 1 then
            handle:write ",\n"
          end
          write(handle, v)
        end
        return handle:write "]"
      end
    end
    table.sort(keys)
    handle:write "{"
    for i, k in ipairs(keys) do
      if i > 1 then
        handle:write ",\n"
      end
      write(handle, k)
      handle:write ":"
      write(handle, u[k])
    end
    return handle:write "}"
  end
end

return write
