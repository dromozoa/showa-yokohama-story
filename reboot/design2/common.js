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

  // Showa Yokohama Storyフォントは下記の寸法を持つ。
  //   U+E001:  800/1000
  //   U+E002:  900/1000
  //   字間:   -300/1000
  //
  // フォントサイズ100pxで(U+E001,E+E0002)をレイアウトすると、
  //   カーニング無効時: 幅170px
  //   カーニング有効時: 幅140px
  // になる。
  //
  // feature_kerning
  //   カーニングが有効化どうか。
  // feature_kerning_span
  //   <span>をまたいでカーニングするかどうか。Safari 16は<span>をまたいでカー
  //   ニングしない。
  async check_kerning() {
    const fontface = Array.from(document.fonts).find(fontface => /Showa Yokohama Story/.test(fontface.family));
    if (!fontface) {
      throw new Error("font 'Showa Yokohama Story' not found");
    }
    await fontface.load();

    const view = this.offscreen.appendChild(create_element(`
      <div style="
        font-family: 'Showa Yokohama Story';
        font-size: 100px;
        font-variant-ligatures: none;
        line-height: 100px;
        white-space: nowrap;
      ">
        <div><span style="font-kerning: none"><span>&#xE001;&#xE002;</span></span></div>
        <div><span style="font-kerning: normal"><span>&#xE001;&#xE002;</span></span></div>
        <div><span style="font-kerning: normal"><span>&#xE001;</span><span>&#xE002;</span></span></div>
      </div>
    `));

    const case1 = view.children[0].firstElementChild.getBoundingClientRect().width;
    const case2 = view.children[1].firstElementChild.getBoundingClientRect().width;
    const case3 = view.children[2].firstElementChild.getBoundingClientRect().width;
    if (this.feature_kerning = case1 > case2) {
      this.feature_kerning_span = Math.abs(case1 - case3) > Math.abs(case2 - case3);
    }

    // view.remove();
  }

  layout_text(text, class_name) {
    const view = create_element(`
      <div style="
        font-size: 100px;
        font-variant-ligatures: none;
        line-height: 100px;
        white-space: nowrap;
      "></div>
    `);
    if (class_name !== undefined) {
      view.classList.add(class_name);
    }
    const chars = [...text].map(escape_html);

    if (this.feature_kerning_span) {
      view.append(create_element("<div>" + chars.map(c => `<span>${c}</span>`).join("") + "</div>"));
      this.offscreen.append(view);

      const result = [];
      for (let i = 0; i < chars.length; ++i) {
        result[i] = {
          progress: view.firstElementChild.children[i].getBoundingClientRect().width,
        };
      }

      console.log(result);

    } else {
      chars.forEach((b, i) => {
        const a = chars.slice(0, i).join("");
        const u = a === "" ? "" : `<span>${a}</span>`;
        const c = chars.slice(i + 1).join("");
        const v = c === "" ? "" : `<span>${c}</span>`;
        view.append(...create_elements(`
          <div><span><span>${a}${b}</span></span>${v}</div>
          <div><span>${u}<span>${b}</span></span>${v}</div>
        `));
      });

      this.offscreen.append(view);

      let case1 = view.firstElementChild.firstElementChild.getBoundingClientRect().width;
      const result = [ { progress: case1 } ];
      for (let i = 1; i < chars.length; ++i) {
        const case2 = view.children[i * 2 + 0].firstElementChild.getBoundingClientRect().width;
        const case3 = view.children[i * 2 + 1].firstElementChild.getBoundingClientRect().width;
        const prev = result[i - 1]
        prev.progress += case2 - case3;
        result.push({ progress: case3 - case1 });
        case1 = case2;
      }

      // view.remove();
      console.log(result);


    }
  }

};

document.addEventListener("DOMContentLoaded", () => root.boot(), { once: true });
})();

/*
globalThis.dromozoa ||= new class {
  #boot_exception;
  #booted;
  #booted_futures = [];

  constructor() {
    document.addEventListener("DOMContentLoaded", () => this.boot());
  }

  boot() {
    this.#booted = false;

    this.#booted = true;
  }

  set_booted_future(future) {
  }

  get booted() {
    if (this.#booted) {
      return new Promise(resolve => {
        resolve(this.boot_status);
      });
    } else {
      return new Promise(resolve => {
        this.booted_futures.push(resolve);
      });
    }

    return new Promise((resolve, reject) => {

      if (this.boot_status) {
        resolve();
      } else {
        this.add_on_booted(resolve);
      }
    });
  }

};


globalThis.dromozoa || document.addEventListener("DOMContentLoaded", (globalThis.dromozoa = new class {
  create_element(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
  }

  #offscreen;

  get offscreen() {
    return this.#offscreen ||= document.body.appendChild(this.create_element(`
      <div class="dromozoa offscreen"></div>
    `));
  }

  boot() {
    const view = this.offscreen.appendChild(this.create_element(`
      <div class="check_kerning">
        <div><span class="case1">&#xE001;&#xE002;</span></div>
        <div><span class="case2">&#xE001;&#xE002;</span></div>
        <div><span class="case3"><span>&#xE001;</span><span>&#xE002;</span></span></div>
      </div>
    `));

    const case1 = view.querySelector(".case1").getBoundingClientRect().width;;
    const case2 = view.querySelector(".case2").getBoundingClientRect().width;;
    const case3 = view.querySelector(".case3").getBoundingClientRect().width;;

    console.log(case1);
    console.log(case2);
    console.log(case3);
  }

  get bootloader() {
    return () => this.boot();
  }

}).bootloader);

/*
const D = globalThis.dromozoa = {
  features: {},
};
let offscreen;

const create_element = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
};

const get_offscreen = () => {
  if (offscreen) {
    return offscreen;
  }
  return offscreen = document.body.appendChild(create_element(`
    <div class="dromozoa offscreen"></div>
  `));
};

// feature_kerning
// feature_kerning_span
const check_kerning = () => {
  const view = get_offscreen().appendChild(create_element(`
    <div class="check_kerning">
      <div><span class="case1">&#xE001;&#xE002;</span></div>
      <div><span class="case2">&#xE001;&#xE002;</span></div>
      <div><span class="case3"><span>&#xE001;</span><span>&#xE002;</span></span></div>
    </div>
  `));

  const case1 = view.querySelector(".case1").getBoundingClientRect().width;;
  const case2 = view.querySelector(".case2").getBoundingClientRect().width;;
  const case3 = view.querySelector(".case3").getBoundingClientRect().width;;

  console.log(case1);
  console.log(case2);
  console.log(case3);
  console.log(check_kerning);

  // get_offscreen().removeChild(view);
};

document.addEventListener("DOMContentLoaded", () => {
  check_kerning();
});

D.booted = () {
};
*/
