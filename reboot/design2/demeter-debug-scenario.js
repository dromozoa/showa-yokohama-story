(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index:1
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],label:7},
{choice:["第一節"],label:0},
],when:($,ctx)=>{
if((() => {
    ctx.hour = new Date().getHours();
    return 4 <= ctx.hour && ctx.hour < 10;
  })())return 2;
if(10 <= ctx.hour && ctx.hour < 18)return 3;
},music:"vi03"},[
["こんばんは、かな。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index:2
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],label:7},
{choice:["第一節"],label:0},
]},[
["おはよう。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index:3
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],label:7},
{choice:["第一節"],label:0},
]},[
["こんにちは、だね。"],
["キミがサブカルの",["初心者","ニュービィ"],"なら、チュートリアルを推奨。"],
[["古強者","ヴェテラン"],"ならば、おかえりなさい。昨日の戦場に。"],
["昭和横濱物語。"],
]],
// index:4
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
],when:($,ctx)=>{
if(ctx.game.visitedVerse3)return 6;
if(ctx.game.visitedVerse2)return 5;
},music:"vi03"},[
["第一節は、","一本道","の迷路。"],
["第二節と第三節は、まだ開放されていない。"],
]],
// index:5
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
{choice:["第二節"],label:0},
]},[
["第二節には、",["バッド","アングッド"],"エンドがあるので、気をつけて。"],
["それを択んだら、少しだけ間をおいて終わりがきます。"],
["第三節は、まだ開放されていない。"],
]],
// index:6
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
{choice:["第二節"],label:0},
{choice:["第三節"],label:0},
]},[
[["順番","シーケンシャル"],"にしか読むことができない","類","の、これは",["媒体","メディア"],"。"],
["昭和横濱物語。スティーブンによる福音書。最終節。"],
]],
// index:7
[{speaker:"danu",finish:"title",music:"vi03"},[
["良き、終末を。"],
]],
// index:8
[{speaker:"narrator",music:"diana21"},[
["文芸部の部室。"],
[["卓子","テーブル"],"を囲む少女たち。"],
["壊れかけの黒いラジオが",["雑音","ノイズ"],"を積みかさねていく。"],
]],
// index:9
[{speaker:"danu"},[
["ねえ、アリス。"],
["パパがいたってことはさ。"],
["アリスには、ママもいたわけだよね。"],
]],
// index:10
[{speaker:"alice"},[
["このセカイが道理をわきまえているなら、それが理屈だ。"],
]],
// index:11
[{speaker:"demeter",jump:14,when:($,ctx)=>{
if(ctx.game.father === 1)return 12;
if(ctx.game.father === 3)return 13;
}},[
["先輩のお父さんは、フィリップ・マーロウを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:12
[{speaker:"demeter",jump:14},[
["先輩のお父さんは、サム・スペードを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:13
[{speaker:"demeter",jump:14},[
["先輩のお父さんは、マイク・ハマーを名乗っていて。"],
["お母さんも、ソウルネームを持ってたんですか。"],
]],
// index:14
[{speaker:"alice",start:"preview"},[
["まあ、な。"],
["——",["暴力の聖女","ゲバルト・ローザ"],"。"],
["やれやれ、品性のなさにかけてはどっこいどっこいだな。"],
["破れ鍋に綴じ蓋だったのかもしれないが。"],
]],
// index:15
[{speaker:"narrator",finish:"title"},[
["昭和横濱物語","'69","。"],
["開発未定。"],
]],
],
labels:{
"ニューゲーム":1,
"おはよう":2,
"こんにちは":3,
"節選択":4,
"節選択2":5,
"節選択3":6,
"チュートリアル":7,
"プレビュー":8,
"サム・スペード":12,
"マイク・ハマー":13,
"ゲバルト・ローザ":14,
},
dialogs:{
},
};

})();
