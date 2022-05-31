#! /usr/bin/env lua

local json = require "dromozoa.commons.json"
local utf8 = require "dromozoa.utf8"

local speaker_map = {
  narrator = {
    speaker = "Speaker/f1";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.0";
    sad = "1.0";
  };

  danu = {
    speaker = "Speaker/f5";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.0";
    sad = "1.0";
  };

  magi = {
    speaker = "Speaker/f4b";
    speed = "1.0";
    pitch = "-1.5";
    pause = "0.5";
    volume = "2.0";
    happy = "0.0";
    fun = "0.0";
    angry = "0.5";
    sad = "0.5";
  };
}

local vpt_filename, vpp_filename, out_filename = ...

local _1
local _2
local _3
local _4

local function match(line, pattern)
  _1, _2, _3, _4 = line:match(pattern)
  return _1, _2, _3, _4
end

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

local speaker_name
local lines = {}

for line in io.lines() do
  if match(line, "^@#") or match(line, "^%s*$") then
    -- comment
  elseif match(line, "^#(.*)$") then
    speaker_name = trim(_1)
  else
    local data = { speaker_name = speaker_name }
    local p = 1
    local n = #line
    -- @r...@{ruby}
    -- @R...@{ruby|voice}
    -- @v...@{voice}
    while true do
      local i, j, command, text, payload = line:find("@([rRv])(.-)@{(.-)}", p)
      if i then
        if p < i then
          local payload = trim(line:sub(p, i - 1))
          data[#data + 1] = { text = payload, voice = payload }
        end
        if command == "r" then
          local payload = trim(payload)
          data[#data + 1] = { text = text, ruby = payload, voice = payload }
        elseif command == "R" then
          local ruby, voice = assert(payload:match "(.-)|(.*)")
          data[#data + 1] = { text = text, ruby = trim(ruby), voice = trim(voice) }
        elseif command == "v" then
          data[#data + 1] = { text = text, voice = trim(payload) }
        else
          error "unknown command"
        end
        p = j + 1
      else
        if p < n then
          local payload = trim(line:sub(p, n))
          data[#data + 1] = { text = payload, voice = payload }
        end
        break
      end
    end
    lines[#lines + 1] = data
  end
end

local speaker_index_map = {}
local speaker_line_map = {}

local out = assert(io.open(vpt_filename, "wb"))
for i = 1, #lines do
  local data = lines[i]

  local speaker_name = assert(data.speaker_name)
  local speaker_index = speaker_index_map[speaker_name] or -1
  speaker_index = speaker_index + 1
  speaker_index_map[speaker_name] = speaker_index
  speaker_line_map[i] = { speaker_name = speaker_name, speaker_index = speaker_index }

  for j = 1, #data do
    local item = data[j]
    out:write(assert(item.voice))
  end
  out:write "\n"
end
out:close()

if vpp_filename then
  local handle = assert(io.open(vpp_filename, "rb"))
  local source = handle:read "*a"
  handle:close()

  source = source:gsub("\0$", "")

  local index = 0

  local result = source:gsub([[{"narrator".-{"speed".-{"happy".-}]], function (x)
    index = index + 1
    local item = speaker_line_map[index]

    local speaker = assert(speaker_map[item.speaker_name])
    x = x:gsub([[("key":%s*)".-"]], "%1\"" .. speaker.speaker .. "\"")
    x = x:gsub([[("speed":%s*)[%d%.%-]+]], "%1" .. speaker.speed)
    x = x:gsub([[("pitch":%s*)[%d%.%-]+]], "%1" .. speaker.pitch)
    x = x:gsub([[("pause":%s*)[%d%.%-]+]], "%1" .. speaker.pause)
    x = x:gsub([[("volume":%s*)[%d%.%-]+]], "%1" .. speaker.volume)
    x = x:gsub([[("happy":%s*)[%d%.%-]+]], "%1" .. speaker.happy)
    x = x:gsub([[("fun":%s*)[%d%.%-]+]], "%1" .. speaker.fun)
    x = x:gsub([[("angry":%s*)[%d%.%-]+]], "%1" .. speaker.angry)
    x = x:gsub([[("sad":%s*)[%d%.%-]+]], "%1" .. speaker.sad)

    return x
  end)

  local root = json.decode(result)
  local blocks = root.project.blocks
  local buffer = {}
  for i = 1, #blocks do
    local sentence_list = blocks[i]["sentence-list"]
    for j = 1, #sentence_list do
      local tokens = sentence_list[j].tokens
      for k = 1, #tokens do
        local token = tokens[k]
        local syl = token.syl
        local n = #syl
        for l = 1, n do
          local s = syl[l].s
          if s == "" then
            s = "●"
          end
          buffer[#buffer + 1] = s
        end
        -- print(token.s, n, table.concat(buffer, "/"))
      end
    end
  end

  -- 1拍あたり6音節

  local index = 0
  local m = #buffer
  for i = 1, m, 24 do
    index = index + 1
    io.write(("% 4d  "):format(index))
    for j = i, math.min(i + 23, #buffer) do
      local s = buffer[j]
      local n = utf8.len(s)
      assert(n == 1 or n == 2)
      if n == 1 then
        io.write(s, "   ")
      else
        io.write(s, " ")
      end
    end
    io.write "\n"
    -- print(index, table.concat(buffer, "\t", i, math.min(i + 23, #buffer)))
  end
  io.write("   #  ", m, "syl => ", m / 6 / 72 * 60, "sec\n")

  local out = assert(io.open(out_filename, "wb"))
  out:write(result)
  out:write "\0"
  out:close()
end
