#! /usr/bin/env lua

local ffmpeg = ...

local narrator_map = {
  ["女性1"] = "alice";
  ["女性3"] = "danu";
}

local function exec_ffmpeg(source, target)
  local command = ([[
"%s" -y -i "%s" "%s.ogg";
"%s" -y -i "%s" "%s.m4a";
]]):format(ffmpeg, source, target, ffmpeg, source, target)

  io.write(command)
  os.execute(command)
end

local data = {}
local map = {}

for i = 2, #arg do
  local source = arg[i]
  local narrator, index, scene = assert(source:match "([^/%-]+)%-(%d+)%-([^%-]+)%.wav$")
  -- print(narrator, index, scene)
  local name = assert(narrator_map[narrator])
  data[#data + 1] = {
    source = source;
    name = name;
    index = tonumber(index);
    scene = scene;
  }
  map[name] = 0

end

table.sort(data, function (a, b) return a.index < b.index end)

for i = 1, #data do
  local item = data[i]
  local name = item.name
  local index = map[name]

  local target = ("%s_%d"):format(name, index)
  exec_ffmpeg(item.source, target)

  map[name] = index + 1
end

