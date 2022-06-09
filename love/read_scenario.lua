--[[
  用語集
    小節  measure, bar
    ルビ  ruby
    音声  voice
    行    line
    話者  speaker
    文節  phrase
    音節  syllable
    文    sentence
    節    clause
    句    phrase
    語    word

    分あたりの拍数      beats per minute
    小節あたりの音節数  syllables per measure
]]

local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end


local class = {}

function class.read(filename)
  local handle
  if filename then
    handle = assert(io.open(filename))
  else
    handle = io.stdin
  end

  local _1
  local _2
  local _3
  local _4

  local function match(line, pattern)
    _1, _2, _3, _4 = line:match(pattern)
    return _1, _2, _3, _4
  end

  local beats_per_minute
  local syllables_per_measure
  local measure = 0
  local speaker
  local result = {}

  for line in handle:lines() do
    -- @#...
    -- @beats_per_minute
    -- @syllables_per_measure
    -- @set_measure
    -- @add_measure
    -- @sub_measure
    -- #...
    if match(line, "^@#") or match(line, "^%s*$") then
      -- comment
    elseif match(line, "^@beats_per_minute{(.-)}") then
      beats_per_minute = assert(tonumber(trim(_1)))
    elseif match(line, "^@syllables_per_measure{(.-)}") then
      syllables_per_measure = assert(tonumber(trim(_1)))
    elseif match(line, "^@set_measure{(.-)}") then
      measure = assert(tonumber(trim(_1)))
    elseif match(line, "^@add_measure{(.-)}") then
      measure = measure + assert(tonumber(trim(_1)))
    elseif match(line, "^@sub_measure{(.-)}") then
      measure = measure - assert(tonumber(trim(_1)))
    elseif match(line, "^#(.*)$") then
      speaker = trim(_1)
    else
      local data = {
        beats_per_minute = assert(beats_per_minute);
        syllables_per_measure = assert(syllables_per_measure);
        measure = assert(measure);
        speaker = assert(speaker);
        duration = 0;
      }
      measure = measure + 1

      local p = 1
      local n = #line

      -- @d{duration}
      local i, j, payload = line:find("^@d{(.-)}", p)
      if i then
        data.duration = assert(tonumber(trim(payload)))
        p = j + 1
      end

      -- @r...@{ruby}
      -- @R...@{ruby|voice}
      -- @v...@{voice}
      while true do
        local i, j, command, text, payload = line:find("@([rRv])(.-)@{(.-)}", p)
        if i then
          if p < i then
            local payload = trim(line:sub(p, i - 1))
            data[#data + 1] = { text = payload, voice = payload }
          end
          if command == "r" then
            local payload = trim(payload)
            data[#data + 1] = { text = text, ruby = payload, voice = payload }
          elseif command == "R" then
            local ruby, voice = assert(payload:match "(.-)|(.*)")
            data[#data + 1] = { text = text, ruby = trim(ruby), voice = trim(voice) }
          elseif command == "v" then
            data[#data + 1] = { text = text, voice = trim(payload) }
          else
            error "unknown command"
          end
          p = j + 1
        else
          if p < n then
            local payload = trim(line:sub(p, n))
            data[#data + 1] = { text = payload, voice = payload }
          end
          break
        end
      end
      result[#result + 1] = data

    end
  end

  handle:close()

  return result
end

return class
