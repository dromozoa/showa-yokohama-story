/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.voiceSprites) {
  return;
}

D.voiceSprites = [
{"1":[0,2054],"2":[2454,1904],"3":[4758,1995],},
{"1":[0,795],},
{"1":[0,1083],},
{"1":[0,7163],},
{"1":[0,2368],},
];

})();
