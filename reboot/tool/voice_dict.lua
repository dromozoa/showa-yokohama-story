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

local json = require "cjson"

--[[

  VoicePeakの設定フォルダ
    ~/Library/Application Support/Dreamtonics/Voicepeak/settings

  VoicePeakの辞書ファイル
    dict.json  主となるファイル
    user.csv   辞書UIを閉じるときに更新される
    user.dic   辞書UIを閉じるときに更新される

  accentTypeはi番めの音節にアクセントが来る（その音節のあとにピッチが下がる）こ
  とを示す。なお、n音節からなる発音について、i=0とi=nの場合はアクセントなしを示
  す（i=0とi=nは等価と思われる。辞書UIの都合でi=nが出現しているのではないか）。


  「ハツオン」というn=4の発音についての例

       ハツオン(は)
        1 2 3 4

    0  ＿￣￣￣￣

    1  ￣＿＿＿＿

    2  ＿￣＿＿＿

    3  ＿￣￣＿＿

    4  ＿￣￣￣＿

    5  ＿￣￣￣￣

]]

local source_pathname, result_pathname = ...

local handle = assert(io.open(source_pathname))
local source = handle:read "a"
handle:close()

local dictionary = json.decode(source)
for i, entry in ipairs(dictionary) do
  local t = math.floor(entry.accentType)
  print(t, entry.sur, entry.pron, entry.pos, entry.lang)
end

--[[

  {
    "sur": "\u5bfe\u54ac\u6226\u95d8\u670d",
    "pron": "\u30bf\u30a4\u30b3\u30a6\u30bb\u30f3\u30c8\u30a6\u30d5\u30af",
    "pos": "Japanese_Futsuu_meishi",
    "priority": 5,
    "accentType": 8,
    "lang": "ja"
  },

]]


