(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.effectSprite) {
  return;
}

D.effectSprite = {
"alert":[0,1420],
"beep":[1820,1063],
"cancel":[3283,1011],
"focus":[4693,1049],
"select":[6141,1064],
"trophy":[7605,2427],
};

})();
