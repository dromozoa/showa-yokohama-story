#! /usr/bin/env lua

local wav_filename = ...

local handle = assert(io.open(wav_filename, "rb"))

local function read_chunk_header(handle)
  local tag = handle:read(4)
  if not tag then
    return
  end
  local size = string.unpack("<I4", handle:read(4))
  return tag, size
end

local function read_fmt_chunk(handle, size)
  local fmt = {}
  fmt.format_tag,
  fmt.channels,
  fmt.samples_per_sec,
  fmt.avg_bytes_per_sec,
  fmt.block_align,
  fmt.bits_per_sample = string.unpack("<I2I2I4I4I2I2", handle:read(size))
  return fmt
end

assert(handle:read(4) == "RIFF")
local size = string.unpack("<I4", handle:read(4))
print(size)
assert(handle:read(4) == "WAVE")

local fmt
local data = {}

while true do
  local tag, size = read_chunk_header(handle)
  if not tag then
    break
  end
  print(tag, size)
  if tag == "fmt " then
    fmt = read_fmt_chunk(handle, size)
    assert(fmt.format_tag == 1)
    assert(fmt.channels == 1)
    assert(fmt.block_align == 2)
  elseif tag == "data" then
    local n = size / fmt.block_align
    local m = 2 ^ math.ceil(math.log(n, 2))
    local p = math.floor((m - n) / 2)
    local q = m - n - p

    for i = 1, p do
      data[i] = 0
    end
    for i = p + 1, p + n do
      data[i] = string.unpack("<i2", handle:read(2))
    end
    for i = p + n + 1, m do
      data[i] = 0
    end
  else
    handle:seek("cur", size)
  end
end

handle:close()

local min = data[1]
local max = data[1]

for i = 2, #data do
  local v = data[i]
  if min > v then min = v end
  if max < v then max = v end
end

print(#data, min, max)
