local g = love.graphics

local vt323
local bizudpmincho
local bg
local shader

--[[
https://www.hitachihyoron.com/jp/pdf/1969/05/1969_05_08.pdf
13型カラーブラウン管の寸法が載ってる。
半径 455.0
h 有効高 199.0以上
w 有効幅 254.5以上
d 有効径 295.2以上

https://clemz.io/article-retro-shaders-webgl.html
Retro Shaders with WebGL
]]

function love.load()
  vt323 = assert(g.newFont(assert(love.font.newRasterizer "VT323-Regular.ttf")))
  bizudpmincho = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPMincho-Regular.ttf", 48))))
  bg = assert(g.newImage(assert(love.image.newImageData "map2.png")))
  canvas = assert(g.newCanvas(1280, 720))
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
  g.setCanvas()

  if shader then
    g.setShader(shader)
  end
  g.draw(canvas, 0, 0)
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
