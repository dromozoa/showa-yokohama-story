-- Copyright (C) 2023 Tomoyuki Fujimori <moyu@vaporoid.com>
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

local result_pathname = ...

local handle_js = assert(io.open(result_pathname, "w"))

for i = 2, #arg do
  local source_pathname = arg[i]
  local handle = assert(io.open(source_pathname))

  local state = 1
  local prologue = i == 2
  local epilogue = i == #arg

  for line in handle:lines() do
    if state == 1 then
      if line:find [[":{width:]] then
        state = 2
      elseif prologue then
        handle_js:write(line, "\n")
      end
    end
    if state == 2 then
      handle_js:write(line, "\n")
      if line == "]}," then
        state = 3
      end
    elseif state == 3 and epilogue then
      handle_js:write(line, "\n")
    end
  end

  handle:close()
end
