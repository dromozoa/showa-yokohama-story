; ==========================================================

[cm]
[clearstack]
[start_keyconfig]

; ==========================================================

; 選択肢でスキップを解除する
[iscript]
TG.kag.stat.skip_link = "false"
[endscript]

; メッセージウィンドウを設定する
[position layer=message0 page=fore left=0 top=368 width=1280 height=352]
[position layer=message0 color=0x000000 border_color=0xFFFFFF opacity=204]
[position layer=message0 marginl=192 margint=0 marginr=224 marginb=0]
[layopt layer=message0 visible=true]

; キャラクター名の表示領域を設定する
; フォント名に空白が入っているため、変数に入れて指定する
[iscript]
tf.gothic = "BIZ UDPGothic"
[endscript]
[ptext layer=message0 x=64 y=426 size=32 face=&tf.gothic color=white name=chara_name_area]
[chara_config ptext=chara_name_area]

; キャラクターを設定する
[chara_new name=narrator storage=dummy.png jname=]
[chara_new name=alice storage=dummy.png jname=アリス]
[chara_new name=danu storage=dummy.png jname=ダヌー]
[chara_new name=yukio storage=dummy.png jname=ユキヲ]
[chara_new name=priest storage=dummy.png jname=神父]
[chara_new name=engineer storage=dummy.png jname=課長]

; ==========================================================

*title

[preload storage=data/bgimage/title.png]
[preload storage=data/bgimage/map.png]
[preload storage=data/fgimage/dummy.png]
[save_img storage=dummy.png]

[font face=VT323 size=48 color=0x029D93]
#
H.H.C MONITOR VER 1.3[r]
EVANGELIUM SECUNDUM STEPHANUS verse II[l]
[resetfont]

[bg2 storage=title.png time=1000 wait=false method=vanishIn]
[playbgm storage=sessions_diana_track19.ogg loop=true volume=50]

[if exp="sf.system.autosave == true"]

[font face=VT323 size=48 color=0x029D93]
#
[r]
INSERT 30 PIECES OF SILVER TO CONTINUE
[resetfont]

[glink color=btn_10_black x=1088 y=576 face=VT323 size=32 width=160 text=START target=*最初から]
[glink color=btn_10_black x=1088 y=640 face=VT323 size=32 width=160 text=CONTINUE target=*続きから]
[s]

*最初から

[jump target=*start]

*続きから

[autoload]

[endif]

; ==========================================================

*start

[cm]

[glink color=btn_10_black x=1088 y=448 face=VT323 size=32 width=160 text=TITLE role=title-without-confirmation]
[glink color=btn_10_black x=1088 y=512 face=VT323 size=32 width=160 text=LOG role=backlog]
[glink color=btn_10_black x=1088 y=576 face=VT323 size=32 width=160 text=AUTO role=auto]
[glink color=btn_10_black x=1088 y=640 face=VT323 size=32 width=160 text=SKIP role=skip]

[call storage=scenario.ks]
[iscript]
location.href = "./index.html";
[endscript]

; ==========================================================
