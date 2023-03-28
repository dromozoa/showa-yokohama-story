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

integrated_loudness_target=$1
output_dirname=$2
shift 2

for i in "$@"
do
  output_name=`expr "X$i" : 'X\([^:]*\):'`
  source_dirname=`expr "X$i" : 'X[^:]*:\(.*\)'`
  lua "$here/convert_music.lua" "$integrated_loudness_target" "$output_dirname" "$output_name" "$source_dirname"/*.wav
done
