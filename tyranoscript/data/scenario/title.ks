
[cm]

@clearstack
@bg storage ="map.png" time=100

; @wait time = 200

*start

[start_keyconfig]

; [position layer=message0 left=160 top=500 width=1000 height=200 page=fore visible=true]
; [position layer=message0 page=fore margint=45 marginl=50 marginr=70 marginb=60]

; [position layer=message0 left=160 top=400 width=1000 height=400 page=fore visible=true border_color=0xFF0000 border_size=4 radius=20]

[position layer=message0 page=fore left=0 top=368 width=1280 height=352]
[position layer=message0 color=0x000000 border_color=0xFFFFFF opacity=204]
[position layer=message0 marginl=192 margint=0 marginr=160 marginb=0]

@layopt layer=message0 visible=true

[iscript]
tf.gothic = "BIZ UDGothic"
[endscript]
[ptext layer=message0 x=64 y=426 size=32 face=&tf.gothic color=white name=chara_name_area]
[chara_config ptext=chara_name_area]

# アリス
昭和七十四年七月、ボクはキミに出逢った。[r]
人類が滅亡するまでの、最期のひとつきの、これは物語だ。[r]
あなたはここでアリスと死ぬのよ。[r]
今宵もアリスと地獄につきあってもらう。[p]

# アリス
[ruby text=ショ]昭[ruby text=ウワ]和七十四年七月、ボクはキミに出逢った。[l][r]
[ruby text=ヒュ]人[ruby text=ーマン]類が滅亡するまでの、最期のひとつきの、これは物語だ。[l][r]
あんたはここで[ruby text=あ]ア[ruby text=り]リ[ruby text=す]スと死ぬのよ。[l][r]
[ruby text=こ]今[ruby text=よい]宵もアリスと地獄につきあってもらう。[p]

; [font face="BIZ UDPMincho"]

#
[font face=VT323 size=48 color=0x029D93]
H.H.C MONITOR VER 1.3[r]
EVANGELIUM SECUNDUM STEPHANUS[r]
SHOWA YOKOHAMA STORY[r]
LAST LOGIN: Sat Jan  7 06:33 1989 [p]
[p]

; [resetfont]
; @playbgm storage=sessions_diana_track33.ogg loop=true volume=50
; BGM再生開始。[l][r]

[resetfont]

#
昭和横濱物語。[l][r]
PRESS ENTER KEY[l][r]
; [resetfont]
; @playbgm storage=sessions_diana_track33.ogg loop=true volume=50
; BGM再生開始。[l][r]

@bg2 storage=sound_only.jpg time=1000 method=vanishIn

BG変更。[p]

「[ruby text="バチ"]本[ruby text="カン"]山からの郵便だ」[p]

「なんと？」[p]

[ruby text=しげんちょうたつりょだん]資源調達師団[r]
資源調達師団[r]
[ruby text=し]資[ruby text=げん]源調達師団[r]

; [button x=135 y=230 graphic="title/button_start.png" enterimg="title/button_start2.png"  target="gamestart"]
; [button x=135 y=320 graphic="title/button_load.png" enterimg="title/button_load2.png" role="load" ]
; [button x=135 y=410 graphic="title/button_cg.png" enterimg="title/button_cg2.png" storage="cg.ks" ]
; [button x=135 y=500 graphic="title/button_replay.png" enterimg="title/button_replay2.png" storage="replay.ks" ]
; [button x=135 y=590 graphic="title/button_config.png" enterimg="title/button_config2.png" role="sleepgame" storage="config.ks" ]

[s]

*gamestart
; 一番最初のシナリオファイルへジャンプする
@jump storage="scene1.ks"



