*開始

[voconfig name=alice vostorage=alice{number}.ogg number=0]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=0]
[vostart]

[autosave]
#narrator
昭和七十四年七月、ボクはキミに出逢った。[l][r]
#narrator
人類が滅亡するまでの、最期のひとつきの、これは物語だ。[p]

[autosave]
[bg2 storage=map.png time=1000 wait=false method=vanishIn]
#danu
アンタはここでダヌーと死ぬのよ。[p]

[autosave]
#alice
強制はしない。[l][r]
#alice
熱望か希望か拒否か、ひとつを択べ。
[vostop]
[glink color=btn_06_black target=*熱望 x=48 y=32 text=熱望する size=32]
[glink color=btn_06_black target=*希望 x=48 y=128 text=希望する size=32]
[glink color=btn_06_black target=*拒否 x=48 y=224 text=拒否する size=32]
[s]

*熱望

[voconfig name=alice vostorage=alice{number}.ogg number=2]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[vostart]

[autosave]
#alice
熱望か。[p]
[vostop]
[jump target=*デモ]

*希望

[voconfig name=alice vostorage=alice{number}.ogg number=3]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[vostart]

[autosave]
#alice
希望か。[p]
[vostop]
[jump target=*デモ]

*拒否

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[vostart]

[autosave]
#alice
拒否か。[p]
[vostop]
[jump target=*デモ]

*デモ

[voconfig name=alice vostorage=alice{number}.ogg number=5]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[vostart]

[autosave]
#narrator
壊れかけの鉱石ラジオが布[ruby x=-16 text=ハワイ spacing=8]哇陥落を伝えている。[l][r]
#narrator
終末論的[ruby text=アポカリプティック・ディスペアー・シンドローム]絶望症候群による死者数が全世界で増加傾向にある。[p]

[autosave]
#alice
今日からキミは資源調達師団特殊検索群少尉だ。[l][r]
#alice
サバルタンでもいいが、な。[p]

[autosave]
#danu
安心して。[l][r]
#danu
アンタのことは、ダヌーがちゃんと終わらせてあげるから。[p]

[autosave]
[bg2 storage=title.png time=1000 wait=false method=vanishIn]
#alice
今宵もアリスと地獄につきあってもらう。[p]

[autosave]
#danu
調[ruby x=-16 text=チョ spacing=32]子づいてんじゃねぇぞ。[p]
[vostop]

[return]
