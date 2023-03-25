const paragraph1_when = ($,ctx) => {
// first.txt:12
if ((() => {
    ctx.hour = new Date().getHours();
    return 4 <= ctx.hour && ctx.hour < 10;
  })()) { return "おはよう"; }
// first.txt:15
if (10 <= ctx.hour && ctx.hour < 18) { return "こんにちは"; }
};

const paragraph4_when = ($,ctx) => {
// first.txt:46
if (ctx.game.visitedVerse3) { return "節選択3"; }
// first.txt:47
if (ctx.game.visitedVerse2) { return "節選択2"; }
};

// tutorial.txt:63
const paragraph16_choice1_action = ($,ctx) => {
ctx.sender.twitter();
};

// tutorial.txt:64
const paragraph16_choice2_action = ($,ctx) => {
ctx.sender.marshmallow();
};

// verse1.txt:78
const paragraph30_choice1_action = ($,ctx) => {
ctx.game.father = "サム・スペード";;
};

// verse1.txt:81
const paragraph30_choice2_action = ($,ctx) => {
ctx.game.father = "フィリップ・マーロウ";;
};

// verse1.txt:84
const paragraph30_choice3_action = ($,ctx) => {
ctx.game.father = "マイク・ハマー";;
};

// verse2.txt:10
const paragraph65_enter = ($,ctx) => {
ctx.game.visitedVerse2 = true;
};

// verse2.txt:15
const paragraph65_leave = ($,ctx) => {
delete $.priest;
  delete $.engineer;
  delete $.activist;;
};

const paragraph67_when = ($,ctx) => {
// verse2.txt:24
if ($.priest && $.engineer && $.activist) { return "特殊攻撃作戦"; }
};

const paragraph68_when = ($,ctx) => {
// verse2.txt:35
if ($.priest) { return "聖職者済"; }
};

// verse2.txt:41
const paragraph68_leave = ($,ctx) => {
$.priest = true;
};

const paragraph92_when = ($,ctx) => {
// verse2.txt:154
if ($.engineer) { return "工学者済"; }
};

// verse2.txt:161
const paragraph92_leave = ($,ctx) => {
$.engineer = true;
};

const paragraph123_when = ($,ctx) => {
// verse2.txt:299
if ($.activist) { return "活動家済"; }
};

// verse2.txt:305
const paragraph123_leave = ($,ctx) => {
$.activist = true;
};

const paragraph124_when = ($,ctx) => {
// verse2.txt:307
if (ctx.system.unionSetting === "ろうくみ") { return "ろうくみ"; }
};

// verse2.txt:603
const paragraph185_leave = ($,ctx) => {
ctx.game.visitedRevelation2 = true;
};

// verse3.txt:10
const paragraph187_enter = ($,ctx) => {
ctx.game.visitedVerse3 = true;
};

// verse3.txt:506
const paragraph295_choice1_action = ($,ctx) => {
$.genesis = false;;
};

// verse3.txt:509
const paragraph295_choice2_action = ($,ctx) => {
$.genesis = true;;
};

// verse3.txt:576
const paragraph307_leave = ($,ctx) => {
ctx.game.visitedRevelation3 = true;
};

const paragraph323_when = ($,ctx) => {
// verse3.txt:650
if ($.genesis) { return "創世記"; }
};

// verse3.txt:747
const paragraph340_leave = ($,ctx) => {
ctx.game.visitedGospel = true;
  ctx.game.unlockPreview = true;;
};

// verse3.txt:797
const paragraph350_leave = ($,ctx) => {
ctx.game.visitedGenesis = true;
};

const paragraph354_when = ($,ctx) => {
// preview.txt:21
if (ctx.game.father === "サム・スペード") { return "サム・スペード"; }
// preview.txt:22
if (ctx.game.father === "フィリップ・マーロウ") { return "フィリップ・マーロウ"; }
// preview.txt:23
if (ctx.game.father === "マイク・ハマー") { return "マイク・ハマー"; }
};

// preview.txt:121
const paragraph373_leave = ($,ctx) => {
ctx.game.visitedSixtyNine = true;
};

