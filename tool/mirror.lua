-- Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
--
-- This file is part of 昭和横濱物語.
--
-- 昭和横濱物語 is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- 昭和横濱物語 is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

local parse_json = require "parse_json"
local quote_shell = require "quote_shell"
local read_all = require "read_all"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local function fetch(url, output)
  local command = ("curl -L -f -s -# %s -o %s"):format(quote_shell(url), quote_shell(output))
  execute(command)
end

local commands = {}

function commands.fetch(config_pathname)
  local config = parse_json(read_all(config_pathname))

  execute "mkdir -p npm"
  for k, v in pairs(config.npm) do
    fetch("https://registry.npmjs.org/"..k, "npm/"..k..".json")
  end
end

assert(commands[...])(select(2, ...))
