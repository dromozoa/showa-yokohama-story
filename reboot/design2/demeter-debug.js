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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

(() => {
"use strict";

const D = globalThis.demeter;
if (D.includeDebugGuard) {
  return;
}
D.includeDebugGuard = true;

//-------------------------------------------------------------------------

const fontSize = 24;
const font = "'Showa Yokohama Story', 'BIZ UDPMincho', 'Source Serif Pro', serif";

const musics = {
  "Title": "vi03",
  "#1": "diana33",
  "#2": "diana19",
  "#3": "diana23",
  "ED": "diana12",
};

const speakerNames = {
  narrator: "\uE000",
  alice:    "アリス",
  danu:     "ダヌー",
  demeter:  "デメテル",
  yukio:    "ユキヲ",
  priest:   "神父",
  engineer: "課長",
  activist: "店主",
  steven:   "STEVEN",
};

//-------------------------------------------------------------------------

let sound;

const playVoice = paragraphIndex => {
  return () => {
    if (sound) {
      sound.stop();
    }
    const basename = D.preferences.voiceDir + "/" + D.padStart(paragraphIndex, 4);
    sound = new Howl({
      src: [ basename + ".webm", basename + ".mp3" ],
    });
    sound.play();
  };
};

const saveParagraph = paragraphIndex => {
  return () => {
    history.replaceState(null, "", "#" + paragraphIndex);
  };
};

//-------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  D.initializeInternal();

  const musicPlayer = new D.MusicPlayer(1, () => {});
  musicPlayer.start("vi03");

  const paragraphIndexSearch = document.location.hash.replace(/^#/, "");

  const debug = {
    music: "Title",
    status: "",
    stop: () => {
      musicPlayer.sound.stop();
    },
    scroll: () => {
      const paragraphNodeSearch = document.querySelector("[data-pid='" + paragraphIndexSearch + "']");
      if (paragraphNodeSearch) {
        paragraphNodeSearch.scrollIntoView();
        messageNode.scrollIntoView({ behavior: "smooth" });
      }
    },
  };

  const debugUi = new lil.GUI({
    title: "デバッグ",
  });

  debugUi.add(debug, "music", musics).name("Music").onChange(v => {
    musicPlayer.fade(v);
  });
  const statusController = debugUi.add(debug, "status").name("Status");
  statusController.disable();
  debugUi.add(debug, "stop").name("Stop");
  debugUi.add(debug, "scroll").name("Scroll");

  const updateStatus = status => {
    debug.status = status;
    statusController.updateDisplay();
  };

  updateStatus("レイアウト中");
  for (let paragraphIndex = 1; paragraphIndex <= D.scenario.paragraphs.length; ++paragraphIndex) {
    await D.requestAnimationFrame();
    updateStatus("レイアウト中: " + paragraphIndex + " / " + D.scenario.paragraphs.length);
    const paragraph = D.scenario.paragraphs[paragraphIndex - 1];
    const dialog = paragraph[0].dialog;
    if (dialog) {
      const speakerNode = document.createElement("div");
      speakerNode.classList.add("demeter-debug-dialog-speaker");
      speakerNode.textContent = speakerNames[paragraph[0].speaker];
      speakerNode.addEventListener("click", playVoice(paragraphIndex));

      const dialogFrameNode = document.createElement("div");
      dialogFrameNode.classList.add("demeter-debug-dialog-frame");
      dialogFrameNode.append(D.createDialogFrame(fontSize * 25, fontSize * 12, fontSize, dialog.length, fontSize * 8, fontSize * 2));

      const textNode = document.createElement("div");
      textNode.classList.add("demeter-debug-dialog-text");
      D.parseParagraph(paragraph[1], fontSize, font).forEach(text => {
        textNode.append(D.layoutText(D.composeText(text, fontSize * 21), fontSize, fontSize * 2));
      });
      textNode.addEventListener("click", saveParagraph(paragraphIndex));

      const itemNodes = [];
      for (let index = 1; index <= dialog.length; ++index) {
        const itemNode = document.createElement("div");
        itemNode.classList.add("demeter-debug-dialog-item", "demeter-debug-dialog-item" + index);
        itemNode.textContent = dialog[index - 1].choice;
        itemNodes.push(itemNode);
      }

      const dialogNode = document.createElement("div");
      dialogNode.classList.add("demeter-debug-dialog");
      dialogNode.dataset.pid = paragraphIndex
      dialogNode.append(speakerNode, dialogFrameNode, textNode, ...itemNodes);
      document.querySelector(".demeter-debug").append(dialogNode);
    } else {
      const speakerNode = document.createElement("div");
      speakerNode.classList.add("demeter-debug-paragraph-speaker");
      speakerNode.textContent = speakerNames[paragraph[0].speaker];
      speakerNode.addEventListener("click", playVoice(paragraphIndex));

      const textNode = document.createElement("div");
      textNode.classList.add("demeter-debug-paragraph-text");
      D.parseParagraph(paragraph[1], fontSize, font).forEach(text => {
        textNode.append(D.layoutText(D.composeText(text, fontSize * 25), fontSize, fontSize * 2));
      });
      textNode.addEventListener("click", saveParagraph(paragraphIndex));

      const paragraphNode = document.createElement("div");
      paragraphNode.classList.add("demeter-debug-paragraph");
      paragraphNode.dataset.pid = paragraphIndex;
      paragraphNode.append(speakerNode, textNode);
      document.querySelector(".demeter-debug").append(paragraphNode);
    }
  }
  updateStatus("レイアウト完了");

}, { once: true });

//-------------------------------------------------------------------------

})();
