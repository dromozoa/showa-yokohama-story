(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index:1
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["システム設定とコンポーネント設定を",["初期値","デフォルト"],"に戻す。"],
["本当に設定を戻していい？"],
]],
// index:2
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["セーブデータを全部削除してタイトルに戻る。"],
["実績データや既読データは、そのまま。"],
["本当にセーブデータを消していい？"],
]],
// index:3
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["頭出し用の信号が記録されている。"],
["既読の","節","を択べるようだ。"],
["選択する？"],
]],
// index:4
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["このテープにはチュートリアルが記録されている。"],
["再生する？"],
]],
// index:5
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["この",["因果","テープ"],"はねじれてよじれてからまりあっている。"],
["再生できない。"],
["今のところは。"],
]],
// index:6
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["年代物のテープが修復された。"],
["正常に読めるかは未知数。"],
["再生する？"],
]],
// index:7
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:8
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:9
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:10
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["このテープはからっぽだ。"],
["なにも記録されていない。"],
]],
// index:11
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:12
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:13
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:14
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["いまではない、いつか。"],
["からまりあった因果がほどけた。"],
["ここではない、どこか。"],
["ねじれた運命がときはなたれた。"],
]],
],
labels:{
},
dialogs:{
"system-reset-system":1,
"system-reset-save":2,
"load-tape-select":3,
"load-tape-tutorial":4,
"load-tape-broken":5,
"load-tape-preview":6,
"load-tape-save1":7,
"load-tape-save2":8,
"load-tape-save3":9,
"load-tape-empty":10,
"save-tape-save1":11,
"save-tape-save2":12,
"save-tape-save3":13,
"credits-tape-preview":14,
},
};

})();
