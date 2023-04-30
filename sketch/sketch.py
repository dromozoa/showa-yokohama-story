# Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
#
# This file is part of 昭和横濱物語.
#
# 昭和横濱物語 is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# 昭和横濱物語 is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

import sys
import torch
import torchaudio
import matplotlib.pyplot as plt

print(torchaudio.get_audio_backend())
# torchaudio.set_audio_backend("soundfile")
print(torchaudio.get_audio_backend())

print(torchaudio.info(filepath=sys.argv[1]))

waveform, sample_rate = torchaudio.load(filepath=sys.argv[1])
print(waveform.shape)
print(sample_rate)
