; vim:filetype=tyranoscript:

*start

[cm]
[clearfix]
[clearstack]
[start_keyconfig]

[deffont size=32 color=0xFFFFFF face="BIZ UDPMincho"]
[resetfont]

; メッセージウィンドウを設定する
[position layer=message0 page=fore left=0 top=368 width=1280 height=352]
[position layer=message0 color=0x000000 border_color=0xFFFFFF opacity=204]
[position layer=message0 marginl=192 margint=0 marginr=224 marginb=0]
[layopt layer=message0 visible=true]

; キャラクター名の表示領域を設定する
[ptext layer=message0 x=44 y=426 size=32 face="BIZ UDPGothic" color=white name=chara_name_area]
[chara_config ptext=chara_name_area]

[chara_new name=alice jname=アリス storage=dummy.png]
[chara_new name=danu jname=ダヌー storage=dummy.png]

#danu
荒[ruby x=-16 text=あらの spacing=8]野の誘惑だってのは、まあ、否定できないけど。[l][r]
仮称リヴァイアサンを撃滅することも、人類を救済することも、それそのものは、アタシたちの目的じゃない。[p]

#danu



