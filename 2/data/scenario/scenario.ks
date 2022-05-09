*プロローグ

[voconfig name=alice vostorage=alice{number}.ogg number=0]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=0]
[voconfig name=priest vostorage=priest{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
昭和七十四年七月、ボクはキミに出逢った。[l][r]
#narrator
人類が滅亡するまでの、最期のひとつきの、これは物語だ。[p]

[autosave]
[bg2 storage=map.png time=1000 wait=false method=vanishIn]
#alice
キミには三通の手紙を届けてもらう。[l][r]
#alice
本牧カテドラル。[l][r]
#alice
横濱市資源循環局本牧事務所。[l][r]
#alice
魚人港湾労働組合。[p]
[vostop]

*選択肢

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[voconfig name=priest vostorage=priest{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
少尉、どこに手紙を届けるの。
[vostop]
[glink color=btn_06_black target=*カテドラル x=48 y=32 text=本牧カテドラル size=32]
[glink color=btn_06_black target=*リサイクル x=48 y=128 text=横濱市資源循環局本牧事務所 size=32]
[glink color=btn_06_black target=*ハーバー x=48 y=224 text=魚人港湾労働組合 size=32]
[s]

*カテドラル

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[voconfig name=priest vostorage=priest{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
本牧カテドラルは、居留地に建設されたメシア教教会を礎とする。[l][r]
#narrator
無名戦士の墓が設けられている。[p]

[autosave]
#danu
メサイア会かぁ。[l][r]
#danu
苦手なんだよね。[l][r]
#danu
アタシたち、無[ruby text=シン・レス spacing=4]原罪だから。[p]

[autosave]
#priest
無原罪のアリスからの書簡か。[p]
[vostop]
[jump target=*選択肢]

*リサイクル

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=4]
[voconfig name=narrator vostorage=narrator{number}.ogg number=4]
[voconfig name=priest vostorage=priest{number}.ogg number=1]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

*ハーバー

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=4]
[voconfig name=narrator vostorage=narrator{number}.ogg number=4]
[voconfig name=priest vostorage=priest{number}.ogg number=1]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[return]
