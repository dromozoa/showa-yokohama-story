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
"select":[4693,1064],
};

})();
