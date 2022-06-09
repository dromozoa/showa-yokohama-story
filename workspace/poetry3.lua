#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local dumper = require "dromozoa.commons.dumper"

local ucd_kana = require "ucd_kana"
local scenario = require "read_scenario"

local function format_time(time)
  time = math.floor(time * 1000)
  local msec = time % 1000
  time = math.floor(time / 1000)
  local sec = time % 60
  time = math.floor(time / 60)
  local min = time % 60
  time = math.floor(time / 60)
  local hour = time
  return ("%02d:%02d:%02d,%03d"):format(hour, min, sec, msec)
end

local scenario_filename = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local srt_filename = basename .. "-vp.srt"

local scenario = scenario.read(scenario_filename)
-- print(dumper.encode(scenario, { pretty = true, stable = true }))

local out = assert(io.open(srt_filename, "w"))
local counter = 0
for i = 1, #scenario do
  local data = scenario[i]

  local beats_per_minute = data.beats_per_minute
  local seconds_per_beats = 60 / beats_per_minute
  local seconds_per_measure = seconds_per_beats * 4
  local syllables_per_measure = data.syllables_per_measure
  local seconds_per_syllable = seconds_per_measure / syllables_per_measure
  local measure = data.measure
  local duration = data.duration

  local t1 = measure * seconds_per_measure + duration * seconds_per_syllable
  local t2 = (measure + 1) * seconds_per_measure

  counter = counter + 1
  out:write(counter, "\n")
  out:write(("%s --> %s\n"):format(format_time(t1), format_time(t2)))

  for j = 1, #data do
    local item = data[j]
    local voice = item.voice
    out:write(voice)
  end
  out:write "\n\n"
end
out:close()
