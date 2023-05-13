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
["ダヌーさんだよ。"],
["で、",["貴下","アンタ"],"、誰。"],
]],
// index: 2
[{speaker:"author",finish:"title",adjacencies:[]},[
["ドーモ、作者です。"],
]],
],
total:2,
starts:[1],
labels:{
"あとがき":1,
},
dialogs:{
},
};

})();
