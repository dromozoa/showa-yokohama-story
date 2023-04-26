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

local scenario_pathname, result_pathname = ...
local scenario = parse(scenario_pathname)

local handle = assert(io.open(result_pathname, "w"))
for _, paragraph in ipairs(scenario) do
  for _, text in ipairs(paragraph) do
    for _, v in ipairs(text) do
      if type(v) == "string" then
        handle:write(v)
      else
        assert(v.voice)
        handle:write(v.voice)
      end
    end
    handle:write "\n"
  end
end
handle:close()
