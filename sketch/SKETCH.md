# メモ

## libtorchをダウンロードする

- https://pytorch.org/get-started/locally/
- https://download.pytorch.org/libtorch/cpu/libtorch-macos-2.0.0.zip

## 例を動かす (1)

- https://pytorch.org/cppdocs/installing.html#minimal-example

```
mkdir build
cd build
cmake -G"Unix Makefiles" -DCMAKE_PREFIX_PATH=/opt/libtorch ..
cmake --build . --config Release
./sketch
```

## 例を動かす (2)

- https://pytorch.org/cppdocs/frontend.html
- https://github.com/zalandoresearch/fashion-mnist/

## 音声データ

- wav
- webm, mp3

- pythonだったら
  - librosa
  - torchaudio

- librosaでmfccするかな

### librosa

- [昔のメモ](../docs/DESIGN.md)に書いたようにlibrosaはpipでインストールされている。
- `~/Library/Python/3.9`にインストールされた。

```
pip3 list
# pip自体のupgrade
python3 -m pip install --upgrade pip
# 更新可能なものを表示
pip3 list -o
# librosaを更新
pip3 install -U librosa
```

- macOSの場合、CoreAudioで読むらしい
  - https://pypi.org/project/audioread/

### 分析

| アルゴリズム     | 列数 |
|------------------|-----:|
| MFCC             | 20   |
| メルスペクトラム | 128  |

- デフォルトの設定では512サンプルなので秒数×93.75行になる

## 科白データ

```
voicepeak_dump.lua
```

## データ作成

- `build/voice-lip`以下に用意していく。
- wavをmp3に変換する
- wavで解析したときとmp3で解析したときで、第一フレームで違いがでる
  - mp3のスタートまわりが関連しているのかも
  - そもそもスタート付近をどうするかのパラメーターもある
  - どうせ無音だから無視していい

## C++はおいておいてPythonで書くか

```
pip3 list
pip3 install torch torchvision torchaudio
pip3 install matplotlib
```

- tochaudio, librosaの両方でよいかんじに読む
  - ogg/vorbisがバランスがよさそう


