#! /usr/bin/env lua

-- Copyright (C) 2022,2023 煙人計画 <moyu@vaporoid.com>
--
-- This file is part of 昭和横濱物語.
--
-- 昭和横濱物語 is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- 昭和横濱物語 is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

-- xorshiftのパラメーターを求める

-- https://blog.visvirial.com/articles/575
--[[
  行列を行ごとに整数で表現するらしい

  x ^= x >> 15

  （リトルエンディアンで表記）

  0b 1000 0000 0000 0001 0000 0000 0000 0000
  0b 0100 0000 0000 0000 1000 0000 0000 0000
  0b 0010 0000 0000 0000 0100 0000 0000 0000
      :
  0b 0000 0000 0000 0001 0000 0000 0000 0010
  0b 0000 0000 0000 0000 1000 0000 0000 0001
  0b 0000 0000 0000 0000 0100 0000 0000 0000
      :
  0b 0000 0000 0000 0000 0000 0000 0000 0100
  0b 0000 0000 0000 0000 0000 0000 0000 0010
  0b 0000 0000 0000 0000 0000 0000 0000 0001

  行列の掛け算
]]

local N = ...
N = tonumber(N) or 32

local function dump(M)
  for _, v in ipairs(M) do
    for i = 0, N - 1 do
      if i > 0 then
        io.write " "
      end
      io.write((v >> i) & 1)
    end
    io.write "\n"
  end
end

local function make_lshift(n)
  local M = {}
  for i = 0, N - 1 do
    local v = 1 << i
    local j = n + i
    if j <= N - 1 then
      v = v | 1 << j
    end
    M[#M + 1] = v
  end
  return M
end

local function make_rshift(n)
  local M = {}
  for i = 0, N - 1 do
    local v = 1 << i
    local j = i - n
    if j >= 0 then
      v = v | 1 << j
    end
    M[#M + 1] = v
  end
  return M
end

local function mul(A, B)
  local M = {}
  for i = 1, N do
    M[i] = 0
  end

  for i = 0, N - 1 do
    for j = 0, N - 1 do
      M[i + 1] = M[i + 1] ~ (((A[i + 1] >> j) & 1) * B[j + 1])
    end
  end

  return M
end

local function pow(A, b)
  if b == 0 then
    local M = {}
    for i = 0, N - 1 do
      M[#M + 1] = 1 << i
    end
    return M
  end

  local M = pow(A, b // 2)
  M = mul(M, M)
  if b % 2 == 1 then
    M = mul(M, A)
  end
  return M
end

local function is_identity(M)
  for i = 0, N - 1 do
    if M[i + 1] ~= 1 << i then
      return false
    end
  end
  return true
end

-- 素因数分解しておくとよいらしい
local factors = {
  [0xFFFF] = { 3, 5, 17, 257 };
  [0xFFFFFF] = { 3, 5, 7, 13, 17, 241 };
  [0xFFFFFFFF] = { 3, 5, 17, 257, 65537 };
}

local function check(a, b, c)
  local M = mul(mul(make_rshift(a), make_lshift(b)), make_rshift(c))
  local n = 2^N - 1
  if not is_identity(pow(M, n)) then
    return false
  end
  for _, f in ipairs(factors[n]) do
    if is_identity(pow(M, n // f)) then
      return false
    end
  end
  return true
end

local R3 = {
1, 2, 4, 9, 18, 36, 72, 144, 288, 576, 1152, 2304, 4608, 9216, 18432, 36864,
73728, 147456, 294912, 589824, 1179648, 2359296, 4718592, 9437184, 18874368,
37748736, 75497472, 150994944, 301989888, 603979776, 1207959552, 2415919104
}

local L7 = {
129, 258, 516, 1032, 2064, 4128, 8256, 16512, 33024, 66048, 132096, 264192,
528384, 1056768, 2113536, 4227072, 8454144, 16908288, 33816576, 67633152,
135266304, 270532608, 541065216, 1082130432, 2164260864, 33554432, 67108864,
134217728, 268435456, 536870912, 1073741824, 2147483648
}

local M = {
129, 258, 516, 1161, 2322, 4644, 9288, 18576, 37152, 74304, 148608, 297216,
594432, 1188864, 2377728, 4755456, 9510912, 19021824, 38043648, 76087296,
152174592, 304349184, 608698368, 1217396736, 2434793472, 574619648, 1149239296,
2298478592, 301989888, 603979776, 1207959552, 2415919104
}

-- dump(M)
-- dump(mul(make_rshift(3), make_lshift(7)))

-- dump(R3)
-- dump(make_rshift(3))

-- dump(L7)
-- dump(make_lshift(7))

-- local M = mul(mul(make_rshift(15), make_lshift(17)), make_rshift(13))
-- dump(M)
-- local A = pow(M, 2^N - 1)
-- dump(A)

for a = 0, N - 1 do
  for b = 0, N - 1 do
    for c = 0, N - 1 do
      if a < c and check(a, b, c) then
        print(a, b, c)
      end
    end
  end
end
