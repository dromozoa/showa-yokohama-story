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

local DYLD_LIBRARY_PATH, source_pathname, result_pathname = ...
local command = ("env DYLD_LIBRARY_PATH=%s convert %s json:-"):format(
    quote_shell(DYLD_LIBRARY_PATH),
    quote_shell(source_pathname))
local handle = assert(io.popen(command))
local source = parse_json(handle:read "a")
handle:close()

local W = source[1].image.geometry.width
local H = source[1].image.geometry.height

local command = ("env DYLD_LIBRARY_PATH=%s convert %s -depth 8 graya:-"):format(
    quote_shell(DYLD_LIBRARY_PATH),
    quote_shell(source_pathname))
local handle = assert(io.popen(command))
local data = handle:read "a"
handle:close()
assert(#data == W * H * 2)

local command = ("env DYLD_LIBRARY_PATH=%s convert -depth 8 -size %dx%d graya:- %s"):format(
    quote_shell(DYLD_LIBRARY_PATH),
    W, H,
    quote_shell(result_pathname))
local handle = assert(io.popen(command, "w"))
local p = 1
for y = 1, H do
  for x = 1, W do
    local y, a = string.unpack("BB", data, p)
    p = p + 2
    handle:write(string.pack("BB", 0, math.floor(y * a / 255 + 0.5)))
  end
end
handle:close()
