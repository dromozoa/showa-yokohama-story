// Copyright (C) 2022,2023 Tomoyuki Fujimori <moyu@dromozoa.com>
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

D.numberToString = v => Math.abs(v) < 0.00005 ? "0" : v.toFixed(4).replace(/\.?0*$/, "");

D.numberToCss = (v, unit = "px") => D.numberToString(v) + unit;

D.toCssColor = (r, g, b, a = 1) => "rgba(" + D.numberToCss(r * 100, "%,") + D.numberToCss(g * 100, "%,") + D.numberToCss(b * 100, "%,") + D.numberToCss(a * 100, "%)");

//-------------------------------------------------------------------------

let serialNumber = 0;

D.getSerialNumber = () => {
  return ++serialNumber;
};

//-------------------------------------------------------------------------

let internalRoot;
let internalCanvas;

const initializeInternal = () => {
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
    };
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
      <g clip-path="url(#${clipId})">
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

  let buttonsHtml = '<g class="buttons">';
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
      <g class="button button${i}">
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
        <g class="demeter-button demeter-button1"><path d="${button1PathData}"/></g>
        <g class="demeter-button demeter-button2"><path d="${button2PathData}"/></g>
        <g class="demeter-button demeter-button3"><path d="${button3PathData}"/></g>
        <g class="demeter-button demeter-button4"><path d="${button4PathData}"/></g>
        <g class="demeter-button demeter-button5"><path d="${button5PathData}"/></g>
      </g>
    </svg>
  `;
  return template.content.firstElementChild;
};

//-------------------------------------------------------------------------

D.Logging = class {
  constructor(limit) {
    this.limit = limit;
  }

  log(message) {
    const loggingNode = document.querySelector(".demeter-main-logging");
    const messageNode = document.createElement("div");
    messageNode.textContent = message;
    loggingNode.append(messageNode);
    while (loggingNode.children.length > this.limit) {
      loggingNode.firstElementChild.remove();
    }
    messageNode.scrollIntoView({ behavior: "smooth", block: "end", inline: "start" });
  }
};

//-------------------------------------------------------------------------

D.TaskSet = class {
  constructor() {
    this.prevTime = undefined;
    this.set = new Set();
  }

  async update() {
    const now = performance.now();
    if (this.prevTime === undefined) {
      this.prevTime = now;
      return;
    }
    const duration = now - this.prevTime;
    if (duration < 1000) {
      return;
    }
    await Promise.all([...this.set].map(task => task()));
    this.set.clear();
    this.prevTime = performance.now();
  }

  add(task) {
    this.set.add(task);
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

    const context = canvas.getContext("2d");
    context.scale(devicePixelRatio, devicePixelRatio);
    context.fillStyle = color;

    const analyser = Howler.ctx.createAnalyser();
    analyser.fftSize = Math.pow(2, Math.ceil(Math.log2(width)));
    analyser.connect(Howler.ctx.destination);
    Howler.masterGain.connect(analyser);

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.analyser = analyser;
    this.frequencyData = new Float32Array(analyser.fftSize / 2);
  }

  update() {
    this.analyser.getFloatFrequencyData(this.frequencyData);
  }

  updateColor(color) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = color;
  }

  draw() {
    const W = this.width;
    const H = this.height;
    const HH = H * 0.5;
    const maxDecibels = -30;
    const minDecibels = -100;
    const rangeDecibels = maxDecibels - minDecibels;

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, W, H);

    const w = W / this.analyser.frequencyBinCount;
    for (let i = 0; i < this.analyser.frequencyBinCount; ++i) {
      const v = (Math.max(minDecibels, Math.min(maxDecibels, this.frequencyData[i])) - minDecibels) / rangeDecibels;
      const h = v * H;
      context.fillRect(i * w, HH - h * 0.5, w, h);
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

    const context = canvas.getContext("2d");
    context.scale(devicePixelRatio, devicePixelRatio);
    context.lineWidth = 1;
    context.fillStyle = color;
    context.strokeStyle = color;
    context.font = D.numberToCss(fontSize) + " " + font;
    context.textBaseline = "top";

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.fontSize = fontSize;
    this.prevTime = undefined;
    this.frameCount = 0;
    this.frameRates = new D.RingBuffer(width - 2);
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
    const context = this.canvas.getContext("2d");
    context.fillStyle = color;
    context.strokeStyle = color;
  }

  draw() {
    const W = this.width;
    const H = this.height;
    const context = this.canvas.getContext("2d");
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

D.Silhouette = class {
  constructor(width, height, color) {
    const canvas = document.createElement("canvas");
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = D.numberToCss(width);
    canvas.style.height = D.numberToCss(height);

    const context = canvas.getContext("2d");
    context.scale(devicePixelRatio, devicePixelRatio);
    context.lineWidth = 0.5;
    context.strokeStyle = color;

    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.speaker = undefined;
  }

  updateColor(color) {
    const context = this.canvas.getContext("2d");
    context.strokeStyle = color;
  }

  updateSpeaker(speaker) {
    this.speaker = speaker;
  }

  draw() {
    const context = this.canvas.getContext("2d");
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
  constructor(volume) {
    this.volume = volume;
    this.sound = undefined;
    this.soundId = undefined;
  }

  start(key) {
    const basename = "../output/music/sessions_" + key;

    // onunlockは複数回呼ばれうる。
    let unlocked = false;
    this.sound = new Howl({
      src: [ basename + ".webm", basename + ".mp3" ],
      volume: this.volume,
      loop: true,
      onloaderror: (soundId, message) => {
        console.log("onloaderror", soundId, message);
      },
      onplayerror: (soundId, message) => {
        console.log("onplayerror", soundId, message);
      },
      onfade: soundId => {
        console.log("onfade", soundId);
      },
      onunlock: () => {
        if (!unlocked) {
          unlocked = true;
          const color = D.toCssColor(...system.componentColor, system.componentOpacity);
          audioVisualizer = new D.AudioVisualizer(fontSize * 10, fontSize * 5, color);
          audioVisualizer.canvas.style.display = "block";
          audioVisualizer.canvas.style.position = "absolute";
          document.querySelector(".demeter-main-audio-visualizer").append(audioVisualizer.canvas);
          logging.log("オーディオロック: 解除");
        }
      },
    });

    this.soundId = this.sound.play();
    logging.log("音楽開始: " + key);
  }

  fade(key) {
    const basename = "../output/music/sessions_" + key;
    const sound = new Howl({
      src: [ basename + ".webm", basename + ".mp3" ],
      volume: 0,
      loop: true,
    });
    const soundId = sound.play();

    this.sound.once("fade", sid => {
      console.log("fade", this.soundId, sid, soundId);
      this.sound.stop();
      this.sound = sound;
      this.soundId = soundId;
    });

    this.sound.fade(this.volume, 0, 5000, this.soundId);
    sound.fade(0, this.volume, 5000, soundId);
  }

  updateVolume(volume) {
    this.volume = volume;
    if (this.sound) {
      this.sound.volume(volume);
    }
  }
};

//-------------------------------------------------------------------------

D.TextAnimation = class {
  constructor(textNode, speed) {
    this.nodes = [...textNode.querySelectorAll(":scope > div > span")];
    this.nodes.forEach(node => node.style.opacity = "0");
    this.speed = speed;
    this.finished = false;
  }

  async start() {
    let index = 0;
    let start;
    L: while (!this.finished) {
      const timestamp = await D.requestAnimationFrame();
      if (start === undefined) {
        start = timestamp;
      }

      while (true) {
        const node = this.nodes[index];
        if (!node) {
          break L;
        }

        const duration = timestamp - start;
        if (duration < this.speed) {
          node.style.opacity = D.numberToString(duration / this.speed);
          break;
        } else {
          node.style.opacity = "1";
          start += this.speed;
          ++index;
        }
      }
    }
    if (this.finished) {
      this.nodes.forEach(node => node.style.opacity = "1");
    }
  }

  finish() {
    this.finished = true;
  }
};

//-------------------------------------------------------------------------

D.VoiceSprite = class {
  constructor(sound, sprite, volume) {
    this.sound = sound;
    this.sprite = sprite;
    this.volume = volume;
    this.soundId = undefined;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.sound.once("playerror", (soundId, message) => {
        if (this.soundId === soundId) {
          this.soundId = undefined;
          reject(new Error(message));
        }
      });

      this.sound.once("end", soundId => {
        if (this.soundId === soundId) {
          this.soundId = undefined;
          resolve("end");
        }
      });

      this.sound.once("stop", soundId => {
        if (this.soundId === soundId) {
          this.soundId = undefined;
          resolve("stop");
        }
      });

      this.soundId = this.sound.play(this.sprite);
      this.updateVolume(this.volume);
    });
  }

  updateVolume(volume) {
    if (this.soundId !== undefined) {
      this.sound.volume(volume, this.soundId);
    }
  }

  finish() {
    if (this.soundId !== undefined) {
      this.sound.stop(this.soundId);
    }
  }
};

//-------------------------------------------------------------------------

const fontSize = 24;
const font = "'BIZ UDPMincho', 'Source Serif Pro', serif";

const systemDefault = {
  id: "system",
  speed: 30,
  autoSpeed: 400,
  masterVolume: 1,
  musicVolume: 1,
  voiceVolume: 1,
  componentColor: [1, 1, 1],
  componentOpacity: 0.25,
  logging: true,
  audioVisualizer: true,
  frameRateVisualizer: true,
  silhouette: true,
  unionSetting: "ろうそ",
};

const logging = new D.Logging(100);
const taskSet = new D.TaskSet();
let database;

let system;
let systemUi;
let audioVisualizer;
let frameRateVisualizer;
let silhouette;
let musicPlayer;
let voiceSprite;

let iconAnimation;

//-------------------------------------------------------------------------

const saveSystemTask = async () => {
  try {
    await database.put("system", system);
    logging.log("システム設定保存: 成功");
  } catch (e) {
    logging.log("システム設定保存: 失敗");
    logging.log(e.message);
  }
};

//-------------------------------------------------------------------------

const upgradeDatabase = (db, oldVersion, newVersion) => {
  switch (oldVersion) {
    case 0:
      db.createObjectStore("system", { keyPath: "id" });
      break;
  }
};

const initializeDatabase = async () => {
  try {
    database = await idb.openDB("昭和横濱物語", 1, { upgrade: upgradeDatabase });

    system = await database.get("system", "system") || {};
    Object.entries(systemDefault).forEach(([k, v]) => {
      if (system[k] === undefined) {
        system[k] = v;
      }
    });
    await database.put("system", system);

    logging.log("ローカルデータベース接続: 成功");
  } catch (e) {
    logging.log("ローカルデータベース接続: 失敗");
    logging.log(e.message);
  }
};

//-------------------------------------------------------------------------

const updateComponentColor = () => {
  document.documentElement.style.setProperty("--component-color", D.toCssColor(...system.componentColor));
  const color = D.toCssColor(...system.componentColor, system.componentOpacity);
  if (audioVisualizer) {
    audioVisualizer.updateColor(color);
  }
  frameRateVisualizer.updateColor(color);
  silhouette.updateColor(color);
};

const updateComponentOpacity = () => {
  document.documentElement.style.setProperty("--component-opacity", system.componentOpacity);
  const color = D.toCssColor(...system.componentColor, system.componentOpacity);
  if (audioVisualizer) {
    audioVisualizer.updateColor(color);
  }
  frameRateVisualizer.updateColor(color);
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
  silhouette = new D.Silhouette(fontSize * 16, fontSize * 25, color);
  silhouette.canvas.style.display = "block";
  silhouette.canvas.style.position = "absolute";
  silhouette.updateSpeaker("danu");
  document.querySelector(".demeter-main-silhouette").append(silhouette.canvas);

  updateComponentColor();
  updateComponentOpacity();
  updateComponents();

  logging.log("コンポーネント初期化: 完了");
};

//-------------------------------------------------------------------------

// gui.addFolderはtouchStylesを継承しないので、で作成する。
const addSystemUiFolder = (gui, title) => {
  const folder = new lil.GUI({
    parent: gui,
    title: title,
    touchStyles: false,
  });
  return folder;
};

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
  systemUi.onChange(() => taskSet.add(saveSystemTask));

  systemUi.add(system, "speed", 0, 100, 1).name("文字表示時間 [ms]");
  systemUi.add(system, "autoSpeed", 0, 1000, 10).name("自動行送り時間 [ms]");
  systemUi.add(system, "masterVolume", 0, 1, 0.01).name("全体の音量 [0-1]").onChange(v => {
    if (Howler.masterGain) {
      Howler.volume(v);
    }
  });
  systemUi.add(system, "musicVolume", 0, 1, 0.01).name("音楽の音量 [0-1]").onChange(v => {
    if (musicPlayer) {
      musicPlayer.updateVolume(v);
    }
  });
  systemUi.add(system, "voiceVolume", 0, 1, 0.01).name("音声の音量 [0-1]");

  const componentFolder = addSystemUiFolder(systemUi, "コンポーネント設定");
  componentFolder.addColor(system, "componentColor").name("色 [#RGB]").onChange(updateComponentColor);
  componentFolder.add(system, "componentOpacity", 0, 1, 0.01).name("不透明度 [0-1]").onChange(updateComponentOpacity);
  componentFolder.add(system, "logging").name("表示: ロギング").onChange(updateComponents);
  componentFolder.add(system, "audioVisualizer").name("表示: オーディオ").onChange(updateComponents);
  componentFolder.add(system, "frameRateVisualizer").name("表示: フレームレート").onChange(updateComponents);
  componentFolder.add(system, "silhouette").name("表示: シルエット").onChange(updateComponents);
  componentFolder.add(system, "unionSetting", [ "ろうそ", "ろうくみ" ]).name("設定: 労組");

  // openAnimated(false)のトランジションが終わったらUIを隠す。
  // ev.propertyNameは安定しないので判定に利用しない。
  let initialized = false;
  systemUiNode.addEventListener("transitionend", ev => {
    if (systemUi._closed && !systemUi._hidden && ev.target === systemUi.$children) {
      systemUi.hide();
      systemUiNode.style.display = "none";
      if (!initialized) {
        initialized = true;
        logging.log("システム設定初期化: 完了");
      }
    }
  });

  systemUi.openAnimated(false);
};

//-------------------------------------------------------------------------

const initializeTitleScreen = () => {
  document.querySelector(".demeter-title-screen").addEventListener("click", async () => {
    document.querySelector(".demeter-offscreen").append(document.querySelector(".demeter-title-screen"));
    document.querySelector(".demeter-camera").append(document.querySelector(".demeter-main-screen"));
    iconAnimation.stop();
    iconAnimation = undefined;

    // debug
    iconAnimation = new D.IconAnimation(document.querySelector(".demeter-main-paragraph-icon"));
    iconAnimation.start();
  });
  iconAnimation = new D.IconAnimation(document.querySelector(".demeter-title-icon"));
  iconAnimation.start();
};

const initializeMainScreen = () => {
  initializeSystemUi();

  const menuFrameNode = D.createMenuFrame(fontSize * 9, fontSize * 7, fontSize * 2);
  document.querySelector(".demeter-main-menu-frame").append(menuFrameNode);

  // システムメニュー
  menuFrameNode.querySelector(".demeter-button1").addEventListener("click", async () => {
    if (systemUi._hidden) {
      const systemUiNode = document.querySelector(".demeter-main-system-ui");
      systemUiNode.style.display = "block";
      systemUi.show();
      systemUi.openAnimated();
    } else {
      systemUi.openAnimated(false);
    }
  });
};

//-------------------------------------------------------------------------

const initializeAudio = () => {
  Howler.volume(system.masterVolume);
  musicPlayer = new D.MusicPlayer(system.musicVolume);
  musicPlayer.start("vi03");
  logging.log("オーディオ初期化: 完了");
};

//-------------------------------------------------------------------------

const resize = () => {
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;

  let screenWidth;
  let screenHeight;
  if (W <= H) {
    screenWidth = fontSize * 27;
    screenHeight = fontSize * 48;
  } else {
    screenWidth = fontSize * 48;
    screenHeight = fontSize * 27;
  }

  const transform = "translate(" +
    D.numberToCss((W - screenWidth) * 0.5) + "," +
    D.numberToCss((H - screenHeight) * 0.5) + ") scale(" +
    D.numberToString(Math.min(1, W / screenWidth, H / screenHeight)) + ")";

  document.querySelector(".demeter-title-screen").style.transform = transform;
  document.querySelector(".demeter-main-screen").style.transform = transform;
  updateComponents();
};

//-------------------------------------------------------------------------

window.addEventListener("resize", resize);

document.addEventListener("DOMContentLoaded", async () => {
  initializeInternal();
  await initializeDatabase();
  initializeTitleScreen();
  initializeMainScreen();
  initializeAudio();
  resize();
  document.querySelector(".demeter-camera").append(document.querySelector(".demeter-title-screen"));

  while (true) {
    await D.requestAnimationFrame();
    await taskSet.update();
    if (audioVisualizer) {
      audioVisualizer.update();
      audioVisualizer.draw();
    }
    if (frameRateVisualizer) {
      frameRateVisualizer.update();
      frameRateVisualizer.draw();
    }
    if (silhouette) {
      silhouette.draw();
    }
    if (iconAnimation) {
      iconAnimation.update();
    }
  }

}, { once: true });

//-------------------------------------------------------------------------

/*
const root = {
  db: undefined,
  systemDefault: {
    id: "system",
    speed: 30,
    autoSpeed: 400,
    masterVolume: 1,
    musicVolume: 1,
    voiceVolume: 1,
    componentColor: [ 1, 1, 1 ],
    componentAlpha: 0.2,
  },
  system: undefined,
  systemUi: undefined,
  musicPlayer: undefined,
  textAnimation: undefined,
  voiceSprite: undefined,
};

//-------------------------------------------------------------------------

const initializeGame = () => {
};

const initializeAudio = () => {
  Howler.volume(root.system.masterVolume);
  root.musicPlayer = new D.MusicPlayer("vi03", root.system.musicVolume);

  const color = D.toCssColor(...root.system.componentColor, root.system.componentAlpha);
  const audioVisualizer = root.audioVisualizer = new D.AudioVisualizer(fontSize * 8, fontSize * 4, color);
  const audioVisualizerNode = audioVisualizer.canvas;
  audioVisualizerNode.style.display = "block";
  audioVisualizerNode.style.position = "absolute";
  audioVisualizerNode.style.top = D.numberToCss(fontSize * 10);
  audioVisualizerNode.style.left = D.numberToCss(fontSize);
  document.querySelector(".demeter-main-screen").append(audioVisualizerNode);
};

//-------------------------------------------------------------------------

const upgradeDatabase = (db, oldVersion, newVersion) => {
  switch (oldVersion) {
    case 0:
      db.createObjectStore("system", { keyPath: "id" });
      break;
  }
};

const connectDatabase = async () => {
  const db = root.db = await idb.openDB("昭和横濱物語", 1, { upgrade: upgradeDatabase });

  const system = root.system = await db.get("system", "system") || {};
  Object.entries(root.systemDefault).forEach(([k, v]) => {
    if (system[k] === undefined) {
      system[k] = v;
    }
  });
  await db.put("system", system);
};

const updateComponentColors = () => {
  const color = D.toCssColor(...root.system.componentColor, root.system.componentAlpha);
  if (root.frameRateVisualizer) {
    root.frameRateVisualizer.updateColor(color);
  }
  if (root.audioVisualizer) {
    root.audioVisualizer.updateColor(color);
  }
};

const initializeSystemUi = () => {
  const system = root.system;

  // オフスクリーンでUIを構築する。
  const systemUiNode = document.querySelector(".demeter-main-system-ui");
  const systemUi = root.systemUi = new lil.GUI({
    container: systemUiNode,
    width: fontSize * 12,
    title: "システム設定",
    touchStyles: false,
  });
  systemUi.add(system, "speed", 0, 100, 1).name("文字表示時間 [ms]");
  systemUi.add(system, "autoSpeed", 0, 1000, 10).name("自動行送り時間 [ms]");
  systemUi.add(system, "masterVolume", 0, 1, 0.01).name("全体の音量 [0-1]").onChange(v => {
    if (Howler.masterGain !== undefined) {
      Howler.volume(v);
    }
  });
  systemUi.add(system, "musicVolume", 0, 1, 0.01).name("音楽の音量 [0-1]").onChange(v => {
    if (root.musicPlayer !== undefined) {
      root.musicPlayer.updateVolume(v);
    }
  });
  systemUi.add(system, "voiceVolume", 0, 1, 0.01).name("話声の音量 [0-1]").onChange(v => {
    if (root.voiceSprite !== undefined) {
      root.voiceSprite.updateVolume(v);
    }
  });
  const componentFolder = systemUi.addFolder("コンポーネント設定");
  componentFolder.addColor(system, "componentColor").name("色 [#RGB]").onChange(updateComponentColors);
  componentFolder.add(system, "componentAlpha", 0, 1, 0.01).name("透明度 [0-1]").onChange(updateComponentColors);

  // openAnimated(false)のトランジションが終わったらUIを閉じる。
  let moved = false;
  systemUiNode.addEventListener("transitionend", ev => {
    if (systemUi._closed && ev.target === systemUi.$children && ev.propertyName === "transform") {
      systemUi.hide();
      // 初回のトランジション終了後、オフスクリーンからメインスクリーンに移す。
      if (!moved) {
        moved = true;
        document.querySelector(".demeter-main-screen").append(systemUiNode);
      }
    }
  });

  systemUi.openAnimated(false);
};

const saveSystemData = async () => {
  await root.db.put("system", root.system);
};

//-------------------------------------------------------------------------

let paragraphIndexPrev = 0;
let paragraphIndex;
let textNumber;
let baseNumber;
let baseState;
let baseTimestamp;

const nextParagraph = async () => {
  if (paragraphIndex !== undefined) {
    return;
  }
  paragraphIndex = paragraphIndexPrev + 1;

  const paragraph = D.scenario[paragraphIndex - 1];

  const textNodes = [];
  const textAnimations = [];
  D.parseParagraph(paragraph[1], fontSize, font).forEach(text => {
    const textNode = D.layoutText(D.composeText(text, fontSize * 25), fontSize, fontSize * 2);
    textNodes.push(textNode);
    textAnimations.push(new D.TextAnimation(textNode, 30));
  });
  document.querySelector(".demeter-main-paragraph-text").replaceChildren(...textNodes);

  const voiceKey = D.numberToString(paragraphIndex);
  const voiceBasename = "../output/voice/" + "0".repeat(Math.max(0, 4 - voiceKey.length)) + voiceKey;
  const voiceSound = new Howl({
    src: [ voiceBasename + ".webm", voiceBasename + ".mp3" ],
    sprite: D.voiceSprites[paragraphIndex - 1],
  });

  for (let i = 0; i < textAnimations.length; ++i) {
    root.textAnimation = textAnimations[i];
    root.voiceSprite = new D.VoiceSprite(voiceSound, D.numberToString(i + 1), root.system.voiceVolume);
    await Promise.all([
      root.textAnimation.start(),
      root.voiceSprite.start(),
    ]);
  }
  root.textAnimation = undefined;
  root.voiceSprite = undefined;

  paragraphIndexPrev = paragraphIndex;
  paragraphIndex = undefined;
};

//-------------------------------------------------------------------------

const updateTitleScreen = text => {
  const node = document.querySelector(".demeter-title-text").firstElementChild;
  node.textContent = text;
};

const initializeTitleScreen = () => {
  // TODO セーブ状況により、サブタイトルが変化する
  updateTitleScreen("EVANGELIUM SECUNDUM STEPHANUS verse I-III");

  document.querySelector(".demeter-title-screen").addEventListener("click", async () => {
    root.musicPlayer.fade("diana33");
    // await unlockAudio2();
    // await nextParagraph();
  });
};

const initializeMainScreen = () => {
  const menuFrameNode = D.createMenuFrame(fontSize * 9, fontSize * 7, fontSize * 2);
  document.querySelector(".demeter-main-menu-frame").append(menuFrameNode);

  menuFrameNode.querySelector(".demeter-button1").addEventListener("click", async () => {
    const systemUi = root.systemUi;
    if (systemUi._hidden) {
      systemUi.show();
      systemUi.openAnimated();
    } else {
      systemUi.openAnimated(false);
      await saveSystemData();
    }
  });
  menuFrameNode.querySelector(".demeter-button2").addEventListener("click", () => {
    console.log("load");
  });
  menuFrameNode.querySelector(".demeter-button3").addEventListener("click", () => {
    console.log("save");
  });
  menuFrameNode.querySelector(".demeter-button4").addEventListener("click", () => {
    console.log("auto");
  });
  menuFrameNode.querySelector(".demeter-button5").addEventListener("click", () => {
    console.log("skip");
  });

  const color = D.toCssColor(...root.system.componentColor, root.system.componentAlpha);
  const frameRateVisualizer = root.frameRateVisualizer = new D.FrameRateVisualizer(fontSize * 8, fontSize * 4, fontSize, "'Share Tech', sans-serif", color);
  const frameRateNode = frameRateVisualizer.canvas;
  frameRateNode.style.display = "block";
  frameRateNode.style.position = "absolute";
  frameRateNode.style.top = D.numberToCss(fontSize * 5);
  frameRateNode.style.left = D.numberToCss(fontSize);
  document.querySelector(".demeter-main-screen").append(frameRateNode);
};

const initialize = () => {
  initializeTitleScreen();
  initializeMainScreen();
};

//-------------------------------------------------------------------------

const resizeScreen = () => {
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;

  // TODO portraitとlandscapeを分ける
  const isPortrait = W <= H;

  const sizeMin = fontSize * 27;
  const sizeMax = fontSize * 48;

  const titleScreenNode = document.querySelector(".demeter-title-screen");
  if (titleScreenNode) {
    const scale = Math.min(1, W / sizeMin, H / sizeMin);
    titleScreenNode.style.transform = "translate(" +
      D.numberToCss((W - sizeMin) * 0.5) + "," +
      D.numberToCss((H - sizeMin) * 0.5) + ") scale(" +
      D.numberToString(scale) + ")";
  }

  const mainScreenNode = document.querySelector(".demeter-main-screen")
  if (mainScreenNode) {
    const scale = Math.min(1, W / sizeMin, H / sizeMax);
    mainScreenNode.style.transform = "translate(" +
      D.numberToCss((W - sizeMin) * 0.5) + "," +
      D.numberToCss(H + (H - sizeMax) * 0.5) + ") scale(" +
      D.numberToString(scale) + ")";
  }
};

window.addEventListener("resize", () => {
  resizeScreen();
});

window.addEventListener("orientationchange", () => {
  resizeScreen();
});

window.addEventListener("keydown", async ev => {
  console.log("keydown", ev.code);

  if (ev.code === "Enter") {
    if (root.textAnimation !== undefined) {
      root.textAnimation.finish();
      if (root.voiceSprite !== undefined) {
        root.voiceSprite.finish();
      }
    } else {
      await nextParagraph();
    }
  }

});

window.addEventListener("keyup", ev => {
  // console.log("keyup", ev.code);
});

//-------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  initializeInternal();
  resizeScreen();
  await connectDatabase();

  initialize();

  Howler.volume(root.system.masterVolume);
  root.musicPlayer = new D.MusicPlayer(root.system.musicVolume);
  root.musicPlayer.start("vi03");

  resizeScreen();

  initializeSystemUi();

  while (true) {
    await D.requestAnimationFrame();
    root.frameRateVisualizer.update();
    root.frameRateVisualizer.draw();

    if (root.audioVisualizer) {
      root.audioVisualizer.update();
      root.audioVisualizer.draw();
    }
  }
}, { once: true });
*/

//-------------------------------------------------------------------------

})();
