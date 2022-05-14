*プロローグ

[iscript]
sf.priest = 0;
sf.engineer = 0;
sf.activist = 0;
sf.counter = 0;
[endscript]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
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
資源循環局。[l][r]
#alice
魚人港湾労働組合。[p]
[vostop]

*選択肢

[if exp="sf.counter == 1"]
[call target=*菊と刀1]
[endif]
[if exp="sf.counter == 3"]
[jump target=*特殊攻撃作戦]
[endif]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
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
[glink color=btn_06_black target=*工学者 x=48 y=128 text=資源循環局 size=32]
[glink color=btn_06_black target=*活動家 x=48 y=224 text=魚人港湾労働組合 size=32]
[s]

*聖職者

[iscript]
sf.priest += 1;
[endscript]
[if exp="sf.priest > 1"]
[jump target=*聖職者済]
[endif]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=1]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=2]
[voconfig name=priest vostorage=priest{number}.ogg number=0]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

*聖職者未

[iscript]
sf.counter += 1;
[endscript]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
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
それでもそれを容認できない類の、アンタたちは[ruby text=ブラザーフッド]幇でしょ。[p]

[autosave]
#priest
屍都の女王が、[ruby text=こす]狡い手を遣うじゃないか。[p]

[autosave]
#danu
調[ruby x=-16 text=チョ spacing=32]子づいてんじゃねぇぞ。[l][r]
#danu
荒[ruby x=-16 text=あらの spacing=8]野の誘惑だってのは、まあ、否定できないけど。[p]

[autosave]
#priest
習合された地母神の名を名のる娘よ。[l][r]
#priest
メサイア会、舐めてんじゃねえぞ。[l][r]
#priest
あ[ruby text=いつ]奴の銃を継いだキミよ。[l][r]
#priest
そのガヴァメントには、なんと刻印されているか。[p]

[autosave]
#priest
他者のための人類たれ、他者とともに。[l][r]
#priest
それが、ワタシたちの信[ruby x=-16 text=プリンシプル]条だ。[l][r]
#priest
[ruby text=よ]善きサマリア人のたとえ。隣人愛。[p]

[autosave]
#danu
ジェリコにくだる途中、人類でないものが強盗に襲われたら、少尉の銃は救ってくれるの。[p]

[autosave]
#priest
銃は人を救わない。[l][r]
#priest
人は人を救わない。[l][r]
#priest
人は愛し、ただ、赦すのみ。[p]

[autosave]
#danu
こたえになってなくね。[l][r]
#danu
原罪を、あらかじめ喪ったアタシたちに救いはあるの。[p]

[autosave]
#priest
傷つけられ、虐げられた、幼[ruby x=-16 text=おさなご]子よ。[l][r]
#priest
天国の門は開かれている。[l][r]
#priest
ホモ・サピエンス・サピエンスと種や属が異なろうと、キリスト者でなかろうと。だが、しかし、──[p]

[autosave]
#priest
アウシュビッツ。ヒロシマ。ナガサキ。[l][r]
#priest
名づけられた、そして、名づけられなかった沢山の悲劇たち。[l][r]
#priest
二十世紀、人類の魂は傷つき、人間性は損なわれた。[p]

[autosave]
#priest
破[ruby x=-16 text=カタストロフ]局が、とどめをさしたともいえる。[l][r]
#priest
生きのこるために、人類は人類を選別した。[l][r]
#priest
生きのこるために、みずから人間性を手放したのだ。[l][r]
#priest
信仰なかりせば、いまや人類は屍[ruby x=-16 text=ゾンビ spacing=8]者と区別できない。[p]

[autosave]
#danu
それって、ありなの。アンタんとこの教義的に。[l][r]
#danu
人類、あらかじめ滅んでんじゃん。[p]

[autosave]
#priest
しかし、いつだって、まだ機[ruby x=-16 text=チャンス]会はある。[l][r]
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
新式の歩兵銃を三百、弾も用意してるけど。[p]

[autosave]
#priest
弾薬だけでいい。[l][r]
#priest
知らんのか。[l][r]
#priest
極東十[ruby text=クルセイダーズ]字軍は聖別されたカラシニコフで屍[ruby x=-16 text=ゾンビ spacing=8]者を打倒する。[l][r]
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

*聖職者済

[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=17]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
大[ruby text=カテドラル spacing=4]聖堂は行ったじゃん。[p]
[vostop]
[jump target=*選択肢]

*工学者

[iscript]
sf.engineer += 1;
[endscript]
[if exp="sf.engineer > 1"]
[jump target=*工学者済]
[endif]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=18]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

*工学者未

[iscript]
sf.counter += 1;
[endscript]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=18]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
人間だけが、屍[ruby x=-16 text=ゾンビ spacing=8]者になると思われてきた。[l][r]
#danu
咬みつかれても引っかかれても、犬や猫は屍[ruby x=-16 text=ゾンビ spacing=8]者にならない。[l][r]
#danu
毒でやられるだけ。[l][r]
#danu
すばしっこいから、ノロマの攻撃なんかよけるけど。[p]

[autosave]
#danu
仮称リヴァイアサンの出現で、科学者たちは、あわてて資料を引っくりかえした。[l][r]
#danu
大型類人猿が屍[ruby x=-16 text=ゾンビ spacing=8]者になったという記録はあった。[p]

[autosave]
#danu
具体的には、ボノボだったらしいんだけど。[l][r]
#danu
屍[ruby x=-16 text=ゾンビ spacing=8]者化したオスを、メスの集団が崖から突きおとした。[l][r]
#danu
人間とちがって毛皮があるのに、なんで感染したんだろうね。[p]

[autosave]
#danu
十年間、科学者たちは探しもとめたけど、屍[ruby x=-16 text=ゾンビ spacing=8]者菌も屍[ruby x=-16 text=ゾンビ spacing=8]者ウイルスも見つけられなかった。[l][r]
#danu
だから、特効薬も予[ruby text=ワクチン spacing=10.666666666666666]防薬も作れなかった。[p]

[autosave]
#danu
斬[ruby x=-16 text=くびちょんぱ]首した屍[ruby x=-16 text=ゾンビ spacing=8]者をＭＲＩにつっこんで調べた。[l][r]
#danu
観測できる範囲で、脳が活動していないことはわかってる。[l][r]
#danu
それなのに、うなり声をあげるんだ。[l][r]
#danu
首からしたがついてたら、動きまわるんだよ。[p]

[autosave]
#danu
そんで、科学者たちが立てた仮説。[l][r]
#danu
脳の言語野に寄生する、細菌でもウイルスでもないなにか。[l][r]
#danu
たとえば、模[ruby text=ミーム spacing=24]倣子みたいな。[p]

[autosave]
#danu
この郵便の宛先は、そういうのにくわしいんだって。[p]

[autosave]
#narrator
武装臨海鉄道、本牧線、横濱本牧駅。[l][r]
#narrator
資源循環局、総力戦政策調整部、武器製[ruby text=ウェポン・メーカーズ spacing=7.1111111111111107]造推進課。[l][r]
#narrator
破[ruby x=-16 text=カタストロフ]局初期、自動車を解体して円匙と斧槍を製造した工場。[l][r]
#narrator
つまりは、官営のリサイクル工場。[p]

[autosave]
#narrator
キミは手紙をさしだし、課長の名刺を受けとった。[l][r]
#narrator
即席[ruby x=-16 text=インスタントコーヒ]珈非が湯気をたてている。[p]

[autosave]
#engineer
課長といっても、名ばかりの管理職でね。[l][r]
#engineer
もとは扶桑ファナティックでメカトロをやっていたんだが、なんの因果か、公僕になっちまった。[l][r]
#engineer
とは言い条、親友の娘の依頼だ。かなえるさ。[p]

[autosave]
#engineer
装甲ピックアップ二台。自走式電源車。[l][r]
#engineer
どんとこい。[l][r]
#engineer
弾薬は要らないんだね。[p]

[autosave]
#danu
大隊十基数、用意してる。[p]

[autosave]
#engineer
いやはや、戦争[ruby x=-16 text=サマー・オブ・ウォー]の夏だな。[p]

[autosave]
#danu
決戦の夏、日本の夏っていうじゃん。[p]

[autosave]
#engineer
いわないんじゃないかな。[p]

[autosave]
#engineer
昭和六十年代初頭、情報社会の高度化にともない、国際的プロジェクトが起ちあげられた。[l][r]
#engineer
情報方舟計画。離散化された情報を、収[ruby text=レーザ spacing=24]束光で石英硝[ruby x=-16 text=ガラス spacing=8]子に彫刻して、スヴァールバル諸島の永久凍土に保存する。[p]

[autosave]
#engineer
まあ、破[ruby x=-16 text=カタストロフ]局のどさくさで立ちぎえになったんだが。[l][r]
#engineer
根岸の一般設計学研究所が、日本の拠点になった。[l][r]
#engineer
数値風洞で演算した結果を、初芝の生産工学研究所で硝[ruby x=-16 text=ガラス spacing=8]子に灼きつける。[p]

[autosave]
#engineer
一般設計学研究所に、スティーブンという研究者がいた。[l][r]
#engineer
マックス・プランクから引っぱってきたんだったかな。[p]

[autosave]
#engineer
スティーブンの研究は、情報理工学的には、異端だった。[l][r]
#engineer
かつて計算され、これから計算されるだろう、すべての[ruby text=かず]数。[l][r]
#engineer
ここまでなら、いわゆるゲーデル数だな。[l][r]
#engineer
あるいは、バベルの図書館。世界夫[ruby text=アカシック・レコード spacing=7.1111111111111107]人の記憶。[p]

[autosave]
#engineer
計算という行為、演算それ自体が、世界を書きかえる。[l][r]
#engineer
当為と存在の反転。そう論文に書かれていた。[l][r]
#engineer
意味はまったくわからん。[p]

[autosave]
#engineer
スティーブンがやったことは、実際には、ある種の情報テロルだ。[l][r]
#engineer
真偽さだかならぬ機密情報を、方舟に載せようとした。[l][r]
#engineer
大[ruby text=ケネディ spacing=10.666666666666666]統領暗殺計画。超人[ruby x=-16 text=ＭＫウルトラマン]計画。無名[ruby text=ネームレス・カルツ spacing=2]祭祀書。[l][r]
#engineer
そのほか、有象無象。[p]

[autosave]
#engineer
結局、スパコンも石英硝[ruby x=-16 text=ガラス spacing=8]子も打ち捨てられた。[l][r]
#engineer
そんな道楽に費やす資源の余裕を、人類は喪ったからね。[l][r]
#engineer
だから、それらはそこにありつづけている。[p]

[autosave]
#engineer
それが、スティーブンの噂の本当のところなのさ。[l][r]
#engineer
救いはない。[l][r]
#engineer
だが、しかし──[p]

[autosave]
#danu
スティーブンって、実在した人物なの。[p]

[autosave]
#engineer
さあな。[l][r]
#engineer
ブルバキみたいなもんかもしれない。[p]

[autosave]
#danu
演算それ自体が、世界を書きかえるって、どうやって。[p]

[autosave]
#engineer
わからんね。[l][r]
#engineer
字句通りに解釈するなら、ある種の計算のひとつひとつが、定数の異なる宇宙を生成する。[l][r]
#engineer
なんのこっちゃ。[p]

[autosave]
#danu
そのとき、世界は遡及的に変容するのかな。[p]

[autosave]
#narrator
応えはなかった。[l][r]
#narrator
応えは求められていなかった。[l][r]
#narrator
珈[ruby x=-16 text=コーヒ spacing=8]非を飲みほして、キミは席を立った。[p]
[vostop]
[jump target=*選択肢]

*工学者済

[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=42]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
資源循環局は、もう行ったよね。[p]
[vostop]
[jump target=*選択肢]

*活動家

[iscript]
sf.activist += 1;
[endscript]
[if exp="sf.activist > 1"]
[jump target=*活動家済]
[endif]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=43]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

*活動家未

[iscript]
sf.counter += 1;
[endscript]
[voconfig name=activist vostorage=activist{number}.ogg number=0]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=43]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
本牧異人町。[l][r]
#narrator
蒲鉾兵舎にかかげられたネオンに、灯はともっていない。[l][r]
#narrator
リックス・カフェ・アメリカン。[p]

[autosave]
#narrator
入口のかたわらにベニヤ看板。[l][r]
#narrator
角ばった字で、魚人港湾労組。[l][r]
#narrator
ポリ塩化ビニル暖簾を、キミはくぐった。[p]

[autosave]
#activist
おまえさん、探[ruby x=-16 text=ピンカートン]偵の弟子か。[l][r]
#activist
ピケやぶりなら帰ってくれ。[p]

[autosave]
#danu
どっちかっていうと、ボス交。[p]

[autosave]
#activist
なんか註文しろや。[l][r]
#activist
こっちゃパートタイムで闘争してんだ。[p]

[autosave]
#danu
あれを弾いて、サム。[l][r]
#danu
アズ・タイム・ゴーズ・バイ。[p]

[autosave]
#activist
そういう意味じゃねえ。[l][r]
#activist
だいたいピアノがねえよ。[l][r]
#activist
コーラでいいな。[p]

[autosave]
#narrator
風呂敷包みを卓[ruby x=-16 text=テーブル]子に置き、キミはぬるいコーラをあおった。[l][r]
#narrator
店主に手紙をすべらせる。[p]

[autosave]
#activist
その銃な、海兵隊からカードでまきあげたんだとさ。[l][r]
#activist
あ[ruby text=いつ]奴は、そう吹いてた。[l][r]
#activist
刻印されてるだろ。[l][r]
#activist
他者のための[ruby text=メン]人であれ。[p]

[autosave]
#danu
変わることができない、あいかわらず男根[ruby x=-16 text=マチズモ spacing=21.333333333333332]主義の[ruby text=パルタイ]幇だ。[p]

[autosave]
#activist
万国の労働者、団結[ruby x=-16 text=ユナイト spacing=21.333333333333332]せよ。[l][r]
#activist
魚人とともに。[p]

[autosave]
#danu
しら[ruby x=-16 text=ホワイトキック spacing=2.6666666666666665]ける。[l][r]
#danu
いつも、こんなに客いないの。[p]

[autosave]
#activist
営業時間外だからな。[l][r]
#activist
正味のところ、ダゴン秘密教団の集会のせいさ。[l][r]
#activist
神、海に知ろしめす、ってな。[l][r]
#activist
本題にはいれよ、魔人小隊。[p]

[autosave]
#danu
今日ご紹介するのは、こちらのマイクロフィルムなんです。[l][r]
#danu
あのミスカトニック大学で、アル・アジフを高解像度スキャン。[l][r]
#danu
不完全な写本をつかったせいで、浮上したルルイエがすぐ沈んじゃって困っているアナタ。[p]

[autosave]
#danu
このマイクロフィルムなら、そんなことはございません。[l][r]
#danu
今なら、初心者でも簡単、あなたにも星辰の正しい位置がわかる、ルルイエ異[ruby x=-16 text=テクスト]本がついてきます。[l][r]
#danu
さらに読取機もつけて、お値段はおどろきの──[p]

[autosave]
#narrator
キミは風呂敷の結びをほどいた。[p]

[autosave]
#danu
アタシたちの分析では、ダゴン秘密教団を放置すると、深[ruby text=ディープ・ワンズ]き者は人類に敵対することになる。[l][r]
#danu
合衆国からかっぱらった原潜、まだ動くんでしょ。[p]

[autosave]
#activist
ノーコメント。[l][r]
#activist
ナンセーンス。[p]

[autosave]
#danu
このまま、過激派が多数をおさえちゃったら、魚人社会は仮称リヴァイアサンを神と崇める狂信者集団になる。[l][r]
#danu
仮称リヴァイアサンを撃滅しても、北海道にＳＬＢＭが撃ちこまれる。[p]

[autosave]
#danu
したっけ、人類は、太平洋到[ruby x=-16 text=ポイント・ネモ spacing=24]達不能極をＩＣＢＭで叩くことを躊躇しない。[l][r]
#danu
世界は核の炎に包まれる。[l][r]
#danu
それって、アンタたち、受けいれられるの。[p]

[autosave]
#activist
受けいれないさ。[l][r]
#activist
しかし、それと、そのマイクロフィルムがどう関係する。[p]

[autosave]
#danu
ダゴン秘密教団の教義は、新興カルト一般のそれ。[l][r]
#danu
いろんな神話や伝説をパッチワークしたでっちあげ。[p]

[autosave]
#danu
そういうのって、脆弱性を持つんだよね。[l][r]
#danu
いかんともしがたく。[l][r]
#danu
器質的なもんだったらおもしろいよね。[l][r]
#danu
人類や人類っぽいものの。[p]

[autosave]
#danu
特殊検索群プレゼンツ。[l][r]
#danu
絶対安全ネクロノミコン。[l][r]
#danu
深[ruby text=ディープ・ワンズ]き者を世論操作するべく開発された、できたてほやほや物語論兵器。[p]

[autosave]
#narrator
店主は叶[ruby text=イェヘユアン]和圓に火を点けた。[p]

[autosave]
#activist
大衆のメタンアンフェタミンってか。[l][r]
#activist
アヘンじゃなくて。[l][r]
#activist
喫うか。菊の紋がはいったやつもあるぜ。[p]

[autosave]
#danu
土産にちょうだい。[l][r]
#danu
うちには喫うやつもいるから。[l][r]
#danu
それで、納得できないかな。[p]

[autosave]
#danu
仮称リヴァイアサンを拝むのは、まあ、自由かもしれないけど。[l][r]
#danu
どうせ、小魚みたいに、頭からぽりぽり食べられちゃうよ。[l][r]
#danu
信教の自由は、そこまでは含まないっしょ。[p]

[autosave]
#danu
それが総意で、それが本望だったとしても、死んじゃったら、アタシたちは哀しいよ。[l][r]
#danu
やっぱり、生きていてほしいと思うんだよ。[l][r]
#danu
そのための、いってみりゃ、脱洗脳だと思ってよ。[p]

[autosave]
#activist
まあ、いい。[l][r]
#activist
表向きの理由は了解した。[p]

[autosave]
#danu
ぜんぶはなしたし。[l][r]
#danu
裏の理由なんてないよ。[l][r]
#danu
少尉の拳銃にかけて。[p]

[autosave]
#narrator
いうまでもない。[l][r]
#narrator
裏はある。[l][r]
#narrator
特殊検索群が本当におそれたのは、全面核戦争ではない。[p]

[autosave]
#narrator
仮称リヴァイアサンから、仮称がとれてしまうこと。[l][r]
#narrator
遡及的に、深[ruby text=ディープ・ワンズ]き者の神になってしまうこと。[l][r]
#narrator
それを危惧した先制攻撃だ。[p]

[autosave]
#danu
そんで、どうなの。[l][r]
#danu
できるよね。[l][r]
#danu
深[ruby text=ディープ・ワンズ]き者穏健派の首魁。[l][r]
#danu
最初の魚人のひとり。[p]

[autosave]
#activist
できるさ。[l][r]
#activist
やらいでか。[p]

[autosave]
#danu
ありがと。[l][r]
#danu
ところで、煙[ruby x=-16 text=ヤニ spacing=32]草喫う魚人ってはじめて見たよ。[l][r]
#danu
肺、どうなってんの。[p]

[autosave]
#activist
学[ruby x=-16 text=ガキ spacing=32]生のころからの習い性だからさ。[l][r]
#activist
あ[ruby text=いつ]奴とつるんでさ。[p]

[autosave]
#narrator
フィルタつき叶[ruby text=イェヘユアン]和圓のカートンをキミは受けとる。[l][r]
#narrator
ダヌーは古い歌をハミングした。[l][r]
#narrator
ただよう臭いが煙草のせいなのかどうか、キミにはわからなかった。[p]
[vostop]
[jump target=*選択肢]

*活動家済

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=90]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=42]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
手紙は届けられてしまったよ、すでに。[p]
[vostop]
[jump target=*選択肢]

*菊と刀1

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=91]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=42]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
情報[ruby x=-16 text=メイジャイ spacing=12]分隊。[l][r]
#narrator
情報処理に特化した妖[ruby text=エルフ spacing=24]精種の幼生体の@{ruby}三人組@[/ruby トリオ}[p]
[vostop]
[return]

*特殊攻撃作戦

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=91]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=44]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
本物の豚肉を使った、肉まん。[l][r]
#danu
そういうのもあるのか。[p]

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

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=6]
[voconfig name=danu vostorage=danu{number}.ogg number=93]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=44]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#alice
今宵もアリスと地獄につきあってもらう。[p]
[vostop]
[jump target=*二章終]

*希望

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=7]
[voconfig name=danu vostorage=danu{number}.ogg number=93]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=44]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
安心して。[l][r]
#danu
アンタのことは、ダヌーがちゃんと終わらせてあげるから。[p]
[vostop]
[jump target=*二章終]

*拒否

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=7]
[voconfig name=danu vostorage=danu{number}.ogg number=95]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=44]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
少尉。[p]

[autosave]
#alice
ダヌー軍曹、いいんだ。[l][r]
#alice
我々は軍隊ではない。[l][r]
#alice
あるいは、民主主義国家の最後の民主主義的な軍隊だ。[p]

[autosave]
#alice
少尉、血のように赤い葡萄酒だった。[l][r]
#alice
うまい包[ruby x=-16 text=パオ spacing=32]子だった。[l][r]
#alice
良い晩餐だった。[l][r]
#alice
煙[ruby x=-16 text=ヤニ spacing=32]草はまずかったがな。[p]

[autosave]
#narrator
除隊したキミは、引揚船で北海道に渡る。[p]

[autosave]
#narrator
仮称リヴァイアサンが横濱に襲来した。[l][r]
#narrator
日米連合[ruby x=-16 text=グランドフリート]艦隊は、旗艦を自沈して東京湾を閉塞した。[l][r]
#narrator
統合航空軍は、空中巡洋艦から核爆雷を投下した。[p]

[autosave]
#narrator
──数年が経った。[l][r]
#narrator
ユークリッド幾何学を無視した石柱都市が浮上した。[l][r]
#narrator
人類連合軍は残された大陸間弾道ミサイルを全力で投射した。[l][r]
#narrator
妖精種はたもとを分かった。人類種とも。魚人種とも。[p]

[autosave]
#narrator
──四半世紀が経った。[l][r]
#narrator
世界人口は十億人を下回った。[l][r]
#narrator
あらたな黙示録の獣どもが、地上を闊歩している。[p]

[autosave]
#narrator
南樺太。[l][r]
#narrator
炭鉱労働を終えたキミは帰路につく。[l][r]
#narrator
昭和百年の祝賀の雰囲気は雲散霧消していた。[p]

[autosave]
#narrator
灯のない昏い道に、白い影が立つ。[l][r]
#narrator
つきしたがう十二の影は、闇にとけて見えなかった。[p]

[autosave]
#alice
返してもらいにきた。その銃を。[l][r]
#alice
終わらせにきた。人類を。世界を。[l][r]
#alice
──昭和を。[p]

[autosave]
#narrator
昭和横濱物語。アリスの黙[ruby text=リベレーション]示録。[l][r]
#narrator
了。[p]
[vostop]
[jump target=*おわり]

*二章終

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=17]
[voconfig name=danu vostorage=danu{number}.ogg number=96]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=62]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#narrator
エデンの園配[ruby x=-16 text=パターン]置は喪われた。[l][r]
#narrator
グライダー銃で撃たれて、メトセラは九百六十九歳で死んだ。[l][r]
#narrator
昭和横濱物語。スティーブンによる福音書。第二節。[l][r]
#narrator
了。（つづく）[p]
[vostop]

*おわり

[voconfig name=activist vostorage=activist{number}.ogg number=30]
[voconfig name=alice vostorage=alice{number}.ogg number=17]
[voconfig name=danu vostorage=danu{number}.ogg number=96]
[voconfig name=engineer vostorage=engineer{number}.ogg number=37]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=66]
[voconfig name=priest vostorage=priest{number}.ogg number=32]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[return]
