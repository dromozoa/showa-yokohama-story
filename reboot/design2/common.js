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

  // カーニングが有効化どうか。
  feature_kerning;

  // <span>をまたいでカーニングするかどうか。Safari 16は<span>をまたいでカーニ
  // ングしない。
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
        position: absolute;
        /*
        top: -9999px;
        left: -9999px;
        */
      "></div>
    `));
  }

  // Firefox 107でFontFace.load()の返り値およびFontFace.loadedが決定されない場
  // 合があった。どこかの時点でFontFaceが新しい別のオブジェクトにさしかえられ、
  // プロミスが迷子になるらしい。そこで、ポーリングしてdocument.facesを監視する
  // することにした。
  async load_font_face(index, timeout) {
    const font_face = [...document.fonts][index];

    // unicode-rangeからテスト文字列を作成する。
    const test_size_max = 4;
    const test = [];

    L:
    for (let range of font_face.unicodeRange.split(/,\s*/)) {
      const match = range.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
      const a = Number.parseInt(match[1], 16);
      const b = match[2] === undefined ? a : Number.parseInt(match[2], 16);
      for (let code = a; code <= b; ++code) {
        if (code > 0x20 && test.push("&#" + code + ";") === test_size_max) {
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

  // Showa Yokohama Storyフォントは下記の寸法を持つ
  //   U+E001:  800/1000
  //   U+E002:  900/1000
  //   字間:   -300/1000
  // ので、(U+E001, U+E002)をレイアウトすると
  //   カーニング無効時: 1700/1000
  //   カーニング有効時: 1400/1000
  // の幅を得る。
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

  // ブラウザの組版機能を用いて禁則処理や均等割り付けを実現する。それぞれの文字
  // を行内要素として扱い、letter-spacingで幅を調整する。
  //
  // 調整した幅をgetBoundingClientRect()で取得した幅と比較した。こまかく指定し
  // ても1/60〜1/64で丸められるように見えた。また、FirefoxとSafariで調整した幅
  // よりも狭くなった。
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
          const char = before.main.slice(-1)[0];
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

    const map = new Map();

    const container = source.cloneNode(false);
    container.removeAttribute("id");
    container.style.position = "relative";

    const main_view = container.appendChild(create_element(`
      <div style="
        font-kerning: none;
        font-variant-ligatures: none;
      "><span></span></div>
    `));

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
      const origin_top = node.parentElement.parentElement.getBoundingClientRect().top;
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox = node.getBoundingClientRect();
      return Math.floor((bbox.top - origin_top + bbox.height * 0.5) / line_height);
    };

    const is_line_start = node => {
      // 最初の文字である場合、行頭であるとする。
      if (!node.previousElementSibling) {
        return true;
      }
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox = node.getBoundingClientRect();
      const prev = node.previousElementSibling.getBoundingClientRect();
      // 文字の天地中央の距離が行の高さの半分より大きい場合、行頭であるとする。
      return ((bbox.top - prev.top) * 2 + bbox.height - prev.height) > line_height;
    };

    const is_line_end = node => {
      // 最後の文字である場合、行末でないとする。
      if (!node.nextElementSibling) {
        return false;
      }
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox = node.getBoundingClientRect();
      const next = node.nextElementSibling.getBoundingClientRect();
      // 文字の天地中央の距離が行の高さの半分より大きい場合、行末であるとする。
      return ((next.top - bbox.top) * 2 + next.height - bbox.height) > line_height;
    };

    const result = { items: [] };

    text.items.forEach(item => {
      result.items.push(item);

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

        // ルビの途中に改行がある場合、後のはみ出し可能量を復元する。
        const ruby_overhang_after = item.ruby_overhang_after;

        // ルビが行末にある場合、前後のはみ出し可能量のうち、大きいほうをキャン
        // セルしてレイアウトする。結果の改行位置から、前後のどちらにはみ出し可
        // 能量を割り当てるか決定する。
        if (is_line_end(map.get(item.main.slice(-1)[0])) && item.ruby_overhang_before + item.ruby_overhang_after > 0) {
          console.log(item.main.slice(-1)[0].char, "line end");
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

        // ルビの途中に改行がある場合、ルビを分割する。
        if (get_line_number(map.get(item.main[0])) !== get_line_number(map.get(item.main.slice(-1)[0]))) {
          let width = 0;
          if (item.main_width < item.ruby_width) {
            width += Math.min(item.ruby_width - item.main_width, item.ruby_overhang_before);
          }

          let main_index = 0;
          for (; main_index < item.main.length; ++main_index) {
            const char = item.main[main_index];
            if (main_index > 0 && is_line_start(map.get(char))) {
              break;
            }
            width += char.progress + char.ruby_spacing;
          }

          // 禁則処理のためにゼロ幅空白を先行する。
          //   U+FEFF  ZERO-WIDTH NO-BREAK SPACE
          //   U+200B  ZERO-WIDTH SPACE
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

          let ruby_index = item.ruby.findIndex(char => is_line_start(map.get(char)));
          if (ruby_index === -1) {
            ruby_index = item.ruby.length;
          }

          const item1 = {
            main: item.main.slice(0, main_index),
            ruby_width: 0,
            ruby_overhang_before: 0,
            ruby_overhang_after: 0,
          };
          item1.main_width = item1.main.reduce((width, char) => width + char.progress, 0);
          if (ruby_index > 0) {
            item1.ruby = item.ruby.slice(0, ruby_index);
            item1.ruby_width = item1.ruby.reduce((width, char) => width + char.progress, 0);
            item1.ruby_overhang_before = item.ruby_overhang_before;
          }

          const item2 = {
            main: item.main.slice(main_index),
            ruby_width: 0,
            ruby_overhang_before: 0,
            ruby_overhang_after: 0,
          };
          item2.main_width = item2.main.reduce((width, char) => width + char.progress, 0);
          if (ruby_index < item.ruby.length) {
            item2.ruby = item.ruby.slice(ruby_index);
            item2.ruby_width = item2.ruby.reduce((width, char) => width + char.progress, 0);
            item2.ruby_overhang_after = ruby_overhang_after;
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

          result.items.pop();
          result.items.push(item1, item2);
          ruby_view.remove();
        }
      }
    });

    const item = result.items[result.items.length - 1];
    const char = item.main[item.main.length - 1];
    result.number_of_lines = get_line_number(map.get(char)) + 1;

    let min_x = +Infinity;
    let min_y = +Infinity;
    let max_x = -Infinity;
    let max_y = -Infinity;

    const origin = main_view.getBoundingClientRect();
    const update_result = char => {
      const node = map.get(char);
      const bbox = node.getBoundingClientRect();
      char.result_line_number = get_line_number(node);
      char.result_x = bbox.left - origin.left;
      char.result_y = bbox.top - origin.top;
      char.result_width = bbox.width;
      char.result_height = bbox.height;
      min_x = Math.min(min_x, char.result_x);
      min_y = Math.min(min_y, char.result_y);
      max_x = Math.max(max_x, char.result_x + char.result_width);
      max_y = Math.max(max_y, char.result_y + char.result_height);
    };

    result.items.forEach(item => item.main.forEach(update_result));

    // ルビのレイアウト時に行の高さを親文字と同じにする。行送りの基準点は天地中
    // 央なので、ルビを親文字の文字サイズの3/4上に移動する。
    const style = getComputedStyle(main_view);
    const font_size = parseFloat(style.fontSize);
    const line_height = parseFloat(style.lineHeight);

    result.items.forEach(item => {
      if (item.ruby) {
        let start = item.main[0].result_x;

        const char = item.main[item.main.length - 1];
        let end = char.result_x + char.result_width;

        if (item.main_width < item.ruby_width) {
          const sum = item.ruby_overhang_before + item.ruby_overhang_after;
          if (sum > 0) {
            const scale = Math.min(item.ruby_width - item.main_width, sum) / sum;
            start -= item.ruby_overhang_before * scale;
            end += item.ruby_overhang_after * scale;
          }
        }

        const width = end - start;

        let ruby_spacing = 0;
        if (width > item.ruby_width) {
          ruby_spacing = (width - item.ruby_width) / item.ruby.length;
        }

        const line_number = get_line_number(map.get(item.main[0]));
        const ruby_view = create_element(`
          <div style="
            position: absolute;
            top: ${number_to_css_string(line_number * line_height - font_size * 0.75)}px;
            left: ${number_to_css_string(start)}px;
            font-kerning: none;
            font-size: 50%;
            font-variant-ligatures: none;
            line-height: ${number_to_css_string(line_height)}px;
            white-space: nowrap;
          "><span></span></div>
        `);
        item.ruby.forEach(char => {
          char.ruby_spacing = ruby_spacing;
          map.set(char, ruby_view.firstElementChild.appendChild(create_element(`
            <span style="
              letter-spacing: ${number_to_css_string(char.progress - char.width + char.ruby_spacing)}px;
            ">${escape_html(char.char)}</span>
          `)));
        });
        container.append(ruby_view);

        item.ruby.forEach(update_result);

        let main_index = 0;
        let ruby_index;
        [
          ...item.main.map((char, i) => {
            const next = item.main[i + 1];
            return { main_index: i, x: next ? (char.result_x + char.result_width + next.result_x) * 0.5 : Infinity };
          }),
          ...item.ruby.map((char, i) => ({ ruby_index: i, x: char.result_x + char.result_width * 0.5 })),
        ].sort((a, b) => a.x - b.x).forEach(order => {
          if (order.main_index !== undefined) {
            if (ruby_index !== undefined) {
              item.main[order.main_index].ruby_connection = ruby_index;
              ruby_index = undefined;
            }
            ++main_index;
          } else {
            item.ruby[order.ruby_index].ruby_connection = main_index;
            if (ruby_index === undefined) {
              ruby_index = order.ruby_index;
            }
          }
        });
      }
    });

    result.min_x = min_x;
    result.min_y = min_y;
    result.max_x = max_x;
    result.max_y = max_y;

    container.remove();
    return result;
  }

  layout_paragraph(source, paragraph) {
    const container = source.cloneNode(false);
    container.removeAttribute("id");
    this.offscreen.append(container);

    const style = getComputedStyle(container);
    const font_size = parseFloat(style.fontSize);
    const line_height = parseFloat(style.lineHeight);

    paragraph.texts.forEach(text => {
      const view = container.appendChild(create_element(`
        <div style="
          position: relative;
          font-kerning: none;
          font-variant-ligatures: none;
          line-height: normal;
          width: auto;
          height: ${number_to_css_string(text.number_of_lines * line_height)}px;
        "></div>
      `));

      text.items.forEach((item, index) => {
        let align = "center";
        const prev = text.items[index - 1];
        if (!prev || prev.main[prev.main.length - 1].result_line_number !== item.main[0].result_line_number) {
          align = "left";
        }
        const next = text.items[index + 1];
        if (!next || next.main[0].result_line_number !== item.main[item.main.length - 1].result_line_number) {
          align = "right";
        }

        item.main.forEach((char, i) => {

          if (char.ruby_connection === undefined) {
            const node = view.appendChild(create_element(`
              <span style="
                display: inline-block;
                position: absolute;
                left: ${number_to_css_string(char.result_x)}px;
                width: ${char.result_width}px;
                text-align: ${align};
              "><span style="
                  display: inline;
                ">${escape_html(char.char)}</span></span>
            `));
            const iy = node.firstElementChild.getBoundingClientRect().top;
            const by = node.getBoundingClientRect().top;
            // iyをresult_yにする
            // byをresult_y+by-iyにする
            node.style.top = number_to_css_string(char.result_y + by - iy) + "px";
          } else {
            const node = view.appendChild(create_element(`
              <ruby style="block"><span style="
                display: inline-block;
                position: absolute;
                left: ${number_to_css_string(char.result_x)}px;
                width: ${char.result_width}px;
                text-align: ${align};
              "><span style="
                  display: inline;
                ">${escape_html(char.char)}</span></span><rt style="
                  display: block;
                "></rt></ruby>
            `));
            const iy = node.firstElementChild.firstElementChild.getBoundingClientRect().top;
            const by = node.firstElementChild.getBoundingClientRect().top;
            node.firstElementChild.style.top = number_to_css_string(char.result_y + by - iy) + "px";
            const rt = node.children[1];
            for (let j = char.ruby_connection; item.ruby[j] && item.ruby[j].ruby_connection === i; ++j) {
              const char = item.ruby[j];
              const node = rt.appendChild(create_element(`
                <span style="
                  display: inline-block;
                  position: absolute;
                  left: ${number_to_css_string(char.result_x)}px;
                  width: ${char.result_width}px;
                  text-align: ${align};
                "><span style="
                  display: inline;
                  ">${escape_html(char.char)}</span></span>
              `));
              const iy = node.firstElementChild.getBoundingClientRect().top;
              const by = node.getBoundingClientRect().top;
              node.style.top = number_to_css_string(char.result_y + by - iy) + "px";
            }
          }
        });
      });

    });

    return paragraph;
  }

  layout(source) {
    //
    // Paragraph {
    //   texts:                 Text+,
    //   result:                Element,
    // }
    //
    // Text {
    //   items:                 Item+,
    //   number_of_lines:       Number, // 行数
    //   min_x:                 Number, // X座標の最小値
    //   min_y:                 Number, // Y座標の最小値
    //   max_x:                 Number, // X座標の最大値
    //   max_y:                 Number, // Y座標の最大値
    // }
    //
    // Item {
    //   main:                  Chars,  // 本文／親文字列
    //   main_width:            Number, // 本文／親文字列の幅
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
    //   ruby_connection:       Number, // 親文字とルビ文字の対応づけ
    //   result_line_number     Number, // 行番号
    //   result_x:              Number, // レイアウト結果のX座標
    //   result_y:              Number, // レイアウト結果のY座標
    //   result_width:          Number, // レイアウト結果の幅
    //   result_height:         Number, // レイアウト結果の高さ
    // }
    //
    // (width - progress)がカーニングによる左方向への移動量となる。
    //
    // 親文字のruby_connectionは、対応する最初のルビ文字のインデックスである。
    // ただし、対応するルビ文字がない場合は定義されない。
    // ルビ文字のruby_connectionは、対応する親文字のインデックスであり、常にた
    // だひとつ定義される。
    //
    const texts = [];
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
            texts.push(text = { items: [] });
          }
          text.items.push(item = { main: [...node.textContent].map(char => ({ char: char })) });
          break;
      }
    };
    parse(source);

    texts.forEach(text => {
      this.layout_kerning(source, text.items.map(item => item.main).flat(), 1);
      text.items.filter(item => item.ruby).forEach(item => this.layout_kerning(source, item.ruby, 0.5));
    });
    return this.layout_paragraph(source, { texts: texts.map(text => this.layout_text(source, text)) });
  }
};

document.addEventListener("DOMContentLoaded", () => root.boot(), { once: true });
})();
