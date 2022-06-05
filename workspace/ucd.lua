#! /usr/bin/env lua

local utf8 = require "dromozoa.utf8"

local ucd_filename = ...

local hiragana = {}
local katakana = {}
local map = {}

for line in io.lines(ucd_filename) do
  local code, name = assert(line:match "^(%x+);(.-);")
  code = tonumber(code, 16)
  local is_hiragana = name:find "HIRAGANA LETTER" or false
  local is_katakana = name:find "KATAKANA LETTER" or false
  if is_hiragana or is_katakana then
    if not (name:find "HALFWIDTH" or name:find "MINNAN" or name:find "ARCHAIC") then
      local is_small = false
      local value = name:match " LETTER SMALL (%a+)$"
      if value then
        is_small = true
      else
        value = assert(name:match " LETTER (%a+)$")
      end
      local data = {
        is_hiragana = is_hiragana;
        is_katakana = is_katakana;
        is_small = is_small;
        code = code;
        name = name;
        value = value;
      }
      if is_hiragana then
        hiragana[#hiragana + 1] = data
      else
        katakana[#katakana + 1] = data
      end
      map[name] = data
    end
  end
end

io.write [[
return {
]]

for i = 1, #katakana do
  local katakana_data = katakana[i]
  local katakana_name = katakana_data.name
  local hiragana_name = katakana_name:gsub("^KATAKANA ", "HIRAGANA ")
  local hiragana_data = map[hiragana_name]

  local x = katakana_data
  local y = hiragana_data

  io.write(("[0x%X]={is_small=%s,value=%q"):format(x.code, x.is_small, x.value))
  if y then
    io.write((",hiragana=0x%X"):format(y.code))
  end
  io.write "};\n"
end

io.write [[
}
]]



