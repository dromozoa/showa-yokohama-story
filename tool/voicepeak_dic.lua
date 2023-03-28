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

local parse_json = require "parse_json"
local write_json = require "write_json"

--[[

Voicepeakの設定フォルダ
  ~/Library/Application Support/Dreamtonics/Voicepeak/settings

Voicepeakの辞書ファイル
  dict.json  主となるファイル
  user.csv   辞書UIを閉じるときに更新される
  user.dic   辞書UIを閉じるときに更新される

Voicepeakが出力するdict.jsonでは、日本語の文字などはUnicodeエスケープされる。た
だし、Voicepeakへの入力としてはUnicodeエスケープされている必要はないらしい。ま
た、VPPファイルと異なり、JSONとして妥当であれば読みこんでくれるようだ。

[accentType]
i番めの音節にアクセントが来る（その音節のあとにピッチが下がる）ことを示す。なお、
n音節からなる発音について、i=0とi=nの場合はアクセントなしを示す（i=0とi=nは等価
と思われる。辞書UIの都合でi=nが出現しているのではないか）。

「ハツオン」というn=4の発音についての例

     ハツオン(は)
      1 2 3 4

  0  ＿￣￣￣￣

  1  ￣＿＿＿＿

  2  ＿￣＿＿＿

  3  ＿￣￣＿＿

  4  ＿￣￣￣＿

  5  ＿￣￣￣￣

[pos]
品詞の一覧
  普通名詞        Japanese_Futsuu_meishi
  固有名詞:一般   Japanese_Koyuumeishi_ippan
  固有名詞:人名   Japanese_Koyuumeishi_jinmei
  固有名詞:姓     Japanese_Koyuumeishi_sei
  固有名詞:名     Japanese_Koyuumeishi_mei
  固有名詞:地域   Japanese_Koyuumeishi_place

[priority]
優先度は1以上10以下の整数

]]

local source_pathname, result_pathname = ...

local handle = assert(io.open(source_pathname))
local source = handle:read "a"
handle:close()

local dictionary = parse_json(source)
table.sort(dictionary, function (a, b)
  -- 優先度がおなじなら発音順
  if a.priority == b.priority then
    return a.pron < b.pron
  else
    -- 優先度が高いほうが先
    return a.priority > b.priority
  end
end)

local handle = assert(io.open(result_pathname, "w"))
local keys = { "sur", "pron", "pos", "priority", "accentType", "lang" }

handle:write "[\n"
for i, entry in ipairs(dictionary) do
  handle:write "  {\n"
  for j, key in ipairs(keys) do
    handle:write "    "
    write_json(handle, key)
    handle:write ": "
    write_json(handle, entry[key])
    if j < #keys then
      handle:write ","
    end
    handle:write "\n"
  end
  handle:write "  }"
  if i < #dictionary then
    handle:write ","
  end
  handle:write "\n"
end
handle:write "]\n"
