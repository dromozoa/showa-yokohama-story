(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index: 1
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],barcode:"Tutorial",label:7},
{choice:["第一節"],barcode:"Verse I",label:18},
],when:async($,ctx)=>{
if((() => {
    ctx.hour = new Date().getHours();
    return 4 <= ctx.hour && ctx.hour < 10;
  })())return 2;
if(10 <= ctx.hour && ctx.hour < 18)return 3;
},enter:async($,ctx)=>{ctx.game.newGameEvening = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };},music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[7,18]},[
["こんばんは、かな。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index: 2
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],barcode:"Tutorial",label:7},
{choice:["第一節"],barcode:"Verse I",label:18},
],enter:async($,ctx)=>{ctx.game.newGameMorning = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };},music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[7,18]},[
["おはよう。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index: 3
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],barcode:"Tutorial",label:7},
{choice:["第一節"],barcode:"Verse I",label:18},
],enter:async($,ctx)=>{ctx.game.newGameAfternoon = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };},music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[7,18]},[
["こんにちは、だね。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index: 4
[{speaker:"narrator",choices:[
{choice:["第一節"],barcode:"Verse I",label:18},
],when:async($,ctx)=>{
if(ctx.game.visitedVerse3)return 6;
if(ctx.game.visitedVerse2)return 5;
},music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[18]},[
["第一節は、","一本道","の迷路。"],
["第二節と第三節は、まだ開放されていない。"],
]],
// index: 5
[{speaker:"narrator",choices:[
{choice:["第一節"],barcode:"Verse I",label:18},
{choice:["第二節"],barcode:"Verse II",label:65},
],music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[18,65]},[
["第二節には、",["バッド","アングッド"],"エンドがあるので、気をつけて。"],
["それを択んだら、少しだけ間をおいて終わりがきます。"],
["第三節は、まだ開放されていない。"],
]],
// index: 6
[{speaker:"narrator",choices:[
{choice:["第一節"],barcode:"Verse I",label:18},
{choice:["第二節"],barcode:"Verse II",label:65},
{choice:["第三節"],barcode:"Verse III",label:187},
],music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[18,65,187]},[
[["順番","シーケンシャル"],"にしか読むことができない","類","の、これは",["媒体","メディア"],"。"],
["昭和横濱物語。スティーブンによる福音書。最終節。"],
]],
// index: 7
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[8]},[
["二人称の文体で書かれた、これは無口な一人称の物語。"],
["画面の右下で弾む円匙と斧槍のアイコンは、キミに入力をうながしている。"],
["クリックでもタッチでもエンターでも。お好みで。"],
]],
// index: 8
[{speaker:"narrator",choices:[
{choice:["人類の滅亡を見守る"],barcode:"Extinction",label:9},
{choice:["少女を犠牲に捧げる"],barcode:"Sacrifice",label:10},
{choice:["択ばない"],label:11},
],music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[9,10,11]},[
["ボクたちは、択ばれなかった選択肢の側に立つ紐帯だ。"],
["たとえば——昭和が暴走した。"],
["終わらない昭和に、このままでは人類は轢き殺される。"],
["選択肢がある。少女を犠牲に、人類を救う。"],
]],
// index: 9
[{speaker:"narrator",jump:12,music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[12]},[
["意地の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、人類は滅亡した。"],
["気にすることはない。"],
["人類なんて",["初手","はな"],"から滅んでるんだから。"],
]],
// index: 10
[{speaker:"narrator",jump:12,music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[12]},[
["胸糞の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、少女は斃れた。"],
["気に病む必要はない。"],
["キミは人類を救った。きっと。たぶん。だけど。"],
]],
// index: 11
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[12]},[
["キミは択ばないという選択肢を択んだ。"],
["択んだのか、択ばなかったのか、どちらだろう。"],
["どちらでもあり、どちらでもない。"],
["しかし、少女が行ったところまでは見えなかった。"],
]],
// index: 12
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[13]},[
["画面上部の",["システム","SYSTEM"],"ボタンを押すと、",["設定","コントロール"],"パネルが表示される。もういちど押したら、消える。"],
["パネルの下のほうは隠されているから、スクロール。"],
]],
// index: 13
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[14]},[
["キミがどこまで読んだか、システムは暗黙に記憶する。"],
["爪が折れた","三本","のテープと、爪が折れていない","三本","のテープが用意されている。"],
["キミは、明示的に、",["読出","LOAD"],"したり、",["書出","SAVE"],"したりできる。"],
]],
// index: 14
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[15]},[
[["自動","AUTO"],"再生すると、選択肢が示されるまで、あるいは、キミがなんらか入力するまで、テクストと",["音声","ボイス"],"が順番に再生されていく。"],
]],
// index: 15
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[16]},[
[["高速","SKIP"],"再生も似たようなものだけど、",["音声","ボイス"],"を再生しない。"],
["フレーム毎に","一行","、素早くテクストをつらつら書きつらねる。"],
["システム設定でチェックを入れるまで、未読の段落はスキップされない。"],
]],
// index: 16
[{speaker:"narrator",choices:[
{choice:["ツイッターで質問する"],action:async($,ctx)=>{await ctx.sender.twitter();},barcode:"Twitter",label:16},
{choice:["マシュマロで質問する"],action:async($,ctx)=>{await ctx.sender.marshmallow();},barcode:"Marshmallow",label:16},
{choice:["質問はない"],label:17},
],music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[17]},[
["こんなところ。"],
["なにか質問ある？"],
]],
// index: 17
[{speaker:"narrator",finish:"title",music:"vi03",place:"ここではないどこか",background:"モノクローム",adjacencies:[]},[
["それじゃあ、良き、終末を。"],
]],
// index: 18
[{speaker:"narrator",start:"verse1",music:"diana33",place:"日本",background:"モノクローム",adjacencies:[19]},[
["昭和七十四年七月、ボクはキミに出逢った。"],
["人類が滅亡するまでの、最期のひとつきの、これは物語だ。"],
]],
// index: 19
[{speaker:"narrator",music:"diana33",place:"日本",background:"モノクローム",adjacencies:[20]},[
[["破局","カタストロフ"],"から十年。"],
["現在の世界人口は約二十億人と推定されている。"],
["人類の生存圏は三十パーセントを下まわった。"],
]],
// index: 20
[{speaker:"narrator",music:"diana33",place:"日本",background:"モノクローム",adjacencies:[21]},[
["人類の大半は寒冷地に押しこめられた。"],
["冬が",["屍者","ゾンビ"],"の脳髄を凍りつかせるから。"],
["海を要害に、封鎖と検疫に成功した島嶼もある。"],
["総じて人類は、南極以外の五大陸を喪いつつある。"],
]],
// index: 21
[{speaker:"narrator",music:"diana33",place:"日本",background:"モノクローム",adjacencies:[22]},[
["日本国は国体を北海道以北に疎開した。"],
["一千万を切った人口の過半は、国家総動員体制の下、農業生産と石炭採掘に従事している。"],
["本州の生存者は四十万人内外と見られる。"],
]],
// index: 22
[{speaker:"narrator",music:"diana33",place:"本牧地区",background:"モノクローム",adjacencies:[23]},[
["一万人超の住民を抱える関東最大の根拠地、",["本牧地区","ホンモク・ディビジョン"],"。"],
["資源調達師団隷下、",["第一回収大隊","スカベンジャーズ"],"は京浜工業地帯を責任地域とする。"],
]],
// index: 23
[{speaker:"narrator",music:"diana33",place:"本牧地区",background:"モノクローム",adjacencies:[24]},[
["対咬","戦闘服に円匙をかつぎ、キミは湾岸道路下のバラック集落を巡回する。"],
["キミのその日の相棒は",["訓練士","ハンドラー"],"のユキヲだ。"],
["彼の犬は",["屍者","ゾンビ"],"の屍臭を嗅ぐ。"],
]],
// index: 24
[{speaker:"yukio",music:"diana33",place:"本牧地区",background:"モノクローム",adjacencies:[25]},[
["決戦の噂、聞いたか。"],
["本牧埠頭に大量の物資が陸揚げされてる。"],
["猿島","には重砲まで持ちこんでるんだとさ。"],
["おかげでオレたちも本物の肉にありつけるってわけだ。"],
]],
// index: 25
[{speaker:"narrator",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[26]},[
["その日は",["屍者","ゾンビ"],"にも不審者にも遭遇しなかった。"],
["本部が置かれた小学校に戻り、下番したキミに大隊幕僚が声をかけた。"],
["キミを訪ねてきた者がいるという。"],
]],
// index: 26
[{speaker:"yukio",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[27]},[
["おい、あれ、魔人小隊じゃねえか。"],
["オマエ、なんちゅう厄ネタを抱えこんだんだ。"],
["オレは",["逃げ","フケ"],"るぜ。"],
["あばよ。"],
]],
// index: 27
[{speaker:"narrator",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[28]},[
["透きとおるように白い肌の少女がいた。"],
["フードを目深にかぶった十二の兵が背後に従う。"],
["少女の深紅の瞳がきらめいた。"],
]],
// index: 28
[{speaker:"alice",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[29]},[
["資源調達師団特殊検索群、アリス大佐だ。"],
["これは辞令。こっちは階級章。"],
["特殊検索群少尉に任ずる、ってね。"],
["たった今から、キミはボクの部下だ。"],
]],
// index: 29
[{speaker:"alice",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[30]},[
["今後とも、よろしく……"],
["あぁ、そうだ。"],
["キミの拳銃を見せてほしい。"],
]],
// index: 30
[{speaker:"alice",choices:[
{choice:["サム・スペード"],action:async($,ctx)=>{ctx.game.father = "サム・スペード";;},barcode:"Sam Spade",label:31},
{choice:["フィリップ・マーロウ"],action:async($,ctx)=>{ctx.game.father = "フィリップ・マーロウ";;},barcode:"Philip Marlowe",label:31},
{choice:["マイク・ハマー"],action:async($,ctx)=>{ctx.game.father = "マイク・ハマー";;},barcode:"Mike Hammer",label:31},
],enter:async($,ctx)=>{delete ctx.game.father;;},music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[31]},[
["年季のはいったガヴァメントだ。"],
["刻印がある。"],
["そうか。そういうことか。"],
["その銃をキミに渡した莫迦の名前をキミは憶えているか。"],
]],
// index: 31
[{speaker:"alice",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[32]},[
["偽名を名乗るにしたって、もうちょっと品性があってもいいと思うんだけどね。"],
["まあ、いい。"],
["キミにひとりつけよう。ダヌー軍曹だ。"],
]],
// index: 32
[{speaker:"narrator",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[33]},[
["歩みでた兵がフードを脱ぐ。"],
["褐色の肌。白い髪。",["戦化粧","ガングロ"],"。"],
["——尖った耳。"],
[["闇妖精","ダークエルフ"],"だ。"],
]],
// index: 33
[{speaker:"danu",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[34]},[
["ダヌーだよ。"],
["よろー。"],
["少尉、よろしくありますか。"],
]],
// index: 34
[{speaker:"alice",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[35]},[
["ババァ、無理すんな。"],
]],
// index: 35
[{speaker:"danu",music:"diana33",place:"本牧南小学校跡",background:"モノクローム",adjacencies:[36]},[
["ロリババァは黙っていてくれないか。"],
[["マジでキレる五秒前","エムケーファイブ"],"。"],
["拠点にご案内します。"],
]],
// index: 36
[{speaker:"narrator",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[37]},[
["南","本牧","埠頭に並ぶ蒲鉾兵舎に、人間と人間に似た者たちが棲む。"],
["人呼んで、本牧異人町。"],
["一角に特殊検索群α分遣隊の拠点があった。"],
]],
// index: 37
[{speaker:"narrator",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[38]},[
["指揮所に備えられた壊れかけの黒いラジオが",["布哇","ハワイ"],"陥落を伝えている。"],
]],
// index: 38
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[39]},[
["α分遣隊にようこそ、少尉。"],
["秘匿名は",["魔女の落とし子","マジェスティック・トゥウェルヴ"],"。"],
]],
// index: 39
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[40]},[
["我々は、人類と人類っぽいものの固有の尊厳と平等で譲られぬ権利を護り、世界に自由と正義と平和を築くことを目的とする。"],
]],
// index: 40
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[41]},[
["その意味で、いや、どのような意味においても、我々は軍隊ではない。"],
["楽にしていい。"],
["無理に兵隊言葉を遣う必要もない。コギャル語もな。"],
]],
// index: 41
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[42]},[
[["超ムカつく","チョムカ"],"。"],
["ありがたくあります。"],
]],
// index: 42
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[43]},[
["状況を整理しよう。"],
["国内戦線は膠着している。"],
["北海道の食料生産は順調だ。"],
["銃後の食料統制も緩和された。"],
]],
// index: 43
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[44]},[
[["安全地帯","グリーンゾーン"],"では、",["屍者","ゾンビ"],"による死者数が",["終末論的絶望症候群","アポカリプティック・ディスペアー・シンドローム"],"や自殺による死者数を下まわった。"],
["状況は小康状態にある。"],
["そうだったらよかったのに、な。"],
]],
// index: 44
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[45]},[
["ある晩、彼または彼女は眠りにつく。傷つき絶望した人間は、夜のとばりのなか、そっと息をひきとる。"],
["明日","なんて、もう見たくないから。"],
["あーね。"],
]],
// index: 45
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[46]},[
["死に至る病とは絶望である。"],
["バーイ、アンティ・クリマクス。"],
["だから、処方箋もいっしょ、なのにね。"],
["偉い人にはそれがわからんのです。"],
]],
// index: 46
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[47]},[
["だから、決号作戦が発動した。"],
["決定的な勝利をもって厭戦気分を吹きとばす。"],
["まあ、あれだ。"],
["建前だ。"],
]],
// index: 47
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[48]},[
[["布哇","ハワイ"],"が陥落した。"],
["武装要塞都市ホノルル。"],
["合衆国でもっとも安全だったはずの島。"],
["これには仔細がある。"],
]],
// index: 48
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[49]},[
["未確認巨大敵性体、仮称リヴァイアサンが",["布哇","ハワイ"],"を強襲した。"],
["巨鯨の",["屍者","ゾンビ"],"と推測されている。"],
["審判の喇叭よろしく、仮称リヴァイアサンが吠えた。"],
]],
// index: 49
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[50]},[
["獲物を見つけた",["屍者","ゾンビ"],"はうなり声を発する。"],
["うなり声を聞いた",["屍者","ゾンビ"],"もうなり声を発する。"],
["これが群体形成の理屈。"],
]],
// index: 50
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[51]},[
["水中の",["屍者","ゾンビ"],"はうなり声を出せない。"],
["だから、",["深き者","ディープ・ワンズ"],"は",["溺屍者","ドラウンド"],"を圧倒できた。"],
["仮称リヴァイアサンの声はとても遠くまで届く。"],
["数百キロの範囲から",["溺屍者","ドラウンド"],"を呼びよせる。"],
]],
// index: 51
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[52]},[
["仮称リヴァイアサンは、いわば",["屍者","ゾンビ"],"の強襲揚陸艦だ。"],
[["布哇","ハワイ"],"は巨大群体に蹂躙された。"],
["原子力空母に避難民を満載して、合衆国太平洋艦隊は転進した。"],
]],
// index: 52
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[53]},[
["海はいまや要害ではなくなった。"],
["五大陸を喪った人類は、七つの海も喪おうとしている。"],
["だから、決号作戦が発動した。発動してしまった。"],
]],
// index: 53
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[54]},[
["仮称リヴァイアサンを東京湾に誘引して邀撃する。"],
["関東は巨大群体に滅ぼされるだろう。"],
["それでも、仮称リヴァイアサンを撃滅すれば、被害は本州に極限される。"],
]],
// index: 54
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[55]},[
["本州以外のすべての島嶼が救われる。"],
["人類が海をとりもどすための特別攻撃作戦。"],
["やれやれ。"],
["前","時代的だね。"],
]],
// index: 55
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[56]},[
["我々の任務は、それではない、冴えたやりかたを見つけることだ。"],
["そのためにボクは横濱にもどった。"],
["そのためにボクたちは横濱にいる。"],
]],
// index: 56
[{speaker:"alice",choices:[
{choice:["ある"],barcode:"Yes ma'am!",label:57},
{choice:["ない"],barcode:"No ma'am!",label:58},
],music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[57,58]},[
["さてと。"],
["スティーブンと呼ばれた人物、あるいは結社の噂を聞いたことがあるか。"],
]],
// index: 57
[{speaker:"alice",jump:59,music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[59]},[
["そうだ。飽きるほど囁かれた噂だ。"],
["戦局を一変する決戦兵器。特効薬。",["予防薬","ワクチン"],"。"],
["絶望した人間の願望が産みだした、存在しないマクガフィン。都市伝説。"],
]],
// index: 58
[{speaker:"alice",jump:59,music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[59]},[
["そうか。まあ、一顧だに値しない噂だ。"],
["戦局を一変する決戦兵器。特効薬。",["予防薬","ワクチン"],"。"],
["絶望した人間の願望が産みだした、存在しないマクガフィン。都市伝説。"],
]],
// index: 59
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[60]},[
["まだ、もうすこしだけ時間がある。"],
["キミには三通の手紙を届けてもらう。"],
]],
// index: 60
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[61]},[
["だいじょうぶい。"],
["手紙は届いてしまうよ。"],
["郵便は誤配されないよ。"],
["ダヌーがついてるから。"],
]],
// index: 61
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[62]},[
["だいじょうぶいって、コギャル語どころか、オヤジギャグじゃないか。"],
]],
// index: 62
[{speaker:"danu",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[63]},[
[["超最悪","チョベリバ"],"。"],
["あれあれ。怒らせていいんですか。"],
["遣いますよ。郵便的脱構築。"],
]],
// index: 63
[{speaker:"alice",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[64]},[
["いいですよ。遣ってください。"],
["否定神学とやらを。"],
["冗談はさておき、ボクには届けることのできない、これは手紙だから。"],
]],
// index: 64
[{speaker:"narrator",music:"diana33",place:"本牧異人町",background:"モノクローム",adjacencies:[65]},[
["これは手紙。これは郵便。"],
["これは",["物語","ナラティブ"],"。"],
["昭和横濱物語。スティーブンによる福音書。第一節。"],
["了。（つづく）"],
]],
// index: 65
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedVerse2 = true;},start:"verse2",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[66]},[
["昭和七十四年七月、ボクはキミに出逢った。"],
["人類が滅亡するまでの、最期のひとつきの、これは物語だ。"],
]],
// index: 66
[{speaker:"alice",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[67,163]},[
["キミには三通の手紙を届けてもらう。"],
["本牧",["大聖堂","カテドラル"],"。"],
["資源循環局。"],
["魚人港湾労働組合。"],
]],
// index: 67
[{speaker:"danu",choices:[
{choice:["本牧",["大聖堂","カテドラル"]],barcode:"Priest",label:68},
{choice:["資源循環局"],barcode:"Engineer",label:92},
{choice:["魚人港湾労働組合"],barcode:"Activist",label:123},
],when:async($,ctx)=>{
if($.priest && $.engineer && $.activist)return 163;
},music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[68,92,123,91,122,162]},[
["少尉、どこに手紙を届けるの。"],
]],
// index: 68
[{speaker:"narrator",when:async($,ctx)=>{
if($.priest)return 91;
},music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[69]},[
["本牧",["大聖堂","カテドラル"],"。"],
["徳川軍政時代末期、居留地に献堂された近代日本最初のメシア教会。"],
["関東大震災で崩壊し、現在の場所に移転した。"],
]],
// index: 69
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[70]},[
["メサイア会かぁ。"],
["苦手なんだよね。"],
["アタシたち、",["無原罪","シンレス"],"だから。"],
]],
// index: 70
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[71]},[
["アンタ、詳しくないんだっけ。"],
[["取り替え子","チェンジリング"],"。",["新人類","ニュータイプ"],"。","亜人","。異人。魔人。"],
["油をそそがれなかった者たち。"],
["——遡及的に。"],
]],
// index: 71
[{speaker:"narrator",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[72]},[
["本牧山要塞の坂をキミはのぼっていった。しかし、","一朶","の白い雲はどこにも見つからなかった。"],
["門前で用向きを告げる。"],
["名宛人は墓掃除をしていると、侍祭が応えた。"],
]],
// index: 72
[{speaker:"narrator",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[73]},[
["神父は無名戦士の墓を磨いていた。"],
["キミは手紙を渡す。"],
]],
// index: 73
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[74]},[
[["本山","ヴァチカン"],"は総攻撃を容認したか。"],
]],
// index: 74
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[75]},[
["それでもそれを容認できない","類","の、アンタたちは",["幇","ブラザーフッド"],"でしょ。"],
]],
// index: 75
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[76]},[
["屍都の女王が、",["狡","こす"],"い手を遣うじゃないか。"],
]],
// index: 76
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[77]},[
[["調子","チョ"],"づいてんじゃねぇぞ。"],
[["荒野","あらの"],"の誘惑だってのは、まあ、否定できないけど。"],
]],
// index: 77
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[78]},[
["習合された地母神の名を名のる娘よ。"],
["メサイア会、舐めてんじゃねえぞ。"],
["あ",["奴","いつ"],"の銃を継いだキミ。"],
["そのガヴァメントには、なんと刻印されている。"],
]],
// index: 78
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[79]},[
["他者のための人類たれ、他者とともに。"],
["それが、ワタシたちの",["信条","プリンシプル"],"だ。"],
[["善","よ"],"きサマリア人のたとえ。隣人愛。"],
]],
// index: 79
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[80]},[
["ジェリコにくだる途中、人類でないものが強盗に襲われたら、少尉の銃は救ってくれるの。"],
]],
// index: 80
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[81]},[
["銃は人を救わない。"],
["人は人を救わない。"],
["人は愛し、ただ、赦すのみ。"],
]],
// index: 81
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[82]},[
["応えになってなくね。"],
["原罪を、あらかじめ喪ったアタシたちに救いはあるの。"],
]],
// index: 82
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[83]},[
["傷つけられ、虐げられた",["幼子","おさなご"],"よ。"],
["天国の門は開かれている。"],
["ホモ・サピエンス・サピエンスと種や属が異なろうと、キリスト者でなかろうと。だが、しかし、——"],
]],
// index: 83
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[84]},[
["アウシュビッツ。ヒロシマ。ナガサキ。"],
["名づけられた悲劇たち。"],
["名づけられなかった","数多","の悲劇たち。"],
["二十世紀","、人類の魂は傷つき、人間性は損なわれた。"],
]],
// index: 84
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[85]},[
[["破局","カタストロフ"],"が、とどめをさしたともいえる。"],
["生きのこるために、人類は人類を選別した。"],
["生きのこるために、みずから人間性を手放したのだ。"],
["信仰なかりせば、いまや人類は",["屍者","ゾンビ"],"と区別できない。"],
]],
// index: 85
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[86]},[
["それって、ありなの。アンタんとこの教義的に。"],
["人類、あらかじめ滅んでんじゃん。"],
]],
// index: 86
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[87]},[
["しかし、いつだってまだ",["機会","チャンス"],"はある。"],
["まあ、まかせておけ。"],
["駱駝を狭い門にねじこむのは得意なんだ。"],
]],
// index: 87
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[88]},[
["魔女の口車にだって乗ってやろうじゃないか。"],
["核攻撃を阻止するためならば、是非もない。"],
["ワタシたちは、そういう",["幇","アラムナイ"],"だからな。"],
]],
// index: 88
[{speaker:"danu",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[89]},[
["新式の","歩兵銃","を三百、弾も用意してるけど。"],
]],
// index: 89
[{speaker:"priest",music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[90]},[
["弾薬だけでいい。"],
["知らんのか。"],
["極東",["十字軍","クルセイダーズ"],"は聖別されたカラシニコフで",["屍者","ゾンビ"],"を打倒する。"],
["土産を持たせる。すこし待て。"],
]],
// index: 90
[{speaker:"narrator",jump:67,enter:async($,ctx)=>{$.priest = true;},music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[67,163]},[
["神父が歩み去る。"],
["無名戦士の墓碑に向きなおり、ダヌーは陸式の礼を捧げた。"],
["掃除用具を拾い、キミは墓を磨いた。"],
["年代物の葡萄酒を受けとり、帰路についた。"],
]],
// index: 91
[{speaker:"danu",jump:67,music:"diana19",place:"本牧大聖堂",background:"モノクローム",adjacencies:[67,163]},[
[["大聖堂","カテドラル"],"は行ったじゃん。"],
]],
// index: 92
[{speaker:"danu",when:async($,ctx)=>{
if($.engineer)return 122;
},music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[93]},[
["人間だけが、",["屍者","ゾンビ"],"になると思われてきた。"],
["咬みつかれても引っかかれても、犬や猫は",["屍者","ゾンビ"],"にならない。"],
["毒でやられるだけ。"],
["すばしっこいから、ノロマの攻撃なんかよけるけど。"],
]],
// index: 93
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[94]},[
["仮称リヴァイアサンの出現で、科学者たちは、あわてて資料を引っくりかえした。"],
["大型類人猿が",["屍者","ゾンビ"],"になったという記録はあった。"],
]],
// index: 94
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[95]},[
["具体的には、ボノボだったらしいんだけど。"],
[["屍者","ゾンビ"],"化したオスを、メスの集団が崖から突きおとした。"],
["霊長研の院生からの、それは最後の通信だった。"],
]],
// index: 95
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[96]},[
["十年間、科学者たちは探しもとめたけど、",["屍者","ゾンビ"],"菌も",["屍者","ゾンビ"],"ウイルスも見つけられなかった。"],
["だから、特効薬も",["予防薬","ワクチン"],"も作れなかった。"],
]],
// index: 96
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[97]},[
[["斬首","くびちょんぱ"],"した",["屍者","ゾンビ"],"を",["核磁気共鳴画像診断","MRI"],"につっこんで調べた。"],
["観測できる範囲で、脳が活動していないことはわかってる。"],
["それなのに、うなり声をあげるんだ。"],
["首からしたがついてたら、動きまわるんだよ。"],
]],
// index: 97
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[98]},[
["そんで、科学者たちが立てた仮説。"],
["脳の言語野に寄生する、細菌でもウイルスでもないなにか。"],
["たとえば、",["模倣子","ミーム"],"みたいな。"],
]],
// index: 98
[{speaker:"danu",music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[99]},[
["この郵便の宛先は、そういうのにくわしいんだって。"],
]],
// index: 99
[{speaker:"narrator",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[100]},[
["武装臨海鉄道、本牧線、横濱本牧駅。"],
["資源循環局、総力戦政策調整部、",["武器製造推進課","ウェポン・メーカーズ"],"。"],
[["破局","カタストロフ"],"初期、自動車を解体して円匙と斧槍を製造した工場。"],
["つまり、官営のリサイクル工場。"],
]],
// index: 100
[{speaker:"narrator",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[101]},[
["キミは手紙をさしだし、課長の名刺を受けとった。"],
[["即席珈非","インスタントコーヒ"],"が湯気をたてている。"],
]],
// index: 101
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[102]},[
["課長といっても、名ばかりの管理職でね。"],
["もとは扶桑ファナティックでメカトロをやっていたんだが、なんの因果か、公僕になっちまった。"],
["とは言い条、友の娘の依頼だ。応じよう。"],
]],
// index: 102
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[103]},[
["装甲ピックアップ二台。自走式電源車。"],
["どんとこい。"],
["弾薬は要らないんだね。"],
]],
// index: 103
[{speaker:"danu",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[104]},[
["大隊","十基数","、用意してる。"],
]],
// index: 104
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[105]},[
["いやはや、",["戦争の夏","サマー・オブ・ウォー"],"だな。"],
]],
// index: 105
[{speaker:"danu",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[106]},[
["決戦の夏、日本の夏っていうじゃん。"],
]],
// index: 106
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[107]},[
["いわないんじゃないかな。"],
]],
// index: 107
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[108]},[
["昭和六十年代初頭、情報社会の高度化にともない、国際的プロジェクトが起ちあげられた。"],
["情報方舟計画。離散化された情報を、",["収束光","レーザ"],"で石英",["硝子","ガラス"],"に彫刻して、スヴァールバル諸島の永久凍土に保存する。"],
]],
// index: 108
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[109]},[
["まあ、",["破局","カタストロフ"],"のどさくさで立ちぎえになったんだが。"],
["根岸の一般設計学研究所が、日本の拠点になった。"],
["数値風洞で演算した結果を、初芝の生産技術研究所で",["硝子","ガラス"],"に灼きつける。"],
]],
// index: 109
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[110]},[
["一般設計学研究所に、スティーブンという研究者がいた。"],
["マックス・プランクから引っぱってきたんだったかな。"],
]],
// index: 110
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[111]},[
["スティーブンの研究は、情報理工学的には、異端だった。"],
["かつて計算され、これから計算されるだろう、すべての","数","。"],
["ここまでなら、まあ、ゲーデル数だな。"],
["あるいは、バベルの図書館。",["世界夫人の記憶","アカシック・レコード"],"。"],
]],
// index: 111
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[112]},[
["計算という行為、演算それ自体が、世界を書きかえる。"],
["当為と存在の反転。そう論文に書かれていた。"],
["意味はまったくわからん。"],
]],
// index: 112
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[113]},[
["スティーブンがやったことは、実際には、ある種の情報テロルだ。"],
["真偽さだかならぬ機密情報を、方舟に載せようとした。"],
]],
// index: 113
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[114]},[
[["大統領","ケネディ"],"暗殺計画。"],
[["超人計画","MKウルトラマン"],"。"],
[["無名祭祀書","ネームレス・カルツ"],"。"],
["そのほか、有象無象。"],
]],
// index: 114
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[115]},[
["結局、スパコンも石英",["硝子","ガラス"],"も打ち捨てられた。"],
["そんな道楽に費やす資源の余裕を、人類は喪ったからね。"],
["だから、それらはそこにありつづけている。"],
]],
// index: 115
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[116]},[
["それが、スティーブンの噂の本当のところなのさ。"],
["救いはない。"],
["だが、しかし——"],
]],
// index: 116
[{speaker:"danu",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[117]},[
["スティーブンって、実在した人物なの。"],
]],
// index: 117
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[118]},[
["さあな。"],
["ブルバキみたいなもんかもしれない。"],
]],
// index: 118
[{speaker:"danu",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[119]},[
["演算それ自体が、世界を書きかえるって、どうやって。"],
]],
// index: 119
[{speaker:"engineer",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[120]},[
["わからんね。"],
["字句","通り","に解釈するなら、ある種の計算のひとつひとつが、定数の異なる宇宙を生成する。"],
["なんのこっちゃ。"],
]],
// index: 120
[{speaker:"danu",music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[121]},[
["そのとき、世界は遡及的に変容するのかな。"],
]],
// index: 121
[{speaker:"narrator",jump:67,enter:async($,ctx)=>{$.engineer = true;},music:"diana19",place:"資源循環局",background:"モノクローム",adjacencies:[67,163]},[
["応えはなかった。"],
["応えは求められていなかった。"],
[["珈非","コーヒ"],"を飲みほして、キミは席を立った。"],
]],
// index: 122
[{speaker:"danu",jump:67,music:"diana19",place:"横濱本牧駅",background:"モノクローム",adjacencies:[67,163]},[
["資源循環局は、もう行ったよね。"],
]],
// index: 123
[{speaker:"narrator",when:async($,ctx)=>{
if($.activist)return 162;
},music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[124,125]},[
["本牧異人町。"],
["蒲鉾兵舎にかかげられたネオンに、灯はともっていない。"],
["リックス・カフェ・アメリカン。"],
]],
// index: 124
[{speaker:"narrator",jump:126,when:async($,ctx)=>{
if(ctx.system.unionSetting === "ろうくみ")return 125;
},music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[126]},[
["入口のかたわらにベニヤ看板。"],
["角ばった字で、魚人港湾労組。"],
["ポリ塩化ビニル暖簾を、キミはくぐった。"],
]],
// index: 125
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[126]},[
["入口のかたわらにベニヤ看板。"],
["角ばった字で、魚人港湾","労組","。"],
["ポリ塩化ビニル暖簾を、キミはくぐった。"],
]],
// index: 126
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[127]},[
["おまえさん、",["探偵","ピンカートン"],"の弟子か。"],
["ピケやぶりなら帰ってくれ。"],
]],
// index: 127
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[128]},[
["どっちかっていうと、ボス交。"],
]],
// index: 128
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[129]},[
["なんか註文しろや。"],
["こっちゃ、","パートタイムで闘争してんだ。"],
]],
// index: 129
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[130]},[
["あれを弾いて、サム。"],
["アズ・タイム・ゴーズ・バイ。"],
]],
// index: 130
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[131]},[
["そういう意味じゃねえ。"],
["だいたい、ピアノがねえよ。"],
["コーラでいいな。"],
]],
// index: 131
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[132]},[
["風呂敷包みを",["卓子","テーブル"],"に置き、キミはぬるいコーラをあおった。"],
["店主に手紙をすべらせる。"],
]],
// index: 132
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[133]},[
["その銃な、海兵隊からカードでまきあげたんだとさ。"],
["あ",["奴","いつ"],"は、そう吹いてた。"],
["刻印されてるだろ。"],
["他者のための",["人","メン"],"であれ。"],
]],
// index: 133
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[134]},[
["変わることができない、あいかわらず",["男根主義","マチズモ"],"の",["幇","パルタイ"],"だ。"],
]],
// index: 134
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[135]},[
["万国の労働者、",["団結せよ","ユナイト"],"。"],
["魚人とともに。"],
]],
// index: 135
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[136]},[
[["しらける","ホワイトキック"],"。"],
["いつも、こんなに客いないの。"],
]],
// index: 136
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[137]},[
["営業時間外だからな。"],
["正味のところ、ダゴン秘密教団の集会のせいさ。"],
["神、海に知ろしめす、ってな。"],
["本題に","はいれ","よ、魔人小隊。"],
]],
// index: 137
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[138]},[
["今日ご紹介するのは、こちらのマイクロフィルムなんです。あのミスカトニック大学で、アル・アジフを高解像度スキャン。不完全な写本をつかったせいで、浮上したルルイエがすぐ沈んじゃって困っているアナタ。"],
]],
// index: 138
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[139]},[
["このマイクロフィルムなら、そんなことはございません。今なら、初心者でも簡単、あなたにも星辰の正しい位置がわかる、ルルイエ",["異本","テクスト"],"がついてきます。さらに読取機もつけて、お値段はおどろきの——"],
]],
// index: 139
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[140]},[
["キミは風呂敷の結びをほどいた。"],
]],
// index: 140
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[141]},[
["アタシたちの分析では、ダゴン秘密教団を放置すると、",["深き者","ディープ・ワンズ"],"は人類に敵対することになる。"],
["合衆国からかっぱらった原潜、まだ動くんでしょ。"],
]],
// index: 141
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[142]},[
["ノーコメント。"],
["ナンセーンス。"],
]],
// index: 142
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[143]},[
["このまま、過激派が多数をおさえちゃったら、魚人社会は仮称リヴァイアサンを神と崇める狂信者集団になる。"],
["仮称リヴァイアサンを撃滅しても、北海道に",["潜水艦発射弾道弾","SLBM"],"が撃ちこまれる。"],
]],
// index: 143
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[144]},[
["したっけ、人類は、",["太平洋到達不能極","ポイント・ネモ"],"を",["大陸間弾道弾","ICBM"],"で叩くことを躊躇しない。"],
["世界は核の炎に包まれる。"],
["アンタたち、それって受けいれられるの。"],
]],
// index: 144
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[145]},[
["受けいれないさ。"],
["しかし、それと、そのマイクロフィルムがどう関係する。"],
]],
// index: 145
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[146]},[
["ダゴン秘密教団の教義は、新興カルト一般のそれ。"],
["いろんな神話や伝説をパッチワークしたでっちあげ。"],
]],
// index: 146
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[147]},[
["そういうのって、脆弱性を持つんだよね。"],
["いかんともしがたく。"],
["器質的なもんだったらおもしろいよね。"],
["人類や人類っぽいものに共通する。"],
]],
// index: 147
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[148]},[
["特殊検索群プレゼンツ。"],
["絶対安全ネクロノミコン。"],
[["深き者","ディープ・ワンズ"],"の信仰を操作するべく開発された、できたてほやほや物語論兵器。"],
]],
// index: 148
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[149]},[
["店主は",["叶和圓","イェヘユアン"],"に火を点けた。"],
]],
// index: 149
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[150]},[
["大衆のメタンアンフェタミンってか。"],
["アヘンじゃなくて。"],
["喫うか。菊の紋がはいったやつもあるぜ。"],
]],
// index: 150
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[151]},[
["土産にちょうだい。"],
["うちには喫うやつもいるから。"],
]],
// index: 151
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[152]},[
["仮称リヴァイアサンを拝むのは、自由かもしんないけど。"],
["どうせ、小魚みたいに、頭からぽりぽり食べられちゃうよ。"],
["信教の自由は、そこまでは含まないっしょ。"],
]],
// index: 152
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[153]},[
["それが総意で、それが本望だったとしても、死んじゃったら、アタシたちは哀しいよ。"],
["やっぱり、生きていてほしいと思うんだよ。"],
["そのための、いってみりゃ、脱洗脳みたいなもん。"],
]],
// index: 153
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[154]},[
["まあ、いい。"],
["表向きの理由は了解した。"],
]],
// index: 154
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[155]},[
["ぜんぶはなしたし。"],
["裏の理由なんてないよ。"],
["少尉の拳銃にかけて。"],
]],
// index: 155
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[156]},[
["いうまでもない。"],
["裏はある。"],
["特殊検索群が本当におそれたのは、全面核戦争ではない。"],
]],
// index: 156
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[157]},[
["仮称リヴァイアサンから、仮称がとれてしまうこと。"],
["遡及的に、",["深き者","ディープ・ワンズ"],"の神になりはててしまうこと。"],
["それを危惧して先制攻撃をしかけている。"],
]],
// index: 157
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[158]},[
["そんで、どうなの。"],
["できるよね。"],
[["深き者","ディープ・ワンズ"],"穏健派の首魁。"],
["最初の魚人のひとり。"],
]],
// index: 158
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[159]},[
["できるさ。"],
["やらいでか。"],
]],
// index: 159
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[160]},[
["ありがと。"],
["ところで、",["煙草","ヤニ"],["喫","く"],"う魚人ってはじめて見たよ。"],
["肺、どうなってんの。"],
]],
// index: 160
[{speaker:"activist",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[161]},[
[["学生","ガキ"],"のころからの習い性だからさ。"],
["あ",["奴","いつ"],"とつるんでさ。"],
]],
// index: 161
[{speaker:"narrator",jump:67,enter:async($,ctx)=>{$.activist = true;},music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[67,163]},[
["フィルタつき",["叶和圓","イェヘユアン"],"のカートンをキミは受けとる。"],
["ダヌーは古い歌をハミングした。"],
["ただよう臭いが煙草のせいなのかどうか、キミにはわからなかった。"],
]],
// index: 162
[{speaker:"danu",jump:67,music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[67,163]},[
["手紙は届けられてしまったよ、すでに。"],
]],
// index: 163
[{speaker:"danu",music:"diana19",place:"三溪園",background:"モノクローム",adjacencies:[164]},[
["少尉、今日の配給。"],
["本物の肉を使った肉まんだって。"],
]],
// index: 164
[{speaker:"narrator",music:"diana19",place:"三溪園",background:"モノクローム",adjacencies:[165]},[
["三溪園。",["伝説","ブーゲンビリア"],"の樹のしたで、キミは配給を受けとる。"],
]],
// index: 165
[{speaker:"danu",music:"diana19",place:"三溪園",background:"モノクローム",adjacencies:[166]},[
[["肉まん","パン"],"と",["叶和圓","タバコ"],"と",["葡萄酒","アルコール"],"。"],
["PTAで最後の晩餐だね。"],
]],
// index: 166
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[167]},[
["特殊検索群α分遣隊の総員が指揮所に集合した。"],
]],
// index: 167
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[168]},[
["傾聴。"],
]],
// index: 168
[{speaker:"alice",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[169]},[
["菊刀一号作戦は発展的に解消した。"],
["ぶっちゃけ、日米",["連合艦隊","グランドフリート"],"は、マリアナ海溝邀撃漸減作戦に失敗した。"],
["β分遣隊は、第七艦隊旗艦とともに沈んだ。"],
]],
// index: 169
[{speaker:"alice",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[170]},[
["菊刀二号作戦が発令された。"],
["我々の任務は、仮称リヴァイアサンの誘引。"],
["ボクもやきがまわったな。"],
["文字どおり、特別攻撃作戦だ。"],
]],
// index: 170
[{speaker:"danu",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[171]},[
["ワンチャン、いけるって。"],
]],
// index: 171
[{speaker:"alice",choices:[
{choice:["熱望"],barcode:"Elvis",label:172},
{choice:["希望"],barcode:"Elpis",label:173},
{choice:["拒否"],label:175},
],music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[172,173,175]},[
["強制はしない、少尉。"],
["熱望か希望か拒否か、ひとつを択べ。"],
]],
// index: 172
[{speaker:"danu",jump:186,music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[186]},[
["安心して。"],
["アンタのことは、ダヌーがちゃんと終わらせてあげるから。"],
]],
// index: 173
[{speaker:"alice",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[174]},[
["この世界に、希望はないんだ、少尉。"],
[["希望","エルピス"],"も",["ロック","エルビス"],"も喪われた。"],
]],
// index: 174
[{speaker:"danu",choices:[
{choice:["最熱望"],action:async($,ctx)=>{ctx.trophy("elvis");},barcode:"Elvis",label:172},
{choice:["熱望"],barcode:"Elvis",label:172},
{choice:["拒否"],label:175},
],music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[172,175]},[
[["妖精","エルブズ"],"はいるけど。"],
]],
// index: 175
[{speaker:"danu",music:"diana12",place:"本牧異人町",background:"モノクローム",adjacencies:[176]},[
["少尉。"],
["アンタ。"],
]],
// index: 176
[{speaker:"alice",music:"diana12",place:"本牧異人町",background:"モノクローム",adjacencies:[177]},[
["ダヌー軍曹、いいんだ。"],
["我々は軍隊ではない。"],
["あるいは、民主主義国家の最後の民主主義的な軍隊だ。"],
]],
// index: 177
[{speaker:"alice",music:"diana12",place:"本牧異人町",background:"モノクローム",adjacencies:[178]},[
["少尉、血のように赤い葡萄酒だった。"],
["うまい",["包子","パオ"],"だった。"],
["良い晩餐だった。"],
[["煙草","ヤニ"],"はまずかったがな。"],
]],
// index: 178
[{speaker:"narrator",music:"diana12",place:"北海道",background:"モノクローム",adjacencies:[179]},[
["除隊したキミは、引揚船で北海道に渡る。"],
]],
// index: 179
[{speaker:"narrator",music:"diana12",place:"北海道",background:"モノクローム",adjacencies:[180]},[
["仮称リヴァイアサンが襲来した。"],
["日米",["連合艦隊","グランドフリート"],"は、最後の",["戦艦","バトルシップ"],"とひきかえに、仮称リヴァイアサンを東京湾最終防衛線に拘束した。"],
["統合航空軍は、空中巡洋艦から核爆雷を投下した。"],
]],
// index: 180
[{speaker:"narrator",music:"diana12",place:"北海道",background:"モノクローム",adjacencies:[181]},[
[["深き者","ディープ・ワンズ"],"過激派の報復攻撃により、札幌、旭川、函館が蒸発した。"],
["石柱都市が浮上した。"],
["人類は残された",["大陸間弾道弾","ICBM"],"を全力で投射した。"],
]],
// index: 181
[{speaker:"narrator",music:"diana12",place:"北海道",background:"モノクローム",adjacencies:[182]},[
["妖精種はたもとを分かった。人類種とも。","魚人","種とも。"],
["二十六年が経った。"],
["世界人口は十億人を下回った。"],
["あらたな黙示録の獣どもが、地上を闊歩している。"],
]],
// index: 182
[{speaker:"narrator",music:"diana12",place:"南樺太",background:"モノクローム",adjacencies:[183]},[
["南樺太。"],
["炭鉱労働を終えたキミは帰路につく。"],
["昭和百年の祝賀の雰囲気は雲散霧消していた。"],
]],
// index: 183
[{speaker:"narrator",music:"diana12",place:"南樺太",background:"モノクローム",adjacencies:[184]},[
["灯のない昏い道に、白い影が立つ。"],
["つきしたがう十二の影は、闇にとけて見えなかった。"],
]],
// index: 184
[{speaker:"alice",music:"diana12",place:"南樺太",background:"モノクローム",adjacencies:[185]},[
["返してもらいにきた。その銃を。"],
["終わらせにきた。人類を。世界を。"],
["——昭和を。"],
]],
// index: 185
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedRevelation2 = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };},finish:"credits",music:"diana12",place:"南樺太",background:"モノクローム",adjacencies:[]},[
["昭和横濱物語。アリスの",["黙示録","リベレーション"],"。"],
["了。"],
]],
// index: 186
[{speaker:"narrator",music:"diana19",place:"本牧異人町",background:"モノクローム",adjacencies:[187]},[
["エデンの園",["配置","コンフィギュレーション"],"は喪われた。"],
["グライダー",["銃","ガン"],"に撃たれ、",["長命者","メトセラ"],"は九百六十九歳で死んだ。"],
["昭和横濱物語。スティーブンによる福音書。第二節。"],
["了。（つづく）"],
]],
// index: 187
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedVerse3 = true;},start:"verse3",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[188]},[
["昭和七十四年七月、ボクはキミに出逢った。"],
["人類が滅亡するまでの、最期のひとつきの、これは物語だ。"],
]],
// index: 188
[{speaker:"narrator",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[189]},[
[["情報分隊","メイジャイ"],"。情報処理に特化した",["妖精種","エルブズ"],"の三人","組","。"],
["腕に装着した","オノ＝センダイ","のデッキをにらみ、分隊長が報告する。"],
]],
// index: 189
[{speaker:"demeter",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[190]},[
["発、ブルーリッジ分乗特殊検索群β分遣隊。"],
["宛","、特殊検索群司令部。"],
["秘匿兵器",["断章","フラグメント"],"使用許可を","求","む。"],
["このままでは、エンタープライズが沈む。"],
]],
// index: 190
[{speaker:"demeter",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[191]},[
["発、特殊検索群司令部。"],
["宛","、特殊検索群β分遣隊。"],
["秘匿兵器使用を許可する。"],
["可能な限り、",["断章","フラグメント"],"を回収し、生還せよ。"],
]],
// index: 191
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[192]},[
["避難民を満載した原子力空母を護って、第七艦隊旗艦は沈んだ。"],
[["断章","フラグメント"],"はマリアナ海溝の藻屑と消えた。"],
["β分遣隊は護国の鬼となった。"],
]],
// index: 192
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[193]},[
["十万余の",["屍者","ゾンビ"],"、国難ここに見る。"],
["昭和七十四年の夏の頃。"],
["十万だったら楽だったのに。"],
]],
// index: 193
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[194]},[
["よほど無理をしてもらうぞ。"],
["我々には、伏せ札がいちまいきりだ。"],
]],
// index: 194
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[195]},[
["大佐の方針を達する。"],
["傾聴。"],
]],
// index: 195
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[196]},[
["そもそもにたちかえろう。"],
["仮称リヴァイアサンはどうして、",["布哇","ハワイ"],"に現れた。"],
["なぜだ。"],
["なにものかが、読んだからだ。"],
]],
// index: 196
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[197]},[
["スティーブンによる福音書を読んだからだ。"],
["読むという行為。"],
["読まれてしまった",["福音書","ゴスペル"],"。"],
["仮称リヴァイアサンは、それに反応した。"],
]],
// index: 197
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[198]},[
["読むという行為。"],
["計算という行為。"],
["演算それ自体。"],
]],
// index: 198
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[199]},[
[["屍者","ゾンビ"],"とはなんだ。"],
["魔人とはなんだ。"],
[["破局","カタストロフ"],"とは、なんだ。"],
]],
// index: 199
[{speaker:"demeter",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[200]},[
["昭和六十四年一月七日午前六時三十三分。"],
[["破局","カタストロフ"],"発生。"],
]],
// index: 200
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[201]},[
["辺縁からもたらされた人獣共通感染症。"],
[["屍者","ゾンビ"],"禍","を、人類はそのように認識した。"],
["手をこまねいているうちに、感染が拡大した。"],
]],
// index: 201
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[202]},[
["外縁で。あらかじめ。"],
["辺境で。遡及的に。"],
["未開で。生まれてきた。"],
["魔人が。人に似て、人でないものたちが。"],
]],
// index: 202
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[203]},[
["人類と人類っぽいものの固有の尊厳と平等で譲られぬ権利を護る。"],
["それが、我々の",["信条","プリンシプル"],"だ。"],
]],
// index: 203
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[204]},[
["世界に自由と正義と平和を築く。"],
["気づいてるよね、少尉。"],
["仮称リヴァイアサンを撃滅することも、人類を救済することも、それそのものは、アタシたちの目的じゃない。"],
]],
// index: 204
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[205]},[
["一通","の手紙。"],
["かつてボクの父だった人間から、郵便が届いた。"],
]],
// index: 205
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[206]},[
["大佐に手紙が届いちゃったんだ。"],
]],
// index: 206
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[207]},[
["——ガヴァメントを託した。",["予言機械","オラクルマシン"],"を接続しろ。"],
]],
// index: 207
[{speaker:"demeter",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[208]},[
["京浜工業地帯。"],
["根岸湾埋立地。"],
["工業技術院一般設計学研究所情報基盤センター南棟","。"],
["通称、","計算機棟","。"],
]],
// index: 208
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[209]},[
["情報方舟計画。",["記録保管所","アーカイブズ"],"。"],
["電話回線経由、",["ユニックス間転送プロトコル","UUCP"],"接続。"],
["記録は部分的に合衆国の教育機関にバックアップされた。"],
["きっと、",["布哇","ハワイ"],"大学にも。"],
]],
// index: 209
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[210]},[
["スティーブンによる福音書。"],
["封印された偽典の正本。"],
["我々が読む。"],
]],
// index: 210
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[211]},[
["決号作戦、第二段階。"],
["菊刀二号作戦。"],
["仮称リヴァイアサンを誘引する。"],
]],
// index: 211
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[212]},[
[["十字軍","クルセイダーズ"],"を加入し、大隊を編成する。"],
["統合航空軍に空中巡洋艦の渡りはつけた。"],
]],
// index: 212
[{speaker:"narrator",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[213]},[
["空中巡洋艦飛鳥","。"],
["水素を利用した硬式飛行船。"],
["ヘリウムを利用できないほど、人類は追いつめられている。"],
]],
// index: 213
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[214]},[
["最悪、","計算機棟","とやらに雪隠詰めで玉砕だ。"],
["千万の",["屍者","ゾンビ"],"に重囲されてはどうにもならない。"],
["ボクもやきがまわったな。"],
["文字どおり、特別攻撃作戦だ。"],
]],
// index: 214
[{speaker:"danu",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[215]},[
["ワンチャン、いけるって。"],
]],
// index: 215
[{speaker:"narrator",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[216]},[
["最後の晩餐は、そうして終わった。"],
]],
// index: 216
[{speaker:"narrator",music:"diana23",place:"本牧大聖堂",background:"モノクローム",adjacencies:[217]},[
["ある夜。"],
["無名戦士の墓。"],
[["訓練士","ハンドラー"],"のユキヲが立つ。"],
["彼の犬とともに。"],
]],
// index: 217
[{speaker:"yukio",music:"diana23",place:"本牧大聖堂",background:"モノクローム",adjacencies:[218]},[
["呼びだしてわるかったな。"],
[["長距離哨戒","LRP"],"帰りなんだ。"],
["オレの",["犬","ケーナイン"],"を護って死んだオッサンから、届けものがある。"],
]],
// index: 218
[{speaker:"narrator",music:"diana23",place:"本牧大聖堂",background:"モノクローム",adjacencies:[219]},[
["ガヴァメントの弾倉。"],
["七発の",["銀の弾丸","シルバー・ヴァレット"],"。"],
]],
// index: 219
[{speaker:"yukio",music:"diana23",place:"本牧大聖堂",background:"モノクローム",adjacencies:[220]},[
["探偵を標榜したオッサンからの言伝だ。"],
["択べ。だとさ。"],
["オレは往くぜ。"],
["明日","の輸送船でな。"],
]],
// index: 220
[{speaker:"narrator",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[221]},[
[["屍者","ゾンビ"],"を嗅ぐ犬は、おなじ重さの","金","よりも価値がある。"],
["いまや、","金","に価値などないけれど。"],
["ユキヲは犬とともに北海道に渡る。"],
["決戦がせまっていた。"],
]],
// index: 221
[{speaker:"narrator",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[222]},[
["ある朝。"],
["三百の兵が水をくちに含む。"],
["主","に選ばれた弊衣の",["古強者","ヴェテラン"],"ども。"],
["メサイア会、極東",["十字軍","クルセイダーズ"],"。"],
]],
// index: 222
[{speaker:"alice",music:"diana23",place:"本牧異人町",background:"モノクローム",adjacencies:[223]},[
["無停止進撃だ。"],
["目的を達するまで、我々は止まらない。"],
["我々は軍隊ではないから。"],
["我々が最後の軍隊だから。"],
]],
// index: 223
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[224]},[
["大隊は進発した。"],
["二列縦隊で進む。"],
["中段に武装ピックアップと自走式電源車を置く。"],
["弾薬を満載したトレーラーを牽引する。"],
]],
// index: 224
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[225]},[
[["破局","カタストロフ"],"以降、人類が到達した対",["屍者","ゾンビ"],"戦術。"],
[["屍者","ゾンビ"],"の武器はかみつきと爪。"],
[["屍者","ゾンビ"],"は、うなり声をあげて歩みよる。"],
[["屍者","ゾンビ"],"は、塹壕にこもらない。"],
]],
// index: 225
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[226]},[
["屋外では、横陣または方陣を組む。"],
["阻止線を越えた",["屍者","ゾンビ"],"の眉間を狙撃する。"],
["焼夷弾で脳を灼く。"],
["それが、もっとも経済的で効率的な手段だから。"],
]],
// index: 226
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[227]},[
["戦術を内面化した者たちだけが生きのこった。"],
["弾薬が続くかぎり、",["屍者","ゾンビ"],"を打倒する。"],
["積みあがった屍体それ自体で阻塞する。"],
]],
// index: 227
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[228]},[
["屋内では、長柄の武器で近接戦闘を実施する。"],
[["第一回収大隊","スカベンジャーズ"],"は、円匙や斧槍を得意とする。"],
[["十字軍","クルセイダーズ"],"は、銃剣を使う。"],
["アリスの得物は",["大剣","クレイモア"],"だ。"],
]],
// index: 228
[{speaker:"demeter",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[229]},[
["進路上に",["屍者","ゾンビ"],"、中隊規模。一個小隊欠かな。"],
]],
// index: 229
[{speaker:"priest",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[230]},[
["隊形を変換するか。"],
]],
// index: 230
[{speaker:"alice",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[231]},[
["無停止進撃と命じたぞ、神父。"],
["ボクが排除する。"],
]],
// index: 231
[{speaker:"danu",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[232]},[
["大隊総員に達する。"],
["莫迦が単騎で突撃する。"],
["なんか、いいかんじにおなしゃす。"],
]],
// index: 232
[{speaker:"demeter",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[233]},[
["射界がとれる人は一発だけ撃って","くださーい","。"],
["莫迦にあてないようにまあまあ注意して。"],
]],
// index: 233
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[234]},[
["白い肌、深紅の瞳、背より巨きな",["大剣","クレイモア"],"。"],
["少女は荷台から飛びおりる。"],
["疾る。"],
["カラシニコフの発砲音が追いぬく。"],
]],
// index: 234
[{speaker:"alice",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[235]},[
[["死んでくれる？","Die For Me!"]],
]],
// index: 235
[{speaker:"narrator",music:"diana23",place:"屍都高速湾岸線下",background:"モノクローム",adjacencies:[236]},[
["くるくるまわり、アリスは首を刈る。"],
["α分遣隊の",["妖精種","エルブズ"],"が",["長弓","ロングボウ"],"で曲射する。"],
["すべての",["屍者","ゾンビ"],"が倒れ伏す。"],
]],
// index: 236
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[237]},[
["大隊は進軍した。"],
["運河を渡った。"],
["一般設計学研究所に到着した。"],
["計算機棟内を掃討する。"],
]],
// index: 237
[{speaker:"priest",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[238]},[
["西側に",["殺し間","キルゾーン"],"を形成する。"],
["海側はどうにもならん。"],
]],
// index: 238
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[239]},[
["時間差がある。"],
["各個撃破する。"],
]],
// index: 239
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[240]},[
["H","+","四まで主攻正面は陸側。"],
[["屍者","ゾンビ"],"数百万が誘引されると予測。"],
["H","+","六、仮称リヴァイアサン東京湾に侵入。"],
["H","+","八、巨大群体上陸。"],
]],
// index: 240
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[241]},[
["最初の四時間で射耗していい。"],
]],
// index: 241
[{speaker:"priest",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[242]},[
["メサイア会、舐めてんじゃねえぞ。小娘。"],
]],
// index: 242
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[243]},[
["屍体の山が二階の高さに達すれば、",["屍者","ゾンビ"],"は乗りこえられなくなる。"],
["かつて人間だった","身体","を積んで壁となす。"],
["その狂気に疑問を持つ者はここにない。"],
]],
// index: 243
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[244]},[
["ぎりぎりまで電源車のまわりで持久。"],
["そのあとは籠城だな。"],
["弾","が続くかぎり、屋上から狙撃して遅滞する。"],
]],
// index: 244
[{speaker:"engineer",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[245]},[
["ケーブルは二階まで引けばいいんだね。"],
["ラックひとつ動かすだけなら、八時間は持つ。"],
]],
// index: 245
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[246]},[
["α分遣隊、捜索にかかれ。"],
]],
// index: 246
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[247]},[
["石英",["硝子","ガラス"],"は粉々。"],
["磁気テープを発見。"],
[["自動図書館","ライブラリ"],"は故障。"],
]],
// index: 247
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[248]},[
["読めるの。"],
]],
// index: 248
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[249]},[
["可能。"],
]],
// index: 249
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[250]},[
[["制御卓","コンソール"],"はどう。"],
]],
// index: 250
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[251]},[
["起動を確認。"],
[["演算結節","コンピュート・ノード"],"を順次起動。"],
["生体認証装置、正常。"],
]],
// index: 251
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[252]},[
["はじめるか。"],
["統合航空軍に打電。"],
]],
// index: 252
[{speaker:"priest",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[253]},[
["ワタシは屋上で指揮をとる。"],
["そのまえに。"],
["あ",["奴","いつ"],"に銃を託されたキミ。"],
["キミはなんだ。人間か。魔人か。"],
]],
// index: 253
[{speaker:"priest",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[254]},[
["応えは要らない。"],
["人間性。"],
["それが鍵だ。"],
]],
// index: 254
[{speaker:"engineer",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[255]},[
["ジブン","も電源車にいくよ。"],
["いまさらだけど。"],
["道理にあわないと思わないかい。"],
]],
// index: 255
[{speaker:"engineer",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[256]},[
["情報方舟計画。"],
["たかが、情報を記録するだけじゃないか。"],
["どうして数値風洞を必要とした。"],
["流体力学のためのスパコンで、なにを演算した。"],
]],
// index: 256
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[257]},[
["ふたりは歩みさる。"],
]],
// index: 257
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[258]},[
["はじめよう。"],
]],
// index: 258
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[259]},[
[["予言機械","オラクルマシン"],"、",["起動","ブート"],"。"],
["仮説を",["待機","ポーリング"],"。"],
]],
// index: 259
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[260]},[
["テープ",["読出","ロード"],"開始。"],
]],
// index: 260
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[261]},[
["読むという行為。"],
["しかし、",["誰","たれ"],"が読む。"],
]],
// index: 261
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[262]},[
["テープ",["読出","ロード"],"完了。"],
["えっと、これはテクストじゃなくて。"],
["えっと、これは",["起動連環","ブートストラップ"],"。"],
]],
// index: 262
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[263]},[
["どういうこと。"],
]],
// index: 263
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[264]},[
[["起動連環","ブートストラップ"],"第一",["段階","ステージ"],"開始。"],
[["認証の催促","プロンプト"],"。"],
]],
// index: 264
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[265]},[
["少尉、待たせたな。"],
["キミの血をもらう。"],
]],
// index: 265
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[266]},[
["生体認証装置に、キミは血をたらす。"],
]],
// index: 266
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[267]},[
[["認可","AUTHZ"],"。"],
]],
// index: 267
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[268]},[
[["認証","AUTHN"],"じゃないってこと。"],
["いかようにも読まれてしまう",["非","アンチ"],"テクスト。"],
["そういうこと。"],
]],
// index: 268
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[269]},[
["不明。"],
["単に復号鍵として利用された可能性。"],
]],
// index: 269
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[270]},[
["遠く、キミは",["審判の喇叭","アポカリプティックサウンド"],"を聴く。"],
["カラシニコフのかわいた銃声が響く。"],
[["制御卓","コンソール"],"のブラウン","管","に文字が表示される。"],
[["スティーブンによる福音書","EVANGELIUM SECUNDUM STEPHANUS"],"。"],
]],
// index: 270
[{speaker:"steven",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[271]},[
["これは手紙。"],
["これは郵便。"],
["これは",["物語","ナラティブ"],"。"],
]],
// index: 271
[{speaker:"steven",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[272]},[
["私はオマエをみとめ、哀れに思って走りより、その首を","抱","いて接吻しよう。"],
["人類の魔人。"],
["旧人と新人の——"],
]],
// index: 272
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[273]},[
["禁則事項です♪"],
[["起動連環","ブートストラップ"],"第二",["段階","ステージ"],"開始。"],
]],
// index: 273
[{speaker:"steven",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[274]},[
["エデンの園",["配置","コンフィギュレーション"],"は喪われた。"],
["グライダー",["銃","ガン"],"で撃たれ、",["長命者","メトセラ"],"は九百六十九歳で死んだ。"],
]],
// index: 274
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[275]},[
[["予言機械","オラクルマシン"],"、仮説を",["受入","アクセプト"],"。"],
["だけど、これはなんの機械なのさ。そもそも。"],
]],
// index: 275
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[276]},[
["任意の",["問いかけ","クエリ"],"に、",["定数時間","リアルタイム"],"で一貫した回答を返す機械。"],
["昭和三十年代、中央計算技術研究所で開発。"],
]],
// index: 276
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[277]},[
["なるほど。わからん。"],
]],
// index: 277
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[278]},[
[["起動連環","ブートストラップ"],"第三",["段階","ステージ"],"開始。"],
]],
// index: 278
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[279]},[
[["予言機械","オラクルマシン"],"、仮説流入量が増大。"],
["第","一","次予言値の生成が",["取消","キャンセル"],"。"],
["データ同化開始。"],
]],
// index: 279
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[280]},[
[["起動連環","ブートストラップ"],"完了。"],
]],
// index: 280
[{speaker:"steven",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[281]},[
["これは",["模擬機械","シミュレータ"],"。"],
["これは",["模倣機械","エミュレータ"],"。"],
["これは",["状態機械","オートマトン"],"。"],
["それは",["仮想機械","ヴァーチャルマシン"],"。"],
]],
// index: 281
[{speaker:"steven",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[282]},[
["人間が読め。"],
["人間が択べ。"],
["配置を択べ。"],
["エデンの園。グライダー",["銃","ガン"],"。",["長命者","メトセラ"],"。"],
]],
// index: 282
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[283]},[
["そうか。そういうことか。"],
["たったひとりをのぞいて、すべての魔人は物語に典拠する。"],
["老化しない種属が、物語から引用された。"],
]],
// index: 283
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[284]},[
[["森妖精","エルフ"],"。"],
[["闇妖精","ダークエルフ"],"。"],
[["深き者","ディープ・ワン"],"。"],
["——",["屍者","ゾンビ"],"。"],
]],
// index: 284
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[285]},[
["なにものかが、",["長命者","メトセラ"],"配置を読んだ。"],
]],
// index: 285
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[286]},[
["世界が書きかわった。"],
["遡及的に。"],
["だけど、どうやって。"],
]],
// index: 286
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[287]},[
["仮説。",["多元宇宙","マルチヴァース"],"。"],
["たとえば、",["模擬","シミュレーション"],"宇宙。"],
["たとえば、この世界は上位世界の計算結果。"],
]],
// index: 287
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[288]},[
["よくあるはなしだよね。"],
]],
// index: 288
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[289]},[
["ほんらい、",["下位","ゲスト"],"世界から",["上位","ホスト"],"世界は不可視。"],
["スティーブンが発見を主張したのは、",["上位","ホスト"],"世界の",["計算機","コンピュータ"],"で直接実行される",["繊細","センシティブ"],"命令",["集合","セット"],"。"],
[["上位","ホスト"],"世界の脆弱性をつく演算。"],
]],
// index: 289
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[290]},[
["その",["類推","アナロジー"],"だと、完全な特権は取得していないのか。"],
]],
// index: 290
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[291]},[
["脳に寄生しないと、すぐに崩壊しちゃう",["凝り性","アーティースト"],"な数学的構造とか。"],
]],
// index: 291
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[292]},[
["飛鳥に積んだ物語論散布爆雷で、計算を広域展開可能か。"],
]],
// index: 292
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[293]},[
["おそらく、可能。"],
["贖宥状ファームウェアの削除、",["読取専用","ROM"],"構造物の",["瞬間","スナップショット"],"投入が必要。"],
["仮称リヴァイアサン襲来までにギリ完了。"],
]],
// index: 293
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[294]},[
["グライダー",["銃","ガン"],"が",["長命者","メトセラ"],"を撃つ。"],
["じゃあ、エデンの園は。"],
]],
// index: 294
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[295]},[
["ここではない、どこか。とか。"],
["辿りつけない空虚な中心。とか。"],
["いまではない、いつか。とか。"],
["幾度も騙りなおした",["偽史","フィクション"],"。とか。"],
]],
// index: 295
[{speaker:"steven",choices:[
{choice:["エデンの園"],action:async($,ctx)=>{$.genesis = false;;},barcode:"Garden of Eden",label:296},
{choice:["グライダー",["銃","ガン"]],action:async($,ctx)=>{$.genesis = true;;},barcode:"Glider Gun",label:297},
{choice:["択ばない"],label:298},
],music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[296,297,298]},[
["人間が読め。"],
["人間が択べ。"],
["配置を択べ。"],
]],
// index: 296
[{speaker:"demeter",jump:308,music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[308]},[
["エデンの","園","配置が活性化。"],
[["読取専用","ROM"],"構造物を展開。"],
]],
// index: 297
[{speaker:"demeter",jump:308,music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[308]},[
["グライダー",["銃","ガン"],"配置が活性化。"],
[["読取専用","ROM"],"構造物を展開。"],
]],
// index: 298
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[299]},[
["それが人類の選択だというのならば。"],
["その銃を、かまえろ。"],
]],
// index: 299
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[300]},[
[["新人","ホモ・サピエンス・サピエンス"],"に犯された",["旧人","ホモ・ネアンデルターレンシス"],"の胎から生まれた人類の魔人。"],
["ガヴァメントを、かまえろ。"],
]],
// index: 300
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[301]},[
["少女の","右掌","に",["解放者","リベレータ"],"。"],
["四十五口径。"],
]],
// index: 301
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[302]},[
["キミはガヴァメントを抜く。"],
["四十五口径、",["銀の弾丸","シルバー・ヴァレット"],"。"],
["かまえる。"],
["撃つ。"],
]],
// index: 302
[{speaker:"danu",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[303]},[
["少尉。"],
["アンタ。"],
["一体いつから——"],
["屍都の女王が",["吸血鬼","ヴァンパイア"],"だと錯覚していた？"],
]],
// index: 303
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[304]},[
["ボクはボクの父だった人間を、あざむいた。"],
["人類の魔人がいるなら。"],
[["屍者","ゾンビ"],"の魔人もいるだろう。"],
["ああ、この","瞳","はカラコンだ。"],
]],
// index: 304
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[305]},[
["キミの弾丸は、ボクの心臓をえぐった。"],
["ボクの弾丸が、キミの心臓をえぐった。"],
["キミは見るだろうか。"],
["キミは聞くだろうか。"],
]],
// index: 305
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[306]},[
[["予言機械","オラクルマシン"],"から、したたりおちる言葉。"],
["無限にたどりつけず、収束していく予言値。"],
["語られずに終わった、あの日の横濱の",["物語","ストーリー"],"。"],
]],
// index: 306
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[307]},[
["ボクは人類に敵対する。"],
["ボクが終わらせる。"],
["人類を。世界を。"],
["——昭和を。"],
]],
// index: 307
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedRevelation3 = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };},finish:"credits",music:"diana12",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[]},[
["昭和横濱物語。アリスの",["黙示録","リベレーション"],"。"],
["了。"],
]],
// index: 308
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[309]},[
["仮称リヴァイアサン、浦賀水道、機雷","原","を突破。"],
["対艦誘導弾も効かないとか、なんだかな。"],
]],
// index: 309
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[310]},[
[["ポストモダン","ポモ"],"に、現代兵器は効かない。"],
["だから、ボクたちがここにいる。"],
]],
// index: 310
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[311]},[
["空中巡洋艦と",["連結","リンク"],"成立。"],
[["読取専用","ROM"],"構造物転送開始。"],
]],
// index: 311
[{speaker:"priest",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[312]},[
["陸側はおさえた。"],
["二十万からの",["屍者","ゾンビ"],"を始末した。"],
["負傷者はいない。"],
["そちらは、どうだ。"],
]],
// index: 312
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[313]},[
["目算はたった。"],
["この国に","三発","めは落ちるまい。"],
]],
// index: 313
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[314]},[
["一般回線に入電。"],
[["深き者","ディープ・ワンズ"],"穏健派の首魁。"],
]],
// index: 314
[{speaker:"activist",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[315]},[
["良い報せと悪い報せがある。"],
["良い報せだ。魚人の多数派工作は成功した。"],
["悪い報せだ。","跳ねっかえり","が、",["携帯地対空誘導弾","スティンガー"],"を",["窃","パク"],"って潜伏した。"],
]],
// index: 315
[{speaker:"demeter",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[316]},[
[["読取専用","ROM"],"構造物転送完了。"],
["構造物の",["瞬間","スナップショット"],"を投入。"],
["物語論爆雷戦準備よろし。"],
]],
// index: 316
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[317]},[
["即時投射。"],
]],
// index: 317
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[318]},[
["ボコっちゃえ。"],
]],
// index: 318
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[319]},[
["物語論散布爆雷が投射された。"],
["仮称リヴァイアサンを中心に",["微細素子","マイクロチップ"],"の雨が降る。"],
["スケール",["不変","インバリアント"],"な物語が、",["状態機械","オートマトン"],"を起動する。"],
["おりたたまれ、つみかさねられた自己相似図形。"],
]],
// index: 319
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[320]},[
["無理数次元の再帰構造に包囲され、仮称リヴァイアサンが吠える。"],
["それは審判の喇叭。"],
["それは",["鎮魂歌","レクイエム"],"。"],
]],
// index: 320
[{speaker:"danu",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[321]},[
[["糞","デリモ"],"。"],
["第二海堡から地対空誘導弾発射。"],
]],
// index: 321
[{speaker:"alice",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[322]},[
[["糞。","ミィエルダ"]],
["飛鳥を海岸線から逃せ。"],
]],
// index: 322
[{speaker:"narrator",music:"diana23",place:"一般設計学研究所跡",background:"モノクローム",adjacencies:[323,342]},[
["退避は間に合わない。"],
["火箭が",["内燃機関","ディーゼルエンジン"],"をつらぬく。"],
["飛鳥が爆発する。"],
]],
// index: 323
[{speaker:"narrator",when:async($,ctx)=>{
if($.genesis)return 342;
},music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[324]},[
["仮称リヴァイアサンは、沈黙した。"],
["語りえないものを騙るがゆえに、物語論兵器。"],
["有限の文字が書きだした無限の言葉。"],
]],
// index: 324
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[325]},[
["世界は書きかわるのか。"],
["あるいは、すでに書きかわったのか。"],
]],
// index: 325
[{speaker:"demeter",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[326]},[
["えっと、書きかわりつつある、たぶん。"],
["ダヌー姐さんは、ちょっとだけまちがってた。"],
["構造が寄生するのは、生物の脳だけじゃない。"],
["たがいに依存して、三位一体計算が成立した。"],
]],
// index: 326
[{speaker:"danu",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[327]},[
["だいじょうぶかな。"],
["円環構造になっちゃわないかな。"],
["否定神学とか。"],
["無限後退とか。"],
]],
// index: 327
[{speaker:"alice",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[328]},[
["それならば。"],
["それがそれならば。"],
["キミが撃て。その銃で。"],
["この世界の天井を","撃","ちやぶれ。"],
]],
// index: 328
[{speaker:"narrator",music:"diana12",place:"いまではないいつか",background:"色づいたセカイ",adjacencies:[329]},[
[["予言機械","オラクルマシン"],"から、したたりおちる言葉。"],
["無限のそのさき、予言値は拡散していく。"],
[["永遠","えいえん"],"のそのさき、ボクたちは出逢いなおす。"],
]],
// index: 329
[{speaker:"narrator",music:"diana12",place:"いまではないいつか",background:"色づいたセカイ",adjacencies:[330]},[
["これは手紙。"],
["これは郵便。"],
["これは",["物語","ナラティブ"],"。"],
]],
// index: 330
[{speaker:"narrator",music:"diana12",place:"いまではないいつか",background:"色づいたセカイ",adjacencies:[331]},[
["一九八九","年一月七日午前六時三十三分。"],
[["破局","カタストロフ"],"は、発生しなかった。"],
["昭和が、終わった。"],
]],
// index: 331
[{speaker:"narrator",music:"diana12",place:"いまではないいつか",background:"色づいたセカイ",adjacencies:[332]},[
["一九八九","年。"],
["二月、手塚治虫が死んだ。"],
["六月、美空ひばりが死んだ。"],
["十一月、",["槌","ハンマー"],"がベルリンの壁をたたきこわした。"],
]],
// index: 332
[{speaker:"narrator",music:"diana12",place:"文芸部部室",background:"色づいたセカイ",adjacencies:[333]},[
["元町の坂のうえ、メサイア会の高校は共学になった。"],
["文芸部の部室。"],
["窓際、透きとおるように白い肌の少女が、ふわりと振りむいて。カラコンをつけたボクなんだけど。"],
]],
// index: 333
[{speaker:"alice",music:"diana12",place:"文芸部部室",background:"色づいたセカイ",adjacencies:[334]},[
["ネットニュースで","前世","の記憶をもつ","転生","戦士をさがした。"],
["ソウルネーム","気高き","天の女王さんから連絡が来た。"],
["会いにいこう。"],
]],
// index: 334
[{speaker:"narrator",music:"diana12",place:"文芸部部室",background:"色づいたセカイ",adjacencies:[335]},[
["灼けてる肌。白い髪。ガングロ。"],
]],
// index: 335
[{speaker:"danu",music:"diana12",place:"文芸部部室",background:"色づいたセカイ",adjacencies:[336]},[
["気高き","天の女王だよ。"],
["よろー。"],
["これ中華街の肉まんね。"],
["食べながら話そ。"],
]],
// index: 336
[{speaker:"narrator",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[337]},[
["米軍",["住宅","ハウス"],"の",["金網","フェンス"],"を眺めながら、ボクたちは肉まんを食べる。"],
]],
// index: 337
[{speaker:"alice",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[338]},[
["このセカイでは、本牧は返還されていない。"],
["だから、マイカル本牧は誕生しない。"],
["だから、イオン本牧になることもない。"],
]],
// index: 338
[{speaker:"alice",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[339]},[
["ソ連は、まだ崩壊しなさそうだ。"],
["ルイセンコが重用されなかったせいかもしれない。"],
["このセカイでは、冷戦が終わっていない。"],
["このセカイでは、戦後がつづいている。"],
]],
// index: 339
[{speaker:"danu",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[340]},[
["セカイっていうのは、",["PHS","ピッチ"],"の電波が届く場所なんだって、漠然と思っていた。"],
]],
// index: 340
[{speaker:"alice",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[341]},[
["今回もアリスと地獄につきあってもらう。"],
["終わらせよう。"],
["今度は、この国の。"],
["——戦後を。"],
]],
// index: 341
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedGospel = true;
  ctx.game.unlockPreview = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };},finish:"credits",music:"diana12",place:"本牧地区",background:"色づいたセカイ",adjacencies:[]},[
["昭和横濱物語。スティーブンによる福音書。最終節。"],
["了。"],
]],
// index: 342
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[343]},[
["仮称リヴァイアサンは、沈黙した。"],
["関東に集結した巨大群体は、動きを止めた。"],
]],
// index: 343
[{speaker:"danu",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[344]},[
["ところでさ。"],
["グライダー",["銃","ガン"],"が",["長命者","メトセラ"],"を撃つんなら。"],
["アタシたちは、どうなるのかな。"],
]],
// index: 344
[{speaker:"demeter",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[345]},[
["生体認証装置に、人類の魔人は、血をささげた。"],
]],
// index: 345
[{speaker:"danu",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[346]},[
[["無原罪","シンレス"],"の人類の血。"],
[["配置","コンフィギュレーション"],"に埋めこまれた、それは感染するのかな。"],
]],
// index: 346
[{speaker:"narrator",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[347]},[
["それは感染する。"],
["人類は変容した。"],
["人類は、緩やかに、人類に変容した。"],
["人類は、遡及的に、人類に変容した。"],
]],
// index: 347
[{speaker:"danu",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[348]},[
["宗教者が困りそう。"],
]],
// index: 348
[{speaker:"priest",music:"diana12",place:"一般設計学研究所跡",background:"色づいたセカイ",adjacencies:[349]},[
["困りはしないぞ。"],
["メシア教はそんなに甘い宗教ではない。"],
["他の宗教のことは知らんが、な。"],
]],
// index: 349
[{speaker:"narrator",music:"diana12",place:"地球",background:"色づいたセカイ",adjacencies:[350]},[
["人類っぽいものは、不老でなくなった。"],
["人類と人類っぽいものは、増殖して、地に満ちたり、海に満ちたりした。"],
[["屍者","ゾンビ"],"はそこにたたずみ、じっと哲学している。"],
]],
// index: 350
[{speaker:"narrator",music:"diana12",place:"地球",background:"色づいたセカイ",adjacencies:[351]},[
["空を飛べるようにはならなかったけれど、宇宙で生存可能な人類っぽいものは産まれた。"],
["いつしか、昭和は終わっていた。"],
["新しい年号が制定されたかどうか、ボクは知らない。"],
]],
// index: 351
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedGenesis = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };},finish:"credits",music:"diana12",place:"地球",background:"色づいたセカイ",adjacencies:[]},[
["昭和横濱物語。アリスの",["創世記","ジェネシス"],"。"],
["了。"],
]],
// index: 352
[{speaker:"narrator",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[353]},[
["文芸部の部室。"],
["壊れかけの黒いラジオから、頭脳警察が流れている。"],
["都市地図が広げられた",["卓子","テーブル"],"を囲む少女たち。"],
]],
// index: 353
[{speaker:"danu",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[354]},[
["ねえ、アリス。"],
["パパがいたってことはさ。"],
["アリスには、ママもいたわけだよね。"],
]],
// index: 354
[{speaker:"alice",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[355,358,357,359]},[
["このセカイが道理をわきまえているならば。"],
["そんなことは、期待するべくもないが。"],
]],
// index: 355
[{speaker:"danu",when:async($,ctx)=>{
if(ctx.game.father === "サム・スペード")return 358;
if(ctx.game.father === "フィリップ・マーロウ")return 357;
if(ctx.game.father === "マイク・ハマー")return 359;
},enter:async($,ctx)=>{ctx.trophy("doe");},music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[356]},[
["ジョン・ドゥ","と","ジェーン・ドゥ","から産まれてしまった、名づけられなかった子供たちがアタシたちだとしたら。"],
]],
// index: 356
[{speaker:"alice",jump:365,music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[365]},[
["天照","機関を出奔した人造魔人。"],
["量産型天皇霊を","降ろした","十三人の聖女の最後のひとり。"],
[["暴力の聖女","ゲバルト・ローザ"],"と",["字名","あざな"],"された女。"],
["かつてボクの母だった人間だ。"],
]],
// index: 357
[{speaker:"demeter",jump:360,music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[360]},[
["先輩のお父さんって、フィリップ・マーロウを名乗ってたんでしたっけ。"],
["お母さんも、ダサい",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 358
[{speaker:"demeter",jump:360,music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[360]},[
["先輩のお父さんって、サム・スペードを名乗ってたんでしたっけ。"],
["お母さんも、趣味の悪い",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 359
[{speaker:"demeter",jump:360,music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[360]},[
["先輩のお父さんって、マイク・ハマーを名乗ってたんでしたっけ。いや、あれれ。","濱","マイクのほうだったかな。"],
["お母さんも、野暮ったい",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 360
[{speaker:"alice",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[361]},[
["いってくれるじゃないか。"],
["やれやれ。ソウルネーム——",["暴力の聖女","ゲバルト・ローザ"],"。"],
["品性のなさにかけては、父も母もどっこいどっこいだな。"],
["破れ鍋に綴じ","蓋","だったのかもしれないが。"],
]],
// index: 361
[{speaker:"demeter",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[362]},[
["屍都の女王も、たいがい。"],
]],
// index: 362
[{speaker:"alice",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[363]},[
["ボ、ボ、ボク","は、自ら名乗ってるわけじゃないからセーフ。"],
]],
// index: 363
[{speaker:"danu",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[364]},[
["アタシってば、自称なんだけど。"],
]],
// index: 364
[{speaker:"demeter",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[365]},[
["姐さんはいいんです。"],
]],
// index: 365
[{speaker:"alice",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[366]},[
["そんなことより、",["仕事","ビズ"],"の話だ。"],
]],
// index: 366
[{speaker:"danu",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[367]},[
["ねぇ、あのコ、泣いてた。助けてって。"],
["友達の友達の友達なんだけど。"],
["両親が偽メシア教カルトらしくてさ。"],
]],
// index: 367
[{speaker:"demeter",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[368]},[
["最近、",["アシッド","LSD"],"ばらまいてる、あ",["奴","いつ"],"ら","。"],
["各方面から絶賛睨まれ発生中。"],
["武装はせいぜい",["黒星","ヘイシン"],"くらい。"],
]],
// index: 368
[{speaker:"alice",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[369]},[
["そのコを","助","ける。"],
["しかるのち、撃滅する。"],
["いつもどおり、最大の火力をもって。"],
["いつもどおりの単純な",["仕事","ラン"],"だ。"],
]],
// index: 369
[{speaker:"narrator",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[370]},[
["少女たちが去った部室。"],
["窓からさしこむ、あえやかな月の光。"],
["ラジオがささやく",["雑音","ノイズ"],"のなか、遠く、その声は聴こえた。"],
]],
// index: 370
[{speaker:"rosa",start:"preview",music:"diana21",place:"カルチェ・ラタン",background:"モノクローム",adjacencies:[371]},[
["こちらは、自由ラジオ横濱",["前線","フロント"],"。"],
["ライシャワーが死んだセカイ線、バリケードの裡から、あの山岳",["根拠地","ベース"],"で産まれてしまった子供たちへ。"],
["聴こえてるかな。"],
]],
// index: 371
[{speaker:"rosa",music:"diana21",place:"カルチェ・ラタン",background:"モノクローム",adjacencies:[372]},[
["城市","が",["叢林","ジャングル"],"を","包圍","する時。"],
["城市","もまた",["叢林","ジャングル"],"に","包圍","されてる。"],
["聴こえてるんでしょ。"],
]],
// index: 372
[{speaker:"rosa",music:"diana21",place:"カルチェ・ラタン",background:"モノクローム",adjacencies:[373]},[
["子供たち。聴こえているならば。"],
["母が見つけられなかった、この国の戦後にさよならを告げる方法を見つけておくれ。"],
[["さよなら","アスタ・ルエゴ"],"、",["ヤルタ","Y"],"・",["ポツダム","P"],["体制","レジーム"],"。"],
]],
// index: 373
[{speaker:"rosa",music:"diana21",place:"カルチェ・ラタン",background:"モノクローム",adjacencies:[374]},[
["それは、父殺しの物語。"],
["それは、母殺しの物語。"],
["さよならを","いうのは","わずかのあいだ死ぬことだから。"],
]],
// index: 374
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedSixtyNine = true;},finish:"title",music:"diana21",place:"カルチェ・ラタン",background:"モノクローム",adjacencies:[]},[
["三十八度線上空で消息を","絶った","日航","三百五十一便に、",["暴力の聖女","ゲバルト・ローザ"],"が搭乗していた","と",["中央情報局","ラングレー"],"は報告している。"],
[["予告","USODESU"],"。——昭和横濱物語","'69","。"],
]],
// index: 375
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["タイトルに戻る？"],
]],
// index: 376
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["システム設定とコンポーネント設定を、工場出荷状態に戻す。"],
["本当に設定を戻していい？"],
]],
// index: 377
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["全セーブデータを削除して、タイトルに戻る。"],
["実績データと既読データは、そのまま。"],
["本当にセーブデータを消していい？"],
]],
// index: 378
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["頭出し用の信号が記録されている。"],
["このテープでは既読の","節","を択べる。"],
["選択する？"],
]],
// index: 379
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["このテープにはチュートリアルが記録されている。"],
["チュートリアルをはじめる？"],
]],
// index: 380
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["この",["因果","テープ"],"は、捻れて捩れて絡まりあっている。"],
["この",["運命","テープ"],"は、再生できない。"],
["今のところは。"],
]],
// index: 381
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["年代物のテープが修復された。"],
["正常に読めるかは未知数。"],
["再生してみる？"],
]],
// index: 382
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["一巻","めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 383
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["二巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 384
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["三巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 385
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["このテープはからっぽだ。"],
["なにも記録されていない。"],
]],
// index: 386
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["一巻","めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 387
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["二巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 388
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["三巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 389
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["いまではない、いつか。"],
["絡まりあった因果がほどけた。"],
["ここではない、どこか。"],
["捻れた運命がときはなたれた。"],
]],
// index: 390
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"を検出。"],
["反映のため、システムは",["再読込","リロード"],"を要請。"],
["更新していい？"],
]],
// index: 391
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"を検出。"],
["反映のため、システムは",["再読込","リロード"],"を要請。"],
["タイトルに戻って、更新していい？"],
]],
// index: 392
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["物語の並列起動を検出。"],
["データの整合性をたもてなくなる可能性あり。"],
["ただひとつの起動を推奨。"],
]],
// index: 393
[{speaker:"narrator",system:true,adjacencies:[]},[
["この",["時間線","タイムライン"],"に、過去はまだ存在していない。"],
]],
],
total:374,
starts:[1,2,3,4,6,5,352,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393],
labels:{
"ニューゲーム":1,
"おはよう":2,
"こんにちは":3,
"節選択":4,
"節選択2":5,
"節選択3":6,
"チュートリアル":7,
"トロッコ滅亡":9,
"トロッコ犠牲":10,
"トロッコ択ばない":11,
"トロッコ終":12,
"質問":16,
"チュートリアル終":17,
"第一節":18,
"銃の持ち主":31,
"聞いたことがある":57,
"聞いたことがない":58,
"手紙を届けてもらう":59,
"第二節":65,
"手紙の届けさき":67,
"聖職者":68,
"聖職者済":91,
"工学者":92,
"工学者済":122,
"活動家":123,
"ろうくみ":125,
"ピケやぶり":126,
"活動家済":162,
"特殊攻撃作戦":163,
"熱望":172,
"希望":173,
"拒否":175,
"第二節黙示録了":186,
"第三節":187,
"エデンの園":296,
"グライダー銃":297,
"択ばない":298,
"第三節黙示録了":308,
"創世記":342,
"プレビュー":352,
"フィリップ・マーロウ":357,
"サム・スペード":358,
"マイク・ハマー":359,
"ゲバルト・ローザ":360,
"ゲバルト・ローザ終":365,
"空の履歴":393,
},
dialogs:{
"system-back-to-title":375,
"system-reset-system":376,
"system-reset-save":377,
"load-tape-select":378,
"load-tape-tutorial":379,
"load-tape-broken":380,
"load-tape-preview":381,
"load-tape-save1":382,
"load-tape-save2":383,
"load-tape-save3":384,
"load-tape-empty":385,
"save-tape-save1":386,
"save-tape-save2":387,
"save-tape-save3":388,
"credits-tape-preview":389,
"system-update-title":390,
"system-update":391,
"system-multiple":392,
},
};

})();
