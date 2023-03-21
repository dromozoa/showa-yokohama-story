" Copyright (C) 2022,2023 Tomoyuki Fujimori <moyu@vaporoid.com>
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

syntax match sysRawString /@"{.\{-}}"/
syntax match sysRuby /@r{[^}]*}{[^}]*}\%({[^}]*}\)\?/
syntax match sysVoice /@v{[^}]*}{[^}]*}/

syntax match sysSpeaker /#.*$/
syntax keyword sysTodo TODO FIXME XXX NOTE contained
syntax match sysComment /@#.*$/ contains=sysTodo
syntax match sysLabelArg /{[^}]*}/ contained
syntax match sysLabel /@label{[^}]*}/ contains=sysLabelArg
syntax match sysLabelRoot /@label_root{[^}]*}/ contains=sysLabelArg
syntax match sysJump /@jump{[^}]*}/ contains=sysLabelArg
syntax match sysInclude /@include{[^}]*}/
syntax match sysStart /@start{[^}]*}/
syntax match sysFinish /@finish{[^}]*}/
syntax match sysSystem /@system/
syntax match sysMusic /@music{[^}]*}/
syntax match sysDialog /@dialog{[^}]*}/
syntax match sysDialogChoice /@dialog_choice{[^}]*}{[^}]*}/

syntax match sysChoiceLabel /{[^}]*}\%({[^}]*}\)\?/ contained
syntax region sysChoiceScript start=/{{/ end=/}}/ keepend contains=@javascript contained nextgroup=sysChoiceLabel
syntax region sysChoice start=/@choice{/ end=/}/ contains=sysRawString,sysRuby,sysVoice nextgroup=sysChoiceScript,sysChoiceLabel

syntax region sysWhen start=/@when{{/ end=/}}/ keepend contains=@javascript nextgroup=sysLabelArg
syntax region sysEnter start=/@enter{{/ end=/}}/ keepend contains=@javascript
syntax region sysLeave start=/@leave{{/ end=/}}/ keepend contains=@javascript

highlight default link sysRawString String
highlight default link sysRuby String
highlight default link sysVoice String
highlight default link sysSpeaker Identifier
highlight default link sysTodo Todo
highlight default link sysComment Comment
highlight default link sysLabelArg Macro
highlight default link sysLabel Statement
highlight default link sysLabelRoot Statement
highlight default link sysJump Statement
highlight default link sysChoiceLabel Macro
highlight default link sysChoiceScript Conditional
highlight default link sysChoice Conditional
highlight default link sysInclude Include
highlight default link sysWhen Conditional
highlight default link sysEnter Statement
highlight default link sysLeave Statement
highlight default link sysStart Statement
highlight default link sysFinish Statement
highlight default link sysSystem Statement
highlight default link sysMusic Statement
highlight default link sysDialog Statement
highlight default link sysDialogChoice Conditional

let b:current_syntax = "showa-yokohama-story"

let &cpo = s:cpo_save
unlet s:cpo_save
