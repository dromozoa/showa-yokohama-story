-- Copyright (C) 2023 Tomoyuki Fujimori <moyu@dromozoa.com>
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

local escape_html = require "escape_html"

local source_pathname, result_pathname = ...

local state = 1

local handle_html = assert(io.open(result_pathname, "w"))
local handle = assert(io.open(source_pathname))
for line in handle:lines() do
  if line:find "^#" then
    -- 行コメント
  elseif line == "" then
    -- 段落区切り
    if state == 2 then
      handle_html:write "</div>\n"
      state = 1
    end
  else
    local items = {}
    for item in (line.."\t"):gmatch "(.-)\t" do
      items[#items + 1] = item
    end
    assert(#items == 3)
    local item1 = items[1]
    local item2 = items[2]
    local item3 = items[3]

    if state == 1 then
      handle_html:write '<div class="demeter-credits-paragraph">\n'
      state = 2
    end

    handle_html:write '  <div class="demeter-credits-line">\n'
    if item3:find "^http" then
      if item1 ~= "" then
        handle_html:write('    <div class="demeter-credits-title">', escape_html(item1), "</div>\n")
      end
      assert(item2 ~= "")
      handle_html:write('    <div class="demeter-credits-link"><a href="', escape_html(item3), '">', escape_html(item2), "</a></div>\n")
    else
      assert(item1 == "")
      if item2 ~= "" then
        handle_html:write('    <div class="demeter-credits-album-title">', escape_html(item2), "</div>\n")
      end
      local number, artist, title = assert(item3:match "^(%d+) (.-)%s+%-%s+(.*)$")
      handle_html:write('    <div class="demeter-credits-song-number">', number, "</div>\n")
      handle_html:write('    <div class="demeter-credits-song-artist">', escape_html(artist), "</div>\n")
      handle_html:write('    <div class="demeter-credits-song-title">', escape_html(title), "</div>\n")
    end
    handle_html:write '  </div>\n'
  end
end
handle:close()

