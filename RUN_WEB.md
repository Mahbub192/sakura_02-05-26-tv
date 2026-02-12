# 🌐 How to Run TV App on Web

## ✅ Correct Commands

### Method 1: Using Expo Start (Recommended)

```bash
cd tv-app
npm start
```

Then:
- Press **`w`** for web
- Browser will open automatically
- Or visit the URL shown in terminal

### Method 2: Direct Web Command

```bash
cd tv-app
npm run web
# OR
npx expo start --web
```

### Method 3: Build Static Web Files

```bash
cd tv-app
npm run build:web
# OR
npx expo export:web
```

Then serve the `dist` folder:
```bash
npx serve dist
```

---

## ❌ Wrong Command

**Don't use:**
```bash
npx expo run:web  # ❌ This doesn't work
```

**Use instead:**
```bash
npm start          # ✅ Then press 'w'
# OR
npm run web        # ✅ Direct web
```

---

## 🚀 Quick Start

1. **Install dependencies (first time only):**
   ```bash
   cd tv-app
   npm install
   ```

2. **Update API URL:**
   Edit `services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

4. **Press `w` for web**

5. **Open on TV:**
   - Copy the URL from terminal
   - Open browser on Smart TV
   - Paste URL
   - Fullscreen!

---

## 📺 For TV Display

After web version loads:

1. **Fullscreen the browser:**
   - Press F11 (Windows/Linux)
   - Or use TV remote fullscreen button

2. **Keep it running:**
   - Don't close the terminal
   - Keep backend running too

3. **Auto-refresh:**
   - App refreshes every 3 seconds automatically
   - No need to reload page

---

**That's it! Your TV app is running on web! 🎉**

