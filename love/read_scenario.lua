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

  --[[
    小節 (measure) ごとに分割する
    ルビ (ruby) と音声 (voice) は分ける
    圏点はなし

    データ構造
    行 (line=measure)

    行のなかで、話者 (speaker) は変えられるようにする？
    →変えられないとする
    →かわりに、時間を調整できるようにする

    小節ごとの音節数
      @beats_per_minute{80}
      @syllables_per_measure{24}
      @set_measure{0}
      @add_measure{-1}
      @sub_measure{-1}
      @duration{7}

    文節 (phrase)
    音節 (syllable)

    文 (sentence)
    節 (clause)
    句 (phrase)
    語 (word)

    ルビのほうがややこしい

    ブロック
      #speaker
      @measure_max{}
      @measure{}

    インライン
      @r...@{...}
      @v...@{...}
      @rv...@{...|...}
  ]]








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
