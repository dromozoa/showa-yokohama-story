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

package com.vaporoid.sys;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;

import org.json.JSONArray;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = MainActivity.class.getSimpleName();
    private static final String RESTORE_BACKUP_URL = "/demeterAndroid/demeterRestoreBackup.dat";
    private WebView webView;
    private AdView adView;
    private byte[] dumpBackupHeader;
    private String dumpBackupJson;
    private final ActivityResultLauncher<Intent> dumpBackupLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
        try {
            if (result.getResultCode() == Activity.RESULT_OK) {
                Intent data = result.getData();
                if (data != null) {
                    Uri uri = data.getData();
                    try (OutputStream stream = getContentResolver().openOutputStream(uri)) {
                        stream.write(dumpBackupHeader);
                        stream.write(dumpBackupJson.getBytes(StandardCharsets.UTF_8));
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, e);
        }
    });
    private ByteArrayOutputStream restoreBackupStream;
    private final ActivityResultLauncher<Intent> restoreBackupLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
        try {
            if (result.getResultCode() != Activity.RESULT_OK) {
                return;
            }
            Intent data = result.getData();
            if (data == null) {
                return;
            }
            Uri uri = data.getData();
            restoreBackupStream = new ByteArrayOutputStream();
            try (InputStream inputStream = getContentResolver().openInputStream(uri);
                 OutputStream outputStream = restoreBackupStream) {
                byte[] buffer = new byte[4096];
                while (true) {
                    int size = inputStream.read(buffer);
                    if (size == -1) {
                        break;
                    }
                    outputStream.write(buffer, 0, size);
                }
            }
            webView.evaluateJavascript("demeterRestoreBackup(\"" + RESTORE_BACKUP_URL + "\");", null);
        } catch (Exception e) {
            Log.w(TAG, e);
        }
    });

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        webView.setBackgroundColor(getColor(R.color.windowBackground));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        String ua = settings.getUserAgentString() + " showa-yokohama-story-android";
        String versionName = getVersionName();
        if (versionName != null) {
            ua += "/" + versionName;
        }
        settings.setUserAgentString(ua);

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder().addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (Objects.equals(uri.getPath(), RESTORE_BACKUP_URL)) {
                    if (restoreBackupStream != null) {
                        return new WebResourceResponse("application/octet-stream", null, 200, "OK", null, new ByteArrayInputStream(restoreBackupStream.toByteArray()));
                    } else {
                        return new WebResourceResponse("application/octet-stream", null, 404, "Not Found", null, null);
                    }
                } else {
                    return assetLoader.shouldInterceptRequest(request.getUrl());
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(@NonNull WebView view, @NonNull WebResourceRequest request) {
                Uri url = request.getUrl();
                Log.d(TAG, "shouldOverrideUrlLoading " + url);
                if (Objects.equals(url.getHost(), "appassets.androidplatform.net")) {
                    return false;
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(url);
                    if (Objects.equals(url.getHost(), "play.google.com")) {
                        intent.setPackage("com.android.vending");
                    }

                    try {
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        // Playストアのアプリが存在しない。
                        Log.w(TAG, e);
                    }

                    try {
                        if (intent.getPackage() != null) {
                            intent.setPackage(null);
                            startActivity(intent);
                        }
                    } catch (Exception e) {
                        Log.w(TAG, e);
                    }

                    return true;
                }
            }
        });

        webView.addJavascriptInterface(new JavascriptInterface(), "demeterAndroid");

        loadGame();

        MobileAds.initialize(this, initializationStatus -> {
        });

        adView = new AdView(this);
        adView.setAdUnitId(getString(R.string.GADBannerUnitIdentifier));
        FrameLayout frameLayout = findViewById(R.id.frameLayout);
        frameLayout.addView(adView);
        loadBanner();
    }

    private String getVersionName() {
        try {
            PackageManager packageManager = getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(getPackageName(), 0);
            return packageInfo.versionName;
        } catch (Exception e) {
            Log.w(TAG, e);
        }
        return null;
    }

    private void loadGame() {
        webView.loadUrl("https://appassets.androidplatform.net/assets/sys/game.html");
    }

    private void loadBanner() {
        Display display = getWindowManager().getDefaultDisplay();
        DisplayMetrics metrics = new DisplayMetrics();
        display.getMetrics(metrics);
        int width = (int) (metrics.widthPixels / metrics.density);
        adView.setAdSize(AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, width));

        AdRequest request = new AdRequest.Builder().build();
        adView.loadAd(request);
    }

    public class JavascriptInterface {
        @android.webkit.JavascriptInterface
        public void dumpBackup(String headerSource, String json) {
            try {
                JSONArray header = new JSONArray(headerSource);
                dumpBackupHeader = new byte[header.length()];
                for (int i = 0; i < header.length(); ++i) {
                    dumpBackupHeader[i] = (byte) header.getInt(i);
                }
                dumpBackupJson = json;

                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/octet-stream");
                intent.putExtra(Intent.EXTRA_TITLE, "昭和横濱物語バックアップ.dat");
                dumpBackupLauncher.launch(intent);
            } catch (Exception e) {
                Log.w(TAG, e);
            }
        }

        @android.webkit.JavascriptInterface
        public void restoreBackup() {
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/octet-stream");
            restoreBackupLauncher.launch(intent);
        }
    }
}
