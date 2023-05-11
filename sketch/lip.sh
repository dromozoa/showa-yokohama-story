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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

here=`dirname "$0"`
here=`(cd "$here" && pwd)`
root=`(cd "$here/.." && pwd)`
export LUA_PATH="$root/tool/?.lua;;"

source_pathname=$1
output_dirname=$2
output_dirname=`(cd "$output_dirname" && pwd)`
scenario_pathname=$3
result_pathname=$4

lua "$here/vpp_to_txt.lua" "$source_pathname" "$output_dirname"

oldpwd=`pwd`
cd "$here/segmentation-kit"
perl segment_julius.pl "$output_dirname" julius 2>&1 | tee "$output_dirname/segment_julius.log"
cd "$oldpwd"

lua "$here/lab_to_js.lua" "$scenario_pathname" "$result_pathname" "$output_dirname"/*.lab
