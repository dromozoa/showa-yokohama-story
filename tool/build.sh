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

source_root=$1
output_root=$2
version_system=$3
version_web=$4
mode=$5

mkdir -p "$output_root/system/$version_system"

cp "$source_root"/*.html "$source_root"/*.js* "$output_root"
cp -R "$source_root/system"/* "$output_root/system/$version_system"

for i in index.html game.html
do
  lua -e "io.write((io.read [[a]]:gsub([[system/%./]], [[system/$version_system/]])))" \
    <"$source_root/$i" \
    >"$output_root/$i"

  case X$mode in
    Xmirror)
      lua -e 'io.write((io.read [[a]]:gsub([[https://cdn.jsdelivr.net/npm/]], [[mirror/npm/]])))' \
        <"$output_root/$i" \
        >"$output_root/$i.new"
      mv "$output_root/$i.new" "$output_root/$i"

      lua -e 'io.write((io.read [[a]]:gsub([[<!%-%- https://fonts.google.com/ %-%->.-<!%-%- end %-%->]], [[<link href="mirror/googlefonts/googlefonts.css" rel="stylesheet">]])))' \
        <"$output_root/$i" \
        >"$output_root/$i.new"
      mv "$output_root/$i.new" "$output_root/$i"
      ;;
  esac
done
cp "$output_root/game.html" "$output_root/game-$version_web.html"

lua -e 'io.write((io.read "a":gsub([[const mode = "develop"]], [[const mode = "release"]])))' \
  <"$source_root/system/demeter-preferences.js" \
  >"$output_root/system/$version_system/demeter-preferences.js"
