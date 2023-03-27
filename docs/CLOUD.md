# クラウド設計メモ

- [x] AWSCLIv2を更新する。
- [x] vaporoid.comの既存コンテンツを更新する。
  - macでやるとUnicode正規化で死ぬので注意
- [x] cloudfrontでSSLの設定をする
- [ ] index.htmlはキャッシュしない
  - https://repost.aws/ja/knowledge-center/prevent-cloudfront-from-caching-files

```
/index.html
/sys
  /game.html
  /index.html
  /{serial}/...
  /voices/{serial}/
  /musics/{serial}/
```

