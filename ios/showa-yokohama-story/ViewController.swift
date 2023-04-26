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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

import AppTrackingTransparency
import GoogleMobileAds
import UIKit

class ViewController: UIViewController {
  @IBOutlet weak var mainView: UIView!
  @IBOutlet weak var bannerView: GADBannerView!
  var webView: WKWebView!
  var waitForTrackingAuthorization: Bool = false
  var documentInteractionController: UIDocumentInteractionController?

  override func viewDidLoad() {
    super.viewDidLoad()
    NotificationCenter.default.addObserver(
      self, selector: #selector(authorizationTrackingDetermined),
      name: .demeterAuthorizationTrackingDetermined, object: nil)
    NotificationCenter.default.addObserver(
      self, selector: #selector(restoreBackup), name: .demeterRestoreBackup, object: nil)

    let configuration = WKWebViewConfiguration()

    let userContentController = WKUserContentController()
    userContentController.addScriptMessageHandler(
      self, contentWorld: .page, name: "demeterDumpBackup")
    configuration.userContentController = userContentController

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
      var resourceExtension: String = ""
      var url: URL?

      // リストア用のデータは特別扱いする
      // demeter:///demeterRestoreBackup.dat
      if requestPath == "/demeterRestoreBackup.dat" {
        resourceExtension = "dat"
        url = FileManager.default.temporaryDirectory.appendingPathComponent(
          "demeterRestoreBackup.dat")
      } else {
        resourceExtension = requestPath.pathExtension
        url = Bundle.main.url(
          forResource: "sys" + requestPath.deletingPathExtension, withExtension: resourceExtension)
      }

      if let url = url,
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

extension ViewController {
  func dumpBackup(_ bodySource: Any, replyHandler: @escaping (Any?, String?) -> Void) {
    guard let body = bodySource as? NSArray,
      body.count >= 2,
      let header = body[0] as? NSArray,
      let json = body[1] as? String,
      let jsonData = json.data(using: .utf8)
    else {
      replyHandler(nil, "invalid argument")
      return
    }

    var headerData: [UInt8] = []
    for itemSource in header {
      guard let item = itemSource as? NSNumber else {
        replyHandler(nil, "invalid argument")
        return
      }
      headerData.append(item.uint8Value)
    }

    var data = Data(headerData)
    data.append(jsonData)

    let url = FileManager.default.temporaryDirectory.appendingPathComponent("昭和横濱物語バックアップ.dat")
    do {
      try data.write(to: url, options: [.atomic])
    } catch {
      replyHandler(nil, "cannot write: \(error.localizedDescription)")
      return
    }

    documentInteractionController = UIDocumentInteractionController(url: url)
    let result = documentInteractionController!.presentOpenInMenu(
      from: view.frame, in: view, animated: true)
    replyHandler(result, nil)
  }

  @objc
  func restoreBackup() {
    DispatchQueue.main.async {
      self.webView.evaluateJavaScript("demeterRestoreBackup(\"demeter:///demeterRestoreBackup.dat\");")
    }
  }
}

extension ViewController: WKScriptMessageHandlerWithReply {
  func userContentController(
    _ userContentController: WKUserContentController, didReceive message: WKScriptMessage,
    replyHandler: @escaping (Any?, String?) -> Void
  ) {
    switch message.name {
    case "demeterDumpBackup":
      dumpBackup(message.body, replyHandler: replyHandler)
    default:
      replyHandler(nil, "\(message.name) not found")
    }
  }
}
