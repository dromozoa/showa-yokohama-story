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

import AppTrackingTransparency
import GoogleMobileAds
import UIKit

class ViewController: UIViewController {
  @IBOutlet weak var mainView: UIView!
  @IBOutlet weak var bannerView: GADBannerView!
  var webView: WKWebView!
  var waitForTrackingAuthorization: Bool = false

  override func viewDidLoad() {
    super.viewDidLoad()
    NotificationCenter.default.addObserver(
      self, selector: #selector(authorizationTrackingDetermined),
      name: .demeterAuthorizationTrackingDetermined, object: nil)

    let configuration = WKWebViewConfiguration()

    // オーディオの自動再生を許可する。
    configuration.allowsInlineMediaPlayback = true
    configuration.mediaTypesRequiringUserActionForPlayback = [.video]

    if let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString")
      as? String
    {
      configuration.applicationNameForUserAgent = "showa-yokohama-story-ios/" + version
    } else {
      configuration.applicationNameForUserAgent = "showa-yokohama-story-ios"
    }
    configuration.setURLSchemeHandler(self, forURLScheme: "demeter")

    webView = WKWebView(frame: .zero, configuration: configuration)
    webView.isOpaque = false
    webView.backgroundColor = UIColor(red: 17 / 255, green: 17 / 255, blue: 17 / 255, alpha: 1)

    mainView.addSubview(webView)
    webView.translatesAutoresizingMaskIntoConstraints = false
    webView.topAnchor.constraint(equalTo: mainView.topAnchor, constant: 0).isActive = true
    webView.trailingAnchor.constraint(equalTo: mainView.trailingAnchor, constant: 0).isActive = true
    webView.bottomAnchor.constraint(equalTo: mainView.bottomAnchor, constant: 0).isActive = true
    webView.leadingAnchor.constraint(equalTo: mainView.leadingAnchor, constant: 0).isActive = true

    webView.uiDelegate = self

    loadGame()

    if let adUnitId = Bundle.main.object(forInfoDictionaryKey: "GADBannerUnitIdentifier") as? String
    {
      bannerView.adUnitID = adUnitId
    }
    bannerView.rootViewController = self
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

  @objc func authorizationTrackingDetermined() {
    if waitForTrackingAuthorization {
      waitForTrackingAuthorization = false
      DispatchQueue.main.async {
        self.loadBanner()
      }
    }
  }

  func loadBanner() {
    if ATTrackingManager.trackingAuthorizationStatus == .notDetermined {
      waitForTrackingAuthorization = true
      return
    }

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
    if let requestUrl = urlSchemeTask.request.url {
      let requestPath = requestUrl.path as NSString
      let resource = "sys" + requestPath.deletingPathExtension
      let resourceExtension = requestPath.pathExtension

      if let url = Bundle.main.url(forResource: resource, withExtension: resourceExtension),
        let data = try? Data(contentsOf: url)
      {
        var headerFields = [
          "Access-Control-Allow-Origin": "*",
          "Content-Length": String(data.count),
        ]

        switch resourceExtension {
        case "mp3":
          headerFields["Content-Type"] = "audio/mpeg"
        case "webm":
          headerFields["Content-Type"] = "video/webm"
        default:
          headerFields["Content-Type"] = "application/octet-stream"
        }

        if let response = HTTPURLResponse(
          url: requestUrl, statusCode: 200, httpVersion: nil, headerFields: headerFields)
        {
          urlSchemeTask.didReceive(response)
          urlSchemeTask.didReceive(data)
          urlSchemeTask.didFinish()
          return
        }
      }
    }

    if let requestUrl = urlSchemeTask.request.url,
      let response = HTTPURLResponse(
        url: requestUrl, statusCode: 404, httpVersion: nil,
        headerFields: ["Access-Control-Allow-Origin": "*"])
    {
      urlSchemeTask.didReceive(response)
    }
    urlSchemeTask.didFinish()
  }

  func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
    // https://developer.apple.com/documentation/webkit/wkurlschemehandler/2890835-webview
    // Don’t call any methods of the provided urlSchemeTask object to report your progress back to WebKit.
  }
}
