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

local source_pathname, result_pathname = ...
local handle_html = assert(io.open(result_pathname, "w"))
local handle = assert(io.open(source_pathname))

local state = 1
local count = 0
local prev = ""
for line in handle:lines() do
  if line:find "^#" then
    -- 行コメント
  elseif line == "" then
    -- 段落区切り
    if state == 2 then
      handle_html:write "</div>\n"
      state = 1
    end
  elseif line == [[\\]] then
    -- 空行
    handle_html:write '<div class="demeter-credits-line"></div>\n'
  elseif line:find [[\$]] then
    -- 継続行
    prev = prev .. line:gsub([[\$]], "")
  else
    local line = prev .. line
    prev = ""

    if state == 1 then
      handle_html:write '<div class="demeter-credits-paragraph">\n'
      count = count + 1
      state = 2
    end

    -- Markdown風リンク: [text](href)
    line = line:gsub("%[(.-)%]%((.-)%)", '<a target="_blank" rel="noopener noreferrer" href="%2">%1</a>')

    local items = {}
    for item in (line.."\t"):gmatch "(.-)\t" do
      items[#items + 1] = item
    end

    handle_html:write('<div class="demeter-credits-text demeter-credits-text', #items, '">\n')
    for i, item in ipairs(items) do
      handle_html:write('<div class="demeter-credits-item demeter-credits-item', i, '">', item, "</div>\n");
    end
    handle_html:write "</div>\n"
  end
end
handle_html:write(([[
<style>
:root {
  --credits-count: %d;
}
</style>
]]):format(count))
handle:close()
handle_html:close()
