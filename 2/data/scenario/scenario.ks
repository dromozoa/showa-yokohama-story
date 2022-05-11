*プロローグ

[voconfig name=alice vostorage=alice{number}.ogg number=0]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
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
資源循環局中事務所。[l][r]
#alice
魚人港湾労働組合。[p]
[vostop]

*選択肢

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=0]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[voconfig name=priest vostorage=priest{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
少尉、どこに手紙を届けるの。
[vostop]
[glink color=btn_06_black target=*聖職者 x=48 y=32 text=本牧大聖堂 size=32]
[glink color=btn_06_black target=*技術者 x=48 y=128 text=資源循環局中事務所 size=32]
[glink color=btn_06_black target=*活動家 x=48 y=224 text=魚人港湾労働組合 size=32]
[s]

*聖職者

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
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
関東大震災で崩壊し、現在の場所に移転した。[p]

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
取り[ruby text=チェンジリング spacing=8]替え子。新[ruby text=ニュータイプ]人類。亜人。異人。魔人。[l][r]
#danu
油をそそがれなかった者たち。[l][r]
#danu
──遡及的に。[p]

[autosave]
#narrator
本牧山要塞の坂をキミはのぼっていった。しかし、一朶の白い雲はどこにも見つからなかった。[l][r]
#narrator
門前で用向きを告げる。[l][r]
#narrator
名宛人は墓掃除をしていると、侍祭が応えた。[p]

[autosave]
#narrator
神父は無名戦士の墓を磨いていた。[l][r]
#narrator
キミは手紙を渡す。[p]

[autosave]
#priest
本[ruby x=-16 text=ヴァチカン]山は総攻撃を容認したか。[p]

[autosave]
#danu
それでも容認できない類の、アンタたちは[ruby text=ブラザーフッド]幇でしょ。[p]

[autosave]
#priest
屍都の女王が、[ruby text=こす]狡い手を遣うじゃないか。[p]

[autosave]
#danu
調[ruby x=-16 text=チョ spacing=32]子づいてんじゃねぇぞ。[l][r]
#danu
大佐をそう呼んだ奴[ruby x=-16 text=ヒューマン]輩は、[ruby text=みんな]皆はかなくなった。[p]

[autosave]
#priest
そうではない。[l][r]
#priest
そうではないのだ。[l][r]
#priest
習合された地母神の名を名のる娘よ。[p]

[autosave]
#priest
アウシュビッツ。ヒロシマ。[l][r]
#priest
名づけられた、そして、名づけられなかった沢山の悲劇たち。[l][r]
#priest
二十世紀、人類の魂は傷つき、人間性は損なわれた。[l][r]
#priest
とこしえに。[p]

[autosave]
#priest
破[ruby x=-16 text=カタストロフ]局が、とどめをさした。[l][r]
#priest
生きのこるために、人類は人類を選別した。[l][r]
#priest
生きのこるために、みずから人間性を手放したのだ。[l][r]
#priest
信仰なかりせば、いまや人類と屍[ruby x=-16 text=ゾンビ spacing=8]者は区別できない。[p]

[autosave]
#danu
それって、ありなの。アンタんとこの教義的に。[l][r]
#danu
人類、あらかじめ滅んでんじゃん。[p]

[autosave]
#priest
それでも、救いはあるさ。[l][r]
#priest
探偵の弟子よ。[l][r]
#priest
そのガヴァメントには、ラテン語で刻印されている。[l][r]
#priest
人類のための人類であれ、人類とともに。[p]

[autosave]
#priest
三十年前、東京大学の入試が中止された年、ワタシたちはメサイア会の高校を卒業した。[l][r]
#priest
その銃は、卒業の祝いとしてあ[ruby text=いつ]奴に贈られたものだ。[p]

[autosave]
#danu
人類でないものたちを、その銃は救わないの。[p]

[autosave]
#priest
人は人を救わない。ただ、赦すのみだ。[l][r]
#priest
救うのは主だ。人間と人間に似た者たちすべてを。[l][r]
#priest
まあ、まかせておけ。[l][r]
#priest
駱駝を狭い門にねじこむのは得意なんだ。[p]

[autosave]
#priest
魔女の口車にだって乗ってやろうじゃないか。[l][r]
#priest
核攻撃を阻止するためならば、是非もない。[l][r]
#priest
ワタシたちは、そういう[ruby text=アラムナイ]幇だからな。[p]

[autosave]
#danu
新式の歩兵銃を三百、用意してるけど。[p]

[autosave]
#priest
弾薬だけでいい。[l][r]
#priest
知らんのか。[l][r]
#priest
十[ruby text=クルセイダーズ]字軍は聖別されたカラシニコフで屍[ruby x=-16 text=ゾンビ spacing=8]者を打倒する。[l][r]
#priest
土産を持たせる。すこし待て。[p]

[autosave]
#narrator
神父が歩み去る。[l][r]
#narrator
無名戦士の墓碑に向きなおり、ダヌーは陸式の礼を捧げた。[l][r]
#narrator
掃除用具を拾い、キミは墓を磨いた。[l][r]
#narrator
年代物の葡萄酒を受けとり、帰路についた。[p]
[vostop]
[jump target=*選択肢]

*技術者

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=15]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
武装臨海鉄道、本牧線、横濱本牧駅。[l][r]
#narrator
資源循環局、総力戦政策調整部、武器製[ruby text=ウェポン・メーカーズ spacing=7.1111111111111107]造推進課。[l][r]
#narrator
自動車を解体して円匙と斧槍を製造する。[l][r]
#narrator
いわば、官営のリサイクル工場だ。[p]

[autosave]
#narrator
キミは手紙をさしだし、課長の名刺を受けとる。[p]

[autosave]
#engineer
課長といっても、名ばかりの管理職でね。[l][r]
#engineer
武装ピックアップ二台。電源車。弾薬十基数。[l][r]
#engineer
戦争でもするのか。[p]

[autosave]
#danu
戦争をするんだよ。[p]

[autosave]
#danu
屍[ruby x=-16 text=ゾンビ spacing=8]者ウイルスは存在しない。[l][r]
#danu
栄養補給なしで、屍[ruby x=-16 text=ゾンビ spacing=8]者は動きつづける。[p]

[autosave]
#narrator
キミは手紙をさしだし、課長の名刺を受けとった。[p]

[autosave]
#engineer
課長といっても、名ばかりの管理職でね。[l][r]
#engineer
もとはファナティックで技術者をやっていたんだ。[p]
[vostop]
[jump target=*選択肢]

*活動家

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=18]
[voconfig name=engineer vostorage=engineer{number}.ogg number=5]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=20]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#magi
南氷洋捕鯨船団、仮称リヴァイアサンを失探したみたいです。[l][r]
#magi
座標は、南緯四十九度、西経百二十三度。[l][r]
#magi
太平洋到[ruby x=-16 text=ポイント・ネモ spacing=24]達不能極。[p]

[autosave]
#alice
マジかぁ。[l][r]
#alice
魚人ども、なにやらかしてくれてんの。[p]

[autosave]
#danu
あー、ルルイエですか。[p]

[autosave]
#alice
分遣隊βに死んでもらうしかないか。[p]
[vostop]
[jump target=*選択肢]

[return]
