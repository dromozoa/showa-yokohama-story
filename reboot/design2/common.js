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

// カーニングと両端揃えを考慮して、それぞれの「文字」の水平位置を求めたい。リ
// ガチャは無視することにする。
//
// <span>VA</span>と<span>V</span><span>A</span>の幅をくらべれば、<span>をま
// たいでカーニングしてくれるかどうかはわかる。
//
// Safariが<span>をまたぐカーニングをしてくれない。1文字ずつレイアウトして、
// 両端揃えを自前で計算すれば、求めることはできる。
//
// フォントが既知なので、フォントに設定されているカーニング情報は参照可能だが、
// 動的なカーニングに対応できない。

// そもそも文字の位置をとる方法は？
// 1. spanで囲んで、その位置をとる
//    getClientRects()で取れた
//    ビューポート基準であることに注意。
// 2. SVGはどう？
//    Chromeは<tspan>をまたいでカーニングしてくれる
// 3. 直接文字の位置はとれないのか？

(() => {
"use strict";

if (globalThis.dromozoa) {
  return;
}

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const escape_html = s => {
  return s.replace(/[&<>"']/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[match]);
};

const create_element = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
};

const create_elements = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.children;
};

const root = globalThis.dromozoa = new class {
  jlreq = globalThis.dromozoa_jlreq;
  sleep = sleep;
  escape_html = escape_html;
  create_element = create_element;
  create_elements = create_elements;

  #boot_exception;
  #booted;
  #booted_futures = [];
  #offscreen;
  feature_kerning;
  feature_kerning_span;

  async boot() {
    this.#booted = false;
    try {
      await Promise.all([ this.check_kerning() ]);
    } catch (e) {
      this.#boot_exception = e;
    }
    this.#booted = true;

    if (this.#boot_exception === undefined) {
      this.#booted_futures.forEach(future => future.resolve());
    } else {
      this.#booted_futures.forEach(future => future.reject(this.#boot_exception));
    }
    this.#booted_futures = undefined;
  }

  get booted() {
    return new Promise((resolve, reject) => {
      if (this.#booted) {
        if (this.#boot_exception === undefined) {
          resolve();
        } else {
          reject(this.#boot_exception);
        }
      } else {
        this.#booted_futures.push({ resolve: resolve, reject: reject });
      }
    });
  }

  get offscreen() {
    return this.#offscreen ||= document.body.appendChild(create_element(`
      <div style="
        display: block;
        position: absolute;
        /*
        top: -9999px;
        left: -9999px;
        */
      "></div>
    `));
  }

  // Firefox 107でFontFace.load()が止まる場合があったので、HTMLからロードして
  // statusを監視する。
  async load_font_face(font_face, timeout) {
    const n = 4;
    const test = [];

    // unicode-rangeが指定されていないとU+0-10FFFFになる
    L:
    for (let range of font_face.unicodeRange.split(/,\s*/)) {
      const match = range.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
      const a = Number.parseInt(match[1], 16);
      const b = match[2] === undefined ? a : Number.parseInt(match[2], 16);
      for (let code = a; code <= b; ++code) {
        if (code > 0x20) {
          if (test.push("&#" + code + ";") === n) {
            break L;
          }
        }
      }
    }

    const view = this.offscreen.appendChild(create_element(`
      <div style="
        font-family: ${escape_html(font_face.family)};
        font-size: 50px;
        white-space: nowrap;
      ">${test.join("")}</div>
    `));

    const start = performance.now();
    let elapsed;
    while (true) {
      elapsed = performance.now() - start;
      if (timeout && timeout > 0 && timeout < elapsed) {
        break;
      }
      if (font_face.status === "loaded") {
        break;
      }
      await sleep(50);
    }

    view.remove();

    return elapsed;
  }

  // Showa Yokohama Storyフォントは下記の寸法を持つ。
  //   U+E001:  800/1000
  //   U+E002:  900/1000
  //   字間:   -300/1000
  //
  // (U+E001,E+E0002)をレイアウトすると
  //   カーニング無効時: 1700/1000
  //   カーニング有効時: 1400/1000
  // になる。
  //
  // feature_kerning
  //   カーニングが有効化どうか。
  // feature_kerning_span
  //   <span>をまたいでカーニングするかどうか。Safari 16は<span>をまたいでカー
  //   ニングしない。
  async check_kerning() {
    const font_face = Array.from(document.fonts).find(font_face => /Showa Yokohama Story/.test(font_face.family));
    if (!font_face) {
      throw new Error("font-face 'Showa Yokohama Story' not found");
    }
    await this.load_font_face(font_face, 1000);
    if (font_face.status !== "loaded") {
      throw new Error("font-face 'Showa Yokohama Story' not loaded");
    }

    const view = this.offscreen.appendChild(create_element(`
      <div style="
        font-family: 'Showa Yokohama Story';
        font-size: 50px;
        font-variant-ligatures: none;
        white-space: nowrap;
      ">
        <div><span style="font-kerning: none"><span>&#xE001;&#xE002;</span></span></div>
        <div><span style="font-kerning: normal"><span>&#xE001;&#xE002;</span></span></div>
        <div><span style="font-kerning: normal"><span>&#xE001;</span><span>&#xE002;</span></span></div>
      </div>
    `));

    const width1 = view.children[0].firstElementChild.getBoundingClientRect().width;
    const width2 = view.children[1].firstElementChild.getBoundingClientRect().width;
    const width3 = view.children[2].firstElementChild.getBoundingClientRect().width;
    if (this.feature_kerning = width1 > width2) {
      this.feature_kerning_span = Math.abs(width1 - width3) > Math.abs(width2 - width3);
    }

    view.remove();
  }

  layout_kerning(source, text, size) {
    const container = source.cloneNode(false);
    container.removeAttribute("id");
    container.style.width = "auto";
    container.style.height = "auto";

    const view = container.appendChild(create_element(`
      <div style="
        font-size: ${size * 100}%;
        font-variant-ligatures: none;
        white-space: nowrap;
      "></div>
    `));

    if (this.feature_kerning_span) {
      const html = text.map(item => `<span>${escape_html(item.text)}</span>`).join("");
      view.append(...create_elements(`
        <div style="font-kerning: none">${html}</div>
        <div style="font-kerning: normal">${html}</div>
      `));
      this.offscreen.append(container);

      text.forEach((item, i) => {
        item.width = view.firstElementChild.children[i].getBoundingClientRect().width;
        item.progress = view.children[1].children[i].getBoundingClientRect().width;
      });

    } else {
      text.forEach((item, i) => {
        const head = text.slice(0, i).map(item => escape_html(item.text)).join("");
        const head_html = head == "" ? "" : `<span>${head}</span>`;
        const body = escape_html(item.text);
        const tail = text.slice(i + 1).map(item => escape_html(item.text)).join("");
        const tail_html = tail == "" ? "" : `<span>${tail}</span>`;
        view.append(...create_elements(`
          <div style="font-kerning: normal"><span><span>${head}${body}</span></span>${tail_html}</div>
          <div style="font-kerning: normal"><span>${head_html}<span>${body}</span></span>${tail_html}</div>
        `));
      });
      this.offscreen.append(container);

      let prev = 0;
      text.forEach((item, i) => {
        const width1 = view.children[i * 2].firstElementChild.getBoundingClientRect().width;
        const width2 = view.children[i * 2 + 1].firstElementChild.getBoundingClientRect().width;
        item.width = item.progress = width2 - prev;
        if (i > 0) {
          text[i - 1].progress += width1 - width2;
        }
        prev = width1;
      });
    }

    container.remove();
  }

  layout_paragraph(source) {
    const paragraph = [];
    let line;
    let item;

    const parse = node => {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          switch (node.tagName) {
            case "BR":
              line = undefined;
              break;
            case "DIV":
              node.childNodes.forEach(parse);
              line = undefined;
              break;
            case "RT":
              item.ruby = [ ...node.textContent ].map(text => ({ text: text }));
              break;
            default:
              node.childNodes.forEach(parse);
              break;
          }
          break;
        case Node.TEXT_NODE:
          if (line === undefined) {
            paragraph.push(line = []);
          }
          line.push(item = { main: [ ...node.textContent ].map(text => ({ text: text })) });
          break;
      }
    };
    parse(source);

    paragraph.forEach(line => {
      this.layout_kerning(source, line.map(item => item.main).flat(), 1);
      line.filter(item => item.ruby !== undefined).forEach(item => this.layout_kerning(source, item.ruby, 0.5));
    });

    // console.log(JSON.stringify(paragraph, undefined, 2));
  }
};

document.addEventListener("DOMContentLoaded", () => root.boot(), { once: true });
})();
