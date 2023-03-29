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

const D = globalThis.demeter ||= {};
if (D.preferenes) {
  return;
}

const mode = "develop";
const version = { web:"b5", system:3, music:1, voice:1 };

if (mode === "develop") {
  D.preferences = {
    version: version,
    musicDir: "build/music",
    voiceDir: "build/voice",
    effectDir: "system",
    trace: (...args) => console.log(...args),
  };
} else {
  D.preferences = {
    version: version,
    musicDir: "/sys/music/" + version.music,
    voiceDir: "/sys/voice/" + version.voice,
    effectDir: "/sys/system/" + version.system,
    trace: () => {},
  };
}

})();
