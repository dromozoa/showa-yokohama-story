# 設計メモ

## VOICEPEAK

- 決定性を持つのか？
- 一括生成とセリフごと生成で違いはあるのか？
  - 動きからするとありそうに思うが……

- 決定性を持つかどうかを実験してみる。

- volumeとpauseが設定できなくてつんだ。

## Graphviz

- ソースからビルドしてみる。
  - なんでこんなにでかいのか
- 依存ライブラリなしでSVGだけ生成できないかな？

```
./configure --prefix=/opt/graphviz-8.0.3
```

```
graphviz-8.0.3 will be compiled with the following:

options:
  cgraph:        Yes (always enabled)
  digcola:       Yes
  expat:         Yes
  freetype:      No (missing freetype-config)
  glut:          No (missing GL/glut.h)
  ann:           No (no ann.pc or ANN.h found)
  gts:           No (gts library not available)
  ipsepcola:     Yes
  ltdl:          Yes
  ortho:         Yes
  sfdp:          Yes
  swig:          No (swig not available) (  )
  shared:        Yes
  static:        No (disabled by default)
  qt:            No (qmake not found)
  x:             Yes

commands:
  dot:           Yes (always enabled)
  neato:         Yes (always enabled)
  fdp:           Yes (always enabled)
  circo:         Yes (always enabled)
  twopi:         Yes (always enabled)
  gvpr:          Yes (always enabled)
  gvmap:         Yes (always enabled)
  smyrna:        No (requires: gtk+ gtkglext glade gts glut)
  gvedit:        No (qmake not found)

plugin libraries:
  dot_layout:    Yes (always enabled)
  neato_layout:  Yes (always enabled)
  core:          Yes (always enabled)
  devil:         No (missing library)
  gd:            No (gd headers not found)
  gdiplus:       No (disabled by default - Windows only)
  gdk:           No (gdk library not available)
  gdk_pixbuf:    No (gdk_pixbuf library not available)
  ghostscript:   No (missing Xrender)
  gtk:           No (gtk library not available)
  lasi:          No (missing pangocairo support)
  pangocairo:    No (pangocairo library not available)
  poppler:       No (poppler library not available)
  quartz:        No (disabled by default - Mac only)
  rsvg:          No (rsvg library not available)
  webp:          No (webp library not available)
  xlib:          Yes
```

## Howler.js

``` JavaScript
Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
Howler.masterGain.connect(Howler.ctx.destination);
```

``` JavaScript
self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
self._node.paused = true;
self._node.connect(Howler.masterGain);
```

- `sound._node`が作られるのは`Howl.load`のタイミング
- 基本は自動ロードなので、onloadでフックする？
- `Howl._sounds`にはいっているっぽい

- `_drain`のタイミングで`disconnect(0)`がはいる
- `_drain`→`_inactiveSound`→`play`

### オリジナルの接続

```
sound._node: GainNode
  ↓
Howler.masterGain: GainNode
  ↓
Howler.ctx.destination
```

### アナライザをはさむ（現行）

```
sound._node: GainNode
  ↓
Howler.masterGain: GainNode
  ↓
analyser
  ↓
Howler.ctx.destination
```

## リップシンク

- 入力: FFT （MFCCを使う？）
- 教師: セリフテキスト
- 音声認識となにがちがうの？

