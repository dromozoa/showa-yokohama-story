# Copyright (C) 2022,2023 煙人計画 <moyu@vaporoid.com>
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
credits = scenario/credits
trophies = scenario/trophies
targets = \
	output/loader.html \
	output/graph.svg \
	output/credits.html \
	output/trophies.html \
	output/voice.txt \
	output/debug.txt \
	design/demeter-scenario.js \
	design/demeter-debug-scenario.js \
	design/index.html \
	scenario/scenario.js

ifneq ($(wildcard output/voice.vpp),)
targets += output/voice-out.vpp
endif
ifneq ($(wildcard output/debug.vpp),)
targets += output/debug-out.vpp
endif

#--------------------------------------------------------------------------

all:: $(voicepeak_dic) $(targets)

clean::
	rm -f $(targets) output/*.vpp

check:: all
	./test.sh lua

#--------------------------------------------------------------------------

convert_voice::
	./tool/convert_voice.sh scenario/scenario.txt output/voice output/voice-out "*-voice-out.wav"
	cp -f output/voice/demeter-voice-sprites.js design/demeter-voice-sprites.js
	rm -f output/voice-out/*-voice-out.wav

convert_debug:
	./tool/convert_voice.sh scenario/debug.txt output/debug output/voice-out "*-debug-out.wav"
	cp -f output/debug/demeter-voice-sprites.js design/demeter-debug-voice-sprites.js
	rm -f output/voice-out/*-debug-out.wav

clean_voice::
	rm -f output/voice2/*.wav output/voice/*.webm output/voice/*.mp3

convert_effect:
	./tool/convert_effect.sh output/effect assets/effect "*.mp3"
	cp -f output/effect/demeter-effect-sprite.js design/demeter-effect-sprite.js

#--------------------------------------------------------------------------

$(voicepeak_dic): scenario/dic.json
	cp -f '$@' '$@'.backup-`date '+%Y%m%d%H%M%S'` || :
	cp -f $< '$@'

output/loader.html: $(scenarios)
	$(lua) tool/generate_loader.lua scenario/scenario.txt $@ tool/google_fonts_serif.css

output/graph.svg: $(scenarios)
	./tool/generate_graph.sh scenario/scenario.txt $@

output/credits.html: $(credits)
	$(lua) tool/generate_credits.lua $< $@

output/trophies.html: $(trophies)
	$(lua) tool/generate_trophies.lua $< $@ design/demeter-trophies.js

design/demeter-scenario.js: $(scenarios)
	$(lua) tool/generate_script.lua scenario/scenario.txt $@

design/demeter-debug-scenario.js: $(scenarios)
	$(lua) tool/generate_script.lua scenario/debug.txt $@

design/index.html: design/index.tmpl output/loader.html output/graph.svg output/credits.html output/trophies.html
	$(lua) tool/generate_html.lua design/index.tmpl output/loader.html output/graph.svg output/credits.html output/trophies.html $@

scenario/scenario.js: $(scenarios)
	$(lua) tool/generate_glance.lua scenario/scenario.txt $@

output/voice.txt: $(scenarios)
	$(lua) tool/generate_voice_txt.lua scenario/scenario.txt $@

output/debug.txt: $(scenarios)
	$(lua) tool/generate_voice_txt.lua scenario/debug.txt $@

output/voice-out.vpp: output/voice.vpp $(scenarios)
	$(lua) tool/generate_voice.lua scenario/scenario.txt output/voice.vpp $@

output/debug-out.vpp: output/debug.vpp $(scenarios)
	$(lua) tool/generate_voice.lua scenario/debug.txt output/debug.vpp $@

