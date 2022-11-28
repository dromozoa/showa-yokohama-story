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

const set_timeout = delay => new Promise(resolve => setTimeout(resolve, delay));
const request_animation_frame = () => new Promise(resolve => requestAnimationFrame(resolve));

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
  set_timeout = set_timeout;
  request_animation_frame = request_animation_frame;
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
        top: -6400px;
        left: -1989px;
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

    font_face.unicodeRange.split(/,\s*/).some(range => {
      const match = range.match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
      const a = parseInt(match[1], 16);
      const b = match[2] === undefined ? a : parseInt(match[2], 16);
      for (let code = a; code <= b; ++code) {
        return code > 0x20 && test.push("&#" + code + ";") === test_size_max;
      }
    });

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
      await set_timeout(50);
    }

    view.remove();
    return elapsed;
  }

  // Showa Yokohama Storyフォントの寸法は
  //   U+E001:  800/1000
  //   U+E002:  900/1000
  //   字間:   -300/1000
  // (U+E001, U+E002)をレイアウトすると
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
        text-align: normal;
        white-space: nowrap;
      "></div>
    `));

    if (this.feature_kerning_span) {
      const body = chars.map(char => `<span>${escape_html(char.char)}</span>`).join("");
      view.append(...create_elements(`
        <div style="font-kerning: none">${body}</div>
        <div style="font-kerning: normal">${body}</div>
      `));
      this.offscreen.append(container);

      chars.forEach((char, i) => {
        char.width = view.firstElementChild.children[i].getBoundingClientRect().width;
        char.progress = view.children[1].children[i].getBoundingClientRect().width;
      });

    } else {
      const first = chars[0];

      // 行頭行末の空白削除を避けるためにゼロ幅空白を用いる。
      view.append(create_element(`
        <div style="font-kerning: none">&#xFEFF;<span><span>${escape_html(first.char)}</span></span>&#xFEFF;</div>
      `));
      chars.slice(1).forEach((char, i) => {
        const head = escape_html(chars[i].char);
        const body = escape_html(char.char);
        view.append(...create_elements(`
          <div style="font-kerning: normal">&#xFEFF;<span><span>${head}${body}</span></span>&#xFEFF;</div>
          <div style="font-kerning: none">&#xFEFF;<span><span>${head}</span><span>${body}</span></span>&#xFEFF;</div>
        `));
      });
      this.offscreen.append(container);

      first.width = first.progress = view.firstElementChild.firstElementChild.getBoundingClientRect().width;
      chars.slice(1).forEach((char, i) => {
        const prev = chars[i];
        const width = view.children[i * 2 + 2].firstElementChild.getBoundingClientRect().width;
        char.width = char.progress = width - prev.width;
        prev.progress += view.children[i * 2 + 1].firstElementChild.getBoundingClientRect().width - width;
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
    container.style.height = "auto";

    const main_view = container.appendChild(create_element(`
      <div style="
        font-kerning: none;
        font-variant-ligatures: none;
      "><span></span></div>
    `));

    text.items.forEach(item => {
      const main_spacing = Math.max(0, item.ruby_width - item.ruby_overhang_before - item.ruby_overhang_after - item.main_width) / item.main.length;
      item.main.forEach(char => {
        char.ruby_spacing = main_spacing;
        map.set(char, main_view.firstElementChild.appendChild(create_element(`
          <span style="
            letter-spacing: ${number_to_css_string(char.progress - char.width + char.ruby_spacing)}px;
          ">${escape_html(char.char)}</span>
        `)));
      });
      if (item.ruby) {
        const ruby_spacing = Math.max(0, item.main_width - item.ruby_width) / item.ruby.length;
        item.ruby.forEach(char => char.ruby_spacing = ruby_spacing);
      }
    });

    this.offscreen.append(container);

    const get_line_number = node => {
      const bbox = node.getBoundingClientRect();
      return Math.floor((bbox.top - node.closest("div").getBoundingClientRect().top + bbox.height * 0.5) / parseFloat(getComputedStyle(node).lineHeight));
    };

    const is_line_start = node => {
      // 最初の文字は行頭である。
      let prev = node.previousElementSibling || node.parentElement.dataset.type === "group" && node.parentElement.previousElementSibling;
      if (!prev) {
        return true;
      }
      if (prev.dataset.type === "group") {
        prev = prev.lastElementChild;
      }

      // 文字の天地中央の距離が行の高さの半分より大きければ改行している。
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox1 = node.getBoundingClientRect();
      const bbox2 = prev.getBoundingClientRect();
      return ((bbox1.top - bbox2.top) * 2 + bbox1.height - bbox2.height) > line_height;
    };

    const is_line_end = node => {
      // 最後の文字は行末でない。
      let next = node.nextElementSibling || node.parentElement.dataset.type === "group" && node.parentElement.nextElementSibling;
      if (!next) {
        return false;
      }
      if (next.dataset.type === "group") {
        next = next.firstElementChild;
      }

      // 文字の天地中央の距離が行の高さの半分より大きければ改行している。
      const line_height = parseFloat(getComputedStyle(node).lineHeight);
      const bbox1 = next.getBoundingClientRect();
      const bbox2 = node.getBoundingClientRect();
      return ((bbox1.top - bbox2.top) * 2 + bbox1.height - bbox2.height) > line_height;
    };

    const result = { items: [] };

    const process_line = (item, next) => {
      result.items.push(item);
      if (!item.ruby) {
        return;
      }

      // ルビが行頭にある場合、前のはみ出し可能量をキャンセルする。
      if (is_line_start(map.get(item.main[0])) && item.ruby_overhang_before > 0) {
        const main_spacing = Math.max(0, item.ruby_width - item.ruby_overhang_after - item.main_width) / item.main.length;
        item.main.filter(char => char.ruby_spacing !== main_spacing).forEach(char => {
          char.ruby_spacing = main_spacing;
          map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + char.ruby_spacing) + "px";
        });
        item.ruby_overhang_before = 0;
      }

      // ルビが行末にある場合、後のはみ出し可能量をキャンセルしてレイアウトする。
      if (is_line_end(map.get(item.main.slice(-1)[0])) && item.ruby_overhang_after > 0) {
        const main_spacing = Math.max(0, item.ruby_width - item.ruby_overhang_before - item.main_width) / item.main.length;
        item.main.filter(char => char.ruby_spacing !== main_spacing).forEach(char => {
          char.ruby_spacing = main_spacing;
          map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + char.ruby_spacing) + "px";
        });
        if (is_line_end(map.get(item.main.slice(-1)[0]))) {
          // 後のはみ出し可能量をキャンセルする。
          item.ruby_overhang_after = 0;
        } else {
          // 改行位置が変更された場合、改行以降の文字をグループ化してレイアウト
          // を固定する。
          const index = item.main.findIndex(char => is_line_start(map.get(char)));
          const node = map.get(item.main[index]);
          const group = node.parentElement.insertBefore(create_element(`
            <span data-type="group" style="
              white-space: nowrap;
            "></span>
          `), node);
          group.append(node);

          let width = item.ruby_overhang_after;
          [ ...item.main.slice(index + 1), next.main[0] ].some(char => {
            group.append(map.get(char));
            return (width -= char.progress) < 0;
          });

          // ルビが行頭にある場合、前のはみ出し量をキャンセルする。
          if (index === 0) {
            item.ruby_overhang_before = 0;
          }

          const main_spacing = Math.max(0, item.ruby_width - item.ruby_overhang_before - item.ruby_overhang_after - item.main_width) / item.main.length;
          item.main.filter(char => char.ruby_spacing !== main_spacing).forEach(char => {
            char.ruby_spacing = main_spacing;
            map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + char.ruby_spacing) + "px";
          });
        }
      }

      // 途中に改行がある場合、ルビを分割する。
      if (get_line_number(map.get(item.main[0])) === get_line_number(map.get(item.main.slice(-1)[0]))) {
        return;
      }

      const main_index = item.main.findIndex(char => is_line_end(map.get(char))) + 1;
      const width = item.main.slice(0, main_index).reduce((width, char) => {
        return width + char.progress + char.ruby_spacing;
      }, Math.min(Math.max(0, item.ruby_width - item.main_width), item.ruby_overhang_before));

      // 禁則処理のためにゼロ幅空白を先行する。
      //   U+FEFF  ZERO-WIDTH NO-BREAK SPACE
      //   U+200B  ZERO-WIDTH SPACE
      const ruby_view = create_element(`
        <div style="
          width: ${number_to_css_string(width)}px;
          font-kerning: none;
          font-size: 50%;
          font-variant-ligatures: none;
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
        item2.ruby_overhang_after = item.ruby_overhang_after;
      }

      const main_spacing = Math.max(0, item2.ruby_width - item2.ruby_overhang_before - item2.ruby_overhang_after - item2.main_width) / item2.main.length;
      item2.main.filter(char => char.ruby_spacing !== main_spacing).forEach(char => {
        char.ruby_spacing = main_spacing;
        map.get(char).style.letterSpacing = number_to_css_string(char.progress - char.width + main_spacing) + "px";
      });

      result.items.pop();
      result.items.push(item1);
      ruby_view.remove();

      return process_line(item2, next);
    };

    text.items.forEach((item, i) => process_line(item, text.items[i + 1]));

    // ルビ文字の行の高さを親文字と同じにしてレイアウトする。行送りの基準点は天
    // 地中央なので、ルビを親文字の文字サイズの3/4上に移動してそろえる。
    const style = getComputedStyle(main_view);
    const font_size = parseFloat(style.fontSize);
    const line_height = parseFloat(style.lineHeight);

    const offset_view = container.appendChild(create_element(`
      <div style="
        font-kerning: none;
        font-size: 50%;
        font-variant-ligatures: none;
        white-space: nowrap;
      ">
        <div style="
          position: relative;
          top: ${number_to_css_string(-font_size * 0.75)}px;
          line-height: ${number_to_css_string(line_height)}px;
        "><span>昭和横濱物語</span></div>
        <div style="
          line-height: normal;
        "><span>昭和横濱物語</span></div>
      </div>
    `));
    const offset_top = Math.max(0,
      offset_view.getBoundingClientRect().top
      - offset_view.firstElementChild.firstElementChild.getBoundingClientRect().top
      + offset_view.children[1].firstElementChild.getBoundingClientRect().top
      - offset_view.children[1].getBoundingClientRect().top);
    offset_view.remove();

    const origin = main_view.getBoundingClientRect();
    const update_result = char => {
      const node = map.get(char);
      const bbox = node.getBoundingClientRect();
      char.result = {
        line_number: get_line_number(node),
        x: bbox.left - origin.left,
        y: bbox.top - origin.top + offset_top,
        width: bbox.width,
        height: bbox.height,
      };
    };

    result.number_of_lines = get_line_number(map.get(result.items.slice(-1)[0].main.slice(-1)[0])) + 1;

    result.items.forEach(item => {
      item.main.forEach(update_result);
      item.is_line_start = is_line_start(map.get(item.main[0]));
      item.is_line_end = is_line_end(map.get(item.main.slice(-1)[0]));
      if (!item.ruby) {
        return;
      }

      let start = item.main[0].result.x;
      const char = item.main.slice(-1)[0];
      let width = char.result.x + char.result.width - start;
      if (item.main_width < item.ruby_width) {
        const ruby_overhang_sum = item.ruby_overhang_before + item.ruby_overhang_after;
        if (ruby_overhang_sum > 0) {
          const ruby_overhang = Math.min(item.ruby_width - item.main_width, ruby_overhang_sum);
          start -= item.ruby_overhang_before * ruby_overhang / ruby_overhang_sum;
          width += ruby_overhang;
        }
      }
      const line_number = get_line_number(map.get(item.main[0]));
      const ruby_spacing = Math.max(0, (width - item.ruby_width) / item.ruby.length);
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
          return { main_index: i, x: next ? (char.result.x + char.result.width + next.result.x) * 0.5 : Infinity };
        }),
        ...item.ruby.map((char, i) => ({ ruby_index: i, x: char.result.x + char.result.width * 0.5 })),
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
    });

    container.remove();
    return result;
  }

  layout_paragraph(source, paragraph) {
    const container = source.cloneNode(false);
    container.removeAttribute("id");
    container.style.height = "auto";
    this.offscreen.append(container);

    const line_height = parseFloat(getComputedStyle(container).lineHeight);

    const create_char_element = (parent_node, char, text_align) => {
      const node = parent_node.appendChild(create_element(`
        <span style="
          display: inline-block;
          position: absolute;
          left: ${number_to_css_string(char.result.x)}px;
          width: ${char.result.width}px;
          text-align: ${text_align};
        "><span style="display: inline;">${escape_html(char.char)}</span></span>
      `));
      node.style.top = number_to_css_string(char.result.y
        + node.getBoundingClientRect().top
        - node.firstElementChild.getBoundingClientRect().top) + "px";
      return node;
    };

    paragraph.texts.forEach(text => {
      const view = container.appendChild(create_element(`
        <div style="
          position: relative;
          height: ${number_to_css_string(text.number_of_lines * line_height)}px;
          font-kerning: none;
          font-variant-ligatures: none;
          line-height: normal;
          white-space: nowrap;
        "></div>
      `));

      text.items.forEach(item => {
        const text_align = item.is_line_start ? "left" : item.is_line_end ? "right" : "center";

        item.main.forEach((char, i) => {
          if (char.ruby_connection === undefined) {
            create_char_element(view, char, text_align);
          } else {
            const node = view.appendChild(create_element(`
              <ruby style="display: block"></ruby>
            `));
            create_char_element(node, char, text_align);
            const rt = node.appendChild(create_element(`
              <rt style="display: block"></rt>
            `));
            for (let j = char.ruby_connection; item.ruby[j] && item.ruby[j].ruby_connection === i; ++j) {
              create_char_element(rt, item.ruby[j], text_align);
            }
          }
        });
      });
    });

    paragraph.result = container;
    container.remove();
    return paragraph;
  }

  layout(source) {
    //
    // Paragraph {
    //   texts:                 Text+,
    //   result:                Element, // レイアウト結果のHTML要素
    // }
    //
    // Text {
    //   items:                 Item+,
    //   number_of_lines:       Number,  // 行数
    // }
    //
    // Item {
    //   main:                  Chars,   // 本文／親文字列
    //   main_width:            Number,  // 本文／親文字列の幅
    //   ruby:                  Chars,   // ルビ文字列
    //   ruby_width:            Number,  // ルビ文字列の幅
    //   ruby_overhang_before:  Number,  // 前のはみ出し可能量
    //   ruby_overhang_after:   Number,  // 後のはみ出し可能量
    //   is_line_start:         Boolean, // 行頭であるかどうか
    //   is_line_end:           Boolean, // 行末であるかどうか
    // }
    //
    // Chars {
    //   Char+
    // }
    //
    // Char {
    //   char:                  String,  // 文字の値
    //   width:                 Number,  // 文字の幅
    //   progress:              Number,  // 文字送り
    //   ruby_spacing:          Number,  // ルビのための調整幅
    //   ruby_connection:       Number,  // 親文字とルビ文字の対応づけ
    //   result:                Result,  // レイアウト結果
    // }
    //
    // (width - progress)がカーニングによる左方向への移動量となる。
    //
    // 親文字のruby_connectionは対応する最初のルビ文字のインデックスで、対応す
    // るルビ文字がない場合は未定義になる。ルビ文字のruby_connectionは対応する
    // 親文字のインデックスで、常にただひとつ定義される。
    //
    // Result {
    //   line_number            Number,  // 行番号
    //   x:                     Number,  // レイアウト結果のX座標
    //   y:                     Number,  // レイアウト結果のY座標
    //   width:                 Number,  // レイアウト結果の幅
    //   height:                Number,  // レイアウト結果の高さ
    // }
    //
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
