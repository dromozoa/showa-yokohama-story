#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local dumper = require "dromozoa.commons.dumper"
local scenario = require "scenario"

local scenario_filename = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local srt_filename = basename .. "-vp.srt"

local scenario_data = scenario.read(scenario_filename)
print(dumper.encode(scenario_data, { pretty = true, stable = true }))

local out = assert(io.open(srt_filename, "w"))
local counter = 0
for i = 1, #scenario_data do
  local data = scenario_data[i]
  counter = counter + 1
  out:write(counter, "\n")
  out:write(("%s --> %s\n"):format(
      scenario.format_time_srt(data.measure * data.seconds_per_measure + data.duration * data.seconds_per_syllable),
      scenario.format_time_srt((data.measure + 1) * data.seconds_per_measure)))
  for j = 1, #data do
    local item = data[j]
    out:write(item.voice)
  end
  out:write "\n\n"
end
out:close()
