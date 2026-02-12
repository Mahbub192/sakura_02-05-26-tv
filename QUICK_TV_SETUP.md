# 🚀 Quick TV Setup - 5 Minutes

## Easiest Method: Web Browser on Smart TV

### Step 1: Update API URL (1 minute)

Edit `tv-app/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_COMPUTER_IP:3000/api'  // Find with: ifconfig (Mac) or ipconfig (Windows)
  : 'https://api.sakura.com/api';
```

**Find your IP:**
- **Mac/Linux:** Run `ifconfig | grep "inet "` in terminal
- **Windows:** Run `ipconfig` in CMD, look for "IPv4 Address"

### Step 2: Start Backend (1 minute)

```bash
cd backend
npm run start
```

Backend should run on `http://localhost:3000`

### Step 3: Start TV App (1 minute)

```bash
cd tv-app
npm install  # First time only
npm start
```

Then press **`w`** for web version.

### Step 4: Open on TV (2 minutes)

1. **On your Smart TV:**
   - Open web browser
   - Go to the URL shown in terminal (usually `http://YOUR_IP:8081`)
   - Or use Expo web URL

2. **Fullscreen:**
   - Press TV remote button for fullscreen
   - Or use browser's fullscreen option

3. **Done!** App should show:
   - Appointment number screen
   - Click "Continue"
   - See live patient list + doctor info + YouTube video

---

## Alternative: Android TV Box

### Quick Setup:

1. **Build APK:**
   ```bash
   cd tv-app
   npx expo run:android
   ```

2. **Install on Android TV:**
   - Transfer APK via USB
   - Install using file manager
   - Launch app

3. **Configure:**
   - Update API URL before building
   - Use your server's IP address

---

## Troubleshooting

**Can't connect to backend?**
- Check both devices on same Wi-Fi
- Use computer's IP, not `localhost`
- Test: Open `http://YOUR_IP:3000/api/tv/appointment-number` in TV browser

**App not loading?**
- Check backend is running
- Verify API URL is correct
- Check firewall allows port 3000

**Need help?**
- See full guide: `TV_DEPLOYMENT_GUIDE.md`

---

**That's it! Your TV app is running! 📺**

