# クラウド設計メモ

- [x] AWSCLIv2を更新する。
- [x] vaporoid.comの既存コンテンツを更新する。
  - macでやるとUnicode正規化で死ぬので注意
- [x] cloudfrontでSSLの設定をする
- [ ] /sys/index.htmlとgame.htmlはキャッシュしない
  - https://repost.aws/ja/knowledge-center/prevent-cloudfront-from-caching-files
- [ ] 圧縮のテスト
- [ ] キャッシュのテスト
- [ ] /./という文字列をserialで置き換える
  - demeter.jsはかえなくていいかな。

```
/index.html
/sys
  /game.html
  /index.html
  /system/{serial}/...
  /voice/{serial}/
  /music/{serial}/
```

