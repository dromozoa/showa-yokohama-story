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

import GoogleMobileAds
import UIKit

class ViewController: UIViewController {
  @IBOutlet weak var webView: WKWebView!
  @IBOutlet weak var bannerView: GADBannerView!

  override func viewDidLoad() {
    super.viewDidLoad()

    if let adUnitId = Bundle.main.infoDictionary?["GADBannerUnitIdentifier"] as? String {
      bannerView.adUnitID = adUnitId
    }
    bannerView.rootViewController = self

    webView.configuration.setURLSchemeHandler(self, forURLScheme: "demeter")

    // let  configuration = webView.configuration
    // これは使っちゃいけないAPI
    // configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

    webView.uiDelegate = self

    loadGame()
  }

  override func viewDidAppear(_ animated: Bool) {
    loadBanner()
  }

  override func viewWillTransition(
    to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator
  ) {
    super.viewWillTransition(to: size, with: coordinator)
    coordinator.animate { _ in self.loadBanner() }
  }
}

extension ViewController {
  func loadGame() {
    if let url = Bundle.main.url(forResource: "sys/game", withExtension: "html") {
      webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }
  }

  func loadBanner() {
    let frame = view.frame.inset(by: view.safeAreaInsets)
    bannerView.adSize = GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(frame.width)

    let request = GADRequest()
    request.scene = bannerView.window?.windowScene
    bannerView.load(request)
  }
}

extension ViewController: WKUIDelegate {
  func webView(
    _ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
    for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures
  ) -> WKWebView? {
    if navigationAction.targetFrame == nil,
      let url = navigationAction.request.url
    {
      UIApplication.shared.open(url)
    }
    return nil
  }
}

extension ViewController: WKURLSchemeHandler {
  func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
    // demeter:///sys/voice/X/ABCD.mp3
    if let url = urlSchemeTask.request.url {
      print("\(url)")

      if let response = HTTPURLResponse(
        url: url, statusCode: 404, httpVersion: nil, headerFields: nil)
      {
        urlSchemeTask.didReceive(response)
      }
    }
    urlSchemeTask.didFinish()
  }

  func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
    // https://developer.apple.com/documentation/webkit/wkurlschemehandler/2890835-webview
    // Don’t call any methods of the provided urlSchemeTask object to report your progress back to WebKit.
  }
}
