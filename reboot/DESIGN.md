# 設計メモ

## UIコンポーネント

画像サイトで購入する予定。

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

## テキスト表示

計算に必要な情報があらかじめ定まっていれば、前計算することができる。すべてを完全に決定する必要はなく、たとえば、親文字とルビの配置関係だけ計算しておくのも有用かもしれない。

## ルビの実装

ルビの実装においては、『[日本語組版処理の要件](https://www.w3.org/TR/jlreq/)』を参考にする。

TyranoScriptのルビの実装は貧弱で、[カスタムルビプラグイン](https://note.com/milkcat/n/n92aa8e52af1b)が配布されている。

TyranoScriptにおいて、ルビの実装が困難である理由は、おそらく、親文字を一文字ごとにばらして扱うアーキテクチャに起因している。

熟語ルビをモノルビに変換したうえで、ルビの位置を調整するアルゴリズムを考える。ルビの位置の調整は、カスタムルビプラグインのように位置決めのための引数を与えることになるだろう。本体を変更するという方針のほうが良いかもしれない。

改行について考える。熟語ルビのあいだに改行が入るかどうかは、実際にレンダリングしてみるのが良いだろう。ただし、ルビが親文字からはみだす場合、親文字の前後にアキが入る可能性があることに注意が必要であると考える。

そもそも、ルビをブラウザにまかせるためには、UIとテキストの双方の調整が必要になるだろう。そのため、UIをある程度固めてから、再度、考察を行う。

## ksのシンタックスハイライト

あまり必要ではないが、[vim-syntax-tyranoscript](https://github.com/bellflower2015/vim-syntax-tyranoscript)を使うことにした。

