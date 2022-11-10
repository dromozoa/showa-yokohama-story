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

local operators = {
  ["=="] = function (a, b) return a == b end;
  ["~="] = function (a, b) return a ~= b end;
  ["<="] = function (a, b) return a <= b end;
  [">="] = function (a, b) return a >= b end;
  ["<"] = function (a, b) return a < b end;
  [">"] = function (a, b) return a > b end;
}

local function parse_expression(expression)
  local operator, v = assert(expression:match "^%s*([=~<>]+)%s*(.*)$")
  local operator = assert(operators[operator])
  local v = assert(tonumber(v))
  return function (u) return operator(u, v) end
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

--------------------------------------------------------------------------------

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

  if global_sum_area > 0 then
    line_data.gx = global_moment_x / global_sum_area
    line_data.gy = global_moment_y / global_sum_area
  end

  -- 行の重心から、最小二乗法で軸となる直線x=ay+bを求める。
  local sum_x = 0
  local sum_y = 0
  local sum_xy = 0
  local sum_yy = 0
  local n = 0

  for _, line in ipairs(line_data) do
    if line.gx then
      local x = line.gx
      local y = line.gy
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
  for _, line in ipairs(line_data) do
    if not line.gx then
      line.gx = a * line.gy + b
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

local function write_line_data(line_data, result_pathname)
  local handle = assert(io.open(result_pathname, "wb"))
  handle:write(([[
<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">
]]):format(line_data.width, line_data.height, line_data.width, line_data.height), [[
<defs>
  <radialGradient id="gradient">
    <stop offset="0%" stop-color="#f00" stop-opacity="1" />
    <stop offset="100%" stop-color="#f00" stop-opacity="0" />
  </radialGradient>
  <style>
    rect {
      fill: #666;
    }
    circle {
      fill: url(#gradient);
    }
    line {
      stroke: #000;
    }
  </style>
</defs>
]])

  for _, line in ipairs(line_data) do
    local y1 = line.y1
    local y2 = line.y2
    for _, segment in ipairs(line) do
      local x1 = segment.x1
      local x2 = segment.x2
      handle:write(([[
<rect x="%.17g" y="%.17g" width="%.17g" height="%.17g"/>
]]):format(x1, y1, x2 - x1, y2 - y1))
    end
  end

  -- 行の重心
  for _, line in ipairs(line_data) do
    if line.gx then
      handle:write(([[
<circle cx="%.17g" cy="%.17g" r="2"/>
]]):format(line.gx, line.gy))
    end
  end

  -- 全体の重心
  if line_data.gx then
    handle:write(([[
<circle cx="%.17g" cy="%.17g" r="8"/>
]]):format(line_data.gx, line_data.gy))
  end

  -- 軸となる直線x=ay+b
  if line_data.axis then
    local a = line_data.axis.a
    local b = line_data.axis.b
    handle:write(([[
<line x1="%.17g" y1="0" x2="%.17g" y2="%d"/>
]]):format(a + b, a * line_data.height + b, line_data.height))
  end

  handle:write '</svg>\n'
  handle:close()
end

--------------------------------------------------------------------------------

local function mapping_line(line1, line2)
  local mapping = { y1 = line1.y1, y2 = line1.y2 }

  if #line1 == 0 then
    local u = line1.gx
    for _, segment2 in ipairs(line2) do
      mapping[#mapping + 1] = { u1 = u, u2 = u, v1 = segment2.x1, v2 = segment2.x2 }
    end
  elseif #line2 == 0 then
    local v = line2.gx
    for _, segment1 in ipairs(line1) do
      mapping[#mapping + 1] = { u1 = segment1.x1, u2 = segment1.x2, v1 = v, v2 = v }
    end
  else
    local am = 0
    for _, segment1 in ipairs(line1) do
      local an = segment1.x2 - segment1.x1
      local a1 = am / line1.n
      local a2 = an / line1.n + a1

      local mapping_start
      local mapping_end
      local mapping_i = #mapping + 1
      local mapping_n = 0

      local bm = 0
      for i, segment2 in ipairs(line2) do
        local bn = segment2.x2 - segment2.x1
        local b1 = bm / line2.n
        local b2 = bn / line2.n + b1

        if not mapping_start then
          if b1 <= a1 and a1 < b2 then
            mapping_start = (a1 - b1) / (b2 - b1) * bn + segment2.x1
          end
        end

        if mapping_start then
          local map = { v1 = mapping_start }
          if b1 < a2 and a2 <= b2 then
            mapping_end = (a2 - b2) / (b2 - b1) * bn + segment2.x2
            map.v2 = mapping_end
          else
            mapping_start = line2[i + 1].x1
            map.v2 = segment2.x2
          end

          map.vn = map.v2 - map.v1
          mapping[#mapping + 1] = map
          mapping_n = mapping_n + map.vn

          if mapping_end then
            break
          end
        end

        bm = bm + bn
      end

      local vm = 0
      for i = mapping_i, #mapping do
        local map = mapping[i]
        local vn = map.vn
        local t1 = vm / mapping_n
        local t2 = vn / mapping_n + t1
        map.u1 = t1 * an + segment1.x1
        map.u2 = t2 * an + segment1.x1
        map.un = map.u2 - map.u1
        vm = vm + vn
      end

      am = am + an
    end
  end

  return mapping
end

--------------------------------------------------------------------------------

local function blend_line(alpha, line1, line2)
  local beta = 1 - alpha
  local mapping = mapping_line(line1, line2)
  local line = { y1 = mapping.y1, y2 = mapping.y2 }
  for _, map in ipairs(mapping) do
    line[#line + 1] = {
      x1 = map.u1 * beta + map.v1 * alpha;
      x2 = map.u2 * beta + map.v2 * alpha;
    }
  end
  return line
end

local function blend_line_(alpha, line1, line2)
  local beta = 1 - alpha
  if #line1 > #line2 then
    return blend_line(beta, line2, line1)
  end

  local line = { y1 = line1.y1, y2 = line1.y2 }

  if #line1 == 0 then
    for _, segment2 in ipairs(line2) do
      line[#line + 1] = {
        x1 = line1.gx * beta + segment2.x1 * alpha;
        x2 = line1.gx * beta + segment2.x2 * alpha;
      }
    end
  else
    local um = 0
    for _, segment2 in ipairs(line2) do
      local un = segment2.x2 - segment2.x1
      local u1 = um / line2.n
      local u2 = un / line2.n + u1

      local mapping = {}
      local mapping_start
      local mapping_end
      local mapping_n = 0

      local vm = 0
      for i, segment1 in ipairs(line1) do
        local vn = segment1.x2 - segment1.x1
        local v1 = vm / line1.n
        local v2 = vn / line1.n + v1

        if not mapping_start then
          if v1 <= u1 and u1 < v2 then
            mapping_start = (u1 - v1) / (v2 - v1) * vn + segment1.x1
          end
        end

        if mapping_start then
          local map = { x1 = mapping_start }
          if v1 < u2 and u2 <= v2 then
            mapping_end = (u2 - v2) / (v2 - v1) * vn + segment1.x2
            map.x2 = mapping_end
          else
            map.x2 = segment1.x2
            mapping_start = line1[i + 1].x1
          end

          map.n = map.x2 - map.x1
          mapping[#mapping + 1] = map
          mapping_n = mapping_n + map.n

          if mapping_end then
            break
          end
        end

        vm = vm + vn
      end

      local m = 0
      for _, map in ipairs(mapping) do
        local n = map.n
        local t1 = m / mapping_n
        local t2 = n / mapping_n + t1
        line[#line + 1] = {
          x1 = map.x1 * beta + (t1 * un + segment2.x1) * alpha;
          x2 = map.x2 * beta + (t2 * un + segment2.x1) * alpha;
        }
        m = m + n
      end

      um = um + un
    end
  end

  return line
end

local function blend_line_data(alpha, line_data1, line_data2)
  if not line_data1 then
    return blend_line_data(1 - alpha, assert(line_data2))
  end

  local line_data = {
    width = line_data1.width;
    height = line_data1.height;
  }

  for i, line1 in ipairs(line_data1) do
    local line2
    if line_data2 then
      line2 = line_data2[i]
    else
      line2 = {
        y1 = line1.y1;
        y2 = line1.y2;
        gx = line1.gx;
        gy = line1.gy;
        n = line1.n;
      }
    end
    line_data[i] = blend_line(alpha, line1, line2)
  end

  return process_line_data(line_data)
end

--------------------------------------------------------------------------------

local commands = {}

function commands.binarize(expression, source_pathname, result_pathname)
  local source_image_data = new_image_data(source_pathname)
  local result_image_data = binarize(source_image_data, parse_expression(expression))
  write_image_data(result_image_data, result_pathname)
end

function commands.scanline(expression, source_pathname, result_pathname)
  local image_data = new_image_data(source_pathname)
  local line_data = scanline(image_data, parse_expression(expression))
  write_line_data(line_data, result_pathname)
end

function commands.blend(expression, alpha, source_pathname1, source_pathname2, result_pathname)
  local expression = parse_expression(expression)
  local line_data1 = scanline(new_image_data(source_pathname1), expression)
  local line_data2 = scanline(new_image_data(source_pathname2), expression)
  local line_data = blend_line_data(tonumber(alpha), line_data1, line_data2)
  write_line_data(line_data, result_pathname)
end

--------------------------------------------------------------------------------

local font
local output_dirpath
local line_dataset = {}

local frame = 0
local show_fps = true
local show_status = true
local running = false
local encoding = false

local noise_base_update = false
local noise_base_x = 0
local noise_base_y = 0
local noise_base_z = 0

local noise_modes = {
  "none";
  "noise/1";
  "noise/2";
  "random/1";
  "random/2";
  "randomNormal/1";
  "randomNormal/2";
}
local noise_mode_index = 1

local color_modes = {
  { { 1, 0, 0 }, { 0, 1, 0 }, { 0, 0, 1 } };
  { { 1, 1, 1 } };
}
local color_mode_index = 1

--------------------------------------------------------------------------------

function love.load(arg)
  local command = commands[arg[1]]
  if command then
    command(table_unpack(arg, 2))
    love.event.quit()
    return
  end

  font = love.graphics.newFont(love.font.newRasterizer("ShareTech-Regular.ttf", 20))
  output_dirpath = arg[2]
  for i = 3, #arg do
    line_dataset[#line_dataset + 1] = scanline(new_image_data(arg[i]), function (a) return a > 0.5 end)
  end
end

function love.draw()
  local M = 120
  local N =  59

  local i = math.floor(frame / M) % (#line_dataset + 1)
  local line_data1 = line_dataset[i]
  local line_data2 = line_dataset[i + 1]

  local f = frame % M
  if f > N then
    f = N
  end
  local t = f / N
  local alpha = (1 - math.cos(math.pi * t)) * 0.5
  local gamma = math.sin(math.pi * t)

  local window_width, window_height = love.window.getMode()

  local scale = 100

  if noise_base_update then
    noise_base_x = window_width * love.math.random()
    noise_base_y = window_width * love.math.random()
    noise_base_z = window_width * love.math.random()
  end

  local noise_mode = noise_modes[noise_mode_index]
  local color_mode = color_modes[color_mode_index]

  local line_data = blend_line_data(alpha, line_data1, line_data2)

  local g = love.graphics
  g.clear()

  g.push()
  g.translate((window_width - line_data.width) * 0.5, (window_height - line_data.height) * 0.5)

  local blend_mode = g.getBlendMode()
  g.setBlendMode "add"
  for _, line in ipairs(line_data) do
    local y1 = line.y1
    local y2 = line.y2

    for _, segment in ipairs(line) do
      for c, color in ipairs(color_mode) do
        local x1 = segment.x1
        local x2 = segment.x2
        local n1 = 0
        local n2 = 0
        if noise_mode == "noise/1" then
          n1 = (love.math.noise(noise_base_x + x1, noise_base_y + y1, noise_base_z + c) - 0.5) * 2
          n2 = n1
        elseif noise_mode == "noise/2" then
          n1 = (love.math.noise(noise_base_x + x1, noise_base_y + y1, noise_base_z + c) - 0.5) * 2
          n2 = (love.math.noise(noise_base_x + x2, noise_base_y + y1, noise_base_z + c) - 0.5) * 2
        elseif noise_mode == "random/1" then
          n1 = (love.math.random() - 0.5) * 2
          n2 = n1
        elseif noise_mode == "random/2" then
          n1 = (love.math.random() - 0.5) * 2
          n2 = (love.math.random() - 0.5) * 2
        elseif noise_mode == "randomNormal/1" then
          n1 = love.math.randomNormal(0.5)
          n2 = n1
        elseif noise_mode == "randomNormal/2" then
          n1 = love.math.randomNormal(0.5)
          n2 = love.math.randomNormal(0.5)
        end
        x1 = x1 + scale * gamma * n1
        x2 = x2 + scale * gamma * n2
        if x1 < x2 then
          g.setColor(color[1], color[2], color[3])
          g.rectangle("fill", x1, y1, x2 - x1, y2 - y1)
        end
      end
    end
  end
  g.setBlendMode(blend_mode)

  g.pop()

  local text_x = 20
  local text_y = 20

  g.setColor(1, 1, 1)
  if show_fps then
    g.print("fps: "..love.timer.getFPS(), font, text_x, text_y)
    text_y = text_y + 30
  end
  if show_status then
    if running then
      g.print("running", font, text_x, text_y)
      text_y = text_y + 30
    end
  end

  if running then
    frame = frame + 1
  end
  if encoding then
    local pathname = ("%s/%04d.png"):format(output_dirpath, frame)
    print("pathname: "..pathname)

    g.captureScreenshot(function (image_data)
      write_image_data(image_data, pathname)
    end)

    frame = frame + 1
    if frame >= M * (#line_dataset + 1) then
      encoding = false
      frame = 0
    end
  end
end

function love.keypressed(key)
  if key == "c" then
    color_mode_index = color_mode_index % #color_modes + 1
    print("color: "..color_mode_index)

  elseif key == "e" then
    if encoding then
      encoding = false
    else
      frame = 0
      show_fps = false
      show_status = false
      running = false
      encoding = true
    end

  elseif key == "f" then
    show_fps = not show_fps

  elseif key == "n" then
    noise_mode_index = noise_mode_index % #noise_modes + 1
    print("noise: "..noise_modes[noise_mode_index])

  elseif key == "s" then
    show_status = not show_status

  elseif key == "space" then
    running = not running
  end
end
