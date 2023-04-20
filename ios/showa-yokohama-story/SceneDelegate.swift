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
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene, willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let _ = (scene as? UIWindowScene) else { return }
  }

  func sceneDidDisconnect(_ scene: UIScene) {
    print("\(#function)")
  }

  func sceneDidBecomeActive(_ scene: UIScene) {
    print("\(#function)")
    requestTrackingAuthorization()
  }

  func sceneWillResignActive(_ scene: UIScene) {
    print("\(#function)")
  }

  func sceneWillEnterForeground(_ scene: UIScene) {
    print("\(#function)")
  }

  func sceneDidEnterBackground(_ scene: UIScene) {
    print("\(#function)")
  }

  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    print("\(#function) \(URLContexts.first?.url)")
  }
}

extension SceneDelegate {
  func requestTrackingAuthorization() {
    guard ATTrackingManager.trackingAuthorizationStatus == .notDetermined else { return }
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      ATTrackingManager.requestTrackingAuthorization { status in
        print("\(#function) \(ATTrackingManager.trackingAuthorizationStatus) \(status)")
        guard status != .notDetermined else { return }
        NotificationCenter.default.post(name: .demeterAuthorizationTrackingDetermined, object: nil)
      }
    }
  }
}

extension Notification.Name {
  static let demeterAuthorizationTrackingDetermined = Notification.Name(
    "demeterAuthorizationTrackingDetermined")
}
