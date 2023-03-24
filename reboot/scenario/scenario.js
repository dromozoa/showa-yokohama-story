const paragraph1_when = ($,ctx) => {
// first.txt:10
if ((() => {
    ctx.hour = new Date().getHours();
    return 4 <= ctx.hour && ctx.hour < 10;
  })()) { return "おはよう"; }
// first.txt:13
if (10 <= ctx.hour && ctx.hour < 18) { return "こんにちは"; }
};

const paragraph4_when = ($,ctx) => {
// first.txt:42
if (ctx.game.visitedVerse3) { return "節選択3"; }
// first.txt:43
if (ctx.game.visitedVerse2) { return "節選択2"; }
};

// tutorial.txt:62
const paragraph16_choice1_action = ($,ctx) => {
ctx.sender.twitter();
};

// tutorial.txt:63
const paragraph16_choice2_action = ($,ctx) => {
ctx.sender.marshmallow();
};

// verse1.txt:75
const paragraph30_choice1_action = ($,ctx) => {
ctx.game.father = 1;;
};

// verse1.txt:78
const paragraph30_choice2_action = ($,ctx) => {
ctx.game.father = 2;;
};

// verse1.txt:81
const paragraph30_choice3_action = ($,ctx) => {
ctx.game.father = 3;;
};

// verse2.txt:11
const paragraph65_enter = ($,ctx) => {
ctx.game.visitedVerse2 = true;;
};

// verse2.txt:16
const paragraph65_leave = ($,ctx) => {
delete $.priest;
  delete $.engineer;
  delete $.activist;;
};

const paragraph67_when = ($,ctx) => {
// verse2.txt:25
if ($.priest && $.engineer && $.activist) { return "特殊攻撃作戦"; }
};

const paragraph68_when = ($,ctx) => {
// verse2.txt:35
if ($.priest) { return "聖職者済"; }
};

// verse2.txt:40
const paragraph68_leave = ($,ctx) => {
$.priest = true;
};

const paragraph92_when = ($,ctx) => {
// verse2.txt:153
if ($.engineer) { return "工学者済"; }
};

// verse2.txt:159
const paragraph92_leave = ($,ctx) => {
$.engineer = true;
};

const paragraph123_when = ($,ctx) => {
// verse2.txt:296
if ($.activist) { return "活動家済"; }
};

// verse2.txt:301
const paragraph123_leave = ($,ctx) => {
$.activist = true;
};

const paragraph124_when = ($,ctx) => {
// verse2.txt:303
if (ctx.system.unionSetting === "ろうくみ") { return "ろうくみ"; }
};

// verse3.txt:11
const paragraph187_enter = ($,ctx) => {
ctx.game.visitedVerse3 = true;;
};

// verse3.txt:502
const paragraph295_choice1_action = ($,ctx) => {
$.genesis = false;;
};

// verse3.txt:505
const paragraph295_choice2_action = ($,ctx) => {
$.genesis = true;;
};

const paragraph323_when = ($,ctx) => {
// verse3.txt:645
if ($.genesis) { return "創世記"; }
};

const paragraph354_when = ($,ctx) => {
// preview.txt:19
if (ctx.game.father === 1) { return "サム・スペード"; }
// preview.txt:20
if (ctx.game.father === 3) { return "マイク・ハマー"; }
};

