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
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

local quote_js = require "quote_js"

local source_pathname, result_pathname, music_dir, voice_dir, effect_dir = ...

local handle = assert(io.open(source_pathname))
local result = handle:read "a":gsub("\nD%.preferences = {[^}]*};\n", ([[

D.preferences = {
  musicDir: %s,
  voiceDir: %s,
  effectDir: %s,
};
]]):format(quote_js(music_dir), quote_js(voice_dir), quote_js(effect_dir)))
handle:close()

local handle = assert(io.open(result_pathname, "w"))
handle:write(result)
handle:close()
