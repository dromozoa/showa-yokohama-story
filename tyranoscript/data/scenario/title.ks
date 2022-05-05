
[cm]

@clearstack
; @bg storage ="map.png" time=100

; @wait time = 200

*start

[start_keyconfig]

; [position layer=message0 left=160 top=500 width=1000 height=200 page=fore visible=true]
; [position layer=message0 page=fore margint=45 marginl=50 marginr=70 marginb=60]

; [position layer=message0 left=160 top=400 width=1000 height=400 page=fore visible=true border_color=0xFF0000 border_size=4 radius=20]

[position layer=message0 page=fore left=0 top=368 width=1280 height=352]
[position layer=message0 color=0x000000 border_color=0xFFFFFF opacity=204]
[position layer=message0 marginl=192 margint=0 marginr=192 marginb=0]

@layopt layer=message0 visible=true

[iscript]
tf.gothic = "BIZ UDPGothic"
[endscript]
[ptext layer=message0 x=64 y=426 size=32 face=&tf.gothic color=white name=chara_name_area]
[chara_config ptext=chara_name_area]

[chara_new name=narrator storage=dummy.png jname=]

#
[font face=VT323 size=48 color=0x029D93]
H.H.C MONITOR VER 1.3[r]
EVANGELIUM SECUNDUM STEPHANUS[p]
; SHOWA YOKOHAMA STORY[r]
; LAST LOGIN: Sat Jan  7 06:33 1989 [p]
[resetfont]

@bg2 storage=title.png time=1000 method=vanishIn
@playbgm storage=sessions_diana_track33.ogg loop=true volume=50

[glink color=btn_10_black x=1088 y=544 face=VT323 size=28 width=160 text=AUTO role=auto]
[glink color=btn_10_black x=1088 y=640 face=VT323 size=28 width=160 text=SKIP role=skip]
; [glink color=btn_06_black x=1088 y=544 face=VT323 size=28 width=160 text=AUTO role=auto]
; [glink color=btn_06_black x=1088 y=640 face=VT323 size=28 width=160 text=SKIP role=skip]

昭和七十四年七月、ボクはキミに出逢った。
昭和七十四年七月、ボクはキミに出逢った。
昭和七十四年七月、ボクはキミに出逢った。
昭和七十四年七月、ボクはキミに出逢った。
昭和七十四年七月、ボクはキミに出逢った。
昭和七十四年七月、ボクはキミに出逢った。[p]

[voconfig name=narrator vostorage=narrator_{number}.ogg number=0]
[voconfig name=アリス vostorage=alice_{number}.ogg number=0]
[voconfig name=ダヌー vostorage=danu_{number}.ogg number=0]
[vostart]

# narrator
昭和七十四年七月、ボクはキミに出逢った。[l][r]

# narrator
人類が滅亡するまでの、最期のひとつきの、これは物語だ。[p]

@bg2 storage=map.png time=1000 method=vanishIn

# ダヌー
アンタはここでダヌーと死ぬのよ。[p]

# アリス
強制はしない。[l][r]

# アリス
熱望か希望か拒否か、ひとつを択べ。[p]

[glink color=btn_06_black target=*001 x=48 y=32 text=熱望 size=32]
[glink color=btn_06_black target=*002 x=48 y=128 text=希望 size=32]
[glink color=btn_06_black target=*003 x=48 y=224 text=拒否 size=32]
; [glink color=btn_10_black target=*001 x=48 y=32 text=熱望 size=32]
; [glink color=btn_10_black target=*002 x=48 y=128 text=希望 size=32]
; [glink color=btn_10_black target=*003 x=48 y=224 text=拒否 size=32]
[s]

* 001
* 002
* 003

# narrator
壊れかけの鉱石ラジオが布哇陥落を伝えている。[l][r]

# narrator
終末論的絶望症候群による死者数が全世界で増加傾向にある。[p]

# アリス
今日からキミは特殊検索群少尉だ。[l][r]

# アリス
サバルタンでもいいが、な。[p]

# ダヌー
安心して。[l][r]

# ダヌー
アンタのことは、ダヌーがちゃんと終わらせてあげるから。[p]

@bg2 storage=title.png time=1000 method=vanishIn

# アリス
今宵もアリスと地獄につきあってもらう。[p]

[vostop]


; [ruby text=しげんちょうたつりょだん]資源調達師団[r]
; 資源調達師団[r]
; [ruby text=し]資[ruby text=げん]源調達師団[r]

; [button x=135 y=230 graphic="title/button_start.png" enterimg="title/button_start2.png"  target="gamestart"]
; [button x=135 y=320 graphic="title/button_load.png" enterimg="title/button_load2.png" role="load" ]
; [button x=135 y=410 graphic="title/button_cg.png" enterimg="title/button_cg2.png" storage="cg.ks" ]
; [button x=135 y=500 graphic="title/button_replay.png" enterimg="title/button_replay2.png" storage="replay.ks" ]
; [button x=135 y=590 graphic="title/button_config.png" enterimg="title/button_config2.png" role="sleepgame" storage="config.ks" ]

[s]

*gamestart
; 一番最初のシナリオファイルへジャンプする
@jump storage="scene1.ks"



