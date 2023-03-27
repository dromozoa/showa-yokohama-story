(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.trophies) {
  return;
}

D.trophies = [
{key:"newgames",name:"どんなときも。",description:"朝・昼・晩にニューゲームした。"},
{key:"sender",name:"今夜はブギー・バック",description:"メッセージ送信画面を開いた。"},
{key:"orientation",name:"ラブリー",description:"縦長画面と横長画面の両方で表示した。"},
{key:"kcode",name:"強い気持ち・強い愛",description:"タイトル画面でコナミコマンドを入力した。"},
{key:"elvis",name:"WOW WAR TONIGHT",description:"再熱望を択んだ。"},
{key:"half",name:"空と君のあいだに",description:"段落既読率が五割に達した。"},
{key:"preview",name:"アジアの純真",description:"予告を開放した。"},
{key:"ends",name:"さよなら人類",description:"すべてのエンドにたどりついた。"},
{key:"doe",name:"残酷な天使のテーゼ",description:"全セーブデータを削除して予告を見た。"},
{key:"full",name:"それが大事",description:"全段落を読みおえた。"},
];

})();
