# クラウド設計メモ

- [x] AWSCLIv2を更新する。
- [x] vaporoid.comの既存コンテンツを更新する。
  - macでやるとUnicode正規化で死ぬので注意
- [x] cloudfrontでSSLの設定をする
- [x] /sys/index.htmlとgame.htmlはキャッシュしない
  - https://repost.aws/ja/knowledge-center/prevent-cloudfront-from-caching-files
- [x] /./という文字列をserialで置き換える
- [x] 圧縮のテスト
- [x] キャッシュのテスト
  - demeter.jsはかえなくていいかな。
- [x] バージョンチェック

- [ ] cache-control: no-storeを自前で設定する。
- [ ] 音声のアップロードが遅いからsyncにしちゃう
- [ ] ホームページをつくる
  - [ ] 更新履歴を表示する
  - [ ] iOSの注意書き
- [ ] GitHub Pagesをリダイレクトする

```
/index.html
/sys
  /game.html
  /index.html
  /system/{serial}/...
  /voice/{serial}/
  /music/{serial}/
```

```
/version.json
{
    web: "b3",
}
```

## 音楽のアップロード

```
./tool/upload_music.sh assets/music.txt ../showa-yokohama-story-ext/music s3://dromozoa.com/sys/music/1
```

## 音声のアップロード

下記の方式でやっているが、aws s3 syncでinclude/excludeしたほうが早そう。

```
./tool/upload_voice.sh build/voice s3://vaporoid.com/sys/voice/1
```

## 本体のアップロード

- ビルドの前にmakeしておく必要がある。
- というか、makeのあとにビルド自体まで終わらせておくべき。

```
aws s3 cp --cache-control no-store service-worker.js s3://vaporoid.com/sys/
aws s3 cp --cache-control no-store index.html s3://vaporoid.com/sys/
aws s3 cp --cache-control no-store game.html s3://vaporoid.com/sys/
aws s3 cp --cache-control no-store version.json s3://vaporoid.com/sys/
```

