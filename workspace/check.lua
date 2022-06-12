#! /usr/bin/env lua

local json = require "dromozoa.commons.json"

local filename = ...

local handle = assert(io.open(filename, "rb"))
local source = handle:read "*a" :gsub("\0$", "")
handle:close()

local root = json.decode(source)
print(json.encode(root, { pretty = true }))

