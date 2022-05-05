#! /usr/bin/env lua

local json = require "dromozoa.commons.json"

local data = {}

local _1
local _2
local _3
local _4

local function match(line, pattern)
  _1, _2, _3, _4 = line:match(pattern)
  return _1, _2, _3, _4
end

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

local sections = {}
local section_map = {}
local section
local page

for line in io.lines() do
  if match(line, "^@#") then
    -- コメント

  elseif match(line, "^@=(.*)$") then
    local label = trim(_1)
    section = { label = label, pages = {} }
    sections[#sections + 1] = section
    section_map[label] = section

  elseif match(line, "^%s*$") then
    if page then
      local pages = section.pages
      pages[#pages + 1] = page
      page = nil
    end

  elseif match(line, "@case{(.-)}(.*)$") then
    local label = trim(_1)
    local text = trim(_2)
    local cases = page.cases
    if not cases then
      cases = {}
      page.cases = cases
    end
    cases[#cases + 1] = { label = label, text = text }

  elseif match(line, "@case(.*)$") then
    local text = trim(_1)
    local cases = page.cases
    if not cases then
      cases = {}
      page.cases = cases
    end
    cases[#cases + 1] = { label = text, text = text }

  elseif match(line, "@jump{(.-)}(.*)$") then
    local label = trim(_1)
    page.jump = label

  elseif match(line, "^#%s*(.-)%s*$") then
    assert(not page)
    page = { speaker = trim(_1), lines = {} }

  else
    local data = {}
    local p = 1
    local n = #line
    while true do
      local i, j, text, ruby = line:find("@{ruby}(.-)@{/ruby(.-)}", p)
      if i then
        if p < i then
          data[#data + 1] = { text = line:sub(p, i - 1) }
        end
        data[#data + 1] = { text = text, ruby = ruby }
        p = j + 1
      else
        if p < n then
          data[#data + 1] = { text = line:sub(p, n) }
        end
        break
      end
    end
    local lines = page.lines
    lines[#lines + 1] = data
  end
end

if page then
  local pages = section.pages
  pages[#pages + 1] = page
  page = nil
end


print(json.encode(sections, { pretty = true, stable = true }))
