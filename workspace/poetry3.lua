#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local scenario = require "scenario"

local scenario_filename = ...
local basename = scenario_filename:gsub("%.[^%.]*", "")
local srt_filename = basename .. "-vp.srt"

local data = scenario.read(scenario_filename)

local out = assert(io.open(srt_filename, "w"))
local counter = 0
for i = 1, #data do
  local x = data[i]
  counter = counter + 1
  out:write(counter, "\n")
  out:write(("%s --> %s\n"):format(
      scenario.format_time_srt(x.measure * x.seconds_per_measure + x.duration * x.seconds_per_syllable),
      scenario.format_time_srt((x.measure + 1) * x.seconds_per_measure)))

  for j = 1, #x do
    local y = x[j]
    out:write(y.voice)
  end
  out:write "\n\n"
end
out:close()
