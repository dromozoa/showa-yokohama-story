const paragraph1_when = async ($, ctx) => {
// first.txt:12
if ((() => {
    ctx.hour = new Date().getHours();
    return 4 <= ctx.hour && ctx.hour < 10;
  })()) { return "おはよう"; }
// first.txt:13
if (10 <= ctx.hour && ctx.hour < 18) { return "こんにちは"; }
};

// first.txt:24
const paragraph1_enter = async ($, ctx) => {
ctx.game.newGameEvening = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };
};

// first.txt:39
const paragraph2_enter = async ($, ctx) => {
ctx.game.newGameMorning = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };
};

// first.txt:54
const paragraph3_enter = async ($, ctx) => {
ctx.game.newGameAfternoon = true;
  if (ctx.game.newGameMorning && ctx.game.newGameAfternoon && ctx.game.newGameEvening) {
    await ctx.trophy("newgames");
  };
};

const paragraph4_when = async ($, ctx) => {
// first.txt:64
if (ctx.game.visitedVerse3) { return "節選択3"; }
// first.txt:65
if (ctx.game.visitedVerse2) { return "節選択2"; }
};

// tutorial.txt:65
const paragraph16_choice1_action = async ($, ctx) => {
await ctx.sender.twitter();
};

// tutorial.txt:66
const paragraph16_choice2_action = async ($, ctx) => {
await ctx.sender.marshmallow();
};

// verse1.txt:81
const paragraph30_choice1_action = async ($, ctx) => {
ctx.game.father = "サム・スペード";;
};

// verse1.txt:84
const paragraph30_choice2_action = async ($, ctx) => {
ctx.game.father = "フィリップ・マーロウ";;
};

// verse1.txt:87
const paragraph30_choice3_action = async ($, ctx) => {
ctx.game.father = "マイク・ハマー";;
};

// verse1.txt:78
const paragraph30_enter = async ($, ctx) => {
delete ctx.game.father;;
};

// verse2.txt:15
const paragraph65_enter = async ($, ctx) => {
ctx.game.visitedVerse2 = true;
  delete $.priest;
  delete $.engineer;
  delete $.activist;;
};

const paragraph67_when = async ($, ctx) => {
// verse2.txt:24
if ($.priest && $.engineer && $.activist) { return "特殊攻撃作戦"; }
};

const paragraph68_when = async ($, ctx) => {
// verse2.txt:35
if ($.priest) { return "聖職者済"; }
};

// verse2.txt:143
const paragraph90_enter = async ($, ctx) => {
$.priest = true;
};

const paragraph92_when = async ($, ctx) => {
// verse2.txt:154
if ($.engineer) { return "工学者済"; }
};

// verse2.txt:288
const paragraph121_enter = async ($, ctx) => {
$.engineer = true;
};

const paragraph123_when = async ($, ctx) => {
// verse2.txt:299
if ($.activist) { return "活動家済"; }
};

const paragraph124_when = async ($, ctx) => {
// verse2.txt:306
if (ctx.system.unionSetting === "ろうくみ") { return "ろうくみ"; }
};

// verse2.txt:476
const paragraph161_enter = async ($, ctx) => {
$.activist = true;
};

// verse2.txt:542
const paragraph174_choice1_action = async ($, ctx) => {
ctx.trophy("elvis");
};

// verse2.txt:608
const paragraph185_enter = async ($, ctx) => {
ctx.game.visitedRevelation2 = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };
};

// verse3.txt:10
const paragraph187_enter = async ($, ctx) => {
ctx.game.visitedVerse3 = true;
};

// verse3.txt:506
const paragraph295_choice1_action = async ($, ctx) => {
$.genesis = false;;
};

// verse3.txt:509
const paragraph295_choice2_action = async ($, ctx) => {
$.genesis = true;;
};

// verse3.txt:581
const paragraph307_enter = async ($, ctx) => {
ctx.game.visitedRevelation3 = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };
};

const paragraph323_when = async ($, ctx) => {
// verse3.txt:657
if ($.genesis) { return "創世記"; }
};

// verse3.txt:755
const paragraph340_enter = async ($, ctx) => {
ctx.game.visitedGospel = true;
  ctx.game.unlockPreview = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };
};

// verse3.txt:810
const paragraph350_enter = async ($, ctx) => {
ctx.game.visitedGenesis = true;
  if (ctx.game.visitedRevelation2 && ctx.game.visitedRevelation3 && ctx.game.visitedGospel && ctx.game.visitedGenesis) {
    ctx.trophy("ends");
  };
};

const paragraph354_when = async ($, ctx) => {
// preview.txt:21
if (ctx.game.father === "サム・スペード") { return "サム・スペード"; }
// preview.txt:22
if (ctx.game.father === "フィリップ・マーロウ") { return "フィリップ・マーロウ"; }
// preview.txt:23
if (ctx.game.father === "マイク・ハマー") { return "マイク・ハマー"; }
};

// preview.txt:26
const paragraph354_enter = async ($, ctx) => {
ctx.trophy("doe");
};

// preview.txt:122
const paragraph373_enter = async ($, ctx) => {
ctx.game.visitedSixtyNine = true;
};

