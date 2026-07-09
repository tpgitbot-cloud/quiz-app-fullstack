# ✅ PRINTABLE SETUP CHECKLIST

## 🎯 GOAL: Build secure quiz app from zero to working APK

---

## 📋 PRE-SETUP CHECKLIST

Before you start, verify you have:

- [ ] Windows 10 or Windows 11 (64-bit)
- [ ] Administrator access
- [ ] At least 20 GB free disk space
- [ ] Working internet connection
- [ ] An hour of free time
- [ ] Patience! 😊

---

## 🚀 PHASE 1: READ & TEST WEB (5-10 minutes)

### Documentation Reading
- [ ] Read PROJECT_START.md (this gives overview)
- [ ] Read README.md (understand the project)
- [ ] Skim SETUP_GUIDE.md (know what's coming)

### Test Web Version
- [ ] Open command prompt: Press Windows + R, type `cmd`
- [ ] Type: `cd d:\quizz`
- [ ] Type: `python -m http.server 8000`
- [ ] Open browser and visit: `http://localhost:8000`
- [ ] Test the quiz:
  - [ ] Enter student name
  - [ ] Click "START QUIZ"
  - [ ] Select answers
  - [ ] Click "NEXT"
  - [ ] Try right-clicking (should be blocked!)
  - [ ] Try selecting text (should fail!)
  - [ ] Complete quiz
  - [ ] See score and correct answers
  - [ ] Click "RESTART QUIZ"

---

## 🛠️ PHASE 2: INSTALL SOFTWARE (30-40 minutes)

### Step 1: Install Node.js

- [ ] Visit: https://nodejs.org/
- [ ] Click "LTS" button
- [ ] Download for Windows (64-bit)
- [ ] Run installer
- [ ] Click NEXT on all screens
- [ ] Click INSTALL
- [ ] Wait for installation (~2 minutes)
- [ ] Click FINISH
- [ ] **RESTART YOUR COMPUTER** ⚠️
- [ ] After restart, open command prompt
- [ ] Type: `node --version` (should show v18+)
- [ ] Type: `npm --version` (should show 9+)

### Step 2: Install Java JDK

- [ ] Visit: https://www.oracle.com/java/technologies/downloads/
- [ ] Download "JDK 17" (Windows x64)
- [ ] Run installer
- [ ] Click NEXT on all screens
- [ ] Click INSTALL
- [ ] Wait for installation (~3 minutes)
- [ ] Click FINISH
- [ ] Open command prompt
- [ ] Type: `java -version` (should show 17.x.x)

### Step 3: Set Environment Variables

- [ ] Press `Windows Key + R`
- [ ] Type: `sysdm.cpl`
- [ ] Click "Advanced" tab
- [ ] Click "Environment Variables" button
- [ ] Click "New" (under System variables)
- [ ] Variable name: `JAVA_HOME`
- [ ] Variable value: `C:\Program Files\Java\jdk-17`
- [ ] Click OK → OK
- [ ] Click "New" again
- [ ] Variable name: `ANDROID_SDK_ROOT`
- [ ] Variable value: `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
- [ ] Click OK → OK
- [ ] **RESTART YOUR COMPUTER** ⚠️

### Step 4: Install Android Studio

- [ ] Visit: https://developer.android.com/studio
- [ ] Click "Download Android Studio"
- [ ] Run installer
- [ ] Click NEXT → INSTALL
- [ ] Wait for installation (~5-10 minutes)
- [ ] Click FINISH
- [ ] Android Studio will open
- [ ] Complete the Setup Wizard (click NEXT)
- [ ] Wait for Android SDK installation (~3-5 minutes)
- [ ] Close Android Studio (for now)

---

## ⚙️ PHASE 3: CAPACITOR SETUP (15 minutes)

### Initialize Capacitor Project

- [ ] Open command prompt
- [ ] Type: `cd d:\quizz`
- [ ] Type: `npm init -y`
- [ ] Type: `npm install @capacitor/core @capacitor/cli`
- [ ] Wait for installation (~2-3 minutes)
- [ ] Type: `npx cap init quiz-app com.example.quizapp`
- [ ] When asked app name: `quiz-app`
- [ ] When asked package ID: `com.example.quizapp`
- [ ] When asked web dir: press ENTER (use default `.`)
- [ ] When asked iOS: `n`
- [ ] When asked Android: `y`

### Install Android Platform

- [ ] Type: `npm install @capacitor/android`
- [ ] Type: `npx cap add android`
- [ ] Wait for project generation (~2-3 minutes)
- [ ] Verify `android/` folder created in `d:\quizz\`

---

## 🤖 PHASE 4: ANDROID STUDIO EDITS (15-20 minutes)

### Open Android Project

- [ ] Open Android Studio
- [ ] Click "Open"
- [ ] Navigate to: `d:\quizz\android`
- [ ] Click OK
- [ ] Wait for Gradle sync (bottom left shows progress)
- [ ] This takes 5-10 minutes ⏳
- [ ] When done, you should see folder tree on left

### Edit MainActivity.java

- [ ] In left sidebar, expand:
  - [ ] `android` → `app` → `src` → `main` → `java` → `com` → `example` → `quizapp`
- [ ] Right-click `MainActivity`
- [ ] Click "Open"
- [ ] Select all code: `Ctrl + A`
- [ ] Delete all: `Delete`
- [ ] Open file: `d:\quizz\MainActivity.java` in text editor
- [ ] Copy entire content: `Ctrl + A` then `Ctrl + C`
- [ ] Return to Android Studio
- [ ] Paste code: `Ctrl + V`
- [ ] Save file: `Ctrl + S`

### Edit AndroidManifest.xml

- [ ] In left sidebar, find: `android` → `app` → `src` → `main` → `AndroidManifest.xml`
- [ ] Double-click it
- [ ] Find (Ctrl + F): `android:name=".MainActivity"`
- [ ] Locate this line: `android:exported="true">`
- [ ] Add new attribute before the `>`:
  - [ ] Type: `android:resizeableActivity="false"`
- [ ] Result should look like:
  ```xml
  android:exported="true"
  android:resizeableActivity="false">
  ```
- [ ] Save file: `Ctrl + S`

---

## 🏗️ PHASE 5: BUILD APK (10-15 minutes)

### Prepare for Build

- [ ] Go back to command prompt (in `d:\quizz`)
- [ ] Type: `npx cap sync android`
- [ ] Wait for sync to complete (~2 minutes)

### Build APK

- [ ] In Android Studio, go to menu: `Build`
- [ ] Click: `Build APK(s)`
- [ ] Watch the progress (takes 2-5 minutes)
- [ ] Wait for message: **"APK(s) generated successfully"**
- [ ] Verify file exists: `d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk`

---

## 📱 PHASE 6: DEPLOY & TEST (15-20 minutes)

### Option A: Android Emulator (Simulated Phone)

- [ ] In Android Studio, click "Device Manager"
- [ ] Click play ▶️ next to a device
- [ ] Wait 1-2 minutes for emulator to start
- [ ] In Android Studio, click `Run` button (green ▶️)
- [ ] Select your emulator
- [ ] Click OK
- [ ] Wait for APK to install and launch (1-2 minutes)
- [ ] Test the app on emulator (see testing checklist below)

### Option B: Real Android Phone

**First time setup:**
- [ ] On phone, open Settings → About Phone
- [ ] Scroll to "Build Number"
- [ ] Tap "Build Number" 7 times rapidly
- [ ] Go back to Settings → Developer Options
- [ ] Toggle "USB Debugging" ON

**Install APK:**
- [ ] Connect phone to computer with USB cable
- [ ] On phone, approve USB Debugging
- [ ] In Android Studio, click `Run` button
- [ ] Select your phone from list
- [ ] Click OK
- [ ] Wait for installation and launch (~1-2 minutes)
- [ ] Test the app on device (see testing checklist below)

---

## 🧪 PHASE 7: TEST ALL FEATURES (10 minutes)

### Basic Quiz Features

- [ ] App opens and shows name input
- [ ] Enter student name
- [ ] Click "START QUIZ"
- [ ] First question displays
- [ ] 4 options visible
- [ ] Timer shows and counts down
- [ ] Can click option (highlights)
- [ ] Can click "Next button
- [ ] See second question
- [ ] Can change answers
- [ ] All 5 questions work
- [ ] Last question shows "SUBMIT QUIZ"
- [ ] Click submit
- [ ] Score displays correctly
- [ ] Shows "✓ Correct" or "✗ Wrong" for each
- [ ] Can restart quiz
- [ ] Back to name input
- [ ] Quiz works again

### Security Features - Web

- [ ] Right-click in quiz area → nothing happens (no menu)
- [ ] Try to select quiz text → can't select it
- [ ] Try Ctrl+C to copy → doesn't work
- [ ] Try Ctrl+V to paste → doesn't work

### Security Features - Android

- [ ] Try to take screenshot during quiz:
  - [ ] Screenshot button → blocked (black/gray)
  - [ ] Try again outside quiz → works fine
- [ ] Press HOME button during quiz:
  - [ ] Quiz should auto-submit immediately
  - [ ] Results should display
- [ ] Try to split-screen:
  - [ ] Swipe down from top edge → can't split

### Timer Features

- [ ] Timer starts at 60 seconds
- [ ] Counts down each second
- [ ] When reaches 20 seconds → color changes to orange
- [ ] When reaches 10 seconds → color changes to red and pulses
- [ ] When reaches 0 → quiz auto-submits

---

## ✨ FINAL VERIFICATION

After testing, you should have:

- [ ] ✅ Web version works perfectly
- [ ] ✅ APK built successfully
- [ ] ✅ APK installed on device
- [ ] ✅ Quiz works on device
- [ ] ✅ Timer counts down
- [ ] ✅ Score calculated correctly
- [ ] ✅ Screenshots blocked (Android)
- [ ] ✅ Split-screen disabled (Android)
- [ ] ✅ Auto-submit on minimize (Android)
- [ ] ✅ All tests passed!

---

## 🎉 MILESTONE REACHED!

**Your quiz app is complete!**

You have successfully:
1. ✅ Built a web application
2. ✅ Converted to Android APK
3. ✅ Added security features
4. ✅ Deployed on device
5. ✅ Tested everything

---

## 📚 AFTER SUCCESS

Now that your APK works:

### Share Your APK
- [ ] Send file to friends:
  - [ ] Location: `d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk`
  - [ ] They can install on their phones!

### Customize Quiz
- [ ] Edit questions in index.html
- [ ] Change colors in CSS
- [ ] Modify timer duration
- [ ] Add more features

### Next Build
- [ ] Edit `index.html`
- [ ] Run: `npx cap sync android`
- [ ] In Android Studio: `Build → Build APK(s)`
- [ ] (Much faster second time: ~2-3 minutes)

---

## 🆘 TROUBLESHOOTING QUICK LINKS

If something fails, check:

| Error | Solution |
|-------|----------|
| npm not found | Restart computer after Node.js install |
| Gradle sync failed | Click File → Sync Now → wait 10 min |
| Can't find MainActivity.java | Expand all folder arrows (▶️) |
| Build failed | Check error message, Google it |
| APK won't install | Uninstall old version first, check space |
| Timer doesn't work | Check index.html has submitQuiz() function |

Full troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📞 NEED HELP?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Re-read the specific step carefully
3. Try fresh start: Delete `android/` and run `npx cap add android`
4. Google the error message with `[android]` tag

---

## 🎓 LEARNING SUMMARY

You've learned:

✅ HTML, CSS, JavaScript development
✅ Building web applications
✅ Capacitor mobile framework
✅ Android Studio basics
✅ Java and Android development
✅ Security implementation
✅ APK building and deployment
✅ Full-stack development workflow

**You're now a mobile developer!** 👨‍💻

---

## 🏁 FINAL WORDS

- **Take your time** - Don't rush
- **Follow steps exactly** - Don't skip
- **Restart when told** - It matters
- **Google errors** - Most have solutions
- **Celebrate milestones** - You're doing great!

---

```
📋 CHECKLIST: START HERE
✅ Read documentation
✅ Test web version
✅ Install software
✅ Setup Capacitor
✅ Edit Android files
✅ Build APK
✅ Deploy & test
✅ Verify all features
🎉 SUCCESS!
```

---

**Printed on:** ________________

**Completed on:** ________________

---

**Good luck! 🚀 You've got this! 🎉**

