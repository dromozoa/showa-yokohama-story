" Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
"
" This file is part of 昭和横濱物語.
"
" 昭和横濱物語 is free software: you can redistribute it and/or modify
" it under the terms of the GNU General Public License as published by
" the Free Software Foundation, either version 3 of the License, or
" (at your option) any later version.
"
" 昭和横濱物語 is distributed in the hope that it will be useful,
" but WITHOUT ANY WARRANTY; without even the implied warranty of
" MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
" GNU General Public License for more details.
"
" You should have received a copy of the GNU General Public License
" along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

if exists("b:current_syntax")
  finish
endif

let s:cpo_save = &cpo
set cpo&vim

syn include @javascript syntax/javascript.vim
unlet b:current_syntax

syntax keyword sysTodo TODO FIXME XXX NOTE contained

syntax match sysSpeaker     /#.*$/
syntax match sysComment     /@#.*$/ contains=sysTodo
syntax match sysLabel       /@label{[^}]*}/
syntax match sysJump        /@jump{[^}]*}/
syntax match sysInclude     /@include{[^}]*}/
syntax match sysFinish      /@finish/

syntax match sysRawString   /@"{.\{-}}"/
syntax match sysRuby        /@r{[^}]*}{[^}]*}\%({[^}]*}\)\?/
syntax match sysVoice       /@v{[^}]*}{[^}]*}/

syntax region sysChoiceLabel start=/@choice{/ end=/}\%({[^}]*}\)\?/ contains=sysRawString,sysRuby,sysVoice

syntax region sysWhen  start=/@when{{/  end=/}}{[^}]*}/ keepend contains=@javascript
syntax region sysEnter start=/@enter{{/ end=/}}/        keepend contains=@javascript
syntax region sysExit  start=/@exit{{/  end=/}}/        keepend contains=@javascript

highlight default link sysTodo        Todo
highlight default link sysSpeaker     Identifier
highlight default link sysComment     Comment
highlight default link sysRawString   String
highlight default link sysRuby        String
highlight default link sysRubyVoice   String
highlight default link sysVoice       String
highlight default link sysLabel       Label
highlight default link sysJump        Statement
highlight default link sysChoice      Conditional
highlight default link sysChoiceLabel Conditional
highlight default link sysInclude     Include
highlight default link sysWhen        Special
highlight default link sysEnter       Special
highlight default link sysExit        Special
highlight default link sysFinish      Statement

let b:current_syntax = "showa-yokohama-story"

let &cpo = s:cpo_save
unlet s:cpo_save
