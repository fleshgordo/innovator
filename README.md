# Innovator App — hands-on guide (macOS fresh install)

This guide walks you from a fresh macOS + VS Code setup to a running Android app built with Capacitor, plain HTML/CSS/JS, and a tiny router. No frameworks.

## What you’ll build
- A dark-themed start screen (HTML templates + CSS) rendered in a WebView
- Two buttons on the start screen:
  - Do Action: plays a fullscreen circle zoom animation
  - Get Location: uses Capacitor Geolocation and Haptics to fetch GPS and vibrate
- A Settings screen persisted to localStorage

## 0) Prerequisites
- macOS (Apple silicon or Intel)
- VS Code installed
- Copilot

## 1) Install developer tools
Run these in Terminal (Applications > Utilities > Terminal) using zsh.

```bash
# Xcode Command Line Tools (git, compilers)
xcode-select --install

# Homebrew (package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Ensure brew is on PATH (Apple silicon vs Intel)
# Apple silicon (M1/M2/M3):
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
source ~/.zprofile
# Intel Macs:
# echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile && source ~/.zprofile

# Install nvm (Node Version Manager)
brew install nvm
mkdir -p ~/.nvm
{
  echo 'export NVM_DIR="$HOME/.nvm"'
  echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && . "$(brew --prefix nvm)/nvm.sh"'
} >> ~/.zshrc
source ~/.zshrc

# Install Node (LTS is fine; 20+ required by Capacitor)
nvm install 22
nvm alias default 22
node --version
npm --version

# Install Java 21 (required by latest Android Gradle Plugin)
brew install openjdk@21
# Add JAVA_HOME automatically each shell
{
  echo 'export JAVA_HOME="$((/usr/libexec/java_home -v 21) 2>/dev/null || echo $(/usr/libexec/java_home)))"'
  echo 'export PATH="$JAVA_HOME/bin:$PATH"'
} >> ~/.zshrc
source ~/.zshrc
java -version

# (Recommended) Android Studio via Homebrew
brew install --cask android-studio
```

Notes
- If you already have Node via another tool (e.g., conda), prefer `nvm` for this project. Make sure `which node` points to your nvm path.
- If `java -version` doesn’t show 21, verify with `/usr/libexec/java_home -V` and update `JAVA_HOME` accordingly.

## 2) Install Android SDKs (Android Studio)
1. Open Android Studio.
2. On first run, accept the setup wizard defaults and install required SDK components.
3. Create a virtual device (AVD) via Device Manager (Pixel 7 API 35 recommended).
4. In Android Studio Settings > Build, Execution, Deployment > Gradle, set “Gradle JDK” to JDK 21.
5. Accept licenses (optional but useful):
   ```bash
   yes | "$ANDROID_HOME"/tools/bin/sdkmanager --licenses 2>/dev/null || true
   ```

## 3) Get the project
Either clone this repo or download/unzip.

```bash
git clone <your_repository_url>
cd innovater_test
```

Install Node dependencies and Capacitor platforms/plugins:

```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android \
  @capacitor/geolocation @capacitor/haptics
```

## 4) Project structure (web assets only)
```
www/
  index.html              # Entry HTML (Capacitor web dir)
  css/styles.css          # Dark theme + layout + form styles
  js/storage.js           # localStorage wrapper for user preferences
  js/capacitor-bridge.js  # Capacitor wrapper (Geolocation, Haptics) with web fallbacks
  js/router.js            # Tiny hash router + template rendering
  js/app.js               # Bootstrap
```

## 5) Sync and open Android project
```bash
# Ensure Node 20+ active via nvm
source ~/.nvm/nvm.sh && nvm use 22

# Sync web → native android
npx cap sync android

# Open Android project
npx cap open android
```

In Android Studio:
- Select device/emulator and press Run ▶️
- If build fails with Java errors, verify Gradle JDK is set to 21 (Preferences > Gradle)

## 5.1) Export the slide deck to PPTX / PDF

We added a Markdown slide deck at `docs/slides/slides.md` and npm scripts to export:

```bash
# Install the slide tool (once)
npm install

# Build PPTX
npm run slides:build:pptx

# Build PDF
npm run slides:build:pdf
```

Output files will be written to `docs/slides/`.

## 6) App walkthrough
- Start screen renders from HTML `<template>`s
- Buttons:
  - Do Action → fullscreen circle zoom CSS animation
  - Get Location → prompts permission, shows GPS; haptics on supported devices
- Settings → name/theme/notifications saved to localStorage

## 7) Common issues and fixes
- Node version error from Capacitor CLI
  - Use: `source ~/.nvm/nvm.sh && nvm use 22`
- Java toolchain error (needs 21)
  - Ensure: `java -version` shows 21
  - In Android Studio set Gradle JDK to 21
  - Project-level `android/gradle.properties` can include:
    ```
    org.gradle.java.home=$(/usr/libexec/java_home -v 21)
    ```
- Kotlin/Java target mismatch
  - Use JDK 21 for both; clean build: `./gradlew clean`
- Android SDK licenses
  - Accept in Android Studio SDK Manager or run the licenses command above
- Emulator performance
  - Enable hardware acceleration (Hypervisor Framework) in macOS settings if prompted

## 8) Extend the app (exercises)
1. Add a new route via `<template>` + `routes` map in `js/router.js`
2. Wire a new button to use another Capacitor plugin (e.g., Clipboard, Device)
3. Add a theme toggle stored in localStorage
4. Bonus: add a service worker for offline start

## 9) Clean remove / reset (optional)
```bash
# Remove Android build outputs
(cd android && ./gradlew clean)

# Reinstall node deps
rm -rf node_modules package-lock.json && npm install

# Re-sync
npx cap sync android
```