// Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
//
// This file is part of 昭和横濱物語.
//
// 昭和横濱物語 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// 昭和横濱物語 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.includeGuard) {
  return;
}
D.includeGuard = true;

//-------------------------------------------------------------------------

D.requestAnimationFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

D.numberToCssPixels = v => Math.abs(v) < 0.00005 ? "0" : v.toFixed(4).replace(/\.?0*$/, "px");

const escapeHtmlTable = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

D.escapeHtml = s => s.replace(/[&<>"']/g, match => escapeHtmlTable[match]);

//-------------------------------------------------------------------------

let bootException;
let booted;
let bootedFutures = [];

D.boot = async () => {
  return new Promise((resolve, reject) => {
    if (booted) {
      if (bootException === undefined) {
        resolve();
      } else {
        reject(bootException);
      }
    } else {
      bootedFutures.push({ resolve: resolve, reject: reject });
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    initializeInternalRoot();
    await Promise.all([ checkKerning() ]);
  } catch (e) {
    bootException = e;
  }
  booted = true;

  if (bootException === undefined) {
    bootedFutures.forEach(future => future.resolve());
  } else {
    bootedFutures.forEach(future => future.reject(bootException));
  }
  bootedFutures = undefined;
}, { once: true });

//-------------------------------------------------------------------------

let internalRoot;
let internalCanvas;

const initializeInternalRoot = () => {
  const rootNode = document.createElement("div");
  rootNode.style.position = "absolute";
  rootNode.style.top = "-1989px";
  rootNode.style.left = "-6417px";
  document.body.append(rootNode);
  internalRoot = rootNode.attachShadow({ mode: "closed" });
  internalCanvas = internalRoot.appendChild(document.createElement("canvas"));
};

//-------------------------------------------------------------------------

// Showa Yokohama Storyフォントは
//   U+E001: 800/1000
//   U+E002: 900/1000
// という寸法を持ち、-300/1000のカーニングが設定されている。フォントサイズが
// 100pxのとき、文字列"\uE001\uE002"の幅は
//   カーニング有効時: 140px
//   カーニング無効時: 170px
// になる。

const checkKerning = async () => {
  const index = [...document.fonts].findIndex(fontFace => /Showa Yokohama Story/.test(fontFace.family));
  if (index === -1) {
    throw new Error("font-face 'Showa Yokohama Story' not found");
  }
  if ((await D.loadFontFace(index, 1000)).status !== "loaded") {
    throw new Error("font-face 'Showa Yokohama Story' not loaded");
  }

  const context = internalCanvas.getContext("2d");
  context.font = "100px 'Showa Yokohama Story'";
  D.featureKerning = Math.abs(context.measureText("\uE001\uE002").width - 140) < 1;
};

//-------------------------------------------------------------------------

// Firefox 107でFontFace.load()の返り値が（FontFace.loadedも）決定されない場合
// があった。FontFaceが新しい別のオブジェクトにさしかえられ、プロミスが迷子にな
// っているように見えた。そこで、document.facesの監視のためにポーリングする。

D.loadFontFace = async (index, timeout) => {
  const fontFace = [...document.fonts][index];
  if (fontFace.status === "loaded") {
    return { status: "loaded", elapsed: 0 };
  }
  fontFace.load();

  const start = await D.requestAnimationFrame();
  if ([...document.fonts][index].status === "loaded") {
    return { status: "loaded", elapsed: 0 };
  }

  if (!timeout || timeout < 0) {
    timeout = Infinity;
  }

  while (true) {
    const elapsed = await D.requestAnimationFrame() - start;
    if ([...document.fonts][index].status === "loaded") {
      return { status: "loaded", elapsed: elapsed };
    }
    if (timeout < elapsed) {
      return { status: "timeout", elapsed: elapsed };
    }
  }
};

D.loadFontFaces = async (timeout) => {
  const fontFaces = [...document.fonts].filter(fontFace => fontFace.status !== "loaded");
  if (fontFaces.length === 0) {
    return { status: "loaded", elapsed: 0 };
  }
  fontFaces.forEach(fontFace => fontFace.load());

  const start = await D.requestAnimationFrame();
  if ([...document.fonts].every(fontFace => fontFace.status === "loaded")) {
    return { status: "loaded", elapsed: 0 };
  }

  if (!timeout || timeout < 0) {
    timeout = Infinity;
  }

  while (true) {
    const elapsed = await D.requestAnimationFrame() - start;
    if ([...document.fonts].every(fontFace => fontFace.status === "loaded")) {
      return { status: "loaded", elapsed: elapsed };
    }
    if (timeout < elapsed) {
      return { status: "timeout", elapsed: elapsed };
    }
  }
};

//-------------------------------------------------------------------------

const isWhiteSpace = u => (
  // " " (SPACE)
  u === 0x20
  // "\t" (CHARACTER TABULATION)
  || u === 0x09
  // "\n" (LINE FEED)
  || u === 0x0A
  // "\r" (CARRIAGE RETURN)
  || u === 0x0D
) ? 1 : 0;

const canBreak = (u, v) => (
  // 行頭禁則
  D.jlreq.isLineStartProhibited(v)
  // 行末禁則
  || D.jlreq.isLineEndProhibited(u)
  // 連続するダッシュ・三点リーダ・二点リーダ
  || u === v && (u === 0x2014 || u === 0x2026 || u === 0x2025)
  // くの字
  || (u === 0x3033 || u === 0x3034) && v === 0x3035
  // 前置省略記号とアラビア数字
  || D.jlreq.isPrefixedAbbreviation(u) && 0x30 <= v && v <= 0x39
  // アラビア数字と後置省略記号
  || 0x30 <= u && u <= 0x39 && D.jlreq.isPostfixedAbbreviation(v)
  // 連続する欧文用文字
  || D.jlreq.isWesternCharacter(u) && D.jlreq.isWesternCharacter(v)
) ? 0 : 1;

//-------------------------------------------------------------------------

const parseChars = (source, fontSize, font) => {
  const context = internalCanvas.getContext("2d");
  context.font = D.numberToCssPixels(fontSize) + " " + font;
  return [...source].map(char => {
    const code = char.codePointAt(0);
    const width = context.measureText(char).width;
    return {
      char: char,
      code: code,
      width: width,
      advance: width,
      kerning: 0,
      spacingBudget: 0,
      spacingBudgeted: 0,
      spacingFallback: 0,
      spacing1: 0,
      spacing2: 0,
      x: undefined,
      rubyConnection: undefined,
    };
  });
};

const updateChars = (source, fontSize, font) => {
  const context = internalCanvas.getContext("2d");
  context.font = D.numberToCssPixels(fontSize) + " " + font;
  source.forEach((u, i) => {
    const v = source[i + 1];
    if (v) {
      u.advance = context.measureText(u.char + v.char).width - v.width;
      u.kerning = u.width - u.advance;
      u.spacingBudget = fontSize * 0.25 * (isWhiteSpace(u.code) || canBreak(u.code, v.code));
    } else {
      u.spacingBudget = fontSize * 0.25;
    }
  });
};

const parseParagraphBreakTable = {
  "BR": true,
  "DIV": true,
  "P": true,
};

D.parseParagraph = (source, fontSize, font) => {
  const rubyFontSize = fontSize * 0.5;
  const result = [];
  let text;
  let item;

  const parse = node => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (node.tagName === "RT") {
          updateChars(item.ruby = parseChars(node.textContent, rubyFontSize, font), rubyFontSize, font);
        } else {
          node.childNodes.forEach(parse);
          if (parseParagraphBreakTable[node.tagName]) {
            text = undefined;
          }
        }
        break;
      case Node.TEXT_NODE:
        if (!text) {
          result.push(text = []);
        }
        text.push(item = {
          main: parseChars(node.textContent, fontSize, font),
          rubyOverhangPrev: 0,
          rubyOverhangNext: 0,
        });
        break;
    };
  };
  parse(source);

  result.forEach(text => updateChars(text.map(item => item.main).flat(), fontSize, font));

  return result;
};

//-------------------------------------------------------------------------

const setSpacingBudgeted = (source, request, tolerance) => {
  const remaining = source.reduce((acc, u) => acc + u.spacingBudget, 0);
  if (remaining <= request) {
    source.forEach(u => u.spacingBudgeted = u.spacingBudget);
    return request - remaining;
  }

  let spacing = request / source.length;
  if (spacing <= source.reduce((acc, u) => Math.min(acc, u.spacingBudget), Infinity)) {
    source.forEach(u => u.spacingBudgeted = spacing);
    return 0;
  }
  let lower = spacing;
  let upper = source.reduce((acc, u) => Math.max(acc, u.spacingBudget), -Infinity);
  let actual;

  for (let cycle = 0; cycle < 16; ++cycle) {
    spacing = (lower + upper) * 0.5;
    actual = source.reduce((acc, u) => acc + Math.min(spacing, u.spacingBudget), 0);
    if (Math.abs(request - actual) <= tolerance) {
      break;
    } else if (request > actual) {
      lower = spacing;
    } else {
      upper = spacing;
    }
  }

  source.forEach(u => u.spacingBudgeted = Math.min(spacing, u.spacingBudget));
  return request - actual;
};

const setSpacingFallback = (source, request) => {
  const spacing = request / source.length;
  source.forEach(u => u.spacingFallback = spacing);
};

const setSpacingImpl = (source, request, tolerance) => {
  if (request > tolerance) {
    request = setSpacingBudgeted(source.filter(u => isWhiteSpace(u.code)), request, tolerance);
    if (request > tolerance) {
      request = setSpacingBudgeted(source.filter(u => !isWhiteSpace(u.code) && u.spacingBudget > 0), request, tolerance);
      if (request > tolerance) {
        setSpacingFallback(source, request);
      }
    }
  }
};

const setSpacing = (source, request, tolerance) => {
  setSpacingImpl(source, request, tolerance);
  source.forEach(u => {
    u.spacing1 = u.spacingBudgeted + u.spacingFallback;
    u.spacing2 = 0;
  });
};

const justifySpacing = (source, request, tolerance) => {
  const u = source.slice(-1)[0];
  u.spacingBudgeted = 0;
  u.spacingFallback = 0;
  setSpacingImpl(source.slice(0, -1), request, tolerance);
  source.forEach(u => {
    u.spacing1 = 0;
    u.spacing2 = u.spacingBudgeted + u.spacingFallback;
  });
};

//-------------------------------------------------------------------------

const addSpacingBudgeted = (source, request, tolerance) => {
  const remaining = source.reduce((acc, u) => acc + u.spacingBudget - u.spacingBudgeted, 0);
  if (remaining <= request) {
    source.forEach(u => u.spacingBudgeted = u.spacingBudget);
    return request - remaining;
  }

  let spacing = request / source.length;
  let lower = source.reduce((acc, u) => Math.min(acc, u.spacingBudgeted), Infinity) + spacing;
  let upper = source.reduce((acc, u) => Math.max(acc, u.spacingBudget), -Infinity);
  let actual;

  for (let cycle = 0; cycle < 16; ++cycle) {
    spacing = (lower + upper) * 0.5;
    actual = source.reduce((acc, u) => acc + Math.max(0, Math.min(spacing, u.spacingBudget) - u.spacingBudgeted), 0);
    if (Math.abs(request - actual) <= tolerance) {
      break;
    } else if (request > actual) {
      lower = spacing;
    } else {
      upper = spacing;
    }
  }

  source.forEach(u => u.spacingBudgeted = Math.max(Math.min(spacing, u.spacingBudget), u.spacingBudgeted));
  return request - actual;
};

const addSpacingFallback = (source, request, tolerance) => {
  let spacing = request / source.length;
  let lower = source.reduce((acc, u) => Math.min(acc, u.spacingFallback), Infinity) + spacing;
  let upper = source.reduce((acc, u) => Math.max(acc, u.spacingFallback), -Infinity) + spacing;

  for (let cycle = 0; cycle < 16; ++cycle) {
    spacing = (lower + upper) * 0.5;
    const actual = source.reduce((acc, u) => acc + Math.max(0, spacing - u.spacingFallback), 0);
    if (Math.abs(actual - request) <= tolerance) {
      break;
    } else if (actual > request) {
      upper = spacing;
    } else {
      lower = spacing;
    }
  }

  source.forEach(u => u.spacingFallback = Math.max(spacing, u.spacingFallback));
};

const addSpacing = (source, request, tolerance) => {
  if (request > tolerance) {
    request = addSpacingBudgeted(source.filter(u => isWhiteSpace(u.code)), request, tolerance);
    if (request > tolerance) {
      request = addSpacingBudgeted(source.filter(u => !isWhiteSpace(u.code) && u.spacingBudget > 0), request, tolerance);
      if (request > tolerance) {
        addSpacingFallback(source, request, tolerance);
      }
    }
  }
  source.forEach(u => u.spacing2 = u.spacingBudgeted + u.spacingFallback - u.spacing1);
};

//-------------------------------------------------------------------------

const getRubyOverhang = u => u && D.jlreq.canRubyOverhang(u.code) ? u.advance * 0.5 : 0;

const addAdvanceSpacing = (acc, u) => acc + u.advance + u.spacing1 + u.spacing2;

const updateItem = (prev, item, next, mainWidthFn) => {
  if (item.ruby) {
    const mainWidth = item.main.reduce(mainWidthFn || ((acc, u) => acc + u.advance), 0);
    const rubyWidth = item.ruby.reduce((acc, u) => acc + u.advance, 0);

    const rubyOverhangPrev = getRubyOverhang(prev && !prev.ruby && prev.main.slice(-1)[0]);
    const rubyOverhangNext = getRubyOverhang(next && !next.ruby && next.main[0]);
    const rubyOverhangSum = rubyOverhangPrev + rubyOverhangNext;
    const rubyOverhang = Math.max(0, Math.min(rubyWidth - mainWidth, rubyOverhangSum));
    const rubyOverhangRatio = rubyOverhangSum > 0 ? rubyOverhang / rubyOverhangSum : 0;

    const spacing = rubyWidth - mainWidth - rubyOverhang;
    setSpacing(spacing > 0 ? item.main : item.ruby, Math.abs(spacing), 0.25);

    item.rubyOverhangPrev = rubyOverhangPrev * rubyOverhangRatio;
    item.rubyOverhangNext = rubyOverhangNext * rubyOverhangRatio;
  } else {
    item.rubyOverhangPrev = 0;
    item.rubyOverhangNext = 0;
  }
};

const resetKerning = u => {
  u.advance = u.width;
  u.kerning = 0;
};

//-------------------------------------------------------------------------

// 改行「直前」の文字の位置を求める。
const breakMain = (source, maxWidth) => {
  // 行に入りきらない最初の文字の位置を求める。
  let advance = 0;
  const limit = source.findIndex(u => maxWidth < (advance += u.advance + u.spacing1) + u.kerning);
  // 空行が生成されても一文字は含める。
  if (limit < 1) {
    return source.length === 1 ? -1 : limit;
  }
  // 分割禁止規則を考慮して改行位置を求める。
  const index = source.slice(1, limit + 1).findLastIndex((v, i) => canBreak(source[i].code, v.code));
  // 行の末尾が空白の場合は次の行に送る。
  return index === -1 ? limit - 1 : Math.max(0, index - isWhiteSpace(source[index].code));
};

// 改行「直後」の文字の位置を求める。
const breakRuby = (source, maxWidth) => {
  // 文字の左右にアキを配分して、行に入りきらない最初の文字の位置を求める。
  let advance = 0;
  const limit = source.findIndex(u => maxWidth < (advance += u.advance + u.spacing1) + u.kerning - u.spacing1 * 0.5);
  // 分割禁止規則を考慮して改行位置を求める。
  const index = source.slice(1, limit + 1).findLastIndex((v, i) => canBreak(source[i].code, v.code));
  // 行の末尾が空白の場合は次の行に送る。
  return index === -1 ? limit : index - isWhiteSpace(source[index].code) + 1;
};

//-------------------------------------------------------------------------

D.composeText = (source, maxWidth) => {
  const result = [];
  let line1 = [...source];
  let line2 = [];

  while (true) {
    line1.forEach((item, i) => updateItem(line1[i - 1], item, line1[i + 1]));

    while (true) {
      let mainIndex = breakMain(line1.map(item => item.main).flat(), maxWidth);
      if (mainIndex === -1) {
        break;
      }
      const itemIndex = line1.findIndex(item => {
        if (mainIndex < item.main.length) {
          return true;
        } else {
          mainIndex -= item.main.length;
          return false;
        }
      });

      const item = line1[itemIndex];
      if (mainIndex === item.main.length - 1) {
        if (item.rubyOverhangNext > 0) {
          updateItem(line1[itemIndex - 1], item);
          continue;
        }
        resetKerning(item.main[mainIndex]);
        line2 = [ ...line1.splice(itemIndex + 1), ...line2 ];
        break;
      }

      const item1 = {
        main: item.main.slice(0, mainIndex + 1),
        rubyOverhangPrev: item.rubyOverhangPrev,
        rubyOverhangNext: 0,
      };
      resetKerning(item1.main[mainIndex]);

      const item2 = {
        main: item.main.slice(mainIndex + 1),
        rubyOverhangPrev: 0,
        rubyOverhangNext: item.rubyOverhangNext,
      };

      line2 = [ item2, ...line1.splice(itemIndex + 1), ...line2 ];
      line1.pop();
      line1.push(item1);

      if (item.ruby) {
        const index = breakRuby(item.ruby, item1.main.reduce((width, u) => width + u.advance + u.spacing1, 0) + item1.rubyOverhangPrev);
        if (index === -1) {
          item1.ruby = item.ruby;
        } else {
          if (index > 0) {
            item1.ruby = item.ruby.slice(0, index);
            resetKerning(item1.ruby[index - 1]);
          }

          // 行頭の空白を除去する。
          const ruby = item.ruby.slice(index);
          if (isWhiteSpace(ruby[0].code)) {
            ruby.shift();
          }
          if (ruby.length > 0) {
            item2.ruby = ruby;
          }
        }
      }

      updateItem(line1[itemIndex - 1], item1);
      break;
    }

    result.push(line1);
    if (line2.length === 0) {
      break;
    }

    // 行頭の空白を除去する。
    const item = line2[0];
    if (isWhiteSpace(item.main[0].code)) {
      if (item.main.length === 1) {
        if (!item.ruby) {
          line2.shift();
        }
      } else {
        item.main.shift();
      }
    }

    line1 = line2;
    line2 = [];
  }

  result.forEach((line, i) => {
    const isLastLine = i === result.length - 1;

    if (!isLastLine) {
      if (line.length === 1) {
        const item = line[0];
        justifySpacing(item.main, maxWidth - item.main.reduce((acc, u) => acc + u.advance, 0), 0.25);
        if (item.ruby) {
          justifySpacing(item.ruby, maxWidth - item.ruby.reduce((acc, u) => acc + u.advance, 0), 0.25);
        }
      } else {
        const buffer = line.map(item => item.main).flat();
        addSpacing(buffer.slice(0, -1), maxWidth - buffer.reduce((acc, u) => acc + u.advance + u.spacing1, 0), 0.25);
        line.forEach((item, j) => {
          if (item.ruby && item.main.reduce((acc, u) => acc + u.spacing2, 0) > 0) {
            updateItem(line[j - 1], item, line[j + 1], addAdvanceSpacing);
          }
        });
      }
    }

    // 文字の位置を計算する。
    let mainX = 0;
    line.forEach((item, j) => {
      const isLineStart = j === 0;
      const isLineEnd = !isLastLine && j === line.length - 1;
      const a = isLineStart ? 0 : isLineEnd ? 1 : 0.5;
      const b = 1 - a;

      let rubyX = mainX - item.rubyOverhangPrev;

      item.main.forEach(u => {
        u.x = mainX += u.spacing1 * a;
        mainX += u.advance + u.spacing1 * b + u.spacing2;
      });

      if (item.ruby) {
        item.ruby.forEach(u => {
          u.x = rubyX += u.spacing1 * a;
          rubyX += u.advance + u.spacing1 * b + u.spacing2;
        });

        let mainIndex = 0;
        let rubyIndex;
        [
          ...item.main.map((u, i) => {
            const v = item.main[i + 1];
            return { mainIndex: i, x: v ? (u.x + u.advance + v.x) * 0.5 : Infinity };
          }),
          ...item.ruby.map((u, i) => ({ rubyIndex: i, x: u.x + u.advance * 0.5 })),
        ].sort((a, b) => a.x - b.x).forEach(order => {
          if (order.mainIndex !== undefined) {
            if (rubyIndex !== undefined) {
              item.main[order.mainIndex].rubyConnection = rubyIndex;
              rubyIndex = undefined;
            }
            ++mainIndex;
          } else {
            item.ruby[order.rubyIndex].rubyConnection = mainIndex;
            if (rubyIndex === undefined) {
              rubyIndex = order.rubyIndex;
            }
          }
        });
      }
    });
  });

  return result;
};

//-------------------------------------------------------------------------

D.layoutText = (source, fontSize, lineHeight) => {
  const textNode = document.createElement("div");
  textNode.className = "demeter-text";
  textNode.style.lineHeight = D.numberToCssPixels(lineHeight);

  source.forEach(line => {
    const lineNode = textNode.appendChild(document.createElement("div"));

    let mainX = 0;
    line.forEach(item => {
      item.main.forEach((u, i)  => {
        const mainNode = lineNode.appendChild(document.createElement("span"));
        mainNode.style.marginLeft = D.numberToCssPixels(u.x - mainX);
        mainNode.style.width = D.numberToCssPixels(u.advance);

        const charNode = mainNode.appendChild(document.createElement("span"));
        charNode.textContent = u.char;

        mainX = u.x + u.advance;

        if (u.rubyConnection !== undefined) {
          const ruby = item.ruby.filter(ruby => ruby.rubyConnection === i);
          let rubyX = ruby[0].x;

          const rubyNode = mainNode.appendChild(document.createElement("div"));
          rubyNode.style.top = D.numberToCssPixels(fontSize * -0.75);
          rubyNode.style.left = D.numberToCssPixels(rubyX - u.x);

          ruby.forEach(u => {
            const charNode = rubyNode.appendChild(document.createElement("span"));
            charNode.style.marginLeft= D.numberToCssPixels(u.x - u.rubyX);
            charNode.style.width = D.numberToCssPixels(u.advance);
            charNode.textContent = u.char;

            rubyX = u.x + u.advance;
          });
        }
      });
    });
  });

  return textNode;
};

//-------------------------------------------------------------------------

})();
