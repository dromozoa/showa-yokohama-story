*プロローグ

[iscript]
sf.priest = 0;
sf.engineer = 0;
sf.activist = 0;
[endscript]
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
新式の歩兵銃を三百、弾も用意してるけど。[p]

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

*聖職者済

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=15]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
本牧大[ruby text=カテドラル spacing=4]聖堂は、もう行かないよ。[l][r]
#danu
苦手だっていったじゃん。[p]
[vostop]
[jump target=*選択肢]

*工学者

[iscript]
sf.engineer += 1;
[endscript]
[if exp="sf.engineer > 1"]
[jump target=*工学者済]
[endif]
[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=17]
[voconfig name=engineer vostorage=engineer{number}.ogg number=0]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=14]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
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
斬[ruby x=-16 text=首ちょんぱ]首した屍[ruby x=-16 text=ゾンビ spacing=8]者をＭＲＩにつっこんで調べた。[l][r]
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
破[ruby x=-16 text=カタストロフ]局初期、自動車を解体して円匙と斧槍を製造した解体工場。[l][r]
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
大隊の十基数、用意してる。[p]

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
昭和六十年代初頭、情報社会の高度化にともない、ある多国間プロジェクトが起ちあげられた。[l][r]
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
ここまでなら、ゲーデル数だな。[l][r]
#engineer
バベルの図書館。世界夫[ruby text=アカシック・レコード spacing=7.1111111111111107]人の記憶。[p]

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
真偽がさだかでない機密情報を、方舟に載せようとした。[l][r]
#engineer
ケネディ暗殺計画。超人[ruby x=-16 text=ＭＫウルトラマン]計画。無名祭祀書。[l][r]
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
さあね。ブルバキみたいなもんかもしれない。[p]

[autosave]
#danu
演算それ自体が、世界を書きかえるってどういうこと。[p]

[autosave]
#engineer
わからんね。[l][r]
#engineer
字句通りに解釈するならば、ある種の計算のひとつひとつが、定数の異なる宇宙を生成する。[l][r]
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
珈[ruby x=-16 text=コーヒ spacing=8]非を飲みほして、キミは事務所を辞した。[p]
[vostop]
[jump target=*選択肢]

*工学者済

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=41]
[voconfig name=engineer vostorage=engineer{number}.ogg number=36]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#danu
資源循環局は、もう行ったよね。[p]
[vostop]
[jump target=*選択肢]

*活動家

[voconfig name=alice vostorage=alice{number}.ogg number=4]
[voconfig name=danu vostorage=danu{number}.ogg number=42]
[voconfig name=engineer vostorage=engineer{number}.ogg number=36]
[voconfig name=magi vostorage=magi{number}.ogg number=0]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
[voconfig name=yukio vostorage=yukio{number}.ogg number=0]
[vostart]

[autosave]
#magi
南氷洋捕鯨船団、仮称リヴァイアサンを失探したみたいです。[l][r]
#magi
座標は、南緯四十九度、西経百二十三度。[l][r]
#magi
通称、太平洋到[ruby x=-16 text=ポイント・ネモ spacing=24]達不能極。[p]

[autosave]
#danu
[ruby text=デリモ]糞。マジかぁ。[l][r]
#danu
深[ruby text=ディープ・ワンズ]き者、なにやらかしてくれてんの。[p]

[autosave]
#alice
[ruby text=ミエルダ]糞。ルルイエか。[l][r]
#alice
β分遣隊に護国の鬼になってもらうしかないな。[p]
[vostop]

*拒否

[voconfig name=alice vostorage=alice{number}.ogg number=6]
[voconfig name=danu vostorage=danu{number}.ogg number=44]
[voconfig name=engineer vostorage=engineer{number}.ogg number=36]
[voconfig name=magi vostorage=magi{number}.ogg number=3]
[voconfig name=narrator vostorage=narrator{number}.ogg number=23]
[voconfig name=priest vostorage=priest{number}.ogg number=30]
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
──四半世紀が経った。[l][r]
#narrator
世界人口は十億人を下回った。[l][r]
#narrator
あらたな黙示録の獣が、地上を闊歩している。[p]

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

[return]
