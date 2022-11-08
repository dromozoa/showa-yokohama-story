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

-- love.filesystemの外側のファイルを扱いたいので自前でファイルを読む。
-- love.graphicsを使わないのでヘッドレスで処理できる。
local function new_image_data(pathname)
  local handle = assert(io.open(pathname, "rb"))
  local byte_data = love.data.newByteData(handle:read "*a")
  handle:close()
  local file_data = love.filesystem.newFileData(byte_data, pathname)
  local image_data = love.image.newImageData(file_data)
  return image_data
end

local function save_image_data(image_data, pathname)
  local data = image_data:encode "png"
  local handle = assert(io.open(pathname, "wb"))
  handle:write(data:getString())
  handle:close()
end

local class = {}
local game = {}

function class.image_to_svg(source_pathname, target_pathname)
  local image_data = new_image_data(source_pathname)

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
  return true
end

function class.binarize(source_pathname, target_pathname)
  local image_data = new_image_data(source_pathname)

  local w = image_data:getWidth()
  local h = image_data:getHeight()

  for j = 0, h - 1 do
    for i = 1, w - 1 do
      local r, g, b, a = image_data:getPixel(i, j)
      local y = 0.2126 * r + 0.7152 * g + 0.0722 * b
      if y < 0.5 then
        r, g, b, a = 1, 1, 1, 1
      else
        r, g, b, a = 0, 0, 0, 0
      end
      image_data:setPixel(i, j, r, g, b, a)
    end
  end

  save_image_data(image_data, target_pathname)
  return true
end

local function prepare_silhouette(pathname)
  local image_data = new_image_data(pathname)

  local w = image_data:getWidth()
  local h = image_data:getHeight()

  local line_data = {}
  for j = 0, h - 1 do
    local lines = { y = j }
    local start

    local u
    for i = 0, w - 1 do
      local r, g, b, a = image_data:getPixel(i, j)
      local v = 0.2126 * r + 0.7152 * g + 0.0722 * b
      if i > 0 then
        if u < 0.5 then
          if v >= 0.5 then
            assert(not start)
            start = i
          end
        else
          if v < 0.5 then
            lines[#lines + 1] = { x1 = start, x2 = i }
            start = nil
          end
        end
      end
      u = v
    end

    line_data[j + 1] = lines
  end

  local image = love.graphics.newImage(image_data)
  return {
    line_data = line_data;
    image_data = image_data;
    image = image;
  }
end

function class.play(pathname1, pathname2)
  game.frame = 1
  game.silhouette1 = prepare_silhouette(pathname1)
  game.silhouette2 = prepare_silhouette(pathname2)
end

function love.load(arg)
  -- love2dはLuaJITなのでtable.unpackでなくunpackを使う。
  local f = assert(class[arg[1]])
  if f(unpack(arg, 2)) then
    love.event.quit()
  end
end

function love.draw(dt)
  local g = love.graphics

  -- 1 2 3 4 4 3 2 1

  local F = { 4, 3, 2, 1, 1, 2, 3, 4 }

  local f = F[game.frame % 8 + 1]
  local s = game.silhouette1

  g.clear()
  g.push()
  g.setColor(0.25 * f, 0.25 * f, 0.25 * f)
  g.setLineWidth(1)
  g.setLineStyle "rough"
  for j = 1, #s.line_data, f do
    local lines = s.line_data[j]
    for i, line in ipairs(lines) do
      g.line(line.x1, lines.y, line.x2, lines.y)
    end
  end
  g.pop()

  -- if game.frame % 2 == 1 then
  --   g.draw(game.silhouette1.image)
  -- else
  --   g.draw(game.silhouette2.image)
  -- end
end

function love.keypressed(key)
  -- vi風のキーバインド
  if key == "h" then
    game.frame = game.frame - 1
  elseif key == "l" then
    game.frame = game.frame + 1
  end
end

function love.quit()
end
