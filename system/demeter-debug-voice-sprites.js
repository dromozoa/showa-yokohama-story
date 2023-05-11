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
{"1":[0,1043],"2":[1443,1174],},
];

})();
