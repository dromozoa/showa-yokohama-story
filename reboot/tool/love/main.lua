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

local function image_to_svg(source_pathname, target_pathname)
  -- love.filesystemの外側のファイルを扱いたいので自前でファイルを読む。
  -- love.graphicsを使わないのでヘッドレスで処理できる。
  local handle = assert(io.open(source_pathname, "rb"))
  local byte_data = love.data.newByteData(handle:read "*a")
  handle:close()
  local file_data = love.filesystem.newFileData(byte_data, source_pathname)
  local image_data = love.image.newImageData(file_data)

  local w = image_data:getWidth()
  local h = image_data:getHeight()
  local n = 0

  local handle = assert(io.open(target_pathname, "wb"))

  handle:write('<svg width="', w, '" height="', h, '" viewBox="0 0 ', w, " ", h, '">\n')
  for j = 0, h - 1 do
    local lines = {}
    local start
    local u = image_data:getPixel(0, j)
    for i = 1, w - 1 do
      local v = image_data:getPixel(i, j)
      if u < 0.5 then
        if v >= 0.5 then
          -- line開始
          start = i
        end
      else
        if v < 0.5 then
          -- line終了
          lines[#lines + 1] = { start, i }
        end
      end
      u = v
    end
    if lines[1] then
      handle:write('<path d="')
      for _, line in ipairs(lines) do
        handle:write("M", line[1], " ", j, "L", line[2], " ", j)
      end
      handle:write('"/>\n')
    end
  end
  handle:write '</svg>\n'

  handle:close()
end

function love.load(arg)
  -- love2dはLuaJITなのでtable.unpackでなくunpackを使う。
  -- image_to_svg(unpack(arg))
  -- love.event.quit()

end

function love.draw()
end

function love.quit()
end
