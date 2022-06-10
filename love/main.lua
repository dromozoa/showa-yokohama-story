local utf8 = require "utf8"
local scenario = require "scenario"

local g = love.graphics
local scenario_data
local scenario_measures
local frames_per_second
local fonts = {}
local background_textures = {}
local canvases = {}
local shaders = {}
local mesh

local function prepare_font(filename, size)
  local key = filename .. "/" .. size
  local font = fonts[key]
  if not font then
    font = assert(g.newFont(assert(love.font.newRasterizer(filename, size))))
    fonts[key] = font
  end
  return font
end

local function prepare_text_chars(text, font)
  local height = font:getHeight()

  local chars = {}
  local width = 0
  for _, code in utf8.codes(text) do
    local char = utf8.char(code)
    local w = font:getWidth(char);
    chars[#chars + 1] = {
      font = font;
      char = char;
      width = w;
      margin_before = 0;
      margin_after = 0;
      height = height;
    }
    width = width + w
  end

  return chars, width
end

local function prepare_text(data, text_font, ruby_font)
  local text_x = 0

  for i = 1, #data do
    local item = data[i]
    local text_chars, text_width = prepare_text_chars(item.text, text_font)
    item.text_chars = text_chars

    if item.ruby then
      local ruby_chars, ruby_width = prepare_text_chars(item.ruby, ruby_font)
      item.ruby_chars = ruby_chars

      -- https://www.w3.org/TR/jlreq/
      -- 非常に素朴なルビの実装
      if text_width >= ruby_width then
        local margin = (text_width - ruby_width) / #ruby_chars / 2
        for j = 1, #ruby_chars do
          local ruby_char = ruby_chars[j]
          ruby_char.margin_before = margin
          ruby_char.margin_after = margin
        end
      else
        -- 前後にルビ一文字ずつはみだしてもよいものとする
        local ruby_width_first = ruby_chars[1].width
        local ruby_width_last = ruby_chars[#ruby_chars].width
        local overhanging_width =  ruby_width_first + ruby_width_last
        if text_width + overhanging_width >= ruby_width then
          ruby_chars[1].margin_before = (text_width - ruby_width) / 2
        else
          ruby_chars[1].margin_before = -overhanging_width / 2
          local margin = (ruby_width - text_width - overhanging_width) / #text_chars / 2
          for j = 1, #text_chars do
            local text_char = text_chars[j]
            text_char.margin_before = margin
            text_char.margin_after = margin
          end
        end
      end

      local ruby_x = text_x
      for j = 1, #ruby_chars do
        local ruby_char = ruby_chars[j]
        ruby_x = ruby_x + ruby_char.margin_before
        ruby_char.cx = ruby_x + ruby_char.width / 2
        ruby_x = ruby_x + ruby_char.width + ruby_char.margin_after
      end
    end

    for j = 1, #text_chars do
      local text_char = text_chars[j]
      text_char.sx = text_x
      text_x = text_x + text_char.margin_before
      text_char.cx = text_x + text_char.width / 2
      text_x = text_x + text_char.width + text_char.margin_after
      text_char.ex = text_x
    end
  end

  data.text_width = text_x
  data.text_height = text_font:getHeight()
end

local function prepare_background_texture(filename)
  local texture = background_textures[filename]
  if not texture then
    texture = assert(g.newImage(assert(love.image.newImageData(filename))))
    background_textures[filename] = texture
  end
  return texture
end

-- sw: 入力画像の幅
-- sh: 入力画像の幅
-- tw: 出力画像の幅
-- th: 出力画像の幅
-- xn: X方向のメッシュ分割数
-- yn: Y方向のメッシュ分割数
local function prepare_mesh(sw, sh, tw, th, xn, yn)
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
  love.keyboard.setKeyRepeat(true)

  for speaker, def in pairs(scenario.speakers) do
    if def.font_filename then
      def.text_font = prepare_font(def.font_filename, def.font_size)
      def.ruby_font = prepare_font(def.font_filename, def.font_size / 2)
    end
  end

  scenario_data, scenario_measures = scenario.read(arg[1])
  for i = 1, #scenario_data do
    local data = scenario_data[i]
    local def = scenario.speakers[data.speaker]
    if def and def.text_font then
      prepare_text(data, def.text_font, def.ruby_font)
    end
  end

  frames_per_second = assert(tonumber(arg[2]))

  for i = 1, #scenario_measures do
    local data = scenario_measures[i]
    data.background_texture = prepare_background_texture(data.background)
  end

  local W = g.getWidth()
  local H = g.getHeight()

  canvases.text_char = g.newCanvas(W, H)
  canvases.text1 = g.newCanvas(W, H)
  canvases.text2 = g.newCanvas(W, H)
  canvases.crt = g.newCanvas(W, H)

  shaders.text = assert(g.newShader "shader-text.txt")
  shaders.crt = assert(g.newShader "shader-crt.txt")

  mesh = prepare_mesh(W, H, W, H, 64, 36)
end

local function copy_color(source, alpha)
  local result = {}
  for i = 1, #source do
    result[i] = source[i]
  end
  if alpha then
    result[4] = alpha
  end
  return result
end

local function draw_text(data, frame)
  local def = scenario.speakers[data.speaker]
  if not (def and def.text_font) then
    return
  end

  if frame == 0 then
    return
  end

  local debug_rectangle = false

  local text_x = 0
  local text_i = 0
  local range_x

  for i = 1, #data do
    local item = data[i]
    local text_chars = item.text_chars
    local ruby_chars = item.ruby_chars
    local ruby_x = text_x

    for j = 1, #text_chars do
      local text_char = text_chars[j]
      local text_alpha = 1

      text_i = text_i + 1
      local k = text_i * 2
      if k == frame then
        text_alpha = 1
        range_x = text_char.ex
      elseif k == frame + 1 then
        text_alpha = 0.5
        range_x = text_char.cx
      end

      text_x = text_x + text_char.margin_before

      local canvas = g.getCanvas()
      if text_alpha < 1 then
        g.setCanvas(canvases.text_char)
        g.clear()
      end

      local border_size = def.font_border_size
      if border_size then
        for dy = -border_size, border_size do
          for dx = -border_size, border_size do
            g.print({ copy_color(def.font_border_color, text_alpha), text_char.char }, text_char.font, text_x + dx, dy)
          end
        end
      end
      g.print({ copy_color(def.font_color, text_alpha), text_char.char }, text_char.font, text_x, 0)
      if debug_rectangle then
        g.setColor { 1, 0, 0, 1 }
        g.rectangle("line", text_x, 0, text_char.width, text_char.height)
        g.setColor { 1, 1, 1, 1 }
      end

      if text_alpha < 1 then
        g.setCanvas(canvas)
        shaders.text:send("alpha", text_alpha)
        g.setShader(shaders.text)
        g.push()
        g.origin()
        g.draw(canvases.text_char, 0, 0)
        g.pop()
        g.setShader()
      end

      text_x = text_x + text_char.width + text_char.margin_after

      if range_x then
        break
      end
    end

    if ruby_chars then
      for j = 1, #ruby_chars do
        local ruby_char = ruby_chars[j]
        if range_x and ruby_char.cx >= range_x then
          break
        end

        ruby_x = ruby_x + ruby_char.margin_before

        local border_size = def.font_border_size
        if border_size then
          for dy = -border_size, border_size do
            for dx = -border_size, border_size do
              g.print({ copy_color(def.font_border_color), ruby_char.char }, ruby_char.font, ruby_x + dx, -24 + dy)
            end
          end
        end
        g.print({ copy_color(def.font_color), ruby_char.char }, ruby_char.font, ruby_x, -24)
        if debug_rectangle then
          g.setColor { 1, 0, 0, 1 }
          g.rectangle("line", ruby_x, -24, ruby_char.width, ruby_char.height)
          g.setColor { 1, 1, 1, 1 }
        end
        ruby_x = ruby_x + ruby_char.width + ruby_char.margin_after
      end
    end

    if range_x then
      break
    end
  end
end

-- フレームは0起源とする
local current_frame = 0
local running
local writing

function love.draw()
  local measure_data
  local measure_frame
  local measure_frame_end

  local time = current_frame / frames_per_second
  for i = 1, #scenario_measures do
    local data = scenario_measures[i]
    if data.time_start <= time and time < data.time_end then
      measure_data = data
      measure_frame = math.floor((time - data.time_start) * frames_per_second + 0.5)
      measure_frame_end = math.floor((data.time_end - data.time_start) * frames_per_second + 0.5)
      break
    end
  end

  if measure_data then
    local render_text = measure_data[1]

    --======================================================================

    if render_text then
      local canvas = g.getCanvas()
      g.setCanvas(canvases.text1)
      g.clear()

      g.push()
      g.translate((g.getWidth() - measure_data.text_width) / 2, (g.getHeight() - measure_data.text_height) / 2)
      draw_text(measure_data, measure_frame)
      g.pop()

      g.setCanvas(canvas)
    end

    --======================================================================

    local canvas = g.getCanvas()
    g.setCanvas(canvases.text2)
    g.clear()

    g.draw(measure_data.background_texture, 0, 0)
    if render_text then
      local n = 16
      local alpha = 1
      if measure_frame >= measure_frame_end - n then
        local beta = (measure_frame_end - measure_frame) / n
        alpha = (math.sin((beta - 0.5) * math.pi) + 1) / 2
      end

      shaders.text:send("alpha", alpha)
      g.setShader(shaders.text)
      g.draw(canvases.text1, 0, 0)
      g.setShader()
    end

    g.setCanvas(canvas)

    --======================================================================

    local canvas = g.getCanvas()
    g.setCanvas(canvases.crt)
    g.clear()

    local seed = current_frame * (1280 * 720 / 3 / 4) % (1280 + 42)
    local scaler = 1

    if measure_data.measure_first then
      local n = 30
      if measure_frame < n then
        if measure_frame == 0 then
          scaler = g.getHeight()
        else
          scaler = (n - measure_frame) * 2
        end
      end
    end
    if measure_data.measure_last then
      local n = 30
      if measure_frame >= measure_frame_end - n then
        if measure_frame == measure_frame_end - 1 then
          scaler = g.getHeight()
        else
          scaler = (measure_frame - measure_frame_end + n + 1) * 2
        end
      end
    end

    shaders.crt:send("seed", seed)
    shaders.crt:send("scaler", scaler)
    g.setShader(shaders.crt)
    g.draw(canvases.text2, 0, 0)
    g.setShader()

    g.setCanvas(canvas)

    --======================================================================

    mesh:setTexture(canvases.crt)
    g.draw(mesh, g.getWidth() / 2, g.getHeight() / 2)

    if writing then
      local filename = ("%08d.png"):format(current_frame)
      g.captureScreenshot(filename)
      print("filename", filename)
    end
  else
    if writing then
      writing = false
      current_frame = 0
    end
  end

  if running or writing then
    current_frame = current_frame + 1
  end
end

function love.keypressed(key)
  if key == "h" then
    if love.keyboard.isDown("lshift", "rshift") then
      current_frame = current_frame - 30
    else
      current_frame = current_frame - 1
    end
    print("current_frame", current_frame)
  elseif key == "l" then
    if love.keyboard.isDown("lshift", "rshift") then
      current_frame = current_frame + 30
    else
      current_frame = current_frame + 1
    end
    print("current_frame", current_frame)
  elseif key == "r" then
    current_frame = 0
    print("current_frame", current_frame)
  elseif key == "s" then
    running = not running
  elseif key == "w" then
    writing = not writing
    current_frame = 0
  end
end
