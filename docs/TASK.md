# タスクリスト

## エラー記録

```
23:10:06.510 検出: 見過ごされた拒否 TypeError: textAnimations is undefined
    next http://localhost/sys/system/demeter.js:3369
    initializeMainScreen http://localhost/sys/system/demeter.js:2921
demeter-preferences.js:35:33

23:10:06.520 Uncaught (in promise) TypeError: textAnimations is undefined
    next http://localhost/sys/system/demeter.js:3369
    initializeMainScreen http://localhost/sys/system/demeter.js:2921
demeter.js:3369:3
    next http://localhost/sys/system/demeter.js:3474
    initializeMainScreen http://localhost/sys/system/demeter.js:2921
    InterpretGeneratorResume self-hosted:1822
    AsyncFunctionNext self-hosted:810
```

```
15:43:06.069 検出: 見過ごされた拒否 TypeError: textAnimations is undefined
    next http://localhost/sys/system/demeter.js:3614
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
    next http://localhost/sys/system/demeter.js:3716
demeter-preferences.js:35:33
```

スキップの連続で流していたら発生。
```
[Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'textAnimations[paragraphLineNumber - 1]')
	（anonymous関数） (demeter.js:3698)
	asyncFunctionResume
	（anonymous関数） (demeter.js:3183)
	asyncFunctionResume
	（anonymous関数）
	promiseReactionJobWithoutPromise
	promiseReactionJob
```

## 完了タスク

- ビルド

- シナリオ

- システム
  - [x] ヒストリのクリアをタイトルでする
  - [x] ニューゲームのメッセージがヒストリに追加されない
    - [x] ヒストリへの追加タイミングの問題
  - [x] ヒストリのiOSのぼよよんをなくす
    - overscroll-behaviorでどうにかならないかな？
  - [x] ヒストリへの追加タイミングをいじったせいで空の段落が見えるように
  - [x] ずっとスキップしているとmacのSafariで30fpsくらいになった
    - DOM操作をまとめてやれば？
      - 改善された
      - 一旦作成すると、見えていなくてもDOM要素量が全体のパフォーマンスに影響している
      - 上限を決める
    - [x] 上限をすぐに反映する
  - [x] スキップ中にトロフィー (50%) をとるといったん止まる
    - awaitしてるから。

- ウェブページ

- デバッグ
  - [x] iOSでD.onResizeがないというエラー
    - iOS以外でも発生（そりゃそうだ）
  - [x] Edgeでスクロールバーが出る問題
    - [x] クレジット画面
    - [x] ヒストリ画面
  - [x] iOSでSKIP中のわりこみの反応が遅い
    - [x] SKIP中は音声をautoloadしない実験をする
      - 遅延構築にした
    - [x] SKIP中は音声を遅延構築する
      - ちょっとよくなったきはする。
    - もうちょっとゆっくりやるか
      - タップ処理にすりぬけが発生している
    - 待ち時間を決める。

## タスク

- ビルド
  - [ ] ビルド時のチェックツール
    - VOICEPEAKの操作をミスったときに検出したい
  - [ ] デプロイ前のチェックツール

- シナリオ
  - [x] SKIPのチュートリアルを修正
    - 「一秒に十行」
  - [ ] リヴァイアサン戦後の尺をのばす

- システム
  - [ ] 音声ファイルの通信タイムアウトを決める
    - タイムアウトしたとき、Howler.jsではひろえないっぽい

  - [ ] 既読がなんかおかしいような気がする
    - 再現はできなかった
    - 段落追加の可能性があるか？
    - シナリオは追加しか行われていなかった
    - 既読管理がおかしかったとか？
  - [ ] ヒストリ画面でフォーカスをあてる
  - [ ] スクリーンのトランジションアニメーション
  - [ ] オートセーブ情報から、タイトル画面で流す音楽を決められる？
  - [ ] 既読リセット
  - [ ] スタート画面の入力待ち
  - [ ] モバイルでスクロールを禁止する？
    - touchイベント
    - そこまでやる必要はないかも
  - [ ] 既読率100%をテストする
  - [ ] 既読率0%をテストする
  - [ ] ログレベル設定
  - [ ] スクリプトを圧縮する。
  - [ ] エラー通報
  - [ ] 一瞬表示の停止
    - スタート画面でセーブしてロードしたとき、一瞬、メイン画面が見える
  - [ ] オフライン用のダウンロード
  - [ ] バージョンアップと既読率について考える
    - [ ] 既読率の計算方式を変更
    - 段落の削除時に実装すればよい
  - [ ] キーボードナビゲーション
    - マウスとのコンフリクションを要検討
  - [ ] ゲームパッド対応
    - マウスとのコンフリクションを要検討
  - [ ] クレジットの速度設定

- ウェブページ
  - [ ] ツイッターカード
  - [ ] アプリケーションインストール

- デバッグ
  - [ ] textAnimationsがundefinedになるタイミングがある
    - スキップ中のわりこみで発生した？
      - 単純には発生しなかった
  - [ ] iOSで表示がおかしくなる問題
    - 背景のtransformがきいていない状態になる
    - canvasもおかしくなる
      - 他のページやアプリにいってもどるとときどき発生
        - 再現手順は不明
      - contextはロストしていないように見える
      - Canvasのスタイルが聴いていない状態になる
        - 黒で描かれる
    - [ ] 検出方法を検討する
    - [ ] Canvasをつくりなおす
  - [ ] iOSで音が出なくなる問題
    - iOSで表示がおかしくなると、音も出なくなる
    - suspend/resumeでなおらず

