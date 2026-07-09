# 🎯 COMPLETE SETUP GUIDE: QUIZ APP TO ANDROID APK

## 📋 TABLE OF CONTENTS
1. Test Web Version First
2. Install Required Programs
3. Capacitor Setup
4. Android Studio Configuration
5. Build APK
6. Deploy & Test

---

## ✅ STEP 1: TEST WEB VERSION FIRST

Before converting to Android, test the web app locally.

### Windows Users:

**Option A: Using Python (Recommended for Beginners)**
```
cd d:\quizz
python -m http.server 8000
```

Then open: `http://localhost:8000`

**Option B: Using Node.js**
```
npm install -g http-server
cd d:\quizz
http-server
```

**What to Test:**
- ✅ Enter your name
- ✅ Click START QUIZ
- ✅ Select answers for all questions
- ✅ Timer counts down
- ✅ Click SUBMIT
- ✅ See score and correct answers
- ✅ Right-click disabled (try right-clicking)
- ✅ Text selection disabled (try selecting text)
- ✅ Fullscreen activated

---

## 🛠️ STEP 2: INSTALL REQUIRED PROGRAMS

### 2.1 Install Node.js
1. Visit: https://nodejs.org/
2. Click "LTS" button (Long Term Support)
3. Download and install
4. **RESTART YOUR COMPUTER** after installation
5. Verify installation:
   ```
   node --version
   npm --version
   ```

### 2.2 Install Java Development Kit (JDK)
1. Visit: https://www.oracle.com/java/technologies/downloads/
2. Download "JDK 17" (Windows x64)
3. Install with default settings
4. Verify installation:
   ```
   java -version
   ```

### 2.3 Install Android Studio
1. Visit: https://developer.android.com/studio
2. Download Android Studio
3. Run installer, click NEXT on all screens
4. When asked to install "Android SDK", click YES
5. Installation takes 5-10 minutes
6. On first launch, complete setup wizard

### 2.4 Set Environment Variables (Windows)
This is CRITICAL for Android development!

**For Java:**
1. Press `Windows Key + R`
2. Type: `sysdm.cpl`
3. Go to "Advanced" tab → "Environment Variables"
4. Click "New" under "System variables"
5. Variable name: `JAVA_HOME`
6. Variable value: `C:\Program Files\Java\jdk-17` (adjust version number)
7. Click OK

**For Android SDK:**
1. Open Environment Variables again (same as above)
2. Click "New"
3. Variable name: `ANDROID_SDK_ROOT`
4. Variable value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
5. Click OK
6. **RESTART YOUR COMPUTER**

---

## ⚡ STEP 3: CAPACITOR SETUP

### 3.1 Open Terminal/Command Prompt
```
cd d:\quizz
```

### 3.2 Initialize Node Project
```
npm init -y
```

### 3.3 Install Capacitor
```
npm install @capacitor/core @capacitor/cli
```

### 3.4 Initialize Capacitor Project
```
npx cap init quiz-app com.example.quizapp
```

When asked:
- **App name?** → `quiz-app`
- **Package ID?** → `com.example.quizapp`
- **Web dir?** → `.` (just press Enter)
- **iOS?** → `n` (no)
- **Android?** → `y` (yes)

### 3.5 Install Android Platform
```
npm install @capacitor/android
npx cap add android
```

This creates a folder: `d:\quizz\android\`

---

## 🤖 STEP 4: ANDROID STUDIO CONFIGURATION

### 4.1 Open Android Project in Android Studio
1. Open Android Studio
2. Click "Open"
3. Navigate to: `d:\quizz\android`
4. Click "OK"
5. Wait for Gradle to sync (5-10 minutes)
6. If asked to update Gradle, click "Update"

### 4.2 Locate MainActivity.java File
In Android Studio on the left sidebar:
```
android → app → src → main → java → com → example → quizapp → MainActivity
```

**Right-click → Open** to edit

### 4.3 REPLACE MainActivity.java Code
Delete ALL content in MainActivity.java and paste this:

```java
package com.example.quizapp;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 🔒 SECURITY FEATURE 1: Block Screenshots & Screen Recording
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );

        // 🔒 SECURITY FEATURE 2: Disable Split Screen
        // (Handled in AndroidManifest.xml)

        // Initialize WebView bridge for JavaScript communication
        initializeWebViewBridge();

        // Set portrait orientation only
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    }

    private void initializeWebViewBridge() {
        // Get WebView from Capacitor
        WebView webView = getBridge().getWebView();
        
        // JavaScript can now call Android methods
        webView.getSettings().setJavaScriptEnabled(true);
    }

    @Override
    protected void onPause() {
        super.onPause();

        // 🔒 SECURITY FEATURE 3: Detect App Switch/Minimize
        // Call JavaScript submitQuiz() function
        WebView webView = getBridge().getWebView();
        
        // Execute JavaScript to submit quiz when user leaves app
        webView.evaluateJavascript(
            "(function() { " +
            "  if (typeof submitQuiz === 'function') { " +
            "    submitQuiz(); " +
            "  } " +
            "})()",
            null
        );
    }
}
```

**WHERE TO PASTE:** Remove all existing content and paste the above code.

### 4.4 Open AndroidManifest.xml
In Android Studio, left sidebar:
```
android → app → src → main → AndroidManifest.xml
```

### 4.5 EDIT AndroidManifest.xml
Find the `<activity>` tag and modify it. Change this part:

**FIND THIS:**
```xml
<activity
    android:name=".MainActivity"
    android:label="@string/title_activity_main"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:exported="true">
```

**REPLACE WITH THIS:**
```xml
<activity
    android:name=".MainActivity"
    android:label="@string/title_activity_main"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:exported="true"
    android:resizeableActivity="false">
```

**EXPLANATION:** The `android:resizeableActivity="false"` disables split-screen mode.

---

## 🏗️ STEP 5: BUILD APK

### 5.1 Sync Project
In Android Studio menu: `File → Sync Now` (wait for completion)

### 5.2 Connect to Capacitor
Go back to Command Prompt (in `d:\quizz` folder):

```
npx cap update
npx cap sync android
```

### 5.3 Build APK
In Android Studio:
1. Click on menu: `Build`
2. Select: `Build Bundle(s) / APK(s)`
3. Click: `Build APK(s)`

**Wait 2-5 minutes...**

### 5.4 Locate Generated APK
When build completes, you'll see a message like:
```
APK(s) generated successfully
```

The APK is located at:
```
d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 STEP 6: DEPLOY & TEST ON ANDROID DEVICE

### Option A: Install on Real Phone (Recommended)

**Requirements:**
- Android phone (any Android version)
- USB cable
- USB drivers (install from Android Studio)

**Steps:**
1. Connect phone via USB
2. In phone's Developer Settings:
   - Enable "USB Debugging"
3. In Android Studio, click phone icon at bottom
4. Click `Run` → Select your phone
5. APK installs automatically
6. Open "quiz-app" on your phone
7. Test all features!

### Option B: Use Android Emulator

**In Android Studio:**
1. Click `Device Manager` (left sidebar)
2. Click `Create Device`
3. Select "Pixel 5" → `Next` → `Next` → `Finish`
4. Click the play ▶️ button to start emulator
5. Click `Run` button in Android Studio
6. Select emulator
7. App installs and opens

---

## ✅ TEST CHECKLIST

After installation on Android phone/emulator, verify:

- [ ] App launches and shows student name input
- [ ] Timer starts when you click START
- [ ] Timer counts down visible at top
- [ ] Can select answers for questions
- [ ] Can't take screenshots (try taking one - will be black)
- [ ] Can't split-screen (try gesture)
- [ ] When timer reaches 0, auto-submits
- [ ] Shows final score and correct answers
- [ ] Can restart quiz
- [ ] If you press home button during quiz and come back, quiz submits

---

## 🚀 OPTIONAL: Share Your APK

To share `app-debug.apk` with friends:
```
d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk
```

Just send this file. They can install it on their Android phone!

---

## ⚠️ TROUBLESHOOTING

### Problem: "Command not found: npm"
**Solution:** 
- Restart your computer after Node.js installation

### Problem: Gradle sync fails
**Solution:**
- In Android Studio: `File → Invalidate Caches → Invalidate and Restart`
- Wait 5 minutes for full sync

### Problem: "Cannot find SDK"
**Solution:**
- Check Android Studio: `File → Settings → Appearance & Behavior → System Settings → Android SDK`
- Verify SDK location is correct

### Problem: APK won't install on phone
**Solution:**
- Uninstall previous version first
- Check phone storage (may need space)
- Enable "Unknown Sources" in phone settings

### Problem: Timer not advancing
**Solution:**
- Make sure JavaScript is enabled in WebView
- Check MainActivity.java was pasted correctly

---

## 📚 PROJECT STRUCTURE

```
d:\quizz\
├── index.html          ← Your quiz web app
├── package.json        ← Node.js config
├── capacitor.config.json
├── node_modules\       ← Installed packages
└── android\            ← Android Project
    ├── app\
    │   ├── src\main\
    │   │   ├── AndroidManifest.xml  ← Modified
    │   │   └── java\...\MainActivity.java  ← Modified
    │   └── build\outputs\apk\debug\
    │       └── app-debug.apk  ← Your final APK!
    └── ...other files
```

---

## 🎓 WHAT YOU LEARNED

1. **Web Development:** HTML, CSS, JavaScript
2. **Mobile Framework:** Capacitor bridges web to native
3. **Android Security:** FLAG_SECURE, resizeableActivity
4. **Android Development:** MainActivity.java modifications
5. **App Lifecycle:** onPause() for app-switch detection
6. **JavaScript-Java Bridge:** evaluateJavascript communication

Congratulations! You've completed a full-stack secure application! 🎉

