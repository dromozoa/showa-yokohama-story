if exists("b:current_syntax")
  finish
endif

let s:cpo_save = &cpo
set cpo&vim

syntax match sysSpeaker   /#.*$/
syntax match sysComment   /@#.*$/
syntax match sysRawString /@"{.\{-}}"/
syntax match sysRuby      /@r{[^}]*}{[^}]*}/
syntax match sysRubyVoice /@r{[^}]*}{[^}]*}{[^}]*}/
syntax match sysVoice     /@v{[^}]*}{[^}]*}/
syntax match sysLabel     /@label{[^}]*}/

highlight default link sysSpeaker   Identifier
highlight default link sysComment   Comment
highlight default link sysRawString String
highlight default link sysRuby      String
highlight default link sysRubyVoice String
highlight default link sysVoice     String
highlight default link sysLabel     Label

let b:current_syntax = "showa-yokohama-story"

let &cpo = s:cpo_save
unlet s:cpo_save
