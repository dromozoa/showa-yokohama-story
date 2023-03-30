# ビルドメモ

## 開発中のビルドプロセス

### 音声の生成と変換

1. `make`する。
2. VOICEPEAKで`build/voice.txt`を開く。
3. VOICEPEAKで`build/voice-out.vpp`に保存する。
4. `make`する。
5. VOICEPEAKで`build/voice-out.vpp`を開く。
6. VOICEPEAKで`build/voice-out`以下に出力する。
7. `make convert_voice`する。

### バージョン設定

1. `versions`ファイルを修正する。
2. `make`する。

### リリースビルド

1. `make`する。
2. `make build`する。

## 音楽のアップロード

```
make deply_music_dry_run
make deply_music_execute
```

## 音声のアップロード

```
make deploy_voice_dry_run
make deploy_voice_execute
```

## システムのアップロード

```
make deploy_system_dry_run
make deploy_system_execute
```

## 本体のアップロード

```
make deploy_dry_run
make deploy_execute
```

## ウォーミングアップ

一度アクセスしてみる。意味があるかどうかわからない。

```
./tool/warm.sh sys/system/3/
./tool/warm.sh sys/voice/2/
```
