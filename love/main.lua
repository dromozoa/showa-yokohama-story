local utf8 = require "utf8"
local scenario = require "scenario"

local g = love.graphics
local fonts = {}

local DATA = {
  {
    text = "うちすてられた";
  },
  {
    text = "校舎";
    ruby = "こうしゃ";
  },
  {
    text = "。しのびこんだ。";
  },
  {
    text = "屋上";
    ruby = "おくじょう";
  },
  {
    text = "で。";
  },
}

local function prepare_text_chars(text, font)
  local height = font:getHeight()

  local chars = {}
  for _, code in utf8.codes(text) do
    local char = utf8.char(code)
    chars[#chars + 1] = {
      char = char;
      width = font:getWidth(char);
      height = height;
    }
  end

  return chars
end

local function prepare_text(data, text_font, ruby_font)
  for i = 1, #data do
    local item = data[i]
    item.text_chars = prepare_text_chars(item.text, text_font)
    if item.ruby then
      item.ruby_chars = prepare_text_chars(item.ruby, ruby_font)
    end
  end
end

function love.load(arg)
  local scenario_filename = arg[1]
  if scenario_filename then
    scenario_data = scenario.read(scenario_filename)
  end
  fonts.BIZUDPMincho_Regular_24 = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPMincho-Regular.ttf", 24))))
  fonts.BIZUDPMincho_Regular_48 = assert(g.newFont(assert(love.font.newRasterizer("BIZUDPMincho-Regular.ttf", 48))))
  prepare_text(DATA, fonts.BIZUDPMincho_Regular_48, fonts.BIZUDPMincho_Regular_24)
end

function love.update(dt)
end

function love.draw()
  -- 1280

  local data = DATA

  local text_width = 0
  for i = 1, #data do
    local item = data[i]
    local text_chars = item.text_chars
    for j = 1, #text_chars do
      local char = text_chars[j]
      g.print({ { 1, 1, 1, 1 }, char.char }, fonts.BIZUDPMincho_Regular_48, text_width, 24)

      g.setColor({ 1, 0, 0, 1 })
      g.rectangle("line", text_width, 24, char.width, char.height)
      g.setColor({ 1, 1, 1, 1 })

      text_width = text_width + char.width
    end
  end
end

function love.keyreleased(key)
  if key == "a" then
  end
end
