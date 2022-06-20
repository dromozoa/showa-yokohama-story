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
elseif mode == "a" then
  local blocks = root.project.blocks
  for i = 1, #blocks do
    local block = blocks[i]
    local sentence_list = block["sentence-list"]

    for j = 1, #sentence_list do
      local sentence = sentence_list[j]
      local tokens = sentence.tokens
      for k = 1, #tokens do
        local token = tokens[k]
        local syls = token.syl
        for l = 1, #syls do
          local syl = syls[l]
          local s = syl.s
          if #s == 0 then
            io.write("    ")
          elseif #s <= 3 then
            io.write(" ", s, " ")
          else
            io.write(s)
          end
        end
      end
    end
    io.write "\n"

    for j = 1, #sentence_list do
      local sentence = sentence_list[j]
      local tokens = sentence.tokens
      for k = 1, #tokens do
        local token = tokens[k]
        local syls = token.syl
        for l = 1, #syls do
          local syl = syls[l]
          local a = syl.a
          if a == 8192 then
            io.write " ＿ "
          elseif a == 8193 then
            io.write " ■ "
          else
            io.write "    "
          end
        end
      end
    end
    io.write "\n\n"
  end
else
  print(json.encode(root, { pretty = true }))
end

