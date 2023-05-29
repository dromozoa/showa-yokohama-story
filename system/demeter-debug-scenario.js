/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index: 1
[{speaker:"danu",jump:22,when:async($,ctx)=>{
if(ctx.game.visitedCredits)return 22;
},music:"sgt03",place:"壁にかこまれた横濱",background:"モノクローム",adjacencies:[]},[
["あれまあ、あとがきを最初に読んじゃう",["種別","タイプ"],"の人類だわね。"],
["妾","もそういう","類","だから、判るよ。"],
["って、まあ、人類じゃないかもだけどね、","妾","達。"],
]],
// index: 2
[{speaker:"danu",adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。"],
["あらためまして、おはこんばんちは。"],
["気高き","天の女王、ダヌーさんだよ。"],
["で、","貴方","、誰。"],
]],
// index: 3
[{speaker:"author",adjacencies:[]},[
["よお。"],
]],
// index: 4
[{speaker:"danu",adjacencies:[]},[
["そうきたか。"],
]],
// index: 5
[{speaker:"author",adjacencies:[]},[
["……どうでも","いい","が、あとがきで作者が登場人物と会話をするって、ジュブナイルの基本やよな。"],
]],
// index: 6
[{speaker:"danu",adjacencies:[]},[
["面倒だからいちいち突っ込まないぞ。"],
]],
// index: 7
[{speaker:"author",adjacencies:[]},[
["私淑する作家は、","ろくごまるにと","ぶらじま","太郎です。"],
]],
// index: 8
[{speaker:"danu",adjacencies:[]},[
["そこで、タイラーとかスレイヤーズとか挙げられないところが、","貴方","達の限界だわよ。"],
]],
// index: 9
[{speaker:"author",adjacencies:[]},[
["その","『——だわよ』","口調は、","『レッツゴー怪奇組』","組長口調というんだぜ。"],
]],
// index: 10
[{speaker:"danu",adjacencies:[]},[
["こすってくるなあ。"],
["企画書には、黒歴史ラジオの風体でコメンタリーしたいって書いてあったけど。"],
]],
// index: 11
[{speaker:"author",adjacencies:[]},[
["実は、君の名は","『真・女神転生V』","に由来する。"],
]],
// index: 12
[{speaker:"danu",adjacencies:[]},[
["実はもなんも、","STEVEN","がでてきた時点で、読者諸賢はおさっしだわよ。"],
]],
// index: 13
[{speaker:"author",adjacencies:[]},[
["実は、メサイア会のモデルは、イエズス会。"],
]],
// index: 14
[{speaker:"danu",adjacencies:[]},[
["それは、まあ、ね。"],
["けど、いいの。"],
["AK","遣うくらいなら、",["素手","ステゴロ"],"すんのがあ",["奴","いつ"],"らでしょ。"],
]],
// index: 15
[{speaker:"author",adjacencies:[]},[
[["偽史","フィクション"],"だからね、どこまでいってもさ。"],
]],
// index: 16
[{speaker:"danu",adjacencies:[]},[
["原子爆弾以外は。"],
]],
// index: 17
[{speaker:"author",adjacencies:[]},[
["そりゃあそうさ。"],
]],
// index: 18
[{speaker:"danu",adjacencies:[]},[
["で、どうなの。"],
["方向性とか、そういうの。"],
]],
// index: 19
[{speaker:"author",adjacencies:[]},[
["『昭和米国物語』","のコンセプトに、",["屍者","ゾンビ"],"と",["怪獣","カイジュー"],"とロボってあってさ、ロボまでたどりつけなかったんだよね。"],
["黄色い会社はその痕跡なわけだけど。"],
]],
// index: 20
[{speaker:"danu",adjacencies:[]},[
["ビーンボール、投げてくれんじゃん。"],
["まあ、そんなかんじでネタばらしをしていくわけだよね。"],
["んじゃ、チャンネル登録よろしくおなしゃす——"],
]],
// index: 21
[{speaker:"narrator",finish:"title",adjacencies:[]},[
["壁にかこまれた横濱から脱出するための、これが最後の物語。自由ラジオ横濱",["前線","フロント"],"。第一回。"],
["了。（つづく）"],
]],
// index: 22
[{speaker:"danu",choices:[
{choice:["第一回"],barcode:"Author",label:2},
{choice:["第二回"],barcode:"Demeter",label:23},
{choice:["最終回"],barcode:"Alice",label:48},
],adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。"],
["パーソナリティ","のダヌーさんだよ。"],
]],
// index: 23
[{speaker:"danu",adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。"],
["あらためまして、本日のゲストは……"],
]],
// index: 24
[{speaker:"demeter",adjacencies:[]},[
[["豊穣","ハーベスト"],"！"],
["今後とも、よろしくですの！"],
]],
// index: 25
[{speaker:"danu",adjacencies:[]},[
["はいはい、",["豊穣","ハーベスト"],"。"],
["ていうか","自分","、","そもそもどして","情報分隊なん。"],
]],
// index: 26
[{speaker:"demeter",adjacencies:[]},[
["そこには聞くも","涙","語るも涙の物語","が","ないんですけど。"],
]],
// index: 27
[{speaker:"danu",adjacencies:[]},[
["嘘","吐","き。"],
["あるんでしょ。"],
]],
// index: 28
[{speaker:"demeter",adjacencies:[]},[
[["屍者","ゾンビ"],"禍","で産業基盤が破壊されつくしたのに、半導体が生産されてるっておかしくないですか。"],
["と、","彼女","は","オノ＝センダイ","をかかげる。"],
]],
// index: 29
[{speaker:"danu",adjacencies:[]},[
["あーね。"],
["ゆうて",["珪素","シリコン"],"っしょ。"],
]],
// index: 30
[{speaker:"demeter",adjacencies:[]},[
["聞いたときある——"],
["天照","機関の秘儀。"],
["濱の真砂が尽きるとも。"],
]],
// index: 31
[{speaker:"danu",adjacencies:[]},[
["出出〜","、","大嘗祭","を女がやると、稲米じゃなくて産業の米ができちゃう奴。"],
]],
// index: 32
[{speaker:"demeter",adjacencies:[]},[
["天照","機関の",["巫女","エルブズ"],"がいっしょうけんめい錬成してんの。"],
]],
// index: 33
[{speaker:"danu",adjacencies:[]},[
["マジかぁ。"],
]],
// index: 34
[{speaker:"demeter",adjacencies:[]},[
["って、今つくった設定。"],
]],
// index: 35
[{speaker:"danu",adjacencies:[]},[
["をい。"],
]],
// index: 36
[{speaker:"demeter",adjacencies:[]},[
["大御神と",["妖精","エルフ"],"が百合せっせすると",["世界樹","ユグドラシル"],"に半導体が実る。"],
]],
// index: 37
[{speaker:"danu",adjacencies:[]},[
["雷管がなる樹はないの。"],
]],
// index: 38
[{speaker:"demeter",adjacencies:[]},[
["四十五口径ってところが、どうしたって",["男根主義","マチズモ"],"。"],
]],
// index: 39
[{speaker:"danu",adjacencies:[]},[
["あれは、まあ、","彼女","のこだわりだから。"],
]],
// index: 40
[{speaker:"demeter",adjacencies:[]},[
["ガーンズバック連続じゃなかった未来だって、いくつかありえたかも。"],
]],
// index: 41
[{speaker:"danu",adjacencies:[]},[
["統合航空軍とか飛鳥とか、あのあたりのダサさはなんとかならんの。"],
]],
// index: 42
[{speaker:"demeter",adjacencies:[]},[
["おおめに見たってよ。"],
["佐藤大輔に私淑して駒大に進んだ作者の友人がいてさ。"],
["佐藤大輔とおんなじ体型で、佐藤大輔とおなじく死んだんだよね。"],
]],
// index: 43
[{speaker:"danu",adjacencies:[]},[
["やれやれ。"],
["友人、ね。"],
["まあ、やせなきゃね。"],
]],
// index: 44
[{speaker:"demeter",adjacencies:[]},[
["ネタとメタとベタ。"],
["スキゾにパラノ。"],
["妾","たちが斗っているのは、ただしく絶滅戦争なんでしてよ！"],
]],
// index: 45
[{speaker:"danu",adjacencies:[]},[
["ちがうよ。"],
["これは、ただしく無国籍アクションなんだわよ。"],
]],
// index: 46
[{speaker:"demeter",adjacencies:[]},[
["国体を北海道以北にうつせば、無国籍が道理。"],
["九〇年代","を終わらせるために、アクションが条件。"],
]],
// index: 47
[{speaker:"narrator",adjacencies:[]},[
["壁にかこまれた横濱から脱出するための、これが最後の物語。自由ラジオ横濱",["前線","フロント"],"。第二回。"],
["了。（つづく）"],
]],
// index: 48
[{speaker:"danu",adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。最終回。"],
["あらためまして、本日のゲストは……"],
]],
// index: 49
[{speaker:"alice",adjacencies:[]},[
[["六本木","ギロッポン"],"の",["偶像","アイドル"],"、アリスだよ！"],
["今後とも、よろしく……"],
]],
// index: 50
[{speaker:"danu",adjacencies:[]},[
["いや、アリス。"],
["それはさすがにさ。"],
]],
// index: 51
[{speaker:"alice",adjacencies:[]},[
["ちゃんと伏線は","はって","おいたぜ。"],
["父","ちゃんが海兵隊からガヴァメントをまきあげたのは、六本木なんだから。"],
]],
// index: 52
[{speaker:"danu",adjacencies:[]},[
["矢作俊彦への",["引用","オマージュ"],"かな。"],
["でも、",["解放者","リベレータ"],"は違うでしょ。"],
["『吉里吉里人』","とかいったりしないよね、まさか。"],
]],
// index: 53
[{speaker:"alice",adjacencies:[]},[
["正直にいうと、その嘘も考えたけどね。"],
["九〇年代","のマニュアル","本","とか悪趣味とか鬼畜系ブームのムーブかなあ。"],
]],
// index: 54
[{speaker:"danu",adjacencies:[]},[
["——サブカル。"],
]],
// index: 55
[{speaker:"alice",adjacencies:[]},[
["あれは富士見だったのかなあ。"],
["おぼえてないんだけど。"],
]],
// index: 56
[{speaker:"danu",adjacencies:[]},[
["『悪の江ノ島大決戦』","のはなし？"],
]],
// index: 57
[{speaker:"alice",adjacencies:[]},[
["ちがうよ。"],
["ちがわないかな。"],
["やっぱり、ちがうよ。"],
]],
// index: 58
[{speaker:"danu",adjacencies:[]},[
["じゃあ、","『望郷戦士』","のはなし？"],
]],
// index: 59
[{speaker:"alice",adjacencies:[]},[
["豪速球だな、軍曹。"],
["僕はまだおぼえている。"],
["あのころのジュブナイル小説賞の講評でさ。"],
]],
// index: 60
[{speaker:"danu",adjacencies:[]},[
["ききあきたよ。"],
["壁にかこまれた世界から脱出しすぎ","ワロタ","ってはなしっしょ。"],
]],
// index: 61
[{speaker:"alice",adjacencies:[]},[
["《壁》","とはなんだったんだろう。"],
["僕はそれをずっと考えている。"],
["まさか、ベルリンのあの壁だったはずはない。"],
["まして。"],
]],
// index: 62
[{speaker:"danu",adjacencies:[]},[
[["壁","フェンス"],"でも",["壁","バリケード"],"でもなく。"],
]],
// index: 63
[{speaker:"alice",adjacencies:[]},[
["多摩川","でも","江戸川","でも。"],
["まして、荒川でもなかった。"],
]],
// index: 64
[{speaker:"danu",adjacencies:[]},[
["脱出しなければならないという思いだけを抱えて。"],
]],
// index: 65
[{speaker:"alice",adjacencies:[]},[
["抱えこんだという記憶だけを抱きしめて。"],
]],
// index: 66
[{speaker:"danu",adjacencies:[]},[
["屋上で。"],
["少女たちは。"],
]],
// index: 67
[{speaker:"alice",adjacencies:[]},[
["屋上で。"],
["川","むこうをにらみ。"],
["少女たちが。"],
]],
// index: 68
[{speaker:"narrator",finish:"title",adjacencies:[]},[
["壁にかこまれた横濱から脱出するための、これが最後の物語。自由ラジオ横濱",["前線","フロント"],"。最終回。"],
["了。（つづく）"],
]],
],
total:68,
starts:[1,22],
labels:{
"あとがき":1,
"第一回":2,
"あとがき開始":22,
"第二回":23,
"最終回":48,
},
dialogs:{
},
};

})();
