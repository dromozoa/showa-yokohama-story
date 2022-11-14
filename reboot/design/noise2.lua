#! /usr/bin/env lua

-- Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
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

local N = 32

local function dump_matrix(M)
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

local function make_rshift(n)
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

local function make_lshift(n)
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

-- dump_matrix(M)
-- dump_matrix(make_rshift(3))
