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
local escape_html = require "escape_html"

local function parse_font_face_map(pathname)
  local handle = assert(io.open(pathname))

  local key
  local family
  local result = {}

  local _1
  local _2
  local function match(source, pattern)
    local a, b = source:match(pattern)
    if a then
      _1 = a
      _2 = b
      return true
    else
      return false
    end
  end

  for line in handle:lines() do
    if match(line, "^/%* %[(%d+)%] %*/$") or match(line, "^/%* (.+) %*/$") then
      assert(not key)
      key = _1
    elseif match(line, "^%s*font%-family: '(.+)';$") then
      assert(not family)
      family = _1
    elseif match(line, "^%s*unicode%-range: (.+);$") then
      local face = assert(family).." / "..assert(key)
      for item in (_1..","):gmatch "([^,]+),%s*" do
        local a
        local b
        if match(item, "^U%+(%x+)%-(%x+)$") then
          a = tonumber(_1, 16)
          b = tonumber(_2, 16)
        else
          assert(match(item, "^U%+(%x+)$"))
          a = tonumber(_1, 16)
          b = a
        end
        for i = a, b do
          if not result[i] then
            result[i] = face
          end
        end
      end

      key = nil
      family = nil
    end
  end

  handle:close()
  return result
end

local scenario_pathname, result_pathname, css_pathname  = ...
local scenario = parse(scenario_pathname)

local font_face_map = parse_font_face_map(css_pathname)

local map = {}
local data = {}

local handle = assert(io.open(result_pathname, "w"))
handle:write "<div>"
for _, paragraph in ipairs(scenario) do
  for _, text in ipairs(paragraph) do
    local buffer = {}
    for _, v in ipairs(text) do
      if type(v) == "string" then
        buffer[#buffer + 1] = v
      elseif v.ruby then
        buffer[#buffer + 1] = v[1]
        buffer[#buffer + 1] = v.ruby
      else
        assert(v.voice)
        buffer[#buffer + 1] = v[1]
      end
    end
    for _, code in utf8.codes(table.concat(buffer)) do
      local face = assert(font_face_map[code])
      if not map[face] then
        map[face] = true
        handle:write(utf8.char(code))
        print(face, code)
      end
    end
  end
end
handle:write "</div>\n"
handle:close()
