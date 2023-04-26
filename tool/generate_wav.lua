-- Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
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
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

-- 無音のwavファイルを生成する
return function (pathname, duration)
  local format_tag = 1
  local channels = 1
  local samples_per_sec = 48000
  local avg_bytes_per_sec = 96000
  local block_align = 2
  local bits_per_sample = 16

  local data_samples = math.floor(duration * samples_per_sec)
  local data_size = data_samples * block_align

  local handle = assert(io.open(pathname, "wb"))

  handle:write "RIFF"
  handle:write(string.pack("<I4", data_size + 36))

  -- 4
  handle:write "WAVE"

  -- 8+16
  handle:write "fmt "
  handle:write(string.pack("<I4", 16))
  handle:write(string.pack("<I2I2I4I4I2I2", format_tag, channels, samples_per_sec, avg_bytes_per_sec, block_align, bits_per_sample))

  -- 8+data_size
  handle:write "data"
  handle:write(string.pack("<I4", data_size))
  for _ = 1, data_samples do
    handle:write(string.pack("<I2", 0))
  end

  handle:close()
end
