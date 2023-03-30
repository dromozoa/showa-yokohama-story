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

lua = env "LUA_PATH=tool/?.lua;;" lua
voicepeak_dic = $(HOME)/Library/Application\ Support/Dreamtonics/Voicepeak/settings/dic.json
scenarios = $(wildcard scenario/*.txt)
credits = scenario/credits
trophies = scenario/trophies
targets = \
	build/loader.html \
	build/graph.svg \
	build/credits.html \
	build/trophies.html \
	build/voice.txt \
	build/debug.txt \
	system/demeter-scenario.js \
	system/demeter-debug-scenario.js \
	version.json \
	game.html \
	scenario/scenario.js

ifneq ($(wildcard build/voice.vpp),)
targets += build/voice-out.vpp
endif
ifneq ($(wildcard build/debug.vpp),)
targets += build/debug-out.vpp
endif

include version.mk

#--------------------------------------------------------------------------

all:: $(voicepeak_dic) $(targets)

clean::
	rm -f $(targets) build/*.vpp

check:: all
	./test.sh lua

build::
	rm -f -r build/$(version_web)
	./tool/build.sh . build/$(version_web) $(version_system) $(version_web)

#--------------------------------------------------------------------------

convert_voice::
	mkdir -p build/voice
	./tool/convert_voice.sh scenario/scenario.txt build/voice build/voice-out "*-voice-out.wav"
	cp -f build/voice/demeter-voice-sprites.js system/demeter-voice-sprites.js
	rm -f build/voice-out/*-voice-out.wav

convert_debug:
	mkdir -p build/debug
	./tool/convert_voice.sh scenario/debug.txt build/debug build/voice-out "*-debug-out.wav"
	cp -f build/debug/demeter-voice-sprites.js system/demeter-debug-voice-sprites.js
	rm -f build/voice-out/*-debug-out.wav

clean_voice::
	rm -fr build/voice-out/*.wav build/voice build/debug

convert_effect:
	./tool/convert_effect.sh build/effect assets/effect "*.mp3"
	cp -f build/effect/*effect* system

clean_effect:
	rm -f -r build/effect

#--------------------------------------------------------------------------

deploy_dry_run::
	./tool/deploy.sh --dryrun build/$(version_web) s3://vaporoid.com/sys

deploy_execute::
	./tool/deploy.sh "" build/$(version_web) s3://vaporoid.com/sys

deploy_system_dry_run::
	aws s3 sync --dryrun build/$(version_web)/system/$(version_system) s3://vaporoid.com/sys/system/$(version_system)

deploy_system_execute::
	aws s3 sync build/$(version_web)/system/$(version_system) s3://vaporoid.com/sys/system/$(version_system)

deploy_music_dry_run::
	./tool/deploy_music.sh --dryrun assets/music.txt build/music s3://vaporoid.com/sys/music/$(version_music)

deploy_music_execute::
	./tool/deploy_music.sh "" assets/music.txt build/music s3://vaporoid.com/sys/music/$(version_music)

deploy_voice_dry_run::
	aws s3 sync --dryrun --exclude '*.*' --include '*.mp3' --include '*.webm' build/voice s3://vaporoid.com/sys/voice/$(version_voice)

deploy_voice_execute::
	aws s3 sync --exclude '*.*' --include '*.mp3' --include '*.webm' build/voice s3://vaporoid.com/sys/voice/$(version_voice)

#--------------------------------------------------------------------------

$(voicepeak_dic): scenario/dic.json
	cp -f '$@' '$@'.backup-`date '+%Y%m%d%H%M%S'` || :
	cp -f $< '$@'

build/loader.html: $(scenarios)
	$(lua) tool/generate_loader.lua scenario/scenario.txt $@ tool/google_fonts_serif.css

build/graph.svg: $(scenarios)
	./tool/generate_graph.sh scenario/scenario.txt $@

build/credits.html: $(credits)
	$(lua) tool/generate_credits.lua $< $@

build/trophies.html: $(trophies)
	$(lua) tool/generate_trophies.lua $< $@ system/demeter-trophies.js

system/demeter-scenario.js: $(scenarios)
	$(lua) tool/generate_script.lua scenario/scenario.txt $@

system/demeter-debug-scenario.js: $(scenarios)
	$(lua) tool/generate_script.lua scenario/debug.txt $@

version.json: versions
	$(lua) tool/generate_version.lua versions version.json system/demeter-preferences.js version.mk

game.html: game.tmpl build/loader.html build/graph.svg build/credits.html build/trophies.html version.json
	$(lua) tool/generate_html.lua game.tmpl build/loader.html build/graph.svg build/credits.html build/trophies.html version.json $@

scenario/scenario.js: $(scenarios)
	$(lua) tool/generate_glance.lua scenario/scenario.txt $@

build/voice.txt: $(scenarios)
	$(lua) tool/generate_voice_txt.lua scenario/scenario.txt $@

build/debug.txt: $(scenarios)
	$(lua) tool/generate_voice_txt.lua scenario/debug.txt $@

build/voice-out.vpp: build/voice.vpp $(scenarios)
	$(lua) tool/generate_voice.lua scenario/scenario.txt build/voice.vpp $@

build/debug-out.vpp: build/debug.vpp $(scenarios)
	$(lua) tool/generate_voice.lua scenario/debug.txt build/debug.vpp $@
