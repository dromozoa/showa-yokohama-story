# アプリ開発

iOSから作る。

## バージョン

- iOSは#iでどうか
- だったら、AndroidはA#か。

## データ

- アプリ分岐用のスクリプト
  - 音声ファイルの拡張子分岐

- `build/ios/sys`にするか、`build/ios/game`にするか
- `build/ios/sys`にしよう。

- 依存フォルダ
- srclib, include, library, dependあたり、他になんかあったかな
- package, module
- assets
- runtime, resource, mirror

## Audio

- Howler.js
  - autoSuspendが無効なら、ctx.suspendしない
  - 再生開始時にctx.resumeするかもしれない
- 出入りで自分でsuspend/resumeするのはあり
- ブラウザの場合、外側で勝手にsuspendされるかも。

## WKWebView

AdMobが対応していない気がするのでMac対応ははずす。

- 参考: https://qiita.com/SNQ-2001/items/d86685481b4697e81e38

## Google AdMob

テスト用のIDを使う。

- 参考: https://developers.google.com/admob/ios/quick-start
- 参考: https://developers.google.com/admob/ios/swiftui

- なんかサイトにテキストをおいとく必要があるらしい。

## バージョン

- iOS
  - https://developer.apple.com/support/app-store/
  - 現在はATTの場合分けをしたくないから、14より後=15.0にしている
- Android
  - 手元の端末が9だからそれ以降ならなんでもいい
  - Defaultが7だったからそれでいいや

## Android

- Empty Views Activity

## タスク

- [x] アイコン
- [x] LaunchScreen
  - 実装しない
- [x] アプリの場合の更新チェック
  - 実装しない
- [x] WKWebViewの背景色
- [x] バージョン文字列
- [x] autoResumeをたたいてみる？
  - Failed to start the audio deviceが出た
  - 廃棄
- [x] AUTO+ロック解除時に声が二重になる？
  - AUTO/SKIPは解除してよいのでは？
  - そうじゃないらしい。
  - Howler.jsはタイマーで終了時刻を計算しているので、けっこうどうしようもない
  - サウンド自体をポーズしてもいいけど、そこまでやる必要があるか？
- [x] ATT
- [x] window open
- [x] 変数の切り出し
  - テストはどうする？

