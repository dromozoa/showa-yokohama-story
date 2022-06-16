#! /usr/bin/env lua

local json = require "dromozoa.commons.json"

local filename, mode = ...

local handle = assert(io.open(filename, "rb"))
local source = handle:read "*a" :gsub("\0$", "")
handle:close()

local root = json.decode(source)

if mode == "r" then
  local blocks = root.project.blocks
  for i = 1, #blocks do
    local block = blocks[i]
    local sentence_list = block["sentence-list"]
    for j = 1, #sentence_list do
      local sentence = sentence_list[j]
      local tokens = sentence.tokens
      print(sentence.text)
      for k = 1, #tokens do
        local token = tokens[k]
        local r8 = token.r8
        local r32 = token.r32
        print(token.s, r8[1], r8[2], r32[1], r32[2])
      end
    end
  end
else
  print(json.encode(root, { pretty = true }))
end

