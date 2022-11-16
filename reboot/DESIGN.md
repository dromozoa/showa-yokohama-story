# 設計メモ

## Webフォント

本文は基本的に[BIZ UDPMincho](https://fonts.google.com/specimen/BIZ+UDPMincho)を使う。

コンソールっぽい表示では[VT323](https://fonts.google.com/specimen/VT323)を使うつもりだが、[Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono)も良いような気がする。

Google Fontsの指定をHTMLに直接書く。

```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic&family=BIZ+UDPMincho&family=Share+Tech+Mono&family=VT323&display=swap" rel="stylesheet">
```

TyranoScript Ver520cではフォント名に空白があってもただしく解析される。

Monoでない[Share Tech](https://fonts.google.com/specimen/Share+Tech)もよい。

ローディング状況を調べるには、[WebFontLoader](https://github.com/typekit/webfontloader)を使うか、CSS Font Loading APIを直接使う。ページロード時は問題ないが、範囲指定つきのフォントフェイスで動的にダウンロードする場合はうまくイベントが拾えない。

- WebFontLoaderはページロード時だけイベントが取れた。
  - contextをつかえばいける？
  - うまくいかなかった。
- CSS Font Loading APIは、Safariで動的なダウンロードのイベントが取れなかった。
  - タイマーをかけてdocument.fontsを監視すれば検出はできた。
  - readyだとひろえたが、ロードが完了する前に戻っているようだ。
  - FontFace.loadとFontFace.loadedを見るのが良いらしい。

結論としては、

- フォントフェイスをどのタイミングでロードするかはブラウザにまかせる。
  - canvasに描く場合もloadはちゃんと発生する
    - メモリキャッシュされていれば、そのフレームに間に合うっぽい
    - ディスクキャッシュされているか、ネットワークが速ければ、数十ミリ秒でロードできるかも
    - 毎フレーム描いてたら、そのうちうまくいく
- あるテキストについて、対応するフォントフェイスがロードされているかどうかを動的に調べるのであれば、unicode-rangeを調べるのがよい
- めんどうなので全部ロードしちゃってもよいかも
  - 静的に計算しておくことはできるけど、それだったらDOMつくってもいっしょ
  - 全部、つまり120種のフォントフェイスをダウンロードするのは、WiFi/4Gで数百秒
  - ChromeのFast 3Gモードで15秒かかった。
    - [プリセット値](https://github.com/ChromeDevTools/devtools-frontend/blob/a01c97fa2e97d21652b8fb2588ec9c794d707eb0/front_end/core/sdk/NetworkManager.ts#L383)はダウンロードが1.44Mbps (184.32KB/s) , レイテンシが0.5625ミリ秒らしい
    - BIZ P明朝をひとつのwoff2にしたら2851276バイト
    - 15.1秒なので計算はあう
    - この帯域だと並列はきかない

## テキスト表示

計算に必要な情報があらかじめ定まっていれば、前計算することができる。すべてを完全に決定する必要はなく、たとえば、親文字とルビの配置関係だけ計算しておくのも有用かもしれない。

初回開発時は、横画面固定でレイアウトしていた。1行の文字数は26文字で4行だった。

### サーベイ

スマートフォンの縦画面
- ゲームによるが20文字程度
- 『[小説家になろう](https://syosetu.com/)』は24文字
- 『[カクヨム](https://kakuyomu.jp/)』は20文字
- 素のHTML5をMobile Safariで表示すると42文字
- Twitterは21文字。

それ以外、PC・コンソール・スマートフォンの横画面
- 横画面では25文字から30文字程度。
- Twitterは33文字。

### 案

- 1em = 48pxならば20文字で960pxになる。
- 最大6行とすると、高さは576pxになる。
- そのほかに注釈とメニューをつける。
- HTMLとCSSの機能を活用する。
  - Intersection Observer
  - CSS Scroll Snap
- 自前でちいさなフレームワークを作成する。

## ルビの実装

ルビの実装においては、『[日本語組版処理の要件](https://www.w3.org/TR/jlreq/)』を参考にする。

TyranoScriptのルビの実装は貧弱で、[カスタムルビプラグイン](https://note.com/milkcat/n/n92aa8e52af1b)が配布されている。

TyranoScriptにおいて、ルビの実装が困難である理由は、おそらく、親文字を一文字ごとにばらして扱うアーキテクチャに起因している。

熟語ルビをモノルビに変換したうえで、ルビの位置を調整するアルゴリズムを考える。ルビの位置の調整は、カスタムルビプラグインのように位置決めのための引数を与えることになるだろう。本体を変更するという方針のほうが良いかもしれない。

改行について考える。熟語ルビのあいだに改行が入るかどうかは、実際にレンダリングしてみるのが良いだろう。ただし、ルビが親文字からはみだす場合、親文字の前後にアキが入る可能性があることに注意が必要であると考える。

そもそも、ルビをブラウザにまかせるためには、UIとテキストの双方の調整が必要になるだろう。そのため、UIをある程度固めてから、再度、考察を行う。

## ksのシンタックスハイライト

あまり必要ではないが、[vim-syntax-tyranoscript](https://github.com/bellflower2015/vim-syntax-tyranoscript)を使うことにした。

## UIの再構築

## UIコンポーネント

サイバーパンク風味のUIコンポーネントを画像サイトで購入した。特に理由はないが、[Shutterstock](https://www.shutterstock.com/)という素材販売サイトを利用している。

SVG画像で構成できないかを検討する。購入した素材によっては、ビットマップ画像が埋めこまれているだけだったりするらしい。

UIコンセプトをOmniGraffleで作成する。

## 画像素材メモ

```
shutterstock_1704200764.eps  HUD (bitmap?)
shutterstock_1867640776.eps  二刀流
shutterstock_1888775401.eps  弓
shutterstock_1896854332.eps  魔女
shutterstock_1902971338.eps  HUD (bitmap?)
shutterstock_2067609683.eps  クレイモア
shutterstock_2120043209.eps  HUD (bitmap?)
shutterstock_2138204831.eps  HUD
shutterstock_2146094129.eps  HUD (bitmap?)
shutterstock_2171694161.eps  狐娘
```

## アニメーション案

- ブラウン管
  - 走査線
  - ノイズ
- グリッチエフェクト

## UI案

### タイトル画面

- ユーザアクションをなにか要請する
  - ブラウザの自動再生のために必要

- ロードゲーム
  - つづきから
- 新規ゲーム
  - はじめから
- ライセンス
- DLC
- 待機しているとオープニングムービー
- CGモード
- 回想モード
- 設定
  - コンフィグ

### アイキャッチ画面

- ロード待ちに挟む

### セーブ画面

- ユーザ名
- 場所
- プレイ時間
- セーブ日時

### メイン画面

- メインテキスト
- ボタン
  - skip
  - auto
  - save
  - load
  - quick save
  - quick load
  - log
  - close
  - screen
  - menu
  - config
  - title
- 音声ビジュアライザ
- 地図
- 注釈
- 画像

## シナリオスクリプトの仕様の再構築

- ルビを指定する際、音声を別に指定したい場合がある。
- Non-conformingだが、rtcが意味にあたる。
- 話者は#xxxで指示する。
- ディレクティブとして@...を使う。

## スクリプトの実行

```
env "LUA_PATH=tool/?.lua;;" lua tool/process1.lua scenario/scenario.txt scenario/core1.html output/core1.html output/voice1.txt
```

## 色

16進数 | 色       | 説明
-------|----------|-----------------------
F50002 | 赤       | 真・女神転生のタイトル
C63322 | 赤       | 昭和米国物語
FFFEDA | クリーム | 昭和米国物語
FD0000 | 赤       | エヴァンゲリオン
029D93 | 緑       | メッセージ
CD0200 | 赤       | ソ連国旗外側
FFD800 | 黄       | ソ連国旗内側
820818 | 赤       | 日本国旗

## 画像

白`rgba(255,255,255,1)`と黒`rgba(0,0,0,0)`の二値画像を作る。いくつか実験した結果、PNGの場合、1ビットグレイスケールでtRNSチャンクを使うとサイズがちいさくなった。ImageMagickで変換した後、pngcheckでチャンクを確認した。ImageMagickは`-quality`の一の位でPNGのフィルタを指定するが、二値画像では`-quality 90`、つまりフィルタなしで良さそうだった。

```
env DYLD_LIBRARY_PATH="$MAGICK_HOME/lib" \
  convert \
  -quality 90 \
  -strip \
  -type GrayscaleAlpha \
  -define png:color-type=0 \
  -define png:bit-depth=1 \
  source.png result.png
```

