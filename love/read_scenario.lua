local function trim(s)
  return (s:gsub("^%s+", ""):gsub("%s+$", ""))
end

return function (filename)
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

  local measure = 0
  local speaker_name
  local result = {}

  for line in handle:lines() do
    if match(line, "^@#") or match(line, "^%s*$") then
      -- comment
    elseif match(line, "^@skip{(.-)}") then
      -- skip measure
      measure = measure + assert(tonumber(trim(_1)))
    elseif match(line, "^#(.*)$") then
      speaker_name = trim(_1)
    else
      local data = {
        measure = measure;
        speaker_name = speaker_name;
      }
      measure = measure + 1
      local p = 1
      local n = #line
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
            error "unsupported"
            local payload = trim(payload)
            data[#data + 1] = { text = text, ruby = payload, voice = payload }
          elseif command == "R" then
            error "unsupported"
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
