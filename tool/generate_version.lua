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

local versions_pathname, version_pathname, preferences_pathname, makefile_pathname = ...

local header
local versions = {}
for line in io.lines(versions_pathname) do
  if line:find "^#" then
    -- 行コメント
  elseif line == "" then
    -- 空行
  else
    local items = {}
    for item in (line.."\t"):gmatch "(.-)\t" do
      items[#items + 1] = item
    end
    if not header then
      header = items
    else
      for i, v in ipairs(items) do
        items[header[i]] = v
      end
      versions[#versions + 1] = items
    end
  end
end
local version = versions[#versions]

local handle = assert(io.open(version_pathname, "w"))
handle:write(([[
{"web":%s,"system":%d,"music":%d,"voice":%d}
]]):format(quote_js(version.web), version.system, version.music, version.voice))
handle:close()

local handle = assert(io.open(preferences_pathname))
-- const version = { web:"b4", system:2, music:1, voice:1 };
local result = handle:read "a":gsub("\nconst version = {[^\n;]*};\n", ([[

const version = { web: %s, system: %d, music: %d, voice: %d };
]]):format(quote_js(version.web), version.system, version.music, version.voice))
handle:close()

local handle = assert(io.open(preferences_pathname, "w"))
handle:write(result)
handle:close()

local handle = assert(io.open(makefile_pathname, "w"))
handle:write(([[
version_web = %s
version_system = %d
version_music = %d
version_voice = %d
]]):format(version.web, version.system, version.music, version.voice))
handle:close()
