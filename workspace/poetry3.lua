#! /usr/bin/env lua

package.path = "../love/?.lua;" .. package.path

local dumper = require "dromozoa.commons.dumper"
local json = require "dromozoa.commons.json"
local utf8 = require "dromozoa.utf8"
local ucd_kana = require "ucd_kana"
local read_scenario = require "read_scenario"

local scenario_filename = ...

local scenario = read_scenario(scenario_filename)
-- print(dumper.encode(scenario, { pretty = true }))





