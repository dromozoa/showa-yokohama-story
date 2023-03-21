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

local escape_html = require "escape_html"

local source_pathname, result_pathname = ...

local state = 1

local max_title = 0
local max_link = 0
local max_album_title = 0
local max_song_number = 0
local max_song_artist = 0
local max_song_title = 0

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
    local item1 = items[1]
    local item2 = items[2]
    local item3 = items[3]

    if state == 1 then
      handle_html:write '<div class="demeter-credits-paragraph">\n'
      state = 2
    end

    if item3 then
      handle_html:write '<div class="demeter-credits-line">\n'
      if item3:find "^http" then
        if item1 ~= "" then
          handle_html:write('<div class="demeter-credits-title">', escape_html(item1), "</div>\n")
          max_title = math.max(max_title, #item1)
        end
        assert(item2 ~= "")
        handle_html:write('<div class="demeter-credits-link"><a target="_blank" href="', escape_html(item3), '">', escape_html(item2), "</a></div>\n")
        max_link = math.max(#item2)
      else
        assert(item1 == "")
        if item2 ~= "" then
          handle_html:write('<div class="demeter-credits-album-title">', escape_html(item2), "</div>\n")
          max_album_title = math.max(max_album_title, #item2)
        end
        local number, artist, title = assert(item3:match "^(%d+) (.-)%s+%-%s+(.*)$")
        handle_html:write('<div class="demeter-credits-song-number">', number, "</div>\n")
        handle_html:write('<div class="demeter-credits-song-artist">', escape_html(artist), "</div>\n")
        handle_html:write('<div class="demeter-credits-song-title">', escape_html(title), "</div>\n")
        max_song_number = math.max(max_song_number, #number)
        max_song_artist = math.max(max_song_artist, #artist)
        max_song_title = math.max(max_song_artist, #title)
      end
      handle_html:write '</div>\n'
    elseif item2 then
      assert(item2:find "^http")
      handle_html:write('<div class="demeter-credits-text"><a target="_blank" href="', escape_html(item2), '">', escape_html(item1), "</a></div>\n")
    else
      handle_html:write('<div class="demeter-credits-text">', escape_html(item1), "</div>\n")
    end
  end
end
handle:close()

io.stderr:write(([[
title        %d
link         %d
album title  %d
song number  %d
song artist  %d
song title   %d
]]):format(max_title, max_link, max_album_title, max_song_number, max_song_artist, max_song_title))

