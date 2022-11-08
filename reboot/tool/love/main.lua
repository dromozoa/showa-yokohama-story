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
  game.frame = 0
  game.silhouette1 = prepare_silhouette(pathname1)
  game.silhouette2 = prepare_silhouette(pathname2)
  game.font = love.graphics.newFont(love.font.newRasterizer("ShareTech-Regular.ttf", 20))
end

function love.load(arg)
  -- love2dはLuaJITなのでtable.unpackでなくunpackを使う。
  local f = assert(class[arg[1]])
  if f(unpack(arg, 2)) then
    love.event.quit()
  end
end

function love.draw()
  local g = love.graphics

  -- 120フレームでアニメーションする。
  local t = (game.frame % 120) / 119
  local p = (1 - math.cos(math.pi * t)) * 0.5
  local silhouette = game.silhouette1
  local scale = 200

  local seed_x = 1000 * love.math.random()
  local seed_y = 1000 * love.math.random()
  local seed_z = 1000 * love.math.random()

  local colors = {
    { 1, 0, 0 };
    { 0, 1, 0 };
    { 0, 0, 1 };
  }

  -- #029D93
  -- local colors = {
  --   { 0x02/0xFF, 0, 0 };
  --   { 0, 0x9D/0xFF, 0 };
  --   { 0, 0, 0x93/0xFF };
  -- }

  g.clear()
  g.setLineWidth(1)
  g.setLineStyle "rough"

  local blend_mode = g.getBlendMode()
  g.setBlendMode "add"
  for j = 1, #silhouette.line_data, 2 do
    local lines = silhouette.line_data[j]
    local y = lines.y
    for i, line in ipairs(lines) do
      for c, color in ipairs(colors) do
        local x1 = line.x1
        local x2 = line.x2
        x1 = x1 + scale * (1 - p) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
        x2 = x2 + scale * (1 - p) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
        g.setColor(color[1] * p, color[2] * p, color[3] * p)
        g.line(x1, y, x2, y)
      end
    end
  end
  g.setBlendMode(blend_mode)

  if game.fps then
    g.setColor(1, 1, 1)
    g.print("FPS: "..love.timer.getFPS(), game.font, 20, 20)
  end

  if game.running then
    game.frame = game.frame + 1
    if game.frame == 120 then
      game.running = false
      game.frame = 119
      local t = love.timer.getTime() - game.start
      game.start = nil
      print("elapsed: "..t)
    end
  end
end

function love.keypressed(key)
  if key == "h" then
    -- vi風のキーバインド
    game.frame = game.frame - 1
  elseif key == "l" then
    -- vi風のキーバインド
    game.frame = game.frame + 1
  elseif key == "f" then
    game.fps = not game.fps
  elseif key == "s" then
    game.running = not game.running
    game.frame = 0
    game.start = love.timer.getTime()
  end
end

function love.quit()
end
