# Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
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

voicepeak_dic = $(HOME)/Library/Application\ Support/Dreamtonics/Voicepeak/settings/dic.json
scenarios = $(wildcard scenario/*.txt)

all:: $(voicepeak_dic) output/graph.svg

$(voicepeak_dic): scenario/dic.json
	cp -f '$@' '$@'.backup-`date '+%Y%m%d%H%M%S'`
	cp -f $< '$@'

output/graph.svg: $(scenarios)
	./tool/generate_svg.sh scenario/scenario.txt $@

check:: all
	./test.sh lua

