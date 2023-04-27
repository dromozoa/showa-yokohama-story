// Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

/* jshint esversion: 8 */
(() => {
"use strict";

const D = {};

D.requestAnimationFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

D.animateAJapan = async () => {
  const T1 = 3000;
  const T2 = 1000;
  const exNode = document.querySelector(".danu-a-japan-ex");
  const nnNode = document.querySelector(".danu-a-japan-nn");

  if (!exNode || !nnNode) {
    return;
  }

  const startTime = await D.requestAnimationFrame();
  while (true) {
    const duration = (await D.requestAnimationFrame() - startTime) % (T1 + T2 + T1 + T2);
    if (duration < T1) {
      exNode.style.opacity = 1;
      nnNode.style.opacity = 0;
    } else if (duration < T1 + T2) {
      const x = (duration - T1) / T2;
      const y = Math.sin((x - 0.5) * Math.PI) * 0.5 + 0.5;
      exNode.style.opacity = 1 - y;
      nnNode.style.opacity = y;
    } else if (duration < T1 + T2 + T1) {
      exNode.style.opacity = 0;
      nnNode.style.opacity = 1;
    } else {
      const x = (duration - T1 - T2 - T1) / T2;
      const y = Math.sin((x - 0.5) * Math.PI) * 0.5 + 0.5;
      exNode.style.opacity = y;
      nnNode.style.opacity = 1 - y;
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const onClickTitle = (ev, rootQuery, descQuery) => {
    const rootNode = ev.target.closest(rootQuery);
    const iconNode = rootNode.querySelector(".las");
    if (iconNode.classList.contains("la-angle-right")) {
      iconNode.classList.remove("la-angle-right");
      iconNode.classList.add("la-angle-down");
    } else {
      iconNode.classList.remove("la-angle-down");
      iconNode.classList.add("la-angle-right");
    }
    rootNode.querySelector(descQuery).classList.toggle("danu-opened");
  };

  document.querySelectorAll(".danu-versions-title").forEach(node => node.addEventListener("click", ev => onClickTitle(ev, ".danu-versions", ".danu-versions-description")));
  document.querySelectorAll(".danu-version").forEach(node => node.addEventListener("click", ev => onClickTitle(ev, ".danu-version", ".danu-version-description")));

  const onClickScreenShot = ev => {
    ev.preventDefault();
    const targetNode = ev.target.closest(".danu-screen-shot");
    [...document.querySelectorAll(".danu-screen-shot")].forEach(node => {
      if (node === targetNode) {
        node.classList.toggle("danu-active");
      } else {
        node.classList.remove("danu-active");
      }
    });
  };
  document.querySelectorAll(".danu-screen-shot").forEach(node => node.addEventListener("click", onClickScreenShot));

  requestAnimationFrame(D.animateAJapan);
});

})();
