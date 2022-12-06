-- Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
--
-- This file is part of 昭和横濱物語.
--
-- 昭和横濱物語 is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- 昭和横濱物語 is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

local source_filename = ...

-- Voicepeakが出力したwav (pcm_s16le) を読む。
local function read_wav(handle)
  assert(handle:read(4) == "RIFF")
  local file_size = string.unpack("<I4", handle:read(4))
  assert(handle:read(4) == "WAVE")

  local fmt = {}
  local data = {}

  while true do
    local tag = handle:read(4)
    if not tag then
      break
    end
    local size = string.unpack("<I4", handle:read(4))
    if tag == "fmt " then
      fmt = {}
      fmt.format_tag,
      fmt.channels,
      fmt.samples_per_sec,
      fmt.avg_bytes_per_sec,
      fmt.block_align,
      fmt.bits_per_sample = string.unpack("<I2I2I4I4I2I2", handle:read(size))
      assert(fmt.format_tag == 1)
      assert(fmt.channels == 1)
      assert(fmt.block_align == 2)
    elseif tag == "data" then
      for i = 1, size / fmt.block_align do
        data[i] = string.unpack("<i2", handle:read(2))
      end
    else
      handle:seek("cur", size)
    end
  end

  return fmt, data
end

--[[
  実験により、16722音節で2131秒の出力を得た。平均は127ミリ秒/音節となる。

                44100Hz  48000Hz
    2^9    512  0.012ms  0.011ms
    2^10  1024  0.023ms  0.021ms
    2^11  2048  0.046ms  0.043ms
    2^12  4096  0.093ms  0.085ms

  librosaのMFCCを使う際は、デフォルトの512サンプルで問題なさそう。
]]

-- wavを読む実験
--
-- local handle = assert(io.open(source_filename, "rb"))
-- local fmt, data = read_wav(handle)
-- handle:close()

-- サンプル数ごとに分割する実験。ffmpegで変換して解析する。
-- ffmpeg -y -f s16le -r:a 44100 -i source.raw result.wav
--
-- local nsamples = 2048
-- for i = 1, math.ceil(#data / nsamples) do
--   local result_filename = ("nsamples2048-%04d.raw"):format(i)
--   local handle = assert(io.open(result_filename, "wb"))
--   for j = (i - 1) * nsamples + 1, math.min(#data, i * nsamples) do
--     handle:write(string.pack("<i2", data[j]))
--   end
--   handle:close()
-- end
