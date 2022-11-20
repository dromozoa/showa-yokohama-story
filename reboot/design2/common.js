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
      <div class="dromozoa offscreen"></div>
    `));
  }

  // Showa Yokohama Storyフォントは下記の寸法を持つ。
  //   U+E0001:  800/1000
  //   U+E0002:  900/1000
  //   Kerning: -300/1000
  // フォントサイズ100pxでレンダリングすると、
  //   カーニング無効: 幅170px
  //   カーニング有効: 幅140px
  // になる。
  //
  // Safariは<span>をまたいでカーニングしないので、これを検出する。
  async check_kerning() {
    const fontface = Array.from(document.fonts).find(fontface => /Showa Yokohama Story/.test(fontface.family));
    if (!fontface) {
      throw new Error("font 'Showa Yokohama Story' not found");
    }
    await fontface.load();

    const view = this.offscreen.appendChild(create_element(`
      <div class="check_kerning">
        <div><span class="case1">&#xE001;&#xE002;</span></div>
        <div><span class="case2">&#xE001;&#xE002;</span></div>
        <div><span class="case3"><span>&#xE001;</span><span>&#xE002;</span></span></div>
      </div>
    `));

    const case1 = view.querySelector(".case1").getBoundingClientRect().width;;
    const case2 = view.querySelector(".case2").getBoundingClientRect().width;;
    const case3 = view.querySelector(".case3").getBoundingClientRect().width;;

    console.log(case1, case2, case3);

    if (this.feature_kerning = case1 > case2) {
      this.feature_kerning_span = Math.abs(case1 - case3) > Math.abs(case2 - case3);
    }

    view.remove();
    // this.offscreen.removeChild(view);
  }

  layout_text(text, class_name) {
    // const view = this.offscreen.appendChild(create_element(`
    //   <div><div class="layout_text"></div></div>
    // `));
    // view.className = class_name;

    if (this.feature_kerning_span) {
    } else {
      const view = document.createElement("div");
      if (class_name !== undefined) {
        view.classList.add(class_name);
      }

      const escaped_chars = [...text].map(escape_html);

      for (let i = 1; i < escaped_chars.length; ++i) {
        const a = escaped_chars.slice(0, i).join("");
        const b = escaped_chars[i];
        view.append(...create_elements(`
          <div><span><span>${a}${b}</span></span></div>
          <div><span><span>${a}</span><span>${b}</span></div>
        `));
      }

      this.offscreen.append(view);

      const result = [];
      for (let i = 1; i < escaped_chars.length; ++i) {
        const a = view.children[i * 2 - 2].firstElementChild.getBoundingClientRect().width;
        const b = view.children[i * 2 - 1].firstElementChild.getBoundingClientRect().width;
        console.log(b-a, a, b)
        result.push(b - a);
      }
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
