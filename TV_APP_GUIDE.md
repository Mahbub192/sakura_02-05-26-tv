# Sakura TV Display App - Complete Guide

## 📱 Overview

This is a React Native Expo 54 TV display application that shows:
- **Appointment Number** (initial screen)
- **Live Patient Queue** with Bengali status labels
- **Doctor Profile Card** with photo and information
- **YouTube Video Player** for educational content
- **Real-time Updates** every 3 seconds

---

## 🏗️ Project Structure

```
tv-app/
├── app/
│   ├── _layout.tsx          # Root navigation layout
│   ├── index.tsx            # Appointment number screen
│   └── display.tsx          # Main display screen
├── components/
│   ├── DoctorProfileCard.tsx    # Doctor info card
│   ├── PatientList.tsx          # Patient queue table
│   └── YouTubePlayer.tsx        # YouTube video player
├── services/
│   └── api.ts               # API service layer
├── package.json
├── app.json                  # Expo configuration
└── tsconfig.json
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd tv-app
npm install
```

### 2. Configure API URL

Edit `services/api.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:3000/api'  // For physical device testing
  : 'https://api.sakura.com/api';     // Production
```

**Important:** For physical device testing, use your computer's local IP address (not `localhost`).

Find your IP:
- **Mac/Linux:** `ifconfig | grep "inet "`
- **Windows:** `ipconfig`

Example: `http://192.168.1.100:3000/api`

### 3. Start the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app (for physical device)

---

## 📺 Screen Flow

### 1. Appointment Number Screen (`app/index.tsx`)

**Features:**
- Shows appointment number from active chamber
- Shows chamber name
- "Continue" button to proceed

**API Call:**
- `GET /api/tv/appointment-number`

### 2. Display Screen (`app/display.tsx`)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Doctor Profile  │  Patient List        │
│  (Left Panel)     │  (Right Panel)      │
├─────────────────────────────────────────┤
│  YouTube Video Player (Full Width)     │
└─────────────────────────────────────────┘
```

**Features:**
- **Left Panel (30%):** Doctor profile card
- **Right Panel (70%):** Patient queue table
- **Bottom:** YouTube video player
- **Auto-refresh:** Every 3 seconds
- **Pull-to-refresh:** Manual refresh

**API Call:**
- `GET /api/tv/live-data`

---

## 🎨 Components

### DoctorProfileCard

**Location:** `components/DoctorProfileCard.tsx`

**Displays:**
- Profile picture (or initial letter)
- Full name
- Profession (Bengali: "সফটওয়্যার ইঞ্জিনিয়ার")
- Phone number

**Props:**
```typescript
interface Doctor {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  profilePicture?: string;
}
```

### PatientList

**Location:** `components/PatientList.tsx`

**Displays:**
- Appointment number header
- Break status badge (if active)
- Table with columns:
  - **নং** (Serial Number)
  - **নাম** (Patient Name)
  - **অবস্থা** (Status) - Color-coded
  - **সম্ভাব্য সময়** (Estimated Time)

**Status Colors:**
- **রানিং** (Running): Light green (`#90EE90`)
- **এরপর** (Next): Dark green (`#228B22`)
- **সিরিয়ালে** (In Queue): White
- **দেখা হয়েছে** (Seen): Light gray
- **অনুপস্থিত** (Absent): Light pink

**Props:**
```typescript
interface Props {
  patients: Patient[];
  breakStatus: boolean;
  appointmentNumber: string;
}
```

### YouTubePlayer

**Location:** `components/YouTubePlayer.tsx`

**Features:**
- Extracts video ID from URL
- Embeds YouTube player
- Autoplay enabled
- Loop enabled
- Fullscreen support

**Props:**
```typescript
interface Props {
  videoUrl: string;
}
```

---

## 🔌 API Integration

### API Service (`services/api.ts`)

**Methods:**

1. **getAppointmentNumber(chamberId?)**
   - Returns: `{ appointmentNumber: string, chamberName: string }`
   - Endpoint: `GET /api/tv/appointment-number`

2. **getLiveData(chamberId?)**
   - Returns: Complete live data object
   - Endpoint: `GET /api/tv/live-data`

3. **getPatientList(chamberId?)**
   - Returns: Array of patients
   - Endpoint: `GET /api/tv/patient-list`

4. **getBreakStatus(chamberId?)**
   - Returns: `boolean`
   - Endpoint: `GET /api/tv/break-status`

5. **getActiveChamber(chamberId?)**
   - Returns: Chamber object
   - Endpoint: `GET /api/tv/active-chamber`

**Note:** All methods accept optional `chamberId`. If not provided, uses active chamber.

---

## 🔄 Real-time Updates

### Auto-refresh Mechanism

- **Interval:** 3 seconds
- **Method:** Polling (HTTP requests)
- **Location:** `app/display.tsx`

```typescript
useEffect(() => {
  loadLiveData();
  startAutoRefresh();

  return () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };
}, []);

const startAutoRefresh = () => {
  refreshIntervalRef.current = setInterval(() => {
    loadLiveData(false);
  }, 3000);
};
```

### Manual Refresh

- **Pull-to-refresh:** Swipe down on ScrollView
- **RefreshControl:** Built-in React Native component

---

## 🎯 Backend Integration

### Active Chamber Logic

The backend automatically selects the active chamber:

1. If `chamberId` provided → Use that chamber (if active)
2. If no `chamberId` → Find first active chamber
3. If no active chamber → Return error

### Patient Status Mapping

**Backend Status → Bengali Label:**

| Backend Status | Bengali Label | Background Color |
|---------------|---------------|------------------|
| `running` | রানিং | Light green |
| `next` | এরপর | Dark green |
| `serialized` | সিরিয়ালে | White |
| `seen` | দেখা হয়েছে | Light gray |
| `absent` | অনুপস্থিত | Light pink |

### Estimated Time Calculation

- Based on waiting time per patient
- New patients: `waitingTimeVisit` minutes
- Follow-up/Report: `waitingTimeReport` minutes
- Calculated from patients ahead in queue

---

## 📱 Device Configuration

### Orientation

- **Landscape only:** Configured in `app.json`
- Prevents rotation issues on TV

### Screen Sizing

- **Responsive:** Uses percentage widths
- **Left Panel:** 30% width
- **Right Panel:** 70% width
- **Video:** Full width, 400px height

### TV Display Tips

1. **Keep device awake:** Disable auto-lock
2. **Fullscreen mode:** Use device fullscreen
3. **Network:** Stable Wi-Fi connection
4. **Brightness:** Adjust for visibility

---

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** "Network request failed"

**Solutions:**
1. Check API URL in `services/api.ts`
2. Use local IP for physical devices (not `localhost`)
3. Ensure backend is running
4. Check firewall settings
5. Verify network connectivity

### YouTube Video Not Playing

**Problem:** Video doesn't load

**Solutions:**
1. Check video URL format
2. Ensure URL is valid YouTube link
3. Check internet connection
4. Verify WebView permissions

### No Data Displayed

**Problem:** Empty screen

**Solutions:**
1. Check backend is running
2. Verify active chamber exists
3. Check API response in console
4. Ensure appointments exist for today

### Auto-refresh Not Working

**Problem:** Data doesn't update

**Solutions:**
1. Check console for errors
2. Verify interval is set (3 seconds)
3. Check network requests in dev tools
4. Restart app

---

## 🔧 Development

### Running on Physical Device

1. **Install Expo Go:**
   - iOS: App Store
   - Android: Play Store

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Scan QR Code:**
   - Open Expo Go app
   - Scan QR code from terminal

4. **Network Configuration:**
   - Ensure device and computer on same network
   - Use computer's local IP in API URL

### Building for Production

**Android:**
```bash
eas build --platform android
```

**iOS:**
```bash
eas build --platform ios
```

**Note:** Requires Expo account and EAS CLI setup.

---

## 📋 Checklist

### Before Deployment

- [ ] API URL configured correctly
- [ ] Tested on physical device
- [ ] Network connectivity verified
- [ ] YouTube video URL working
- [ ] Auto-refresh functioning
- [ ] Break status displaying correctly
- [ ] Bengali text rendering properly
- [ ] Landscape orientation locked
- [ ] Error handling implemented
- [ ] Loading states working

---

## 🎨 Customization

### Change Refresh Interval

Edit `app/display.tsx`:

```typescript
refreshIntervalRef.current = setInterval(() => {
  loadLiveData(false);
}, 5000); // Change from 3000 to 5000 (5 seconds)
```

### Change Colors

Edit component styles:

```typescript
// PatientList.tsx
runningRow: {
  backgroundColor: '#YOUR_COLOR',
}
```

### Change Layout Proportions

Edit `app/display.tsx`:

```typescript
leftPanel: {
  width: '25%', // Change from 30%
},
rightPanel: {
  width: '75%', // Change from 70%
},
```

---

## 📞 Support

For issues or questions:
1. Check backend logs
2. Check React Native console
3. Verify API endpoints
4. Test with Postman/curl

---

**Date:** February 20, 2026  
**Version:** 1.0.0  
**Status:** ✅ Complete

**TV App is ready for deployment! 🎉**

