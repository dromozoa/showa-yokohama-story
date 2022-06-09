#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local dumper = require "dromozoa.commons.dumper"
local ucd_kana = require "ucd_kana"
local scenario = require "scenario"

local scenario_filename = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local srt_filename = basename .. "-vp.srt"

local scenario_data = scenario.read(scenario_filename)
-- print(dumper.encode(scenario_data, { pretty = true, stable = true }))

local out = assert(io.open(srt_filename, "w"))
local counter = 0
for i = 1, #scenario_data do
  local data = scenario_data[i]

  local seconds_per_measure = data.seconds_per_measure
  local seconds_per_syllable = data.seconds_per_syllable
  local measure = data.measure
  local duration = data.duration

  local t1 = measure * seconds_per_measure + duration * seconds_per_syllable
  local t2 = (measure + 1) * seconds_per_measure

  counter = counter + 1
  out:write(counter, "\n")
  out:write(("%s --> %s\n"):format(scenario.format_time_srt(t1), scenario.format_time_srt(t2)))

  for j = 1, #data do
    local item = data[j]
    local voice = item.voice
    out:write(voice)
  end
  out:write "\n\n"
end
out:close()
