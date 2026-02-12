# 📺 TV Deployment Guide - How to Run on TV

## 🎯 Overview

This guide explains how to run the Sakura TV Display App on actual TV devices. There are several methods depending on your TV type.

---

## 📱 Method 1: Android TV (Recommended)

### Prerequisites
- Android TV or Android TV Box (e.g., Mi Box, Nvidia Shield, Fire TV Stick)
- Computer with the app code
- Same Wi-Fi network for both devices

### Step 1: Build Android APK

```bash
cd tv-app

# Install EAS CLI (if not installed)
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android TV
eas build --platform android --profile production
```

### Step 2: Install on Android TV

**Option A: Via USB (Easiest)**
1. Transfer the APK file to a USB drive
2. Insert USB into Android TV
3. Use a file manager app (like ES File Explorer) to install the APK
4. Enable "Install from Unknown Sources" if prompted

**Option B: Via ADB (Advanced)**
```bash
# Connect Android TV via USB or enable ADB over network
adb connect <TV_IP_ADDRESS>
adb install path/to/app.apk
```

**Option C: Via Play Store (If published)**
1. Publish app to Google Play Store
2. Install from Play Store on Android TV

### Step 3: Configure API URL

Before building, update `services/api.ts`:

```typescript
const API_BASE_URL = 'http://YOUR_SERVER_IP:3000/api';
```

**Important:** Use your server's IP address, not `localhost`!

### Step 4: Launch App

1. Open the app on Android TV
2. App will start in landscape mode
3. Shows appointment number screen first
4. Click "Continue" to see live display

---

## 🍎 Method 2: Apple TV (tvOS)

### Prerequisites
- Apple TV (4th generation or later)
- Mac computer
- Apple Developer account ($99/year)

### Step 1: Configure for tvOS

Update `app.json`:

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.sakura.tvapp"
    },
    "plugins": [
      [
        "expo-router",
        {
          "root": "./app"
        }
      ]
    ]
  }
}
```

### Step 2: Build for tvOS

```bash
cd tv-app

# Build for tvOS
eas build --platform ios --profile production
```

### Step 3: Install on Apple TV

1. Connect Apple TV to your Mac via USB-C
2. Open Xcode
3. Select your Apple TV as target device
4. Build and run the app

**OR**

1. Use TestFlight to distribute
2. Install TestFlight on Apple TV
3. Install app from TestFlight

---

## 🌐 Method 3: Smart TV Web Browser (Easiest)

### For Any Smart TV with Browser

### Step 1: Build Web Version

```bash
cd tv-app

# Install dependencies
npm install

# Build web version
npx expo export:web

# Or use Expo web
npm start
# Then press 'w' for web
```

### Step 2: Deploy to Server

**Option A: Local Network Server**
```bash
# Install serve globally
npm install -g serve

# Serve the web build
cd web-build
serve -p 8080
```

**Option B: Deploy to Hosting**
- Upload `web-build` folder to:
  - Netlify
  - Vercel
  - GitHub Pages
  - Your own server

### Step 3: Access on TV

1. Open web browser on Smart TV
2. Navigate to: `http://YOUR_SERVER_IP:8080`
3. App will load in browser
4. Set browser to fullscreen (usually F11 or TV remote)

**Note:** Some TVs have limited browser support. Test first!

---

## 📺 Method 4: Chromecast / Screen Mirroring

### Using Chromecast

1. **On Your Computer:**
   ```bash
   cd tv-app
   npm start
   # Press 'w' for web
   ```

2. **Cast to TV:**
   - Open Chrome browser
   - Click cast icon
   - Select your Chromecast
   - Browser tab will appear on TV

### Using Screen Mirroring

**Android:**
- Enable screen mirroring on phone/tablet
- Connect to TV
- Open Expo Go app
- Run the TV app

**iOS:**
- Use AirPlay to mirror iPhone/iPad to Apple TV
- Open Expo Go app
- Run the TV app

---

## 🔧 Configuration for TV

### 1. Update API URL

Edit `tv-app/services/api.ts`:

```typescript
// For production (TV device)
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Your server IP

// OR for cloud deployment
const API_BASE_URL = 'https://api.sakura.com/api';
```

### 2. Configure for Landscape Only

Already configured in `app.json`:
```json
"orientation": "landscape"
```

### 3. Keep Screen Awake

Add to `app.json`:
```json
{
  "expo": {
    "android": {
      "keepAwake": true
    },
    "ios": {
      "supportsTablet": true
    }
  }
}
```

### 4. Auto-start on Boot (Android TV)

Create a launcher app or use:
- **Tasker** (Android automation)
- **AutoStart** apps
- **Custom launcher** that auto-opens the app

---

## 🌐 Network Setup

### Find Your Server IP

**Mac/Linux:**
```bash
ifconfig | grep "inet "
# Look for: inet 192.168.1.100
```

**Windows:**
```bash
ipconfig
# Look for: IPv4 Address: 192.168.1.100
```

### Configure Firewall

Allow port 3000 (backend) and 8080 (web app):

**Mac:**
```bash
# Allow incoming connections on port 3000
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/node
```

**Linux:**
```bash
sudo ufw allow 3000
sudo ufw allow 8080
```

**Windows:**
- Windows Firewall → Allow app through firewall
- Add Node.js and your ports

### Test Connection

From TV device, test if backend is accessible:

```bash
# If TV has browser, visit:
http://YOUR_SERVER_IP:3000/api/tv/appointment-number
```

Should return JSON data.

---

## 🚀 Quick Start (Easiest Method)

### For Testing: Web Browser on Smart TV

1. **Start Backend:**
   ```bash
   cd backend
   npm run start
   ```

2. **Start TV App (Web):**
   ```bash
   cd tv-app
   npm install
   npm start
   # Press 'w' for web
   ```

3. **Update API URL:**
   - Edit `tv-app/services/api.ts`
   - Change to: `http://YOUR_COMPUTER_IP:3000/api`

4. **Open on TV:**
   - Open browser on Smart TV
   - Go to: `http://YOUR_COMPUTER_IP:8080` (or Expo URL)
   - Fullscreen the browser

---

## 📋 Step-by-Step: Android TV Setup

### Complete Setup Process

1. **Prepare the App:**
   ```bash
   cd tv-app
   npm install
   ```

2. **Update API Configuration:**
   ```typescript
   // services/api.ts
   const API_BASE_URL = 'http://192.168.1.100:3000/api';
   ```

3. **Build APK:**
   ```bash
   # Development build
   npx expo run:android
   
   # OR Production build
   eas build --platform android
   ```

4. **Transfer to TV:**
   - Copy APK to USB drive
   - Insert into Android TV
   - Install via file manager

5. **Launch:**
   - Open app from TV home screen
   - App starts in landscape
   - Shows appointment number
   - Click "Continue"

---

## 🎨 TV-Specific Optimizations

### 1. Larger Text Sizes

Update component styles for TV viewing distance:

```typescript
// In components/PatientList.tsx
headerTitle: {
  fontSize: 28, // Increase from 20
  fontWeight: 'bold',
}

// In components/DoctorProfileCard.tsx
name: {
  fontSize: 32, // Increase from 24
}
```

### 2. Higher Contrast

Ensure text is readable from distance:

```typescript
// Use high contrast colors
backgroundColor: '#000000', // Pure black
textColor: '#FFFFFF', // Pure white
```

### 3. Touch vs Remote

For TV remotes, ensure:
- Large touch targets (min 48x48px)
- Clear focus indicators
- Navigation with D-pad works

---

## 🔍 Troubleshooting

### App Not Connecting to Backend

**Problem:** "Network request failed"

**Solutions:**
1. Check API URL in `services/api.ts`
2. Verify backend is running: `http://YOUR_IP:3000`
3. Check firewall settings
4. Ensure TV and server on same network
5. Test with browser on TV: `http://YOUR_IP:3000/api/tv/appointment-number`

### App Crashes on TV

**Problem:** App closes immediately

**Solutions:**
1. Check logs: `adb logcat` (Android TV)
2. Verify all dependencies installed
3. Check device compatibility
4. Test on emulator first

### YouTube Video Not Playing

**Problem:** Video doesn't load

**Solutions:**
1. Check internet connection on TV
2. Verify YouTube URL format
3. Check WebView permissions
4. Test video URL in browser first

### Screen Orientation Issues

**Problem:** App rotates incorrectly

**Solutions:**
1. Verify `orientation: "landscape"` in `app.json`
2. Lock TV orientation settings
3. Check device settings

---

## 📱 Alternative: Use Tablet/Phone as TV Display

### If TV Setup is Complex

1. **Use a Tablet:**
   - Mount tablet on wall
   - Install Expo Go
   - Run the app
   - Keep screen always on

2. **Use a Phone:**
   - Same as tablet
   - Use phone stand
   - Connect to charger
   - Disable auto-lock

3. **Use a Mini PC:**
   - Raspberry Pi
   - Intel NUC
   - Mini computer connected to TV
   - Run web version in kiosk mode

---

## 🎯 Recommended Setup

### For Production Use

1. **Hardware:**
   - Android TV Box (cheapest option)
   - Or Mini PC connected to TV
   - Stable Wi-Fi connection

2. **Software:**
   - Build production APK
   - Auto-start on boot
   - Keep screen awake
   - Auto-refresh enabled

3. **Network:**
   - Dedicated network for TV
   - Static IP for server
   - Firewall configured

4. **Monitoring:**
   - Health check endpoint
   - Error logging
   - Auto-restart on crash

---

## 📞 Quick Reference

### Commands Cheat Sheet

```bash
# Install dependencies
cd tv-app && npm install

# Start development
npm start

# Build for Android
eas build --platform android

# Build for web
npx expo export:web

# Test API connection
curl http://YOUR_IP:3000/api/tv/appointment-number

# Check TV IP (if Android TV with ADB)
adb shell ifconfig
```

### Important URLs

- **Backend API:** `http://YOUR_IP:3000/api`
- **TV App Web:** `http://YOUR_IP:8080` (after build)
- **Expo Dev:** `exp://YOUR_IP:8081` (development)

---

## ✅ Checklist

Before deploying to TV:

- [ ] API URL configured correctly
- [ ] Backend running and accessible
- [ ] Network connectivity verified
- [ ] App tested on emulator/device
- [ ] Text sizes appropriate for TV
- [ ] Landscape orientation locked
- [ ] Auto-refresh working
- [ ] YouTube video playing
- [ ] Error handling tested
- [ ] Screen stays awake
- [ ] Auto-start configured (optional)

---

## 🎉 You're Ready!

Choose the method that works best for your TV setup:

1. **Android TV:** Best for dedicated TV displays
2. **Web Browser:** Easiest, works on any Smart TV
3. **Screen Mirroring:** Quick testing solution
4. **Tablet/Phone:** Alternative if TV setup is complex

**Most users start with Web Browser method for quick testing!**

---

**Date:** February 20, 2026  
**Status:** ✅ Complete Guide  
**Version:** 1.0.0

**Your TV app is ready to deploy! 📺🎉**

