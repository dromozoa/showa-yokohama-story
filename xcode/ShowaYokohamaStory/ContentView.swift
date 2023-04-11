// Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
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

import SwiftUI
import WebKit

#if os(iOS)
  typealias WebViewRepresentable = UIViewRepresentable
#elseif os(macOS)
  typealias WebViewRepresentable = NSViewRepresentable
#endif

struct WebView: WebViewRepresentable {
  #if os(iOS)
    func makeUIView(context: Context) -> WKWebView {
      return makeView(context: context)
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
      return updateView(uiView, context: context)
    }
  #elseif os(macOS)
    func makeNSView(context: Context) -> WKWebView {
      return makeView(context: context)
    }

    func updateNSView(_ uiView: WKWebView, context: Context) {
      return updateView(uiView, context: context)
    }
  #endif
}

extension WebView {
  func makeView(context: Context) -> WKWebView {
    return WKWebView()
  }

  func updateView(_ uiView: WKWebView, context: Context) {
  }
}

struct ContentView: View {
  var body: some View {
    VStack {
      Image(systemName: "globe")
        .imageScale(.large)
        .foregroundColor(.accentColor)
      Text("Hello, world!")
    }
    .padding()
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
