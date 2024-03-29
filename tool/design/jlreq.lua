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

-- Requirements for Japanese Text Layoutの表を変換する。
-- https://www.w3.org/TR/jlreq/
-- https://github.com/w3c/jlreq
--
-- 行頭禁則で使うのは cl-02,03,04,05,06,07,09,10,11,29
-- 行末禁則で使うのは cl-01,28
-- ルビのはみ出しで使うのは cl-01,02,05,06,07,08,10,11,15,16,19

-- 漢字等 (cl-19) は "CJK Ideographs" 以外が列挙されている。定義がよくわからな
-- いので。UnicodeのCJK Unified / Compatibility Ideographsを採用する。

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

-- Unicode 15.0.0のUCDから引用
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

local rules = {
  -- ルビはcl-19以外にはみ出すことができる。アキの調整のかわりに、プロポーショ
  -- ナルフォントを使うため、はみ出し量を詳細に計算しない。
  {
    name = "canRubyOverhang";
    1, 2, 5, 6, 7, 8, 10, 11, 15, 16;
  };

  {
    name = "isLineStartProhibited";
    2, 3, 4, 5, 6, 7, 9, 10, 11, 29;
  };

  {
    name = "isLineEndProhibited";
    1, 28;
  };

  {
    name = "isPrefixedAbbreviation";
    12;
  };

  {
    name = "isPostfixedAbbreviation";
    13;
  };

  {
    name = "isWesternCharacter";
    27;
  };

  {
    name = "isInseparable";
    1, 2, 3, 4, 5, 6, 7;
  };
}

local can_ruby_overhang_ids = { 1, 2, 5, 6, 7, 8, 10, 11, 15, 16 }

local source_filename, result_filename = ...
local options = {}
for i = 3, #arg do
  options[arg[i]] = true
end

local handle = assert(io.open(source_filename))
local source = handle:read "*a"
handle:close()

local dataset = {}
for id, s in source:gmatch [[<section>%s*<h3 id="cl%-(%d+)">.-</h3>(.-)</section>]] do
  local t = s:match [[<table class="charclass">(.-)</table>]]
  if t then
    local id = assert(tonumber(id))
    local data = {}
    for code in t:gmatch [[<tr>%s*<td class="character.-</td>%s*<td>(.-)</td>]] do
      if code:find [[^%x%x%x%x$]] then
        -- cl-19でU+216Bが重複しているのを避ける
        local code = assert(tonumber(code, 16))
        if not data[code] then
          data[code] = true
        else
          io.write(("duplicate cl-%02d entry: U+%X\n"):format(id, code))
        end
      else
        assert(code:find [[^&lt;%x%x%x%x, %x%x%x%x&gt;$]])
        -- 結合文字は無視する
      end
    end
    dataset[id] = data
  end
end

-- cl-19にCJK Unified / Compatibility Ideographsを追加する
local data = dataset[19]
for a, b in cjk_ideographs:gmatch [[(%x+)%.%.(%x+); CJK]] do
  local a = assert(tonumber(a, 16))
  local b = assert(tonumber(b, 16))
  assert(a <= b)
  for code = a, b do
    -- U+4EDDが重複するのを避ける
    if not data[code] then
      data[code] = true
    else
      io.write(("duplicate cl-19 entry: U+%X\n"):format(code))
    end
  end
end

local function make_ranges(rule)
  local data = {}
  for _, id in ipairs(rule) do
    for code in pairs(dataset[id]) do
      if not data[code] then
        data[code] = { id }
      else
        local classes = data[code]
        classes[#classes + 1] = id
        io.write(("duplicate cl-%s entry of %s: U+%X\n"):format(table.concat(classes, ","), rule.name, code))
      end
    end
  end

  local ranges = {}
  local range

  for code = 0, 0x10FFFF do
    local v = not not data[code]
    if range and range.j == code - 1 and range.v == v then
      range.j = code
    else
      range = {
        i = code;
        j = code;
        v = v;
      }
      ranges[#ranges + 1] = range
    end
  end

  return ranges
end

local function make_tree(ranges)
  if #ranges == 1 then
    return ranges[1]
  else
    local n = math.floor(#ranges * 0.5)
    local a = make_tree { table.unpack(ranges, 1, n) }
    local b = make_tree { table.unpack(ranges, n + 1) }
    return {
      i = a.i;
      j = b.j;
      a, b;
    }
  end
end

local function generate_code(handle, node, depth)
  local indent = ""
  if options.enable_indent then
    indent = ("  "):rep(depth)
  end
  depth = depth + 1
  local sp = ""
  if options.enable_space then
    sp = " "
  end

  if #node == 2 then
    local a = node[1]
    local b = node[2]

    if #a == 0 or #b == 0 then
      if #a == 0 and #b == 0 then
        -- (a.v, b.v) = (true, false) or (false, true)
        assert(a.v ~= b.v)
        assert(a.j == b.i - 1)
        if a.v then
          handle:write(indent, "return c", sp, "<", sp, b.i, ";\n")
        else
          handle:write(indent, "return c", sp, ">", sp, a.j, ";\n")
        end
      else
        assert(#a == 0 and #b == 2)
        local c = b[1]
        local d = b[2]
        -- (a.v, c.v, d.v) = (true, false, true) or (false, true, false)
        assert(a.v ~= c.v and c.v ~= d.v)
        if a.v then
          handle:write(indent, "return c", sp, "<", sp, b.i, sp, "||", sp, "c", sp, ">", sp, c.j, ";\n")
        else
          handle:write(indent, "return c", sp, ">", sp, a.j, sp, "&&", sp, "c", sp, "<", sp, d.i, ";\n")
        end
      end
    else
      handle:write(indent, "if", sp, "(c", sp, "<", sp, b.i, ")", sp, "{\n")
      generate_code(handle, a, depth)
      handle:write(indent, "}", sp, "else", sp, "{\n")
      generate_code(handle, b, depth)
      handle:write(indent, "}\n")
    end
  else
    handle:write(indent, "return ", tostring(node.v), ";\n")
  end
end

local function generate_test(handle, ranges, name)
  handle:write [[
  const ranges = [
]]
  for _, range in ipairs(ranges) do
    handle:write(("    { i: 0x%04X, j: 0x%04X, v: %s },\n"):format(range.i, range.j, range.v))
  end
  handle:write(([[
  ];
  console.log("start");
  let n = 0;
  ranges.forEach(range => {
    for (let code = range.i; code <= range.j; ++code) {
      const v = D.jlreq.%s(code)
      console.assert(v === range.v, range, code, v);
      ++n;
    }
  });
  console.log(n);
  console.assert(n === 0x110000, ranges);
  console.log("end");
]]):format(name));
end

-- for _, rule in ipairs(rules) do
--   rule.ranges = make_ranges(rule)
--   rule.tree = make_tree(rule.ranges)
-- end

-- local can_ruby_overhang_ranges = make_ranges(can_ruby_overhang_ids)
-- local can_ruby_overhang_tree = make_tree(can_ruby_overhang_ranges)

local handle = assert(io.open(result_filename, "w"))

handle:write [[
/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.jlreq) {
  return;
}
D.jlreq = {};
]]

for _, rule in ipairs(rules) do
  local ranges = make_ranges(rule)
  local tree = make_tree(ranges)

  handle:write(("\nD.jlreq.%s = c => {\n"):format(rule.name))
  generate_code(handle, tree, 1)
  handle:write "};\n"

  if options.enable_test then
    local name = rule.name:gsub("^(.)", function (s) return "test"..s:upper() end)
    handle:write(("\nD.jlreq.%s = () => {\n"):format(name))
    generate_test(handle, ranges, rule.name)
    handle:write "};\n"
  end
end

handle:write [[

})();
]]

handle:close()

if options.check_relation then
  -- ダッシュ     U+2014
  -- 三点リーダ   U+2026
  -- 二点リーダ   U+2025
  -- アラビア数字 U+30-39
  -- 前置省略文字 cl-12
  -- 後置省略文字 cl-13
  -- 欧文用文字   cl-27

  local function check(code, name)
    if dataset[27][code] then
      io.write(("cl-27 contains entry: U+%X (%s)\n"):format(code, name))
      return 1
    end
    return 0
  end

  check(0x2014, "ダッシュ")
  check(0x2026, "三点リーダ")
  check(0x2025, "二点リーダ")

  local m = 0
  local n = 0
  for code in pairs(dataset[8]) do
    m = m + 1
    n = n + check(code, "分離禁止文字")
  end
  io.write(("%d / %d\n"):format(n, m))

  m = 0
  n = 0
  for code = 0x30, 0x39 do
    m = m + 1
    n = n + check(code, "アラビア数字")
  end
  io.write(("%d / %d\n"):format(n, m))

  m = 0
  n = 0
  for code in pairs(dataset[12]) do
    m = m + 1
    n = n + check(code, "前置省略文字")
  end
  io.write(("%d / %d\n"):format(n, m))

  m = 0
  n = 0
  for code in pairs(dataset[13]) do
    m = m + 1
    n = n + check(code, "後置省略文字")
  end
  io.write(("%d / %d\n"):format(n, m))
end
