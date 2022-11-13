// Copyright (C) 2022 Tomoyuki Fujimori <moyu@dromozoa.com>
//
// This file is part of 昭和横濱物語.
//
// 昭和横濱物語 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// 昭和横濱物語 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語.  If not, see <http://www.gnu.org/licenses/>.

#include <cmath>
#include <iostream>
#include <random>
#include <vector>

float fract(const float v) {
  return v - std::floor(v);
}

// https://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float noise1(const float x, const float y) {
  return fract(std::sin(x * 12.9898f + y * 78.233f) * 43758.5453f);
}

// https://marc-b-reynolds.github.io/math/2016/03/29/weyl_hash.html
float noise2(const float x, const float y) {
  static constexpr float W0 = 0.5545497f;
  static constexpr float W1 = 0.308517;
  const float u = x * fract(x * W0);
  const float v = y * fract(y * W1);
  return fract(u * v);
}

int main(int ac, char* av[]) {
  static constexpr int W = 1024;
  static constexpr int H = 1024;

  std::vector<int> count(256);

  std::cout
    << "P2\n"
    << W << " " << H << "\n"
    << "255\n";
  int i = 0;
  for (int y = 0; y < H; ++y) {
    for (int x = 0; x < W; ++x) {
      float v = noise1(x, y);
      // float v = noise2(x, y);
      // float v = noise2(x + 100000.0f, y + 100000.f);
      // float v = noise2(x + 0.000001f, y + 0.000001f);
      if (v < 0 || v > 1) {
        std::cerr << x << " " << v << " " << v << "\n";
        return 1;
      }

      unsigned int u = std::floor(v * 256.0f);
      if (u > 255) {
        u = 255;
      }
      ++count[u];
      std::cout << u << " ";
      ++i;
    }
    std::cout << "\n";
  }

  for (int i = 0; i < 256; ++i) {
    std::cerr << i << "\t" << count[i] << "\n";
  }

  return 0;
}
