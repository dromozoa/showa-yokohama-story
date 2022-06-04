local g = love.graphics

local vt323
local bizudpmincho
local bg
local shader
local mesh

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

  local E = 250.0 -- 眼の距離
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
    x = x * f * scale + tw / 2
    y = y * f * scale + th / 2
    local u = i / xn
    local v = j / yn
    -- print(x, y, u, v)
    return { x, y, u, v }
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

function love.load()
  vt323 = assert(g.newFont(assert(love.font.newRasterizer "VT323-Regular.ttf")))
  bizudpmincho = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPMincho-Regular.ttf", 48))))
  bg = assert(g.newImage(assert(love.image.newImageData "map2.png")))

  local W = g.getWidth()
  local H = g.getHeight()
  canvas = assert(g.newCanvas(W, H))

  mesh = make_mesh(W, H, W, H, 64, 36)
end

function love.draw(dt)
  local x, y, w, h = love.window.getSafeArea()
  local font = bizudpmincho

  g.setCanvas(canvas)
  g.clear()
  g.draw(bg, 0, 0)
  g.printf("しずんでいく夕陽を、じっとながめていた。", font, x + 64, y + 128, w - 48)
  g.printf("おわっていく世界を、じっと見つめていた。", font, x + 64, y + 224, w - 48)
  g.printf("おわっていく昭和を、じっとにらんでいた。", font, x + 64, y + 320, w - 48)
  g.printf("しずんでいく夕陽を、じっとながめていた。", font, x + 64, y + 416, w - 48)
  g.printf("おわっていく世界を、じっと見つめていた。", font, x + 64, y + 512, w - 48)
  g.printf("おわっていく昭和を、じっとにらんでいた。", font, x + 64, y + 608, w - 48)
  g.setCanvas()

  mesh:setTexture(canvas)

  if shader then
    g.setShader(shader)
  end
  -- g.draw(canvas, 0, 0)
  g.draw(mesh, 0, 0)
  if shader then
    g.setShader()
  end
end

function love.keyreleased(key)
  if key == "s" then
    g.captureScreenshot("test.png")
  elseif key == "o" then
    shader = assert(g.newShader "shader.txt")
  elseif key == "c" then
    shader = nil
  end
end
