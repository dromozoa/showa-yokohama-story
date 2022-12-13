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

lua = env "LUA_PATH=tool/?.lua;;" lua
voicepeak_dic = $(HOME)/Library/Application\ Support/Dreamtonics/Voicepeak/settings/dic.json
scenarios = $(wildcard scenario/*.txt)
targets = output/graph.svg output/voice1.txt

ifneq ($(wildcard output/voice1.vpp),)
targets += output/voice2.vpp
endif

all:: $(voicepeak_dic) $(targets)

clean::
	rm -f $(targets)

$(voicepeak_dic): scenario/dic.json
	cp -f '$@' '$@'.backup-`date '+%Y%m%d%H%M%S'` || :
	cp -f $< '$@'

output/graph.svg: $(scenarios)
	./tool/generate_graph.sh scenario/scenario.txt $@

output/voice1.txt: $(scenarios)
	$(lua) tool/generate_voice_txt.lua scenario/scenario.txt $@

output/voice2.vpp: output/voice1.vpp $(scenarios)
	$(lua) tool/generate_voice.lua scenario/scenario.txt output/voice1.vpp $@

check:: all
	./test.sh lua
