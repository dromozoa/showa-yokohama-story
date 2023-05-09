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

assert(W == 2^math.floor(math.log(W) / math.log(2)))
assert(H == 2^math.floor(math.log(H) / math.log(2)))
assert(#source_pathnames <= 16)

local result = {}

for Y = 0, 3 do
  for X = 0, 3 do
    local source_pathname = source_pathnames[Y * 4 + X + 1]
    if source_pathname then
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
          p = p + 2
          local q = ((Y * H + y) * (4 * W) + (X * W + x)) * 2
          result[q + 1] = u
          result[q + 2] = v
        end
      end
    end
  end
end

local W = W * 4
local H = H * 4

local command = ("env DYLD_LIBRARY_PATH=%s convert -depth 8 -size %dx%d graya:- %s"):format(
    quote_shell(DYLD_LIBRARY_PATH),
    W, H,
    quote_shell(result_pathname))
local handle = assert(io.popen(command, "w"))
local p = 0
for y = 1, H do
  for x = 1, W do
    local u = result[p + 1] or 0
    local v = result[p + 2] or 0
    p = p + 2
    handle:write(string.pack("BB", u, v))
  end
end
handle:close()

