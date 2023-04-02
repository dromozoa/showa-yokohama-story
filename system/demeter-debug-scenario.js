(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.scenario) {
  return;
}

D.scenario = {
paragraphs:[
// index: 1
[{speaker:"narrator",finish:"title",system:true,adjacencies:[]},[
["この",["時間線","タイムライン"],"に、過去はまだ存在していない。"],
]],
// index: 2
[{speaker:"narrator",jump:0,adjacencies:[]},[
["ホイールを過去方向に廻したり、指先を過去方向にフリックしたりすると、",["履歴","HISTORY"],"が表示される。"],
["そういえば、バックログって呼ぶ文化、あれ、なんだろうね。"],
["もしかしたら、背中のバックだったりして。"],
]],
],
total:1,
starts:[1],
labels:{
"空の履歴":1,
"チュートリアル:ヒストリー":2,
},
dialogs:{
},
};

})();
