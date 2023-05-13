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
[{speaker:"danu",finish:"title",music:"star_guardian03",place:"あの日の横濱",background:"モノクローム",adjacencies:[]},[
["こんにちは。"],
["ダヌーさんだよ。"],
]],
],
total:1,
starts:[1],
labels:{
"あとがき":1,
},
dialogs:{
},
};

})();
