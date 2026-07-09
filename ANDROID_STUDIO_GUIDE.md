# 🤖 ANDROID STUDIO STEP-BY-STEP VISUAL GUIDE

## 📱 FOR COMPLETE BEGINNERS

This guide assumes you KNOW NOTHING about Android development!

---

## PART 1: OPEN ANDROID PROJECT IN ANDROID STUDIO

### Step 1️⃣: Launch Android Studio

1. Click Windows Start button
2. Type: `Android Studio`
3. Click the Android Studio icon
4. Wait for it to load (may take 30 seconds)

**Result:** You see a welcome screen

---

### Step 2️⃣: Open Project

On the welcome screen:
1. Click **"Open"** button (or File → Open)
2. Navigate to: `d:\quizz\android`
3. Click that folder
4. Click **"OK"** button

**Android Studio will:**
- Import the project
- Download Gradle (this is normal, might take 5-10 minutes)
- Show a folder structure on the left

---

### Step 3️⃣: Wait for Gradle Sync

After opening, you'll see at the bottom:
```
Gradle build is running...
```

👁️ **Look at bottom status bar** - it will say when done.

**If you see errors:**
- Don't worry yet!
- Click `File → Sync Now` button
- Wait another 5 minutes
- Errors should disappear

**If Gradle sync fails:**
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for "Gradle sync failed"

---

## PART 2: FIND AND EDIT MainActivity.java

### Step 4️⃣: Expand Folder Tree

In **left sidebar**, you'll see:

```
android (click the arrow ▶ to expand)
├── app (click ▶ to expand)
│   ├── manifests
│   ├── src (click ▶ to expand)
│   │   ├── main (click ▶)
│   │   │   └── java (click ▶)
│   │   │       └── com (click ▶)
│   │   │           └── example (click ▶)
│   │   │               └── quizapp (click ▶)
│   │   │                   └── MainActivity ← CLICK THIS!
│   │   └── ...other files
│   └── ...other folders
└── ...other folders
```

### Step 5️⃣: Open MainActivity.java

Right-click on **MainActivity** and select:
```
Open
```

Or just **double-click** MainActivity

**Result:** A code editor opens in the center of screen

---

### Step 6️⃣: Select ALL Code

In the MainActivity editor:

1. Press **Ctrl + A** (selects all code)
   - Or: Right-click → Select All
2. All text should be highlighted in blue

---

### Step 7️⃣: Delete Selected Code

1. Press **Delete** or **Backspace**
2. The editor is now empty
3. You should see a blank white editor area

---

### Step 8️⃣: Paste New Code

1. Copy the code from [d:\quizz\MainActivity.java](MainActivity.java)
   - Open file in text editor
   - Copy entire contents
2. In Android Studio, paste into the blank MainActivity editor:
   - Press **Ctrl + V**
   - Or right-click → Paste

**Result:** Your MainActivity.java now has:
- `onCreate()` method with FLAG_SECURE
- `onPause()` method with auto-submit logic
- All security features

---

### Step 9️⃣: Save the File

After pasting code:

1. Press **Ctrl + S** (save file)
2. Or go to `File → Save`
3. The file tab shows no asterisk (means saved)

**Result:** MainActivity.java updated with security code

---

## PART 3: EDIT AndroidManifest.xml

### Step 🔟: Find AndroidManifest.xml

In **left sidebar**, expand folders:

```
android → app → src → main → AndroidManifest.xml ← DOUBLE-CLICK THIS
```

**Result:** AndroidManifest.xml opens in center editor

---

### Step 1️⃣1️⃣: Find the Activity Tag

In the editor, search for:

Press **Ctrl + F** (find)

Type: `android:name=".MainActivity"`

Press **Enter**

**Android Studio will highlight** the matching text like:

```xml
<activity
    android:name=".MainActivity"
    android:label="@string/title_activity_main"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:exported="true">
```

---

### Step 1️⃣2️⃣: Add Attribute

After `android:exported="true"` and before the `>`, add:

```xml
android:resizeableActivity="false"
```

**BEFORE:**
```xml
android:exported="true">
```

**AFTER:**
```xml
android:exported="true"
android:resizeableActivity="false">
```

**Full result should look like:**
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

### Step 1️⃣3️⃣: Save AndroidManifest.xml

1. Press **Ctrl + S**
2. Or `File → Save`

**Result:** AndroidManifest.xml saved with split-screen disabled

---

## PART 4: BUILD APK

### Step 1️⃣4️⃣: Click Build Menu

At top of Android Studio, click:
```
Build
```

A dropdown menu appears:

```
Build
├── Rebuild Project
├── Build APK(s)   ← CLICK THIS
├── Build Bundle(s)/APK(s)
└── ...other options
```

Click: **Build APK(s)**

---

### Step 1️⃣5️⃣: Wait for Build

You'll see messages:

```
Gradle build in progress...
Building APK...
Assembling APK...
```

**This takes 2-5 minutes** (depending on computer speed)

⏳ **Be patient!** Don't close Android Studio!

Watch the **bottom progress bar** - it shows build status

---

### Step 1️⃣6️⃣: Build Completes

When done, you'll see:

```
Build APK(s)
APK(s) generated successfully. Locate APK(s)
```

Plus a notification at **bottom right**:

```
✅ Gradle build finished
```

---

## PART 5: FIND YOUR APK

### Step 1️⃣7️⃣: Locate APK File

When build finishes, the notification shows:

```
APK(s) generated successfully
```

Click on this notification or manually locate:

```
d:\quizz\android\app\build\outputs\apk\debug\app-debug.apk
```

**This is your app!** 

The file is about **10-15 MB** in size.

---

## PART 6: INSTALL ON PHONE/EMULATOR

### Option A: Android Emulator (Simulated Phone)

**1. Start Emulator:**

In Android Studio, left sidebar:
- Click **Device Manager**
- You'll see list of emulators
- Click the ▶️ (play) button next to any emulator
- Wait 1-2 minutes for emulator to start

**2. Run APK on Emulator:**

After emulator starts:
1. Click `Run` button (green ▶️ button at top)
2. Select the emulator from the list
3. Click OK
4. APK installs and opens on emulator

**3. Test the App:**
- Enter student name
- Click START QUIZ
- Test all features

---

### Option B: Real Android Phone

**1. Enable Developer Mode (First Time Only):**

On your phone:
1. Open Settings → About Phone
2. Scroll to "Build Number"
3. Tap "Build Number" 7 times rapidly
4. You'll see message: "Developer mode enabled"
5. Go back to Settings → Developer Options
6. Toggle "USB Debugging" ON

**2. Connect Phone:**
1. Connect your phone to computer with USB cable
2. You'll see a prompt on phone: "Allow USB Debugging?"
3. Tap "Always Allow"

**3. Run APK on Phone:**

In Android Studio:
1. Click `Run` button (green ▶️ button at top)
2. Select your phone from the list
3. Click OK
4. APK installs and opens on your phone

**4. Test the App:**
- Quiz should open automatically
- Enter name → START QUIZ
- Test timer, questions, submit
- Try taking screenshot (should be blocked!)

---

## 🧪 TESTING CHECKLIST

After APK installs, verify each feature:

### Basic Features:

- [ ] App opens and shows quiz screen
- [ ] Student name input visible on first screen
- [ ] "START QUIZ" button clickable
- [ ] Question text displays
- [ ] 4 options visible and selectable
- [ ] Timer counts down from 60
- [ ] "Next" button advances questions
- [ ] "SUBMIT" button shows after last question
- [ ] Score displays after submit
- [ ] Correct answers shown in results

### Security Features:

**Web Feature - Right Click:**
- [ ] Right-click during quiz → nothing happens (no menu)

**Web Feature - Text Selection:**
- [ ] Try to select quiz text → can't select

**Web Feature - Fullscreen:**
- [ ] Click START → app goes fullscreen
- [ ] Can't exit fullscreen normall

**Android Feature - Screenshots:**
- [ ] Try taking screenshot during quiz → screenshot is black/blocked
- [ ] Try again outside quiz → screenshot works fine

**Android Feature - Split Screen:**
- [ ] During Android: Swipe down from top edge
- [ ] Try split-screen gesture → doesn't work

**Android Feature - App Switch:**
- [ ] Press HOME button during quiz
- [ ] Quiz should auto-submit immediately
- [ ] Results screen should show

---

## 💡 USEFUL ANDROID STUDIO SHORTCUTS

| Action | Windows |
|--------|---------|
| Save file | Ctrl + S |
| Find text | Ctrl + F |
| Replace text | Ctrl + H |
| Select all | Ctrl + A |
| Copy | Ctrl + C |
| Paste | Ctrl + V |
| Comment code | Ctrl + / |
| Undo | Ctrl + Z |
| Redo | Ctrl + Y |
| Run app | Shift + F10 |
| Build APK | Ctrl + B |

---

## 🚨 COMMON MISTAKES IN ANDROID STUDIO

### ❌ Mistake: Edit wrong MainActivity.java

**What happens:** File doesn't seem to save or changes don't apply

**Fix:**
- Make sure you're in: `app → src → main → java → com → example → quizapp`
- There might be duplicate files
- Right-click → "Show in Explorer" to confirm file location

---

### ❌ Mistake: Forgot to edit AndroidManifest.xml

**What happens:** Still can split-screen the app on Android

**Fix:**
- Open AndroidManifest.xml
- Add `android:resizeableActivity="false"` to the <activity> tag
- Save and rebuild APK

---

### ❌ Mistake: Gradle sync failing

**What happens:** Red error lines everywhere, status bar shows "Gradle sync failed"

**Fix:**
1. Click `File → Sync Now`
2. Wait 10 minutes
3. If still fails: `File → Invalidate Caches → Invalidate and Restart`
4. Android Studio will restart and re-sync

---

### ❌ Mistake: Can't find MainActivity.java

**What happens:** Folder tree doesn't show MainActivity

**Fix:**
- Make sure you expanded all arrows (▶) in folder tree
- If still not visible, you have wrong Android project open
- Delete `android/` folder and run: `npx cap add android` again

---

### ❌ Mistake: Build failed with "Cannot find SDK"

**What happens:** Error message: "Could not find Android SDK"

**Fix:**
- Android Studio → File → Settings
- Appearance & Behavior → System Settings → Android SDK
- Check SDK Location - verify path exists
- If not, download SDK:
  - SDK Tools tab → install "Android SDK Build-Tools"
  - Click OK and wait for download

---

## 📊 HOW TO READ ERROR MESSAGES

When build fails, you'll see errors. Here's how to read them:

**Format:**
```
[FILE PATH]:[LINE NUMBER]: error: [ERROR MESSAGE]
```

**Example:**
```
MainActivity.java:15: error: cannot find symbol
symbol: class WindowManager
```

**Decode:**
- File: MainActivity.java
- Line: 15
- Problem: WindowManager class not found
- Fix: Check if you copied code correctly

Usually Android Studio gives suggestions. Look for blue underlines - click them for fixes.

---

## ✅ VERIFICATION STEPS

After editing files, verify each:

### 1. MainActivity.java Verification:

Look for these key pieces:
- [ ] `FLAG_SECURE` is in `onCreate()`
- [ ] `onPause()` method exists
- [ ] `evaluateJavascript("submitQuiz"...` is inside `onPause()`
- [ ] No red error lines (all errors cleared)

### 2. AndroidManifest.xml Verification:

Look for this in `<activity>` tag:
- [ ] `android:name=".MainActivity"` ← Present
- [ ] `android:exported="true"` ← Present
- [ ] `android:resizeableActivity="false"` ← Added by you

### 3. Build Verification:

After building:
- [ ] Message says "APK(s) generated successfully"
- [ ] No errors in Build output (only warnings are OK)
- [ ] File exists: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🎓 WHAT YOU'RE DOING

When you:
1. **Edit MainActivity.java** → You're adding Android security
2. **Edit AndroidManifest.xml** → You're configuring the app behavior
3. **Build APK** → You're compiling Java code + web files into installable
4. **Install on phone** → You're deploying the application

This is the complete app development cycle!

---

Good luck with your build! 🚀

