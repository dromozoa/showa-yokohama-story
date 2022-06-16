#! /usr/bin/env lua

local png = require "dromozoa.png"

local wav_filename, png_filename = ...

local handle = assert(io.open(wav_filename, "rb"))

assert(handle:read(4) == "RIFF")
local size = string.unpack("<I4", handle:read(4))
-- print(size)
assert(handle:read(4) == "WAVE")

local fmt
local data = {}
local size_before
local size_main
local size_after
local size_padded

while true do
  local tag = handle:read(4)
  if not tag then
    break
  end
  local size = string.unpack("<I4", handle:read(4))
  -- print(tag, size)

  if tag == "fmt " then
    fmt = {}
    fmt.format_tag,
    fmt.channels,
    fmt.samples_per_sec,
    fmt.avg_bytes_per_sec,
    fmt.block_align,
    fmt.bits_per_sample = string.unpack("<I2I2I4I4I2I2", handle:read(size))
    assert(fmt.format_tag == 1)
    assert(fmt.channels == 1)
    assert(fmt.block_align == 2)
  elseif tag == "data" then
    size_main = size / fmt.block_align
    size_padded = 2 ^ math.ceil(math.log(size_main, 2))
    size_before = math.floor((size_padded - size_main) / 2)
    size_after = size_padded - size_before - size_main

    for i = 1, size_before do
      data[i] = 0
    end
    for i = size_before + 1, size_before + size_main do
      data[i] = string.unpack("<i2", handle:read(2))
    end
    for i = size_before + size_main + 1, size_padded do
      data[i] = 0
    end
  else
    handle:seek("cur", size)
  end
end

-- Haar
local X = data
local n = #X
local m = math.log(n, 2) - 1
local result = {}
local f = fmt.samples_per_sec

for i = 1, m do
  n = n / 2
  local fmin = f / 2

  local C = {} -- 低周波成分
  local D = { fmin = fmin, fmax = f } -- 高周波成分
  f = fmin

  local dmin = 0
  local dmax = 0

  for j = 1, n do
    local k = j * 2
    local a = X[k - 1]
    local b = X[k]
    local d = a - b
    local c = a + d / 2
    if dmin > d then dmin = d end
    if dmax < d then dmax = d end
    C[j] = c
    D[j] = d
  end
  X = C
  D.dmin = dmin
  D.dmax = dmax
  result[i] = D
end

local C = X
local D = result

local rows
local row_size = 100
for i = 1, m do
  local d = D[i]
  if d.fmax < 200 then
    rows = i
    break
  end
end

local t_size = 2048
local t_scale = t_size / size_padded
local t_size_before = math.floor(size_before * t_scale)
local t_size_after = math.floor(size_after * t_scale)
local t_size_main = t_size - t_size_before - t_size_after

local out = assert(io.open(png_filename, "wb"))

local writer = png.writer()
writer:set_write_fn(function (data)
  out:write(data)
end, function ()
  out:flush()
end)
writer:set_IHDR {
  width = t_size_main;
  height = rows * row_size;
  bit_depth = 8;
  color_type = png.PNG_COLOR_TYPE_RGB;
}

for i = 1, rows do
  local d = D[i]
  local v = {}
  if #d == t_size then
    v = d
  elseif #d < t_size then
    local s = t_size / #d
    for j = 1, t_size do
      v[j] = d[math.floor((j - 1) / s) + 1]
    end
  else
    local s = #d / t_size
    for j = 1, t_size do
      local u = 0
      for k = (j - 1) * s + 1, j * s do
        u = u + d[k]
      end
      v[j] = u / s
    end
  end

  local uscale = 255 / math.max(math.abs(d.dmin), math.abs(d.dmax))

  local buffer = {}
  for j = t_size_before + 1, t_size_before + t_size_main do
    local u = v[j]
    local x = math.floor(u * uscale)
    if x == 0 then
      buffer[#buffer + 1] = string.char(0x00, 0x00, 0x00)
    elseif x > 0 then
      buffer[#buffer + 1] = string.char(x, 0x00, 0x00)
      -- buffer[#buffer + 1] = string.char(x, x, x)
    else
      buffer[#buffer + 1] = string.char(0x00, -x, 0x00)
      -- buffer[#buffer + 1] = string.char(-x, -x, -x)
    end
  end

  local buffer = table.concat(buffer)
  for j = (i - 1) * row_size + 1, i * row_size do
    writer:set_row(j, buffer)
  end
end

writer:write_png()

handle:close()
out:close()
