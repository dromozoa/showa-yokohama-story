*プロローグ

[voconfig name=alice vostorage=alice{number}.ogg number=0]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
昭和七十四年七月、ボクはキミに出逢った。[l][r]
#narrator
人類が滅亡するまでの、最期のひとつきの、これは物語だ。[p]

[autosave]
#narrator
破[ruby x=-16 text=カタストロフ]局から十年。[l][r]
#narrator
現在の世界人口は約二十億人と推定される。[l][r]
#narrator
人類の生存圏は三十パーセントを下まわった。[p]

[autosave]
#narrator
人類の大半は寒冷地に押しこめられた。[l][r]
#narrator
冬が屍[ruby x=-16 text=ゾンビ spacing=8]人の脳髄を凍りつかせるから。[l][r]
#narrator
封鎖と検疫に成功した島嶼部もある。[l][r]
#narrator
人類は、南極以外の五大陸を喪いつつあった。[p]

[autosave]
#narrator
日本国は国体を北海道以北に疎開した。[l][r]
#narrator
一千万を切った人口の過半は、国家総動員体制の下、農業生産と石炭採掘に従事している。[l][r]
#narrator
本州の生存者は四十万人内外と見られる。[p]

[autosave]
[bg2 storage=map.png time=1000 wait=false method=vanishIn]
#narrator
一万人超の住民を抱える関東最大の根拠地、本牧[ruby x=-16 text=ホンモク・ディビジョン]地区。[l][r]
#narrator
資源調達師団隷下、胡狼[ruby x=-16 text=スカベンジャーズ]大隊は京浜工業地帯の資源回収に従事する。[p]

[autosave]
#narrator
対咬戦闘服に円匙をかつぎ、キミは湾岸道路下のバラック集落を巡回する。[l][r]
#narrator
キミのその日の相棒は訓[ruby text=ハンドラー spacing=4]練士のユキヲだ。[l][r]
#narrator
ユキヲの犬は屍[ruby x=-16 text=ゾンビ spacing=8]人ウイルスを嗅ぐ。[p]

[autosave]
#yukio
決戦の噂、聞いたか？[l][r]
#yukio
南本牧埠頭に大量の物資が陸揚げされてる。[l][r]
#yukio
猿島には重砲まで持ちこんでるんだとさ。[l][r]
#yukio
まあ、おかげでオレたちも本物の肉にありつけるってわけだ。[p]

[autosave]
#narrator
その日は屍[ruby x=-16 text=ゾンビ spacing=8]人にも不審者にも遭遇しなかった。[l][r]
#narrator
本部が置かれた小学校に戻り、下番したキミに大隊幕僚が声をかけた。[l][r]
#narrator
キミを訪ねてきた者がいるという。[p]

[autosave]
#yukio
おい、あれ、魔人小隊じゃねえか。[l][r]
#yukio
オマエ、なんちゅう厄ネタを抱えこんだんだ。[l][r]
#yukio
オレは逃[ruby x=-16 text=フケ spacing=32]げるぜ。[l][r]
#yukio
あばよ。[p]

[autosave]
#narrator
透きとおるように白い肌の少女。[l][r]
#narrator
フードを目深にかぶった十二人の兵が背後に従う。[p]

[autosave]
#alice
資源調達師団特殊検索群、アリス特務少佐だ。[l][r]
#alice
これは辞令。[l][r]
#alice
特殊検索群少尉に任ずる、ってね。[l][r]
#alice
たった今から、キミはボクの部下だ。[p]

[autosave]
#alice
今後ともよろしく。[l][r]
#alice
そうだ。[l][r]
#alice
キミの拳銃を見せてほしい。[p]

[autosave]
#alice
年季のはいったコルト・ガ[ruby x=-16 text=ナインティーン・イレブン spacing=11.636363636363637]ヴァメントだね。[l][r]
#alice
刻印がある。[l][r]
#alice
そうか、そういうことなんだ。[l][r]
#alice
それの持ちぬしの名前をキミは憶えているか。[p]

[autosave]
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

[voconfig name=alice vostorage=alice{number}.ogg number=13]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=22]
[voconfig name=yukio vostorage=yukio{number}.ogg number=8]
[vostart]

[autosave]
#alice
熱望か。[p]
[vostop]
[jump target=*デモ]

*希望

[voconfig name=alice vostorage=alice{number}.ogg number=14]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=22]
[voconfig name=yukio vostorage=yukio{number}.ogg number=8]
[vostart]

[autosave]
#alice
希望か。[p]
[vostop]
[jump target=*デモ]

*拒否

[voconfig name=alice vostorage=alice{number}.ogg number=15]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=22]
[voconfig name=yukio vostorage=yukio{number}.ogg number=8]
[vostart]

[autosave]
#alice
拒否か。[p]
[vostop]
[jump target=*デモ]

*デモ

[voconfig name=alice vostorage=alice{number}.ogg number=16]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=narrator vostorage=narrator{number}.ogg number=22]
[voconfig name=yukio vostorage=yukio{number}.ogg number=8]
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
