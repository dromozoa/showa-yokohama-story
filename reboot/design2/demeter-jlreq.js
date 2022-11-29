(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.jlreq) {
  return;
}
D.jlreq = {};

D.jlreq.canRubyOverhang = c => {
  if (c < 8218) {
    if (c < 94) {
      if (c < 47) {
        if (c < 44) {
          return c > 39 && c < 42;
        } else {
          return c < 45 || c > 45;
        }
      } else {
        if (c < 91) {
          return c > 57 && c < 60;
        } else {
          return c < 92 || c > 92;
        }
      }
    } else {
      if (c < 172) {
        if (c < 125) {
          return c > 122 && c < 124;
        } else {
          return c < 126 || c > 170;
        }
      } else {
        if (c < 8212) {
          return c > 186 && c < 188;
        } else {
          return c < 8213 || c > 8215;
        }
      }
    }
  } else {
    if (c < 12314) {
      if (c < 10631) {
        if (c < 8229) {
          return c > 8219 && c < 8222;
        } else {
          return c < 8231 || c > 10628;
        }
      } else {
        if (c < 12296) {
          return c > 12288 && c < 12291;
        } else {
          return c < 12306 || c > 12307;
        }
      }
    } else {
      if (c < 12342) {
        if (c < 12319) {
          return c > 12316 && c < 12318;
        } else {
          return c < 12320 || c > 12338;
        }
      } else {
        if (c < 12449) {
          return c > 12352 && c < 12439;
        } else {
          if (c < 12784) {
            return c < 12541;
          } else {
            return c < 12800;
          }
        }
      }
    }
  }
};

D.jlreq.testCanRubyOverhang = () => {
  const fn = D.jlreq.canRubyOverhang
  const ranges = [
    { i: 0x0000, j: 0x0027, v: false },
    { i: 0x0028, j: 0x0029, v: true },
    { i: 0x002A, j: 0x002B, v: false },
    { i: 0x002C, j: 0x002C, v: true },
    { i: 0x002D, j: 0x002D, v: false },
    { i: 0x002E, j: 0x002E, v: true },
    { i: 0x002F, j: 0x0039, v: false },
    { i: 0x003A, j: 0x003B, v: true },
    { i: 0x003C, j: 0x005A, v: false },
    { i: 0x005B, j: 0x005B, v: true },
    { i: 0x005C, j: 0x005C, v: false },
    { i: 0x005D, j: 0x005D, v: true },
    { i: 0x005E, j: 0x007A, v: false },
    { i: 0x007B, j: 0x007B, v: true },
    { i: 0x007C, j: 0x007C, v: false },
    { i: 0x007D, j: 0x007D, v: true },
    { i: 0x007E, j: 0x00AA, v: false },
    { i: 0x00AB, j: 0x00AB, v: true },
    { i: 0x00AC, j: 0x00BA, v: false },
    { i: 0x00BB, j: 0x00BB, v: true },
    { i: 0x00BC, j: 0x2013, v: false },
    { i: 0x2014, j: 0x2014, v: true },
    { i: 0x2015, j: 0x2017, v: false },
    { i: 0x2018, j: 0x2019, v: true },
    { i: 0x201A, j: 0x201B, v: false },
    { i: 0x201C, j: 0x201D, v: true },
    { i: 0x201E, j: 0x2024, v: false },
    { i: 0x2025, j: 0x2026, v: true },
    { i: 0x2027, j: 0x2984, v: false },
    { i: 0x2985, j: 0x2986, v: true },
    { i: 0x2987, j: 0x3000, v: false },
    { i: 0x3001, j: 0x3002, v: true },
    { i: 0x3003, j: 0x3007, v: false },
    { i: 0x3008, j: 0x3011, v: true },
    { i: 0x3012, j: 0x3013, v: false },
    { i: 0x3014, j: 0x3019, v: true },
    { i: 0x301A, j: 0x301C, v: false },
    { i: 0x301D, j: 0x301D, v: true },
    { i: 0x301E, j: 0x301E, v: false },
    { i: 0x301F, j: 0x301F, v: true },
    { i: 0x3020, j: 0x3032, v: false },
    { i: 0x3033, j: 0x3035, v: true },
    { i: 0x3036, j: 0x3040, v: false },
    { i: 0x3041, j: 0x3096, v: true },
    { i: 0x3097, j: 0x30A0, v: false },
    { i: 0x30A1, j: 0x30FC, v: true },
    { i: 0x30FD, j: 0x31EF, v: false },
    { i: 0x31F0, j: 0x31FF, v: true },
    { i: 0x3200, j: 0x10FFFF, v: false },
  ];
  console.log("start");
  let n = 0;
  ranges.forEach(range => {
    for (let code = range.i; code <= range.j; ++code) {
      const v = fn(code)
      console.assert(v === range.v, range, code, v);
      ++n;
    }
  });
  console.log(n);
  console.assert(n === 0x110000, ranges);
  console.log("end");
};

})();
