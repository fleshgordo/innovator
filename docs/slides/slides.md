---
marp: true
paginate: true
style: |
  /* Force dark slide background and readable foreground */
  section { font-size: 28px; background: #0f1115; color: #f5f7fa; }
  h1, h2, h3 { color: #f5f7fa; }
  :root { --accent: #3d7dff; }
  a { color: var(--accent); }
  pre, code { background: #1b1f24 !important; color: #f5f7fa !important; }
  code { padding: .1em .3em; border-radius: 4px; }
  .dim { color: #9aa4b1; }
  .center { text-align: center; }
---

# From Zero to Mobile: Web + Capacitor

- Fresh macOS to a running Android app
- Plain HTML/CSS/JS + tiny router
- Capacitor: Geolocation + Haptics

::: notes
Open with the promise: modern mobile from web skills, no frameworks.
:::

---

## What we'll build

- Dark start screen (templates + CSS)
- Do Action → fullscreen circle zoom
- Get Location → GPS + haptics
- Settings → localStorage persistence

::: notes
Focus on separation of concerns: HTML templates, CSS, JS modules.
:::

---

## Architecture overview

![width:800](assets/architecture.svg)

::: notes
Web assets loaded in a WebView. Calls go through Capacitor bridge to native plugins.
:::

---

## Setup (macOS)

1. Xcode Command Line Tools: `xcode-select --install`
2. Homebrew
3. nvm + Node >= 20 (we use 22)
4. Java 21 via Homebrew
5. Android Studio + SDKs

::: notes
Call out common pitfalls: Node from conda, wrong Java.
:::

---

## Project structure

```
www/
  index.html
  css/styles.css
  js/
    storage.js
    capacitor-bridge.js
    router.js
    app.js
```

::: notes
HTML in <template> tags, JS clones and binds events.
:::

---

## Running the app

```bash
source ~/.nvm/nvm.sh && nvm use 22
npm install
npm install @capacitor/core @capacitor/cli @capacitor/android \
  @capacitor/geolocation @capacitor/haptics
npx cap sync android
npx cap open android
```

::: notes
Run on emulator or a real device via Android Studio.
:::

---

## Code tour: templates + router

- index.html contains `<template id="tpl-start">`, `tpl-about`, `tpl-settings`
- router maps `#hash` → template id
- After render, bind events per screen

::: notes
Show how to add a new screen in 2 steps.
:::

---

## Capacitor bridge

- Geolocation: GPS (with browser fallback)
- Haptics: vibrate on click/success
- Graceful degradation on web

::: notes
Highlight progressive enhancement.
:::

---

## UX details

- Dark theme, high-contrast defaults
- Focus states and button affordances
- Animation: circle zoom with keyframes

::: notes
Make it feel polished without frameworks.
:::

---

## Exercises

1. New route + button
2. Another Capacitor plugin (Clipboard, Device)
3. Theme toggle in localStorage
4. Offline with a service worker

::: notes
Encourage experimentation.
:::

---

## Troubleshooting

- Node (use nvm): `nvm use 22`
- Java (need 21): set Gradle JDK to 21
- SDK licenses: accept in Android Studio
- Gradle clean: `(cd android && ./gradlew clean)`

::: notes
Reference the README troubleshooting section.
:::

---

# Q&A

::: notes
Invite questions and next steps.
:::
