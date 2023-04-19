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
[{speaker:"narrator",system:true,dialog:[{choice:"選択",result:"yes"},{choice:"取消",result:"no"},],adjacencies:[]},[
[["復元","リストア"],"するバックアップデータを、此処にドラッグ・アンド・ドロップするか、ファイルダイアログで択ぶかして。"],
]],
// index: 2
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析完了。"],
["整合性チェック成功。"],
[["復元","リストア"],"して、タイトルに戻る？"],
]],
// index: 3
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析完了。"],
["整合性チェック失敗。改竄の可能性。"],
["強制的に",["復元","リストア"],"して、タイトルに戻る？"],
]],
// index: 4
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析失敗。"],
["未知の言語で記述されている可能性。"],
[["復元","リストア"],"不能。"],
]],
],
total:0,
starts:[1,2,3,4],
labels:{
},
dialogs:{
"system-restore-drop":1,
"system-restore":2,
"system-restore-integrity-error":3,
"system-restore-format-error":4,
},
};

})();
