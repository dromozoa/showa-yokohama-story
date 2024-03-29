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

local basename = require "basename"
local dirname = require "dirname"
local speaker_definitions = require "speaker_definitions"

--[[

用語の整理
  話者    spaker
  親文字  base
  ルビ    ruby
  音声    voice
  物理行  text（LINE FEEDで明示的に指定された行）
  論理行  line（組版結果の行）
  段落    paragraph
  注釈    annotation

]]

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

local function update(t, k, v)
  assert(k ~= nil)
  assert(v ~= nil)
  if not t then
    t = {}
  end
  assert(not t[k])
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

local function append_jump(paragraph, jump)
  if not paragraph then
    paragraph = {}
  end
  paragraph.jumps = append(paragraph.jumps, jump)
  if jump.choice then
    paragraph.choice_jumps = append(paragraph.choice_jumps, jump)
  elseif jump.when then
    paragraph.when_jumps = append(paragraph.when_jumps, jump)
  else
    assert(not paragraph.jump)
    paragraph.jump = jump
  end
  return paragraph
end

local function append_paragraph(scenario, paragraph)
  scenario[#scenario + 1] = paragraph
  return scenario
end

local function parse(scenario, include_path, filename)
  local handle, message = io.open(include_path.."/"..filename)
  if not handle then
    error("cannot open "..message)
  end
  local source = handle:read "a" .. "\n\n"
  handle:close()

  local line = 1
  local position = 1
  local _1
  local _2
  local _3

  local function match(pattern)
    local i, j, a, b, c = source:find(pattern, position)
    if i then
      line = line + select(2, source:sub(position, j):gsub("\n", {}))
      position = j + 1
      _1 = a
      _2 = b
      _3 = c
      return true
    else
      return false
    end
  end

  local function parse_text(mode)
    local text

    local text_match = "^([^\r\n@]+)"
    if mode == "directive" then
      text_match = "^([^\r\n@}]+)"
    end

    while position <= #source do
      if match '^@"{(.-)}"' then
        -- @"{生文字列}"
        text = append(text, _1)

      elseif match "^@r{([^}]*)}{([^}]*)}{([^}]*)}" then
        -- @r{親文字}{ルビ}{発音}
        text = append(text, { trim(_1), ruby = trim(_2), voice = trim(_3) })

      elseif match "^@r{([^}]*)}{([^}]*)}" then
        -- @r{親文字}{ルビ}
        local v = trim(_2)
        text = append(text, { trim(_1), ruby = v, voice = v })

      elseif match "^@v{([^}]*)}{([^}]*)}" then
        -- @v{親文字}{発音}
        text = append(text, { trim(_1), voice = trim(_2) })

      elseif match "^\r\n?" or match "^\n\r?" then
        -- 改行で終端する。
        return text

      elseif mode == "directive" and match "^}" then
        -- 引数を終端する。
        return text

      elseif match(text_match) then
        -- テキスト
        text = append(text, _1)

      else
        error(filename..":"..line..":"..position..": parse error near '"..select(3, source:find("^([^\r\n]*)", position)).."'")
      end
    end

    return text
  end

  local paragraph
  local text

  while position <= #source do
    if match "^#([^\r\n]*)" then
      -- # 話者
      paragraph = update(paragraph, "speaker", trim(_1))

    elseif match "^@#([^\r\n]*)" then
      -- @# 行コメント

    elseif match "^@label{([^}]*)}" then
      -- @label{ラベル}
      paragraph = update(paragraph, "label", trim(_1))

    elseif match "^@label_root{([^}]*)}" then
      -- @label_root{ラベル}
      paragraph = update(paragraph, "label", trim(_1))
      paragraph.label_root = true

    elseif match "^@jump{([^}]*)}" then
      -- @jump{ラベル}
      paragraph = append_jump(paragraph, {
        label = trim(_1);
        file = filename;
        line = line;
      })

    elseif match "^@choice{" then
      -- @choice{選択肢}
      -- @choice{選択肢}{ラベル}
      -- @choice{選択肢}{ラベル}{バーコード}
      -- @choice{選択肢}{{文}}
      -- @choice{選択肢}{{文}}{ラベル}
      -- @choice{選択肢}{{文}}{ラベル}{バーコード}
      local choice = assert(parse_text "directive")
      local action
      local label
      local barcode
      if match "^{{(.-)}}" then
        action = trim(_1)
      end
      if match "^{([^}]*)}" then
        label = trim(_1)
        if match "^{([^}]*)}" then
          barcode = trim(_1)
        end
      else
        local buffer = {}
        for i, v in ipairs(choice) do
          if type(v) == "string" then
            buffer[i] = v
          else
            buffer[i] = v[1]
          end
        end
        label = trim(table.concat(buffer))
      end
      paragraph = append_jump(paragraph, {
        choice = choice;
        action = action;
        label = label;
        barcode = barcode;
        file = filename;
        line = line;
      })

    elseif match "^@include{([^}]*)}" then
      -- @include{ファイルパス}
      parse(scenario, include_path, trim(_1))

    elseif match "^@when{{(.-)}}{([^}]*)}" then
      -- @when{{式}}{ラベル}
      paragraph = append_jump(paragraph, {
        when = trim(_1);
        label = trim(_2);
        file = filename;
        line = line;
      })

    elseif match "^@enter{{(.-)}}" then
      -- @enter{{文}}
      paragraph = update(paragraph, "enter", trim(_1))
      paragraph = update(paragraph, "enter_info", {
        file = filename;
        line = line;
      })

    elseif match "^@leave{{(.-)}}" then
      -- @leave{{文}}
      paragraph = update(paragraph, "leave", trim(_1))
      paragraph = update(paragraph, "leave_info", {
        file = filename;
        line = line;
      })

    elseif match "^@start{([^}]*)}" then
      -- @start{キー}
      paragraph = update(paragraph, "start", trim(_1))

    elseif match "^@finish{([^}]*)}" then
      -- @finish
      paragraph = update(paragraph, "finish", trim(_1))

    elseif match "^@music{([^}]*)}" then
      -- @music{キー}
      -- 段落に音楽を割り当てる。
      paragraph = update(paragraph, "music", trim(_1))

    elseif match "^@place{([^}]*)}" then
      -- @place{場所}
      -- 段落に場所を割り当てる。
      paragraph = update(paragraph, "place", trim(_1))

    elseif match "^@background{([^}]*)}" then
      -- @background{背景}
      -- 背景を切り替えを割り当てる。
      paragraph = update(paragraph, "background", trim(_1))

    elseif match "^@system" then
      paragraph = update(paragraph, "system", true)

    elseif match "^@dialog{([^}]*)}" then
      -- @dialog{キー}
      -- システム用とする。
      paragraph = update(paragraph, "dialog", { dialog = trim(_1) })
      paragraph = update(paragraph, "system", true)

    elseif match "^@dialog_choice{([^}]*)}{([^}]*)}" then
      local dialog = assert(paragraph.dialog)
      local result = trim(_2)
      assert(result == "yes" or result == "no" or result == "ok" or result == "cancel")
      dialog.choices = append(dialog.choices, { choice = trim(_1), result = result })

    elseif match "^@debug" then
      update(scenario, "debug", true)

    elseif match "^\r\n?[\t\v\f ]*\r\n?%s*" or match "^\n\r?[\t\v\f ]*\n\r?%s*" then
      -- 空行で段落を分ける。
      if text then
        paragraph = append(paragraph, text)
        text = nil
      end
      if paragraph then
        scenario = append_paragraph(scenario, paragraph)
        paragraph = nil
      end

    else
      -- 改行まで読む。
      text = parse_text "paragraph"
      if text then
        paragraph = append(paragraph, text)
        text = nil
      end
      -- 空行で段落を分ける。
      if match "^[\t\v\f ]*\r\n?%s*" or match "^[\t\v\f ]*\n\r?%s*" then
        scenario = append_paragraph(scenario, paragraph)
        paragraph = nil
      end
    end
  end

  return scenario
end

local function check_error(scenario, message)
  if scenario.debug then
    io.stderr:write("[warn] ", message, "\n")
  else
    error(message)
  end
end

local function process_speakers(scenario)
  for i, paragraph in ipairs(scenario) do
    if not paragraph.speaker then
      error("speaker is nil at paragraph "..i)
    end
    if not speaker_definitions[paragraph.speaker] then
      error("speaker '"..paragraph.speaker.."' not found at paragraph "..i)
    end
  end
end

local function process_labels(scenario)
  local labels = {}
  for index, paragraph in ipairs(scenario) do
    paragraph.index = index
    local label = paragraph.label
    if label then
      if labels[label] then
        error("label '"..label.."' already defined")
      end
      local item = { label = label, index = index }
      append(labels, item)
      labels[label] = item
    end
    if paragraph.start and paragraph.when_jumps then
      error("@start and @when are incompatible at paragraph "..index)
    end
  end
  for index, paragraph in ipairs(scenario) do
    if paragraph.jumps then
      for _, jump in ipairs(paragraph.jumps) do
        local label = jump.label
        if not labels[label] then
          if not scenario.debug then
            error("label '"..label.."' not found")
          else
            -- ダミーの飛び先を作成する
            labels[label] = { label = label, index = 0 }
          end
        end
        labels[label].used = true
      end
    end
  end
  for _, item in ipairs(labels) do
    if not item.used and not scenario[item.index].label_root then
      if not scenario.debug then
        error("label '"..item.label.."' not used")
      end
    end
  end
  scenario.labels = labels
end

local function jump_index(scenario, jump)
  return scenario.labels[jump.label].index
end

local function summarize(paragraph)
  local buffer = {}
  for _, text in ipairs(paragraph) do
    for _, v in ipairs(text) do
      if type(v) == "string" then
        buffer[#buffer + 1] = v
      else
        buffer[#buffer + 1] = v[1]
      end
    end
  end
  return table.concat(buffer)
end

local function visit(scenario, command, i, u, starts, color)
  color[i] = 1

  local indices = {}
  if u.when_jumps then
    for _, jump in ipairs(u.when_jumps) do
      append(indices, jump_index(scenario, jump))
    end
  end
  if u.jump then
    append(indices, jump_index(scenario, u.jump))
  elseif u.choice_jumps then
    for _, jump in ipairs(u.choice_jumps) do
      append(indices, jump_index(scenario, jump))
    end
  elseif not u.finish then
    append(indices, i + 1)
  end

  for _, j in ipairs(indices) do
    if not starts[j] and not color[j] then
      local v = assert(scenario[j])
      assert(not v.system)
      if v[command] and u[command] ~= v[command] then
        error(command.." conflicts between "..u[command].." and "..v[command].." at paragraph "..j..": "..summarize(v))
      end
      v[command] = u[command]
      visit(scenario, command, j, v, starts, color)
    end
  end

  color[i] = 2
end

local function search(scenario, command)
  local starts = {}
  for index, paragraph in ipairs(scenario) do
    if not paragraph.system and paragraph[command] then
      starts[index] = paragraph
    end
  end
  for index, paragraph in pairs(starts) do
    if not paragraph.system and paragraph[command] then
      visit(scenario, command, index, paragraph, starts, {})
    end
  end
  for index, paragraph in ipairs(scenario) do
    if not paragraph.system and not paragraph[command] then
      error(command.." is nil at paragraph "..index..": "..summarize(paragraph))
    end
  end
end

local function process_dialogs(scenario)
  local dialogs = {}
  for index, paragraph in ipairs(scenario) do
    paragraph.index = index
    local dialog = paragraph.dialog
    if dialog then
      local key = dialog.dialog
      if dialogs[key] then
        error("dialog '"..key.."' already defined")
      end
      local item = { dialog = key, index = index }
      append(dialogs, item)
      dialogs[key] = item
    end
  end
  scenario.dialogs = dialogs
end

return function (scenario_pathname)
  local scenario_dirname = dirname(scenario_pathname)
  local scenario_filename = basename(scenario_pathname)
  local scenario = parse({}, scenario_dirname, scenario_filename)
  process_speakers(scenario)
  process_labels(scenario)
  if not scenario.debug then
    search(scenario, "music")
    search(scenario, "place")
    search(scenario, "background")
  end
  process_dialogs(scenario)
  return scenario
end
