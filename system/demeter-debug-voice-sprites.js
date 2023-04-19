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
{"1":[0,6043],},
{"1":[0,2104],"2":[2504,1883],"3":[4787,2224],},
{"1":[0,2104],"2":[2504,3259],"3":[6163,2915],},
{"1":[0,2083],"2":[2483,2483],"3":[5366,1160],},
];

})();
