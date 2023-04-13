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

local basename = require "basename"
local parse_json = require "parse_json"
local quote_shell = require "quote_shell"
local read_all = require "read_all"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local function fetch(url, output)
  execute(("curl -L -f -# %s -o %s"):format(quote_shell(url), quote_shell(output)))
end

local commands = {}

function commands.fetch(config_pathname)
  local config = parse_json(read_all(config_pathname))

  execute "mkdir -p npm"
  for k, v in pairs(config.npm) do
    local package_pathname = "npm/"..k..".json"
    fetch("https://registry.npmjs.org/"..k, package_pathname)
    local package = parse_json(read_all(package_pathname))
    local latest = package["dist-tags"].latest
    if v ~= latest then
      io.write("[INFO] newer version found: ", k, "-", v, " => ", k, "-", latest, "\n")
    end
    local tarball = package.versions[v].dist.tarball
    fetch(tarball, "npm/"..basename(tarball))
  end
end

function commands.build(config_pathname, output_pathname)
  local config = parse_json(read_all(config_pathname))

  execute(("rm -f -r %s"):format(quote_shell(output_pathname.."/npm")))
  execute(("mkdir -p %s"):format(quote_shell(output_pathname.."/npm")))
  for k, v in pairs(config.npm) do
    local package_pathname = "npm/"..k..".json"
    local package = parse_json(read_all(package_pathname))
    local tarball = package.versions[v].dist.tarball
    execute(("tar -x -C %s -f %s"):format(quote_shell(output_pathname.."/npm"), quote_shell("npm/"..basename(tarball))))
    execute(("mv %s %s"):format(quote_shell(output_pathname.."/npm/package"), quote_shell(output_pathname.."/npm/"..k.."@"..v)))

    -- line-awesomeのsvgは6.4MiBあるので削除する。
    if k == "line-awesome" then
      execute(("rm -f -r %s"):format(output_pathname.."/npm/"..k.."@"..v.."/svg"))
    end
  end
end

assert(commands[...])(select(2, ...))

