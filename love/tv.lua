#! /usr/bin/env lua

--[[

4:3の数列を作る

]]

local R = 455.0
local W = 254.5
local H = 199.0

local HW = W / 2
local HH = H / 2

local XDEG = math.asin(HW / R)
local YDEG = math.asin(HH / R)

local NW = 24
local NH = 16

for j = -NH, NH do
  for i = -NW, NW do
    local xdeg = XDEG * i / NW
    local ydeg = YDEG * j / NH
    local x = math.sin(xdeg) * R
    local y = math.sin(ydeg) * R
    local z = math.sqrt(R^2 - (x^2 + y^2))
    print(x / 100, z/ 100, y / 100)
  end
end
