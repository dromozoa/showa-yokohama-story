// Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.includeGuard) {
  return;
}
D.includeGuard = true;

//-------------------------------------------------------------------------

D.trace = (...params) => D.preferences.trace(...params);
D.isApp = (...params) => D.preferences.isApp(...params);
D.getAppVersion = (...params) => D.preferences.getAppVersion(...params);

D.useServiceWorker = () => !D.isApp() && navigator.serviceWorker;
D.useCacheStorage = () => !D.isApp() && globalThis.caches;
D.useFullscreen = () => !D.isApp() && D.getFullscreenElement;

//-------------------------------------------------------------------------

D.requestAnimationFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

D.setTimeout = (delay, ...params) => new Promise(resolve => setTimeout(resolve, delay, ...params));

D.numberToString = v => Math.abs(v) < 0.00005 ? "0" : v.toFixed(4).replace(/\.?0*$/, "");

D.numberToCss = (v, unit = "px") => D.numberToString(v) + unit;

D.toCssColor = (r, g, b, a = 1) => "rgba(" + D.numberToCss(r * 100, "%,") + D.numberToCss(g * 100, "%,") + D.numberToCss(b * 100, "%,") + D.numberToCss(a * 100, "%)");

//-------------------------------------------------------------------------

D.padStart = (v, n, pad = "0") => {
  const s = v.toString();
  return pad.repeat(Math.max(0, n - s.length)) + s;
};

D.dateToString = v => (
  v.getFullYear() + "/" +
  D.padStart(v.getMonth() + 1, 2) + "/" +
  D.padStart(v.getDate(), 2) + " " +
  D.padStart(v.getHours(), 2) + ":" +
  D.padStart(v.getMinutes(), 2)
);

//-------------------------------------------------------------------------

let serialNumber = 0;

D.getSerialNumber = () => {
  return ++serialNumber;
};

//-------------------------------------------------------------------------

let internalRoot;
let internalCanvas;

D.initializeInternal = () => {
  const offscreenNode = document.querySelector(".demeter-offscreen");
  const internalRootNode = offscreenNode.appendChild(document.createElement("div"));
  internalRoot = internalRootNode.attachShadow({ mode: "closed" });
  internalCanvas = internalRoot.appendChild(document.createElement("canvas"));
};

//-------------------------------------------------------------------------

const isWhiteSpace = u => (
  // " " (SPACE)
  u === 0x20 ||
  // "\t" (CHARACTER TABULATION)
  u === 0x09 ||
  // "\n" (LINE FEED)
  u === 0x0A ||
  // "\r" (CARRIAGE RETURN)
  u === 0x0D
) ? 1 : 0;

// 『日本語組版処理の要件』の分割禁止規則を参考に、てきとうに作成した。連続する
// ダッシュ・三点リーダ・二点リーダは、連続する欧文用文字に含まれるので省略した。
const canBreak = (u, v) => (
  // 行頭禁則
  D.jlreq.isLineStartProhibited(v) ||
  // 行末禁則
  D.jlreq.isLineEndProhibited(u) ||
  // くの字
  (u === 0x3033 || u === 0x3034) && v === 0x3035 ||
  // 前置省略記号とアラビア数字
  D.jlreq.isPrefixedAbbreviation(u) && 0x30 <= v && v <= 0x39 ||
  // アラビア数字と後置省略記号
  0x30 <= u && u <= 0x39 && D.jlreq.isPostfixedAbbreviation(v) ||
  // 連続する欧文用文字
  D.jlreq.isWesternCharacter(u) && D.jlreq.isWesternCharacter(v)
) ? 0 : 1;

const canSeparate = (u, v) => (canBreak(u, v) && !D.jlreq.isInseparable(u) && !D.jlreq.isInseparable(v)) ? 1: 0;

//-------------------------------------------------------------------------

const parseChars = (source, fontSize, font) => {
  const context = internalCanvas.getContext("2d");
  context.font = D.numberToCss(fontSize) + " " + font;
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
  context.font = D.numberToCss(fontSize) + " " + font;
  source.forEach((u, i) => {
    const v = source[i + 1];
    if (v) {
      u.advance = context.measureText(u.char + v.char).width - v.width;
      u.kerning = u.width - u.advance;
      u.spacingBudget = fontSize * 0.25 * (isWhiteSpace(u.code) || canSeparate(u.code, v.code));
    } else {
      u.spacingBudget = fontSize * 0.25;
    }
  });
};

D.parseText = (source, fontSize, font) => {
  const rubyFontSize = fontSize * 0.5;
  const result = source.map(source => {
    const result = {
      rubyOverhangPrev: 0,
      rubyOverhangNext: 0,
    };
    if (typeof source === "string") {
      result.base = parseChars(source, fontSize, font);
    } else {
      result.base = parseChars(source[0], fontSize, font);
      updateChars(result.ruby = parseChars(source[1], rubyFontSize, font), rubyFontSize, font);
    }
    return result;
  });
  updateChars(result.map(item => item.base).flat(), fontSize, font);
  return result;
};

const parseParagraphFromNodeBreakTable = {
  "BR": true,
  "DIV": true,
  "P": true,
};

const parseParagraphFromNode = (source, fontSize, font) => {
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
          if (parseParagraphFromNodeBreakTable[node.tagName]) {
            text = undefined;
          }
        }
        break;
      case Node.TEXT_NODE:
        if (!text) {
          result.push(text = []);
        }
        text.push(item = {
          base: parseChars(node.textContent, fontSize, font),
          rubyOverhangPrev: 0,
          rubyOverhangNext: 0,
        });
        break;
    }
  };
  parse(source);

  result.forEach(text => updateChars(text.map(item => item.base).flat(), fontSize, font));
  return result;
};

const parseParagraphFromArray = (source, fontSize, font) => {
  return source.map(text => D.parseText(text, fontSize, font));
};

D.parseParagraph = (source, fontSize, font) => (source instanceof Node ? parseParagraphFromNode : parseParagraphFromArray)(source, fontSize, font);

//-------------------------------------------------------------------------

const resetSpacing = source => source.forEach(u => u.spacingBudgeted = u.spacingFallback = u.spacing1 = u.spacing2 = 0);

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
  resetSpacing(source);
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

const updateItem = (prev, item, next, baseWidthFn = (acc, u) => acc + u.advance) => {
  if (baseWidthFn !== addAdvanceSpacing) {
    resetSpacing(item.base);
  }

  if (item.ruby) {
    resetSpacing(item.ruby);

    const baseWidth = item.base.reduce(baseWidthFn, 0);
    const rubyWidth = item.ruby.reduce((acc, u) => acc + u.advance, 0);

    const rubyOverhangPrev = getRubyOverhang(prev && !prev.ruby && prev.base.slice(-1)[0]);
    const rubyOverhangNext = getRubyOverhang(next && !next.ruby && next.base[0]);
    const rubyOverhangSum = rubyOverhangPrev + rubyOverhangNext;
    const rubyOverhang = Math.max(0, Math.min(rubyWidth - baseWidth, rubyOverhangSum));
    const rubyOverhangRatio = rubyOverhangSum > 0 ? rubyOverhang / rubyOverhangSum : 0;

    const spacing = rubyWidth - baseWidth - rubyOverhang;
    if (spacing > 0) {
      setSpacing(item.base, Math.abs(spacing), 0.25);
    } else {
      setSpacing(item.ruby, Math.abs(spacing), 0.25);
    }

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
const breakBase = (source, maxWidth) => {
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
      let baseIndex = breakBase(line1.map(item => item.base).flat(), maxWidth);
      if (baseIndex === -1) {
        break;
      }
      const itemIndex = line1.findIndex(item => {
        if (baseIndex < item.base.length) {
          return true;
        } else {
          baseIndex -= item.base.length;
          return false;
        }
      });

      const item = line1[itemIndex];
      if (baseIndex === item.base.length - 1) {
        if (item.rubyOverhangNext > 0) {
          updateItem(line1[itemIndex - 1], item);
          continue;
        }
        resetKerning(item.base[baseIndex]);
        line2 = [ ...line1.splice(itemIndex + 1), ...line2 ];
        break;
      }

      const item1 = {
        base: item.base.slice(0, baseIndex + 1),
        rubyOverhangPrev: item.rubyOverhangPrev,
        rubyOverhangNext: 0,
      };
      resetKerning(item1.base[baseIndex]);

      const item2 = {
        base: item.base.slice(baseIndex + 1),
        rubyOverhangPrev: 0,
        rubyOverhangNext: item.rubyOverhangNext,
      };

      line2 = [ item2, ...line1.splice(itemIndex + 1), ...line2 ];
      line1.pop();
      line1.push(item1);

      if (item.ruby) {
        const index = breakRuby(item.ruby, item1.base.reduce((width, u) => width + u.advance + u.spacing1, 0) + item1.rubyOverhangPrev);
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
    if (isWhiteSpace(item.base[0].code)) {
      if (item.base.length === 1) {
        if (!item.ruby) {
          line2.shift();
        }
      } else {
        item.base.shift();
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
        justifySpacing(item.base, maxWidth - item.base.reduce((acc, u) => acc + u.advance, 0), 0.25);
        if (item.ruby) {
          justifySpacing(item.ruby, maxWidth - item.ruby.reduce((acc, u) => acc + u.advance, 0), 0.25);
        }
      } else {
        const buffer = line.map(item => item.base).flat();
        addSpacing(buffer.slice(0, -1), maxWidth - buffer.reduce((acc, u) => acc + u.advance + u.spacing1, 0), 0.25);
        line.forEach((item, j) => {
          if (item.ruby && item.base.reduce((acc, u) => acc + u.spacing2, 0) > 0) {
            updateItem(line[j - 1], item, line[j + 1], addAdvanceSpacing);
          }
        });
      }
    }

    // 文字の位置を計算する。
    let baseX = 0;
    line.forEach((item, j) => {
      const isLineStart = j === 0;
      const isLineEnd = !isLastLine && j === line.length - 1;
      const a = isLineStart ? 0 : isLineEnd ? 1 : 0.5;
      const b = 1 - a;

      let rubyX = baseX - item.rubyOverhangPrev;

      item.base.forEach(u => {
        u.x = baseX += u.spacing1 * a;
        baseX += u.advance + u.spacing1 * b + u.spacing2;
      });

      if (item.ruby) {
        item.ruby.forEach(u => {
          u.x = rubyX += u.spacing1 * a;
          rubyX += u.advance + u.spacing1 * b + u.spacing2;
        });

        let baseIndex = 0;
        let rubyIndex;
        [
          ...item.base.map((u, i) => {
            const v = item.base[i + 1];
            return { baseIndex: i, x: v ? (u.x + u.advance + v.x) * 0.5 : Infinity };
          }),
          ...item.ruby.map((u, i) => ({ rubyIndex: i, x: u.x + u.advance * 0.5 })),
        ].sort((a, b) => a.x - b.x).forEach(order => {
          if (order.baseIndex !== undefined) {
            if (rubyIndex !== undefined) {
              item.base[order.baseIndex].rubyConnection = rubyIndex;
              rubyIndex = undefined;
            }
            ++baseIndex;
          } else {
            item.ruby[order.rubyIndex].rubyConnection = baseIndex;
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
  const result = document.createElement("div");
  result.className = "demeter-text";
  result.style.lineHeight = D.numberToCss(lineHeight);

  source.forEach(line => {
    const lineNode = result.appendChild(document.createElement("div"));

    let baseX = 0;
    line.forEach(item => {
      item.base.forEach((u, i)  => {
        const baseNode = lineNode.appendChild(document.createElement("span"));
        baseNode.style.marginLeft = D.numberToCss(u.x - baseX);
        baseNode.style.width = D.numberToCss(u.advance);

        const charNode = baseNode.appendChild(document.createElement("span"));
        charNode.textContent = u.char;

        baseX = u.x + u.advance;

        if (u.rubyConnection !== undefined) {
          const ruby = item.ruby.filter(ruby => ruby.rubyConnection === i);
          let rubyX = ruby[0].x;

          const rubyNode = baseNode.appendChild(document.createElement("div"));
          rubyNode.style.top = D.numberToCss(fontSize * -0.75);
          rubyNode.style.left = D.numberToCss(rubyX - u.x);

          ruby.forEach(u => {
            const charNode = rubyNode.appendChild(document.createElement("span"));
            charNode.style.marginLeft = D.numberToCss(u.x - rubyX);
            charNode.style.width = D.numberToCss(u.advance);
            charNode.textContent = u.char;

            rubyX = u.x + u.advance;
          });
        }
      });
    });
  });

  return result;
};

//-------------------------------------------------------------------------

D.PathData = class {
  constructor() {
    this.d = [];
  }

  push(command, ...params) {
    this.d.push(command + params.map(D.numberToString).join(","));
    return this;
  }

  toString() {
    return this.d.join("");
  }

  M(x, y) { return this.push("M", x, y); }
  m(x, y) { return this.push("m", x, y); }
  Z() { return this.push("Z"); }
  z() { return this.push("z"); }
  L(x, y) { return this.push("L", x, y); }
  l(x, y) { return this.push("l", x, y); }
  H(x) { return this.push("H", x); }
  h(x) { return this.push("h", x); }
  V(y) { return this.push("V", y); }
  v(y) { return this.push("v", y); }
};

//-------------------------------------------------------------------------

D.createChoiceFrame = (width, height, fontSize) => {
  const W = width;
  const W2 = width * 0.5;
  const W4 = width * 0.25;
  const H = height - fontSize;
  const U1 = fontSize;
  const U2 = fontSize * 0.5;
  const U4 = fontSize * 0.25;
  const U8 = fontSize * 0.125;
  const C3 = Math.cos(Math.PI * 0.375);
  const D2 = Math.sqrt(2);

  const clipId = "demeter-serial-" + D.getSerialNumber();
  const clipPathData = new D.PathData()
    // 枠線の外側（時計回り）
    .M(0,U2).l(U4,-U4).h(W4-U4-U8).l(U8,U8).h(W2).l(U8,-U8).h(W4-U4-U8).l(U4,U4).v(H).H(U1).L(0,H-U2).z()
    // 枠線の内側（反時計回り）
    .M(1,U2+1).V(H-U2-C3).L(U1+C3,H+U2-1).H(W-1).V(U2+1).z()
    // 表示領域
    .M(U4,U2+U4).h(W-U2).v(H-U2).H(U1+U4*C3).L(U4,H-U2-U4*C3).z()
    // 左下
    .M(0,H-U2+(U4-1)*D2).L(U1-(U4-1)*D2,H+U2).H(U4).l(-U4,-U4).z();

  const mainPathData = new D.PathData()
    .M(0,U2).h(W).v(H).H(U1).L(0,H-U2).z().M(-2,H-U2-2).l(U1+4,U1+4).H(-2).z();

  const barPathData = new D.PathData()
    .M(0,U2-U8).h(W);

  const template = document.createElement("template");
  template.innerHTML = `
    <svg viewBox="0 0 ${D.numberToString(width)} ${D.numberToString(height)}"
      style="width: ${D.numberToCss(width)}; height: ${D.numberToCss(height)}"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${clipId}">
          <path d="${clipPathData}"/>
        </clipPath>
      </defs>
      <g class="demeter-button" data-focusable="true" clip-path="url(#${clipId})">
        <path fill="none" stroke-width="${D.numberToString(U4+2)}" d="${barPathData}"/>
        <path stroke-width="2" d="${mainPathData}"/>
      </g>
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

D.createDialogFrame = (width, height, fontSize, buttons, buttonWidth, buttonHeight) => {
  const W = width;
  const H = height;
  const H2 = height * 0.5;
  const H4 = height * 0.25;
  const U1 = fontSize;
  const U2 = fontSize * 0.5;
  const U4 = fontSize * 0.25;
  const U8 = fontSize * 0.125;
  const BW = buttonWidth;
  const BH = buttonHeight;
  const C3 = Math.cos(Math.PI * 0.375);

  const clipId = "demeter-serial-" + D.getSerialNumber();
  const clipPathData = new D.PathData()
    // 枠線の外側（時計回り）
    .M(0,U2).l(U2,-U2).h(W-U1).l(U2,U2).v(H-U1).l(-U2,U2).h(U1-W).l(-U2,-U2).z()
    // 枠線の内側（反時計回り）
    .M(U2+1,1).v(H4-1).l(-U8,U8).v(H2-U4).l(U8,U8).v(H4-1)
    .H(W-U2-1).v(1-H4).l(U8,-U8).v(U4-H2).l(-U8,-U8).v(1-H4).z()
    // 表示領域（時計回り）
    .M(U2+U4,U4).h(W-U1-U2).V(H4+U4*C3).l(U8,U8).V(H-H4-U4*C3-U8).l(-U8,U8).V(H-U4)
    .h(U1+U2-W).V(H-H4-U4*C3).l(-U8,-U8).V(H4+U4*C3+U8).l(U8,-U8).z();

  let buttonsHtml = '<g class="demeter-buttons">';
  for (let i = 1; i <= buttons; ++i) {
    // ボタン（反時計回り）
    clipPathData
      .M(W-(BW+U1)*i-U2,H-BH-U2+U4)
      .v(BH-U2-U4).h(BW-U2-U4).l(U2+U4,-U2-U4).v(-BH+U2+U4).h(-BW+U2+U4).z();

    const buttonPathData = new D.PathData()
      .M(W-(BW+U1)*i-U2,H-BH-U2+U4)
      .l(U2+U4,-U2-U4).h(BW-U2-U4).v(BH-U2-U4)
      .l(-U2-U4,U2+U4).h(-BW+U2+U4).z();

    const buttonBarPathData = new D.PathData()
      .M(W-(BW+U1)*i-U2,H-BH)
      .v(-U4).l(U2+U4,-U2-U4).h(U2+U4)
      .m(BW-U1*3+U4,0).h(U1+U4).v(U2)
      .m(0,BH-U1-U2).v(U4).l(-U2-U4,U2+U4).h(-U2-U4)
      .m(-BW+U1*3-U4,0).h(-U1-U4).v(-U2);

    buttonsHtml += `
      <g class="demeter-button demeter-button${i} demeter-hover">
        <path fill="none" stroke-width="${D.numberToString(U8)}" d="${buttonBarPathData}"/>
        <path stroke-width="1" d="${buttonPathData}"/>
      </g>
    `;
  }
  buttonsHtml += "</g>";

  const barPathData = new D.PathData()
    .M(U2-U4,0).V(H)
    .M(W-U2+U4,0).V(H);

  const template = document.createElement("template");
  template.innerHTML = `
    <svg viewBox="0 0 ${D.numberToString(width)} ${D.numberToString(height)}"
      style="width: ${D.numberToCss(width)}; height: ${D.numberToCss(height)}"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${clipId}">
          <path d="${clipPathData}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#${clipId})">
        <path fill="none" stroke-width="${D.numberToString(U2+2)}" d="${barPathData}"/>
        <rect stroke-width="2" x="${D.numberToString(U2)}" y="0" width="${D.numberToString(W-U1)}" height="${D.numberToString(height)}"/>
      </g>
      ${buttonsHtml}
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

D.createMenuFrame = (titleWidth, buttonWidth, buttonHeight) => {
  const U1 = buttonHeight;
  const U2 = buttonHeight * 0.5;
  const U3 = buttonHeight / 3;
  const U4 = buttonHeight * 0.25;
  const U8 = buttonHeight * 0.125;
  const U16 = buttonHeight * 0.0625;

  const BW = buttonWidth;
  const BW2 = buttonWidth * 0.5;
  const TW2 = titleWidth * 0.5;

  const C3 = Math.cos(Math.PI * 0.375);
  const D2 = Math.sqrt(2);

  //    +--------U8--------+
  //    |  BW U8 BW U8 BW  |
  //    |        U8        |
  // U8 | BW U8 [TW] U8 BW | U8
  //    +--------U8--------+
  const width = titleWidth + buttonWidth * 2 + U2;
  const height = U1 * 2 + U4 + U8;

  const button1PathData = new D.PathData()
    .M(-BW2-U8,-U1+U3-U16).l(U3,-U3).h(BW-(U3-U8)*2).l(U3,U3).v(U3).l(-U3,U3).h(-BW+(U3-U8)*2).l(-U3,-U3).z();

  const button2PathData = new D.PathData()
    .M(-BW-BW2-U8,-U1+U3-U16)
    .l(U3,-U3).h(BW-U8*D2).l(-U3+U8*C3,U3-U8*C3).v(U3+U4*C3).l(U3-U8*C3,U3-U8*C3).h(-BW+U8*D2).l(-U3,-U3).z();

  const button3PathData = new D.PathData()
    .M(BW+BW2+U8,-U1+U3-U16)
    .l(-U3,-U3).h(-BW+U8*D2).l(U3-U8*C3,U3-U8*C3).v(U3+U4*C3).l(-U3+U8*C3,U3-U8*C3).h(BW-U8*D2).l(U3,-U3).z();

  const button4PathData = new D.PathData()
    .M(-BW-TW2-U8,U3+U16)
    .l(U3,-U3).h(BW-U8*D2).l(-U3+U8*C3,U3-U8*C3).v(U3+U4*C3).l(U3-U8*C3,U3-U8*C3).h(-BW+U8*D2).l(-U3,-U3).z();

  const button5PathData = new D.PathData()
    .M(BW+TW2+U8,U3+U16)
    .l(-U3,-U3).h(-BW+U8*D2).l(U3-U8*C3,U3-U8*C3).v(U3+U4*C3).l(-U3+U8*C3,U3-U8*C3).h(BW-U8*D2).l(U3,-U3).z();

  const template = document.createElement("template");
  template.innerHTML = `
    <svg viewBox="${D.numberToString(-width*0.5)} ${D.numberToString(-height*0.5)} ${D.numberToString(width)} ${D.numberToString(height)}"
      style="width: ${D.numberToCss(width)}; height: ${D.numberToCss(height)}"
      xmlns="http://www.w3.org/2000/svg">
      <g class="demeter-buttons">
        <g class="demeter-button demeter-button1" data-focusable="true"><path d="${button1PathData}"/></g>
        <g class="demeter-button demeter-button2" data-focusable="true"><path d="${button2PathData}"/></g>
        <g class="demeter-button demeter-button3" data-focusable="true"><path d="${button3PathData}"/></g>
        <g class="demeter-button demeter-button4" data-focusable="true"><path d="${button4PathData}"/></g>
        <g class="demeter-button demeter-button5" data-focusable="true"><path d="${button5PathData}"/></g>
      </g>
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

D.createBackFrame = (width, height, buttonWidth, buttonHeight, strokeWidth) => {
  const U1 = buttonHeight;
  const U3 = buttonHeight / 3;
  const BW = buttonWidth;

  const strokePathData = new D.PathData()
    .M(BW,0).V(U1-U3).l(-U3,U3).H(0)
    ;

  const fillPathData = new D.PathData()
    .M(0,0).L(BW,0).V(U1-U3).l(-U3,U3).H(0).z();

  const template = document.createElement("template");
  template.innerHTML = `
    <svg viewBox="0 0 ${D.numberToString(width)} ${D.numberToString(height)}"
      style="width: ${D.numberToCss(width)}; height: ${D.numberToCss(height)}"
      xmlns="http://www.w3.org/2000/svg">
      <g class="demeter-button demeter-hover">
        <path stroke="none" d="${fillPathData}"/>
        <path fill="none" stroke-width="${D.numberToString(strokeWidth)}" d="${strokePathData}"/>
      </g>
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

D.createTitleFrame = (width, height, titleWidth, titleHeight) => {
  const U1 = titleHeight;
  const U3 = titleHeight / 3;
  const TX = (width - titleWidth) * 0.5;
  const TW = titleWidth;

  const pathData = new D.PathData()
    .M(TX,0).V(U1-U3).l(U3,U3).h(U1-U3)
    .M(TX+TW,0).V(U1-U3).l(-U3,U3).h(-U1+U3);

  const template = document.createElement("template");
  template.innerHTML = `
    <svg viewBox="0 0 ${D.numberToString(width)} ${D.numberToString(height)}"
      style="width: ${D.numberToCss(width)}; height: ${D.numberToCss(height)}"
      xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="none" d="${pathData}"/>
      </g>
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

const fontSize = 24;
const font = "'BIZ UDPMincho', 'Source Serif Pro', serif";
const consoleFont = "'Share Tech', 'BIZ UDPGothic', sans-serif";

const musicNames = {
  vi03: "Hollow",
  vi05: "Geode",
  diana12: "Pulse",
  diana19: "Ever Fall",
  diana21: "Last Time",
  diana23: "Sentinel",
  diana33: "Shadow Island",
  sgt03: "Jump",
};

const speakerNames = {
  narrator: "",
  alice:    "アリス",
  danu:     "ダヌー",
  demeter:  "デメテル",
  yukio:    "ユキヲ",
  priest:   "神父",
  engineer: "課長",
  activist: "店主",
  steven:   "STEVEN",
  rosa:     "ローザ",
  author:   "作者",
};

const startTexts = {
  verse1: "EVANGELIUM SECUNDUM STEPHANUS verse I",
  verse2: "EVANGELIUM SECUNDUM STEPHANUS verse II",
  verse3: "EVANGELIUM SECUNDUM STEPHANUS verse III",
  preview: "SHOWA YOKOHAMA STORY '69",
};

const getMediaErrorMessage = message => {
  switch (message) {
    case 1: return "MEDIA_ERR_ABORTED";
    case 2: return "MEDIA_ERR_NETWORK";
    case 3: return "MEDIA_ERR_DECODE";
    case 4: return "MEDIA_ERR_SRC_NOT_SUPPORTED";
  }
  return message;
};

//-------------------------------------------------------------------------

D.Logging = class {
  constructor() {
    this.level = 6;
  }

  update(behavior) {
    document.querySelector(".demeter-main-logging").lastElementChild.scrollIntoView({ behavior: behavior, block: "end" });
  }

  logImpl(...messages) {
    // DOMの準備が完了する前にログが出力されるかもしれない。
    const loggingNode = document.querySelector(".demeter-main-logging");
    if (loggingNode) {
      const messageNodes = messages.map(message => {
        const messageNode = document.createElement("div");
        messageNode.textContent = message;
        return messageNode;
      });
      loggingNode.append(...messageNodes);
      while (loggingNode.children.length > 100) {
        loggingNode.firstElementChild.remove();
      }
      this.update("smooth");
    }
  }

  setLevel(level) {
    this.level = level;
  }

  error(message, exception) {
    D.trace(message, exception);
    if (this.level >= 3) {
      this.logImpl(message, exception.message);
    }
  }

  warn(message) {
    D.trace(message);
    if (this.level >= 4) {
      this.logImpl(message);
    }
  }

  notice(message) {
    D.trace(message);
    if (this.level >= 5) {
      this.logImpl(message);
    }
  }

  info(message) {
    D.trace(message);
    if (this.level >= 6) {
      this.logImpl(message);
    }
  }

  debug(message) {
    D.trace(message);
    if (this.level >= 7) {
      this.logImpl(message);
    }
  }
};

//-------------------------------------------------------------------------

D.IconAnimation = class {
  constructor(node) {
    this.node = node;
    this.startTime = undefined;
  }

  start() {
    this.node.style.display = "block";
    this.node.style.transform = "scaleY(1) translateY(0)";
    this.startTime = performance.now();
  }

  stop() {
    this.node.style.display = "none";
    this.startTime = undefined;
  }

  update() {
    if (!this.startTime) {
      return;
    }

    const now = performance.now();
    const x = (now - this.startTime) % 1200 / 1200;

    let scale = 1;
    let translate = 0;

    if (x < 0.8) {
      const y = (x - 0.4) / 0.4;
      translate = (y * y - 1) * 0.5;
    } else {
      const y = (x - 0.9) / 0.1;
      scale = 1 + (y * y - 1) * 0.15;
    }

    this.node.style.transform = "scaleY(" + D.numberToString(scale) + ") translateY(" + D.numberToCss(translate, "em");
  }
};

//-------------------------------------------------------------------------

D.MusicPlayer = class {
  constructor(volume, unlock) {
    this.volume = volume;
    this.key = undefined;
    this.sound = undefined;
    this.soundId = undefined;
    this.unlock = unlock;
  }

  resetUnlock() {
    this.sound.off("unlock");
    this.unlock = undefined;
  }

  start(key) {
    this.key = key;

    this.sound = new Howl({
      src: getAudioSource(D.preferences.musicDir + "/sessions_" + this.key),
      volume: this.volume,
      loop: true,
      onloaderror: (notUsed, message) => logging.error("音楽読出: 失敗", new Error(getMediaErrorMessage(message))),
      onplayerror: (notUsed, message) => logging.error("音楽再生: 失敗", new Error(message)),
    });
    if (this.unlock) {
      this.sound.once("unlock", () => {
        if (this.unlock) {
          this.unlock();
        }
      });
    }
    this.soundId = this.sound.play();

    logging.info("音楽開始: " + musicNames[this.key]);
  }

  fade(key) {
    const oldKey = this.key;
    const oldSound = this.sound;
    const oldSoundId = this.soundId;

    this.start(key);
    const newSound = this.sound;
    const newSoundId = this.soundId;

    oldSound.on("fade", soundId => {
      oldSound.stop();
      logging.debug("音楽終了: " + musicNames[oldKey]);
    });

    oldSound.fade(this.volume, 0, 5000, oldSoundId);
    newSound.fade(0, this.volume, 5000, newSoundId);
  }

  updateVolume(volume) {
    this.volume = volume;
    if (this.sound) {
      this.sound.volume(volume);
    }
  }
};

//-------------------------------------------------------------------------

D.AudioVisualizer = class {
  constructor(width, height, color) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = D.numberToCss(width);
    canvas.style.height = D.numberToCss(height);

    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = Math.pow(2, Math.ceil(Math.log2(width)));
    analyser.connect(Howler.ctx.destination);
    Howler.masterGain.connect(analyser);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.color = color;
    this.analyser = analyser;
    this.frequencyData = new Float32Array(analyser.fftSize / 2);
    this.fillStyleSave = undefined;
  }

  update() {
    this.analyser.getFloatFrequencyData(this.frequencyData);
  }

  updateColor(color) {
    this.color = color;
  }

  draw() {
    const W = this.width;
    const H = this.height;
    const HH = H * 0.5;
    const maxDecibels = -30;
    const minDecibels = -100;
    const rangeDecibels = maxDecibels - minDecibels;

    const context = this.canvas.getContext("2d");
    // コンテキストの再作成を検出する。今のところ、コンテキストの再作成は確認さ
    // れていない。
    if (this.fillStyleSave && this.fillStyleSave !== context.fillStyle) {
      logging.warn("AudioVisualizer canvas context maybe recreated: " + context.fillStyle);
    }
    context.resetTransform();
    context.scale(devicePixelRatio, devicePixelRatio);
    context.fillStyle = this.color;
    this.fillStyleSave = context.fillStyle;

    context.clearRect(0, 0, W, H);

    const w = W / this.analyser.frequencyBinCount;
    for (let i = 0; i < this.analyser.frequencyBinCount; ++i) {
      const v = (Math.max(minDecibels, Math.min(maxDecibels, this.frequencyData[i])) - minDecibels) / rangeDecibels;
      const h = v * H;
      if (h > 0) {
        context.fillRect(i * w, HH - h * 0.5, w, h);
      }
    }
  }
};

//-------------------------------------------------------------------------

D.RingBuffer = class {
  constructor(limit) {
    this.index = 0;
    this.limit = limit;
    this.data = [];
  }

  push(value) {
    this.data[this.index] = value;
    ++this.index;
    this.index %= this.limit;
  }

  forEach(fn) {
    let index = 0;
    for (let i = this.index; i < this.data.length; ++i) {
      fn(this.data[i], index++);
    }
    for (let i = 0; i < this.index; ++i) {
      fn(this.data[i], index++);
    }
  }

  empty() {
    return this.data.length === 0;
  }

  last() {
    return this.data[this.index > 0 ? this.index - 1 : this.data.length - 1];
  }

  min() {
    return this.data.reduce((acc, value) => Math.min(acc, value), Infinity);
  }

  max() {
    return this.data.reduce((acc, value) => Math.max(acc, value), -Infinity);
  }
};

//-------------------------------------------------------------------------

D.FrameRateVisualizer = class {
  constructor(width, height, fontSize, font, color) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = D.numberToCss(width);
    canvas.style.height = D.numberToCss(height);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.fontSize = fontSize;
    this.font = font;
    this.color = color;
    this.prevTime = undefined;
    this.frameCount = 0;
    this.frameRates = new D.RingBuffer(width - 2);
    this.fillStyleSave = undefined;
  }

  update() {
    const now = performance.now();
    if (this.prevTime === undefined) {
      this.prevTime = now;
      return;
    }
    ++this.frameCount;
    const duration = now - this.prevTime;
    if (duration < 1000) {
      return;
    }
    const frameRate = this.frameCount * 1000 / duration;

    this.prevTime = now;
    this.frameCount = 0;
    this.frameRates.push(frameRate);
  }

  updateColor(color) {
    this.color = color;
  }

  draw() {
    const W = this.width;
    const H = this.height;

    const context = this.canvas.getContext("2d");
    // コンテキストの再作成を検出する。今のところ、コンテキストの再作成は確認さ
    // れていない。
    if (this.fillStyleSave && this.fillStyleSave !== context.fillStyle) {
      D.trace("FrameRateVisualizer canvas context maybe recreated", context.fillStyle);
    }
    context.resetTransform();
    context.scale(devicePixelRatio, devicePixelRatio);
    context.lineWidth = 1;
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.font = D.numberToCss(this.fontSize) + " " + this.font;
    context.textBaseline = "top";
    this.fillStyleSave = context.fillStyle;

    context.clearRect(0, 0, W, H);
    context.strokeRect(0.5, this.fontSize + 0.5, W - 1, H - this.fontSize - 1);

    if (this.frameRates.empty()) {
      return;
    }

    const frameRate = this.frameRates.last();
    const frameRateMin = this.frameRates.min();
    const frameRateMax = this.frameRates.max();

    context.fillText(Math.round(frameRate) + "FPS [" + Math.round(frameRateMin) + "-" + Math.round(frameRateMax) + "]", 0, 0);

    this.frameRates.forEach((v, i) => {
      const h = (H - this.fontSize - 2) * Math.min(v, 100) / 100;
      context.fillRect(i + 1, H - h - 1, 1, h);
    });
  }
};

//-------------------------------------------------------------------------

const getSystemUrl = path => {
  if (D.isApp() === "ios") {
    return "demeter:///" + path;
  } else {
    return path;
  }
};

const loadImage = url => new Promise((resolve, reject) => {
  const image = new Image();
  image.crossOrigin = "Anonymous";
  image.addEventListener("load", () => {
    resolve(image);
  });
  image.addEventListener("error", ev => {
    reject(ev);
  });
  image.src = url;
});

D.LipSync = class {
  constructor(width, height, colorArray) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = D.numberToCss(width);
    canvas.style.height = D.numberToCss(height);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.updateColor(colorArray);
  }

  updateColor(colorArray) {
    const [ r, g, b, a ] = colorArray;
    document.querySelector("#demeter-main-lip-sync-filter feColorMatrix").setAttribute("values", [
      r, 0, 0, 0, 0,
      0, g, 0, 0, 0,
      0, 0, b, 0, 0,
      0, 0, 0, a, 0,
    ].map(D.numberToString).join(" "));

    this.colorArray = colorArray;
    this.drawBuffer();
  }

  async initialize(visemes) {
    const image = await loadImage(getSystemUrl(D.preferences.systemDir + "/lip.png"));
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const map = new Map();
    visemes.forEach((visemes, i) => visemes.forEach(viseme => map.set(viseme, i)));

    const buffer = document.createElement("canvas");
    buffer.width = width;
    buffer.height = height;
    buffer.style.width = D.numberToCss(width);
    buffer.style.height = D.numberToCss(height);

    this.lipImage = image;
    this.lipWidth = width;
    this.lipHeight = Math.floor(height / visemes.length);
    this.lipMap = map;
    this.buffer = buffer;
    this.bufferWidth = width;
    this.bufferHeight = height;
  }

  drawBuffer() {
    if (this.buffer === undefined) {
      return;
    }

    const [ R, G, B, A ] = this.colorArray;
    const W = this.bufferWidth;
    const H = this.bufferHeight;

    const context = this.buffer.getContext("2d");
    context.resetTransform();
    context.clearRect(0, 0, W, H);
    context.drawImage(this.lipImage, 0, 0);

    const imageData = context.getImageData(0, 0, W, H);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i + 0] *= R;
      data[i + 1] *= G;
      data[i + 2] *= B;
      data[i + 3] *= A;
    }
    context.putImageData(imageData, 0, 0);
  }

  draw() {
    const W = this.width;
    const H = this.height;

    const context = this.canvas.getContext("2d");
    context.resetTransform();
    context.scale(devicePixelRatio, devicePixelRatio);
    context.clearRect(0, 0, W, H);

    let viseme = [ 0.5, "neutral", "neutral" ];
    if (voiceSprite) {
      viseme = voiceSprite.getViseme();
    }
    const [ a, u, v ] = viseme;
    const i = this.lipMap.get(u);
    const j = this.lipMap.get(v);

    if (i === j) {
      context.globalAlpha = 1;
      context.drawImage(this.buffer, 0, this.lipHeight * i, this.lipWidth, this.lipHeight, 0, 0, W, H);
    } else {
      context.globalAlpha = a;
      context.drawImage(this.buffer, 0, this.lipHeight * i, this.lipWidth, this.lipHeight, 0, 0, W, H);
      context.globalAlpha = 1 - a;
      context.drawImage(this.buffer, 0, this.lipHeight * j, this.lipWidth, this.lipHeight, 0, 0, W, H);
    }
    context.globalAlpha = 1;
  }
};

//-------------------------------------------------------------------------

D.Silhouette = class {
  constructor(width, height, color) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = D.numberToCss(width);
    canvas.style.height = D.numberToCss(height);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speaker = undefined;
    this.strokeStyleSave = undefined;
  }

  updateColor(color) {
    this.color = color;
  }

  updateSpeaker(speaker) {
    this.speaker = speaker;
  }

  draw() {
    const context = this.canvas.getContext("2d");
    // コンテキストの再作成を検出する。今のところ、コンテキストの再作成は確認さ
    // れていない。
    if (this.strokeStyleSave && this.strokeStyleSave !== context.strokeStyle) {
      logging.warn("Silhouette canvas context maybe recreated: " + context.strokeStyle);
    }
    // コンテキストが再作成されるかもしれないので、毎回設定する。
    context.resetTransform();
    context.scale(devicePixelRatio, devicePixelRatio);
    context.lineWidth = 0.5;
    context.strokeStyle = this.color;
    this.strokeStyleSave = context.strokeStyle;

    context.clearRect(0, 0, this.width, this.height);

    if (!this.speaker) {
      return;
    }
    const scanline = D.scanlines[this.speaker];
    if (!scanline) {
      return;
    }

    context.beginPath();
    scanline.data.forEach(segment => {
      // Box-Muller法で正規分布に従う乱数を生成する
      // 参考: https://kumpei.ikuta.me/benchmark-normal-variates/
      const a = Math.sqrt(-2 * Math.log(1 - Math.random()));
      const b = 2 * Math.PI * (1 - Math.random());
      const z1 = a * Math.cos(b);
      const z2 = a * Math.sin(b);

      const x = segment[0] * 0.5 + z1 * 2;
      const y = segment[1] * 0.5 + z2 * 0.125;
      const w = segment[2] * 0.5;
      context.moveTo(x, y);
      context.lineTo(x + w, y);
    });
    context.stroke();
  }
};

//-------------------------------------------------------------------------

D.TextAnimation = class {
  constructor(textNode, speed) {
    this.nodes = [...textNode.querySelectorAll(":scope > div > span")];
    this.nodes.forEach(node => node.style.opacity = "0");
    this.speed = speed;
    this.paused = false;
    this.finished = false;
  }

  updateSpeed(speed) {
    this.speed = speed;
  }

  async start(pauseState) {
    let index = 0;
    let prevTime;
    let duration = 0;

    if (pauseState) {
      this.pause();
    }

    L: while (!this.finished) {
      if (playState === "skip") {
        break;
      }

      const now = await D.requestAnimationFrame();
      if (prevTime !== undefined && !this.paused) {
        duration += now - prevTime;
      }
      prevTime = now;

      if (this.paused) {
        continue;
      }

      while (true) {
        const node = this.nodes[index];
        if (!node) {
          break L;
        }

        if (duration < this.speed) {
          node.style.opacity = D.numberToString(duration / this.speed);
          break;
        } else {
          node.style.opacity = "1";
          duration -= this.speed;
          ++index;
        }
      }
    }
    this.nodes.forEach(node => node.style.opacity = "1");
  }

  pause() {
    this.paused = true;
  }

  restart() {
    this.paused = false;
  }

  finish() {
    this.finished = true;
  }
};

//-------------------------------------------------------------------------

D.VoiceSound = class {
  constructor(basename, sprite, segment) {
    this.basename = basename;
    this.sprite = sprite;
    this.segment = segment;
    D.trace(segment);
    this.loadErrorSoundId = undefined;
    this.loadErrorMessage = undefined;
    this.onceLoadError = undefined;
  }

  // 遅延構築する。
  getSound() {
    if (!this.sound) {
      this.sound = new Howl({
        src: getAudioSource(this.basename),
        sprite: this.sprite,

        onload: () => {
          D.trace("voiceSound onLoad", this.basename);
        },

        // 再生に先だってロードエラーが発生した場合、サウンドIDは定義されない。
        onloaderror: (soundId, message) => {
          D.trace("VoiceSound onLoadError", this.basename, soundId, message);
          this.loadErrorSoundId = soundId;
          this.loadErrorMessage = message;
          // 再生開始後にロードエラーを伝える。
          if (this.onceLoadError) {
            this.onceLoadError(this.loadErrorSoundId, this.loadErrorMessage);
            this.onceLoadError = undefined;
          }
        },
        onplayerror: (soundId, message) => D.trace("VoiceSound onPlayError", soundId, message),
      });
    }
    return this.sound;
  }

  setOnceLoadError(onLoadError) {
    this.onceLoadError = onLoadError;
  }

  play(...params) {
    if (this.onceLoadError && this.loadErrorMessage !== undefined) {
      this.onceLoadError(this.loadErrorSoundId, this.loadErrorMessage);
      this.onceLoadError = undefined;
      // 有効なサウンドIDを返さない。
      return;
    } else {
      return this.getSound().play(...params);
    }
  }

  pause(...params) {
    return this.getSound().pause(...params);
  }

  stop(...params) {
    return this.getSound().stop(...params);
  }

  on(...params) {
    return this.getSound().on(...params);
  }

  once(...params) {
    return this.getSound().once(...params);
  }

  volume(...params) {
    return this.getSound().volume(...params);
  }
};

D.VoiceSprite = class {
  constructor(sound, sprite, volume) {
    this.sound = sound;
    this.sprite = sprite;
    this.volume = volume;
    this.soundId = undefined;
    this.paused = false;
    this.finished = false;
    this.timeOnStart = undefined;
    this.timeOnPause = undefined;
    this.timeOffset = 0;
  }

  start(pauseState) {
    return new Promise((resolve, reject) => {
      if (playState === "skip") {
        resolve("skip");
        return;
      }

      this.sound.setOnceLoadError((soundId, message) => {
        D.trace("VoiceSprite onceLoadError", soundId, message, this.soundId);
        this.soundId = undefined;
        reject(new Error(getMediaErrorMessage(message)));
      });

      this.sound.once("playerror", (soundId, message) => {
        D.trace("VoiceSprite oncePlayError", soundId, message, this.soundId);
        if (this.soundId === soundId) {
          this.soundId = undefined;
          reject(new Error(message));
        }
      });

      this.sound.once("end", soundId => {
        D.trace("VoiceSprite onceEnd", soundId, this.soundId);
        if (this.soundId === soundId) {
          this.soundId = undefined;
          resolve("end");
        }
      });

      this.sound.once("stop", soundId => {
        D.trace("VoiceSprite onceStop", soundId, this.soundId);
        if (this.soundId === soundId) {
          this.soundId = undefined;
          resolve("stop");
        }
      });

      this.soundId = this.sound.play(this.sprite);
      this.updateVolume(this.volume);

      // 再生位置を計算する。
      this.sound.on("play", soundId => {
        this.timeOnStart = Howler.ctx.currentTime;
        this.timeOnPause = undefined;
      }, this.soundId);
      this.sound.on("pause", soundId => {
        this.timeOnPause = Howler.ctx.currentTime;
        this.timeOffset += this.timeOnPause - this.timeOnStart;
      }, this.soundId);

      if (pauseState) {
        this.pause();
      }
    });
  }

  updateVolume(volume) {
    if (this.soundId !== undefined) {
      this.sound.volume(volume, this.soundId);
    }
  }

  pause() {
    if (this.soundId !== undefined && !this.paused) {
      this.paused = true;
      this.sound.pause(this.soundId);
    }
  }

  restart() {
    if (this.soundId !== undefined && this.paused) {
      this.paused = false;
      this.sound.play(this.soundId);
    }
  }

  finish() {
    if (this.soundId !== undefined) {
      this.finished = true;
      this.sound.stop(this.soundId);
    }
  }

  getTime() {
    if (this.timeOnPause !== undefined) {
      return this.timeOffset;
    } else if (this.timeOnStart !== undefined) {
      return this.timeOffset + Howler.ctx.currentTime - this.timeOnStart;
    } else {
      return 0;
    }
  }

  getViseme() {
    const segment = this.sound.segment[this.sprite];
    const time = this.getTime();

    let t = 0;
    const i = segment.findIndex(s => {
      const u = s[0];
      if (time < u) {
        return true;
      } else {
        t = u;
      }
    });
    if (i === -1) {
      return [ 0.5, "neutral", "neutral" ];
    }

    const [ u, v ] = segment[i];
    const d = (u - t) * 0.5;
    const p = (u + t) * 0.5;
    let j;
    let a;
    if (time < p) {
      j = Math.max(i - 1, 0);
      a = (p - time) / d;
    } else {
      j = Math.min(i + 1, segment.length - 1);
      a = (time - p) / d;
    }
    if (i === j) {
      return [ 0.5, v, v ];
    } else {
      return [ a * 0.5 + 0.5, v, segment[j][1] ];
    }
  }
};

//-------------------------------------------------------------------------

D.OpacityAnimation = class {
  constructor(nodes, begin, end, duration) {
    this.nodes = nodes;
    this.begin = begin;
    this.end = end;
    this.duration = duration;
  }

  async start() {
    let prevTime;
    let duration = 0;
    while (duration < this.duration) {
      const now = await D.requestAnimationFrame();
      if (prevTime !== undefined) {
        duration += now - prevTime;
      }
      prevTime = now;

      const x = Math.min(duration / this.duration, 1);
      const y = x * (2 - x);
      const z = this.begin + (this.end - this.begin) * y;
      const opacity = D.numberToString(z);
      this.nodes.forEach(node => node.style.opacity = opacity);
    }
    this.nodes.forEach(node => node.style.opacity = this.end);
  }
};

D.ScrollAnimation = class {
  constructor(containerNode, begin, end, duration) {
    this.containerNode = containerNode;
    this.begin = begin;
    this.end = end;
    this.duration = duration;
  }

  async start() {
    let prevTime;
    let duration = 0;
    while (duration < this.duration) {
      const now = await D.requestAnimationFrame();
      if (prevTime !== undefined) {
        duration += now - prevTime;
      }
      prevTime = now;

      const x = Math.min(duration / this.duration, 1);
      const y = (Math.cos((x - 1) * Math.PI) + 1) * 0.5;
      const z = this.begin + (this.end - this.begin) * y;

      this.containerNode.scrollTo(0, z);
    }
    this.containerNode.scrollTo(0, this.end);
  }
};

//-------------------------------------------------------------------------

D.BackgroundTransition = class {
  constructor(nodes) {
    this.nodes = nodes;
    this.key = "モノクローム";
  }

  fade(key) {
    if (this.key === key) {
      return;
    }

    this.key = key;
    if (this.key === "モノクローム") {
      this.nodes.forEach(node => node.classList.remove("demeter-saturate"));
    } else {
      this.nodes.forEach(node => node.classList.add("demeter-saturate"));
    }
  }
};

//-------------------------------------------------------------------------

D.SoundEffect = class {
  constructor(volume) {
    this.volume = volume;
    this.sound = new Howl({
      src: getAudioSource(D.preferences.systemDir + "/effect"),
      volume: this.volume,
      sprite: D.effectSprite,
      onloaderror: (notUsed, message) => logging.error("効果音読出: 失敗", new Error(getMediaErrorMessage(message))),
      onplayerror: (notUsed, message) => logging.error("効果音再生: 失敗", new Error(message)),
    });
  }

  start(sprite) {
    this.sound.play(sprite);
  }

  updateVolume(volume) {
    this.volume = volume;
    this.sound.volume(volume);
  }
};

const soundEffectSelect = () => {
  if (soundEffect) {
    soundEffect.start("select");
  }
};

const soundEffectCancel = () => {
  if (soundEffect) {
    soundEffect.start("cancel");
  }
};

const soundEffectBeep = () => {
  if (soundEffect) {
    soundEffect.start("beep");
  }
};

const soundEffectAlert = () => {
  if (soundEffect) {
    soundEffect.start("alert");
  }
};

const soundEffectTrophy = () => {
  if (soundEffect) {
    soundEffect.start("trophy");
  }
};

const soundEffectFocus = () => {
  if (soundEffect) {
    soundEffect.start("focus");
  }
};

//-------------------------------------------------------------------------

// 表示できるようになるまで待つ。
D.InterruptQueue = class {
  constructor() {
    this.queue = [];
  }

  push(task) {
    this.queue.push(task);
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  async dispatch() {
    D.trace("InterruptQueue dispatch", this.queue.length);
    while (!this.isEmpty()) {
      if (screenName === "title") {
        // アンロックまで遅延させる（アンロックの際に再度呼ばれる）。
        if (document.querySelector(".demeter-title-screen").classList.contains("demeter-title-unlock-audio")) {
          return;
        }
        await this.queue.shift()();

      } else if (screenName === "start") {
        setTimeout(async () => await this.dispatch(), 4000);
        return;

      } else if (screenName === "credits") {
        // タイトル画面に入る際にで処理する。
        return;

      } else {
        D.trace("InterruptQueue dispatch", screenName, waitForChoice, waitForDialog);
        if (waitForChoice || waitForDialog) {
          return;
        }
        await this.queue.shift()();
      }
    }
  }
};

// ダイアログ表示前後にスクリーンごとに必要な処理を行う。
D.interruptDialog = async task => {
  if (screenName === "title") {
    document.querySelector(".demeter-title-text").style.display = "none";
    hideTitleChoices();
    if (await task()) {
      return;
    }
    document.querySelector(".demeter-title-text").style.display = "block";
    await showTitleChoices();

  } else if (screenName === "main") {
    closeSystemUi();
    pause();
    if (await task()) {
      return;
    }
    restart();

  } else if (screenName === "history") {
    if (historyVoiceSprite) {
      historyVoiceSprite.pause();
    }
    if (await task()) {
      return;
    }
    if (historyVoiceSprite) {
      historyVoiceSprite.restart();
    }

  } else {
    if (await task()) {
      return;
    }
  }
};

D.compareVersionWeb = version => {
  if (typeof version !== "object" || typeof version.web !== "string") {
    throw new Error("invalid version object");
  }

  if (version.web === D.preferences.version.web) {
    return;
  }

  if (version.system && version.system < D.preferences.version.system) {
    return;
  }

  if (version.music && version.music < D.preferences.version.music) {
    return;
  }

  if (version.voice && version.voice < D.preferences.version.voice) {
    return;
  }

  return version.web;
};

D.compareVersionApp = version => {
  const thisVersion = D.getAppVersion().split(/\./).map(v => Number.parseInt(v));
  const thatVersion = version.version.split(/\./).map(v => Number.parseInt(v));
  for (let i = 0; i < Math.max(thisVersion.length, thatVersion.length); ++i) {
    const u = thisVersion[i] || 0;
    const v = thatVersion[i] || 0;
    if (u < v) {
      return version.version;
    } else if (u > v) {
      return;
    }
  }
};

D.UpdateChecker = class {
  constructor(timeout) {
    this.timeout = timeout;
    this.untilTime = Date.now();
    // アプリの場合は起動直後にチェックする。
    if (!D.isApp()) {
      this.untilTime += this.timeout;
    }
    this.status = undefined; // undefined, "checking" or "detected"
    this.version = undefined;
  }

  check() {
    if (this.status || this.untilTime > Date.now()) {
      return;
    }

    this.status = "checking";
    requestAnimationFrame(async () => {
      switch (D.isApp()) {
        case "ios":
          this.status = await this.checkIos();
          break;
        case "android":
          this.status = await this.checkAndroid();
          break;
        default:
          this.status = await this.checkWeb();
      }

      this.untilTime = Date.now() + this.timeout;

      if (this.status === "detected") {
        interruptQueue.push(async () => await D.interruptDialog(async () => await this.dialog()));
        await interruptQueue.dispatch();
      }
    });
  }

  async checkWeb() {
    try {
      const response = await fetch("version.json", { cache: "no-store" });
      this.version = await response.json();
      const result = D.compareVersionWeb(this.version);
      logging.debug("更新チェック: 成功");
      if (result) {
        logging.notice("更新検出: " + D.preferences.version.web + "→" + result);
        return "detected";
      }
    } catch (e) {
      logging.error("更新チェック: 失敗", e);
    }
  }

  async checkIos() {
    try {
      const response = await fetch("https://vaporoid.com/sys/version-" + D.isApp() + ".json", { cache: "no-store" });
      this.version = await response.json();
      const result = D.compareVersionApp(this.version);
      logging.debug("更新チェック: 成功");
      if (result) {
        logging.notice("更新検出: " + D.getAppVersion() + "→" + result);
        return "detected";
      }
    } catch (e) {
      logging.error("更新チェック: 失敗", e);
    }
  }

  async checkAndroid() {
    try {
      const result = await new Promise((resolve, reject) => {
        globalThis.demeterGetAppUpdateInfo = (result, error) => {
          if (result !== undefined) {
            resolve(result);
          } else if (error !== undefined) {
            reject(error);
          } else {
            reject("canceled");
          }
        };
        demeterAndroid.getAppUpdateInfo();
      });

      logging.debug("更新チェック: 成功");
      D.trace(result);

      this.version = result;
      if (result.updateAvailability === "UPDATE_AVAILABLE" && result.isImmediateUpdateAllowed) {
        logging.notice("更新検出: #" + result.versionCode + "→#" + result.availableVersionCode);
        return "detected";
      }
    } catch (e) {
      logging.error("更新チェック: 失敗", e);
    }
    globalThis.demeterGetAppUpdateInfo = undefined;
  }

  async dialog() {
    soundEffectAlert();
    switch (D.isApp()) {
      case "ios":
        if (await dialog("system-update-ios") === "yes") {
          open(this.version.url, "_blank", "noopener,noreferrer");
        }
        break;
      case "android":
        if (await dialog("system-update-android-in-app") === "yes") {
          demeterAndroid.startImmediateUpdateFlow();
        }
        break;
      default:
        const key = screenName === "title" ? "system-update-title" : "system-update";
        if (await dialog(key) === "yes") {
          location.href = "game.html?t=" + Date.now();
          return true;
        }
    }
  }
};

//-------------------------------------------------------------------------

const systemDefault = {
  id: "system",
  scaleLimit: true,
  speed: 30,
  autoSpeed: 400,
  skipUnread: false,
  skipSpeed: 100,
  masterVolume: 1,
  musicVolume: 1,
  voiceVolume: 1,
  effectVolume: 1,
  historySize: 50,
  gamepadSwapAB: false,
  componentColor: [1, 1, 1],
  componentOpacity: 0.25,
  logging: true,
  audioVisualizer: true,
  frameRateVisualizer: true,
  lipSync: true,
  silhouette: true,
  unionSetting: "ろうそ",

  /*
   キーリピートの既定値を参考にゲームパッドのリピートを設定する。
   | Win | AutoRepeatDelay  | 1000ms |     |
   |     | AutoRepeatRate   |  500ms |     |
   | Mac | InitialKeyRepeat |  375ms | 25F |
   |     | KeyRepeat        |   90ms |  6F |
   */
  repeatDelay: 425,
  repeatRate: 102,

  // 疑似的に二重入力を発生させてデバッグする。
  dupKeyboardInput: false,
  dupGamepadInput: false,

  creditsSpeed: 2000,
};

const gameStateDefault = {
  id: "game",
};

const readStateDefault = {
  id: "read",
  map: new Map(),
};

const trophiesStateDefault = {
  id: "trophies",
  map: new Map(),
};

const historyStateDefault = {
  id: "history",
  paragraphs: [],
};

const saveNewGame = {
  paragraphIndex: D.scenario.labels["ニューゲーム"],
  state: {},
};

const saveSelect = {
  paragraphIndex: D.scenario.labels["節選択"],
  state: {},
};

const saveTutorial = {
  paragraphIndex: D.scenario.labels["チュートリアル"],
  state: {},
};

const savePreview = {
  paragraphIndex: D.scenario.labels["プレビュー"],
  state: {},
};

const savePostscript = {
  paragraphIndex: D.scenario.labels["あとがき"],
  state: {},
};

const logging = new D.Logging();

const sender = {
  twitter: async () => {
    open("https://twitter.com/intent/tweet?screen_name=vaporoid&text=%23%E6%98%AD%E5%92%8C%E6%A8%AA%E6%BF%B1%E7%89%A9%E8%AA%9E", "_blank", "noopener,noreferrer");
    await updateTrophy("sender");
  },
  marshmallow: async () => {
    open("https://marshmallow-qa.com/vaporoid", "_blank", "noopener,noreferrer");
    await updateTrophy("sender");
  }
};

let database;
let system;
let playState;
let pauseState;
let gameState;
let readState;
let trophiesState;
let state;

let screenOrientation;
let screenWidth;
let screenHeight;
let screenScale;
let screenNamePrev;
let screenName;
let systemUi;
let systemUiDebugCommandsFolder;

let backgroundTransition;
let trophyAnimationQueue = [];
let iconAnimation;
let musicPlayer;
let soundEffect;
let audioVisualizer;
let frameRateVisualizer;
let lipSync;
let silhouette;
let place;

let paragraphLockState;
let paragraphIndexPrev;
let paragraphIndexSave;
let paragraphIndexLast;
let paragraphIndex;
let paragraph;
let paragraphLineNumber;
let textAnimations;
let textAnimation;
let voiceSound;
let voiceSprite;
let choices;
let waitForChoice;
let waitForStart;
let waitForStartScreen;
let waitForStop;
let waitForDialog;
let waitForCredits;

let interruptQueue;
let updateChecker;

let mainToHistoryScreenOnce;
let historyState;
let historyBuilding;
let historyBuildingStop;
let historyParagraphNodes;
let historyVoiceSprite;
let historyParagraphIndex;

let inputDevice;
let inputHoverable;

let dialogKey;
let dialogFile;

//-------------------------------------------------------------------------

const cacheImpl = async (sourceUrls) => {
  const cache = await caches.open("昭和横濱物語");
  const targetUrls = [];
  for (let i = 0; i < sourceUrls.length; ++i) {
    const url = sourceUrls[i];
    if (!await cache.match(url)) {
      targetUrls.push(url);
    }
  }
  if (targetUrls.length > 0) {
    await cache.addAll(targetUrls);
  }
  return targetUrls;
};

D.cache = sourceUrls => {
  if (!D.useCacheStorage()) {
    D.trace("useCacheStorage = no", sourceUrls);
    return;
  }

  cacheImpl(sourceUrls).then(targetUrls => {
    D.trace("addCache", sourceUrls, targetUrls);
  }).catch(e => {
    D.trace("addCache", sourceUrls, e);
  });
};

const getBackgroundImageUrls = () => {
  return [ "portrait", "landscape", "portrait-kcode", "landscape-kcode" ].map(name => D.preferences.systemDir + "/bg-" + name + ".jpg");
};

const getAudioExtension = () => D.preferences.audioExtensions.find(extension => Howler.codecs(extension));
const getAudioSource = basename => {
  if (D.isApp() === "ios") {
    return "demeter:///" + basename + "." + getAudioExtension();
  } else {
    return basename + "." + getAudioExtension();
  }
};

const getMusicUrls = () => {
  return Object.keys(musicNames).map(key => getAudioSource(D.preferences.musicDir + "/sessions_" + key));
};

const getVoiceUrls = paragraphIndices => {
  return paragraphIndices.map(paragraphIndex => getAudioSource(D.preferences.voiceDir + "/" + D.padStart(paragraphIndex, 4)));
};

const isDeleteOldCacheTarget = url => {
  // 絶対パスを計算する。
  const systemUrl = new URL(D.preferences.systemDir, location.href);
  const musicUrl = new URL(D.preferences.musicDir, location.href);
  const voiceUrl = new URL(D.preferences.voiceDir, location.href);
  const pathname = url.pathname;
  return !pathname.startsWith(systemUrl.pathname) && !pathname.startsWith(musicUrl.pathname) && !pathname.startsWith(voiceUrl.pathname);
};

const deleteOldCachesImpl = async () => {
  const cache = await caches.open("昭和横濱物語");
  const keys = await cache.keys();
  const deletedUrls = [];
  for (let i = 0; i < keys.length; ++i) {
    const request = keys[i];
    if (isDeleteOldCacheTarget(new URL(request.url))) {
      if (await cache.delete(request)) {
        deletedUrls.push(request.url);
      }
    }
  }
  return deletedUrls;
};

const deleteOldCaches = () => {
  if (!D.useCacheStorage()) {
    D.trace("useCacheStorage = no");
    return;
  }

  deleteOldCachesImpl().then(deletedUrls => {
    D.trace("deleteOldCaches", deletedUrls);
  }).catch(e => {
    D.trace("deleteOldCaches", e);
  });
};

//-------------------------------------------------------------------------

const subtle = crypto.subtle;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const getBackupKey = async () => {
  if (subtle) {
    const keyData = textEncoder.encode("EVANGELIUM SECUNDUM STEPHANUS");
    return await subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, [ "sign", "verify" ]);
  }
};

const signBackup = async jsonData => {
  if (subtle) {
    return await subtle.sign("HMAC", await getBackupKey(), jsonData);
  } else {
    // ちょうど32文字
    return textEncoder.encode("[Web Cryptography API not found]");
  }
};

const verifyBackup = async (signatureData, jsonData) => {
  if (subtle) {
    return await subtle.verify("HMAC", await getBackupKey(), signatureData, jsonData);
  } else {
    return false;
  }
};

const dumpBackupWeb = (magicData, signatureData, jsonData) => {
  const blob = new Blob([ magicData, signatureData, jsonData ], { type: "applicaiton/octet-stream" });
  const url = URL.createObjectURL(blob);

  const template = document.createElement("template");
  template.innerHTML = `
    <a href="${url}" download="昭和横濱物語バックアップ.dat">バックアップデータを出力する</a>
  `;
  const node = document.querySelector(".demeter-offscreen").appendChild(template.content.firstElementChild);
  node.dispatchEvent(new MouseEvent("click"));

  // 10秒後に削除する
  setTimeout(() => {
    node.remove();
    URL.revokeObjectURL(url);
  }, 10000);
};

const dumpBackupIos = async (magicData, signatureData, json) => {
  const header = [ ...magicData, ...new Uint8Array(signatureData) ];
  await webkit.messageHandlers.demeterDumpBackup.postMessage([ header, json ]);
};

const dumpBackupAndroid = (magicData, signatureData, json) => {
  const header = [ ...magicData, ...new Uint8Array(signatureData) ];
  demeterAndroid.dumpBackup(JSON.stringify(header), json);
};

const dumpBackup = async () => {
  try {
    const [ system, game, read, trophies, autosave, save1, save2, save3, history ] = await Promise.all([
      database.get("system", "system"),
      database.get("game", "game"),
      database.get("read", "read"),
      database.get("trophies", "trophies"),
      database.get("save", "autosave"),
      database.get("save", "save1"),
      database.get("save", "save2"),
      database.get("save", "save3"),
      database.get("history", "history"),
    ]);
    const root = {
      dbVersion: database.version,
      userAgent: navigator.userAgent,
      webVersion: D.preferences.version.web,
      system: system,
      game: game,
      read: read,
      trophies: trophies,
      autosave: autosave,
      save1: save1,
      save2: save2,
      save3: save3,
      history: history,
    };
    const json = JSON.stringify(root, (k, v) => v instanceof Map ? [...v.keys()] : v, 2);
    const jsonData = textEncoder.encode(json);

    const signatureData = await signBackup(jsonData);
    const magicData = Uint8Array.from([ 0, signatureData.byteLength ]);
    const blob = new Blob([ magicData, signatureData, jsonData ], { type: "applicaiton/octet-stream" });

    D.trace(D.isApp(), magicData, signatureData);
    switch (D.isApp()) {
      case "ios":
        await dumpBackupIos(magicData, signatureData, json);
        break;
      case "android":
        dumpBackupAndroid(magicData, signatureData, json);
        break;
      default:
        dumpBackupWeb(magicData, signatureData, jsonData);
    }

    logging.info("バックアップデータ出力: 成功");
  } catch (e) {
    logging.error("バックアップデータ出力: 失敗", e);
  }
};

const readBackup = async blob => {
  try {
    const buffer = await blob.arrayBuffer();

    const headerData = new Uint8Array(buffer, 0, 2);
    if (headerData[0] !== 0 || headerData[1] !== 32) {
      return [];
    }

    const signatureData = new Uint8Array(buffer, 2, 32);
    const jsonData = new Uint8Array(buffer, 34);
    const json = textDecoder.decode(jsonData);
    const root = JSON.parse(json);
    const result = await verifyBackup(signatureData, jsonData);

    return [ result, root ];
  } catch (e) {
    D.trace("readBackup", e);
    return [];
  }
};

const restoreBackupImpl = async root => {
  const V = 600125580000;
  await stop();

  try {
    Object.entries(systemDefault).forEach(([k, v]) => system[k] = v);
    Object.entries(root.system).forEach(([k, v]) => system[k] = v);
    updateSystemUi();

    gameState = root.game;
    setItemDefault(gameState, gameStateDefault);

    readState = {};
    setItemDefault(readState, readStateDefault);
    readState.map = new Map(root.read.map.map(k => [k, V]));

    trophiesState = {};
    setItemDefault(trophiesState, trophiesStateDefault);
    trophiesState.map = new Map(root.trophies.map.map(k => [k, V]));
    updateTrophies();

    historyState = root.history;
    setItemDefault(historyState, historyStateDefault);

    await Promise.all([
      putSystem(),
      putGameState(),
      putReadState(),
      putTrophiesState(),
      putHistoryState(),
      restoreSave("autosave", "自動セーブデータ", root.autosave),
      restoreSave("save1", "セーブデータ#1", root.save1),
      restoreSave("save2", "セーブデータ#2", root.save2),
      restoreSave("save3", "セーブデータ#3", root.save3),
    ]);

    logging.info("バックアップデータ復元: 成功");
  } catch (e) {
    logging.error("バックアップデータ復元: 失敗", e);
  }

  leaveMainScreen();
  await enterTitleScreen();
};

const restoreBackupWeb = async () => {
  soundEffectSelect();
  closeSystemUi();
  pause();

  while (true) {
    const dialogResult = await dialog("system-restore-drop");
    if (dialogResult === "file") {
      const [ result, root ] = await readBackup(dialogFile);
      if (result) {
        if (await dialog("system-restore") === "yes") {
          await restoreBackupImpl(root);
        }
      } else if (root) {
        if (await dialog("system-restore-integrity-error") === "yes") {
          await restoreBackupImpl(root);
        }
      } else {
        await dialog("system-restore-format-error");
      }
    } else if (dialogResult === "yes") {
      document.querySelector(".demeter-dialog-file-form").reset();
      document.querySelector(".demeter-dialog-file").dispatchEvent(new MouseEvent("click"));
      continue;
    }
    break;
  }

  restart();
};

const restoreBackupIos = async () => {
  soundEffectSelect();
  closeSystemUi();
  pause();

  if (await dialog("system-restore-ios") === "file") {
    const [ result, root ] = await readBackup(dialogFile);
    if (result) {
      if (await dialog("system-restore") === "yes") {
        await restoreBackupImpl(root);
      }
    } else if (root) {
      if (await dialog("system-restore-integrity-error") === "yes") {
        await restoreBackupImpl(root);
      }
    } else {
      await dialog("system-restore-format-error");
    }
  }

  restart();
};

const restoreBackup = async () => {
  switch (D.isApp()) {
    case "ios":
      await restoreBackupIos();
      break;
    case "android":
      demeterAndroid.restoreBackup();
      break;
    default:
      await restoreBackupWeb();
  }
};

globalThis.demeterRestoreBackup = url => {
  if (dialogKey === "system-restore-ios" && waitForDialog) {
    (async () => {
      const response = await fetch(url, { cache: "no-store" });
      dialogFile = await response.blob();
      waitForDialog(0);
    })().then(() => {
      D.trace("demeterRestoreBackup");
    }).catch(e => {
      D.trace("demeterRestoreBackup", e);
    });
  } else {
    interruptQueue.push(async () => await D.interruptDialog(async () => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        const blob = await response.blob();
        const [ result, root ] = await readBackup(blob);

        if (result) {
          if (await dialog("system-restore") === "yes") {
            await restoreBackupImpl(root);
          }
        } else if (root) {
          if (await dialog("system-restore-integrity-error") === "yes") {
            await restoreBackupImpl(root);
          }
        } else {
          await dialog("system-restore-format-error");
        }
      } catch (e) {
        logging.error("バックアップデータ復元: 失敗", e);
      }
    }));
    interruptQueue.dispatch().then(() => {
      D.trace("demeterRestoreBackup");
    }).catch(e => {
      D.trace("demeterRestoreBackup", e);
    });
  }
};

//-------------------------------------------------------------------------

const putSystem = async () => {
  try {
    await database.put("system", system);
    logging.debug("システム設定書込: 成功");
  } catch (e) {
    logging.error("システム設定書込: 失敗", e);
  }
};

const cancelPlayStateImpl = async skipCanceled => {
  document.querySelector(".demeter-main-menu-frame .demeter-button4").classList.remove("demeter-active");
  document.querySelector(".demeter-main-menu-frame .demeter-button5").classList.remove("demeter-active");
  if (skipCanceled) {
    // SKIPが解除されたら自動保存する。
    await Promise.all([ putReadState(), putAutosave(), putHistoryState() ]);
  }
};

// ユーザ操作が行われたらAUTO/SKIPを解除する。
const cancelPlayState = async () => {
  const skipCanceled = playState === "skip";
  playState = undefined;

  // 時間がかかる処理はあとにまわす。
  await cancelPlayStateImpl(skipCanceled);
};

const putGameState = async () => {
  try {
    await database.put("game", gameState);
    logging.debug("共通セーブデータ書込: 成功");
  } catch (e) {
    logging.error("共通セーブデータ書込: 失敗", e);
  }
};

const putReadState = async () => {
  try {
    await database.put("read", readState);
    logging.debug("既読データ書込: 成功");
  } catch (e) {
    logging.error("既読データ書込: 失敗", e);
  }
};

const putTrophiesState = async () => {
  try {
    await database.put("trophies", trophiesState);
    logging.debug("実績データ書込: 成功");
  } catch (e) {
    logging.error("実績データ書込: 失敗", e);
  }
};

const putAutosave = async () => {
  try {
    await database.put("save", {
      id: "autosave",
      saved: Date.now(),
      paragraphIndex: paragraphIndexSave,
      state: state,
    });
    logging.debug("自動セーブデータ書込: 成功");
  } catch (e) {
    logging.error("自動セーブデータ書込: 失敗", e);
  }
};

const deleteAutosave = async () => {
  try {
    await database.delete("save", "autosave");
    logging.debug("自動セーブデータ削除: 成功");
  } catch (e) {
    logging.error("自動セーブデータ削除: 失敗", e);
  }
};

const putSave = async (key, name) => {
  try {
    await database.put("save", {
      id: key,
      saved: Date.now(),
      paragraphIndex: paragraphIndexSave,
      state: state,
    });
    logging.debug(name + "書込: 成功");
  } catch (e) {
    logging.error(name + "書込: 失敗", e);
  }
};

const restoreSave = async (key, name, object) => {
  if (object) {
    try {
      await database.put("save", object);
      logging.debug(name + "書込: 成功");
    } catch (e) {
      logging.error(name + "書込: 失敗", e);
    }
  } else {
    try {
      await database.delete("save", key);
      logging.debug(name + "削除: 成功");
    } catch (e) {
      logging.error(name + "削除: 失敗", e);
    }
  }
};

const deleteSave = async (key, name) => {
  try {
    await database.delete("save", key);
    logging.debug(name + "削除: 成功");
  } catch (e) {
    logging.error(name + "削除: 失敗", e);
  }
};

const setSave = save => {
  paragraphIndexPrev = save.paragraphIndex - 1;
  paragraphIndexSave = save.paragraphIndex;
  paragraphIndexLast = undefined;
  paragraphIndex = undefined;
  state = save.state;

  // メイン画面に戻る前に段落表示をクリアする。
  document.querySelector(".demeter-main-paragraph-text").replaceChildren();
};

const setScreenName = screenNameNext => {
  screenNamePrev = screenName;
  screenName = screenNameNext;
};

const putHistoryState = async () => {
  try {
    await database.put("history", historyState);
    logging.debug("履歴データ書込: 成功");
  } catch (e) {
    logging.error("履歴データ書込: 失敗", e);
  }
};

const evaluate = async action => {
  const result = await action(state, {
    system: system,
    game: gameState,
    read: readState,
    logging: logging,
    sender: sender,
    trophy: updateTrophy,
  });
  await Promise.all([ putGameState(), putAutosave() ]);
  return result;
};

//-------------------------------------------------------------------------

const updateTrophies = () => {
  D.trophies.forEach(trophy => {
    if (trophiesState.map.has(trophy.key)) {
      document.querySelector(".demeter-credits-trophy-" + trophy.key).classList.add("demeter-unlocked");
    } else {
      document.querySelector(".demeter-credits-trophy-" + trophy.key).classList.remove("demeter-unlocked");
    }
  });
  document.querySelector(".demeter-credits-end-trophies-status").textContent = trophiesState.map.size + " / " + D.trophies.length;
};

const updateTrophyImpl = async trophy => {
  updateTrophies();

  logging.notice("実績解除: " + trophy.name);
  logging.info(trophy.description);

  const T1 = 1000;
  const T2 = 2000;
  const T3 = 1000;

  trophyAnimationQueue.push(async () => {
    soundEffectTrophy();
    [...document.querySelectorAll(".demeter-notice-trophy-name")].forEach(node => node.textContent = trophy.name);
    const nodes = [...document.querySelectorAll(".demeter-notice")];
    nodes.forEach(node => node.style.opacity = "0");
    await new D.OpacityAnimation(nodes, 0, 1, T1).start();
    await D.setTimeout(T2);
    await new D.OpacityAnimation(nodes, 1, 0, T3).start();
  });
  if (trophyAnimationQueue.length === 1) {
    while (trophyAnimationQueue.length > 0) {
      await trophyAnimationQueue[0]();
      trophyAnimationQueue.shift();
    }
  }
};

// トロフィーが未獲得であれば獲得する。
const updateTrophy = async key => {
  if (!trophiesState.map.has(key)) {
    trophiesState.map.set(key, Date.now());
    await putTrophiesState();
    const trophy = D.trophies.find(trophy => trophy.key === key);
    if (trophy) {
      updateTrophyImpl(trophy).then(() => {
        D.trace("updateTrophyImpl", trophy);
      }).catch(e => {
        D.trace("updateTrophyImpl", trophy, e);
      });
    }
  }
};

const checkTrophies = async () => {
  if (readState.map.size >= D.scenario.total * 0.5) {
    await updateTrophy("half");
  }
  if (readState.map.size >= D.scenario.total) {
    await updateTrophy("full");
  }
};

//-------------------------------------------------------------------------

const enableTitleChoice = node => {
  [
    node.querySelector(".demeter-button"),
    node.querySelector(".demeter-title-choice-text"),
  ].forEach(node => node.classList.remove("demeter-disabled"));
};

const disableTitleChoice = node => {
  [
    node.querySelector(".demeter-button"),
    node.querySelector(".demeter-title-choice-text"),
  ].forEach(node => node.classList.add("demeter-disabled"));
};

const showTitleChoices = async () => {
  const autosave = await database.get("save", "autosave");
  if (autosave) {
    enableTitleChoice(document.querySelector(".demeter-title-choice3"));
  } else {
    disableTitleChoice(document.querySelector(".demeter-title-choice3"));
  }

  if (gameState.visitedCredits) {
    enableTitleChoice(document.querySelector(".demeter-title-choice4"));
  } else {
    disableTitleChoice(document.querySelector(".demeter-title-choice4"));
  }

  disableTitleChoice(document.querySelector(".demeter-title-choice5"));

  enableTitleChoice(document.querySelector(".demeter-title-choice6"));

  document.querySelector(".demeter-title-choices").style.display = "block";
};

const hideTitleChoices = () => {
  document.querySelector(".demeter-title-choices").style.display = "none";
};

const suspendAudioContext = async quiet => {
  try {
    await Howler.ctx.suspend();
    if (!quiet) {
      logging.info("オーディオ一時停止: 成功");
    }
  } catch (e) {
    if (!quiet) {
      logging.error("オーディオ一時停止: 失敗", e);
    } else {
      D.trace("Howler.ctx.suspend", e);
    }
  }
};

const resumeAudioContext = async quiet => {
  try {
    await Howler.ctx.resume();
    if (!quiet) {
      logging.info("オーディオ再開: 成功");
    }
  } catch (e) {
    if (!quiet) {
      logging.error("オーディオ再開: 失敗", e);
    } else {
      D.trace("Howler.ctx.resume", e);
    }
  }
};

const resetAudioContext = async quiet => {
  await D.setTimeout(100);
  await suspendAudioContext(quiet);
  await D.setTimeout(100);
  await resumeAudioContext(quiet);
};

const onVisibilityChange = async () => {
  D.trace("onVisibilityChange", document.visibilityState);
  if (document.visibilityState === "visible") {
    await D.setTimeout(100);
    await resetAudioContext(true);
  } else {
    await suspendAudioContext(true);
  }
};

const setupAudioContextHandler = () => {
  if (D.isApp()) {
    document.addEventListener("visibilitychange", onVisibilityChange);
  } else {
    // Mobile Safari
    const isSafari = navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
    if (isSafari && document.ontouchend !== undefined) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }
  }
};

const unlockAudioCore = async () => {
  soundEffect = new D.SoundEffect(system.effectVolume);
  setupAudioContextHandler();

  const screenNode = document.querySelector(".demeter-title-screen");
  screenNode.removeEventListener("click", unlockAudio);
  screenNode.addEventListener("click", checkDebugMode);

  screenNode.classList.remove("demeter-title-unlock-audio");
  if (iconAnimation) {
    iconAnimation.stop();
    iconAnimation = undefined;
  }
  await showTitleChoices();

  const color = D.toCssColor(...system.componentColor, system.componentOpacity);
  audioVisualizer = new D.AudioVisualizer(fontSize * 10, fontSize * 5, color);
  audioVisualizer.canvas.style.display = "block";
  audioVisualizer.canvas.style.position = "absolute";
  document.querySelector(".demeter-main-audio-visualizer").append(audioVisualizer.canvas);
};

const unlockAudio = async () => {
  musicPlayer.resetUnlock();
  unlockAudioCore();
  logging.info("オーディオロック: 解除");

  if (D.useServiceWorker() && navigator.serviceWorker.controller) {
    const message = await Promise.any([
      new Promise(resolve => {
        let started;

        const onMessage = ev => {
          navigator.serviceWorker.removeEventListener("message", onMessage);

          const finished = performance.now();
          D.trace("serviceWorker onMessage", finished, finished - started);
          resolve(ev.data);
        };
        navigator.serviceWorker.addEventListener("message", onMessage, { once: true });

        started = performance.now();
        D.trace("serviceWorker postMessage", started);
        navigator.serviceWorker.controller.postMessage({ method: "getClients", messageId: "" });
      }),
      D.setTimeout(500),
    ]);

    if (message) {
      logging.info("サービスワーカ通信: 成功");
      const regexPathname = /^\/sys\/game.*\.html$/;
      if (message.body.filter(client => regexPathname.test(new URL(client.url).pathname)).length > 1) {
        soundEffectAlert();
        document.querySelector(".demeter-title-text").style.display = "none";
        hideTitleChoices();
        await dialog("system-multiple");
        document.querySelector(".demeter-title-text").style.display = "block";
        await showTitleChoices();
      }
    } else {
      logging.error("サービスワーカ通信: 失敗", new Error("timed out"));
    }
  }

  if (!interruptQueue.isEmpty()) {
    await interruptQueue.dispatch();
  }
};

//-------------------------------------------------------------------------

const upgradeDatabase = (db, oldVersion, newVersion) => {
  D.trace("upgradeDatabase", oldVersion, newVersion);
  for (let version = oldVersion + 1; version <= newVersion; ++version) {
    switch (version) {
      case 1:
        db.createObjectStore("system", { keyPath: "id" });
        break;
      case 2:
        db.createObjectStore("save", { keyPath: "id" });
        break;
      case 3:
        db.createObjectStore("game", { keyPath: "id" });
        db.createObjectStore("read", { keyPath: "id" });
        break;
      case 4:
        db.createObjectStore("trophies", { keyPath: "id" });
        break;
      case 5:
        db.createObjectStore("history", { keyPath: "id" });
        break;
    }
  }
};

const setItemDefault = (item, itemDefault) => {
  Object.entries(itemDefault).forEach(([k, v]) => {
    if (item[k] === undefined) {
      if (typeof v === "object") {
        if (v instanceof Array) {
          item[k] = [...v];
        } else if (v instanceof Map) {
          item[k] = new Map(v);
        } else {
          item[k] = v;
        }
      } else {
        item[k] = v;
      }
    }
  });
};

const initializeDatabase = async () => {
  try {
    database = await idb.openDB("昭和横濱物語", 5, { upgrade: upgradeDatabase });

    system = await database.get("system", "system") || {};
    setItemDefault(system, systemDefault);
    await database.put("system", system);

    gameState = await database.get("game", "game") || {};
    setItemDefault(gameState, gameStateDefault);
    await database.put("game", gameState);

    readState = await database.get("read", "read") || {};
    setItemDefault(readState, readStateDefault);
    await database.put("read", readState);

    trophiesState = await database.get("trophies", "trophies") || {};
    setItemDefault(trophiesState, trophiesStateDefault);
    await database.put("trophies", trophiesState);
    updateTrophies();

    historyState = await database.get("history", "history") || {};
    setItemDefault(historyState, historyStateDefault);
    await database.put("history", historyState);
    initializeHistory();

    logging.info("ローカルデータベース接続: 成功");
  } catch (e) {
    logging.error("ローカルデータベース接続: 失敗", e);
  }
};

//-------------------------------------------------------------------------

const updateScaleLimit = async () => {
  await onResize();
};

const updateSpeed = () => {
  if (textAnimations) {
    textAnimations.forEach(textAnimation => textAnimation.updateSpeed(system.speed));
  }
};

const updateMasterVolume = () => {
  if (Howler.masterGain) {
    Howler.volume(system.masterVolume);
  }
};

const updateMusicVolume = () => {
  if (musicPlayer) {
    musicPlayer.updateVolume(system.musicVolume);
  }
};

const updateVoiceVolume = () => {
  if (voiceSprite) {
    voiceSprite.updateVolume(system.voiceVolume);
  }
};

const updateEffectVolume = () => {
  if (soundEffect) {
    soundEffect.updateVolume(system.effectVolume);
  }
};

const updateComponentColor = () => {
  document.documentElement.style.setProperty("--component-color", D.toCssColor(...system.componentColor));
  document.documentElement.style.setProperty("--component-opacity", system.componentOpacity);

  const color = D.toCssColor(...system.componentColor, system.componentOpacity);
  if (audioVisualizer) {
    audioVisualizer.updateColor(color);
  }
  frameRateVisualizer.updateColor(color);
  lipSync.updateColor([ ...system.componentColor, system.componentOpacity ]);
  silhouette.updateColor(color);
};

const updateComponents = () => {
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;

  let top;
  let spacing;
  if (W <= H) {
    top = fontSize * 7;
    spacing = fontSize;
  } else {
    top = fontSize;
    spacing = fontSize * 0.5;
  }

  if (system.logging) {
    const node = document.querySelector(".demeter-main-logging");
    node.style.display = "block";
    node.style.top = D.numberToCss(top);
    top += fontSize * 5 + spacing;
  } else {
    const node = document.querySelector(".demeter-main-logging");
    node.style.display = "none";
  }

  if (system.audioVisualizer) {
    const node = document.querySelector(".demeter-main-audio-visualizer");
    node.style.display = "block";
    node.style.top = D.numberToCss(top);
    top += fontSize * 5 + spacing;
  } else {
    const node = document.querySelector(".demeter-main-audio-visualizer");
    node.style.display = "none";
  }

  if (system.frameRateVisualizer) {
    const node = document.querySelector(".demeter-main-frame-rate-visualizer");
    node.style.display = "block";
    node.style.top = D.numberToCss(top);
    top += fontSize * 5 + spacing;
  } else {
    const node = document.querySelector(".demeter-main-frame-rate-visualizer");
    node.style.display = "none";
  }

  if (system.lipSync) {
    const node = document.querySelector(".demeter-main-lip-sync");
    node.style.display = "block";
    if (screenOrientation === "orientationPortrait") {
      node.style.left = D.numberToCss(fontSize);
      node.style.top = D.numberToCss(top);
    } else {
      if (top <= fontSize * 7) {
        node.style.left = D.numberToCss(fontSize);
      } else {
        node.style.left = D.numberToCss(fontSize * 12);
      }
      top = fontSize * 7;
      node.style.top = D.numberToCss(top);
    }
    top += fontSize * 10 + spacing;
  } else {
    const node = document.querySelector(".demeter-main-lip-sync");
    node.style.display = "none";
  }

  if (system.silhouette) {
    const node = document.querySelector(".demeter-main-silhouette");
    node.style.display = "block";
  } else {
    const node = document.querySelector(".demeter-main-silhouette");
    node.style.display = "none";
  }
};

const initializeComponents = () => {
  const color = D.toCssColor(...system.componentColor, system.componentOpacity);
  frameRateVisualizer = new D.FrameRateVisualizer(fontSize * 10, fontSize * 5, fontSize * 0.5, "'Share Tech Mono', monospace", color);
  frameRateVisualizer.canvas.style.display = "block";
  frameRateVisualizer.canvas.style.position = "absolute";
  document.querySelector(".demeter-main-frame-rate-visualizer").append(frameRateVisualizer.canvas);
  lipSync = new D.LipSync(fontSize * 2.5, fontSize * 2, [ ...system.componentColor, system.componentOpacity ]);
  lipSync.canvas.style.display = "block";
  lipSync.canvas.style.position = "absolute";
  document.querySelector(".demeter-main-lip-sync-lip").append(lipSync.canvas);
  silhouette = new D.Silhouette(fontSize * 16, fontSize * 25, color);
  silhouette.canvas.style.display = "block";
  silhouette.canvas.style.position = "absolute";
  document.querySelector(".demeter-main-silhouette").append(silhouette.canvas);

  updateComponentColor();
  updateComponents();

  logging.info("コンポーネント初期化: 完了");
};

//-------------------------------------------------------------------------

const openSystemUi = () => {
  const systemUiNode = document.querySelector(".demeter-main-system-ui");
  systemUiNode.style.display = "block";
  systemUi.show();
  systemUi.openAnimated();
};

const closeSystemUi = () => {
  systemUi.openAnimated(false);
};

const updateSystemUi = () => {
  [ systemUi, ...systemUi.folders ].forEach(ui => ui.controllers.forEach(controller => controller.updateDisplay()));

  updateScaleLimit();
  updateSpeed();
  updateMasterVolume();
  updateMusicVolume();
  updateVoiceVolume();
  updateEffectVolume();
  updateHistorySize();
  updateComponentColor();
  updateComponents();
};

// gui.addFolderはtouchStylesを継承しないので自前で構築する。
const addSystemUiFolder = (gui, title) => {
  const folder = new lil.GUI({
    parent: gui,
    title: title,
    touchStyles: false,
  });
  return folder;
};

let updateSystemUiFullscreen;

// 実際のサイズはtransformのscale(1.5)がかかることに注意
const initializeSystemUi = () => {
  initializeComponents();

  const systemUiNode = document.querySelector(".demeter-main-system-ui");

  systemUi = new lil.GUI({
    container: systemUiNode,
    width: fontSize * 12,
    title: "システム設定",
    touchStyles: false,
  });
  systemUi.onFinishChange(putSystem);

  // 開閉のトランジションが始まる前に呼ばれる。
  systemUi.onOpenClose(ui => {
    if (ui._closed) {
      // 配下のフォーカスを外す。
      [...ui.$children.querySelectorAll(".demeter-focus")].forEach(node => node.classList.remove("demeter-focus"));

      // ルートの場合はタイトルのフォーカスも外す。
      if (!ui.parent) {
        ui.$title.classList.remove("demeter-focus");
      }
    }
  });

  systemUi.add(system, "scaleLimit").name("画面拡大率上限").onChange(updateScaleLimit);
  systemUi.add(system, "speed", 0, 100, 1).name("文字表示時間 [ms]").onChange(updateSpeed);
  systemUi.add(system, "autoSpeed", 0, 1000, 10).name("自動再生待ち時間 [ms]");
  systemUi.add(system, "skipUnread").name("未読スキップ");
  systemUi.add(system, "skipSpeed", 0, 1000, 10).name("スキップ待ち時間 [ms]");
  systemUi.add(system, "masterVolume", 0, 1, 0.01).name("全体の音量 [0-1]").onChange(updateMasterVolume);
  systemUi.add(system, "musicVolume", 0, 1, 0.01).name("音楽の音量 [0-1]").onChange(updateMusicVolume);
  systemUi.add(system, "voiceVolume", 0, 1, 0.01).name("音声の音量 [0-1]").onChange(updateVoiceVolume);
  systemUi.add(system, "effectVolume", 0, 1, 0.01).name("効果の音量 [0-1]").onChange(updateEffectVolume);
  systemUi.add(system, "historySize", 0, 500, 10).name("履歴保持数 [個]").onFinishChange(updateHistorySize);
  systemUi.add(system, "gamepadSwapAB").name("ゲームパッドAB入替");

  const componentFolder = addSystemUiFolder(systemUi, "コンポーネント設定");
  componentFolder.addColor(system, "componentColor").name("色 [#RGB]").onChange(updateComponentColor);
  componentFolder.add(system, "componentOpacity", 0, 1, 0.01).name("不透明度 [0-1]").onChange(updateComponentColor);
  componentFolder.add(system, "logging").name("表示: ロギング").onChange(updateComponents);
  componentFolder.add(system, "audioVisualizer").name("表示: オーディオ").onChange(updateComponents);
  componentFolder.add(system, "frameRateVisualizer").name("表示: フレームレート").onChange(updateComponents);
  componentFolder.add(system, "lipSync").name("表示: リップシンク").onChange(updateComponents);
  componentFolder.add(system, "silhouette").name("表示: シルエット").onChange(updateComponents);
  componentFolder.add(system, "unionSetting", [ "ろうそ", "ろうくみ" ]).name("設定: 労組");

  const commands = {};

  commands.fullscreen = async () => {
    soundEffectSelect();
    closeSystemUi();
    if (D.getFullscreenElement() === null) {
      try {
        await D.requestFullscreen(document.body);
      } catch (e) {
        logging.error("全画面表示モード切替: 失敗", e);
      }
    } else {
      try {
        await D.exitFullscreen();
      } catch (e) {
        logging.error("ウィンドウモード切替: 失敗", e);
      }
    }
  };

  commands.backToTitle = async () => {
    if (waitForDialog) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    closeSystemUi();
    pause();
    if (await dialog("system-back-to-title") === "yes") {
      if (updateChecker.status === "detected") {
        location.href = "game.html?t=" + Date.now();
      } else {
        await stop();
        leaveMainScreen();
        await enterTitleScreen();
      }
    }
    restart();
  };

  commands.sendViaTwitter = async () => {
    soundEffectSelect();
    closeSystemUi();
    await sender.twitter();
  };

  commands.sendViaMarshmallow = async () => {
    soundEffectSelect();
    closeSystemUi();
    await sender.marshmallow();
  };

  commands.resetSystem = async () => {
    if (waitForDialog) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    closeSystemUi();
    pause();
    if (await dialog("system-reset-system") === "yes") {
      Object.entries(systemDefault).forEach(([k, v]) => system[k] = v);
      await putSystem();
      updateSystemUi();
    }
    restart();
  };

  commands.resetHistory = async () => {
    if (waitForDialog) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    closeSystemUi();
    pause();
    if (await dialog("system-reset-history") === "yes") {
      historyState = {};
      setItemDefault(historyState, historyStateDefault);
      await putHistoryState();
      initializeHistory();
    }
    restart();
  };

  commands.resetSave = async () => {
    if (waitForDialog) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    closeSystemUi();
    pause();
    if (await dialog("system-reset-save") === "yes") {
      await stop();
      gameState = {};
      setItemDefault(gameState, gameStateDefault);
      await putGameState();
      await deleteAutosave();
      await deleteSave("save1", "セーブデータ#1");
      await deleteSave("save2", "セーブデータ#2");
      await deleteSave("save3", "セーブデータ#3");
      leaveMainScreen();
      await enterTitleScreen();
      return;
    }
    restart();
  };

  commands.dumpBackup = dumpBackup;
  commands.restoreBackup = restoreBackup;

  commands.resetAudio = resetAudioContext;

  commands.resetCache = async () => {
    try {
      const cache = await caches.open("昭和横濱物語");
      const keys = await cache.keys();
      let n = 0;
      for (let i = 0; i < keys.length; ++i) {
        if (await cache.delete(keys[i])) {
          ++n;
        }
      }
      logging.info("キャッシュ削除: 成功 (" + n + "/" + keys.length + ")");
    } catch (e) {
      logging.info("キャッシュ削除: 失敗");
    }
  };

  const commandsFolder = addSystemUiFolder(systemUi, "コマンド");
  if (D.useFullscreen()) {
    const controller = commandsFolder.add(commands, "fullscreen");
    updateSystemUiFullscreen = () => {
      if (D.getFullscreenElement() === null) {
        logging.info("ウィンドウモード切替: 完了");
        controller.name("全画面表示モードに切り替える");
      } else {
        logging.info("全画面表示モード切替: 完了");
        controller.name("ウィンドウモードに切り替える");
      }
    };
    updateSystemUiFullscreen();
  }

  commandsFolder.add(commands, "backToTitle").name("タイトル画面に戻る");
  commandsFolder.add(commands, "sendViaTwitter").name("ツイッターでメッセージを送る");
  commandsFolder.add(commands, "sendViaMarshmallow").name("マシュマロでメッセージを送る");

  const systemCommandsFolder = addSystemUiFolder(systemUi, "システムコマンド");
  systemCommandsFolder.add(commands, "resetSystem").name("システム設定を初期化する");
  systemCommandsFolder.add(commands, "resetHistory").name("履歴データを消去する");
  systemCommandsFolder.add(commands, "resetSave").name("全セーブデータを削除する");

  const backupCommandsFolder = addSystemUiFolder(systemUi, "バックアップコマンド");
  backupCommandsFolder.add(commands, "dumpBackup").name("バックアップデータを出力する");
  backupCommandsFolder.add(commands, "restoreBackup").name("バックアップデータから復元する");

  systemUiDebugCommandsFolder = addSystemUiFolder(systemUi, "デバッグコマンド");
  systemUiDebugCommandsFolder.add(commands, "resetAudio").name("オーディオを一時停止して再開する");
  if (D.useCacheStorage()) {
    systemUiDebugCommandsFolder.add(commands, "resetCache").name("全キャッシュを削除する");
  }
  systemUiDebugCommandsFolder.add(system, "repeatDelay", 17, 1700, 17).name("ボタン連射待機 [ms]");
  systemUiDebugCommandsFolder.add(system, "repeatRate", 17, 1700, 17).name("ボタン連射間隔 [ms]");
  systemUiDebugCommandsFolder.add(system, "dupKeyboardInput").name("キーボード二重入力");
  systemUiDebugCommandsFolder.add(system, "dupGamepadInput").name("ゲームパッド二重入力");
  systemUiDebugCommandsFolder.add(system, "creditsSpeed", 0, 4000, 40).name("クレジット遷移時間 [ms]");
  systemUiDebugCommandsFolder.hide();

  let initialized = false;
  systemUiNode.addEventListener("transitionend", ev => {
    // openAnimated(false)のトランジションが終わったらUIを隠す。
    // ev.propertyNameは安定しないので判定に利用しない。
    if (systemUi._closed && !systemUi._hidden && ev.target === systemUi.$children) {
      systemUi.hide();
      systemUiNode.style.display = "none";
      if (!initialized) {
        initialized = true;
        logging.info("システム設定初期化: 完了");
      }
    }

    // openAnimated()のトランジション完了時に、スクロール待ちの要素があったらス
    // クロールする。
    if (!systemUi._closed) {
      const node = document.querySelector(".demeter-focus.demeter-wait-for-scroll");
      if (node) {
        node.classList.remove("demeter-wait-for-scroll");
        node.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  });

  systemUi.openAnimated(false);
};

//-------------------------------------------------------------------------

const leaveTitleScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-title-screen"));
  document.querySelector(".demeter-title-choices").style.display = "none";
};

const leaveStartScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-start-screen"));
};

const leaveMainScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-main-screen"));
};

const leaveLoadScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-load-screen"));
};

const leaveSaveScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-save-screen"));
};

const leaveCreditsScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-credits-screen"));
};

const leaveHistoryScreen = () => {
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-history-screen"));
};

//-------------------------------------------------------------------------

const enterTitleScreen = async () => {
  setScreenName("title");
  unsetFocus();
  const screenNode = document.querySelector(".demeter-title-screen");
  if (screenNode.classList.contains("demeter-title-unlock-audio")) {
    screenNode.addEventListener("click", unlockAudio);
    iconAnimation = new D.IconAnimation(document.querySelector(".demeter-title-icon"));
    iconAnimation.start();
  } else {
    musicPlayer.fade("vi03");
    place = undefined;
    backgroundTransition.fade("モノクローム");
    await showTitleChoices();

    if (!interruptQueue.isEmpty()) {
      await interruptQueue.dispatch();
    }
  }

  debugModeCount = 0;
  document.querySelector(".demeter-screen").append(screenNode);
};

const enterStartScreen = () => {
  setScreenName("start");
  unsetFocus();
  document.querySelector(".demeter-screen").append(document.querySelector(".demeter-start-screen"));
};

const enterMainScreen = () => {
  setScreenName("main");
  unsetFocus();
  // 履歴画面への遷移フラグを初期化する。
  mainToHistoryScreenOnce = undefined;
  document.querySelector(".demeter-screen").append(document.querySelector(".demeter-main-screen"));
  // 隠れている間はスクロールされないので、表示してから明示的にスクロールする。
  logging.update("auto");
};

const enterDataScreen = async screenNode => {
  const paragraphIndices = [];

  for (let i = 1; i <= 3; ++i) {
    const key = "save" + i;
    const save = await database.get("save", key);
    if (save) {
      screenNode.querySelector(".demeter-data-tape-" + key + "-text").textContent = " : " + D.dateToString(new Date(save.saved));
      paragraphIndices.push(save.paragraphIndex);
    } else {
      screenNode.querySelector(".demeter-data-tape-" + key + "-text").textContent = "";
    }
  }
  document.querySelector(".demeter-screen").append(screenNode);

  return paragraphIndices;
};

const enterLoadScreen = async () => {
  setScreenName("load");
  unsetFocus();
  if (trophiesState.map.has("preview")) {
    document.querySelector(".demeter-load-tape-preview-text").textContent = "SHOWA YOKOHAMA STORY '69";
  } else {
    document.querySelector(".demeter-load-tape-preview-text").textContent = "broken: 1969/01/19 17:46";
  }
  const paragraphIndices = await enterDataScreen(document.querySelector(".demeter-load-screen"));
  // セーブされている段落の音声をキャッシュする。
  D.cache(getVoiceUrls(paragraphIndices));
};

const enterSaveScreen = async () => {
  setScreenName("save");
  unsetFocus();
  await enterDataScreen(document.querySelector(".demeter-save-screen"));
};

const enterCreditsScreen = async () => {
  setScreenName("credits");
  unsetFocus();
  musicPlayer.fade("vi05");

  D.scenario.paragraphs.forEach((paragraph, i) => {
    if (!paragraph[0].system) {
      const paragraphIndex = i + 1;
      const nodes = [...document.querySelectorAll(".demeter-credits-graph > svg [data-pid='" + paragraphIndex + "']")];
      if (readState.map.has(paragraphIndex)) {
        nodes.forEach(node => node.classList.add("demeter-active"));
      } else {
        nodes.forEach(node => node.classList.remove("demeter-active"));
      }
    }
  });

  const scenarioStatus = readState.map.size / D.scenario.total * 100;
  document.querySelector(".demeter-credits-end-scenario-status").textContent = scenarioStatus.toFixed(2).replace(/\.?0*$/, "") + "%";

  const T1 = system.creditsSpeed;
  const T2 = system.creditsSpeed;
  const T3 = system.creditsSpeed;
  const scrollNode = document.querySelector(".demeter-credits-scroll");
  const graphNode = document.querySelector(".demeter-credits-graph");
  const paragraphNodes = [...document.querySelectorAll(".demeter-credits-paragraph")];
  const trophiesNode = document.querySelector(".demeter-credits-trophies");
  const endNode = document.querySelector(".demeter-credits-end");
  const graphRatio = document.querySelector(".demeter-credits-graph svg").dataset.ratio;

  [ graphNode, ...paragraphNodes, trophiesNode, endNode ].forEach(node => node.style.opacity = "0");

  document.querySelector(".demeter-screen").append(document.querySelector(".demeter-credits-screen"));
  document.querySelector(".demeter-screen").append(document.querySelector(".demeter-empty-overlay"));

  const paragraphHeight = fontSize * 27;
  const height = Math.max(fontSize * (25 * graphRatio + 4), paragraphHeight * paragraphNodes.length + screenHeight * 2);

  scrollNode.scrollTo(0, 0);
  for (let i = 0; i < paragraphNodes.length; ++i) {
    const paragraphNode = paragraphNodes[i];
    const nodes = [paragraphNode];
    if (i === 0) {
      nodes.push(graphNode);
    }
    const opacityAnimation = new D.OpacityAnimation(nodes, 0, 1, T1);
    await opacityAnimation.start();

    await D.setTimeout(T2);

    const begin = paragraphHeight * i;
    let end;

    if (i < paragraphNodes.length - 1) {
      end = begin + paragraphHeight;
    } else {
      end = height - screenHeight * 2;
    }
    const scrollAnimation = new D.ScrollAnimation(scrollNode, begin, end, T3);
    await scrollAnimation.start();
  }

  // trophies animation
  {
    const opacityAnimation = new D.OpacityAnimation([trophiesNode], 0, 1, T1);
    await opacityAnimation.start();

    await D.setTimeout(T2);

    const begin = height - screenHeight * 2;
    const end = begin + screenHeight;
    const scrollAnimation = new D.ScrollAnimation(scrollNode, begin, end, T3);
    await scrollAnimation.start();
  }

  if (gameState.unlockPreview && !trophiesState.map.has("preview")) {
    await dialog("credits-tape-preview");
    await updateTrophy("preview");
  }

  gameState.visitedCredits = true;
  await putGameState();

  const opacityAnimation = new D.OpacityAnimation([endNode], 0, 1, T1);
  await opacityAnimation.start();

  iconAnimation = new D.IconAnimation(document.querySelector(".demeter-credits-end-icon"));
  iconAnimation.start();

  waitForCredits = true;
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-empty-overlay"));
};

const enterHistoryScreen = async () => {
  setScreenName("history");
  unsetFocus();
  if (historyParagraphNodes.length === 0) {
    const paragraphIndex = D.scenario.labels["空の履歴"];
    const paragraph = D.scenario.paragraphs[paragraphIndex - 1];
    const speaker = speakerNames[paragraph[0].speaker];
    const textNodes = D.parseParagraph(paragraph[1], fontSize, font).map(text => D.layoutText(D.composeText(text, fontSize * 25), fontSize, fontSize * 2));
    document.querySelector(".demeter-history-paragraphs").replaceChildren(createHistoryParagraphNode(speaker, textNodes, paragraphIndex));
    document.querySelector(".demeter-screen").append(document.querySelector(".demeter-history-screen"));
  } else {
    const m = historyParagraphNodes.reduce((acc, u) => typeof u === "number" ? acc + 1 : acc, 0);
    if (m > 0) {
      try {
        historyBuilding = true;
        historyBuildingStop = undefined;

        const statusNode = document.querySelector(".demeter-history-building-status");
        let n = 0;
        statusNode.textContent = "(" + n + "/" + m + ")";

        document.querySelector(".demeter-history-building").style.display = "block";
        document.querySelector(".demeter-screen").append(document.querySelector(".demeter-history-screen"));

        for (let i = 0; i < historyParagraphNodes.length; ++i) {
          const paragraphIndex = historyParagraphNodes[i];
          if (typeof paragraphIndex === "number") {
            ++n;
            statusNode.textContent = "(" + n + "/" + m + ")";

            const paragraph = D.scenario.paragraphs[paragraphIndex - 1];
            const speaker = speakerNames[paragraph[0].speaker];
            const textNodes = D.parseParagraph(paragraph[1], fontSize, font).map(text => D.layoutText(D.composeText(text, fontSize * 25), fontSize, fontSize * 2));
            historyParagraphNodes[i] = createHistoryParagraphNode(speaker, textNodes, paragraphIndex);

            await D.requestAnimationFrame();
            if (historyBuildingStop) {
              return;
            }
          }
        }

        document.querySelector(".demeter-history-building").style.display = "none";
        document.querySelector(".demeter-history-paragraphs").replaceChildren(...historyParagraphNodes);
        historyParagraphNodes[historyParagraphNodes.length - 1].scrollIntoView({ behavior: "auto", block: "end" });
      } finally {
        historyBuilding = undefined;
        historyBuildingStop = undefined;
      }
    } else {
      document.querySelector(".demeter-history-paragraphs").replaceChildren(...historyParagraphNodes);
      document.querySelector(".demeter-screen").append(document.querySelector(".demeter-history-screen"));
      historyParagraphNodes[historyParagraphNodes.length - 1].scrollIntoView({ behavior: "auto", block: "end" });
    }
  }
};

//-------------------------------------------------------------------------

const backLoadScreen = async () => {
  soundEffectCancel();
  if (screenNamePrev === "title") {
    leaveLoadScreen();
    await enterTitleScreen();
  } else {
    leaveLoadScreen();
    enterMainScreen();
    restart();
  }
};

const backSaveScreen = () => {
  soundEffectCancel();
  leaveSaveScreen();
  enterMainScreen();
  restart();
};

const backCreditsScreen = async () => {
  // 効果音はなしとする。
  if (waitForCredits) {
    waitForCredits = undefined;
    if (iconAnimation) {
      iconAnimation.stop();
      iconAnimation = undefined;
    }
    leaveCreditsScreen();
    await enterTitleScreen();
  }
};

const backHistoryScreen = () => {
  if (historyVoiceSprite) {
    historyVoiceSprite.finish();
  }
  soundEffectCancel();

  if (historyBuilding) {
    historyBuildingStop = true;
  }
  document.querySelector(".demeter-history-paragraphs").replaceChildren();

  leaveHistoryScreen();
  enterMainScreen();
  restart();
};

//-------------------------------------------------------------------------

const createHistoryParagraphNode = (speaker, textNodes, paragraphIndex) => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="demeter-history-paragraph-border">
      <div class="demeter-history-paragraph" data-focusable="true">
        <div class="demeter-history-paragraph-speaker"></div>
        <div class="demeter-history-paragraph-text"></div>
        <div class="demeter-history-paragraph-voice"><span class="la la-bullhorn"></span> VOICE</div>
      </div>
    </div>
  `;
  const paragraphBorderNode = template.content.firstElementChild;
  const paragraphNode = paragraphBorderNode.firstElementChild;

  if (speaker === "") {
    const paragraphSpeakerBarcodeNode = paragraphNode.querySelector(".demeter-history-paragraph-speaker").appendChild(document.createElement("span"));
    paragraphSpeakerBarcodeNode.classList.add("demeter-history-paragraph-speaker-barcode");
    paragraphSpeakerBarcodeNode.textContent = "Alice in the WWZ";
  } else {
    paragraphNode.querySelector(".demeter-history-paragraph-speaker").textContent = speaker;
  }
  paragraphNode.querySelector(".demeter-history-paragraph-text").append(...textNodes);

  paragraphNode.addEventListener("mouseenter", onMouseEnter);
  paragraphNode.addEventListener("mouseleave", onMouseLeave);
  paragraphNode.addEventListener("click", async () => {
    const voiceSound = new D.VoiceSound(D.preferences.voiceDir + "/" + D.padStart(paragraphIndex, 4));
    const voiceSprite = new D.VoiceSprite(voiceSound, undefined, system.voiceVolume);

    if (historyVoiceSprite) {
      historyVoiceSprite.finish();
      if (historyParagraphIndex === paragraphIndex) {
        return;
      }
    }
    paragraphNode.querySelector(".demeter-history-paragraph-voice").classList.add("demeter-active");

    historyVoiceSprite = voiceSprite;
    historyParagraphIndex = paragraphIndex;
    try {
      await voiceSprite.start();
      logging.debug("音声再生: 開始");
    } catch (e) {
      logging.error("音声再生: 失敗", e);
    }
    if (historyParagraphIndex === paragraphIndex) {
      historyVoiceSprite = undefined;
      historyParagraphIndex = undefined;
    }

    paragraphNode.querySelector(".demeter-history-paragraph-voice").classList.remove("demeter-active");
  });

  return paragraphBorderNode;
};

const initializeHistory = () => {
  // 初期化時は要素を構築しない。
  historyParagraphNodes = [...historyState.paragraphs];
};

const updateHistorySize = () => {
  const m = historyParagraphNodes.length - system.historySize;
  if (m > 0) {
    historyParagraphNodes.splice(0, m);
  }

  const n = historyState.paragraphs.length - system.historySize;
  if (n > 0) {
    historyState.paragraphs.splice(0, n);
  }
};

const createHistoryParagraph = () => {
  const textNode = document.querySelector(".demeter-main-paragraph-text");
  if (textNode.children.length === 0) {
    return;
  }

  const paragraphIndex = Number.parseInt(textNode.dataset.pid);

  // 重複する場合は追加しない。
  if (paragraphIndex === historyState.paragraphs[historyState.paragraphs.length - 1]) {
    return;
  }

  const speaker = document.querySelector(".demeter-main-paragraph-speaker").textContent;
  const textNodes = [...textNode.children].map(node => node.cloneNode(true));
  historyParagraphNodes.push(createHistoryParagraphNode(speaker, textNodes, paragraphIndex));
  historyState.paragraphs.push(paragraphIndex);

  updateHistorySize();
};

const mainToHistoryScreen = async () => {
  if (mainToHistoryScreenOnce) {
    return;
  }
  mainToHistoryScreenOnce = true;
  soundEffectSelect();
  await cancelPlayState();
  pause();
  leaveMainScreen();
  await enterHistoryScreen();
};

//-------------------------------------------------------------------------

const initializeFullscreen = () => {
  const onFullScreenError = ev => {
    if (D.getFullscreenElement() === null) {
      logging.warn("全画面表示モード切替: 失敗");
    } else {
      logging.warn("ウィンドウモード切替: 失敗");
    }
  };

  if (document.body.requestFullscreen) {
    D.requestFullscreen = async node => await node.requestFullscreen();
    D.exitFullscreen = async () => await document.exitFullscreen();
    D.getFullscreenElement = () => document.fullscreenElement;
    document.addEventListener("fullscreenchange", () => updateSystemUiFullscreen());
    document.addEventListener("fullscreenerror", onFullScreenError);
  } else if (document.body.webkitRequestFullscreen) {
    D.requestFullscreen = async node => await node.webkitRequestFullscreen();
    D.exitFullscreen = async () => await document.webkitExitFullscreen();
    D.getFullscreenElement = () => document.webkitFullscreenElement;
    document.addEventListener("webkitfullscreenchange", () => updateSystemUiFullscreen());
    document.addEventListener("webkitfullscreenerror", onFullScreenError);
  }
};

const initializeBackground = () => {
  document.querySelector(".demeter-backgrounds").style.display = "block";
  backgroundTransition = new D.BackgroundTransition([...document.querySelectorAll(".demeter-background")]);
};

const initializeInterrupt = () => {
  interruptQueue = D.interruptQueue = new D.InterruptQueue();
  updateChecker = D.updateChecker = new D.UpdateChecker(600000);
};

//-------------------------------------------------------------------------

const unsetFocus = () => {
  const node = document.querySelector(".demeter-focus");
  if (node) {
    node.classList.remove("demeter-focus");
    return node;
  }

  historyParagraphNodes.filter(node => typeof node !== "number").map(node => node.firstElementChild).forEach(node => node.classList.remove("demeter-focus"));
};

const onMouseMove = ev => {
  inputDevice = "pointer";
};

const onMouseEnter = ev => {
  if (inputDevice === "pointer" && inputHoverable) {
    unsetFocus();
    ev.target.classList.add("demeter-focus");
  }
};

const onMouseLeave = ev => {
  if (inputDevice === "pointer" && inputHoverable) {
    ev.target.classList.remove("demeter-focus");
  }
};

const initializeFocusable = () => {
  const query = matchMedia("(hover: hover)");
  inputHoverable = query.matches;
  if (query.addEventListener) {
    query.addEventListener("change", ev => inputHoverable = ev.matches);
  } else {
    query.addListener(ev => inputHoverable = ev.matches);
  }

  [
    ...document.querySelectorAll("[data-focusable='true']"),
    ...document.querySelectorAll(".demeter-main-system-ui .lil-gui .title, .demeter-main-system-ui .lil-gui .controller"),
  ].forEach(node => {
    node.addEventListener("mouseenter", onMouseEnter);
    node.addEventListener("mouseleave", onMouseLeave);
  });
};

//-------------------------------------------------------------------------

const initializeTitleScreen = () => {
  const choiceButtonNodes = [...document.querySelectorAll(".demeter-title-choice")].map(choiceNode => {
    const choiceFrameNode = D.createChoiceFrame(fontSize * 11, fontSize * 4, fontSize);
    choiceNode.append(choiceFrameNode);
    return choiceFrameNode.querySelector(".demeter-button");
  });

  const appVersion = D.getAppVersion();
  if (appVersion) {
    document.querySelector(".demeter-title-version-string").textContent = appVersion;
  }

  // NEW GAME
  choiceButtonNodes[0].addEventListener("click", ev => {
    ev.stopPropagation();
    soundEffectSelect();
    setSave(saveNewGame);
    leaveTitleScreen();
    enterMainScreen();
    next();
  });

  // LOAD GAME
  choiceButtonNodes[1].addEventListener("click", async ev => {
    ev.stopPropagation();
    soundEffectSelect();
    leaveTitleScreen();
    await enterLoadScreen();
  });

  // CONTINUE
  choiceButtonNodes[2].addEventListener("click", async ev => {
    ev.stopPropagation();
    if (choiceButtonNodes[2].classList.contains("demeter-disabled")) {
      soundEffectBeep();
      return;
    }
    soundEffectSelect();
    setSave(await database.get("save", "autosave"));
    leaveTitleScreen();
    enterMainScreen();
    next();
  });

  // CREDITS
  choiceButtonNodes[3].addEventListener("click", async ev => {
    ev.stopPropagation();
    if (choiceButtonNodes[3].classList.contains("demeter-disabled")) {
      soundEffectBeep();
      return;
    }
    soundEffectSelect();
    leaveTitleScreen();
    await enterCreditsScreen();
  });

  // EXTRA GAME
  choiceButtonNodes[4].addEventListener("click", ev => {
    ev.stopPropagation();
    if (choiceButtonNodes[4].classList.contains("demeter-disabled")) {
      soundEffectBeep();
      return;
    }
  });

  // POSTSCRIPT
  choiceButtonNodes[5].addEventListener("click", ev => {
    ev.stopPropagation();
    if (choiceButtonNodes[5].classList.contains("demeter-disabled")) {
      soundEffectBeep();
      return;
    }
    soundEffectSelect();
    setSave(savePostscript);
    leaveTitleScreen();
    enterMainScreen();
    next();
  });
};

const initializeStartScreen = () => {
  // 次の画面に進む。
  document.querySelector(".demeter-start-screen").addEventListener("click", async ev => {
    if (waitForStartScreen) {
      waitForStartScreen();
    }
  });
};

const initializeMainScreen = () => {
  initializeSystemUi();

  const menuFrameNode = D.createMenuFrame(fontSize * 9, fontSize * 7, fontSize * 2);
  document.querySelector(".demeter-main-menu-frame").append(menuFrameNode);

  document.querySelector(".demeter-main-screen").addEventListener("click", async ev => {
    ev.stopPropagation();
    await cancelPlayState();
    next();
  });

  const paragraphNode = document.querySelector(".demeter-main-paragraph");
  const paragraphTouches = new Map();

  paragraphNode.addEventListener("wheel", async ev => {
    // スクロールを止める。
    ev.preventDefault();
    if (ev.deltaY < 0) {
      await mainToHistoryScreen();
    }
  });
  paragraphNode.addEventListener("touchstart", async ev => {
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      const changedTouch = ev.changedTouches.item(i);
      D.trace("onTouchStart", changedTouch.identifier);
      paragraphTouches.set(changedTouch.identifier, {
        screenX: changedTouch.screenX,
        screenY: changedTouch.screenY,
      });
    }
  });
  paragraphNode.addEventListener("touchend", async ev => {
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      const changedTouch = ev.changedTouches.item(i);
      D.trace("onTouchEnd", changedTouch.identifier);
      paragraphTouches.delete(changedTouch.identifier);
    }
  });
  paragraphNode.addEventListener("touchcancel", async ev => {
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      const changedTouch = ev.changedTouches.item(i);
      D.trace("onTouchCancel", changedTouch.identifier);
      paragraphTouches.delete(changedTouch.identifier);
    }
  });
  paragraphNode.addEventListener("touchmove", async ev => {
    // スクロールを止める。
    ev.preventDefault();
    for (let i = 0; i < ev.changedTouches.length; ++i) {
      const changedTouch = ev.changedTouches.item(i);
      const touch = paragraphTouches.get(changedTouch.identifier);
      const deltaX = changedTouch.screenX - touch.screenX;
      const deltaY = changedTouch.screenY - touch.screenY;
      if (deltaY > fontSize * 2 * screenScale && deltaY > Math.abs(deltaX)) {
        await mainToHistoryScreen();
      }
    }
  });

  document.querySelector(".demeter-main-system-ui").addEventListener("click", async ev => {
    // システムUIのうしろにバブリングしない。
    ev.stopPropagation();
    await cancelPlayState();
  });

  // SYSTEM
  menuFrameNode.querySelector(".demeter-button1").addEventListener("click", async ev => {
    ev.stopPropagation();

    // 選択肢表示中は受けつけない。
    if (waitForChoice) {
      soundEffectBeep();
      return;
    }

    await cancelPlayState();
    if (systemUi._hidden) {
      soundEffectSelect();
      openSystemUi();
    } else {
      soundEffectCancel();
      closeSystemUi();
    }
  });

  // LOAD
  menuFrameNode.querySelector(".demeter-button2").addEventListener("click", async ev => {
    ev.stopPropagation();
    soundEffectSelect();
    await cancelPlayState();
    pause();
    leaveMainScreen();
    await enterLoadScreen();
  });

  // SAVE
  menuFrameNode.querySelector(".demeter-button3").addEventListener("click", async ev => {
    ev.stopPropagation();
    soundEffectSelect();
    await cancelPlayState();
    pause();
    leaveMainScreen();
    await enterSaveScreen();
  });

  // AUTO
  menuFrameNode.querySelector(".demeter-button4").addEventListener("click", async ev => {
    ev.stopPropagation();

    // SKIP解除と同様に、効果音再生を後回しにする。
    if (playState === "auto") {
      await cancelPlayState();
      soundEffectCancel();
      return;
    }

    // 選択肢表示中は受けつけない。
    if (waitForChoice) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    await cancelPlayState();
    playState = "auto";
    menuFrameNode.querySelector(".demeter-button4").classList.add("demeter-active");
    next();
  });

  // SKIP
  menuFrameNode.querySelector(".demeter-button5").addEventListener("click", async ev => {
    ev.stopPropagation();

    // SKIP解除の反応をよくするため、効果音再生を後回し。
    if (playState === "skip") {
      await cancelPlayState();
      soundEffectCancel();
      return;
    }

    // 選択肢表示中は受けつけない。
    if (waitForChoice) {
      soundEffectBeep();
      return;
    }

    soundEffectSelect();
    await cancelPlayState();
    playState = "skip";
    menuFrameNode.querySelector(".demeter-button5").classList.add("demeter-active");
    next();
  });

  [...document.querySelectorAll(".demeter-main-choice")].forEach((choiceNode, i) => {
    const choiceFrameNode = D.createChoiceFrame(fontSize * 25, fontSize * 4, fontSize);
    choiceNode.append(choiceFrameNode);
    choiceFrameNode.querySelector(".demeter-button").addEventListener("click", async ev => {
      ev.stopPropagation();
      soundEffectSelect();
      await cancelPlayState();
      waitForChoice(choices[i + choices.length - 3]);
    });
  });
};

const initializeLoadScreen = () => {
  const backFrameNode = D.createBackFrame(fontSize * 10 + 1, fontSize * 2 + 1, fontSize * 10, fontSize * 2, 1);
  document.querySelector(".demeter-load-back-frame").append(backFrameNode);

  const titleFrameNode = D.createTitleFrame(fontSize * 15, fontSize * 3, fontSize * 13, fontSize * 2);
  document.querySelector(".demeter-load-title-frame").append(titleFrameNode);

  backFrameNode.querySelector(".demeter-button").addEventListener("click", backLoadScreen);

  document.querySelector(".demeter-load-tape-select").addEventListener("click", async () => {
    soundEffectSelect();
    if (await dialog("load-tape-select") === "yes") {
      await stop();
      setSave(saveSelect);
      leaveLoadScreen();
      enterMainScreen();
      next();
    }
  });

  document.querySelector(".demeter-load-tape-tutorial").addEventListener("click", async () => {
    soundEffectSelect();
    if (await dialog("load-tape-tutorial") === "yes") {
      await stop();
      setSave(saveTutorial);
      leaveLoadScreen();
      enterMainScreen();
      next();
    }
  });

  document.querySelector(".demeter-load-tape-preview").addEventListener("click", async () => {
    soundEffectSelect();
    if (trophiesState.map.has("preview")) {
      if (await dialog("load-tape-preview") === "yes") {
        await stop();
        setSave(savePreview);
        leaveLoadScreen();
        enterMainScreen();
        next();
      }
    } else {
      await dialog("load-tape-broken");
    }
  });

  document.querySelector(".demeter-load-tape-save1").addEventListener("click", async () => {
    soundEffectSelect();
    const save = await database.get("save", "save1");
    if (save) {
      if (await dialog("load-tape-save1") === "yes") {
        await stop();
        setSave(save);
        leaveLoadScreen();
        enterMainScreen();
        next();
      }
    } else {
      await dialog("load-tape-empty");
    }
  });

  document.querySelector(".demeter-load-tape-save2").addEventListener("click", async () => {
    soundEffectSelect();
    const save = await database.get("save", "save2");
    if (save) {
      if (await dialog("load-tape-save2") === "yes") {
        await stop();
        setSave(save);
        leaveLoadScreen();
        enterMainScreen();
        next();
      }
    } else {
      await dialog("load-tape-empty");
    }
  });

  document.querySelector(".demeter-load-tape-save3").addEventListener("click", async () => {
    soundEffectSelect();
    const save = await database.get("save", "save3");
    if (save) {
      if (await dialog("load-tape-save3") === "yes") {
        await stop();
        setSave(save);
        leaveLoadScreen();
        enterMainScreen();
        next();
      }
    } else {
      await dialog("load-tape-empty");
    }
  });
};

const initializeSaveScreen = () => {
  const backFrameNode = D.createBackFrame(fontSize * 10 + 1, fontSize * 2 + 1, fontSize * 10, fontSize * 2, 1);
  document.querySelector(".demeter-save-back-frame").append(backFrameNode);

  const titleFrameNode = D.createTitleFrame(fontSize * 15, fontSize * 3, fontSize * 13, fontSize * 2);
  document.querySelector(".demeter-save-title-frame").append(titleFrameNode);

  backFrameNode.querySelector(".demeter-button").addEventListener("click", backSaveScreen);

  document.querySelector(".demeter-save-tape-save1").addEventListener("click", async () => {
    soundEffectSelect();
    if (await dialog("save-tape-save1") === "yes") {
      await putSave("save1", "セーブデータ#1");
      leaveSaveScreen();
      enterMainScreen();
      restart();
    }
  });

  document.querySelector(".demeter-save-tape-save2").addEventListener("click", async () => {
    soundEffectSelect();
    if (await dialog("save-tape-save2") === "yes") {
      await putSave("save2", "セーブデータ#2");
      leaveSaveScreen();
      enterMainScreen();
      restart();
    }
  });

  document.querySelector(".demeter-save-tape-save3").addEventListener("click", async () => {
    soundEffectSelect();
    if (await dialog("save-tape-save3") === "yes") {
      await putSave("save3", "セーブデータ#3");
      leaveSaveScreen();
      enterMainScreen();
      restart();
    }
  });
};

const initializeCreditsScreen = () => {
  document.querySelector(".demeter-credits-end").addEventListener("click", backCreditsScreen);
};

const initializeHistoryScreen = () => {
  const backFrameNode = D.createBackFrame(fontSize * 10 + 1, fontSize * 2 + 1, fontSize * 10, fontSize * 2, 1);
  document.querySelector(".demeter-history-back-frame").append(backFrameNode);

  const titleFrameNode = D.createTitleFrame(fontSize * 15, fontSize * 3, fontSize * 13, fontSize * 2);
  document.querySelector(".demeter-history-title-frame").append(titleFrameNode);

  backFrameNode.querySelector(".demeter-button").addEventListener("click", backHistoryScreen);
};

const initializeDialogOverlay = () => {
  const dialogFrameNode = D.createDialogFrame(fontSize * 25, fontSize * 12, fontSize, 2, fontSize * 8, fontSize * 2);
  document.querySelector(".demeter-dialog-frame").append(dialogFrameNode);
  dialogFrameNode.querySelector(".demeter-button1").addEventListener("click", () => waitForDialog(1));
  dialogFrameNode.querySelector(".demeter-button2").addEventListener("click", () => waitForDialog(2));

  const dialogOverlayNode = document.querySelector(".demeter-dialog-overlay");
  dialogOverlayNode.addEventListener("dragover", ev => ev.preventDefault());
  dialogOverlayNode.addEventListener("drop", ev => {
    ev.preventDefault();
    if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files.length > 0 && waitForDialog) {
      dialogFile = ev.dataTransfer.files.item(0);
      waitForDialog(0);
    }
  });

  const dialogFileNode = document.querySelector(".demeter-dialog-file");
  dialogFileNode.addEventListener("change", ev => {
    ev.preventDefault();
    if (dialogFileNode && dialogFileNode.files && waitForDialog) {
      dialogFile = dialogFileNode.files.item(0);
      waitForDialog(0);
    }
  });
};

const initializeEmptyOverlay = () => {};

//-------------------------------------------------------------------------

const initializeAudio = async () => {
  Howler.autoSuspend = false;
  Howler.volume(system.masterVolume);

  // アプリの場合は自動再生可能である。
  if (D.isApp()) {
    Howler.autoUnlock = false;
    musicPlayer = new D.MusicPlayer(system.musicVolume);
    musicPlayer.start("vi03");
    await unlockAudioCore();
  } else {
    musicPlayer = new D.MusicPlayer(system.musicVolume, unlockAudio);
    musicPlayer.start("vi03");
  }
  logging.info("オーディオ初期化: 完了");
};

//-------------------------------------------------------------------------

const runTextAnimation = async () => {
  if (iconAnimation) {
    iconAnimation.stop();
    iconAnimation = undefined;
  }

  await textAnimation.start(pauseState);
  textAnimation = undefined;

  if (!iconAnimation) {
    iconAnimation = new D.IconAnimation(document.querySelector(".demeter-main-paragraph-icon"));
    iconAnimation.start();
  }
};

const runVoiceSprite = async () => {
  try {
    logging.debug("音声再生: 開始");
    await voiceSprite.start(pauseState);
    logging.debug("音声再生: 終了");
  } catch (e) {
    logging.error("音声再生: 失敗", e);
  }

  // テキストアニメーションが終了していて、音声を明示的に終了した場合、処理を
  // 継続する。
  const cont = textAnimation === undefined && voiceSprite.finished;
  voiceSprite = undefined;
  return cont;
};

const runStartScreen = async () => {
  const imageNode = document.querySelector(".demeter-start-image-" + waitForStart);
  document.querySelector(".demeter-start-display").append(imageNode);

  const T1 = 30;
  const T2 = 3000;

  const textNode = D.layoutText(D.composeText(D.parseText([startTexts[waitForStart]], fontSize, consoleFont)), fontSize, fontSize * 2);
  document.querySelector(".demeter-start-text").replaceChildren(textNode);
  const textAnimation = new D.TextAnimation(textNode, T1);

  leaveMainScreen();
  enterStartScreen();

  waitForStartScreen = () => {
    textAnimation.finish();
  };
  await textAnimation.start();
  if (!textAnimation.finished) {
    await Promise.any([
      new Promise(resolve => waitForStartScreen = () => resolve()),
      D.setTimeout(T2),
    ]);
  }
  waitForStartScreen = undefined;

  // メイン画面に戻る前に段落表示をクリアする。
  document.querySelector(".demeter-main-paragraph-text").replaceChildren();
  // メイン画面に戻る前にAUTO/STOPを解除する。
  await cancelPlayState();

  leaveStartScreen();
  enterMainScreen();

  document.querySelector(".demeter-offscreen").append(imageNode);
};

const resetParagraph = () => {
  D.trace("resetParagraph", paragraphIndex, choices);
  paragraphIndex = undefined;
  paragraph = undefined;
  paragraphLineNumber = undefined;
  textAnimations = undefined;
  textAnimation = undefined;
  voiceSound = undefined;
  voiceSprite = undefined;
  choices = undefined;
};

const next = async () => {
  if (waitForChoice || waitForStart || waitForStop || waitForDialog) {
    return;
  }

  if (textAnimation) {
    if (playState === "auto") {
      // AUTO由来である場合、なにもせずに関数を抜ける。AUTO処理の本体は先行する
      // 実行に任される。
      return;
    } else if (playState === "skip") {
      // SKIP由来である場合、音声を終了する。SKIP処理の本体は先行する実行に任さ
      // れる。
      if (voiceSprite) {
        voiceSprite.finish();
      }
      return;
    } else {
      // テキストアニメーション中ならば、テキストアニメーションを終了する。
      textAnimation.finish();
      return;
    }
  }

  if (voiceSprite) {
    if (playState === "auto") {
      // AUTO由来である場合、なにもせずに関数を抜ける。AUTO処理の本体は先行する
      // 実行に任される。
      return;
    } else {
      // テキストアニメーションは終了しているが、音声は再生中ならば、音声を終了
      // する。
      voiceSprite.finish();
      return;
    }
  }

  if (paragraphLockState) {
    D.trace("next paragraphLockState", paragraphLockState);
    return;
  }

  try {
    paragraphLockState = "enter";
    if (paragraphIndex === undefined) {
      const paragraphLast = D.scenario.paragraphs[paragraphIndexLast - 1];
      if (paragraphLast && paragraphLast[0].finish) {
        paragraphIndexLast = undefined;
        resetParagraph();
        await deleteAutosave();
        leaveMainScreen();
        if (paragraphLast[0].finish === "title") {
          await enterTitleScreen();
        } else {
          await enterCreditsScreen();
        }
        return;
      }

      paragraphIndex = paragraphIndexSave = paragraphIndexLast = paragraphIndexPrev + 1;
      paragraph = D.scenario.paragraphs[paragraphIndex - 1];

      if (paragraph[0].when) {
        const paragraphIndexWhen = await evaluate(paragraph[0].when);
        if (paragraphIndexWhen !== undefined) {
          paragraphIndex = paragraphIndexSave = paragraphIndexLast = paragraphIndexWhen;
          paragraph = D.scenario.paragraphs[paragraphIndex - 1];
        }
      }

      if (playState === "skip" && !system.skipUnread && !readState.map.has(paragraphIndex)) {
        await cancelPlayState();
      }

      if (musicPlayer.key !== paragraph[0].music) {
        musicPlayer.fade(paragraph[0].music);
      }
      if (place !== paragraph[0].place) {
        place = paragraph[0].place;
        logging.notice("現在地: " + place);
      }
      if (backgroundTransition.key !== paragraph[0].background) {
        backgroundTransition.fade(paragraph[0].background);
      }

      readState.map.set(paragraphIndex, Date.now());
      // SKIP中は自動保存しない。
      if (playState !== "skip") {
        await Promise.all([ putReadState(), putAutosave() ]);
      }
      await checkTrophies();

      if (paragraph[0].start) {
        waitForStart = paragraph[0].start;
        await runStartScreen();
        waitForStart = undefined;
      }

      if (paragraph[0].enter) {
        await evaluate(paragraph[0].enter);
      }

      paragraphLineNumber = 1;
      textAnimations = [];
      const textNodes = [];
      D.parseParagraph(paragraph[1], fontSize, font).forEach(text => {
        const textNode = D.layoutText(D.composeText(text, fontSize * 25), fontSize, fontSize * 2);
        textNodes.push(textNode);
        textAnimations.push(new D.TextAnimation(textNode, system.speed));
      });
      const speaker = paragraph[0].speaker;
      if (silhouette) {
        silhouette.updateSpeaker(speaker);
      }

      document.querySelector(".demeter-main-paragraph-speaker").textContent = speakerNames[speaker];
      const textNode = document.querySelector(".demeter-main-paragraph-text");
      textNode.replaceChildren(...textNodes);
      textNode.dataset.pid = D.numberToString(paragraphIndex);

      voiceSound = new D.VoiceSound(D.preferences.voiceDir + "/" + D.padStart(paragraphIndex, 4), D.voiceSprites[paragraphIndex - 1], D.voiceSegments[paragraphIndex - 1]);

      // SKIP中でなければ、次に到達する可能性がある段落のボイスをキャッシュする。
      if (playState !== "skip") {
        D.cache(getVoiceUrls(paragraph[0].adjacencies));
      }
    }
  } finally {
    paragraphLockState = undefined;
  }

  textAnimation = textAnimations[paragraphLineNumber - 1];
  voiceSprite = new D.VoiceSprite(voiceSound, D.numberToString(paragraphLineNumber), system.voiceVolume);

  let [notUsed, cont] = await Promise.all([ runTextAnimation(), runVoiceSprite() ]);
  if (waitForStop) {
    return waitForStop();
  }

  try {
    paragraphLockState = "leave";

    ++paragraphLineNumber;
    if (paragraphLineNumber > textAnimations.length) {
      paragraphIndexPrev = paragraphIndex;
      if (paragraph[0].jump !== undefined) {
        paragraphIndexPrev = paragraph[0].jump - 1;
      }

      choices = paragraph[0].choices;
      if (choices) {
        // 選択肢の表示時にAUTO/STOPを解除する。選択肢表示中はAUTO/SAVEを受けつけない。
        await cancelPlayState();

        const choiceNodes = [
          document.querySelector(".demeter-main-choice1"),
          document.querySelector(".demeter-main-choice2"),
          document.querySelector(".demeter-main-choice3"),
        ];
        const n = 3 - choices.length;
        choiceNodes.forEach((choiceNode, i) => choiceNode.style.display = i < n ? "none" : "block");
        choiceNodes.splice(0, n);

        choices.forEach((choice, i) => {
          const choiceNode = choiceNodes[i];
          const textNode = D.layoutText(D.composeText(D.parseText(choice.choice, fontSize, font), fontSize * 21), fontSize, fontSize * 2);
          choiceNode.querySelector(".demeter-main-choice-text").replaceChildren(textNode);
          choiceNode.querySelector(".demeter-main-choice-barcode").textContent = choice.barcode || "";
        });

        unsetFocus();
        closeSystemUi();

        document.querySelector(".demeter-main-choices").style.display = "block";
        while (true) {
          const menuNodes = [
            document.querySelector(".demeter-main-menu-item1"),
            document.querySelector(".demeter-main-menu-item4"),
            document.querySelector(".demeter-main-menu-item5"),
            document.querySelector(".demeter-main-menu .demeter-button1"),
            document.querySelector(".demeter-main-menu .demeter-button4"),
            document.querySelector(".demeter-main-menu .demeter-button5"),
          ];

          menuNodes.forEach(node => node.classList.add("demeter-disabled"));
          const choice = await new Promise(resolve => waitForChoice = choice => resolve(choice));
          waitForChoice = undefined;
          menuNodes.forEach(node => node.classList.remove("demeter-disabled"));

          if (waitForStop) {
            document.querySelector(".demeter-main-choices").style.display = "none";
            choices = undefined;
            return waitForStop();
          }
          if (choice.action) {
            await evaluate(choice.action);
          }

          // ジャンプ先が現在の段落である場合、待ちつづける。
          if (paragraphIndex !== choice.label) {
            paragraphIndexPrev = choice.label - 1;
            break;
          }
        }
        document.querySelector(".demeter-main-choices").style.display = "none";
        choices = undefined;

        if (!interruptQueue.isEmpty()) {
          setTimeout(async () => await interruptQueue.dispatch(), 1000);
        }

        cont = true;
      }

      if (paragraph[0].leave) {
        await evaluate(paragraph[0].leave);
      }

      if (playState) {
        // この段落にfinishが指定されていたら、AUTO/SKIPを解除する。
        if (paragraph[0].finish) {
          await cancelPlayState();
        }
        // 次の段落にstartが指定されていたら、AUTO/SKIPを解除する。startとwhenは同
        // 時に指定できないので評価しなくてよい。
        const paragraphIndexNext = paragraphIndexPrev + 1;
        const paragraphNext = D.scenario.paragraphs[paragraphIndexNext - 1];
        if (!paragraphNext || paragraphNext[0].start) {
          await cancelPlayState();
        }
      }

      // 段落の処理が終わった時点で履歴に追加する。
      createHistoryParagraph();
      // SKIP中は履歴を保存しない。
      if (playState !== "skip") {
        await putHistoryState();
      }

      resetParagraph();
    }
  } finally {
    paragraphLockState = undefined;
  }

  if (cont) {
    requestAnimationFrame(next);
    return;
  } else if (playState === "auto") {
    await D.setTimeout(system.autoSpeed);
    if (playState === "auto") {
      requestAnimationFrame(next);
    }
    return;
  } else if (playState === "skip") {
    await D.setTimeout(system.skipSpeed);
    if (playState === "skip") {
      requestAnimationFrame(next);
    }
    return;
  }
};

const pause = () => {
  pauseState = true;
  if (textAnimation) {
    textAnimation.pause();
  }
  if (voiceSprite) {
    voiceSprite.pause();
  }
};

const restart = () => {
  pauseState = undefined;
  if (textAnimation) {
    textAnimation.restart();
  }
  if (voiceSprite) {
    voiceSprite.restart();
  }
};

const stop = async () => {
  pauseState = undefined;
  if (textAnimation || voiceSprite || waitForChoice) {
    const stop = new Promise(resolve => waitForStop = () => resolve());
    if (textAnimation) {
      textAnimation.finish();
    }
    if (voiceSprite) {
      voiceSprite.finish();
    }
    if (waitForChoice) {
      waitForChoice(undefined);
    }
    await stop;
    waitForStop = undefined;
  }
  paragraphIndexLast = undefined;
  resetParagraph();
};

//-------------------------------------------------------------------------

const dialog = async key => {
  const paragraphIndex = D.scenario.dialogs[key];
  const paragraph = D.scenario.paragraphs[paragraphIndex - 1];
  const textNodes = [];
  D.parseParagraph(paragraph[1], fontSize, font).forEach(text => {
    const textNode = D.layoutText(D.composeText(text, fontSize * 21), fontSize, fontSize * 2);
    textNodes.push(textNode);
  });
  document.querySelector(".demeter-dialog-text").replaceChildren(...textNodes);

  const dialog = paragraph[0].dialog;
  const button1Node = document.querySelector(".demeter-dialog-frame .demeter-button1");
  const button2Node = document.querySelector(".demeter-dialog-frame .demeter-button2");
  if (dialog.length === 1) {
    button1Node.dataset.result = dialog[0].result;
    delete button2Node.dataset.result;
    button2Node.style.display = "none";
    document.querySelector(".demeter-dialog-item2").textContent = "";
    document.querySelector(".demeter-dialog-item1").textContent = dialog[0].choice;
  } else {
    button1Node.dataset.result = dialog[1].result;
    button2Node.dataset.result = dialog[0].result;
    button2Node.style.display = "inline";
    document.querySelector(".demeter-dialog-item2").textContent = dialog[0].choice;
    document.querySelector(".demeter-dialog-item1").textContent = dialog[1].choice;
  }

  // 物理行ごとのスプライトに分割せず、音声を一括で再生する。
  const voiceSound = new D.VoiceSound(D.preferences.voiceDir + "/" + D.padStart(paragraphIndex, 4));
  let voiceSprite = new D.VoiceSprite(voiceSound, undefined, system.voiceVolume);

  document.querySelector(".demeter-screen").append(document.querySelector(".demeter-dialog-overlay"));

  dialogKey = key;
  const runDialog = new Promise(resolve => waitForDialog = choice => {
    if (voiceSprite) {
      voiceSprite.finish();
    }
    resolve(choice);
  });

  const runVoiceSprite = async () => {
    try {
      await voiceSprite.start();
    } catch (e) {
      logging.error("音声処理: 失敗", e);
    }
    voiceSprite = undefined;
  };

  const [resultIndex] = await Promise.all([ runDialog, runVoiceSprite() ]);

  dialogKey = undefined;
  waitForDialog = undefined;
  document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-dialog-overlay"));

  let result;
  if (resultIndex === 0) {
    result = "file";
  } else {
    result = dialog[dialog.length === 1 ? 0 : 2 - resultIndex].result;
  }

  if (result === "no" || result === "cancel") {
    soundEffectCancel();
  } else {
    soundEffectSelect();
  }

  if (!interruptQueue.isEmpty()) {
    setTimeout(async () => await interruptQueue.dispatch(), 1000);
  }

  return result;
};

//-------------------------------------------------------------------------

let debugModeCount = 0;
let debugModeStatus = false;

const checkDebugMode = async ev => {
  ++debugModeCount;
  if (debugModeCount >= 30) {
    debugModeCount = 0;
    debugModeStatus = !debugModeStatus;
    if (debugModeStatus) {
      logging.setLevel(7);
      D.trace = (...params) => console.log(...params);
      systemUiDebugCommandsFolder.show();
      document.querySelector(".demeter-title-mode").textContent = " [debug]";
      logging.notice("デバッグモード: 有効化");
    } else {
      logging.setLevel(6);
      D.trace = (...params) => D.preferences.trace(...params);
      systemUiDebugCommandsFolder.hide();
      document.querySelector(".demeter-title-mode").textContent = "";
      logging.notice("デバッグモード: 無効化");
    }
  }
};

//-------------------------------------------------------------------------

const kCodeSet = [
  [ "KeyK", "ArrowUp",    "ButtonUp" ],
  [ "KeyK", "ArrowUp",    "ButtonUp" ],
  [ "KeyJ", "ArrowDown",  "ButtonDown" ],
  [ "KeyJ", "ArrowDown",  "ButtonDown" ],
  [ "KeyH", "ArrowLeft",  "ButtonLeft" ],
  [ "KeyL", "ArrowRight", "ButtonRight" ],
  [ "KeyH", "ArrowLeft",  "ButtonLeft" ],
  [ "KeyL", "ArrowRight", "ButtonRight" ],
  [ "KeyB", "Escape", "Backspace", "ButtonB" ],
  [ "KeyA", "Enter", "ButtonA" ],
];
const kCodeBuffer = [];
let kCodeStatus = false;
let kCodePrompt = true;

const updateKCode = () => {
  [...document.querySelectorAll(".demeter-title-kcode-item")].forEach((node, i) => {
    if (kCodeBuffer[i] !== undefined) {
      node.classList.add("demeter-active");
    } else {
      node.classList.remove("demeter-active");
    }
  });
};

const toggleKCode = async () => {
  const nodes = [...document.querySelectorAll(".demeter-background")];
  kCodeStatus = !kCodeStatus;
  if (kCodeStatus) {
    nodes[0].classList.add("demeter-active");
    nodes[1].classList.remove("demeter-active");
  } else {
    nodes[0].classList.remove("demeter-active");
    nodes[1].classList.add("demeter-active");
  }
};

const resetKCode = async () => {
  await D.setTimeout(500);
  kCodeBuffer.splice(0);
  updateKCode();
};

const checkKCode = async ev => {
  if (!kCodePrompt) {
    return;
  }
  kCodeBuffer.push(ev.code);
  if (kCodeBuffer.every((code, i) => kCodeSet[i].includes(code))) {
    if (kCodeBuffer.length === kCodeSet.length) {
      updateKCode();
      await updateTrophy("kcode");
      kCodePrompt = false;
      await Promise.all([ toggleKCode(), resetKCode() ]);
      kCodePrompt = true;
    }
  } else {
    kCodeBuffer.splice(0);
  }
  updateKCode();
};

//-------------------------------------------------------------------------

D.setupErrorHandler = () => {
  addEventListener("error", ev => logging.error("検出: 大域エラー", ev));
  addEventListener("unhandledrejection", ev => logging.error("検出: 見過ごされた拒否", ev.reason));
};

//-------------------------------------------------------------------------

const onResize = async () => {
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;

  const projectorNode = document.querySelector(".demeter-projector");

  if (W <= H) {
    screenOrientation = "orientationPortrait";
    screenWidth = fontSize * 27;
    screenHeight = fontSize * 48;
    projectorNode.classList.remove("demeter-landscape");
    projectorNode.classList.add("demeter-portrait");
  } else {
    screenOrientation = "orientationLandscape";
    screenWidth = fontSize * 48;
    screenHeight = fontSize * 27;
    projectorNode.classList.remove("demeter-portrait");
    projectorNode.classList.add("demeter-landscape");
  }

  screenScale = Math.min(W / screenWidth, H / screenHeight, system.scaleLimit ? 1 : Infinity);
  const transform = "translate(" +
    D.numberToCss((W - screenWidth) * 0.5) + "," +
    D.numberToCss((H - screenHeight) * 0.5) + ") scale(" +
    D.numberToString(screenScale) + ")";
  [ ...document.querySelectorAll(".demeter-background"), document.querySelector(".demeter-screen") ].forEach(node => node.style.transform = transform);

  updateComponents();

  if (!gameState[screenOrientation]) {
    gameState[screenOrientation] = true;
    await putGameState();
    if (gameState.orientationPortrait && gameState.orientationLandscape) {
      await updateTrophy("orientation");
    }
  }
};

//-------------------------------------------------------------------------

const isInputOk = ev => ev.code === "Enter" || ev.code === "Space" || ev.code === "ButtonA";
const isInputCancel = ev => ev.code === "Escape" || ev.code === "Backspace" || ev.code === "ButtonB";

const isInputControlLeft  = ev => ev.code === "KeyH" || ev.code === "ArrowLeft"  || ev.code === "ButtonLeft";
const isInputControlUp    = ev => ev.code === "KeyK" || ev.code === "ArrowUp"    || ev.code === "ButtonUp";
const isInputControlDown  = ev => ev.code === "KeyJ" || ev.code === "ArrowDown"  || ev.code === "ButtonDown";
const isInputControlRight = ev => ev.code === "KeyL" || ev.code === "ArrowRight" || ev.code === "ButtonRight";

const getInputControlX = (ev, def) => {
  if (isInputControlLeft(ev)) {
    return -1;
  } else if (isInputControlRight(ev)) {
    return +1;
  } else {
    return def;
  }
};

const getInputControlY = (ev, def) => {
  if (isInputControlUp(ev)) {
    return -1;
  } else if (isInputControlDown(ev)) {
    return +1;
  }
};

const rotations = [
  [ +1,  0,  0, +1 ], // 0度
  [  0, -1, +1,  0 ], // 90度
  [ -1,  0,  0, -1 ], // 180度
  [  0, +1, -1,  0 ], // 270度
];

const getInputControlXY = ev => {
  if (isInputControlLeft(ev)) {
    return { x: -1, y: 0, r: rotations[2] }; // ←, 180度
  } else if (isInputControlUp(ev)) {
    return { x: 0, y: -1, r: rotations[3] }; // ↑, 270度
  } else if (isInputControlDown(ev)) {
    return { x: 0, y: +1, r: rotations[1] }; // ↓, 90度
  } else if (isInputControlRight(ev)) {
    return { x: +1, y: 0, r: rotations[0] }; // →, 0
  }
};

const clickButton = async node => {
  if (node) {
    node.classList.add("demeter-active");
    await D.setTimeout(100);
    node.classList.remove("demeter-active");
    node.dispatchEvent(new MouseEvent("click"));
  } else {
    soundEffectBeep();
  }
  return true;
};

const clickDialogButton = async ev => {
  const buttonNodes = [
    document.querySelector(".demeter-dialog-frame .demeter-button1"),
    document.querySelector(".demeter-dialog-frame .demeter-button2"),
  ];

  if (isInputOk(ev)) {
    return await clickButton(buttonNodes.find(node => node.dataset.result === "yes" || node.dataset.result === "ok"));
  } else if (isInputCancel(ev)) {
    return await clickButton(buttonNodes.find(node => node.dataset.result === "no" || node.dataset.result === "ok"));
  }
};

const clickElement = node => {
  node.dispatchEvent(new MouseEvent("click"));
  return true;
};

const clickFocusElement = () => {
  const node = document.querySelector(".demeter-focus");
  if (node) {
    return clickElement(node);
  } else {
    soundEffectBeep();
    return true;
  }
};

const focusTitleChoice = ev => {
  if (document.querySelector(".demeter-title-choices").style.display !== "block") {
    return;
  }

  const delta = getInputControlXY(ev);
  if (!delta) {
    return;
  }

  let nodes;
  let cols;
  let rows;

  if (screenOrientation === "orientationPortrait") {
    nodes = [
      1, 2,
      3, 4,
      5, 6,
    ].map(n => document.querySelector(`.demeter-title-choice${n} .demeter-button`));
    cols = 2;
    rows = 3;
  } else {
    nodes = [
      1, 2, 5,
      3, 4, 6,
    ].map(n => document.querySelector(`.demeter-title-choice${n} .demeter-button`));
    cols = 3;
    rows = 2;
  }

  const vectors = [
    [ 0, 0 ], [ 0, 1 ], [ 0, -1 ],
    [ 1, 0 ], [ 1, 1 ], [ 1, -1 ],
    [ 2, 0 ], [ 2, 1 ], [ 2, -1 ],
  ];

  let col = 0;
  let row = 0;

  const focusNode = unsetFocus();
  const index = nodes.findIndex(node => node === focusNode);
  if (index === -1) {
    if (delta.x === -1) {
      col = cols - 1;
      row = 0;
    } else if (delta.y === -1) {
      col = 0;
      row = rows - 1;
    }
  } else {
    col = index % cols + delta.x;
    row = Math.floor(index / cols) + delta.y;
    col = (col + cols) % cols;
    row = (row + rows) % rows;
  }

  const [ m11, m12, m21, m22 ] = delta.r;

  let resultIndex;
  const result = vectors.some(v => {
    const x = m11 * v[0] + m12 * v[1];
    const y = m21 * v[0] + m22 * v[1];
    const c = (col + x + cols) % cols;
    const r = (row + y + rows) % rows;
    const index = c + r * cols;
    if (!nodes[index].classList.contains("demeter-disabled")) {
      resultIndex = index;
      return true;
    }
  });

  if (result) {
    if (resultIndex === index) {
      soundEffectBeep();
    } else {
      soundEffectFocus();
    }
    nodes[resultIndex].classList.add("demeter-focus");
  } else {
    soundEffectBeep();
    if (index !== -1) {
      nodes[index].classList.add("demeter-focus");
    }
  }
  return true;
};

const getUiComponents = () => [
  systemUi,
  ...systemUi.children.map(ui => {
    if (ui instanceof lil.GUI) {
      if (ui._hidden) {
        return [];
      } else if (ui._closed) {
        return ui;
      } else {
        return [ui, ...ui.controllers ];
      }
    } else {
      return ui;
    }
  }),
].flat();

const getUiNodes = uiComponents => uiComponents.map(ui => ui instanceof lil.GUI ? ui.$title : ui.domElement);

const focusMainMenu = ev => {
  const delta = getInputControlXY(ev);
  if (!delta) {
    return;
  }

  const nodes = [
    document.querySelector(".demeter-main-menu .demeter-button2"), // LOAD
    document.querySelector(".demeter-main-menu .demeter-button1"), // SYSTEM
    document.querySelector(".demeter-main-menu .demeter-button3"), // SAVE
    document.querySelector(".demeter-main-menu .demeter-button4"), // AUTO
    false,
    document.querySelector(".demeter-main-menu .demeter-button5"), // SKIP
  ];

  const cols = 3;
  const rows = 2;
  let col;
  let row;

  const focusNode = unsetFocus();
  const index = nodes.findIndex(node => node === focusNode);
  if (index === -1) {
    col = 1 - delta.x;
    row = 0;
  } else {
    // LOAD SYSTEM SAVE
    // AUTO        SKIP
    const x = index % cols;
    const y = Math.floor(index / cols);
    col = (x + delta.x + cols) % cols;
    row = (y + delta.y + rows) % rows;
    if (col === 1 && row === 1) {
      if (x === 0) {
        // AUTOから右に移動→SKIP
        col = 2;
      } else if (x === 2) {
        // SKIPから左に移動→AUTO
        col = 0;
      }
    }
  }

  const node = nodes[col + row * cols];
  if (node) {
    soundEffectFocus();
    node.classList.add("demeter-focus");
    return true;
  }


  const uiNodes = getUiNodes(getUiComponents());
  const uiNode = uiNodes[delta.y > 0 ? 0 : uiNodes.length - 1];

  soundEffectFocus();
  uiNode.classList.add("demeter-focus");

  if (systemUi._hidden) {
    // フォーカスを当てておいて、トランジション終了後にイベントリスナでスクロー
    // ルする。
    uiNode.classList.add("demeter-wait-for-scroll");
    openSystemUi();
  } else {
    uiNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return true;
};

const focusSystemUi = ev => {
  const delta = getInputControlY(ev);
  if (!delta) {
    return;
  }

  const nodes = getUiNodes(getUiComponents());

  const focusNode = unsetFocus();
  const index = nodes.findIndex(node => node === focusNode) + delta;

  if (0 <= index && index < nodes.length) {
    const node = nodes[index];
    soundEffectFocus();
    node.classList.add("demeter-focus");
    node.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return true;
  }

  soundEffectFocus();
  document.querySelector(".demeter-main-menu .demeter-button1").classList.add("demeter-focus");
  return true;
};

const processSystemUi = async ev => {
  const delta = getInputControlX(ev, isInputOk(ev) ? ev.shiftKey ? -1 : 1 : undefined);
  if (!delta) {
    return;
  }

  const components = getUiComponents();
  const nodes = getUiNodes(components);
  const ui = components[nodes.findIndex(node => node.classList.contains("demeter-focus"))];
  const node = ui.domElement;

  let value;
  if (ui instanceof lil.GUI) {
    return clickElement(ui.$title);
  } else if (node.classList.contains("boolean")) {
    value = !ui.getValue();
  } else if (node.classList.contains("number")) {
    value = ui._snap(ui._clamp(ui.getValue() + delta * ui._step));
  } else if (node.classList.contains("option")) {
    const index = ui._values.findIndex(value => value === ui.getValue());
    value = ui._values[(index + (delta >= 0 ? 1 : -1) + ui._values.length) % ui._values.length];
  } else if (node.classList.contains("function")) {
    node.querySelector("button").dispatchEvent(new MouseEvent("click"));
    return true;
  } else {
    const inputDeviceType = ev instanceof KeyboardEvent ? "キーボード" : "ゲームパッド";
    soundEffectBeep();
    logging.warn(`警告: ${inputDeviceType}入力は色設定に非対応。マウス・タッチパネルの使用を提案。`);
    return true;
  }

  if (value !== undefined) {
    ui.setValue(value);
    await putSystem();
  }
  return true;
};

const focusMainMenuX = ev => {
  const delta = getInputControlX(ev);
  if (!delta) {
    return;
  }

  const nodes = [
    document.querySelector(".demeter-main-menu .demeter-button2"), // LOAD
    document.querySelector(".demeter-main-menu .demeter-button3"), // SAVE
  ];

  const focusNode = unsetFocus();
  let index = nodes.findIndex(node => node === focusNode);
  if (index === -1) {
    index = delta > 0 ? 0 : nodes.length - 1;
  } else {
    index = ((index + delta) % nodes.length + nodes.length) % nodes.length;
  }

  soundEffectFocus();
  nodes[index].classList.add("demeter-focus");
  return true;
};

const focusMainChoice = ev => {
  const delta = getInputControlY(ev);
  if (!delta) {
    return;
  }

  const nodes = [...document.querySelectorAll(".demeter-main-choice")].filter(node => node.style.display === "block").map(node => node.querySelector(".demeter-button"));

  const focusNode = unsetFocus();
  let index = nodes.findIndex(node => node === focusNode);
  if (index === -1) {
    index = delta > 0 ? 0 : nodes.length - 1;
  } else {
    index = ((index + delta) % nodes.length + nodes.length) % nodes.length;
  }

  soundEffectFocus();
  nodes[index].classList.add("demeter-focus");
  return true;
};

const focusDataTape = (tapesNode, ev) => {
  const delta = getInputControlXY(ev);
  if (!delta) {
    return;
  }

  let dcol;
  let drow;
  if (screenOrientation === "orientationPortrait") {
    dcol = delta.y;
    drow = delta.x;
  } else {
    dcol = delta.x;
    drow = delta.y;
  }

  const cols = Number.parseInt(tapesNode.dataset.cols);
  const rows = Number.parseInt(tapesNode.dataset.rows);
  let col;
  let row;

  const focusNode = unsetFocus();
  if (focusNode) {
    col = (Number.parseInt(focusNode.dataset.col) + dcol) % cols;
    row = (Number.parseInt(focusNode.dataset.row) + drow) % rows;
    col = col > 0 ? col : cols;
    row = row > 0 ? row : rows;
  } else {
    col = dcol > -1 ? 1 : cols;
    row = drow > -1 ? 1 : rows;
  }

  soundEffectFocus();
  tapesNode.querySelector("[data-col='" + col + "'][data-row='" + row + "']").classList.add("demeter-focus");
  return true;
};

const focusParagraph = (nodes, ev, startsWithTail, block) => {
  const delta = getInputControlY(ev);
  if (!delta) {
    return;
  }

  if (nodes.length === 0) {
    soundEffectBeep();
    return;
  }

  const focusNode = unsetFocus();
  let index = nodes.findIndex(node => node === focusNode);
  if (index === -1 && startsWithTail) {
    index = nodes.length - 1;
  }

  if (index === -1) {
    index = delta > 0 ? 0 : nodes.length - 1;
  } else {
    index = ((index + delta) % nodes.length + nodes.length) % nodes.length;
  }

  soundEffectFocus();
  const node = nodes[index];
  node.classList.add("demeter-focus");
  node.scrollIntoView({ behavior: "smooth", block: block });
  return true;
};

const processInputDevice = async ev => {
  let consumed;

  if (screenName === "title") {
    if (waitForDialog) {
      consumed = await clickDialogButton(ev);
    } else if (isInputOk(ev)) {
      const node = unsetFocus();
      consumed = clickButton(node);
      if (!node) {
        checkDebugMode(ev);
      }
    } else if (isInputCancel(ev)) {
      soundEffectCancel();
      unsetFocus();
      consumed = true;
    } else {
      consumed = focusTitleChoice(ev);
    }
    await checkKCode(ev);

  } else if (screenName === "start") {
    if (waitForStartScreen) {
      if (isInputOk(ev) || isInputCancel(ev)) {
        consumed = clickElement(document.querySelector(".demeter-start-screen"));
      }
    }

  } else if (screenName === "main") {
    if (waitForDialog) {
      consumed = await clickDialogButton(ev);
    } else {
      if (waitForChoice) {
        if (isInputOk(ev)) {
          consumed = clickButton(unsetFocus());
        } else {
          consumed = focusMainMenuX(ev) || focusMainChoice(ev);
        }
      } else {
        const node = document.querySelector(".demeter-focus");
        if (node) {
          if (node.closest(".demeter-main-system-ui .lil-gui")) {
            // lil-guiのフォルダかコントローラがフォーカスされている
            consumed = focusSystemUi(ev) || await processSystemUi(ev);
          } else {
            if (isInputOk(ev)) {
              consumed = await clickButton(node);
            } else {
              consumed = focusMainMenu(ev);
            }
          }
        } else {
          if (isInputOk(ev)) {
            await cancelPlayState();
            next();
            consumed = true;
          } else {
            consumed = focusMainMenu(ev);
          }
        }
      }

      if (!consumed) {
        if (isInputCancel(ev)) {
          await cancelPlayState();
          // キャンセルするべきものがないときは、OKのようにふるまうと楽しい。
          if (document.querySelector(".demeter-focus") || !systemUi._hidden) {
            soundEffectCancel();
            unsetFocus();
            closeSystemUi();
          } else {
            next();
          }
          consumed = true;
        } else if (ev.code === "PageUp" || ev.code === "ButtonX" || ev.code === "ButtonY") {
          await mainToHistoryScreen();
          consumed = true;
        } else if (ev.code === "ButtonL") {
          unsetFocus();
          const node = document.querySelector(".demeter-main-menu .demeter-button2"); // LOAD
          clickButton(node);
          consumed = true;
        } else if (ev.code === "ButtonR") {
          unsetFocus();
          const node = document.querySelector(".demeter-main-menu .demeter-button3"); // SAVE
          clickButton(node);
          consumed = true;
        } else if (ev.code === "ButtonZL") {
          unsetFocus();
          const node = document.querySelector(".demeter-main-menu .demeter-button4"); // AUTO
          // クリックの効果音が鳴るので、フォーカスの効果音は鳴らさない。
          node.classList.add("demeter-focus");
          clickButton(node);
          consumed = true;
        } else if (ev.code === "ButtonZR") {
          unsetFocus();
          const node = document.querySelector(".demeter-main-menu .demeter-button5"); // SKIP
          // クリックの効果音が鳴るので、フォーカスの効果音は鳴らさない。
          node.classList.add("demeter-focus");
          clickButton(node);
          consumed = true;
        }
      }
    }

  } else if (screenName === "load") {
    if (waitForDialog) {
      consumed = await clickDialogButton(ev);
    } else if (isInputOk(ev)) {
      consumed = clickFocusElement();
    } else if (isInputCancel(ev)) {
      consumed = await clickButton(document.querySelector(".demeter-load-back-frame .demeter-button"));
    } else {
      consumed = focusDataTape(document.querySelector(".demeter-load-tapes"), ev);
    }

  } else if (screenName === "save") {
    if (waitForDialog) {
      consumed = await clickDialogButton(ev);
    } else if (isInputOk(ev)) {
      consumed = clickFocusElement();
    } else if (isInputCancel(ev)) {
      consumed = await clickButton(document.querySelector(".demeter-save-back-frame .demeter-button"));
    } else {
      consumed = focusDataTape(document.querySelector(".demeter-save-tapes"), ev);
    }

  } else if (screenName === "credits") {
    if (waitForCredits) {
      if (isInputOk(ev) || isInputCancel(ev)) {
        consumed = clickElement(document.querySelector(".demeter-credits-end"));
      } else {
        consumed = focusParagraph([...document.querySelectorAll(".demeter-credits [data-focusable='true']")], ev, true, "start");
      }
    }

  } else if (screenName === "history") {
    if (waitForDialog) {
      consumed = await clickDialogButton(ev);
    } else if (isInputOk(ev)) {
      consumed = clickFocusElement();
    } else if (isInputCancel(ev)) {
      consumed = await clickButton(document.querySelector(".demeter-history-back-frame .demeter-button"));
    } else {
      consumed = focusParagraph([...document.querySelectorAll(".demeter-history-paragraph")], ev, false, "nearest");
    }
  }

  return consumed;
};

const onKeydown = async ev => {
  inputDevice = "keyboard";

  if (system.dupKeyboardInput) {
    requestAnimationFrame(async () => await processInputDevice(ev));
  }

  const consumed = await processInputDevice(ev);
  if (consumed) {
    ev.preventDefault();
  }
};

//-------------------------------------------------------------------------

const gamepadConnectedSet = new Set();

const gamepadButtonCodeSet = [
  "ButtonA",
  "ButtonB",
  "ButtonX",
  "ButtonY",
  "ButtonL",
  "ButtonR",
  "ButtonZL",
  "ButtonZR",
  "ButtonMinus",
  "ButtonPlus",
  "ButtonLStick",
  "ButtonRStick",
  "ButtonUp",
  "ButtonDown",
  "ButtonLeft",
  "ButtonRight",
  "ButtonHome",
];

const onGamepadButtonPress = gamepadButtonIndex => {
  inputDevice = "gamepad";

  let code = gamepadButtonCodeSet[gamepadButtonIndex];
  if (system.gamepadSwapAB) {
    if (code === "ButtonA") {
      D.trace("onGamepadButtonPress processInputDevice ButtonA→ButtonB");
      code = "ButtonB";
    } else if (code === "ButtonB") {
      D.trace("onGamepadButtonPress processInputDevice ButtonB→ButtonA");
      code = "ButtonA";
    }
  }
  const ev = { code: code };

  if (system.dupGamepadInput) {
    requestAnimationFrame(async () => await processInputDevice(ev));
  }

  processInputDevice(ev).then(consumed => {
    D.trace("onGamepadButtonPress processInputDevice", code, consumed);
  }).catch(e => {
    D.trace("onGamepadButtonPress processInputDevice", code, e);
  });
};

const onGamepadConnected = async ev => {
  logging.notice("ゲームパッド接続検出");
  logging.info(ev.gamepad.id);
  logging.info("マッピング: " + ev.gamepad.mapping);

  const index = ev.gamepad.index;
  gamepadConnectedSet.add(index);

  const buttonStates = ev.gamepad.buttons.map(notUsed => false);

  while (gamepadConnectedSet.has(index)) {
    const now = await D.requestAnimationFrame();

    const gamepads = navigator.getGamepads();
    if (!gamepads) {
      buttonStates.fill(false);
      continue;
    }
    const gamepad = gamepads[index];
    if (!gamepad || !gamepad.connected) {
      buttonStates.fill(false);
      continue;
    }

    gamepad.buttons.forEach((button, i) => {
      const buttonState = buttonStates[i];
      if (button.pressed) {
        if (!buttonState) {
          onGamepadButtonPress(i);
          buttonStates[i] = { pressed: now };
        } else {
          const repeated = buttonState.repeated === undefined ?
            buttonState.pressed + system.repeatDelay :
            buttonState.repeated + system.repeatRate;
          if (repeated <= now) {
            onGamepadButtonPress(i);
            buttonState.repeated = repeated;
          }
        }
      } else {
        buttonStates[i] = false;
      }
    });
  }
};

const onGamepadDisconnected = ev => {
  logging.notice("ゲームパッド切断検出");
  logging.info(ev.gamepad.id);
  gamepadConnectedSet.delete(ev.gamepad.index);
};

//-------------------------------------------------------------------------

D.onDOMContentLoaded = async () => {
  D.initializeInternal();
  await initializeDatabase();
  initializeFullscreen(); // initializeSystemUiに先立つ必要がある。
  initializeTitleScreen();
  initializeStartScreen();
  initializeMainScreen();
  initializeLoadScreen();
  initializeSaveScreen();
  initializeCreditsScreen();
  initializeHistoryScreen();
  initializeDialogOverlay();
  initializeEmptyOverlay();
  await initializeAudio(); // initializeTitleScreenより後、enterTitleScreenより前に実行する。
  await onResize();
  initializeBackground();
  initializeInterrupt();
  initializeFocusable(); // SVGを作り終えた後に実行する。

  addEventListener("resize", onResize);
  addEventListener("mousemove", onMouseMove);
  addEventListener("keydown", onKeydown);
  addEventListener("gamepadconnected", onGamepadConnected);
  addEventListener("gamepaddisconnected", onGamepadDisconnected);

  await enterTitleScreen();

  // リップシンクの画像を準備し、バッファにレンダリングする。
  await lipSync.initialize([
    [ "neutral",                               "silB", "silE", "sp",  ],
    [ "a", "e", "i",                                                  ],
    [ "th",                                    "ts",                  ],
    [ "o",                                                            ],
    [ "ee",                                    "i:",                  ],
    [ "u",                                                            ],
    [ "b", "m", "p",                           "N", "by", "my", "py", ],
    [ "f", "v",                                "h", "hy",             ],
    [ "w", "q",                                                       ],
    [ "ch", "j", "sh",                                                ],
    [ "c", "d", "n", "s", "t", "x", "y", "z",  "ny",                  ],
    [ "g", "k",                                "gy", "ky",            ],
    [ "l",                                     "r", "ry",             ],
  ]);
  lipSync.buffer.style.display = "block";
  lipSync.buffer.style.position = "absolute";
  document.querySelector(".demeter-offscreen").append(lipSync.buffer);
  lipSync.drawBuffer();

  if (D.useServiceWorker()) {
    navigator.serviceWorker.addEventListener("controllerchange", ev => {
      logging.info("サービスワーカ変更: 検出");
    });

    navigator.serviceWorker.register("service-worker.js").then(registration => {
      logging.info("サービスワーカ登録: 成功");
      registration.addEventListener("updatefound", ev => {
        logging.info("サービスワーカ更新: 検出");
      });
    }).catch(e => {
      logging.error("サービスワーカ登録: 失敗", e);
    });
  }

  // ファイル名は変えない。
  history.replaceState(null, "", document.location.pathname);

  // 背景画像をキャッシュする。
  D.cache(getBackgroundImageUrls());

  // 音楽をキャッシュする。
  D.cache(getMusicUrls());

  // 開始段落の音声をキャッシュする。
  D.cache(getVoiceUrls(D.scenario.starts));

  // 古いキャッシュを消す。
  deleteOldCaches();

  while (true) {
    await D.requestAnimationFrame();
    if (iconAnimation) {
      iconAnimation.update();
    }
    if (audioVisualizer) {
      audioVisualizer.update();
      audioVisualizer.draw();
    }
    if (frameRateVisualizer) {
      frameRateVisualizer.update();
      frameRateVisualizer.draw();
    }
    if (lipSync) {
      lipSync.draw();
    }
    if (silhouette) {
      silhouette.draw();
    }
    if (updateChecker) {
      updateChecker.check();
    }
  }
};

//-------------------------------------------------------------------------

})();
