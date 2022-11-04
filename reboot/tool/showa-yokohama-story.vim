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
syntax match sysRawString   /@"{.\{-}}"/
syntax match sysRuby        /@r{[^}]*}{[^}]*}/
syntax match sysRubyVoice   /@r{[^}]*}{[^}]*}{[^}]*}/
syntax match sysVoice       /@v{[^}]*}{[^}]*}/
syntax match sysLabel       /@label{[^}]*}/
syntax match sysJump        /@jump{[^}]*}/
syntax match sysChoice      /@choice{[^}]*}/
syntax match sysChoiceLabel /@choice{[^}]*}{[^}]*}/
syntax match sysInclude     /@include{[^}]*}/

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

let b:current_syntax = "showa-yokohama-story"

let &cpo = s:cpo_save
unlet s:cpo_save
