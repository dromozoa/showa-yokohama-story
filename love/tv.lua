#! /usr/bin/env lua

-- https://www.hitachihyoron.com/jp/pdf/1969/05/1969_05_08.pdf
-- 13型カラーブラウン管の寸法がのってる
-- 5:4？
local R = 455.0
local W = 254.5 -- 有効高
local H = 199.0 -- 有効幅
local D = 295.2 -- 有効径

local HW = W / 2
local HH = H / 2

local XDEG = math.asin(HW / R)
local YDEG = math.asin(HH / R)

local NW = 45
local NH = 36
-- 16:9にする (64:36)
local XW = NH / 9 * 16

local xmax = math.sin(XDEG * XW / NW) * R
local ymax = math.sin(YDEG) * R

local xscale = xmax / 640
local yscale = ymax / 360
local scale = math.min(xscale, yscale)
-- print(scale)
-- os.exit()

for j = -NH, NH do
  for i = -XW, XW do
    local xdeg = XDEG * i / NW
    local ydeg = YDEG * j / NH
    local x = math.sin(xdeg) * R * scale
    local y = math.sin(ydeg) * R * scale
    local z = math.sqrt(R^2 - (x^2 + y^2)) * scale
    print(x / 100, z/ 100, y / 100)
  end
end

