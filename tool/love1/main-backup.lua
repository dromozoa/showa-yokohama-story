local utf8 = require "utf8"
local read_scenario = require "read_scenario"

local g = love.graphics

local scenario
local vt323
local bizudpmincho
local bizudpgothic
local bg
local shader
local mesh
local use_mesh

local texts = {
"壁にかこまれた横濱。本牧地区。";
"うちすてられた校舎。しのびこんだ屋上で。";
"銀蝿した肉まんを、ほおばってボクたちは";
"しずんでいく夕陽を、じっとながめていた。";
"おわっていく世界を、じっと見つめていた。";
"おわっていく昭和を、じっとにらんでいた。";
}

local text_buffer = table.concat(texts, "\n") .. "\n"
local text_length = utf8.len(text_buffer)

local do_writer = false
local frame = 0

--[[
https://clemz.io/article-retro-shaders-webgl.html
Retro Shaders with WebGL
]]

-- sw: 入力画像の幅
-- sh: 入力画像の幅
-- tw: 出力画像の幅
-- th: 出力画像の幅
-- xn: X方向のメッシュ分割数
-- yn: Y方向のメッシュ分割数
local function make_mesh(sw, sh, tw, th, xn, yn)
  -- https://www.hitachihyoron.com/jp/pdf/1969/05/1969_05_08.pdf
  -- 13型カラーブラウン管の寸法
  -- 5:4比のディスプレイとして扱う
  local R = 455.0
  local W = 254.5 -- 有効高
  local H = 199.0 -- 有効幅
  local D = 295.2 -- 有効径

  local E = 500.0 -- 眼の距離
  local F = 45 / (180 * math.pi) -- 視野角

  local XDEG = math.asin(W / 2 / R)
  local YDEG = math.asin(H / 2 / R)

  -- 射影変換行列を求める
  local px = math.sin(XDEG * (sw / sh) / (5 / 4)) * R
  local py = 0
  local pz = math.sqrt(R^2 - (px^2 + py^2))
  local pf = pz / (R + E)

  local qx = 0
  local qy = H / 2
  local qz = math.sqrt(R^2 - (qx^2 + qy^2))
  local qf = qz / (R + E)

  -- 拡大縮小率の計算
  -- local W2 = math.sin(XDEG * (sw / sh) / (5 / 4)) * R * 2
  -- local scale = math.min(tw / W2, th / H)
  local scale = math.min(tw / (px * 2 * pf), th / (qy * 2 * qf))

  -- 角度計算の分母
  local xn2 = yn * (5 / 4)

  local function make_vertex(i, j)
    local xdeg = XDEG * (i - xn / 2) / (xn2 / 2)
    local ydeg = YDEG * (j - yn / 2) / (yn / 2)
    local x = math.sin(xdeg) * R
    local y = math.sin(ydeg) * R
    local z = math.sqrt(R^2 - (x^2 + y^2))
    local f = z / (R + E)
    local u = i / xn
    local v = j / yn
    -- 視線と法線の角度を求める
    local ax = -x
    local ay = -y
    local az = R + E - z
    local bx = ay * z - az * y
    local by = az * x - ax * z
    local bz = ax * y - ay * x
    local angle = math.atan2(math.sqrt(bx^2 + by^2 + bz^2), ax * x + ay * y + az * z)

    x = x * f * scale -- + tw / 2
    y = y * f * scale -- + th / 2
    return { x, y, u, v, 1, 1, 1, math.cos(angle) }
  end

  local vertices = {}

  for j = 1, yn do
    for i = 1, xn do
      -- p1 p2
      -- p3 p4
      local p1 = make_vertex(i - 1, j - 1)
      local p2 = make_vertex(i + 0, j - 1)
      local p3 = make_vertex(i - 1, j + 0)
      local p4 = make_vertex(i + 0, j + 0)

      vertices[#vertices + 1] = p2
      vertices[#vertices + 1] = p1
      vertices[#vertices + 1] = p4
      vertices[#vertices + 1] = p3
      vertices[#vertices + 1] = p4
      vertices[#vertices + 1] = p1
    end
  end

  return g.newMesh(vertices, "triangles")
end

function love.load(arg)
  local scenario_filename = arg[1]
  if scenario_filename then
    scenario = read_scenario(scenario_filename)
  end

  vt323 = assert(g.newFont(assert(love.font.newRasterizer "VT323-Regular.ttf")))
  bizudpmincho = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPMincho-Regular.ttf", 48))))
  bizudpgothic = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPGothic-Regular.ttf", 48))))
  bg = assert(g.newImage(assert(love.image.newImageData "map4.png")))

  local W = g.getWidth()
  local H = g.getHeight()
  canvas1 = assert(g.newCanvas(1280, 720))
  canvas2 = assert(g.newCanvas(1280, 720))

  mesh = make_mesh(W, H, W, H, 64, 36)
end

function love.update(dt)
end

function love.draw()
  local x, y, w, h = love.window.getSafeArea()
  local font = bizudpmincho

  ------------------------------------------------------------------------

  g.setCanvas(canvas1)
  g.clear()

  g.draw(bg, 0, 0)
  dx = 32
  dy = 32

  local char_length = math.floor(frame / 2)
  if char_length > 0 then
    char_length = math.min(text_length, char_length)
    local char_offset = utf8.offset(text_buffer, char_length)
    -- print(text_buffer:sub(1, char_offset - 1))
    local text = text_buffer:sub(1, char_offset - 1)
    g.setColor(0, 0, 0, 1)
    for ey = -2, 2 do
      for ex = -2, 2 do
        g.printf(text, font, x + dx + ex, y + dy + ey, w - 48)
      end
    end
    -- g.printf(text, font, x + dx + d, y + dy + 0, w - 48)
    -- g.printf(text, font, x + dx + 0, y + dy + d, w - 48)
    -- g.printf(text, font, x + dx - d, y + dy - 0, w - 48)
    -- g.printf(text, font, x + dx - 0, y + dy - d, w - 48)

    g.setColor(1, 1, 1, 1)
    g.printf(text, font, x + dx, y + dy, w - 48)
    -- for j = 1, #texts do
    --   g.printf(texts[j], font, x + dx, y + dy + 96 * (j - 1), w - 48)
    -- end
  end

  -- local sr, sg, sb, sa = g.getColor()
  -- g.setColor(0, 0, 0, 1)
  -- for y = 3, 720, 4 do
  --   g.line(0, y, 1280, y)
  -- end
  -- g.setColor(sr, sg, sb, sa)

  g.setCanvas()

  ------------------------------------------------------------------------

  g.setCanvas(canvas2)
  g.clear()
  if shader then
    local seed = frame * (1280 * 720 / 3 / 4) % (1280 + 42)
    -- seed = frame * 69.1742 % 1280
    -- seed = (seed + 69) % 10000
    -- shader_seed = (shader_seed * (977 / 997) + 991) % 1000
    local scaler = 1
    if frame < 30 then
      scaler = (30 - frame) * 2
    end
    shader:send("seed", seed)
    shader:send("scaler", scaler)
    g.setShader(shader)
  end
  g.draw(canvas1, 0, 0)
  if shader then
    g.setShader()
  end
  g.setCanvas()

  ------------------------------------------------------------------------

  if use_mesh then
    mesh:setTexture(canvas2)
    local s = 1
    -- local s = math.abs(math.sin(frame / 30 * math.pi))
    -- if frame < 15 then
    --   s = math.sin(frame / 30 * math.pi)
    -- end
    g.push()
    g.scale(1, s)
    g.draw(mesh, 640, 360 / s)
    g.pop()
  else
    g.draw(canvas2, 0, 0)
  end

  if do_writer then
    local filename = ("%08d.png"):format(frame)
    print("captureScreenshot", filename)
    g.captureScreenshot(filename)
  end

  frame = frame + 1
end

function love.keyreleased(key)
  if key == "s" then
    g.captureScreenshot("test.png")
  elseif key == "o" then
    shader = assert(g.newShader "shader.txt")
  elseif key == "c" then
    shader = nil
  elseif key == "m" then
    use_mesh = not use_mesh
  elseif key == "w" then
    do_writer = not do_writer
    frame = 0
    shader_seed = 0
  elseif key == "r" then
    frame = 0
    shader_seed = 0
  end
end
