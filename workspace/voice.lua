#! /usr/bin/env lua

local png = require "dromozoa.png"

local wav_filename, png_filename, scheme, tsv_filename, vol_filename, out_filename = ...

local handle = assert(io.open(wav_filename, "rb"))

assert(handle:read(4) == "RIFF")
local file_size = string.unpack("<I4", handle:read(4))
print("file_size", file_size)
assert(handle:read(4) == "WAVE")

local fmt
local data = {}
local size_before
local size_main
local size_after
local size_padded
local freq_lower_limit = 200

local filters = {
  -- LTFATからもらってきた: [h,g] = wfilt_*のh: cell array of analysing filters impulse reponses
  db1 = {
    { offset = -1; 0.707106781186547, 0.707106781186547 };
    { offset = -1; -0.707106781186547, 0.707106781186547 };
  };
  db2 = {
    { offset = -2; -0.129409522551261, 0.224143868042013, 0.836516303737808, 0.482962913144534 };
    { offset = -2; -0.482962913144534, 0.836516303737808, -0.224143868042013, -0.129409522551261 };
  };
  db3 = {
    { offset = -3; 3.522629188570951e-02, -8.544127388202671e-02, -1.350110200102546e-01, 4.598775021184918e-01, 8.068915093110925e-01, 3.326705529500826e-01 };
    { offset = -3; -3.326705529500826e-01, 8.068915093110925e-01, -4.598775021184918e-01, -1.350110200102546e-01, 8.544127388202671e-02, 3.522629188570951e-02 };
  };
  ["spline2:2"] = {
    { offset = -2; -0.176776695296637, 0.353553390593274, 1.060660171779821, 0.353553390593274, -0.176776695296637, 0 };
    { offset = -4; 0, 0, -0.353553390593274, 0.707106781186548, -0.353553390593274, 0 };
  };
  ["spline4:4"] = {
    { offset = -5; -0.027621358640100, 0.110485434560398, -0.005524271728020, -0.530330085889911, 0.386699020961393, 1.546796083845573, 0.386699020961393, -0.530330085889911, -0.005524271728020, 0.110485434560398, -0.027621358640100, 0 };
    { offset = -7; 0, 0, 0, 0, 0.088388347648318, -0.353553390593274, 0.530330085889911, -0.353553390593274, 0.088388347648318, 0, 0, 0 };
  };
  sym2 = {
    { offset = -2; -0.129409522551260, 0.224143868042013, 0.836516303737808, 0.482962913144534 };
    { offset = -2; -0.482962913144534, 0.836516303737808, -0.224143868042013, -0.129409522551260 };
  };
  sym3 = {
    { offset = -4; 3.522629188570955e-02, -8.544127388202682e-02, -1.350110200102549e-01, 4.598775021184916e-01, 8.068915093110930e-01, 3.326705529500829e-01 };
    { offset = -2; -3.326705529500829e-01, 8.068915093110930e-01, -4.598775021184916e-01, -1.350110200102549e-01, 8.544127388202682e-02, 3.522629188570955e-02 };
  };
}

local inv_filters = {
  db1 = filters.db1;
  db2 = filters.db2;
  db3 = filters.db3;
  ["spline2:2"] = {
    { offset = -2; 0, 0.353553390593274, 0.707106781186548, 0.353553390593274, 0, 0 };
    { offset = -4; 0, -0.176776695296637, -0.353553390593274, 1.060660171779821, -0.353553390593274, -0.176776695296637 };
  };
  ["spline4:4"] = {
    { offset = -5; 0, 0, 0, 0.088388347648318, 0.353553390593274, 0.530330085889911, 0.353553390593274, 0.088388347648318, 0, 0, 0, 0 };
    { offset = -7; 0, 0.027621358640100, 0.110485434560398, 0.005524271728020, -0.530330085889911, -0.386699020961393, 1.546796083845573, -0.386699020961393, -0.530330085889911, 0.005524271728020, 0.110485434560398, 0.027621358640100 };
  };
  sym2 = filters.sym2;
  sym3 = filters.sym3;
}

local filter = filters[scheme]
if not filter then
  scheme = "db1"
  filter = filters[scheme]
end
local filter_c = filter[1]
local filter_d = filter[2]
local filter_n = #filter_c
assert(filter_n == #filter_d)

local inv_filter = assert(inv_filters[scheme])
local inv_filter_c = inv_filter[1]
local inv_filter_d = inv_filter[2]
local inv_filter_n = #inv_filter_c
assert(inv_filter_n == #inv_filter_d)

while true do
  local tag = handle:read(4)
  if not tag then
    break
  end
  local size = string.unpack("<I4", handle:read(4))
  print(tag, size)

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
    print("samples_per_sec", fmt.samples_per_sec)
    print("avg_bytes_per_sec", fmt.avg_bytes_per_sec)
    assert(fmt.block_align == 2)
    print("bits_per_sample", fmt.bits_per_sample)
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

local X = data
local n = #X
local m = math.log(n, 2) - 1
local result = {}
local f = fmt.samples_per_sec

-- volume
local out = assert(io.open(vol_filename, "wb"))

local v_samples = fmt.samples_per_sec / 100
for i = size_before + 1, size_before + size_main, v_samples do
  local m = math.min(size_before + size_main - i - 1, v_samples)
  local v = 0
  for j = 1, m do
    local u = X[i + j - 1]
    v = v + u * u
  end
  v = math.sqrt(v / m)
  out:write((i - size_before - 1) / f, "\t", v, "\n")
end

out:close()

-- 多重解像度解析
for i = 1, m do
  n = n / 2
  local fmin = f / 2
  local fmax = f

  local C = {}                           -- 低周波成分
  local D = { fmin = fmin, fmax = fmax } -- 高周波成分
  f = fmin

  local dmin
  local dmax

  for j = 1, n do
    -- c
    local k = j * 2 - 1 + filter_c.offset
    local c = 0
    for l = 1, filter_n do
      c = c + filter_c[l] * (X[k + l] or 0)
    end

    -- d
    local k = j * 2 - 1 + filter_d.offset
    local d = 0
    for l = 1, filter_n do
      d = d + filter_d[l] * (X[k + l] or 0)
    end

    if not dmin or dmin > d then dmin = d end
    if not dmax or dmax < d then dmax = d end
    C[j] = c
    D[j] = d
  end

  X = C
  D.dmin = dmin
  D.dmax = dmax
  result[i] = D

  print(i, fmin, fmax, dmin, dmax)
end

local C = X
local D = result

local rows
local row_size = 100
for i = 1, m do
  rows = i
  local d = D[i]
  if d.fmax < freq_lower_limit then
    break
  end
end

local t_size = 2048
local t_scale = t_size / size_padded
local t_size_before = math.floor(size_before * t_scale)
local t_size_after = math.floor(size_after * t_scale)
local t_size_main = t_size - t_size_before - t_size_after
local t_freq = fmt.samples_per_sec * t_scale

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

local tsv = assert(io.open(tsv_filename, "wb"))

for i = 1, t_size_main do
  tsv:write("\t", (i - 1) / t_freq)
end
tsv:write "\n"

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

  tsv:write(d.fmin, "-", d.fmax)

  local buffer = {}
  for j = t_size_before + 1, t_size_before + t_size_main do
    local u = v[j]
    tsv:write("\t", u)

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

  tsv:write "\n"

  local buffer = table.concat(buffer)
  for j = (i - 1) * row_size + 1, i * row_size do
    writer:set_row(j, buffer)
  end
end

writer:write_png()

handle:close()
out:close()
tsv:close()

-- db1
-- sqrt(1/2) * [  1, 1 ]
-- sqrt(1/2) * [ -1, 1 ]

--  a
-- -a+b
-- a-(a-b)/2

-- a/2 + b/2  *sqrt(2)
-- -a + b     /sqrt(2)



local X = C

-- 多重解像度合成
for i = #D, 1, -1 do
  local Y = D[i]
  local n = #X
  assert(n == #Y)
  local Z = {}
  for j = 1, n * 2 do
    Z[j] = 0
  end

  for j = 1, n do
    local c = X[j]
    local d = Y[j]

    local k = j * 2 - 1 + inv_filter_c.offset
    for l = 1, inv_filter_n do
      Z[k + l] = (Z[k + l] or 0) + inv_filter_c[l] * c
    end

    local k = j * 2 - 1 + inv_filter_d.offset
    for l = 1, inv_filter_n do
      Z[k + l] = (Z[k + l] or 0) + inv_filter_d[l] * d
    end
  end

  local j = 0
  while true do
    if Z[j] then
      Z[j] = nil
      j = j - 1
    else
      break
    end
  end

  for j = n * 2 + 1, #Z do
    Z[j] = nil
  end

  X = Z
end

local out_data = X

local out = assert(io.open(out_filename, "wb"))

local out_size = (4) + (8 + 16) + (8 + size_main * 2)
out:write("RIFF", string.pack("<I4", out_size), "WAVE")
out:write("fmt ", string.pack("<I4", 16))
out:write(string.pack("<I2I2I4I4I2I2",
    1,
    1,
    fmt.samples_per_sec,
    fmt.samples_per_sec * 2,
    2,
    16))
out:write("data", string.pack("<I4", size_main * 2))
for i = size_before + 1, size_before + size_main do
  out:write(string.pack("<i2", math.floor(out_data[i], 0.5)))
end

out:close()
