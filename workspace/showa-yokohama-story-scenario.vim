if exists("b:current_syntax")
  finish
endif

let s:cpo_save = &cpo
set cpo&vim

syn match syssComment /^@#.*$/
syn match syssSection /^@=.*$/
syn match syssCommand /^@\w.*$/
syn match syssLabel /^#.*$/
syn match syssCode /^!!.*$/
syn region syssRuby start="@{ruby}" end="@{/ruby[^}]*}"
syn region syssRuby start="@[rvR]" end="@{[^}]*}"

hi def link syssComment Comment
hi def link syssSection Function
hi def link syssCommand Statement
hi def link syssLabel Label
hi def link syssCode Structure
hi def link syssRuby String

" let b:current_syntax = "showa-yokohama-story-scenario"

let &cpo = s:cpo_save
unlet s:cpo_save
