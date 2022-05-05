#! /usr/bin/env lua

local ffmpeg, map_filename, out_directory = ...

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

local map = {}
for line in io.lines(map_filename) do
  local line_index, speaker, index = assert(line:match "^(%d+)\t(.-)\t(%d+)$")
  local line_index = tonumber(line_index)
  map[tonumber(line_index)] = { speaker = speaker, index = tonumber(index) }
end

local data = {}

for i = 4, #arg do
  local source = arg[i]
  local line_index = assert(source:match "(%d+)%-.-%.wav$")
  local item = assert(map[tonumber(line_index)])

  local target = ("%s/%s%d"):format(out_directory, item.speaker, item.index)
  exec_ffmpeg(source, target)
end
