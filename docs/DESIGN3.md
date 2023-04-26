# 設計メモ

## コントロールの配置

ロード横画面
```
  1,1  2,1  3,1
  1,2  2,2  3,2
```

ロード縦画面
```
  1,1  1,2
  2,1  2,2
  3,1  3,2
```

- 転置した構成になっている。
- 初期位置は0,0とする。

タイトル画面
上下方向でどちらにいくかまよったら左にいく

```
  [NEW GAME ]  [LOAD GAME]
```

```
  [NEW GAME ]  [LOAD GAME]
        [CONTINUE ]
```

```
  [NEW GAME ]  [LOAD GAME]
        [CREDITS  ]
```

```
  [NEW GAME ]  [LOAD GAME]
  [CONTINUE ]  [CREDITS  ]
```

```
[NEW GAME  ]  [LOAD GAME ]
[CONTINUE  ]  [CREDITS   ]
[EXTRA GAME]  [POSTSCRIPT]
```
```
[NEW GAME  ]  [LOAD GAME ]  [EXTRA GAME]
[CONTINUE  ]  [CREDITS   ]  [POSTSCRIPT]
```

- 鍵状態
- 無効状態

