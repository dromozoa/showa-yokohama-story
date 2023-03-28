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

I=30

mkdir -p "$1/$I"
output_dirname=`(cd "$1" && pwd)`
source_dirname=`(cd "$2" && pwd)`

for i in "$source_dirname"/$3
do
  j=`basename "$i" .mp3`
  lua "$here/normalize_effect.lua" "-$I" "$i" "$output_dirname/$I/$j"
done
lua "$here/convert_effect.lua" "$output_dirname" "$output_dirname/$I"/*.wav
