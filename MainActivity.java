// 🔒 SECURE QUIZ APP - MAIN ACTIVITY
// File location: android/app/src/main/java/com/example/quizapp/MainActivity.java

package com.example.quizapp;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

/**
 * MainActivity.java
 * 
 * This file handles:
 * 1. Blocking screenshots & screen recording (FLAG_SECURE)
 * 2. Detecting when user minimizes/switches app (onPause)
 * 3. Communicating with JavaScript in WebView
 * 4. Disabling split-screen mode
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ============================================
        // SECURITY FEATURE 1: Block Screenshots
        // ============================================
        // FLAG_SECURE prevents users from taking screenshots
        // or recording the screen while app is open
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );

        // Note: Disable split-screen is handled
        // in AndroidManifest.xml with:
        // android:resizeableActivity="false"

        // Initialize WebView JavaScript bridge
        initializeWebViewBridge();

        // Force portrait mode (no rotation)
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    /**
     * Initialize WebView with JavaScript support
     * This allows Java code to call JavaScript functions
     */
    private void initializeWebViewBridge() {
        WebView webView = getBridge().getWebView();
        webView.getSettings().setJavaScriptEnabled(true);
    }

    /**
     * ============================================
     * SECURITY FEATURE 3: Detect App Switch
     * ============================================
     * 
     * Called when user:
     * - Presses Home button
     * - Switches to another app
     * - Minimizes the app
     * - Phone goes to lock screen
     * 
     * We call submitQuiz() to auto-submit the quiz
     */
    @Override
    protected void onPause() {
        super.onPause();

        WebView webView = getBridge().getWebView();
        
        // Execute JavaScript submitQuiz() function
        // This will submit the quiz immediately
        webView.evaluateJavascript(
            "(function() { " +
            "  if (typeof submitQuiz === 'function') { " +
            "    console.log('[Android] App paused - auto-submitting quiz'); " +
            "    submitQuiz(); " +
            "  } " +
            "})()",
            null
        );
    }

    /**
     * Called when app comes back to foreground
     */
    @Override
    protected void onResume() {
        super.onResume();
        // App is back in foreground
        // User can continue quiz only if reload
    }
}
