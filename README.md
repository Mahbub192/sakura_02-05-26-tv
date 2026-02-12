# Sakura TV Display App

React Native Expo 54 app for displaying live patient queue, doctor information, and YouTube videos on TV screens.

## Features

- **Appointment Number Screen**: Initial screen showing appointment number
- **Live Patient List**: Real-time patient queue with Bengali status labels
- **Doctor Profile Card**: Doctor information with profile picture
- **YouTube Video Player**: Embedded YouTube video player
- **Real-time Updates**: Auto-refreshes every 3 seconds
- **Break Status**: Shows break status when no active patients

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `services/api.ts`:
```typescript
const API_BASE_URL = 'http://YOUR_BACKEND_URL/api';
```

3. Start the app:
```bash
npm start
```

## Project Structure

```
tv-app/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Appointment number screen
│   └── display.tsx          # Main display screen
├── components/
│   ├── DoctorProfileCard.tsx
│   ├── PatientList.tsx
│   └── YouTubePlayer.tsx
├── services/
│   └── api.ts               # API service
└── package.json
```

## API Endpoints Used

- `GET /api/tv/appointment-number` - Get appointment number
- `GET /api/tv/live-data` - Get complete live data
- `GET /api/tv/patient-list` - Get patient list
- `GET /api/tv/break-status` - Get break status
- `GET /api/tv/active-chamber` - Get active chamber

## Status Labels (Bengali)

- **রানিং** (Running) - Light green background
- **এরপর** (Next) - Dark green background
- **সিরিয়ালে** (In Queue) - White background
- **দেখা হয়েছে** (Seen) - Light gray background
- **অনুপস্থিত** (Absent) - Light pink background

## Requirements

- Expo SDK 54
- React Native 0.76.5
- TypeScript
- Backend API running

## Notes

- App runs in landscape orientation
- Auto-refreshes every 3 seconds
- Supports pull-to-refresh
- YouTube videos autoplay and loop

