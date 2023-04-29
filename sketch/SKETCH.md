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

