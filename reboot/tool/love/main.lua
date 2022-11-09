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

package.path = "../?.lua;"..package.path
local basename = require "basename"
local table_unpack = table.unpack or unpack

--------------------------------------------------------------------------------

local function new_byte_data(pathname)
  -- love.filesystemの外のファイルを扱うためにネイティブ入出力を用いる。
  local handle = assert(io.open(pathname, "rb"))
  local byte_data = love.data.newByteData(handle:read "*a")
  handle:close()
  return byte_data
end

local function new_file_data(pathname)
  return love.filesystem.newFileData(new_byte_data(pathname), basename(pathname))
end

local function new_image_data(pathname)
  return love.image.newImageData(new_file_data(pathname))
end

local function write_image_data(image_data, pathname)
  -- https://love2d.org/wiki/ImageEncodeFormat
  local format = assert(pathname:match "[^.]+$"):lower()
  assert(format == "tga" or format == "png")
  local data = image_data:encode(format)
  local handle = assert(io.open(pathname, "wb"))
  handle:write(data:getString())
  handle:close()
end

--------------------------------------------------------------------------------

local function grayscale(r, g, b, a)
  -- sRGBを仮定してガンマ補正を行った後、輝度を計算する。
  local r, g, b = love.math.gammaToLinear(r * a, g * a, b * a)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
end

local function binarize(image_data, fn)
  -- love.graphicsを使わないのでヘッドレスで処理できる。
  local image_data = image_data:clone()
  image_data:mapPixel(function (x, y, r, g, b, a)
    if (fn(grayscale(r, g, b, a))) then
      return 1, 1, 1, 1
    else
      return 0, 0, 0, 0
    end
  end)
  return image_data
end


local function process_line_data(line_data)
  -- 行の重心と全体の重心を求める。
  local global_moment_x = 0
  local global_moment_y = 0
  local global_sum_area = 0

  for _, line in ipairs(line_data) do
    local moment_x = 0
    local sum_area = 0

    for _, segment in ipairs(line) do
      local x1 = segment.x1
      local x2 = segment.x2
      local x = (x1 + x2) * 0.5
      local area = x2 - x1

      moment_x = moment_x + area * x
      sum_area = sum_area + area
    end

    local y = line.y1 + 0.5

    if sum_area > 0 then
      line.gx = moment_x / sum_area
    end
    line.gy = y
    line.n = sum_area

    global_moment_x = global_moment_x + moment_x
    global_moment_y = global_moment_y + sum_area * y
    global_sum_area = global_sum_area + sum_area
  end

  assert(global_sum_area > 0)
  line_data.gx = global_moment_x / global_sum_area
  line_data.gy = global_moment_y / global_sum_area

  -- 行の重心から、最小二乗法で軸となる直線x=ay+bを求める。
  local sum_x = 0
  local sum_y = 0
  local sum_xy = 0
  local sum_yy = 0
  local n = 0

  for _, lines in ipairs(line_data) do
    if lines.gx then
      local x = lines.gx
      local y = lines.gy
      sum_x = sum_x + x
      sum_y = sum_y + y
      sum_xy = sum_xy + x * y
      sum_yy = sum_yy + y * y
      n = n + 1
    end
  end

  local d = n * sum_yy - sum_y * sum_y
  local a = (n * sum_xy - sum_x * sum_y) / d
  local b = (sum_x * sum_yy - sum_y * sum_xy) / d
  line_data.axis = { a = a, b = b }

  -- 行の重心が割り当てられていない場合、軸から外挿する。
  for _, lines in ipairs(line_data) do
    if not lines.gx then
      lines.gx = a * lines.gy + b
    end
  end

  return line_data
end

local function scanline(image_data, fn)
  -- 画素(i,j)が左上(i,j)が右下(i+1,j+1)の正方形で表されるような座標系を用いる。
  local line_data = {
    width = image_data:getWidth() + 1;
    height = image_data:getHeight() + 1;
  }

  for j = 0, image_data:getHeight() - 1 do
    local line = { y1 = j, y2 = j + 1}
    local x1

    local u = false
    for i = 0, image_data:getWidth() do
      local v = false
      if i < image_data:getWidth() then
        v = fn(grayscale(image_data:getPixel(i, j)))
      end

      if v then
        if not u then
          assert(not x1)
          x1 = i
        end
      elseif u then
        line[#line + 1] = { x1 = x1, x2 = i }
        x1 = nil
      end

      u = v
    end

    line_data[#line_data + 1] = line
  end

  return process_line_data(line_data)
end

--------------------------------------------------------------------------------

local commands = {}

local operators = {
  ["=="] = function (a, b) return a == b end;
  ["~="] = function (a, b) return a ~= b end;
  ["<="] = function (a, b) return a <= b end;
  [">="] = function (a, b) return a >= b end;
  ["<"] = function (a, b) return a < b end;
  [">"] = function (a, b) return a > b end;
}

function commands.binarize(expression, source_pathname, result_pathname)
  local op, b = assert(expression:match "^%s*([=~<>]+)%s*(.*)$")
  local fn = assert(operators[op])
  local b = assert(tonumber(b))

  local source_image_data = new_image_data(source_pathname)
  local result_image_data = binarize(source_image_data, function (a) return fn(a, b) end)
  write_image_data(result_image_data, result_pathname)
end

local function write_line_data(line_data, result_pathname)
  local W = line_data.width
  local H = line_data.height

  local handle = assert(io.open(result_pathname, "wb"))
  handle:write('<svg xmlns="http://www.w3.org/2000/svg" width="', W, '" height="', H, '" viewBox="0 0 ', W, ' ', H, '">\n')
  handle:write [[
<defs>
  <radialGradient id="gravity-center">
    <stop offset="0%" stop-color="#f00" stop-opacity="1" />
    <stop offset="100%" stop-color="#f00" stop-opacity="0" />
  </radialGradient>
  <style>
    rect.line {
      fill: #666;
    }
    circle.gravity-center {
      fill: url(#gravity-center);
    }
    line.axis {
      stroke: #000;
    }
  </style>
</defs>
]]

  for _, lines in ipairs(line_data) do
    local y1 = lines.y1
    local y2 = lines.y2
    for _, line in ipairs(lines) do
      local x1 = line.x1
      local x2 = line.x2
      handle:write('<rect x="', x1, '" y="', y1, '" width="', x2 - x1, '" height="', y2 - y1, '" class="line"/>\n')
    end
  end

  -- 各行の重心
  for _, lines in ipairs(line_data) do
    if lines.gx then
      handle:write('<circle cx="', lines.gx, '" cy="', lines.gy, '" r="2" class="gravity-center"/>\n')
    end
  end

  -- 全体の重心
  if line_data.gx then
    handle:write('<circle cx="', line_data.gx, '" cy="', line_data.gy, '" r="8" class="gravity-center"/>\n')
  end

  -- 軸となる直線x=ay+b
  if line_data.axis then
    local a = line_data.axis.a
    local b = line_data.axis.b
    handle:write('<line x1="', a + b, '" y1="0" x2="', a * H + b, '" y2="', H, '" class="axis"/>\n')
  end

  handle:write '</svg>\n'
  handle:close()
end

function commands.scanline(expression, source_pathname, result_pathname)
  local op, b = assert(expression:match "^%s*([=~<>]+)%s*(.*)$")
  local fn = assert(operators[op])
  local b = assert(tonumber(b))

  local image_data = new_image_data(source_pathname)
  local line_data = scanline(image_data, function (a) return fn(a, b) end)
  write_line_data(line_data, result_pathname)
end

--------------------------------------------------------------------------------

local function blend_lines(alpha, alines, blines)
  local beta = 1 - alpha
  local clines = { y1 = alines.y1, y2 = alines.y2 }
  assert(clines.y1 == blines.y1)
  assert(clines.y2 == blines.y2)

  if #alines == 0 then
    for _, bline in ipairs(blines) do
      local ax = alines.gx
      local an = 0
      local bx = (bline.x1 + bline.x2) * 0.5
      local bn = bline.x2 - bline.x1
      local cx = ax * beta + bx * alpha
      local cn = an * beta + bn * alpha
      clines[#clines + 1] = {
        x1 = cx - cn * 0.5;
        x2 = cx + cn * 0.5;
      }
    end
  else
    local bm = 0
    for _, bline in ipairs(blines) do
      local bn = bline.x2 - bline.x1
      local bs = bm / blines.n
      local be = bn / blines.n + bs

      local segments = {}
      local segment_start
      local segment_n = 0

      local am = 0
      for i, aline in ipairs(alines) do
        local an = aline.x2 - aline.x1
        local as = am / alines.n
        local ae = an / alines.n + as

        -- aがbの始点を含むかどうかを調べる
        if not segment_start then
          if as <= bs and bs < ae then
            segment_start = (bs - as) / (ae - as) * an + aline.x1
          end
        end

        if segment_start then
          -- aがbの終点を含むかどうかを調べる
          if as < be and be <= ae then
            local segment_end = (be - ae) / (ae - as) * an + aline.x2
            local segment = { ax1 = segment_start, ax2 = segment_end }
            segments[#segments + 1] = segment
            segment.n = segment.ax2 - segment.ax1
            segment_n = segment_n + segment.n
            break
          else
            local segment = { ax1 = segment_start, ax2 = aline.x2 }
            segments[#segments + 1] = segment
            segment.n = segment.ax2 - segment.ax1
            segment_n = segment_n + segment.n
            segment_start = alines[i + 1].x1
          end
        end

        am = am + an
      end

      local sm = 0
      for i, segment in ipairs(segments) do
        local sn = segment.n
        local ss = sm / segment_n
        local se = sn / segment_n + ss
        segment.bx1 = ss * bn + bline.x1
        segment.bx2 = se * bn + bline.x1

        local x1 = segment.ax1 * beta + segment.bx1 * alpha
        local x2 = segment.ax2 * beta + segment.bx2 * alpha
        clines[#clines + 1] = {
          x1 = x1;
          x2 = x2;
        }

        sm = sm + sn
      end

      bm = bm + bn
    end
  end

  return clines
end

local function blend(alpha, A, B)
  if B then
    assert(#A == #B)
  end

  local C = {
    width = A.width;
    height = B.height;
  }
  for i, a in ipairs(A) do
    if B then
      local b = B[i]
      if #a < #b then
        C[i] = blend_lines(alpha, a, b)
      else
        C[i] = blend_lines(1 - alpha, b, a)
      end
    end
  end

  return C
end

function commands.blend(expression, alpha, source_pathname1, source_pathname2, result_pathname)
  local op, b = assert(expression:match "^%s*([=~<>]+)%s*(.*)$")
  local fn = assert(operators[op])
  local b = assert(tonumber(b))

  local line_data1 = scanline(new_image_data(source_pathname1), function (a) return fn(a, b) end)
  local line_data2 = scanline(new_image_data(source_pathname2), function (a) return fn(a, b) end)
  local line_data = blend(tonumber(alpha), line_data1, line_data2)
  write_line_data(line_data, result_pathname)
end

--------------------------------------------------------------------------------

local font
local show_fps = false
local frame = 0
local running = false
local line_dataset = {}

--------------------------------------------------------------------------------

function love.load(arg)
  local command = commands[arg[1]]
  if command then
    command(table_unpack(arg, 2))
    love.event.quit()
    return
  end

  font = love.graphics.newFont(love.font.newRasterizer("ShareTech-Regular.ttf", 20))
  for i = 2, #arg do
    line_dataset[#line_dataset + 1] = scanline(new_image_data(arg[i]), function (a) return a > 0.5 end)
  end
end

function love.draw()
  local M = 180
  local N =  60

  local i = math.floor(frame / M) % #line_dataset + 1
  local line_data1 = line_dataset[i]
  local line_data2 = line_dataset[i + 1] or line_dataset[1]

  local f = frame % M
  if f >= N then
    f = N - 1
  end
  local t = f / (N - 1)
  local alpha = (1 - math.cos(math.pi * t)) * 0.5
  local gamma = math.sin(math.pi * t)

  local scale = 100

  local colors = {
    { 1, 0, 0 };
    { 0, 1, 0 };
    { 0, 0, 1 };
  }

  local seed_x = 1000 * love.math.random()
  local seed_y = 1000 * love.math.random()
  local seed_z = 1000 * love.math.random()

  local line_data = blend(alpha, line_data1, line_data2)

  local g = love.graphics
  g.clear()

  local W, H = love.window.getMode()
  g.push()
  g.translate((W - line_data.width) * 0.5, (H - line_data.height) * 0.5)

  local blend_mode = g.getBlendMode()
  g.setBlendMode "add"
  for _, lines in ipairs(line_data) do
    local y1 = lines.y1
    local y2 = lines.y2
    for _, line in ipairs(lines) do
      for c, color in ipairs(colors) do
        local x1 = line.x1
        local x2 = line.x2
        x1 = x1 + scale * gamma * (love.math.noise(seed_x * x1, seed_y * y1, seed_z * c) - 0.5) * 2
        x2 = x2 + scale * gamma * (love.math.noise(seed_x * x2, seed_y * y1, seed_z * c) - 0.5) * 2
        g.setColor(color[1], color[2], color[3])
        g.rectangle("fill", x1, y1, x2 - x1, y2 - y1)
      end
    end
  end
  g.setBlendMode(blend_mode)

  g.pop()

  local text_x = 20
  local text_y = 20

  g.setColor(1, 1, 1)
  if show_fps then
    g.print("FPS: "..love.timer.getFPS(), font, text_x, text_y)
    text_y = text_y + 30
  end

  if running then
    frame = frame + 1
  end
end

function love.keypressed(key)
  if key == "f" then
    show_fps = not show_fps
  elseif key == "s" then
    running = not running
  end
end

--------------------------------------------------------------------------------

--[====[
古いコード

local class = {}
local game = {}

local function prepare_silhouette(pathname)
  local image_data = new_image_data(pathname)

  local line_data = scanline(image_data, function (y) return y > 0.5 end)
  local image = love.graphics.newImage(image_data)
  return {
    pathaname = pathaname;
    line_data = line_data;
    image_data = image_data;
    image = image;
  }
end

function class.play(...)
  game.frame = 0
  game.silhouettes = {...}
  for i, pathname in ipairs(game.silhouettes) do
    game.silhouettes[i] = prepare_silhouette(pathname)
  end
  game.font = love.graphics.newFont(love.font.newRasterizer("ShareTech-Regular.ttf", 20))
end

function love.load(arg)
  local command = commands[arg[1]]
  if command then
    command(table_unpack(arg, 2))
    love.event.quit()
    return
  end







  class.play(table_unpack(arg, 2))
end

local function compare_length(a, b)
  local t = a.x2 - a.x1
  local u = b.x2 - b.x1
  if t == u then
    return a.x1 < b.x1
  else
    return t < u
  end
end

local function compare_x(a, b)
  if a.x1 == b.x1 then
    return a.x2 < b.x2
  else
    return a.x1 < b.x1
  end
end

local seed_x = 1000 * love.math.random()
local seed_y = 1000 * love.math.random()
local seed_z = 1000 * love.math.random()
local m = 2
local reseed = true

function love.draw()
  local g = love.graphics

  if reseed then
    seed_x = 1000 * love.math.random()
    seed_y = 1000 * love.math.random()
    seed_z = 1000 * love.math.random()
  end

  local silhouettes = {
    -- { 0, 1 }; { 1, 2 }; { 2, 1 };

    { 0, 1 };
    { 1, 1 };
    { 1, 2 };
    { 2, 2 };
    { 2, 1 };
    { 1, 0 };
    { 0, 2 };
    { 2, 0 };
  }
  local i = math.floor(game.frame / 120)
  local j = i % #silhouettes + 1
  local prev = silhouettes[j][1]
  local this = silhouettes[j][2]
  prev = game.silhouettes[prev]
  this = game.silhouettes[this]

  local t = math.min((game.frame % 120) / 79, 1)
  local p = (1 - math.cos(math.pi * t)) * 0.5
  local q = 1 - p
  local scale = 400

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

  -- local colors = {
  --   { 1, 1, 1 };
  -- }

  local W, H = love.window.getMode()
  g.push()
  g.translate((W - game.silhouettes[1].image_data:getWidth()) * 0.5, (H - game.silhouettes[1].image_data:getHeight()) * 0.5)

  g.clear()
  g.setLineWidth(1)
  g.setLineStyle "rough"

  local blend_mode = g.getBlendMode()
  g.setBlendMode "add"
  if prev and this then
    assert(#prev.line_data == #this.line_data)

    if true then

      for j = 1, #prev.line_data, m do
        local prev_lines = prev.line_data[j]
        local this_lines = this.line_data[j]
        local y = this_lines.y1

        -- どちらかに線分がなければ、中点を基準とする。
        if #this_lines == 0 then
          for i, line in ipairs(prev_lines) do
            for c, color in ipairs(colors) do
              local x1 = line.x1
              local x2 = line.x2
              local x3 = (x1 + x2) * 0.5
              x1 = x3 + (x1 - x3) * q
              x2 = x3 + (x2 - x3) * q
              x1 = x1 + scale * (1 - q) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
              x2 = x2 + scale * (1 - q) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
              g.setColor(color[1] * q, color[2] * q, color[3] * q)
              -- g.setColor(color[1], color[2], color[3])
              g.line(x1, y, x2, y)
            end
          end
        elseif #prev_lines == 0 then
          for i, line in ipairs(this_lines) do
            for c, color in ipairs(colors) do
              local x1 = line.x1
              local x2 = line.x2
              local x3 = (x1 + x2) * 0.5
              x1 = x3 + (x1 - x3) * p
              x2 = x3 + (x2 - x3) * p
              x1 = x1 + scale * (1 - p) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
              x2 = x2 + scale * (1 - p) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
              g.setColor(color[1] * p, color[2] * p, color[3] * p)
              -- g.setColor(color[1], color[2], color[3])
              g.line(x1, y, x2, y)
            end
          end
        else
          local P = {}
          local Q = {}
          for i, line in ipairs(prev_lines) do
            P[i] = { x1 = line.x1, x2 = line.x2 }
          end
          for i, line in ipairs(this_lines) do
            Q[i] = { x1 = line.x1, x2 = line.x2 }
          end

          table.sort(P, compare_length)
          table.sort(Q, compare_length)

          -- 線分が少ないほうのいちばん長い線分を分割する
          while #P < #Q do
            local t = P[#P]
            local x = (t.x1 + t.x2) * 0.5
            local u = { x1 = x, x2 = t.x2 }
            t.x2 = x
            P[#P + 1] = u
            table.sort(P, compare_length)
          end

          while #Q < #P do
            local t = Q[#Q]
            local x = (t.x1 + t.x2) * 0.5
            local u = { x1 = x, x2 = t.x2 }
            t.x2 = x
            Q[#Q + 1] = u
            table.sort(Q, compare_length)
          end

          table.sort(P, compare_x)
          table.sort(Q, compare_x)

          local r = (math.max(p, q) - 0.5) * 2
          -- assert(r >= 0.5)

          for i = 1, #P do
            local prev_line = P[i]
            local this_line = Q[i]

            for c, color in ipairs(colors) do
              local x1 = prev_line.x1 * q + this_line.x1 * p
              local x2 = prev_line.x2 * q + this_line.x2 * p
              x1 = x1 + scale * (1 - r) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
              x2 = x2 + scale * (1 - r) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
              g.setColor(color[1], color[2], color[3])
              g.line(x1, y, x2, y)
            end
          end

        end
      end

    else

      for j = 1, #prev.line_data, m do
        local lines = prev.line_data[j]
        local y = lines.y1
        for i, line in ipairs(lines) do
          for c, color in ipairs(colors) do
            local x1 = line.x1
            local x2 = line.x2
            local x3 = (x1 + x2) * 0.5
            x1 = x3 + (x1 - x3) * q
            x2 = x3 + (x2 - x3) * q
            x1 = x1 + scale * (1 - q) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
            x2 = x2 + scale * (1 - q) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
            g.setColor(color[1] * q, color[2] * q, color[3] * q)
            -- g.setColor(color[1], color[2], color[3])
            g.line(x1, y, x2, y)
          end
        end
      end

      for j = 1, #this.line_data, m do
        local lines = this.line_data[j]
        local y = lines.y1
        for i, line in ipairs(lines) do
          for c, color in ipairs(colors) do
            local x1 = line.x1
            local x2 = line.x2
            local x3 = (x1 + x2) * 0.5
            x1 = x3 + (x1 - x3) * p
            x2 = x3 + (x2 - x3) * p
            x1 = x1 + scale * (1 - p) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
            x2 = x2 + scale * (1 - p) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
            g.setColor(color[1] * p, color[2] * p, color[3] * p)
            g.line(x1, y, x2, y)
          end
        end
      end

    end

  elseif prev then
    for j = 1, #prev.line_data, m do
      local lines = prev.line_data[j]
      local y = lines.y1
      for i, line in ipairs(lines) do
        for c, color in ipairs(colors) do
          local x1 = line.x1
          local x2 = line.x2
          local x3 = (x1 + x2) * 0.5
          x1 = x3 + (x1 - x3) * q
          x2 = x3 + (x2 - x3) * q
          x1 = x1 + scale * (1 - q) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
          x2 = x2 + scale * (1 - q) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
          g.setColor(color[1] * q, color[2] * q, color[3] * q)
          g.line(x1, y, x2, y)
        end
      end
    end
  elseif this then
    for j = 1, #this.line_data, m do
      local lines = this.line_data[j]
      local y = lines.y1
      for i, line in ipairs(lines) do
        for c, color in ipairs(colors) do
          local x1 = line.x1
          local x2 = line.x2
          local x3 = (x1 + x2) * 0.5
          x1 = x3 + (x1 - x3) * p
          x2 = x3 + (x2 - x3) * p
          x1 = x1 + scale * (1 - p) * (love.math.noise(seed_x * x1, seed_y * y, seed_z * c) - 0.5) * 2
          x2 = x2 + scale * (1 - p) * (love.math.noise(seed_x * x2, seed_y * y, seed_z * c) - 0.5) * 2
          g.setColor(color[1] * p, color[2] * p, color[3] * p)
          g.line(x1, y, x2, y)
        end
      end
    end
  end
  g.setBlendMode(blend_mode)
  g.pop()

  if game.fps then
    g.setColor(1, 1, 1)
    g.print("FPS: "..love.timer.getFPS(), game.font, 20, 20)
  end

  if game.running then
    game.frame = game.frame + 1
    -- if game.frame % 120 == 0 then
    --   game.running = false
    --   game.frame = game.frame - 1
    --   local t = love.timer.getTime() - game.start
    --   game.start = nil
    --   print("elapsed: "..t)
    -- end
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
    if game.running then
      game.frame = math.floor((game.frame + 1) / 120) * 120
      game.start = love.timer.getTime()
    end
  end
end

function love.quit()
end

]====]
