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
[{speaker:"danu",music:"star_guardian03",place:"あの日の横濱",background:"モノクローム",adjacencies:[]},[
["自由ラジオ横濱",["前線","フロント"],"。"],
["パーソナリティ","のダヌーさんだよ。"],
["で、",["貴方","アンタ"],"、誰。"],
]],
// index: 2
[{speaker:"author",adjacencies:[]},[
["よお。"],
]],
// index: 3
[{speaker:"danu",adjacencies:[]},[
["そうきたか。"],
]],
// index: 4
[{speaker:"author",adjacencies:[]},[
["……どうでも","いい","が、あとがきで作者が登場人物と会話をするって、ジュブナイルの基本やよな。"],
]],
// index: 5
[{speaker:"danu",adjacencies:[]},[
["面倒だからいちいち突っ込まないぞ。"],
]],
// index: 6
[{speaker:"author",adjacencies:[]},[
["私淑する作家は、","ろくごまるにと","ぶらじま","太郎です。"],
]],
// index: 7
[{speaker:"danu",adjacencies:[]},[
["そこで、タイラーとかスレイヤーズとか挙げられないところが、",["貴方","アンタ"],"達の限界だわよ。"],
]],
// index: 8
[{speaker:"author",adjacencies:[]},[
["その","『——だわよ』","口調は、","『レッツゴー怪奇組』","組長口調というんだぜ。"],
]],
// index: 9
[{speaker:"danu",adjacencies:[]},[
["こすってくるなあ。"],
["企画書には、黒歴史ラジオの風体で、オーディオコメンタリーしてみたいって書いてあって。"],
]],
// index: 10
[{speaker:"author",finish:"title",adjacencies:[]},[
["『真・女神転生V』","と","『モナーク』","をやったんだ","ヨネ","。"],
]],
],
total:10,
starts:[1],
labels:{
"あとがき":1,
},
dialogs:{
},
};

})();
