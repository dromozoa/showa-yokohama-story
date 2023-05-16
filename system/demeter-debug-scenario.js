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
[{speaker:"danu",when:async($,ctx)=>{
if(ctx.game.visitedCredits)return 2;
},music:"star_guardian03",place:"ながいながい階段",background:"モノクローム",adjacencies:[]},[
["あれま、あとがきを最初に読んじゃう",["種別","タイプ"],"の人類だわね。"],
[["妾","アタシ"],"もそういう",["種別","タイプ"],"だから、判るよ。"],
["って、まあ、人類じゃないかもだけどね、",["妾","アタシ"],"達。"],
]],
// index: 2
[{speaker:"danu",adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。"],
["パーソナリティ","のダヌーさんだよ。"],
["で、",["貴方","アンタ"],"、誰。"],
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
["そこで、タイラーとかスレイヤーズとか挙げられないところが、",["貴方","アンタ"],"達の限界だわよ。"],
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
["それらだけは叩きこまれるのさ。"],
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
["壁にかこまれた横濱から脱出するための、これは最後の物語。自由ラジオ横濱",["前線","フロント"],"。第一回。"],
["了。（つづく）"],
]],
],
total:21,
starts:[1,2],
labels:{
"あとがき":1,
"あとがき開始":2,
},
dialogs:{
},
};

})();
