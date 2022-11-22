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

-- Requirements for Japanese Text Layoutの表を変換する。
-- https://www.w3.org/TR/jlreq/
-- https://github.com/w3c/jlreq
--
-- ルビのはみ出しで使うのは cl-01,02,05,06,07,08,10,11,15,16,19
-- 漢字等 (cl-19) は "CJK Ideographic" 以外が列挙されている。
-- CJK Ideographicは定義がわからないのでブロックを使う。
--
-- https://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt
--   3400..4DBF; CJK Unified Ideographs Extension A
--   4E00..9FFF; CJK Unified Ideographs
--   F900..FAFF; CJK Compatibility Ideographs
--   20000..2A6DF; CJK Unified Ideographs Extension B
--   2A700..2B73F; CJK Unified Ideographs Extension C
--   2B740..2B81F; CJK Unified Ideographs Extension D
--   2B820..2CEAF; CJK Unified Ideographs Extension E
--   2CEB0..2EBEF; CJK Unified Ideographs Extension F
--   2F800..2FA1F; CJK Compatibility Ideographs Supplement
--   30000..3134F; CJK Unified Ideographs Extension G
--   31350..323AF; CJK Unified Ideographs Extension H
--
-- https://www.unicode.org/Public/UCD/latest/ucd/Scripts.txt
--   2E80..2E99    ; Han # So  [26] CJK RADICAL REPEAT..CJK RADICAL RAP
--   2E9B..2EF3    ; Han # So  [89] CJK RADICAL CHOKE..CJK RADICAL C-SIMPLIFIED TURTLE
--   2F00..2FD5    ; Han # So [214] KANGXI RADICAL ONE..KANGXI RADICAL FLUTE
--   3005          ; Han # Lm       IDEOGRAPHIC ITERATION MARK
--   3007          ; Han # Nl       IDEOGRAPHIC NUMBER ZERO
--   3021..3029    ; Han # Nl   [9] HANGZHOU NUMERAL ONE..HANGZHOU NUMERAL NINE
--   3038..303A    ; Han # Nl   [3] HANGZHOU NUMERAL TEN..HANGZHOU NUMERAL THIRTY
--   303B          ; Han # Lm       VERTICAL IDEOGRAPHIC ITERATION MARK
--   3400..4DBF    ; Han # Lo [6592] CJK UNIFIED IDEOGRAPH-3400..CJK UNIFIED IDEOGRAPH-4DBF
--   4E00..9FFF    ; Han # Lo [20992] CJK UNIFIED IDEOGRAPH-4E00..CJK UNIFIED IDEOGRAPH-9FFF
--   F900..FA6D    ; Han # Lo [366] CJK COMPATIBILITY IDEOGRAPH-F900..CJK COMPATIBILITY IDEOGRAPH-FA6D
--   FA70..FAD9    ; Han # Lo [106] CJK COMPATIBILITY IDEOGRAPH-FA70..CJK COMPATIBILITY IDEOGRAPH-FAD9
--   16FE2         ; Han # Po       OLD CHINESE HOOK MARK
--   16FE3         ; Han # Lm       OLD CHINESE ITERATION MARK
--   16FF0..16FF1  ; Han # Mc   [2] VIETNAMESE ALTERNATE READING MARK CA..VIETNAMESE ALTERNATE READING MARK NHAY
--   20000..2A6DF  ; Han # Lo [42720] CJK UNIFIED IDEOGRAPH-20000..CJK UNIFIED IDEOGRAPH-2A6DF
--   2A700..2B739  ; Han # Lo [4154] CJK UNIFIED IDEOGRAPH-2A700..CJK UNIFIED IDEOGRAPH-2B739
--   2B740..2B81D  ; Han # Lo [222] CJK UNIFIED IDEOGRAPH-2B740..CJK UNIFIED IDEOGRAPH-2B81D
--   2B820..2CEA1  ; Han # Lo [5762] CJK UNIFIED IDEOGRAPH-2B820..CJK UNIFIED IDEOGRAPH-2CEA1
--   2CEB0..2EBE0  ; Han # Lo [7473] CJK UNIFIED IDEOGRAPH-2CEB0..CJK UNIFIED IDEOGRAPH-2EBE0
--   2F800..2FA1D  ; Han # Lo [542] CJK COMPATIBILITY IDEOGRAPH-2F800..CJK COMPATIBILITY IDEOGRAPH-2FA1D
--   30000..3134A  ; Han # Lo [4939] CJK UNIFIED IDEOGRAPH-30000..CJK UNIFIED IDEOGRAPH-3134A
--   31350..323AF  ; Han # Lo [4192] CJK UNIFIED IDEOGRAPH-31350..CJK UNIFIED IDEOGRAPH-323AF

local ids_for_ruby = {}
for _, id in ipairs { 1, 2, 5, 6, 7, 8, 10, 11, 15, 16, 19 } do
  ids_for_ruby[id] = true
end

-- Unicode 15のUCDから引用
local cjk_ideographs = [[
3400..4DBF; CJK Unified Ideographs Extension A
4E00..9FFF; CJK Unified Ideographs
F900..FAFF; CJK Compatibility Ideographs
20000..2A6DF; CJK Unified Ideographs Extension B
2A700..2B73F; CJK Unified Ideographs Extension C
2B740..2B81F; CJK Unified Ideographs Extension D
2B820..2CEAF; CJK Unified Ideographs Extension E
2CEB0..2EBEF; CJK Unified Ideographs Extension F
2F800..2FA1F; CJK Compatibility Ideographs Supplement
30000..3134F; CJK Unified Ideographs Extension G
31350..323AF; CJK Unified Ideographs Extension H
]]

local source_filename, result_filename = ...

local handle = assert(io.open(source_filename))
local source = handle:read "*a"
handle:close()

local dataset = {}

for id, s in source:gmatch [[<section>%s*<h3 id="cl%-(%d+)">.-</h3>(.-)</section>]] do
  local t = s:match [[<table class="charclass">(.-)</table>]]
  if t then
    local id = assert(tonumber(id))
    local data = {}
    for code in t:gmatch [[<tr>%s*<td class="character">.-</td>%s*<td>(.-)</td>]] do
      if code:find [[^%x%x%x%x$]] then
        -- cl-19で216Bが重複しているのを避ける
        local code = assert(tonumber(code, 16))
        if not data[code] then
          data[code] = true
          data[#data + 1] = code
        end
      else
        assert(code:find [[^&lt;%x%x%x%x, %x%x%x%x&gt;$]])
        -- 結合文字は無視する
      end
    end
    dataset[id] = data
  end
end

local dataset_for_ruby = {}

for id, data in pairs(dataset) do
  if ids_for_ruby[id] then
    for _, code in ipairs(data) do
      assert(not dataset_for_ruby[code])
      dataset_for_ruby[code] = id
    end
  end
end

-- cl-19に漢字を追加する
for a, b in cjk_ideographs:gmatch [[(%x+)%.%.(%x+); CJK]] do
  local a = assert(tonumber(a, 16))
  local b = assert(tonumber(b, 16))
  assert(a <= b)
  for code = a, b do
    dataset_for_ruby[code] = 19
  end
end

local range
local ranges = {}

for code = 0, 0x10FFFF do
  local id = dataset_for_ruby[code] or 0
  if range and range.j == code - 1 and range.id == id then
    range.j = code
  else
    range = {
      i = code;
      j = code;
      id = id;
    }
    ranges[#ranges + 1] = range
  end
end

local function construct(data)
  if #data == 1 then
    return data[1]
  else
    local n = math.floor(#data * 0.5)
    local a = construct { table.unpack(data, 1, n) }
    local b = construct { table.unpack(data, n + 1) }
    return {
      i = a.i;
      j = b.j;
      a, b;
    }
  end
end

local handle = assert(io.open(result_filename, "w"))

handle:write [[
(() => {
"use strict";

if (globalThis.dromozoa_jlreq) {
  return;
}

const root = globalThis.dromozoa_jlreq = {};
root.character_class = c => {
]]

local tree = construct(ranges)

local function code(node, depth)
  -- local indent = ("  "):rep(depth)
  -- depth = depth + 1
  local indent = ""

  if #node == 2 then
    local a = node[1]
    local b = node[2]

    if #a == 0 or #b == 0 then
      if #a == 0 and #b == 0 then
        handle:write(indent, ("return c<%d?%d:%d;\n"):format(b.i, a.id, b.id));
      else
        assert(#a == 0 and #b == 2)
        local c = b[1]
        local d = b[2]
        handle:write(indent, ("return c<%d?%d:c<%d?%d:%d;\n"):format(b.i, a.id, d.i, c.id, d.id))

      end
    else
      handle:write(indent, ("if(c<%d){\n"):format(b.i))
      code(a, depth)
      handle:write(indent, "}else{\n")
      code(b, depth)
      handle:write(indent, "}\n")
    end
  else
    handle:write(indent, "return ", node.id, ";\n")
  end
end
code(tree, 1)

handle:write [[
};
]]

if false then
  handle:write [[

const test_character_class_data = [
]];
  for _, range in ipairs(ranges) do
    handle:write(([[
  { i: 0x%04X, j: 0x%04X, id: %d },
]]):format(range.i, range.j, range.id))
  end

  handle:write [[
];
root.test_character_class = () => {
  console.log("start");
  let n = 0;
  test_character_class_data.forEach(range => {
    const i = range.i;
    const j = range.j;
    const id = range.id;
    for (let code = i; code <= j; ++code) {
      if (root.character_class(code) !== id) {
        throw new Error("code " + code + " id " + id);
      }
      ++n;
    }
  });
  console.log("end", n);
};
]]
end

handle:write [[

})();
]]

handle:close()

for code = 0, 0x10FFFF do
  local id = dataset_for_ruby[code] or 0
  if range and range.j == code - 1 and range.id == id then
    range.j = code
  else
    range = {
      i = code;
      j = code;
      id = id;
    }
    ranges[#ranges + 1] = range
  end
end


