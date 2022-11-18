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

"use strict";
(() => {
  if (globalThis.dromozoa) {
    return;
  }
  const D = globalThis.dromozoa = {};
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
        <div><span class="case1">ToT</span></div>
        <div><span class="case2">ToT</span></div>
        <div><span class="case3"><span>T</span><span>o</span><span>T</span></span></div>
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

})();
