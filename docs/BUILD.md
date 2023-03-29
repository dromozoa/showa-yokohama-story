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
