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

local basename = require "basename"
local dirname = require "dirname"
local quote_js = require "quote_js"

assert(basename "usr" == "usr")
assert(basename "usr/" == "usr")
assert(basename "" == ".")
assert(basename "/" == "/")
assert(basename "//" == "/")
assert(basename "///" == "/")
assert(basename "/usr/" == "usr")
assert(basename "/usr/lib" == "lib")
assert(basename "//usr//lib//" == "lib")
assert(basename "/home//dwc//test" == "test")

assert(dirname "usr" == ".")
assert(dirname "usr/" == ".")
assert(dirname "" == ".")
assert(dirname "/" == "/")
assert(dirname "//" == "/")
assert(dirname "///" == "/")
assert(dirname "/usr/" == "/")
assert(dirname "/usr/lib" == "/usr")
assert(dirname "//usr//lib//" == "//usr")
assert(dirname "/home//dwc//test" == "/home//dwc")

assert(quote_js "\0\1\2\3\4\5\6\7\8\9\10\11\12\13\14\15\127" == [["\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000B\f\r\u000E\u000F\u007F"]])
assert(quote_js [["'/\]] == [["\"'/\\"]])
assert(quote_js "\226\128\168\226\128\169" == [["\u2028\u2029"]])
assert(quote_js "昭和横濱物語" == [["昭和横濱物語"]])
