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
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

local basename = require "basename"
local parse_json = require "parse_json"
local quote_shell = require "quote_shell"
local read_all = require "read_all"

local function execute(command)
  print(command)
  assert(os.execute(command))
end

local function fetch(url, output, ua)
  if ua then
    execute(("curl -L -f -# -A %s %s -o %s"):format(quote_shell(ua), quote_shell(url), quote_shell(output)))
  else
    execute(("curl -L -f -# %s -o %s"):format(quote_shell(url), quote_shell(output)))
  end
end

local commands = {}

function commands.fetch(config_pathname)
  commands.fetch_npm(config_pathname)
  commands.fetch_googlefonts(config_pathname)
end

function commands.fetch_npm(config_pathname)
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

local function encode_uri(s)
  return (s:gsub("[^%*%-%.0-9A-Z_a-z]", function (c)
    if c == " " then
      return "+"
    else
      return ("%%%02X"):format(c:byte())
    end
  end))
end

function commands.fetch_googlefonts(config_pathname)
  local config = parse_json(read_all(config_pathname))

  local names = {}
  for k, v in pairs(config.googlefonts) do
    names[#names + 1] = k
  end
  table.sort(names)

  execute "mkdir -p googlefonts"
  local handle = assert(io.open("googlefonts/googlefonts.css", "w"))

  for i in ipairs(names) do
    local name = names[i]
    local key = name:gsub(" ", "_")
    local font = config.googlefonts[name]

    local url = "https://fonts.googleapis.com/css2?family="..encode_uri(name)
    if font.text then
      url = url.."&text="..encode_uri(font.text)
    end
    url = url.."&display=swap"
    fetch(url, "googlefonts/"..key..".css", config.ua)

    local index = 0
    for line in io.lines("googlefonts/"..key..".css") do
      local head, url, tail = line:match [[^(%s*src: url%()(.-)(%) format%('woff2'%);)$]]
      if url then
        index = index + 1
        local filename = ("%s.%04d.woff2"):format(key, index)
        fetch(url, "googlefonts/"..filename, config.ua)
        handle:write(head, filename, tail, "\n")
      else
        handle:write(line, "\n")
      end
    end
  end

  handle:close()
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

  execute(("rm -f -r %s"):format(quote_shell(output_pathname.."/googlefonts")))
  execute(("mkdir -p %s"):format(quote_shell(output_pathname.."/googlefonts")))
  execute(("cp googlefonts/googlefonts.css googlefonts/*.woff2 %s"):format(quote_shell(output_pathname.."/googlefonts")))
end

assert(commands[...])(select(2, ...))

