# 🆘 TROUBLESHOOTING & FAQ

## ❓ FREQUENTLY ASKED QUESTIONS

### Q1: Do I need to buy anything?
**A:** No! Everything is FREE:
- Node.js - FREE
- Java JDK - FREE
- Android Studio - FREE
- Capacitor - FREE, open-source

---

### Q2: Can I test without Android phone?
**A:** Yes! Use **Android Emulator** built into Android Studio. It simulates a phone on your computer.

---

### Q3: Why do I need so many installations?
**A:** 
- **Node.js** = Run JavaScript outside browser
- **Java JDK** = Build Android apps
- **Android Studio** = IDE to write/build Android code
- **Capacitor** = Bridge web to native Android

---

### Q4: How long will setup take?
**A:** 
- First time: 1-2 hours (downloading + installing)
- After setup: 5-10 minutes to build APK

---

### Q5: Can I modify the quiz questions?
**A:** Yes! Edit `index.html` and change the `quizQuestions` array. Each question has:
```javascript
{
    question: "Your question here?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    correct: 2  // Index of correct answer (0, 1, 2, or 3)
}
```

---

### Q6: Can I change timer duration?
**A:** Yes! In `index.html`, find:
```javascript
let timeRemaining = 60;  // Change 60 to any seconds
```

---

### Q7: What if I want to use Capacitor 4 or 6?
**A:** Works fine! But update package versions in `package.json`:
```json
"@capacitor/core": "^6.0.0",
"@capacitor/android": "^6.0.0",
"@capacitor/cli": "^6.0.0"
```

---

### Q8: Can I share APK with friends?
**A:** Yes! Send the file at: `d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk`

They can install by:
1. Transferring file to Android phone
2. Opening file manager → tap APK file
3. Click "Install"

---

### Q9: Can I publish on Google Play?
**A:** Yes, but you need to:
1. Create certificate (signing key)
2. Sign APK with certificate
3. Create Google Play account ($25 one-time)
4. Submit APK for review

For now, just test locally!

---

### Q10: The quiz works on web but not on Android?
**A:** Check these:
1. Did you run `npx cap sync android`?
2. Did you edit MainActivity.java?
3. Did you build APK after changes?
4. Is Android SDK installed correctly?

---

## 🐛 TROUBLESHOOTING GUIDE

### Problem: "npm: command not found"

**Cause:** Node.js not installed or PATH not set
**Solution:**
1. Uninstall Node.js completely
2. Restart computer
3. Reinstall Node.js from https://nodejs.org/
4. **Restart computer again**
5. Open NEW command prompt and try: `npm --version`

---

### Problem: "java: command not found"

**Cause:** Java JDK not installed or PATH not set
**Solution:**
1. Check if Java is installed: Open Command Prompt and type `java -version`
2. If not installed: Download from https://www.oracle.com/java/technologies/downloads/
3. Install to default location
4. Set JAVA_HOME environment variable:
   - Windows: Right-click "This PC" → Properties → Advanced system settings
   - Click "Environment Variables"
   - Add new system variable:
     - Name: `JAVA_HOME`
     - Value: `C:\Program Files\Java\jdk-17` (adjust version)
5. Restart computer

---

### Problem: "Gradle sync failed"

**Cause:** Android SDK or Gradle not configured
**Solution:**
1. In Android Studio top menu: `File → Settings`
2. Go to: `Appearance & Behavior → System Settings → Android SDK`
3. Note the SDK Location
4. Click "SDK Tools" tab
5. Make sure these are checked:
   - Android SDK Build-Tools
   - Android Gradle Plugin
   - Google Play services
6. Click OK
7. Wait for sync to complete (5-10 minutes)
8. If still fails: `File → Invalidate Caches → Invalidate and Restart`

---

### Problem: "Cannot find app/src/main/java/..."

**Cause:** Wrong Android project opened
**Solution:**
1. Close Android Studio
2. Delete folder: `d:\quizz\android\`
3. Go back to `d:\quizz` in command prompt
4. Run: `npx cap add android` (recreates android folder)
5. Open Android Studio again
6. File → Open → Select `d:\quizz\android`

---

### Problem: "MainActivitynot found" in Android Studio

**Cause:** Capacitor added but project not synced
**Solution:**
1. File → Sync Now (wait for completion)
2. If still doesn't appear:
   - File → Invalidate Caches → Invalidate and Restart
   - Wait 5 minutes for rebuild

---

### Problem: "Cannot paste MainActivity.java code"

**Cause:** Wrong file location
**Solution:**
1. In Android Studio left sidebar, expand:
   ```
   android → app → src → main → java → com → example → quizapp
   ```
2. Look for **MainActivity** (not MainActivityKt)
3. Right-click → **Open in Editor**
4. Select ALL text (Ctrl+A)
5. Delete it
6. Paste new MainActivity.java code
7. Press **Ctrl+S** to save

---

### Problem: "APK build failed with errors"

**Cause:** Gradle compile error
**Solution:**
1. Check "Build" tab at bottom for error message
2. Common errors:
   - **"Cannot resolve symbol"** → Click "Sync Now"
   - **"Gradle version incompatible"** → Update Gradle
   - **"Java version mismatch"** → Use Java 17+

---

### Problem: "APK installed but won't launch"

**Cause:** index.html not included in APK
**Solution:**
1. Make sure `index.html` is in: `d:\quizz\index.html`
2. Run: `npx cap sync android`
3. Rebuild APK: `Build → Build APK(s)` in Android Studio

---

### Problem: "Timer shows 0 but quiz doesn't submit"

**Cause:** JavaScript function not called
**Solution:**
1. Check index.html has `submitQuiz()` function
2. Check MainActivity.java calls `evaluateJavascript()`
3. Check JavaScript is enabled in WebView:
   ```java
   webView.getSettings().setJavaScriptEnabled(true);
   ```

---

### Problem: "Can still take screenshots on Android"

**Cause:** FLAG_SECURE not set in MainActivity
**Solution:**
1. Check MainActivity.java has:
   ```java
   getWindow().setFlags(
       WindowManager.LayoutParams.FLAG_SECURE,
       WindowManager.LayoutParams.FLAG_SECURE
   );
   ```
2. Make sure it's in `onCreate()` method
3. Rebuild APK

---

### Problem: "Can split-screen the app"

**Cause:** `android:resizeableActivity="false"` not added
**Solution:**
1. Open AndroidManifest.xml
2. Find `<activity android:name=".MainActivity"...>`
3. Add: `android:resizeableActivity="false"`
4. The line should look like:
   ```xml
   <activity
       android:name=".MainActivity"
       android:label="@string/title_activity_main"
       android:launchMode="singleTask"
       android:theme="@style/AppTheme.NoActionBarLaunch"
       android:exported="true"
       android:resizeableActivity="false">
   ```

---

### Problem: "When I minimize app, quiz doesn't submit"

**Cause:** `onPause()` method not calling submitQuiz
**Solution:**
1. Check MainActivity.java `onPause()` method
2. Make sure it has:
   ```java
   webView.evaluateJavascript(
       "(function() { " +
       "  if (typeof submitQuiz === 'function') { " +
       "    submitQuiz(); " +
       "  } " +
       "})()",
       null
   );
   ```

---

### Problem: "Build takes too long"

**Cause:** First build is slower
**Solution:**
- First build: 5-10 minutes (normal)
- Subsequent builds: 1-2 minutes
- Gradle downloads dependencies on first build
- Be patient! ☕

---

### Problem: "Error: Could not find variable or function"

**Cause:** JavaScript syntax error
**Solution:**
1. Check index.html for syntax errors
2. Open browser console (F12) to see exact error
3. Common issues:
   - Missing closing brace `}`
   - Semicolon missing `;`
   - Typo in function name

---

## 🔍 HOW TO DEBUG

### Using Chrome DevTools (Web Version):

1. Open http://localhost:8000 in Chrome
2. Press **F12** to open developer tools
3. Go to **Console** tab
4. Try quiz and watch for errors
5. Click on error to see line number

### Using Android Logcat (Android Version):

1. In Android Studio bottom: **Logcat** tab
2. Device dropdown: Select your phone/emulator
3. Search box: Type "quiz" or "submitQuiz"
4. Watch logs as you use the app
5. Errors will show in **red text**

---

## ✅ VERIFIED WORKING CONFIGURATION

Tested and confirmed working:

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | 18+ or 20+ | ✅ Works |
| Java JDK | 17+ | ✅ Works |
| Android Studio | 2023.1+ | ✅ Works |
| Capacitor | 5.0+ | ✅ Works |
| Android API | 24+ (works on Android 7+) | ✅ Works |
| Windows | 10 / 11 | ✅ Works |

---

## 🚨 IF ALL ELSE FAILS

**Complete Fresh Start:**

```bash
# 1. Delete everything
cd d:\
rmdir /s quizz

# 2. Create fresh folder
mkdir quizz
cd quizz

# 3. Create new index.html (copy from this guide)
# 4. Create package.json (copy from SETUP_GUIDE.md)
# 5. Create capacitor.config.json (copy from SETUP_GUIDE.md)

# 6. Start from Step 3.2 in setup guide
npm init -y
npm install @capacitor/core @capacitor/cli
# ... continue setup
```

---

## 📞 IF YOU NEED HELP

1. **Check error message carefully** - read the full error text
2. **Google the error** - most errors have solutions online
3. **Check file locations** - make sure files are in right place
4. **Verify installations** - run version checks
5. **Try fresh start** - delete and recreate if very stuck

