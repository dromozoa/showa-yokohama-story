(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index:1
[{speaker:"danu",finish:"title",music:"vi03"},[
["良き、終末を。"],
]],
// index:2
[{speaker:"narrator",music:"diana21"},[
["文芸部の部室。"],
[["卓子","テーブル"],"を囲む少女たち。"],
["壊れかけの黒いラジオが",["雑音","ノイズ"],"を積みかさねていく。"],
]],
// index:3
[{speaker:"danu"},[
["ねえ、アリス。"],
["パパがいたってことはさ。"],
["アリスには、ママもいたわけだよね。"],
]],
// index:4
[{speaker:"alice"},[
["このセカイが道理をわきまえているなら、それが理屈だ。"],
]],
// index:5
[{speaker:"demeter",jump:8,when:($,ctx)=>{
if(ctx.game.father === 1)return 6;
if(ctx.game.father === 3)return 7;
}},[
["先輩のお父さんは、フィリップ・マーロウを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:6
[{speaker:"demeter",jump:8},[
["先輩のお父さんは、サム・スペードを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:7
[{speaker:"demeter",jump:8},[
["先輩のお父さんは、マイク・ハマーを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:8
[{speaker:"alice",start:"preview"},[
["まあ、な。"],
["——",["暴力の聖女","ゲバルト・ローザ"],"。"],
["やれやれ、品性のなさにかけてはどっこいどっこいだな。"],
["破れ鍋に綴じ蓋だったのかもしれないが。"],
]],
// index:9
[{speaker:"narrator",finish:"title"},[
["昭和横濱物語","'69","。"],
["開発未定。"],
]],
],
labels:{
"チュートリアル":1,
"プレビュー":2,
"サム・スペード":6,
"マイク・ハマー":7,
"ゲバルト・ローザ":8,
},
dialogs:{
},
};

})();
