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

local parse_json = require "parse_json"
local quote_shell = require "quote_shell"

local DYLD_LIBRARY_PATH, result_pathname = ...
local source_pathnames = { table.unpack(arg, 3) }

local W
local H

for _, source_pathname in ipairs(source_pathnames) do
  local command = ("env DYLD_LIBRARY_PATH=%s convert %s json:-"):format(
      quote_shell(DYLD_LIBRARY_PATH),
      quote_shell(source_pathname))
  local handle = assert(io.popen(command))
  local source = parse_json(handle:read "a")
  handle:close()

  local w = source[1].image.geometry.width
  local h = source[1].image.geometry.height
  assert(not W or W == w)
  assert(not H or H == h)
  W = w
  H = h
end

assert(W == 120)
assert(H ==  96)

local result = {}

local q = 0
for i, source_pathname in ipairs(source_pathnames) do
  local command = ("env DYLD_LIBRARY_PATH=%s convert %s -depth 8 graya:-"):format(
      quote_shell(DYLD_LIBRARY_PATH),
      quote_shell(source_pathname))
  local handle = assert(io.popen(command))
  local source = handle:read "a"
  handle:close()
  assert(#source == W * H * 2)

  local p = 1
  for y = 0, H - 1 do
    for x = 0, W - 1 do
      local u, v = string.unpack("BB", source, p)
      result[q + 1] = u
      result[q + 2] = v
      p = p + 2
      q = q + 2
    end
  end
end

local H = H * #source_pathnames
assert(#result == W * H * 2)

local command = ("env DYLD_LIBRARY_PATH=%s convert -depth 8 -size %dx%d graya:- %s"):format(
    quote_shell(DYLD_LIBRARY_PATH),
    W,
    H,
    quote_shell(result_pathname))
local handle = assert(io.popen(command, "w"))
for _, v in ipairs(result) do
  handle:write(string.pack("B", v))
end
handle:close()

