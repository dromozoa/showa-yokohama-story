#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local dumper = require "dromozoa.commons.dumper"
local scenario = require "scenario"

local scenario_filename, speaker = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local srt1_filename = basename .. "-vp.srt"
local srt2_filename = basename .. ".srt"

if speaker then
  srt1_filename = basename .. "-vp-" .. speaker .. ".srt"
end

local function check_speaker(data_speaker)
  if speaker then
    return data_speaker == speaker
  else
    return true
  end
end

local scenario_data, scenario_measures = scenario.read(scenario_filename)
-- print(dumper.encode(scenario_data, { pretty = true, stable = true }))
-- print(dumper.encode(scenario_measures, { pretty = true, stable = true }))

local out = assert(io.open(srt1_filename, "w"))
local counter = 0
for i = 1, #scenario_data do
  local data = scenario_data[i]
  local def = scenario.speakers[data.speaker]
  if def.speaker and check_speaker(data.speaker) then
    counter = counter + 1
    out:write(counter, "\n")
    out:write(("%s --> %s\n"):format(
        scenario.format_time_srt((data.measure - 1) * data.seconds_per_measure + data.duration * data.seconds_per_syllable),
        scenario.format_time_srt(data.measure * data.seconds_per_measure)))
    for j = 1, #data do
      local item = data[j]
      out:write(item.voice)
    end
    out:write "\n\n"
  end
end
out:close()

local out = assert(io.open(srt2_filename, "w"))
local counter = 0
for i = 1, #scenario_data do
  local data = scenario_data[i]
  local def = scenario.speakers[data.speaker]
  counter = counter + 1
  out:write(counter, "\n")
  out:write(("%s --> %s\n"):format(
      scenario.format_time_srt((data.measure - 1) * data.seconds_per_measure + data.duration * data.seconds_per_syllable),
      scenario.format_time_srt(data.measure * data.seconds_per_measure)))
  for j = 1, #data do
    local item = data[j]
    out:write(item.text)
  end
  out:write "\n\n"
end
out:close()
