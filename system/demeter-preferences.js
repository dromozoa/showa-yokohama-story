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

const regexApp = /showa-yokohama-story-(\w+)/;

const isApp = () => {
  const result = navigator.userAgent.match(regexApp);
  if (result) {
    return result[1];
  }
};

const regexAppVersion = /showa-yokohama-story-\w+\/([\w\.]+)/;

const getAppVersion = () => {
  const result = navigator.userAgent.match(regexAppVersion);
  if (result) {
    return result[1];
  }
}

const getAudioExtensions = () => {
  switch (isApp()) {
    case "ios":
      return [ "mp3" ];
    case "android":
      return [ "webm" ];
    default:
      return [ "webm", "mp3" ];
  }
};

const mode = "develop";
const version = { web: "b26", system: 24, music: 1, voice: 8 };
const audioExtensions = getAudioExtensions();

if (mode === "develop") {
  D.preferences = {
    version: version,
    systemDir: "system",
    musicDir: "build/music",
    voiceDir: "build/voice",
    trace: (...params) => console.log(...params),
    audioExtensions: audioExtensions,
    isApp: isApp,
    getAppVersion: getAppVersion,
  };
} else {
  D.preferences = {
    version: version,
    systemDir: "system/" + version.system,
    musicDir: "music/" + version.music,
    voiceDir: "voice/" + version.voice,
    trace: () => {},
    audioExtensions: audioExtensions,
    isApp: isApp,
    getAppVersion: getAppVersion,
  };
}

})();
