# ⚡ QUICK REFERENCE CARD

## 🚀 IN 5 COMMANDS

```bash
# 1. Navigate to project
cd d:\quizz

# 2. Test web version
python -m http.server 8000
# Then visit: http://localhost:8000

# 3. Install dependencies
npm install

# 4. Initialize Capacitor
npx cap init quiz-app com.example.quizapp

# 5. Build APK
npx cap add android
npx cap async android
npm run build
```

Then open in Android Studio and build APK from menu.

---

## 📁 IMPORTANT FILES

| File | Location | What To Do |
|------|----------|-----------|
| **index.html** | `d:\quizz\index.html` | Your quiz app (already created) |
| **MainActivity.java** | `android/app/src/main/java/com/example/quizapp/MainActivity.java` | Copy code from `d:\quizz\MainActivity.java` |
| **AndroidManifest.xml** | `android/app/src/main/AndroidManifest.xml` | Add `android:resizeableActivity="false"` |
| **capacitor.config.json** | `d:\quizz\capacitor.config.json` | Already created |
| **package.json** | `d:\quizz\package.json` | Already created |

---

## 🔒 SECURITY FEATURES CHECKLIST

### Web Version:
- [x] Right-click disabled
- [x] Text selection disabled
- [x] Copy/Paste disabled  
- [x] Tab switch detection (warning + auto-submit)
- [x] Fullscreen on start

### Android Version:
- [x] Screenshots blocked (FLAG_SECURE)
- [x] Screen recording blocked (FLAG_SECURE)
- [x] Split-screen disabled
- [x] App switch detected (onPause auto-submit)
- [x] Java ↔ JavaScript bridge

---

## 🔄 FULL STEP CHECKLIST

- [ ] **Step 0:** Test web version works
- [ ] **Step 1:** Install Node.js
- [ ] **Step 2:** Install Java JDK
- [ ] **Step 3:** Install Android Studio
- [ ] **Step 4:** Set environment variables (JAVA_HOME, ANDROID_SDK_ROOT)
- [ ] **Step 5:** Restart computer
- [ ] **Step 6:** `cd d:\quizz`
- [ ] **Step 7:** `npm init -y`
- [ ] **Step 8:** `npm install @capacitor/core @capacitor/cli`
- [ ] **Step 9:** `npx cap init quiz-app com.example.quizapp`
- [ ] **Step 10:** `npm install @capacitor/android`
- [ ] **Step 11:** `npx cap add android`
- [ ] **Step 12:** Open Android Studio
- [ ] **Step 13:** Open `d:\quizz\android` folder
- [ ] **Step 14:** Wait for Gradle sync
- [ ] **Step 15:** Edit MainActivity.java
- [ ] **Step 16:** Edit AndroidManifest.xml
- [ ] **Step 17:** Click Build → Build APK(s)
- [ ] **Step 18:** Wait for build to complete
- [ ] **Step 19:** Connect phone or start emulator
- [ ] **Step 20:** Run APK
- [ ] **Step 21:** Test all features

---

## 💡 COMMON MISTAKES TO AVOID

❌ **Don't:** Forget to restart computer after installing Node.js/Java
✅ **Do:** Restart after installing runtimes

❌ **Don't:** Use different package names (com.example.quizapp is important)
✅ **Do:** Always use `com.example.quizapp`

❌ **Don't:** Skip editing MainActivity.java
✅ **Do:** Copy-paste the entire MainActivity.java code

❌ **Don't:** Forget to add `android:resizeableActivity="false"` in AndroidManifest.xml
✅ **Do:** Add it in the <activity> tag

❌ **Don't:** Build APK without running `npx cap sync android`
✅ **Do:** Always sync before building

---

## 📞 FILE LOCATIONS FOR COPY-PASTE

### To find MainActivity.java in Android Studio:
```
Left Sidebar → 
  android → 
    app → 
      src → 
        main → 
          java → 
            com → 
              example → 
                quizapp → 
                  MainActivity ← Right-click → Open
```

### To find AndroidManifest.xml in Android Studio:
```
Left Sidebar → 
  android → 
    app → 
      src → 
        main → 
          AndroidManifest.xml ← Double-click
```

### Generated APK location:
```
d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🧪 TESTING EACH FEATURE

| Feature | How to Test |
|---------|------------|
| **Right-click blocked** | Right-click in quiz screen - nothing happens |
| **Text selection blocked** | Try to select quiz text - won't work |
| **Timer works** | Watch 60 second countdown at top |
| **Answer selection** | Click option - should highlight |
| **Fullscreen** | Click START - should go fullscreen |
| **Tab switch (1st)** | Alt+Tab during quiz - warning appears |
| **Tab switch (2nd)** | Alt+Tab again - quiz auto-submits |
| **Submit button** | Click SUBMIT - shows score |
| **Score calculation** | Verify correct answers ✓ |
| **Screenshots blocked** | Try screenshot - will be black/blocked |
| **Split screen** | Swipe down from top - can't split |
| **App switch (Android)** | Press HOME during quiz - auto-submits |

---

## 🎓 LEARNING OUTCOMES

After completing this project, you'll understand:

1. **Frontend:** HTML, CSS, JavaScript interactivity
2. **Security:** Anti-cheating mechanisms
3. **Mobile Framework:** Capacitor as bridge
4. **Android:** Activity lifecycle, WebView, native code
5. **Build Process:** Gradle, APK generation
6. **Debugging:** Logcat in Android Studio

---

## 📚 NEXT STEPS (OPTIONAL)

After getting APK working:

1. **Customize Quiz:** Change questions in `index.html`
2. **Change Colors:** Modify CSS in `index.html`
3. **Add Features:** Add more security (biometric unlock, etc.)
4. **Release APK:** Sign APK with certificate for Google Play
5. **Bug Fixes:** Use Logcat in Android Studio to debug

