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

const number_to_css_string = v => {
  // Math.log2(Math.abs(v)) < Math.log2(0.00005)
  if (-0.00005 < v && v < 0.00005) {
    return "0";
  }
  // 小数部が4桁の文字列に変換して末尾の0を除去する。指数表記の場合は変更しない。
  return v.toFixed(4).replace(/\.?0+$/, "")

};

const root = globalThis.dromozoa = new class {
  jlreq = globalThis.dromozoa_jlreq;
  sleep = sleep;
  escape_html = escape_html;
  create_element = create_element;
  create_elements = create_elements;
  number_to_css_string = number_to_css_string;

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

  // Firefox 107でFontFace.load()が止まる場合があった。どこかの時点（loadingを
  // loadedに変更するタイミング？）で、FontFaceが別の新しいオブジェクトに変わっ
  // たのではないかと推測する。
  async load_font_face(index, timeout) {
    const font_face = [...document.fonts][index];

    // unicode-rangeからテスト文字列を作成する。
    const n = 4;
    const test = [];

    // unicode-rangeが指定されていないとU+0-10FFFFになる。
    L:
    for (let range of font_face.unicodeRange.split(/,\s*/)) {
      const match = range.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
      const a = Number.parseInt(match[1], 16);
      const b = match[2] === undefined ? a : Number.parseInt(match[2], 16);
      for (let code = a; code <= b; ++code) {
        // 空白文字は除去されてフォントロードにたどりつかない可能性があるので、
        // テスト文字列に含めない。
        if (code > 0x20 && test.push("&#" + code + ";") === n) {
          break L;
        }
      }
    }

    const view = this.offscreen.appendChild(create_element(`
      <div style="
        font-family: ${escape_html(font_face.family)};
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
      if ([...document.fonts][index].status === "loaded") {
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
  // (U+E001, U+E002)をレイアウトすると
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
    const index = [...document.fonts].findIndex(font_face => /Showa Yokohama Story/.test(font_face.family));
    if (index === -1) {
      throw new Error("font-face 'Showa Yokohama Story' not found");
    }
    await this.load_font_face(index, 1000);
    if ([...document.fonts][index].status !== "loaded") {
      throw new Error("font-face 'Showa Yokohama Story' not loaded");
    }

    const view = this.offscreen.appendChild(create_element(`
      <div style="
        font-family: 'Showa Yokohama Story';
        font-size: 20px;
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
      // フォントサイズ指定によるが、計算誤差を考慮すると(width2 === width3)は
      // 成立しない可能性がある。
      this.feature_kerning_span = Math.abs(width2 - width3) < 1;
    }

    view.remove();
  }

  layout_kerning(source, chars, size) {
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
      const html = chars.map(char => `<span>${escape_html(char.char)}</span>`).join("");
      view.append(...create_elements(`
        <div style="font-kerning: none">${html}</div>
        <div style="font-kerning: normal">${html}</div>
      `));
      this.offscreen.append(container);

      // カーニングがなければ(width === progress)が期待されるが、微小な誤差が発
      // 生する場合がある。"TiTiTiT"という文字列をShare Tech 16pxでレイアウトし
      // たところ、Firefox 107において±0x1p-16の誤差が発生した。
      chars.forEach((char, i) => {
        char.width = view.firstElementChild.children[i].getBoundingClientRect().width;
        char.progress = view.children[1].children[i].getBoundingClientRect().width;
      });

    } else {
      chars.forEach((char, i) => {
        const head = chars.slice(0, i).map(char => escape_html(char.char)).join("");
        const head_html = head == "" ? "" : `<span>${head}</span>`;
        const body = escape_html(char.char);
        const tail = chars.slice(i + 1).map(char => escape_html(char.char)).join("");
        const tail_html = tail == "" ? "" : `<span>${tail}</span>`;
        view.append(...create_elements(`
          <div style="font-kerning: normal"><span><span>${head}${body}</span></span>${tail_html}</div>
          <div style="font-kerning: normal"><span>${head_html}<span>${body}</span></span>${tail_html}</div>
        `));
      });
      this.offscreen.append(container);

      let prev = 0;
      chars.forEach((char, i) => {
        const width1 = view.children[i * 2].firstElementChild.getBoundingClientRect().width;
        const width2 = view.children[i * 2 + 1].firstElementChild.getBoundingClientRect().width;
        char.width = char.progress = width2 - prev;
        if (i > 0) {
          chars[i - 1].progress += width1 - width2;
        }
        prev = width1;
      });
    }

    container.remove();
  }

  layout_text(source, text) {
    text.forEach((item, i) => {
      item.main_width = item.main.reduce((width, char) => width + char.progress, 0);
      item.ruby_width = 0;
      item.ruby_overhang_before = 0;
      item.ruby_overhang_after = 0;

      if (item.ruby) {
        item.ruby_width = item.ruby.reduce((width, char) => width + char.progress, 0);
        if (item.main_width < item.ruby_width) {
          const before = text[i - 1];
          if (before && !before.ruby) {
            const char = before.main[before.main.length - 1];
            if (this.jlreq.ruby_overhang(char.char.codePointAt(0))) {
              item.ruby_overhang_before = char.progress * 0.5;
            }
          }
          const after = text[i + 1];
          if (after && !after.ruby) {
            const char = after.main[0];
            if (this.jlreq.ruby_overhang(char.char.codePointAt(0))) {
              item.ruby_overhang_after = char.progress * 0.5;
            }
          }
        }
      }
    });

    const container = source.cloneNode(false);
    container.removeAttribute("id");

    const main_view = container.appendChild(create_element(`
      <div style="
        font-kerning: none;
        font-variant-ligatures: none;
      "><span></span></div>
    `));
    const ruby_views = [];

    text.forEach((item, i) => {
      if (item.ruby) {
        const main_width = item.main_width;
        const ruby_width = item.ruby_width;

        let main_spacing = 0;
        let ruby_spacing = 0;
        if (item.main_width < item.ruby_width) {
          const ruby_width = item.ruby_width - item.ruby_overhang_before - item.ruby_overhang_after;
          if (item.main_width < ruby_width) {
            main_spacing = (ruby_width - item.main_width) / item.main.length;
          }
        } else {
          ruby_spacing = (item.main_width - item.ruby_width) / item.ruby.length;
        }

        const ruby_view = container.appendChild(create_element(`
          <div style="
            font-kerning: none;
            font-size: 50%;
            font-variant-ligatures: none;
          "><span>&#xFEFF;</span><span></span></div>
        `));
        item.ruby.forEach(char => {
          ruby_view.children[1].append(create_element(`
            <span style="
              letter-spacing: ${number_to_css_string(char.progress - char.width + ruby_spacing)}px;
            ">${escape_html(char.char)}</span>
          `));
        });
        ruby_views[i] = ruby_view;

        item.main.forEach(char => {
          main_view.firstElementChild.append(create_element(`
            <span style="
              letter-spacing: ${number_to_css_string(char.progress - char.width + main_spacing)}px;
            ">${escape_html(char.char)}</span>
          `));
        });

      } else {
        item.main.forEach(char => {
          main_view.firstElementChild.append(create_element(`
            <span style="
              letter-spacing: ${number_to_css_string(char.progress - char.width)}px;
            ">${escape_html(char.char)}</span>
          `));
        });
      }
    });

    this.offscreen.append(container);





  }

  layout_paragraph(source) {
    // Paragraph
    //   { Text+ }
    //
    // Text
    //   { Item+ }
    //
    // Item
    //   {
    //     main: Chars,
    //     main_width: Number,
    //     ruby: Chars,
    //     ruby_width: Number,
    //     ruby_overhang_before: Number,
    //     ruby_overhang_after: Number,
    //   }
    //
    // Chars
    //   { Char+ }
    //
    // Char
    //   {
    //     char:     String,
    //     width:    Number, // 文字の幅
    //     progress: Number, // 文字送り
    //   }
    //
    // (width - progress)がカーニングによる左方向への移動量となる。
    const paragraph = [];
    let text;
    let item;

    const parse = node => {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          switch (node.tagName) {
            case "BR":
              text = undefined;
              break;
            case "DIV":
              node.childNodes.forEach(parse);
              text = undefined;
              break;
            case "RT":
              item.ruby = [...node.textContent].map(char => ({ char: char }));
              break;
            default:
              node.childNodes.forEach(parse);
              break;
          }
          break;
        case Node.TEXT_NODE:
          if (text === undefined) {
            paragraph.push(text = []);
          }
          text.push(item = { main: [...node.textContent].map(char => ({ char: char })) });
          break;
      }
    };
    parse(source);

    paragraph.forEach(text => {
      this.layout_kerning(source, text.map(item => item.main).flat(), 1);
      text.filter(item => item.ruby).forEach(item => this.layout_kerning(source, item.ruby, 0.5));
    });

    paragraph.forEach(text => this.layout_text(source, text));

    // console.log(JSON.stringify(paragraph, undefined, 2));
  }
};

document.addEventListener("DOMContentLoaded", () => root.boot(), { once: true });
})();
