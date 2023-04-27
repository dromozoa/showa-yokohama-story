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
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"が、公開されたみたい。"],
["更新するために、","App Store","を開く？"],
]],
// index: 2
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"が、公開されたみたい。"],
["更新するために、","Playストア","を開く？"],
]],
// index: 3
[{speaker:"narrator",system:true,dialog:[{choice:"選択",result:"yes"},{choice:"取消",result:"no"},],adjacencies:[]},[
[["復元","リストア"],"するバックアップデータを、此処にドラッグ・アンド・ドロップするか、ファイルダイアログで択ぶかして。"],
]],
// index: 4
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析完了。"],
["整合性チェック成功。"],
[["復元","リストア"],"して、タイトルに戻る？"],
]],
// index: 5
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析完了。"],
["整合性チェック失敗。改竄の可能性。"],
["強制的に",["復元","リストア"],"して、タイトルに戻る？"],
]],
// index: 6
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["データ",["形式","フォーマット"],"の解析失敗。"],
["未知の言語で記述されている可能性。"],
[["復元","リストア"],"不能。"],
]],
// index: 7
[{speaker:"narrator",system:true,dialog:[{choice:"取消",result:"no"},],adjacencies:[]},[
[["復元","リストア"],"するバックアップデータを、此処にドラッグ・アンド・ドロップするか、","他","のアプリから",["共有","シェア"],"して。"],
]],
// index: 8
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"が、公開されたみたい。"],
["Playストア","から",["取得","ダウンロード"],"して、自己更新していい？"],
]],
],
total:0,
starts:[1,2,3,4,5,6,7,8],
labels:{
},
dialogs:{
"system-update-ios":1,
"system-update-android":2,
"system-restore-drop":3,
"system-restore":4,
"system-restore-integrity-error":5,
"system-restore-format-error":6,
"system-restore-ios":7,
"system-update-android-in-app":8,
},
};

})();
