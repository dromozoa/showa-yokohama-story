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

-- 元はFontForgeで扱えるようなSVGの生成が目的だったが、favicon.svgのサイズを減
-- らすことに目的が変わった。

-- 統合されたひとつのpathだけからなるという前提で、パスデータのサイズを減らす。

local source_filename, result_filename = ...
local handle = assert(io.open(source_filename))
local source = handle:read "*a"
handle:close()

local prologue, path_data_string, epilogue = assert(source:match [[^(.-<path[^>]*d=")([^"]+)("[^>]/>.*)$]])

-- 手元のデータで出てきた命令だけ実装する。
local nparams_table = {
  M = 2;
  m = 2;
  Z = 0;
  z = 0;
  L = 2;
  l = 2;
  v = 1;
  C = 6;
  c = 6;
}

local path_data = {}
for command, params_string in path_data_string:gmatch "(%a)(%A*)" do
  local params = {}
  for param in params_string:gmatch "[%-%.%d]+" do
    params[#params + 1] = assert(tonumber(param))
  end
  local nparams = assert(nparams_table[command], "undefined command "..command)
  if nparams == 0 then
    assert(#params == 0)
    path_data[#path_data + 1] = { [0] = command }
  else
    assert(#params > 0)
    assert(#params % nparams == 0)
    for i = 1, #params, nparams do
      if i > 1 then
        if command == "M" then
          command = "L"
        elseif command == "m" then
          command = "l"
        end
      end
      path_data[#path_data + 1] = { [0] = command, table.unpack(params, i, i + nparams - 1) }
    end
  end
end

-- 相対命令を絶対命令に変換する
local sx
local sy
local px
local py
for i, item in ipairs(path_data) do
  local command = item[0]
  if command == "M" then
    px = item[1]
    py = item[2]
    assert(not sx and not sy)
    sx = px
    sy = py
  elseif command == "m" then
    -- 先頭の相対mはMと同じ
    if i == 1 then
      px = 0
      py = 0
    end
    item[0] = "M"
    item[1] = px + item[1]
    item[2] = py + item[2]
    px = item[1]
    py = item[2]
    assert(not sx and not sy)
    sx = px
    sy = py
  elseif command == "Z" then
    assert(sx and sy)
    item.sx = sx
    item.sy = sy
    px = sx
    py = sy
    sx = nil
    sy = nil
  elseif command == "z" then
    item[0] = "Z"
    item.sx = sx
    item.sy = sy
    px = sx
    py = sy
    sx = nil
    sy = nil
  elseif command == "L" then
    px = item[1]
    py = item[2]
  elseif command == "l" then
    item[0] = "L"
    item[1] = px + item[1]
    item[2] = py + item[2]
    px = item[1]
    py = item[2]
  elseif command == "v" then
    item[0] = "V"
    item[1] = py + item[1]
    py = item[1]
  elseif command == "C" then
    px = item[5]
    py = item[6]
  elseif command == "c" then
    item[0] = "C"
    item[1] = px + item[1]
    item[2] = py + item[2]
    item[3] = px + item[3]
    item[4] = py + item[4]
    item[5] = px + item[5]
    item[6] = py + item[6]
    px = item[5]
    py = item[6]
  end
end

-- 座標を整数にまるめる
for _, item in ipairs(path_data) do
  local command = item[0]
  if command == "Z" then
    item.sx = math.floor(item.sx + 0.5)
    item.sy = math.floor(item.sy + 0.5)
  end
  for i, param in ipairs(item) do
    item[i] = math.floor(param + 0.5)
  end
end

local handle = assert(io.open(result_filename, "w"))
handle:write(prologue)

local px
local py
for i, item in ipairs(path_data) do
  local command = item[0]
  local skip
  if command == "M" then
    assert(px ~= item[1] or py ~= item[2])
    handle:write("M", item[1], ",", item[2])
    px = item[1]
    py = item[2]
  elseif command == "Z" then
    -- 始点と同一であれば閉じない
    if px ~= item.sx or py ~= item.sy then
      handle:write "Z"
    end
    px = item.sx
    py = item.sy
  elseif command == "L" then
    assert(px ~= item[1] or py ~= item[2])
    handle:write("L", item[1], ",", item[2])
    px = item[1]
    py = item[2]
  elseif command == "V" then
    assert(py ~= item[1])
    handle:write("V", item[1])
    py = item[1]
  elseif command == "C" then
    local ax, ay, bx, by, cx, cy = table.unpack(item)
    assert(px ~= cx or py ~= cy)
    handle:write("C", ax, ",", ay, " ", bx, ",", by, " ", cx, ",", cy)
    px = cx
    py = cy
  end
end

handle:write(epilogue)
handle:close()
