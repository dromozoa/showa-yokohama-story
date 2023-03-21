-- Copyright (C) 2022,2023 Tomoyuki Fujimori <moyu@dromozoa.com>
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

local source = io.read "a"

local width, height, vb_width, vb_height, source = assert(source:match [[<svg width="(%d+)pt" height="(%d+)pt"%s+viewBox="0%.00 0%.00 (%1%.%d%d) (%2%.%d%d)".->%s*(.*)]])
local tx, ty, source = assert(source:match [[^<g id="graph0" class="graph" transform="scale%(1 1%) rotate%(0%) translate%(([%-%d]+) ([%-%d]+)%)">%s*(.*)]])

local width = tonumber(width)
local height = tonumber(height)
local vb_width = tonumber(vb_width)
local vb_height = tonumber(vb_height)
width = math.max(width, math.ceil(vb_width))
height = math.max(height, math.ceil(vb_height))

local tx = tonumber(tx)
local ty = tonumber(ty)

local node_max = 0
local nodes = {}
local edge_max = 0
local edges = {}

for group_id, group_class, title, data in source:gmatch [[<g id="(.-)" class="(.-)"><title>(.-)</title>%s*(.-)%s*</g>]] do
  assert(group_class == "node" or group_class == "edge")
  if group_class == "node" then
    local n = tonumber(assert(group_id:match "^node(%d+)$"))
    node_max = math.max(node_max, n)

    local cx, cy, rx, ry = data:match [[^<ellipse fill="none" stroke="black" cx="([%-%.%d]+)" cy="([%-%.%d]+)" rx="(%d+)" ry="(%d+)"/>$]]
    if cx then
      cx = tonumber(cx)
      cy = tonumber(cy)
      rx = tonumber(rx)
      ry = tonumber(ry)
      assert(rx == ry)
      nodes[#nodes + 1] = {
        title = title;
        shape = "circle";
        cx = cx + tx;
        cy = cy + ty;
        r = rx;
      }

    else
      local s = assert(data:match [[^<polygon fill="none" stroke="black" points="(.*)"/>$]], "error:"..data)
      local points = {}
      for x, y in s:gmatch "([%-%.%d]+)[%s,]+([%-%.%d]+)" do
        points[#points + 1] = { x = tonumber(x), y = tonumber(y) }
      end
      assert(#points == 5)
      local a, b, c, d, e = points[1], points[2], points[3], points[4], points[5]
      assert(a.x == e.x)
      assert(a.y == e.y)

      if a.x == d.x and b.x == c.x and a.y == b.y and c.y == d.y then
        -- <rect>で表現できる場合
        -- b a
        -- c d
        assert(b.x < a.x)
        assert(b.y < c.y)
        assert(a.x - b.x == d.x - c.x)
        assert(c.y - b.y == d.y - a.y)
        nodes[#nodes + 1] = {
          title = title;
          shape = "rect";
          x = b.x + tx;
          y = b.y + ty;
          width = a.x - b.x;
          height = c.y - b.y;
        }
      else
        local node = {
          title = title;
          shape = "polygon";
          points = {};
        }
        for i, p in pairs(points) do
          node.points[i] = {
            x = p.x + tx;
            y = p.y + ty;
          }
        end
        nodes[#nodes + 1] = node
      end
    end
  else
    local n = tonumber(assert(group_id:match "^edge(%d+)$"))
    edge_max = math.max(edge_max, n)
    local s = assert(data:match [[^<path fill="none" stroke="black" d="(.*)"/>$]])
    -- MとCの命令しか出てこない
    local path1 = {}
    for c, x, y in s:gmatch "([MC]?)([%-%.%d]+)[%s,]+([%-%.%d]+)" do
      if c == "" then
        path1[#path1 + 1] = { x = tonumber(x), y = tonumber(y) }
      else
        path1[#path1 + 1] = { x = tonumber(x), y = tonumber(y), command = c }
      end
    end
    local path2 = {}
    local i = 0
    local command
    while i < #path1 do
      i = i + 1
      local p = path1[i]
      local c = p.command or command
      if c == "M" then
        path2[#path2 + 1] = { command = "M", x = p.x, y = p.y }
      else
        assert(c == "C")
        i = i + 1
        local q = path1[i]
        i = i + 1
        local r = path1[i]
        path2[#path2 + 1] = { command = "C", x1 = p.x, y1 = p.y, x2 = q.x, y2 = q.y, x = r.x, y = r.y }
      end
      command = c
    end
    assert(#path2 >= 2)

    local edge = {}

    local p = path2[1]
    local q = path2[2]
    if #path2 == 2 and p.command == "M" and q.command == "C" and p.x == q.x1 and p.x == q.x2 and p.x == q.x and p.y <= q.y1 and q.y1 <= q.y2 and q.y1 <= q.y then
      -- V命令で置き換えられる場合
      edges[#edges + 1] = {
        { command = "M", p.x + tx, p.y + ty };
        { command = "V", q.y + ty };
      }
    else
      local edge = {}
      for i, p in ipairs(path2) do
        if p.command == "M" then
          edge[i] = { command = "M", p.x + tx, p.y + ty }
        else
          assert(p.command == "C")
          edge[i] = { command = "C", p.x1 + tx, p.y1 + ty, p.x2 + tx, p.y2 + ty, p.x + tx, p.y + ty }
        end
      end
      edges[#edges + 1] = edge
    end
  end
end

assert(node_max == #nodes)
assert(edge_max == #edges)

local function number_tostring(v)
  return ("%.4f"):format(v):gsub("%.?0*$", "")
end

local function number_tostring_unpack(source)
  local result = {}
  for i, v in ipairs(source) do
    result[i] = number_tostring(v)
  end
  return table.unpack(result)
end

local handle = io.stdout
handle:write(([[
<style>
:root {
  --graph-width: %dpx;
  --graph-height: %dpx;
  --graph-ratio: %s;
}
</style>
<svg viewBox="0 0 %d %d" data-width="%d" data-height="%d" xmlns="http://www.w3.org/2000/svg">
<defs>
  <marker id="demeter-graph-marker" markerUnits="strokeWidth" markerWidth="6" markerHeight="6" viewBox="0 0 24 24" refX="24" refY="12" orient="auto">
    <polygon points="6.6795,0 24,10 24,14 6.6795,24"/>
  </marker>
</defs>
<g class="edges">
]]):format(width, height, number_tostring(height / width), width, height, width, height))

for _, edge in ipairs(edges) do
  local buffer = {}
  for _, p in ipairs(edge) do
    if p.command == "M" then
      buffer[#buffer + 1] = ("M%s,%s"):format(number_tostring_unpack(p))
    elseif p.command == "V" then
      buffer[#buffer + 1] = ("V%s"):format(number_tostring_unpack(p))
    elseif p.command == "C" then
      buffer[#buffer + 1] = ("C%s,%s %s,%s %s,%s"):format(number_tostring_unpack(p))
    end
  end
  handle:write('<path d="', table.concat(buffer, " "), '"/>\n')
end

handle:write [[
</g>
<g class="nodes">
]]

for _, node in ipairs(nodes) do
  local t, pid = assert(node.title:match "^([cpf])(%d+)$")
  if node.shape == "circle" then
    handle:write(('<circle data-type="%s" data-pid="%d" cx="%s" cy="%s" r="%s"/>\n'):format(t, pid, number_tostring_unpack{ node.cx, node.cy, node.r }))
  elseif node.shape == "rect" then
    handle:write(('<rect data-type="%s" data-pid="%d" x="%s" y="%s" width="%s" height="%s"/>\n'):format(t, pid, number_tostring_unpack{ node.x, node.y, node.width, node.height }))
  else
    assert(node.shape == "polygon")
    local buffer = {}
    for _, p in ipairs(node.points) do
      buffer[#buffer + 1] = ("%s,%s"):format(number_tostring_unpack{ p.x, p.y })
    end
    handle:write(('<polygon data-type="%s" data-pid="%d" points="%s"/>\n'):format(t, pid, table.concat(buffer, " ")))
  end
end

handle:write [[
</g>
</svg>
]]
