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

const root = globalThis.dromozoa = new class {
  #boot_exception;
  #booted;
  #booted_futures = [];
  #offscreen;

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

  create_element(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstElementChild;
  }

  get offscreen() {
    return this.#offscreen ||= document.body.appendChild(this.create_element(`
      <div class="dromozoa offscreen"></div>
    `));
  }

  async check_kerning() {
    const fontface = Array.from(document.fonts).find(fontface => /Showa Yokohama Story/.test(fontface.family));
    if (!fontface) {
      throw new Error("font 'Showa Yokohama Story' not found");
    }
    await fontface.load();

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
