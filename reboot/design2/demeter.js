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

const escapeHTMLTable = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

D.escapeHTML = source => source.replace(/[&<>"']/g, match => escapeHTMLTable[match]);

D.createElement = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
};

D.createElements = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.children;
};

D.numberToCssString = source => {
  if (-0.00005 < source && source < 0.00005) {
    return "0";
  } else {
    return source.toFixed(4).replace(/\.?0$/, "");
  }
};

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
let internalLayout;

const initializeInternalRoot = () => {
  internalRoot = document.body.appendChild(D.createElement(`
    <div style="
      position: absolute;
      width: auto;
      height: auto;
      top: -1989px;
      left: -6417px;
    "></div>
  `)).attachShadow({ mode: "closed" });

  const view = internalRoot.appendChild(D.createElement(`
    <div>
      <div><canvas></canvas></div>
      <div style="
        position: relative;
        width: auto;
        height: auto;
      "></div>
    </div>
  `));
  internalCanvas = view.firstElementChild.firstElementChild;
  internalLayout = view.children[1];
};

//-------------------------------------------------------------------------

// Showa Yokohama Storyフォントは
//   U+E001:   800/1000
//   U+E002:   900/1000
//   Kerning: -300/1000
// という寸法を持つ。フォントサイズが100pxのとき、カーニングが有効ならば、文字
// 列"\uE001\uE0002"の幅は140pxになる。

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
// っているように見えた。そのため、ポーリングしてdocument.facesを監視することに
// した。

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

const parseChars = (source, fontSize, font) => {
  const context = internalCanvas.getContext("2d");
  context.font = `${D.numberToCssString(fontSize)}px ${font}`;

  const result = [...source].map(char => {
    const width = context.measureText(char).width;
    return {
      char: char,
      code: char.codePointAt(0),
      width: width,
      advance: width,
      kerning: 0,
      spacing: 0,
    };
  });

  if (D.featureKerning) {
    result.slice(1).forEach((v, i) => {
      const u = result[i];
      u.kerning = u.width - (u.advance = context.measureText(u.char + v.char).width - v.width);
    });
  }

  return result;
};

const parseParagraphBreakTable = {
  "BR": true,
  "DIV": true,
  "P": true,
};

D.parseParagraph = (source, fontSize, font) => {
  const result = [];
  let text;
  let item;

  const parse = node => {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (node.tagName === "RT") {
          item.ruby = parseChars(node.textContent, fontSize * 0.5, font);
        } else {
          node.childNodes.forEach(parse);
          if (parseParagraphBreakTable[node.tagName]) {
            text = undefined;
          }
        }
        break;
      case Node.TEXT_NODE:
        if (!text) {
          result.push(text = { items: [], fontSize: fontSize, font: font });
        }
        text.items.push(item = {
          main: parseChars(node.textContent, fontSize, font),
          rubyOverhangPrev: 0,
          rubyOverhangNext: 0,
        });
        break;
    };
  };
  parse(source);

  return result;
};

//-------------------------------------------------------------------------

// const isWhiteSpace = u => u.code === 0x20 || u.code === 0x09 || u.code === 0x0A || u.code === 0x0D;

const canBreak = (u, v) =>
  // 行頭禁則
  !( D.jlreq.isLineStartProhibited(v)
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
  || D.jlreq.isWesternCharacter(u) && D.jlreq.isWesternCharacter(v));

// 改行直後の文字の位置を返す。
const breakLine = (source, maxWidth) => {
  let advance = 0;
  const limit = source.findIndex(u => maxWidth < (advance += u.advance + u.spacing) + u.kerning);
  const index = source.slice(1, limit + 1).findLastIndex((v, i) => canBreak(source[i].code, v.code));
  return index === -1 ? limit : index + 1;
};

const getRubyOverhang = u => u && D.jlreq.canRubyOverhang(u.code) ? u.advance * 0.5 : 0;

const updateLayout = source => {
  source.forEach((item, i) => {
    if (item.ruby) {
      const mainWidth = item.main.reduce((width, u) => width + u.advance, 0);
      const rubyWidth = item.ruby.reduce((width, u) => width + u.advance, 0) + item.ruby.slice(-1)[0].kerning;

      const prev = source[i - 1];
      const next = source[i + 1];
      const rubyOverhangPrev = getRubyOverhang(prev && !prev.ruby && prev.main.slice(-1)[0]);
      const rubyOverhangNext = getRubyOverhang(next && !next.ruby && next.main[0]);
      const rubyOverhangSum = rubyOverhangPrev + rubyOverhangNext;
      const rubyOverhang = Math.max(0, Math.min(rubyWidth - mainWidth, rubyOverhangSum));
      const rubyOverhangRatio = rubyOverhangSum > 0 ? rubyOverhang / rubyOverhangSum : 0;

      const mainSpacing = Math.max(0, rubyWidth - (mainWidth + rubyOverhang)) / item.main.length;
      const rubySpacing = Math.max(0, (mainWidth + rubyOverhang) - rubyWidth) / item.main.length;

      item.main.forEach(u => u.spacing = mainSpacing);
      item.ruby.forEach(u => u.spacing = rubySpacing);
      item.ruby[0].spacing = Math.max(0, (rubySpacing - item.ruby[0].advance) * 0.5);
      item.rubyOverhangPrev = rubyOverhangPrev * rubyOverhangRatio;
      item.rubyOverhangNext = rubyOverhangNext * rubyOverhangRatio;
    } else {
      item.main.forEach(u => u.spacing = 0);
      item.rubyOverhangPrev = 0;
      item.rubyOverhangNext = 0;
    }
  });
};

D.composeText = (source, maxWidth) => {
  let items1 = [...source.items];
  let items2 = [];
  let lines = [];

  while (true) {
    updateLayout(items1);
    const index = breakLine(items1.map(item => item.main).flat(), maxWidth);
    if (index !== -1) {
      // 改行直前の文字の位置とし、最低でも1文字は行に残るものとする。
      let mainIndex = Math.max(0, index - 1);
      const itemIndex = items1.findIndex(item => {
        if (mainIndex < item.main.length) {
          return true;
        } else {
          mainIndex -= item.main.length;
          return false;
        }
      });

      const item = items1[itemIndex];
      if (mainIndex === item.main.length - 1) {
        items2 = [ ...items1.splice(itemIndex + 1), ...items2 ];
        if (item.rubyOverhangPrev > 0) {
          continue;
        }
      } else {
        // itemの途中で改行している場合、分割する
        const item1 = { main: item.main.slice(0, mainIndex + 1) };
        const item2 = { main: item.main.slice(mainIndex + 1) };
        items2 = [ item2, ...items1.slice(itemIndex + 1), ...items2 ];
        items1 = [ ...items1.slice(0, itemIndex), item1 ];

        if (item.ruby) {
          const width = item1.main.reduce((width, u) => width + u.advance + u.spacing, 0) + item1.main.slice(-1)[0].kerning + item.rubyOverhangPrev;
          const index = breakLine(item.ruby, width);
          console.log("ruby breakLine", index);
          if (index === -1) {
            item1.ruby = item.ruby;
          } else if (index === 0) {
            item2.ruby = item.ruby;
          } else {
            item1.ruby = item.ruby.slice(0, index);
            item2.ruby = item.ruby.slice(index);
          }
          // ルビの割り当てを計算する
          // 第一行の幅を決める
          // mainWidth rubyOberhangBefore + width(item1.main)
          // ruby.spacingも定まっている
        }
      }
    }

    lines.push(items1);
    if (items2.length === 0) {
      break;
    } else {
      items1 = items2;
      items2 = [];
    }
  }

/*
  const items = [...source.items];
  const rubyOverhangAfter = updateSpacing(items);
  const chars = items.map(item => item.main).flat();
  console.log(rubyOverhangAfter);

  const index = breakLine(chars, maxWidth);
  if (index === -1) {
    // 改行が不要。処理終わり。
  } else {
    // 改行がどのitemで行われるか調べる。
    let offset = 0;
    let y;
    const x = items.findIndex(item => {
      y = index - offset;
      offset += item.main.length;
      return y < item.main.length;
    });

    const item = items[x];
    if (y === item.main.length - 1) {
      let new_items = items.slice(0, x + 1);
      // new_itemsで改行を調べる
      // goto!
    }

    // 改行によって分けられるitemを分割して、行にわりふる。

  }

  const result = [];
  while (true) {
    const index = breakLine(chars, maxWidth);
    if (index === -1) {
      result.push(chars);
      break;
    } else {
      result.push(chars.splice(0, index + 1));
    }
  }
*/

  // 改行位置が仮決めされたら、ルビのぶら下げにともなう調整を行う。

  const element = D.createElement(`<div></div>`);
  lines.forEach(line => {
    const div = D.createElement(`<div></div>`);
    line.forEach(item => {
      item.main.forEach(u => {
        div.append(D.createElement(`
          <span style="
            display: inline-block;
            width: ${D.numberToCssString(u.advance)}px;
            margin-right: ${D.numberToCssString(u.spacing)}px;
          ">${D.escapeHTML(u.char)}</span>
        `));
      });
    });
    element.append(div);
  });
  return element;
};

//-------------------------------------------------------------------------

})();
