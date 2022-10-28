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

ルビの実装においては、『[日本語組版処理の要件](https://www.w3.org/TR/jlreq/)』を参考にする。



