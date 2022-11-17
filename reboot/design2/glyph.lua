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

-- Inkspaceが出力したSVGをFontForgeが扱えるように変換する。

-- 前提
-- 統合されたひとつのpathだけからなる

local source_filename, result_filename = ...
local handle = assert(io.open(source_filename))
local source = handle:read "*a"
handle:close()

-- データは統合されていて、ひとつの<path>だけからなるとする。
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

-- 交差をさけるために先頭のM831,0をM830,0に読みかえる
assert(path_data[1][0] == "M")
assert(path_data[1][1] == 831)
assert(path_data[1][2] == 0)
path_data[1][1] = 830

-- 重複を調べながら出力する
local px
local py
for i, item in ipairs(path_data) do
  local command = item[0]
  local skip
  if command == "Z" then
    skip = px == item.sx and py == item.sy
    px = item.sx
    py = item.sy
  elseif command == "C" then
    local ax, ay, bx, by, cx, cy = table.unpack(item)
    assert(px ~= cx or py ~= cy)
    local same1 = px == ax and py == ay -- 始点と第一制御点が同じ
    local same2 = bx == cx and by == cy -- 終点と第二制御点が同じ

    if same1 then
      if same2 then
        item[0] = "L"
        item[1] = cx
        item[2] = cy
        item[3] = nil
        item[4] = nil
        item[5] = nil
        item[6] = nil
      else
        item[0] = "Q"
        item[1] = bx
        item[2] = by
        item[3] = cx
        item[4] = cy
        item[5] = nil
        item[6] = nil
      end
    elseif same2 then
      item[0] = "Q"
      item[1] = ax
      item[2] = ay
      item[3] = cx
      item[4] = cy
      item[5] = nil
      item[6] = nil
    end

    px = cx
    py = cy
  elseif command == "V" then
    skip = py == item[1]
    py = item[1]
  else
    assert(px ~= item[1] or py ~= item[2])
    px = item[1]
    py = item[2]
  end

  if not skip then
    handle:write(item[0])
    for _, param in ipairs(item) do
      handle:write((" %.17g"):format(param))
    end
    handle:write "\n"
  end
end

handle:write(epilogue)
handle:close()
