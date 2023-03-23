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
["キミが",["亞文化初年兵","サブカル・ヌーブ"],"だったら、チュートリアルを推奨。"],
[["物語文法","ノベルゲーム"],"にくわしい",["古強者","ヴェテラン"],"なら、おかえりなさい。"],
]],
// index:2
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],label:7},
{choice:["第一節"],label:0},
]},[
["おはよう、かな。"],
["キミが",["亞文化初年兵","サブカル・ヌーブ"],"だったら、チュートリアルを推奨。"],
[["物語文法","ノベルゲーム"],"にくわしい",["古強者","ヴェテラン"],"なら、おかえりなさい。"],
]],
// index:3
[{speaker:"narrator",choices:[
{choice:["チュートリアル"],label:7},
{choice:["第一節"],label:0},
]},[
["こんにちは、かな。"],
["キミが",["亞文化初年兵","サブカル・ヌーブ"],"だったら、チュートリアルを推奨。"],
[["物語文法","ノベルゲーム"],"にくわしい",["古強者","ヴェテラン"],"なら、おかえりなさい。"],
]],
// index:4
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
],when:($,ctx)=>{
if(ctx.game.visitedVerse3)return 6;
if(ctx.game.visitedVerse2)return 5;
},music:"vi03"},[
["頭出しの必要はなかったね。"],
["第一節は","一本道","の迷路だから、漫然と進んで次の","節","にたどりつけるはず。"],
]],
// index:5
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
{choice:["第二節"],label:0},
]},[
["第二節には",["バッド","アングッド"],"エンドがあるので、気をつけて。"],
["それを択んだら、少しだけ間をおいて終わりがきます。"],
]],
// index:6
[{speaker:"narrator",choices:[
{choice:["第一節"],label:0},
{choice:["第二節"],label:0},
{choice:["第三節"],label:0},
]},[
[["順番","シーケンシャル"],"にしか読むことができない","類","の、これは",["媒体","メディア"],"だから。"],
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
// index:16
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["システム設定とコンポーネント設定を、工場出荷状態に戻す。"],
["本当に設定を戻していい？"],
]],
// index:17
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["セーブデータを全部削除して、タイトルに戻る。"],
["実績データと既読データは、そのまま。"],
["本当にセーブデータを消していい？"],
]],
// index:18
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["頭出し用の信号が記録されている。"],
["このテープでは既読の","節","を択べるようだ。"],
["選択する？"],
]],
// index:19
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["このテープにはチュートリアルが記録されている。"],
["チュートリアルを開始する？"],
]],
// index:20
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["この",["因果","テープ"],"は、捻れて捩れて絡まりあっている。"],
["この",["運命","テープ"],"は、再生できない。"],
["今のところは。"],
]],
// index:21
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["年代物のテープが修復された。"],
["正常に読めるかは未知数。"],
["再生してみる？"],
]],
// index:22
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:23
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:24
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index:25
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["このテープはからっぽだ。"],
["なにも記録されていない。"],
]],
// index:26
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["一巻","めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:27
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["二巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:28
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},]},[
["三巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index:29
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},]},[
["いまではない、いつか。"],
["絡まりあった因果がほどけた。"],
["ここではない、どこか。"],
["捻れた運命がときはなたれた。"],
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
"system-reset-system":16,
"system-reset-save":17,
"load-tape-select":18,
"load-tape-tutorial":19,
"load-tape-broken":20,
"load-tape-preview":21,
"load-tape-save1":22,
"load-tape-save2":23,
"load-tape-save3":24,
"load-tape-empty":25,
"save-tape-save1":26,
"save-tape-save2":27,
"save-tape-save3":28,
"credits-tape-preview":29,
},
};

})();
