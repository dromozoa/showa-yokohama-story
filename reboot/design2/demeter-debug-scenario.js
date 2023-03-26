(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index:1
[{speaker:"narrator",music:"vi03",place:"ここではないどこか"},[
["二人称の文体で書かれた、これは無口な一人称の物語。"],
["画面の右下で弾む円匙と斧槍のアイコンは、キミに入力をうながしている。"],
["クリックでもタッチでもエンターでも。お好みで。"],
]],
// index:2
[{speaker:"narrator",choices:[
{choice:["人類の滅亡を見守る"],label:3},
{choice:["少女を犠牲に捧げる"],label:4},
{choice:["択ばない"],label:5},
]},[
["ボクたちは、択ばれなかった選択肢の側に立つ紐帯だ。"],
["たとえば——昭和が暴走した。"],
["終わらない昭和に、このままでは人類は轢き殺される。"],
["選択肢がある。少女を犠牲に、人類を救う。"],
]],
// index:3
[{speaker:"narrator",jump:6},[
["胸糞の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、人類は滅亡した。"],
["気にすることはない。"],
["人類なんて",["初手","はな"],"から滅んでるんだから。"],
]],
// index:4
[{speaker:"narrator",jump:6},[
["胸糞の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、少女は斃れた。"],
["気に病む必要はない。"],
["キミは人類を救った。きっと。たぶん。だけど。"],
]],
// index:5
[{speaker:"narrator"},[
["キミは択ばないという選択肢を択んだ。"],
["択んだのか、択ばなかったのか、どちらだろう。"],
["どちらでもあり、どちらでもない。"],
["しかし、少女が行ったところまでは見えなかった。"],
]],
// index:6
[{speaker:"narrator"},[
["画面上部の",["システム","SYSTEM"],"ボタンを押すと、",["設定","コントロール"],"パネルが表示される。もういちど押したら、消える。"],
["パネルの下のほうが隠れていたら、スクロール。"],
]],
// index:7
[{speaker:"narrator"},[
["キミがどこまで読んだか、システムは暗黙に記憶する。"],
["爪が折れた","三本","のテープと、爪が折れていない","三本","のテープが用意されている。"],
["キミは、明示的に、",["読出","LOAD"],"したり、",["書出","SAVE"],"したりできる。"],
]],
// index:8
[{speaker:"narrator"},[
[["自動","AUTO"],"再生すると、選択肢が示されるまで、あるいは、キミがなんらか入力するまで、テクストと",["音声","ボイス"],"が順番に再生されていく。"],
]],
// index:9
[{speaker:"narrator"},[
[["高速","SKIP"],"再生も似たようなものだけど、",["音声","ボイス"],"を再生しない。"],
["フレーム毎に","一行","、素早くテクストをつらつら書きつらねる。"],
["システム設定でチェックを入れるまで、未読の段落はスキップされない。"],
]],
// index:10
[{speaker:"narrator",choices:[
{choice:["ツイッターで質問する"],action:($,ctx)=>{ctx.sender.twitter();},barcode:"Twitter",label:10},
{choice:["マシュマロで質問する"],action:($,ctx)=>{ctx.sender.marshmallow();},barcode:"Marshmallow",label:10},
{choice:["質問はない"],barcode:"THE WRONG GOODBYE",label:11},
]},[
["こんなところ。"],
["なにか質問ある？"],
]],
// index:11
[{speaker:"narrator",finish:"title"},[
["それじゃあ、良き、終末を。"],
]],
// index:12
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["タイトルに戻る？"],
]],
// index:13
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["システム設定とコンポーネント設定を、工場出荷状態に戻す。"],
["本当に設定を戻していい？"],
]],
// index:14
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["全セーブデータを削除して、タイトルに戻る。"],
["実績データと既読データは、そのまま。"],
["本当にセーブデータを消していい？"],
]],
// index:15
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["頭出し用の信号が記録されている。"],
["このテープでは既読の","節","を択べるようだ。"],
["選択する？"],
]],
// index:16
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["このテープにはチュートリアルが記録されている。"],
["チュートリアルをはじめる？"],
]],
// index:17
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["この",["因果","テープ"],"は、捻れて捩れて絡まりあっている。"],
["この",["運命","テープ"],"は、再生できない。"],
["今のところは。"],
]],
// index:18
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["年代物のテープが修復された。"],
["正常に読めるかは未知数。"],
["再生してみる？"],
]],
// index:19
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:20
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:21
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:22
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["このテープはからっぽだ。"],
["なにも記録されていない。"],
]],
// index:23
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:24
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:25
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:26
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["いまではない、いつか。"],
["絡まりあった因果がほどけた。"],
["ここではない、どこか。"],
["捻れた運命がときはなたれた。"],
]],
],
labels:{
"チュートリアル":1,
"トロッコ滅亡":3,
"トロッコ犠牲":4,
"トロッコ択ばない":5,
"トロッコ終":6,
"質問":10,
"チュートリアル終":11,
},
dialogs:{
"system-back-to-title":12,
"system-reset-system":13,
"system-reset-save":14,
"load-tape-select":15,
"load-tape-tutorial":16,
"load-tape-broken":17,
"load-tape-preview":18,
"load-tape-save1":19,
"load-tape-save2":20,
"load-tape-save3":21,
"load-tape-empty":22,
"save-tape-save1":23,
"save-tape-save2":24,
"save-tape-save3":25,
"credits-tape-preview":26,
},
};

})();
