#! /bin/sh -e

# Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
#
# This file is part of 昭和横濱物語.
#
# 昭和横濱物語 is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# 昭和横濱物語 is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

here=`dirname "$0"`
export LUA_PATH="$here/?.lua;;"

source_dirname=$1
output_dirname=$2 # build/b3
system_dirname=$3 # system/1
music_dirname=$4 # music/1
voice_dirname=$5 # voice/1

mkdir -p "$output_dirname/$system_dirname"

cp "$source_dirname"/*.html "$source_dirname"/*.js* "$output_dirname"
cp -R "$source_dirname/system"/* "$output_dirname/$system_dirname"

lua -e 'io.write((io.read "a":gsub("system/%.", "'"$3"'")))' \
  <"$source_dirname/game.html" \
  >"$output_dirname/game.html"

lua "$here/build_release.lua" \
  "$source_dirname/system/demeter.js" \
  "$output_dirname/$system_dirname/demeter.js" \
  "$music_dirname" \
  "$voice_dirname" \
  "$system_dirname"
