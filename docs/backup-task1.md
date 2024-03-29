# タスクリスト

## エラー記録（対応済み）

```
 Uncaught TypeError: waitForDialog is not a function
    initializeDialogOverlay http://localhost/sys/system/demeter.js:3591
    clickButton http://localhost/sys/system/demeter.js:4166
    onKeydown http://localhost/sys/system/demeter.js:4439
    onDOMContentLoaded http://localhost/sys/system/demeter.js:4522
    async* http://localhost/sys/system/demeter-game.js:33
    <anonymous> http://localhost/sys/system/demeter-game.js:38
demeter.js:3591:98
```

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

選択肢で連打。
```
[Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'textAnimations[paragraphLineNumber - 1]')
	（anonymous関数） (demeter.js:3871)
	asyncFunctionResume
```

```
[Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'textAnimations[paragraphLineNumber - 1]')
	（anonymous関数） (demeter.js:3875)
	asyncFunctionResume
```

## エラー記録

ヒストリだしたりしてたんだっけ？
```
[Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'choices.length')
	（anonymous関数） (demeter.js:3510)
	asyncFunctionResume
	（anonymous関数）
	promiseReactionJobWithoutPromise
	promiseReactionJob
```

## 完了タスク

- ビルド

- シナリオ
  - [x] SKIPのチュートリアルを修正
    - 「一秒に十行」
  - [x] Edgeで「スキップ行送り時間 [ms]」がはみだす（なぜ？）
    - 文言を変えて対応
  - [x] ゲームパッド対応
    - マウスとのコンフリクションを要検討
    - [x] Bのふるまい
    - [x] Howler.jsの開始をゲームパッドにフックできないかな
      - ちょっと実験したかんじではアンロックできなかった
  - [x] クレジットのフォントの順序。
  - [x] LOADとロードの統一を検討する
    - そのまま
  - [x] チュートリアルのエンターキーははずして、別ページにする？
    - そのまま
    - エンターキー連打は意味があるよね、っていう

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
  - [x] 音声ファイルの通信タイムアウトを決める
    - タイムアウトしたとき、Howler.jsではひろえないっぽい
    - autoloadを切って、load/onload/onloaderrorを拾う
    - onloadが成功したら再生する
    - autoload経由でやると、つながったときにめっちゃ再生された
    - [x] ServiceWorkerでタイムアウトさせる
    - タイムアウト時間を概算する
      - ファイルの最大サイズ
        - webm: 150KiB
        - mp3: 180KiB
      - 低速3G
        - レイテンシ: 0.4s
        - 帯域: 500Kbps
        - 結果: 3.24s
      - 高速3G
        - レイテンシ: 0.15s
        - 帯域: 1.6Mbps = 1638.4Kbps
        - 結果: 1.03s
      - DNSなど、そのほかも考慮する
  - [x] onloaderrorのエラーコードを変換する
  - [x] キーボードナビゲーション
    - マウスとのコンフリクションを要検討
      - [x] マウスイベントを監視
    - マウスとキーボードのイベントで上のほうにclassをつける
      - [x] 効果音
  - [x] hoverできるかどうかでクリック時の挙動を変える
    - [x] mouseenterから無視しちゃう（hoverの代替と考える）
  - [x] Chromeでscrollintoviewがうまく効いていない
    - keydownでpreventDefault
  - [x] ヒストリ画面でフォーカスをあてる
    - キーボード操作を実装したので不要
  - [x] iOSのホーム画面に登録したときのtwitterの挙動
    - navigator.standaloneを限定して使う模様
    - 特になにもやらないことにする。
  - [x] マウスでクリックしたら、フォーカスははずれるべき？
    - キーボード操作をしない限り、mouseleaveではずれるからいいことにする
  - [x] タイトルにもEscapeをいれる
  - [x] キーの整理（イベントを直接渡す）
  - [x] Escapeは全画面からの戻りと対応しちゃうから、Ctrl-Cあたりもいれる？
    - Backspaceにした。
  - [x] ダイアログ・選択肢の際のフォーカスの整理
    - 画面に入るたび、unsetFocusを呼ぶ
    - マウスだったら
      - onMouseEnterでunsetFocusを呼んでから、その要素にフォーカスをあてる
      - onMouseLeaveでその要素のフォーカスをはずす
    - ダイアログでボタンがクリックされたら、unsetFocusを呼ぶ
      - ここがポイント
      - ダイアログ表示をマウス／キーボード
      - ダイアログボタンをマウス／キーボード
      - ダイアログはfocusのスタックをとる？
      - キーボードでダイアログ表示したら、選択がのこってほしい
      - マウスでダイアログ表示したら、その時点で残っていい。
      - ダイアログでボタンをクリック（する前にmouseenterする）と、フォーカスがはずれる
      - ダイアログはCSSのホバーにしよう。
  - [x] 選択肢の場合のunsetFocusは？
    - 選択肢表示の前にunsetfocusする
    - 選択肢をえらんだ時点でまたunsetfocusされる
  - [x] lil-guiのキーボード操作対応
    - [x] TODO対応
    - [x] メインメニューの上下の開始点をまんなかにする
    - [x] キーボードのスペースも選択につかえるようにする
    - [x] システム設定のうえにいるときのエンターの挙動
    - [x] numberの値のまるめ
    - [x] historyで更新ダイアログが出た場合
  - [x] フルスクリーンのエラーをひろう
    - WebKitが特殊？
  - [x] open/closeSystemUi前後の処理順序を整理する
    - [x] soundEffectも
      - やることが決まったら鳴らす。
      - 再生開始までに時間がかかるかもしれないから。
  - [x] ゲームパッドの連射
  - [x] タイトルのボタンが3個の場合の移動を調整する
  - [x] 二重入力
  - [x] デバッグモードを隠す
    - INSERT 30 ...を30回。
  - [x] user-select, pointer-events, cursorの関係を整理する
    - テキストカーソルになるかどうかはブラウザによる？
    - ログとクレジット以外はuser-select: noneをかける
      - 段落テキストはかけなくてもいいけど、クリック可能なので……
    - ボタンのラベルではpointer-eventsが必要
    - クリック可能ならばcursorを設定
    - タイトルと類似テキストをどうするかが残る
      - これらのカーソル形状をどうするか
      - safari以外はuser-selectを設定した時点でテキスト選択でなくなる気がする
      - safari用に設定する必要はあるか？
        - Mobile Safariではどちらにせよ、カーソルは表示されない
    - [x] 必須の設定を行う
    - [x] 調整する
    - [x] ログを選択可能にする
      - user-selectは子要素を選択不可にするので、bodyでしかけていると、子要素で打ち消せないらしい。
    - [x] クレジットを選択可能にする
  - [x] 効果音を確認する
  - [x] クレジットからの移動は初期位置がある
  - [x] lil-guiでmonoはつかわれていない？
    - input[type='text']で使われるらしい
    - つまり、使われている
  - [x] オートセーブ情報から、タイトル画面で流す音楽を決められる？
    - 意味を感じないので却下
  - [x] 自動再生が有効な場合にunlockをスキップする
    - 自動再生って音がちいさいような？
    - 自動再生にしても、ユーザ操作があるまで音がちいさいのでスキップしないことにした
  - [x] モバイルでスクロールを禁止する？
    - touchイベント
    - そこまでやる必要はないかも
    - PCのブラウザ
      - FirefoxとEdge: スクロールで動かない
      - ChromeとSafri: スクロールでゆれる
        - 背景画像を設定してbodyが動いていることを確かめた
        - htmlにoverflow: hiddenして動かなくなることを確認
    - iOSのsafariはこの段階でうごうごする
      - AndroidのChromeはPC同様動かなくなった
      - bodyにもoverflow: hiidenをつけたら動かなくなった
  - [x] クレジットのスクロールをマウスと連携させる
    - mouseenterのエリアの問題
  - [x] スタート画面でスキップリセット
  - [x] スタート画面の入力待ち
  - [x] Edgeで画像検索のアイコンが出ないようにする
  - [x] Edgeで翻訳が出ないようにする
  - [x] 効果音のノーマライズをやめてみる

- ウェブページ
  - [x] ツイッターカード
  - [x] 修正の表示トグルのクリックできる場所
  - [x] スクリーンショット修正または追加
  - [x] 最後にスラッシュがついてないときの対応
    - ローカルはいいけど、cloudfront/s3だと、おかしくなるはず

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
  - [x] システム設定からダイアログを表示した後、エラー
    - マウスでダイアログのボタンを押す
    - 直後にエンターを押す
      - waitForDialogが解除されているが、ダイアログのボタンがフォーカスされている
  - [x] システム設定からダイアログを表示した瞬間にエンター
    - 声が二重になる。
    - dialogが二回表示されている？
    - lil.GUIでボタンが2回押された扱い
    - とりあえず、短いあいだに二重に押されるのがよくない。
  - [x] textAnimationsがundefinedになるタイミングがある
    - スキップ中のわりこみで発生した？
      - 単純には発生しなかった
    - 選択肢が表示されているときに連打かも
      - 選択肢の二度押し防止を書いてみたけど、そういう問題ではないらしい
      - 選択肢経由のnextの途中で、もう一発nextがはいるとだめ？
    - 段落表示で二重入力してたら起こせるようになった
      - 次の段落との境目で二重入力？
  - [x] Androidで動かしてみる
  - [x] 既読率100%になるか確認する
  - [x] サービスワーカとの通信がときどきタイムアウトする
    - SafariとFirefoxでみた
    - 読み込んですぐアンロックするとでやすい？
    - 読み込み直後はいそがしくて、ServiceWorkerとの通信にてがまわらない感じ
      - Firefoxで100ms〜200ms程度のことが多かった
      - Safariは1000msを超えることもあった
        - タイマー用のsetTimeout自体が遅れて呼ばれることもあった
    - タイムアウト値を500msにした
      - Firefoxはほぼ大丈夫
      - Safariでごくまれに発生
    - 起動直後はいそがしいので、タイムアウト値を多少のばしてもだいじょうぶなはず

## タスク

- ビルド
  - [ ] ビルド時のチェックツール
    - VOICEPEAKの操作をミスったときに検出したい
  - [ ] デプロイ前のチェックツール
  - [ ] 依存関係の更新チェックツール

- シナリオ
  - [ ] リヴァイアサン戦後の尺をのばす

- システム
  - [ ] 再スタートする仕組みを考える
  - [ ] 一瞬表示の停止
    - スタート画面でセーブしてロードしたとき、一瞬、メイン画面が見える
  - [ ] ブラウザのヒストリ前後の挙動を確認する
  - [ ] クレジットの速度設定
  - [ ] 既読がなんかおかしいような気がする
    - 再現はできなかった
    - 段落追加の可能性があるか？
    - シナリオは追加しか行われていなかった
    - 既読管理がおかしかったとか？
  - [ ] バージョンアップと既読率について考える
    - [ ] 既読率の計算方式を変更
    - 段落の削除時に実装すればよい
  - [ ] スクリーンのトランジションアニメーション
  - [ ] 既読リセット
  - [ ] 既読率100%をテストする
  - [ ] 既読率0%をテストする
  - [ ] ログレベル設定
  - [ ] スクリプトを圧縮する。
  - [ ] エラー通報
  - [ ] オフライン用のダウンロード

- ウェブページ
  - [ ] 先頭のliの前のマージン
  - [ ] アプリケーションインストール
  - [ ] ログ解析

- デバッグ
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

