if exists("b:current_syntax")
  finish
endif

let s:cpo_save = &cpo
set cpo&vim

syn match sysComment /^%#.*$/
syn match sysLabel /^#.*$/
syn region sysRuby start="@r" end="[^}]*}[^}]*}"

hi def link sysComment Comment
hi def link sysLabel Label
hi def link sysRuby String

let b:current_syntax = "showa-yokohama-story"

let &cpo = s:cpo_save
unlet s:cpo_save
