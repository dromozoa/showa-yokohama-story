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
["パーソナリティのダヌーさんだよ。"],
["で、",["貴下","アンタ"],"、誰。"],
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
["……どうでもいいが、あとがきで作者が登場人物と会話をするって、ジュブナイルの基本やよな。"],
]],
// index: 5
[{speaker:"danu",finish:"title",adjacencies:[]},[
["面倒だからいちいち突っ込まないぞ。"],
]],
],
total:5,
starts:[1],
labels:{
"あとがき":1,
},
dialogs:{
},
};

})();
