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

all:: build

fetch::
	../tool/mirror.sh fetch mirror.json

fetch_npm::
	../tool/mirror.sh fetch_npm mirror.json

fetch_googlefonts::
	../tool/mirror.sh fetch_googlefonts mirror.json

build::
	rm -f -r ../build/mirror
	../tool/mirror.sh build mirror.json ../build/mirror

clean::
	rm -f -r ../build/mirror
