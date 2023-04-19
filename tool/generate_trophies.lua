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

local encode_base64 = require "encode_base64"
local quote_js = require "quote_js"

local source_pathname, result_pathname, script_pathname = ...

local trophies = {}
local handle = assert(io.open(source_pathname))
for line in handle:lines() do
  if line:find "^#" then
    -- 行コメント
  elseif line == "" then
    -- 空行
  else
    local items = {}
    for item in (line.."\t"):gmatch "(.-)\t" do
      items[#items + 1] = item
    end
    assert(#items == 4)
    trophies[#trophies + 1] = {
      key = items[1];
      year = items[2];
      name = items[3];
      description = items[4];
    }
  end
end
handle:close()

local handle = assert(io.open(result_pathname, "w"))
handle:write [[
<div class="demeter-credits-trophies1">
]]

-- barcodeは1文字1/3em
-- (21-1.5)*3=58.5文字まで
for i, trophy in ipairs(trophies) do
  handle:write(([[
<div class="demeter-credits-trophy demeter-credits-trophy-%s">
<div class="demter-credits-tryphe-title demeter-credits-trophy-title-locked"><span class="demeter-credits-trophy-icon las la-lock"></span><span class="demeter-credits-trophy-barcode">%s</span></div>
<div class="demter-credits-tryphe-title demeter-credits-trophy-title-unlocked"><span class="demeter-credits-trophy-icon las la-trophy"></span><span class="demeter-credits-trophy-name">%s</span></div>
<div class="demeter-credits-trophy-description">%s</div>
</div>
]]):format(trophy.key, encode_base64(trophy.name), trophy.name, trophy.description))

  if i == math.ceil(#trophies / 2) then
    handle:write '</div><div class="demeter-credits-trophies2">\n'
  end
end

handle:write [[
</div>
]]
handle:close()

local handle = assert(io.open(script_pathname, "w"))
handle:write(([[
/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.trophies) {
  return;
}

D.trophies = [
]]):format(#trophies))

for _, trophy in ipairs(trophies) do
  handle:write("{key:", quote_js(trophy.key), ",name:", quote_js(trophy.name), ",description:", quote_js(trophy.description), "},\n")
end

handle:write [[
];

})();
]]
handle:close()
