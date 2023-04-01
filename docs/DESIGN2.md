# 設計メモ

## 座標位置の確定

- 絶対位置のCSS表現
- 制約付きの配置
  - CSSで表現するかどうか
    - flex
    - float
- px単位で画面サイズを決定する
  - 横 (48,27) = (1152px, 648px)
  - 縦 (27,48) = (648px, 1152px)
  - canvasの解像度はどうする？
    - 画面サイズをスケールするときに問題が出る
    - 画面の重なり順の問題もある。
- HTML要素をほぼ静的に作るのはよい
- 問題は、CSSをすべて手書きするところにある

- 仮想的なscreenを考える。
  - camera / screen

- visualizerは(8,4) = (192px, 96px)を基準としている

- シルエット用のエリアは(14,25) = (336, 600)
  - 比率はw/h=0.56で、これは9/16=0.5625に近い
  - 264,192

- 高解像度だと扱いづらいので、1000px弱に縮小して作業する。
  - 画像の縮小はPixelmatorでてきとうに
  - サイズと配置はOmniGraffleで調整する

- テープの元データサイズは 3406x2161
- 調整して(22,14) = (528px, 336px)

- シルエット
  - 左右反転させて右に6(12)

- タイトル画面の選択肢
  - 左右に1.5emつけて+3em
  - 5文字なら幅は8文字

- つづきから / CONTINUE
- はじめから / NEW GAME
- ロード / LOAD GAME

- 25x10.7821 / 48 = 5.615677083333333

- start: 720x480の画像を作る(3:2)
- bg: 1152, 648
- bg@2: 2304, 1296

## 背景画像

```
-- 彩度 (saturate)
s = 1 - t
R = |  s+0.2126t    0.7152t    0.0722t  |  r
G = |    0.2126t  s+0.7152t    0.0722t  |  g
B = |    0.2126t    0.7152t  s+0.0722t  |  b
-- t=1のとき、いわゆるグレースケールへの変換
-- s=1のとき、単位行列
```

```
-- 明るさ (brightness)
R = r * s
G = g * s
B = b * s
```

```
a = 0.2126
b = 0.7152
c = 0.0722

| s+at    bt    ct | | R |
|   at  s+bt    ct | | G |
|   at    bt  s+ct | | B |

| s     | | R |     | a b c | | R |
|   s   | | G | + t | a b c | | G |
|     s | | B |     | a b c | | B |
```

## iOS Safariのエラー

```
[Error] Unhandled Promise Rejection: InvalidStateError: Failed to start the audio device
	promiseEmptyOnRejected
	promiseReactionJob
```

- https://github.com/goldfire/howler.js/issues/1559
- audioSuspendを切るのはどうだろう
- ↑このエラー自体は観測された
- しかも、その後止まらなかった。

```
// _autoResumeをハック
let autoResume = HowlerGlobal.prototype._autoResume;
HowlerGlobal.prototype._autoResume = function () { console.log("_autoResume start", this); const r = autoResume.call(this); console.log("_autoResume end", r); return r };
```

- 音声ファイルがダウンロードできないと段落遷移が止まった

- canvasのクラッシュ
  - https://stackoverflow.com/questions/13751964/scaling-canvas-on-ios-seems-to-crash-mobile-safari
  - 古いけど
- https://developer.apple.com/forums/thread/708348
  - ???

## 完了タスク

- [x] autosave => verse select
- [x] ラベル文字列→ラベルインデックスの表を作る
- [x] @verse命令か@scene命令を作る
  - @startとする
- [x] ダイアログ
- [x] クリック可能な要素にマウスカーソルを設定する
- [x] ダイアログのボイス対応
- [=] システムメニューを自動で閉じる
- [x] セーブ・ロード時のポーズ
- [x] セーブ・ロード時の停止
- [x] nextでwaitForDialogを見るか検討する
  - 一番最初で判定するべきでは？
- [x] ロードの実装
- [=] スクリーンのトランジションアニメーション
- [x] 段落のポーズの問題に対応する
  - 行の処理が終わっていた場合
- [x] BGMを決定可能にする。
  - [x] @music命令か@bgm命令を作る
  - [x] 合流点で一意に決定可能か検査する
  - [x] 短期間に音楽が切り替わる場合を考察する
- [x] タイトル画面に「最初から」「続きから」を付与する
- [=] オートセーブ情報から、タイトル画面で流す音楽を決められる
- [x] 戻る画面を決める
- [x] 既読管理
- [=] スタート直後に@startがはいるときに処理落ちする。
- [=] タイトル画面も絵文字をつける？
- [x] タイトル画面のクリックとonunlockを統合する。
- [x] copyrightのチェック
- [=] チュートリアルをBOOT CAMPにする。
- [x] 第一巻→一巻めの
- [x] nextの領域拡大
- [x] セーブ後の挙動の修正。
- [x] @enterの実装
- [x] finishをどうするか検討する
- [x] finish{bool}を作成する
- [x] copyrightの修正。
- [x] trailer -> preview
- [x] シナリオからロギングを触れるようにする
- [x] 1969はdiana 21
- [x] クレジットを作る
  - [x] グラフの開始点を確認する
  - [x] グラフの色を調整する
  - [x] テキストを作成する
  - [x] 自動スクロール
  - [x] vi05を使う
  - [x] 空のオーバーレイで自動スクロールを禁止する
- [x] オート
  - [=] アイコンをどうする。
- [x] スキップ
- [x] 労組モジュール
- [x] 既読スキップ
- [x] タイトルの音楽切り替え
- [x] オート・スキップをスクリーン遷移前に終わらせる
- [x] シナリオの仕様変更
  - [x] @start/@whenの同時指定を禁止する
  - [x] @systemを廃止して@dialogで代替する
- [x] システム設定
  - [x] システム設定リセット
  - [x] セーブデータリセット
  - [=] 既読リセット
- [x] 背景画像の調整
- [x] 軽量エディタ
  - [x] demeter.jsを再利用できるようにする
  - [x] エディタというより、昔のsketch1のように一括表示を行う。
  - [x] パスの切り替え
  - [x] ダイアログのボタン順序が逆。
- [x] シナリオパーサに@debugモードを作る（警告だけする）
- [x] D.preferences = { musicDir: "...", voiceDir: "..." }
- [x] 画面拡大率の上限
- [x] チュートリアルで質問できるようにする
- [=] スタート画面の入力待ち
- [x] スタート画面の時間調整
- [x] エスケープで戻れるようにする
- [x] シルエットの位置微調整
- [x] rosaのシルエットを用意
- [x] シナリオスクリプトをひとまとめで出力
- [x] クレジットの修正
  - [x] アンロック
  - [x] グラフのかたちが変わったので対応
    - css min,maxを使えるか
  - [x] アニメーションの時間調整
  - [x] ライセンス表記
- [x] クレジット画面をいつでも見られるようにする
- [x] 全部awaitする。
- [=] iOSでスクロールが若干フレーム落ちする
- [=] D.ConsoleLogging
- [x] ログがスクロールしない場合を調べる
  - 自前でスクロールする？
  - 隠れてる状態ではスクロールが効かない？
  - awaitの問題だったとみられる
  - 隠れてる状態ではスクロールが効かない問題のほうだった
- [x] クレジットでEnterを受けつける
- [=] ログを減らす
- [x] 画像が戻ってる。
- [x] 現在地の実装
- [x] narratorの画像を調整する。
- [x] 背景をカラーにする
  - [x] CSSフィルタを実験する
- [x] クレジットが終わった瞬間にクリックするとアイコンが表示したままになる
- [x] キャッシュをどうするか考える
  - 特にメモリキャッシュ
  - パスを変える
- [x] テープのラベルのフォントをちょっとちいさくする
- [x] 表示直後の背景の位置
- [=] overscroll-behavior
  - やるとしたら、微妙に高くして、強制スクロールで戻すとか
  - そこまでやる必要はないかも
- [x] 選択肢が出ている画面でロードしても選択肢が消えない
- [x] コナミコマンド
- [x] チュートリアルと予告編以外はクレジットをだす
- [x] 選択肢のあいだメニューを無効にする
- [=] チュートリアルの質問を分ける
- [x] システムメニューからタイトルに戻る
  - [x] 変更を確認する
- [x] エンド直前でデータをロードするとタイトルに戻ってしまう
  - [x] エンド直前でセーブして、再度呼び出してもおきる
  - paragraphIndexSave, paragraphIndexPrevのリセットタイミング
- [x] 効果音を鳴らす
- [x] paragraphIndexSaveがundefinedにならないように注意する
- [=] leaveをリファクタリングする
- [=] 既読率0%でED
- [=] 自動保存はまとめる
- [x] SKIP中は自動保存しない。
- [x] setSaveしたら現在地をundefinedにするべきでは？
  - [x] タイトル画面でundefinedにする
- [x] 既読率計算用にsystem以外の段落数を数えておく
- [x] 予告編のアンロックをトロフィーにする
- [x] トロフィー
  - クレジット画面で表示する
- [=] ログレベル設定
- [x] メイン画面に戻ったときのログスクロールを瞬時にする
- [x] 音楽ファイルを固定の場所にアップロードする。
- [x] フォルダ構造の整理
- [x] copyright修正
- [=] クレジットでメッセージ送信する。
- [x] ロード時に一瞬テキストが消えるのが見える。
  - ロードでタイトル画面を表示する前に消しておく
- [=] タイトルでメッセージを送信する。
- [x] フラグの初期化は不要（目的地フラグ）
- [=] webworker
  - [x] ServiceWorker
- [x] タイトル画面でバージョン表示する。
- [x] ダイアログ表示中のシステム設定を確認
  - ダイアログ表示中はオーバーレイで入力を遮断している。
- [x] バージョンを調べる。
  - [x] 定期的にバージョンを調べる
- [x] 更新ダイアログをいいかんじに出す
- [x] ヒストリをきれいにする
- [x] タイトルに戻るときにバージョン状況を見る
- [x] settimeoutでn秒後にためしてもらう
- [x] 効果音のmd更新
- [x] 更新の仕組みを確認する。
- [=] overscroll-behavior html
- [x] 全画面化
- [x] バージョン更新の仕組み
- [x] バージョン更新ダイアログを用意しておく。
- [=] URLをいじる
- [x] 音声ファイルのダウンロードに失敗した場合のパターン
  - [x] 切断する

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
- [x] cache-control: no-storeを自前で設定する。
- [x] 音声のアップロードが遅いからsyncにしちゃう

- [x] D.trace
- [x] ヒストリをいじるときに?以降をはずすだけにする
- [x] 設定部分をif文で書いて、パラメーターだけ渡す。
  - バージョン文字列とフォルダモードは自動生成したい（まちがえないように）
- [x] デプロイの仕組みを改善する。
- [x] ダウンロードがおそい
  - [x] ウォーミングアップしてみる？
- [=] アプリケーションインストールの方法をチュートリアルで
- [=] 通知の方法をチュートリアルで

- [x] バージョンチェックセマンティクスを考える
- [x] iOSで背景の色がかわらない？
  - [x] 背景の仕組みを変える
  - [x] filterのアニメーションができなかったのでトランジションに変更
- [x] 背景の画像のロードが遅い
  - [x] キャッシュ
  - [x] JPEGにする
- [x] トロフィー獲得時に音とメッセージをどこかに出す
  - [=] タイトルだったらバージョンを一時的に非表示にする
  - [=] 3Dでくるっとでてくる？
  - [x] 画面ごとに場所をきめる
    - 16文字ぶんとっておく。
    - 「○ 今夜はブギー・バック」
- [x] 先読みする？
  - [=] ServiceWorkerにリクエストを送る。
  - [x] UIスレッドでキャッシュすればよかった。
  - [x] URLは適当でよい？
  - [x] 背景画像のキャッシュを改善する。
  - [x] グラフにしたがってボイスをキャッシュする。
  - [=] キャッシュの削除

- [x] シナリオ
  - [=] 本州以外の島嶼ってどこが残ってるの
  - [x] 生体認証装置「も」トルツメ？
  - [x] こたえと応え
  - [x] 残り時間？
  - [x] ここからたどりつけない空虚な中心。とか。
  - [x] 転送中。通信速度……
  - [x] 世界→セカイ
  - [x] 択べるようだのようだいらない
  - [x] ボボボクハ
  - [x] 中。

- [x] 開発中のbuild/debugは除外
- [x] 複数タブで開いている場合の検出
  - ServiceWorkerでいけないかな？

- [x] setTimeoutのパラメータ
- [x] args→params?
- [x] 複数タブで開いている場合の検出にタイムアウトをつける
- [x] シナリオ
  - [x] 幾度も騙られなおした
- [x] トロフィーの表示が短すぎる
- [x] トロフィーのアイコンが表示されていない？

- シナリオ
  - [=] リサイクル→再資源化
    - [=] 再戦力化
  - [x] 建設予定地はやめるか。
- [x] clientsのパスをチェックする
  - index.htmlもコントロールされるので
- [x] スタート画面からの戻りのところで文字を消す
  - SAVE/LOADからの戻りといっしょ
  - safari
- [x] GitHub Pagesをリダイレクトする
- [x] ホームページをつくる
  - [x] faviconを設定する。
  - [x] iOSの注意書き
  - [x] メッセージ送信をタイトルかホームページに作る
  - [=] brotliで圧縮したサイズを計算する

- ホームページをつくる
  - [x] 更新履歴を表示する
  - [x] 幅がせまいと更新日が重なる

- [=] スクリプトを圧縮する。
- [=] エラー通報
- [=] データベースの処理を検討する
  - [=] バージョン管理
  - [=] エラー処理
  - [=] トランザクション

## 保存

- [ ] iOSで音が出なくなる
  - resumeに失敗している？
  - オート再生からロック→解除で、メモリ負荷がかかってるとか？
  - [ ] 他のタブで動画を再生して戻ったりするとだめ
    - [ ] リロードしてもだめ？
  - [ ] 音の入力が消えたらグラフをノーシグナルにする？
    - [ ] そもそも入力はどうなってる？
  - [ ] 音が止まったあと、セーブにいって戻ると音が出るときもある
    - resume?

- [ ] iOSで表示がおかしくなる
  - 背景のtransformがきかなくなる
  - [=] 背景のトランジションが遅い
  - canvasがおかしくなる
    - 他のページやアプリにいってもどると発生
    - contextはとれる
    - おそらくcontextがいなくなってつくりなおされた
      - fillStyleは通った
        - 白に設定していたのが黒になってた？
      - サイズがおかしい
        - scaleがとんでた？
  - 再現方法は不明

## Howler.jsのresume/suspend

- `_autoResume`の呼び出しもと
  - `_unlockAudio`: `unlock`コールバックから呼ぶ
  - `_autoSuspend`: `Howler.autoSuspend`が偽のときは呼ばれなさそう
  - `play`
- `_autoSuspend`は`Howler.autoSuspend`が偽のときはすぐにreturnする

- UA判定
  - safariである: Safariを含んでChromeを含まない
  - iOSである
    - Macintoshを名乗るiPadの可能性がある
    - ontouchstartやontouchendのイベントを調べる
      - iOS: documnet.ontouchstartがnullで、undefinedでない

- 参考: https://developer.apple.com/forums/thread/658375

- [x] イベントリスナーの登録タイミングを修正する
- [x] iOSで音が出なくなる
  - 他のページやアプリにいってもどると発生しがち
  - resumeに失敗している？
  - suspend/resumeでなおるパターンがあった
  - [x] Howler.jsと衝突しないsuspend/resumeを実装する
  - [x] iOSだけで発動する実行する
    - iPadの判定条件
- [=] iOSでキャッシュまわりのエラーが出ているのを修正する
  - LAN内でhttpアクセスしていたから。

## 例外発生時のログ

### テキストアニメーション

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

### イベントリスナー

```
[Error] Unhandled Promise Rejection: TypeError: undefined is not an object (evaluating 'gameState[screenOrientation]')
	（anonymous関数） (demeter.js:3742)
	asyncFunctionResume
```

### cachesが存在しない

LAN内でhttpアクセスしてるから。

```
[Log] addCache (2) (demeter.js, line 1978)
["build/voice/0001.mp3", "build/voice/0002.mp3", "build/voice/0003.mp3", "build/voice/0004.mp3", "build/voice/0006.mp3", "build/voice/0005.mp3", "build/voice/0352.mp3", "build/voice/0375.mp3", "build/voice/0376.mp3", "build/voice/0377.mp3", …] (25)
ReferenceError: Can't find variable: caches
（anonymous関数） — demeter.js:1960
asyncFunctionResume
（anonymous関数） — demeter.js:1975
（anonymous関数） — demeter.js:3833
asyncFunctionResume
（anonymous関数）
promiseReactionJobWithoutPromise
promiseReactionJob
```

## タスク

- シナリオ
  - [ ] リヴァイアサン戦後の尺をのばす

- ホームページをつくる
  - [ ] ホームページのリソースをsystem以下に置くか検討する
  - [ ] ツイッターカード
  - [ ] アプリケーションインストール
  - [=] s3バージョニングを検討
  - [ ] ろうくみ／ろうそを宣伝する

- [ ] RCのデプロイ
  - game-Ver.htmlをアップロードする

- [ ] キャッシュを消す
  - [ ] 古いのを消す
- [x] SAVE/LOAD段落を起点とするキャッシュ

- [ ] textAnimationsがundefinedになるタイミングがある
  - スキップ中のわりこみで発生した？
    - 単純には発生しなかった

- [ ] ビルドの依存関係を再検討する。
  - make cleanの必要をなくしたい。
  - VOICEPEAKの操作をミスったときに検出したい
  - [ ] デプロイ前のチェックツール

- [ ] iOSで表示がおかしくなる
  - 他のページやアプリにいってもどるとまれに発生する
  - 背景のtransformが効いていない状態になる
  - Canvasのスタイルが聴いていない状態になる
    - 黒で描かれる
    - contextはロストしていないように見える
  - [ ] 検出方法を検討する
  - [ ] Canvasをつくりなおす

- [ ] バージョンアップと既読率について考える
  - [ ] 既読率の計算方式を変更
  - 段落の削除時に実装すればよい

- [ ] キーボードナビゲーション
- [ ] ゲームパッド対応

