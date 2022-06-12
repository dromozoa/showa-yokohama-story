#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local json = require "dromozoa.commons.json"
local utf8 = require "dromozoa.utf8"
local ucd_kana = require "ucd_kana"
local scenario = require "scenario"

local unpack = table.unpack or unpack

local scenario_filename, speaker_speed = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local vpp_filename = basename .. "-vp.vpp"
local out_filename = basename .. ".vpp"

local scenario_data, scenario_measures = scenario.read(scenario_filename)

local data = scenario_data[1]
local beats_per_minute = data.beats_per_minute
local syllables_per_measure = data.syllables_per_measure
local speaker_beats_per_minute = 60
local speaker_syllables_per_minute

local speakers = scenario.speakers
for speaker, def in pairs(speakers) do
  def.speed = speaker_speed
end

local function SGR(n)
  return "\27[" .. n .. "m"
end
local sgr_reset = SGR(0)
local sgr_fg_aiueo = {
  A = SGR(30);
  I = SGR(30);
  U = SGR(30);
  E = SGR(30);
  O = SGR(30);
}
local sgr_bg_aiueo = {
  A = SGR(101);
  I = SGR(103);
  U = SGR(104);
  E = SGR(102);
  O = SGR(47);
}
local sgr_bar = SGR(31)

local function render_syl(s, pre, post)
  local codes = {}
  for p, c in utf8.codes(s) do
    codes[#codes + 1] = c
  end
  local buffer = {}
  for i = 1, #codes do
    local c = codes[i]
    local d = ucd_kana[c]
    if d and d.hiragana then
      buffer[i] = d.hiragana
    else
      buffer[i] = c
    end
  end
  local sgr1 = ""
  local sgr2 = ""
  if s ~= "ッ" then
    local d = ucd_kana[codes[#codes]]
    if d then
      local vowel = d.value:sub(-1)
      local sgr_fg = sgr_fg_aiueo[vowel]
      local sgr_bg = sgr_bg_aiueo[vowel]
      if sgr_fg then
        sgr1 = sgr1 .. sgr_fg
        sgr2 = sgr_reset
      end
      if sgr_bg then
        sgr1 = sgr1 .. sgr_bg
        sgr2 = sgr_reset
      end
    end
  end
  pre = pre or ""
  post = post or ""
  return sgr1 .. pre .. utf8.char(unpack(buffer)) .. post .. sgr2
end

local handle = assert(io.open(vpp_filename, "rb"))
local source = handle:read "*a" :gsub("\0$", "")
handle:close()

local index = 0
local result = source:gsub([[{"narrator".-{"speed".-{"happy".-}]], function (x)
  local def
  while true do
    index = index + 1
    local data = scenario_data[index]
    def = speakers[data.speaker]
    if def.speaker then
      break
    end
  end
  x = x:gsub([[("key":%s*)".-"]], "%1\"" .. def.speaker .. "\"")
  x = x:gsub([[("speed":%s*)[%d%.%-]+]], "%1" .. def.speed)
  x = x:gsub([[("pitch":%s*)[%d%.%-]+]], "%1" .. def.pitch)
  x = x:gsub([[("pause":%s*)[%d%.%-]+]], "%1" .. def.pause)
  x = x:gsub([[("volume":%s*)[%d%.%-]+]], "%1" .. def.volume)
  x = x:gsub([[("happy":%s*)[%d%.%-]+]], "%1" .. def.happy)
  x = x:gsub([[("fun":%s*)[%d%.%-]+]], "%1" .. def.fun)
  x = x:gsub([[("angry":%s*)[%d%.%-]+]], "%1" .. def.angry)
  x = x:gsub([[("sad":%s*)[%d%.%-]+]], "%1" .. def.sad)
  return x
end)

local root = json.decode(result)
-- print(json.encode(root, { pretty = true }))
local blocks = root.project.blocks
local index = 0

io.write "   "
for i = 1, 48 do
  io.write((" %2d "):format(i))
  if i == syllables_per_measure then
    io.write(sgr_bar, "|", sgr_reset)
  end
end
io.write "\n"

for i = 1, #blocks do
  local sentence_list = blocks[i]["sentence-list"]
  index = index + 1
  io.write(("%2d "):format(index))
  local count = 0
  for j = 1, #sentence_list do
    local tokens = sentence_list[j].tokens
    for k = 1, #tokens do
      local token = tokens[k]
      local syl = token.syl
      local n = #syl
      for l = 1, n do
        local s = syl[l].s
        if s == "" then
          s = "○"
        end
        local m = utf8.len(s)
        assert(m == 1 or m == 2)
        if m == 1 then
          io.write(render_syl(s, " ", " "))
        else
          io.write(render_syl(s))
        end
        count = count + 1
        if count == syllables_per_measure then
          io.write(sgr_bar, "|", sgr_reset)
        end
      end
    end
  end
  for k = count + 1, 48 do
    io.write "    "
    if k == syllables_per_measure then
      io.write(sgr_bar, "|", sgr_reset)
    end
  end
  io.write "\n"
end


local out = assert(io.open(out_filename, "w"))
out:write(result, "\0")
out:close()
