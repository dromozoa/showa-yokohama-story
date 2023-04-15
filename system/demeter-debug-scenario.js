(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index: 1
[{speaker:"narrator",music:"vi03",place:"ここではないどこか",adjacencies:[]},[
["二人称の文体で書かれた、これは無口な一人称の物語。"],
["画面の右下で弾む円匙と斧槍のアイコンは、キミに入力をうながしている。"],
["クリックでもタッチでもエンターでも。お好みで。"],
]],
// index: 2
[{speaker:"narrator",choices:[
{choice:["人類の滅亡を見守る"],barcode:"Extinction",label:3},
{choice:["少女を犠牲に捧げる"],barcode:"Sacrifice",label:4},
{choice:["択ばない"],label:5},
],adjacencies:[]},[
["ボクたちは、択ばれなかった選択肢の側に立つ紐帯だ。"],
["たとえば——昭和が暴走した。"],
["終わらない昭和に、このままでは人類は轢き殺される。"],
["選択肢がある。少女を犠牲に、人類を救う。"],
]],
// index: 3
[{speaker:"narrator",jump:6,adjacencies:[]},[
["意地の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、人類は滅亡した。"],
["気にすることはない。"],
["人類なんて",["初手","はな"],"から滅んでるんだから。"],
]],
// index: 4
[{speaker:"narrator",jump:6,adjacencies:[]},[
["胸糞の悪い問題を出して、ごめん。"],
["さて、キミの選択によって、少女は斃れた。"],
["気に病む必要はない。"],
["キミは人類を救った。きっと。たぶん。だけど。"],
]],
// index: 5
[{speaker:"narrator",adjacencies:[]},[
["キミは択ばないという選択肢を択んだ。"],
["択んだのか、択ばなかったのか、どちらだろう。"],
["どちらでもあり、どちらでもない。"],
["しかし、少女が行ったところまでは見えなかった。"],
]],
// index: 6
[{speaker:"narrator",adjacencies:[]},[
["画面上部の",["システム","SYSTEM"],"ボタンを押すと、",["設定","コントロール"],"パネルが表示される。もういちど押したら、消える。"],
["パネルの下のほうは隠されているから、スクロール。"],
]],
// index: 7
[{speaker:"narrator",adjacencies:[]},[
["キミがどこまで読んだか、システムは暗黙に記憶する。"],
["爪が折れた","三本","のテープと、爪が折れていない","三本","のテープが用意されている。"],
["キミは、明示的に、",["読出","LOAD"],"したり、",["書出","SAVE"],"したりできる。"],
]],
// index: 8
[{speaker:"narrator",adjacencies:[]},[
[["自動","AUTO"],"再生すると、選択肢が示されるまで、あるいは、キミがなんらか入力するまで、テクストと",["音声","ボイス"],"が順番に再生されていく。"],
]],
// index: 9
[{speaker:"narrator",jump:13,adjacencies:[]},[
[["高速","SKIP"],"再生も似たようなものだけど、",["音声","ボイス"],"を再生しない。"],
["一秒に十行、素早くテクストをつらつら書きつらねる。"],
["システム設定でチェックを入れるまで、未読の段落はスキップされない。"],
]],
// index: 10
[{speaker:"narrator",choices:[
{choice:["ツイッターで質問する"],action:async($,ctx)=>{await ctx.sender.twitter();},barcode:"Twitter",label:10},
{choice:["マシュマロで質問する"],action:async($,ctx)=>{await ctx.sender.marshmallow();},barcode:"Marshmallow",label:10},
{choice:["質問はない"],label:11},
],adjacencies:[]},[
["こんなところ。"],
["なにか質問ある？"],
]],
// index: 11
[{speaker:"narrator",finish:"title",adjacencies:[]},[
["それじゃあ、良き、終末を。"],
]],
// index: 12
[{speaker:"narrator",finish:"title",system:true,adjacencies:[]},[
["この",["時間線","タイムライン"],"に、過去はまだ存在していない。"],
]],
// index: 13
[{speaker:"narrator",jump:10,adjacencies:[]},[
["ホイールを過去方向に廻したり、指先を過去方向にフリックしたりすると、",["履歴","HISTORY"],"が表示される。"],
["そういえば、バックログって呼ぶ文化、あれ、なんだろうね。"],
["もしかしたら、背中の","バック","だったりして。"],
]],
// index: 14
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
[["履歴","ヒストリ"],"データを消去する。"],
["それ以外のデータにはさわらない。"],
["過去を消しさっていい？"],
]],
// index: 15
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"が、公開されたみたい。"],
["更新するために、","App Store","を開く？"],
]],
// index: 16
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"が、公開されたみたい。"],
["更新するために、","Playストア","を開く？"],
]],
],
total:12,
starts:[12,14,15,16],
labels:{
"チュートリアル":1,
"トロッコ滅亡":3,
"トロッコ犠牲":4,
"トロッコ択ばない":5,
"トロッコ終":6,
"質問":10,
"チュートリアル終":11,
"空の履歴":12,
"チュートリアル:ヒストリー":13,
},
dialogs:{
"system-reset-history":14,
"system-update-ios":15,
"system-update-android":16,
},
};

})();
