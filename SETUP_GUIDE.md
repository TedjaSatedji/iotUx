# 🚀 IoT Motor Anti-Theft - Complete Setup Guide

## Quick Start

### Step 1: Install Dependencies
```powershell
cd x:\Project\iotUx
npm install
```

### Step 2: Start Development Server
```powershell
npm start
```

### Step 3: Run on Device
- **For Android**: Press `a` in the terminal or run `npm run android`
- **For iOS**: Press `i` in the terminal or run `npm run ios`
- **For Web**: Press `w` in the terminal or run `npm run web`
- **Physical Device**: Scan the QR code with Expo Go app

## 📦 What's Included

### Complete Mobile Application
✅ Login/Register with glassmorphism design  
✅ Animated floating bubbles background  
✅ Dashboard with device statistics  
✅ Device list with live status  
✅ Add/Remove devices  
✅ Device detail with GPS map  
✅ Send commands to devices  
✅ Alert history timeline  
✅ Auto-refresh & pull-to-refresh  
✅ Secure token-based authentication  

### Backend Integration
- API Base URL: `https://iot.fyuko.app`
- All endpoints integrated
- Token persistence with AsyncStorage
- Error handling & auto-logout

### UI Components
- Custom Button with variants
- Card container
- StatusBadge (online/offline/armed/disarmed)
- Consistent theme & design system

## 📱 Test Credentials

You can create a new account or use the dashboard at the backend URL to create test data.

### Creating Test Data
1. Open browser to `https://iot.fyuko.app`
2. Register a new user
3. Add a test device (e.g., `MOTOR-TEST123`)
4. Use same credentials in mobile app

## 🎨 Features Showcase

### 1. Login Screen
- **Black background** with animated bubbles
- **Glassmorphism card** with blur effect
- Toggle between Login/Register
- Smooth transitions

### 2. Dashboard
- Welcome message with user name
- **Statistics cards**: Total, Online, Offline
- **Quick actions**: View Devices, Add Device
- Recent devices with live status
- **Auto-refresh**: Every 10 seconds

### 3. Devices List
- Search by name or ID
- Live status indicators (🟢 Online / 🔴 Offline)
- Add device modal
- Pull-to-refresh
- Navigate to device details

### 4. Device Detail
- **Interactive Map**: Shows device GPS location
- **Live status**: Updates every 5 seconds
- **Control buttons**:
  - 🔊 Buzz Alarm
  - 📍 Request Position
  - 🔒 Arm System
  - 🔓 Disarm System
- **Alert History**: Shows all device events

## 🛠️ Customization

### Change API URL
Edit `src/constants/theme.ts`:
```typescript
export const API_BASE_URL = 'https://your-backend.com';
```

### Change Colors
Edit `src/constants/theme.ts`:
```typescript
export const COLORS = {
  primary: '#6366F1',  // Your brand color
  secondary: '#F59E0B',
  // ... more colors
};
```

### Adjust Auto-Refresh Intervals
- **Dashboard**: Line 55 in `DashboardScreen.tsx` - currently 10000ms (10s)
- **Device Detail**: Line 54 in `DeviceDetailScreen.tsx` - currently 5000ms (5s)

## 📐 Architecture

### API Service Layer (`src/services/api.ts`)
- Centralized API calls
- Automatic token injection
- Error handling & interceptors
- TypeScript types for all responses

### Navigation Structure
```
App
├── Login Screen (unauthenticated)
└── Main Tabs (authenticated)
    ├── Dashboard Tab
    ├── Devices Tab
    └── Device Detail (modal stack)
```

### State Management
- React hooks (useState, useEffect)
- AsyncStorage for persistence
- Auto-refresh with setInterval

## 🚨 Important Notes

### Maps Configuration
- Uses `react-native-maps` with default provider
- **No API key required** for basic functionality
- OpenStreetMap tiles used by default
- Works on both iOS and Android

### Performance
- Auto-refresh intervals optimized
- Component-level state management
- Efficient re-renders
- Pull-to-refresh for manual updates

### Security
- Token stored securely in AsyncStorage
- Token sent in HTTP headers (not URL)
- Auto-logout on 401 errors
- No sensitive data in logs

## 🔧 Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution**: Run `npm install` to install all dependencies

### Issue: Maps not showing
**Solution**: 
- Check internet connection
- Ensure device has location permissions
- Map uses default provider (no API key needed)

### Issue: "Network request failed"
**Solution**:
- Check API URL in `src/constants/theme.ts`
- Ensure backend is running
- Check device can reach backend URL
- For Android emulator, use `10.0.2.2` for localhost

### Issue: App stuck on splash screen
**Solution**:
- Check console for errors
- Clear cache: `expo start -c`
- Reinstall dependencies

### Issue: AsyncStorage errors
**Solution**:
- Clear app data on device
- Uninstall and reinstall app
- Check AsyncStorage is properly linked

## 📱 Building for Production

### Android APK
```powershell
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### iOS IPA
```powershell
eas build --platform ios --profile preview
```

### Both Platforms
```powershell
eas build --platform all
```

## 🎯 Next Steps

1. **Test the app**: Create test users and devices
2. **Customize theme**: Update colors and branding
3. **Add features**: Push notifications, more commands
4. **Deploy**: Build production APK/IPA
5. **Test on real devices**: Test with actual ESP32 hardware

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review `README_APP.md` for detailed info
3. Check backend API documentation at backend URL
4. Review React Native and Expo documentation

## ✨ Enjoy Your IoT Anti-Theft System!

The app is ready to use with your backend at `https://iot.fyuko.app`. Just run `npm start` and you're good to go! 🎉
