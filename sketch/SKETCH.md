# メモ

## libtorchをダウンロードする

- https://pytorch.org/get-started/locally/
- https://download.pytorch.org/libtorch/cpu/libtorch-macos-2.0.0.zip

## 例を動かす

- https://pytorch.org/cppdocs/installing.html#minimal-example

```
mkdir build
cd build
/Applications/CMake.app/Contents/bin/cmake -G"Unix Makefiles" -DCMAKE_PREFIX_PATH=/opt/libtorch ..
/Applications/CMake.app/Contents/bin/cmake --build . --config Release
./sketch
```



