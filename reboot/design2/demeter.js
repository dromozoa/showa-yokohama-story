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
// という寸法を持つ。フォントサイズが100pxのとき、カーニングが効いていれば、文
// 字列"\uE001\uE0002"の幅は140pxになる。

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
    return { char: char, code: char.codePointAt(0), width: width, advance: width };
  });

  if (D.featureKerning) {
    result.slice(1).forEach((v, i) => {
      const u = result[i];
      u.advance = context.measureText(u.char + v.char).width - v.width;
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
        text.items.push(item = { main: parseChars(node.textContent, fontSize, font) });
        break;
    };
  };
  parse(source);

  return result;
};

//-------------------------------------------------------------------------

const getRubyOverhang = u => D.jlreq.canRubyOverhang(u.code) ? u.advance * 0.5 : 0;

const isUnbreakable = (u, v) => {
  const a = u.code;
  const b = v.code;

  // 行頭禁則と行末禁則
  return D.jlreq.isLineStartProhibited(b) || D.jlreq.isLineEndProhibited(a)
    // 連続するダッシュ・三点リーダ・二点リーダ
    || a === b && (a === 0x2014 || a === 0x2026 || a === 0x2025)
    // くの字
    || (a === 0x3033 || a === 0x3034) && b === 0x3035
    // 前置省略記号とアラビア数字
    || D.jlreq.isPrefixedAbbreviation(a) && 0x30 <= b && b <= 0x39
    // アラビア数字と後置省略記号
    || 0x30 <= a && a <= 0x39 && D.jlreq.isPostfixedAbbreviation(b)
    // 連続する欧文用文字
    || D.jlreq.isWesternCharacter(a) && D.jlreq.isWesternCharacter(b);
};

const isWhiteSpace = u => u.code === 0x20 || u.code === 0x09 || u.code === 0x0A || u.code === 0x0D;

D.composeText = (source, maxWidth) => {
  let line = [];
  const result = [ line ];

  source.items.forEach((item, i) => {
    let rubySpacing = 0;
    if (item.ruby) {
      const mainWidth = item.main.reduce((width, u) => width + u.advance, 0);
      const rubyWidth = item.ruby.reduce((width, u) => width + u.advance, 0);
      if (mainWidth < rubyWidth) {
        let rubyOverhangBefore = 0;
        const before = source.items[i - 1];
        if (before && !before.ruby) {
          rubyOverhangBefore = getRubyOverhang(before.main.slice(-1)[0]);
        }

        let rubyOverhangAfter = 0;
        const after = source.items[i + 1];
        if (after && !after.ruby) {
          rubyOverhangAfter = getRubyOverhang(after.main[0]);
        }

        rubySpacing = Math.max(0, rubyWidth - (rubyOverhangBefore + mainWidth + rubyOverhangAfter)) / item.main.length;
      }
    }

    item.main.forEach(u => {
      u.rubySpacing = rubySpacing;

      const width = line.reduce((width, u) => width + u.advance + u.rubySpacing, 0) + u.width + u.rubySpacing;
      if (width <= maxWidth) {
        line.push(u);
      } else {
        line.push(u);
        const index = line.slice(0, -1).findLastIndex((u, i) => {
          const v = line[i + 1];
          return !isUnbreakable(u, v);
        });

        if (index === -1) {
          result.push(line = line.splice(-1));
        } else {
          result.push(line = line.splice(index + 1));
        }
      }
    });
  });

  const element = D.createElement(`<div></div>`);
  result.forEach(line => {
    const div = D.createElement(`<div></div>`);
    line.forEach(u => {
      div.append(D.createElement(`
        <span style="
          display: inline-block;
          width: ${D.numberToCssString(u.advance)}px;
          margin-right: ${D.numberToCssString(u.rubySpacing)}px;
        ">${D.escapeHTML(u.char)}</span>
      `));
    });
    element.append(div);
  });
  return element;
};

//-------------------------------------------------------------------------

})();
