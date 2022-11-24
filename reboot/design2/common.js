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
  if (-0.00005 < v && v < 0.00005) {
    return "0";
  }
  return v.toFixed(4).replace(/\.?0+$/, "")
};

const root = globalThis.dromozoa = new class {
  jlreq = dromozoa_jlreq;
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

  // Firefox 107でFontFace.load()が返すプロミスが決定されない場合があった。どこ
  // かの時点でFontFaceが別の新しいオブジェクトにさしかえられ、プロミスが迷子に
  // なったように見えた。そこでdocument.facesをポーリングして監視する。
  async load_font_face(index, timeout) {
    const font_face = [...document.fonts][index];

    // unicode-rangeからテスト文字列を作成する。
    const n = 4;
    const test = [];

    L:
    for (let range of font_face.unicodeRange.split(/,\s*/)) {
      const match = range.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
      const a = Number.parseInt(match[1], 16);
      const b = match[2] === undefined ? a : Number.parseInt(match[2], 16);
      for (let code = a; code <= b; ++code) {
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
        font-size: ${number_to_css_string(size * 100)}%;
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

  // ブラウザの組版機能を用いて禁則処理や均等割り付けを実現するため、文字の位置
  // が定まるまでインライン要素として扱い、letter-spacingで幅を調整する。
  //
  // letter-spacingによる指定とgetBoundingClientRect()で取得した幅の関係を調べ
  // た。こまかく指定しても、1/60〜1/64で丸められるように見える。また、Firefox
  // とSafariでは、実際の幅が指定よりも狭くなった。
  //
  //                符号  最大の差   周期     推定
  //      Edge 107   +    0.016      0.0157   1/64
  //   Firefox 107   +/-  0.0083     0.0167   1/60
  //    Chrome 107   +    0.0079     0.0079   1/128
  //    Safari  16   +/-  0.0000028  N/A      N/A
  layout_text(source, text) {
    text.items.forEach((item, i) => {
      item.main_width = item.main.reduce((width, char) => width + char.progress, 0);
      item.ruby_width = 0;
      item.ruby_overhang_before = 0;
      item.ruby_overhang_after = 0;

      if (item.ruby) {
        item.ruby_width = item.ruby.reduce((width, char) => width + char.progress, 0);

        const before = text.items[i - 1];
        if (before && !before.ruby) {
          const char = before.main[before.main.length - 1];
          if (this.jlreq.ruby_overhang(char.char.codePointAt(0))) {
            item.ruby_overhang_before = char.progress * 0.5;
          }
        }

        const after = text.items[i + 1];
        if (after && !after.ruby) {
          const char = after.main[0];
          if (this.jlreq.ruby_overhang(char.char.codePointAt(0))) {
            item.ruby_overhang_after = char.progress * 0.5;
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
    const map = new Map();

    text.items.forEach(item => {
      let main_spacing = 0;

      if (item.ruby) {
        if (item.main_width < item.ruby_width) {
          const hung_width = item.ruby_width - item.ruby_overhang_before - item.ruby_overhang_after;
          if (item.main_width < hung_width) {
            main_spacing = (hung_width - item.main_width) / item.main.length;
          }
          item.ruby.forEach(char => char.ruby_spacing = 0);
        } else {
          const ruby_spacing = (item.main_width - item.ruby_width) / item.ruby.length;
          item.ruby.forEach(char => char.ruby_spacing = ruby_spacing);
        }
      }

      item.main.forEach(char => {
        char.ruby_spacing = main_spacing;
        map.set(char, main_view.firstElementChild.appendChild(create_element(`
          <span style="
            letter-spacing: ${number_to_css_string(char.progress - char.width + char.ruby_spacing)}px;
          ">${escape_html(char.char)}</span>
        `)));
      });
    });

    this.offscreen.append(container);

    const get_line_number = node => {
      const origin_y = node.parentElement.parentElement.getBoundingClientRect().top;
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox = node.getBoundingClientRect();
      return Math.floor((bbox.top - origin_y + bbox.height * 0.5) / line_height);
    };

    const is_line_start = node => {
      const prev = node.previousElementSibling;
      return !prev || get_line_number(prev) !== get_line_number(node);
    };

    const is_line_end = node => {
      const next = node.nextElementSibling;
      return !next || get_line_number(next) !== get_line_number(node);
    };

    const result = { items: [] };

    text.items.forEach(item => {
      if (item.ruby) {
        // ルビが行頭にある場合、前のはみ出し可能量をキャンセルする。
        if (is_line_start(map.get(item.main[0])) && item.ruby_overhang_before > 0) {
          if (item.main_width < item.ruby_width) {
            const hung_width = item.ruby_width - item.ruby_overhang_after;
            if (item.main_width < hung_width) {
              const main_spacing = (hung_width - item.main_width) / item.main.length;
              item.main.forEach(char => {
                char.ruby_spacing = main_spacing;
                map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + char.ruby_spacing) + "px";
              });
            }
          }
          item.ruby_overhang_before = 0;
        }

        // ルビが行末にある場合、前後のはみ出し可能量のうち、大きいほうをキャン
        // セルしてレイアウトする。結果の改行位置から、前後のどちらにはみ出し可
        // 能量を割り当てるか決定する。
        if (is_line_end(map.get(item.main[item.main.length - 1])) && item.ruby_overhang_before + item.ruby_overhang_after > 0) {
          const ruby_overhang = Math.min(item.ruby_overhang_before, item.ruby_overhang_after);
          if (item.main_width < item.ruby_width) {
            const hung_width = item.ruby_width - ruby_overhang;
            if (item.main_width < hung_width) {
              const main_spacing = (hung_width - item.main_width) / item.main.length;
              item.main.forEach(char => {
                char.ruby_spacing = main_spacing;
                map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + char.ruby_spacing) + "px";
              });
            }
          }
          if (is_line_start(map.get(item.main[0]))) {
            item.ruby_overhang_before = 0;
            item.ruby_overhang_after = ruby_overhang;
          } else {
            item.ruby_overhang_before = ruby_overhang;
            item.ruby_overhang_after = 0;
          }
        }

        // ルビの途中で本文が改行する場合、ルビを分割する。
        if (get_line_number(map.get(item.main[0])) !== get_line_number(map.get(item.main[item.main.length - 1]))) {
          let width = 0;
          if (item.main_width < item.ruby_width) {
            width += Math.min(item.ruby_width - item.main_width, item.ruby_overhang_before);
          }

          let i = 0;
          for (; i < item.main.length; ++i) {
            const char = item.main[i];
            if (i > 0 && is_line_start(map.get(char))) {
              break;
            }
            width += char.progress + char.ruby_spacing;
          }

          const ruby_view = create_element(`
            <div style="
              font-kerning: none;
              font-size: 50%;
              font-variant-ligatures: none;
              width: ${number_to_css_string(width)}px;
            "><span><span>&#xFEFF;&#x200B;</span></span></div>
          `);
          item.ruby.forEach(char => map.set(char, ruby_view.firstElementChild.appendChild(create_element(`
            <span style="
              letter-spacing: ${number_to_css_string(char.progress - char.width + char.ruby_spacing)}px;
            ">${escape_html(char.char)}</span>
          `))));
          container.append(ruby_view);

          let j = 0;
          for (; j < item.ruby.length; ++j) {
            if (is_line_start(map.get(item.ruby[j]))) {
              break;
            }
          }

          const item1 = {
            main: item.main.slice(0, i),
            ruby_width: 0,
            ruby_overhang_before: 0,
            ruby_overhang_after: 0,
          };
          item1.main_width = item1.main.reduce((width, char) => width + char.progress, 0);
          if (j > 0) {
            item1.ruby = item.ruby.slice(0, j);
            item1.ruby_width = item1.ruby.reduce((width, char) => width + char.progress, 0);
            item1.ruby_overhang_before = item.ruby_overhang_before;
          }

          const item2 = {
            main: item.main.slice(i),
            ruby_width: 0,
            ruby_overhang_before: 0,
            ruby_overhang_after: 0,
          };
          item2.main_width = item2.main.reduce((width, char) => width + char.progress, 0);
          if (j < item.ruby.length) {
            item2.ruby = item.ruby.slice(j);
            item2.ruby_width = item2.ruby.reduce((width, char) => width + char.progress, 0);
            item2.ruby_overhang_after = item.ruby_overhang_after;
          }

          let main_spacing = 0;
          if (item2.main_width < item2.ruby_width) {
            const hung_width = item2.ruby_width - item2.ruby_overhang_before - item2.ruby_overhang_after;
            if (item2.main_width < hung_width) {
              main_spacing = (hung_width - item2.main_width) / item2.main.length;
            }
          }
          item2.main.forEach(char => {
            char.ruby_spacing = main_spacing;
            map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + main_spacing) + "px";
          });

          result.items.push(item1, item2);
          ruby_view.remove();
          return;
        }
      }

      result.items.push(item);
    });

    const item = result.items[result.items.length - 1];
    const char = item.main[item.main.length - 1];
    result.number_of_lines = get_line_number(map.get(char)) + 1;

    const origin = main_view.getBoundingClientRect();
    result.items.forEach(item => item.main.forEach(char => {
      const bbox = map.get(char).getBoundingClientRect();
      char.result_x = bbox.left - origin.left;
      char.result_y = bbox.top - origin.top;
      char.result_width = bbox.width;
      char.result_height = bbox.height;
    }));

    result.items.forEach((item, i) => {
      if (item.ruby) {
        let start = item.main[0].result_x;

        const char = item.main[item.main.length - 1];
        let end = char.result_x + char.result_width;

        if (item.main_width < item.ruby_width) {
          const ruby_overhang_sum = item.ruby_overhang_before + item.ruby_overhang_after;
          if (ruby_overhang_sum > 0) {
            const ruby_overhang = Math.min(item.ruby_width - item.main_width, ruby_overhang_sum);
            const ruby_overhang_before = ruby_overhang * item.ruby_overhang_before / ruby_overhang_sum;
            const ruby_overhang_after = ruby_overhang - ruby_overhang_before;
            start -= ruby_overhang_before;
            end += ruby_overhang_after;
          }
        }

        const width = end - start;
        console.log(item.ruby_width, width);

        // let start;
        // if (item.ruby_overhang_before > 0) {
        //   const before = result.items[i - 1];
        //   const char = before.main[before.main.length - 1];
        //   start = char.result_x + char.result_width * 0.5;
        // } else {
        //   const char = item.main[0];
        //   start = char.result_x;
        // }

        // let end;
        // if (item.ruby_overhang_after > 0) {
        //   const after = result.items[i + 1];
        //   const char = after.main[0];
        // }

        // let start = item.main[0].result_x;
        // 親文字の開始点と終了点を得る。
        // はみ出し量を計算する。

      }
    });

    // container.remove();
    return result;
  }

  layout_paragraph(source) {
    //
    // Paragraph {
    //   Text+
    // }
    //
    // Text {
    //   items:                 Item+,
    //   number_of_lines:       Number, // 行数
    // }
    //
    // Item {
    //   main:                  Chars,  // 本文文字列
    //   main_width:            Number, // 本文文字列の幅
    //   ruby:                  Chars,  // ルビ文字列
    //   ruby_width:            Number, // ルビ文字列の幅
    //   ruby_overhang_before:  Number, // 前のはみ出し可能量
    //   ruby_overhang_after:   Number, // 後のはみ出し可能量
    // }
    //
    // Chars {
    //   Char+
    // }
    //
    // Char {
    //   char:                  String, // 文字の値
    //   width:                 Number, // 文字の幅
    //   progress:              Number, // 文字送り
    //   ruby_spacing:          Number, // ルビのための調整幅
    //   result_x:              Number, // レイアウト結果のX座標
    //   result_y:              Number, // レイアウト結果のY座標
    //   result_width:          Number, // レイアウト結果の幅
    //   result_height:         Number, // レイアウト結果の高さ
    // }
    //
    // (width - progress)がカーニングによる左方向への移動量となる。
    //
    let paragraph = [];
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
          if (!text) {
            paragraph.push(text = { items: [] });
          }
          text.items.push(item = { main: [...node.textContent].map(char => ({ char: char })) });
          break;
      }
    };
    parse(source);

    paragraph.forEach(text => {
      this.layout_kerning(source, text.items.map(item => item.main).flat(), 1);
      text.items.filter(item => item.ruby).forEach(item => this.layout_kerning(source, item.ruby, 0.5));
    });

    paragraph = paragraph.map(text => this.layout_text(source, text));
    console.log(paragraph);
  }
};

document.addEventListener("DOMContentLoaded", () => root.boot(), { once: true });
})();
