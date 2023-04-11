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
  // let bannerView = GADBannerView()

  override func viewDidLoad() {
    super.viewDidLoad()

    // if let adUnitId = Bundle.main.infoDictionary?["GADBannerUnitIdentifier"] as? String {
    //   bannerView.adUnitID = adUnitId
    // }
    // bannerView.rootViewController = self

    // let request = URLRequest(url: URL(string: "https://vaporoid.com/sys/game.html")!)
    // webView.load(request)
    print("\(#function) \(view.safeAreaInsets)")
  }

  override func viewWillLayoutSubviews() {
    print("\(#function) \(view.safeAreaInsets)")
    // loadBanner()
  }

  override func viewDidLayoutSubviews() {
    print("\(#function) \(view.safeAreaInsets)")
  }

  override func viewDidAppear(_ animated: Bool) {
    print("\(#function) \(view.safeAreaInsets)")
  }

  func loadBanner() {
    // let frame = view.frame.inset(by: view.safeAreaInsets)
    // let width = frame.width
    // bannerView.adSize = GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(width)
    // print("\(#function) \(bannerView.adSize)")
  }
}
