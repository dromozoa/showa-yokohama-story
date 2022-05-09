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
本牧大[ruby text=カテドラル spacing=4]聖堂。[l][r]
#alice
横濱市資源循環局。[l][r]
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
[glink color=btn_06_black target=*カテドラル x=48 y=32 text=本牧大聖堂 size=32]
[glink color=btn_06_black target=*リサイクル x=48 y=128 text=横濱市資源循環局 size=32]
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
本牧大[ruby text=カテドラル spacing=4]聖堂。[l][r]
#narrator
徳川軍政時代末期、居留地に献堂された近代日本最初のメシア教会。[l][r]
#narrator
大震災で崩壊し、現在の場所に移転した。[p]

[autosave]
#danu
メサイア会かぁ。[l][r]
#danu
苦手なんだよね。[l][r]
#danu
アタシたち、無[ruby text=シンレス spacing=10.666666666666666]原罪だから。[p]

[autosave]
#danu
アンタ、詳しくないんだっけ。[l][r]
#danu
取り[ruby text=チェンジリング spacing=8]替え子。新[ruby text=ニュータイプ]人類。魔人。[l][r]
#danu
油をそそがれなかった者たち。[l][r]
#danu
遡及的に。[p]

[autosave]
#narrator
本牧山要塞の坂をキミはのぼった。[l][r]
#narrator
用向きを告げる。[l][r]
#narrator
名宛人は墓掃除をしていると、侍祭が応えた。[p]

[autosave]
#narrator
神父は無名戦士の墓を磨いていた。[l][r]
#narrator
キミは手紙を渡す。[p]

[autosave]
#priest
総[ruby text=ヴァチカン spacing=4]本山は容認したか。[p]

[autosave]
#danu
それでも容認できない類の、アンタたちは[ruby text=ブラザーフッド]侠でしょ。[l][r]
#danu
屍都の女王から伝言。[l][r]
#danu
彼がそれだって。[p]

[autosave]
#priest
あ[ruby text=いつ]奴の弟子か。[l][r]
#priest
その銃に刻印された信[ruby x=-16 text=プリンシプル]条をキミは知るか。[l][r]
#priest
人類のための人類であれ、人類とともに。[l][r]
#priest
ラテン語で、そう刻印されているはずだ。[p]

[autosave]
#priest
三十年前、東京ナロードニキ大学の入試が中止された年、ワタシたちはメサイア会の高校を卒業した。[l][r]
#priest
その銃は、卒業の祝いとしてあ[ruby text=いつ]奴に贈られた。[p]

[autosave]
#priest
無原罪のアリスからの書簡か。[p]
[vostop]
[jump target=*選択肢]

*リサイクル

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=11]
[voconfig name=narrator vostorage=narrator{number}.ogg number=10]
[voconfig name=priest vostorage=priest{number}.ogg number=8]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

*ハーバー

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=11]
[voconfig name=narrator vostorage=narrator{number}.ogg number=10]
[voconfig name=priest vostorage=priest{number}.ogg number=8]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[return]
