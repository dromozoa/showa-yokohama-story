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
import numpy
import librosa
import torch
import torchaudio
import matplotlib.pyplot as plt

y, nr = librosa.load(sys.argv[1], sr=None)
S = librosa.feature.melspectrogram(y=y, sr=nr)
S_db = librosa.power_to_db(S, ref=numpy.max)
plt.imshow(S_db)
plt.show()
