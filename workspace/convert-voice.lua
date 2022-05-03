#! /usr/bin/env lua

local ffmpeg = ...

local function narrator_map(narrator, i)
  if narrator == "女性1" then
    if i <= 2 or i == 6 or i == 7 then
      return "narrator"
    else
      return "alice"
    end
  elseif narrator == "女性3" then
    return "danu"
  else
    error "???"
  end
end

local function exec_ffmpeg(source, target)
  local command = ([[
"%s" -y -i "%s" "%s.ogg";
"%s" -y -i "%s" "%s.m4a";
]]):format(ffmpeg, source, target, ffmpeg, source, target)

  io.write(command)
  os.execute(command)
end

local data = {}

for i = 2, #arg do
  local source = arg[i]
  local narrator, index, scene = assert(source:match "([^/%-]+)%-(%d+)%-([^%-]+)%.wav$")
  -- print(narrator, index, scene)
  data[#data + 1] = {
    source = source;
    narrator = narrator;
    index = tonumber(index);
    scene = scene;
  }
end

table.sort(data, function (a, b) return a.index < b.index end)

local map = {}
for i = 1, #data do
  local item = data[i]
  local name = assert(narrator_map(item.narrator, i))
  map[name] = 0
end

for i = 1, #data do
  local item = data[i]
  local name = assert(narrator_map(item.narrator, i))
  local index = map[name]

  local target = ("%s_%d"):format(name, index)
  exec_ffmpeg(item.source, target)

  map[name] = index + 1
end

