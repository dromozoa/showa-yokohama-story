(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index: 1
[{speaker:"narrator",music:"diana21",place:"文芸部部室",background:"モノクローム",adjacencies:[2]},[
["文芸部の部室。"],
["壊れかけの黒いラジオから、頭脳警察が流れている。"],
["都市地図が広げられた",["卓子","テーブル"],"を囲む少女たち。"],
]],
// index: 2
[{speaker:"danu",adjacencies:[3]},[
["ねえ、アリス。"],
["パパがいたってことはさ。"],
["アリスには、ママもいたわけだよね。"],
]],
// index: 3
[{speaker:"alice",adjacencies:[4,7,6,8]},[
["このセカイが道理をわきまえているならば。"],
["そんなことは、期待するべくもないが。"],
]],
// index: 4
[{speaker:"danu",when:async($,ctx)=>{
if(ctx.game.father === "サム・スペード")return 7;
if(ctx.game.father === "フィリップ・マーロウ")return 6;
if(ctx.game.father === "マイク・ハマー")return 8;
},enter:async($,ctx)=>{ctx.trophy("doe");},adjacencies:[5]},[
["ジョン・ドゥ","と","ジェーン・ドゥ","から産まれてしまった、名づけられなかった子供たちがアタシたちだとしたら。"],
]],
// index: 5
[{speaker:"alice",jump:14,adjacencies:[14]},[
["天照","機関を出奔した人造魔人。"],
["量産型天皇霊を","降ろした","十三人の聖女の最後のひとり。"],
[["暴力の聖女","ゲバルト・ローザ"],"と",["字名","あざな"],"された女。"],
["かつてボクの母だった人間だ。"],
]],
// index: 6
[{speaker:"demeter",jump:9,adjacencies:[9]},[
["先輩のお父さんって、フィリップ・マーロウを名乗ってたんでしたっけ。"],
["お母さんも、ダサい",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 7
[{speaker:"demeter",jump:9,adjacencies:[9]},[
["先輩のお父さんって、サム・スペードを名乗ってたんでしたっけ。"],
["お母さんも、趣味の悪い",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 8
[{speaker:"demeter",jump:9,adjacencies:[9]},[
["先輩のお父さんって、マイク・ハマーを名乗ってたんでしたっけ。いや、あれれ。","濱","マイクのほうだったかな。"],
["お母さんも、野暮ったい",["偽名","ソウルネーム"],"を持ってたんですか。"],
]],
// index: 9
[{speaker:"alice",adjacencies:[10]},[
["いってくれるじゃないか。"],
["やれやれ。ソウルネーム——",["暴力の聖女","ゲバルト・ローザ"],"。"],
["品性のなさにかけては、父も母もどっこいどっこいだな。"],
["破れ鍋に綴じ","蓋","だったのかもしれないが。"],
]],
// index: 10
[{speaker:"demeter",adjacencies:[11]},[
["屍都の女王も、たいがい。"],
]],
// index: 11
[{speaker:"alice",adjacencies:[12]},[
["ボ、ボ、ボク","は、自ら名乗ってるわけじゃないからセーフ。"],
]],
// index: 12
[{speaker:"danu",adjacencies:[13]},[
["アタシってば、自称なんだけど。"],
]],
// index: 13
[{speaker:"demeter",adjacencies:[14]},[
["姐さんはいいんです。"],
]],
// index: 14
[{speaker:"alice",adjacencies:[15]},[
["そんなことより、",["仕事","ビズ"],"の話だ。"],
]],
// index: 15
[{speaker:"danu",adjacencies:[16]},[
["ねぇ、あのコ、泣いてた。助けてって。"],
["友達の友達の友達なんだけど。"],
["両親が偽メシア教カルトらしくてさ。"],
]],
// index: 16
[{speaker:"demeter",adjacencies:[17]},[
["最近、",["アシッド","LSD"],"ばらまいてる、あ",["奴","いつ"],"ら","。"],
["各方面から絶賛睨まれ発生中。"],
["武装はせいぜい",["黒星","ヘイシン"],"くらい。"],
]],
// index: 17
[{speaker:"alice",adjacencies:[18]},[
["そのコを","助","ける。"],
["しかるのち、撃滅する。"],
["いつもどおり、最大の火力をもって。"],
["いつもどおりの単純な",["仕事","ラン"],"だ。"],
]],
// index: 18
[{speaker:"narrator",adjacencies:[19]},[
["少女たちが去った部室。"],
["窓からさしこむ、あえやかな月の光。"],
["ラジオがささやく",["雑音","ノイズ"],"のなか、遠く、その声は聴こえた。"],
]],
// index: 19
[{speaker:"rosa",start:"preview",place:"一般設計学研究所建設予定地",adjacencies:[20]},[
["こちらは、自由ラジオ横濱",["前線","フロント"],"。"],
["ライシャワーが死んだセカイ線、バリケードの裡から、あの山岳",["根拠地","ベース"],"で産まれてしまった子供たちへ。"],
["聴こえてるかな。"],
]],
// index: 20
[{speaker:"rosa",adjacencies:[21]},[
["城市","が",["叢林","ジャングル"],"を","包圍","する時。"],
["城市","もまた",["叢林","ジャングル"],"に","包圍","されてる。"],
["聴こえてるんでしょ。"],
]],
// index: 21
[{speaker:"rosa",adjacencies:[22]},[
["子供たち。聴こえているならば。"],
["母が見つけられなかった、この国の戦後にさよならを告げる方法を見つけておくれ。"],
[["さよなら","アスタ・ルエゴ"],"、",["ヤルタ","Y"],"・",["ポツダム","P"],["体制","レジーム"],"。"],
]],
// index: 22
[{speaker:"rosa",adjacencies:[23]},[
["それは、父殺しの物語。"],
["それは、母殺しの物語。"],
["さよならを","いうのは","わずかのあいだ死ぬことだから。"],
]],
// index: 23
[{speaker:"narrator",enter:async($,ctx)=>{ctx.game.visitedSixtyNine = true;},finish:"title",adjacencies:[]},[
["三十八度線上空で消息を","絶った","日航","三百五十一便に、",["暴力の聖女","ゲバルト・ローザ"],"が搭乗していた","と",["中央情報局","ラングレー"],"は報告している。"],
[["予告","USODESU"],"。——昭和横濱物語","'69","。"],
]],
// index: 24
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["タイトルに戻る？"],
]],
// index: 25
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["システム設定とコンポーネント設定を、工場出荷状態に戻す。"],
["本当に設定を戻していい？"],
]],
// index: 26
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["全セーブデータを削除して、タイトルに戻る。"],
["実績データと既読データは、そのまま。"],
["本当にセーブデータを消していい？"],
]],
// index: 27
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["頭出し用の信号が記録されている。"],
["このテープでは既読の","節","を択べる。"],
["選択する？"],
]],
// index: 28
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["このテープにはチュートリアルが記録されている。"],
["チュートリアルをはじめる？"],
]],
// index: 29
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["この",["因果","テープ"],"は、捻れて捩れて絡まりあっている。"],
["この",["運命","テープ"],"は、再生できない。"],
["今のところは。"],
]],
// index: 30
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["年代物のテープが修復された。"],
["正常に読めるかは未知数。"],
["再生してみる？"],
]],
// index: 31
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["一巻","めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 32
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["二巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 33
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["三巻めのテープの",["読出","ロード"],"準備完了。"],
["再生する？"],
]],
// index: 34
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["このテープはからっぽだ。"],
["なにも記録されていない。"],
]],
// index: 35
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["一巻","めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 36
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["二巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 37
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["三巻めのテープへの",["書込","セーブ"],"準備完了。"],
["保存する？"],
]],
// index: 38
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["いまではない、いつか。"],
["絡まりあった因果がほどけた。"],
["ここではない、どこか。"],
["捻れた運命がときはなたれた。"],
]],
// index: 39
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"を検出。"],
["反映のため、システムは",["再読込","リロード"],"を要請。"],
["更新していい？"],
]],
// index: 40
[{speaker:"narrator",system:true,dialog:[{choice:"はい",result:"yes"},{choice:"いいえ",result:"no"},],adjacencies:[]},[
["物語の新しい",["版","バージョン"],"を検出。"],
["反映のため、システムは",["再読込","リロード"],"を要請。"],
["タイトルに戻って、更新していい？"],
]],
// index: 41
[{speaker:"narrator",system:true,dialog:[{choice:"了解",result:"ok"},],adjacencies:[]},[
["物語の並列起動を検出。"],
["データの整合性をたもてなくなる可能性あり。"],
["ただひとつの起動を推奨。"],
]],
],
total:23,
starts:[1,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],
labels:{
"プレビュー":1,
"フィリップ・マーロウ":6,
"サム・スペード":7,
"マイク・ハマー":8,
"ゲバルト・ローザ":9,
"ゲバルト・ローザ終":14,
},
dialogs:{
"system-back-to-title":24,
"system-reset-system":25,
"system-reset-save":26,
"load-tape-select":27,
"load-tape-tutorial":28,
"load-tape-broken":29,
"load-tape-preview":30,
"load-tape-save1":31,
"load-tape-save2":32,
"load-tape-save3":33,
"load-tape-empty":34,
"save-tape-save1":35,
"save-tape-save2":36,
"save-tape-save3":37,
"credits-tape-preview":38,
"system-update-title":39,
"system-update":40,
"system-multiple":41,
},
};

})();
