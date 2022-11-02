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

--[[
用語集
  行      line
  段落    paragraph
  ルビ    ruby
  音声    voice
  話者    spaker
  注釈    annotation

-- 1個以上の空行が段落を分ける
-- 遷移の単位は段落とする。
-- 選択肢は次の遷移先を設定する
-- 各種のログはタイミングをどこかで考える必要がある。
]]

local function trim(s, b)
  if b == "{}" then
    return (s:gsub("^{%s*", ""):gsub("%s*}$", ""))
  else
    return (s:gsub("^%s+", ""):gsub("%s+$", ""))
  end
end

local function update(t, k, v)
  assert(k ~= nil)
  assert(v ~= nil)
  if not t then
    t = {}
  end
  t[k] = v
  return t
end

local function append(t, v)
  assert(v ~= nil)
  if not t then
    t = {}
  end
  t[#t + 1] = v
  return t
end

return function (buffer)
  buffer = buffer.."\n\n"

  local position = 1
  local _1
  local _2
  local _3
  local _4

  local function match(pattern)
    local i, j, a, b, c, d = buffer:find(pattern, position)
    if i then
      position = j + 1
      _1 = a
      _2 = b
      _3 = c
      _4 = d
      return true
    else
      return false
    end
  end

  local scenario
  local paragraph
  local line

  while position <= #buffer do
    if match "^#([^\r\n]*)" then
      -- # 話者
      paragraph = update(paragraph, "speaker", trim(_1))

    elseif match "^@#([^\r\n]*)" then
      -- @# 行コメント

    elseif match '^@"{(.-)}"' then
      -- @"{<生文字列>}"
      line = append(line, _1)

    elseif match "^@r{([^}]*)}{([^}]*)}{([^}]*)}" then
      -- @r{親文字}{ルビ}{発音}
      line = append(line, {
        base = trim(_1);
        ruby = trim(_2);
        voice = trim(_3);
      })

    elseif match "^@r{([^}]*)}{([^}]*)}" then
      -- @r{親文字}{ルビ}
      local ruby = trim(_2)
      line = append(line, {
        base = trim(_1);
        ruby = ruby;
        voice = ruby;
      })

    elseif match "^@v{([^}]*)}{([^}]*)}" then
      -- @v{親文字}{発音}
      line = append(line, {
        base = trim(_1);
        voice = trim(_2);
      })

    elseif match "^@label{([^}]*)}" then
      -- @label{ラベル}
      paragraph = update(paragraph, "label", trim(_1))

    elseif match "^\r\n?[\t\v\f ]*\r\n?%s*" or match "^\n\r?[\t\v\f ]*\n\r?%s*" then
      -- 空行で段落を分ける。
      if line then
        paragraph = append(paragraph, line)
        line = nil
      end
      if paragraph then
        scenario = append(scenario, paragraph)
        paragraph = nil
      end

    elseif match "^\r\n?" or match "^\n\r?" then
      -- 改行で行を分ける。
      if line then
        paragraph = append(paragraph, line)
        line = nil
      end

    elseif match "^([^@#\r\n]+)" then
      -- テキスト
      line = append(line, _1)

    else
      error("unknown text: "..buffer:sub(position))
    end
  end

  return scenario
end
