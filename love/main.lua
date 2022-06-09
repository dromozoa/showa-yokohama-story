local utf8 = require "utf8"
local scenario = require "scenario"

local g = love.graphics
local fonts = {}

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

function love.load(arg)
  for speaker, def in pairs(scenario.speakers) do
    if def.font_filename then
      def.text_font = prepare_font(def.font_filename, def.font_size)
      def.ruby_font = prepare_font(def.font_filename, def.font_size / 2)
    end
  end

  local scenario_filename = arg[1]
  if scenario_filename then
    scenario_data = scenario.read(scenario_filename)
    for i = 1, #scenario_data do
      local data = scenario_data[i]
      local speaker = data.speaker
      local def = scenario.speakers[speaker]
      if def and def.text_font then
        prepare_text(data, def.text_font, def.ruby_font)
      end
    end
  end
end

function love.update(dt)
end

local frame

function love.draw()
  local data = scenario_data[1]

  if frame then
    frame = frame + 1
  end

  local text_x = 0
  local text_i = 0
  local range_x

  g.push()
  g.translate((g.getWidth() - data.text_width) / 2, (g.getHeight() - data.text_height) / 2)

  for i = 1, #data do
    local item = data[i]
    local text_chars = item.text_chars
    local ruby_chars = item.ruby_chars
    local ruby_x = text_x

    for j = 1, #text_chars do
      local text_char = text_chars[j]
      local text_alpha = 1

      text_i = text_i + 1
      if frame then
        local k = text_i * 2
        if k == frame then
          text_alpha = 1
          range_x = text_char.ex
        elseif k == frame + 1 then
          text_alpha = 0.25
          range_x = text_char.cx
        end
      end

      text_x = text_x + text_char.margin_before
      g.print({ { 1, 1, 1, text_alpha }, text_char.char }, text_char.font, text_x, -24)
      g.setColor({ 1, 0, 0, 1 })
      g.rectangle("line", text_x, -24, text_char.width, text_char.height)
      g.setColor({ 1, 1, 1, 1 })
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
        g.print({ { 1, 1, 1, 1 }, ruby_char.char }, ruby_char.font, ruby_x, -48)
        g.setColor({ 1, 0, 0, 1 })
        g.rectangle("line", ruby_x, -48, ruby_char.width, ruby_char.height)
        g.setColor({ 1, 1, 1, 1 })
        ruby_x = ruby_x + ruby_char.width + ruby_char.margin_after
      end
    end

    if range_x then
      break
    end
  end

  g.pop()
end

function love.keyreleased(key)
  if key == "a" then
    if frame then
      frame = nil
    else
      frame = 0
    end
  end
end
