#! /usr/bin/env lua

local utf8 = require "dromozoa.utf8"

local ks_filename, map_filename, vpt_filename, vpp_filename, out_filename = ...

local data = {}

local _1
local _2
local _3
local _4

local function match(line, pattern)
  _1, _2, _3, _4 = line:match(pattern)
  return _1, _2, _3, _4
end

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

local speaker_map = {
  narrator = {
    speaker = "Speaker/f1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.0";
    sad = "1.0";
  };

  alice = {
    speaker = "Speaker/f1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "1.0";
    sad = "0.0";
  };

  danu = {
    speaker = "Speaker/f5";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.0";
    sad = "1.0";
  };

  magi = {
    speaker = "Speaker/f4b";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.5";
    sad = "0.5";
  };

  yukio = {
    speaker = "Speaker/m3";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.0";
    sad = "0.0";
  };

  priest = {
    speaker = "Speaker/m1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.2";
    sad = "0.5";
  };

  engineer = {
    speaker = "Speaker/m1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.2";
    sad = "0.5";
  };

  activist = {
    speaker = "Speaker/m1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.2";
    sad = "0.5";
  };

}
local speakers = {}
for k, v in pairs(speaker_map) do
  speakers[#speakers + 1] = k
  v.index = 0
end
table.sort(speakers)

local sections = {}
local section_map = {}
local section
local page

for line in io.lines() do
  if match(line, "^@#") then
    -- コメント

  elseif match(line, "^@=(.*)$") then
    local label = trim(_1)
    section = { label = label, pages = {} }
    sections[#sections + 1] = section
    section_map[label] = section

  elseif match(line, "^%s*$") then
    if page then
      local pages = section.pages
      pages[#pages + 1] = page
      page = nil
    end

  elseif match(line, "^@bg{(.-)}(.*)$") then
    local name = trim(_1)
    page.bg = name

  elseif match(line, "^@bgm{(.-)}(.*)$") then
    local name = trim(_1)
    page.bgm = name

  elseif match(line, "^@case{(.-)}(.*)$") then
    local label = trim(_1)
    local text = trim(_2)
    local cases = page.cases
    if not cases then
      cases = {}
      page.cases = cases
    end
    cases[#cases + 1] = { label = label, text = text }

  elseif match(line, "^@case(.*)$") then
    local text = trim(_1)
    local cases = page.cases
    if not cases then
      cases = {}
      page.cases = cases
    end
    cases[#cases + 1] = { label = text, text = text }

  elseif match(line, "^@jump{(.-)}(.*)$") then
    local label = trim(_1)
    page.jump = label

  elseif match(line, "^@if{(.-)}{(.-)}") then
    local exp = trim(_1)
    local label = trim(_2)
    if page then
      error "not implemented"
    else
      local conds = section.conds
      if not conds then
        conds = {}
        section.conds = conds
      end
      conds[#conds + 1] = { type = "if", exp = exp; label = label }
    end

  elseif match(line, "^@if_call{(.-)}{(.-)}") then
    local exp = trim(_1)
    local label = trim(_2)
    if page then
      error "not implemented"
    else
      local conds = section.conds
      if not conds then
        conds = {}
        section.conds = conds
      end
      conds[#conds + 1] = { type = "if_call", exp = exp; label = label }
    end

  elseif match(line, "^@ret$") then
    assert(page)
    page.ret = true

  elseif match(line, "^!!%s*(.-)%s*$") then
    if page then
      error "not implemented"
    else
      local codes = section.codes
      if not codes then
        codes = {}
        section.codes = codes
      end
      codes[#codes + 1] = trim(_1)
    end

  elseif match(line, "^#%s*(.-)%s*$") then
    assert(not page)
    page = { speaker = trim(_1), lines = {} }

  else
    local data = {}
    local p = 1
    local n = #line
    while true do
      -- ルビが指定されていたら、その読みかたをしたいかも
      -- 換言。ルビと独立に、読みかたを指定したい場合もある
      -- 1. 句読点をいれたり、消したり
      -- 2. ルビをふらずに、よみかたを指定したり
      -- 3. ルビをふって、よみかたでさらにうらぎることはあるかな？
      -- 4. あるかも。でも、それはそれでつくればいいんじゃない。
      --
      -- もともとはrubyタグ
      -- r = rubyとvoiceをいっしょに定義する
      --   @r...@{...}
      -- v = voice only
      --   @v...@{...}
      -- R = ruby + voice
      --   @R...@{...|...}
      local i, j, text, ruby = line:find("@{ruby}(.-)@{/ruby(.-)}", p)
      if i then
        if p < i then
          data[#data + 1] = { text = line:sub(p, i - 1) }
        end
        data[#data + 1] = { text = text, ruby = trim(ruby), voice = trim(ruby) }
        p = j + 1
      else
        local i, j, command, text, payload = line:find("@([rvR])(.-)@{(.-)}", p)
        if i then
          if p < i then
            data[#data + 1] = { text = line:sub(p, i - 1) }
          end
          if command == "r" then
            data[#data + 1] = { text = text, ruby = trim(payload), voice = trim(payload) }
          elseif command == "v" then
            data[#data + 1] = { text = text, voice= trim(payload) }
          elseif command == "R" then
            local ruby, voice = assert(payload:match "(.-)|(.*)")
            data[#data + 1] = { text = text, ruby = trim(ruby), voice = trim(voice) }
          else
            error "unknown command"
          end
          p = j + 1
        else
          if p < n then
            data[#data + 1] = { text = line:sub(p, n) }
          end
          break
        end
      end
    end
    local lines = page.lines
    lines[#lines + 1] = data
  end
end

if page then
  local pages = section.pages
  pages[#pages + 1] = page
  page = nil
end

local line_index = 0
local line_map = {}

local out = assert(io.open(ks_filename, "w"))
local map = assert(io.open(map_filename, "w"))

for i = 1, #sections do
  local section = sections[i]
  out:write("*", section.label, "\n\n")

  if section.codes then
    out:write "[iscript]\n"
    for j = 1, #section.codes do
      out:write(section.codes[j], "\n")
    end
    out:write "[endscript]\n"
  end
  if section.conds then
    for j = 1, #section.conds do
      local cond = section.conds[j]
      out:write("[if exp=\"", cond.exp, "\"]\n")
      if cond.type == "if" then
        out:write("[jump target=*", cond.label, "]\n")
      elseif cond.type == "if_call" then
        out:write("[call target=*", cond.label, "]\n")
      else
        error "unknown cond.type"
      end
      out:write "[endif]\n"
    end
  end


  for j = 1, #speakers do
    local speaker = speakers[j]
    out:write("[voconfig name=", speaker, " vostorage=", speaker, "{number}.ogg number=", speaker_map[speaker].index, "]\n")
  end
  out:write "[vostart]\n\n"

  for j = 1, #section.pages do
    local page = section.pages[j]

    out:write "[autosave]\n"

    if page.bg then
      out:write("[bg2 storage=", page.bg, " time=1000 wait=false method=vanishIn]\n")
    end
    if page.bgm then
      out:write("[playbgm storage=", page.bgm, " loop=true volume=50]\n")
    end

    if page.cases then
      end_of_page = "\n"
    else
      end_of_page = "[p]\n"
    end

    for k = 1, #page.lines do
      local line = page.lines[k]

      line_map[line_index] = line
      line.speaker = page.speaker
      line.index = line_index
      line_index = line_index + 1

      local speaker = assert(speaker_map[line.speaker])
      local speaker_index = speaker.index
      speaker.index = speaker_index + 1

      map:write(line.index, "\t", line.speaker, "\t", speaker_index, "\n")

      out:write("#", line.speaker, "\n")
      for l = 1, #line do
        local item = line[l]
        if item.ruby then
          -- 現在はすべて「全角」という前提で計算している
          -- 改善案
          -- 1. まじめにメトリクスから幅を計算する
          -- 2. EAWでてきとうに幅を計算する
          local n = utf8.len(item.text)
          local m = utf8.len(item.ruby)

          local spacing
          if m < n * 2 and m ~= 1 then
            spacing = (" spacing=%.17g"):format((n * 2 - m) * 16 / (m - 1))
          else
            spacing = ""
          end

          if n % 2 == 0 then
            local p = utf8.offset(item.text, n / 2 + 1)
            out:write(item.text:sub(1, p - 1))
            out:write("[ruby x=-16 text=", item.ruby, spacing, "]")
            out:write(item.text:sub(p))
          else
            local p = utf8.offset(item.text, (n - 1) / 2 + 1)
            out:write(item.text:sub(1, p - 1))
            out:write("[ruby text=", item.ruby, spacing, "]")
            out:write(item.text:sub(p))
          end
        else
          out:write(item.text)
        end
      end
      if k < #page.lines then
        out:write "[l][r]\n"
      else
        out:write(end_of_page)
      end
    end

    if j == #section.pages then
      out:write "[vostop]\n"
    end

    if page.cases then
      for k = 1, #page.cases do
        local case = page.cases[k]
        out:write("[glink color=btn_06_black target=*", case.label, " x=48 y=", 96 * k - 64, " text=", case.text, " size=32]\n")
      end
      out:write "[s]\n"
    end

    if page.jump then
      out:write("[jump target=*", page.jump, "]\n")
    end

    if page.ret then
      out:write "[return]\n"
    end

    out:write "\n"
  end
end

out:write "[return]\n"
out:close()
map:close()

local out = assert(io.open(vpt_filename, "w"))
for i = 1, #sections do
  local section = sections[i]

  for j = 1, #section.pages do
    local page = section.pages[j]
    for k = 1, #page.lines do
      local line = page.lines[k]
      for l = 1, #line do
        local item = line[l]
        if item.voice then
          out:write(item.voice)
        else
          out:write(item.text)
        end
      end
      out:write "\n"
    end
  end
end
out:close()

-- 女性1 Speaker/f1
-- 女性2 Speaker/f3
-- 女性3 Speaker/f5
-- 男性1 Speaker/m1
-- 男性2 Speaker/m3
-- 男性3 Speaker/m4
-- 女の子 Speaker/f4b

if vpp_filename then
  local handle = assert(io.open(vpp_filename, "rb"))
  local source = handle:read "*a"
  handle:close()

  source = source:gsub("\0$", "")

  --[[
    {
      "narrator": {"key": "Speaker/f1"},
      "time-offset-mode": 2,
      "time-offset": 0.0,
      "params": {"speed": 1.0, "pitch": 0.0, "pause": 1.0, "volume": 1.0},
      "emotions": {"happy": 0.0, "fun": 0.0, "angry": 0.0, "sad": 0.0},
  ]]

  local line_index = 0

  local result = source:gsub([[{"narrator".-{"speed".-{"happy".-}]], function (x)
    local speaker = "Speaker/f3"
    local speed = "1.2"
    local pitch = "-1.5"
    local pause = "0.5"
    local volume = "2.0"
    local happy = "0.0"
    local fun = "0.0"
    local angry = "0.0"
    local sad = "1.0"

    local line = line_map[line_index]
    line_index = line_index + 1

    local speaker = assert(speaker_map[line.speaker])
    x = x:gsub([[("key":%s*)".-"]], "%1\"" .. speaker.speaker .. "\"")
    x = x:gsub([[("speed":%s*)[%d%.%-]+]], "%1" .. speaker.speed)
    x = x:gsub([[("pitch":%s*)[%d%.%-]+]], "%1" .. speaker.pitch)
    x = x:gsub([[("pause":%s*)[%d%.%-]+]], "%1" .. speaker.pause)
    x = x:gsub([[("volume":%s*)[%d%.%-]+]], "%1" .. speaker.volume)
    x = x:gsub([[("happy":%s*)[%d%.%-]+]], "%1" .. speaker.happy)
    x = x:gsub([[("fun":%s*)[%d%.%-]+]], "%1" .. speaker.fun)
    x = x:gsub([[("angry":%s*)[%d%.%-]+]], "%1" .. speaker.angry)
    x = x:gsub([[("sad":%s*)[%d%.%-]+]], "%1" .. speaker.sad)

    return x
  end)

  local out = assert(io.open(out_filename, "wb"))
  out:write(result)
  out:write "\0"
  out:close()
end
