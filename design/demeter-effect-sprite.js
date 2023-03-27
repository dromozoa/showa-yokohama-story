(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.effectSprite) {
  return;
}

D.effectSprite = {
"beep":[0,1063],
"cancel":[1463,1011],
"select":[2873,1064],
};

})();
