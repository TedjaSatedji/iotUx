# IoT Motor Anti-Theft Mobile Application

A complete, production-ready React Native mobile application for the Motor Anti-Theft IoT system. Features modern UI with glassmorphism design, real-time device monitoring, GPS tracking, and secure authentication.

## 🎨 Features

- **Beautiful Login Screen**: Glassmorphism design with animated floating bubbles
- **Real-time Dashboard**: Monitor all devices with live status updates
- **Device Management**: Add, view, and control your IoT devices
- **GPS Tracking**: View device locations on an interactive map
- **Alert History**: Track all device events and notifications
- **Remote Control**: Send commands to arm/disarm, buzz alarm, request position
- **Secure Authentication**: Token-based auth with AsyncStorage persistence
- **Auto-refresh**: Live data updates every 5-10 seconds
- **Professional UI/UX**: Calm colors, smooth animations, optimized for prolonged use

## 📱 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** (Stack + Bottom Tabs)
- **Axios** for API calls
- **AsyncStorage** for token persistence
- **React Native Maps** for GPS visualization
- **Expo Linear Gradient** for beautiful gradients
- **Expo Blur** for glassmorphism effects

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Install dependencies**:
   ```bash
   cd x:\Project\iotUx
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device**:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

## 🏗️ Project Structure

```
iotUx/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.tsx        # Reusable button component
│   │       ├── Card.tsx          # Card container
│   │       └── StatusBadge.tsx   # Status indicator
│   ├── constants/
│   │   └── theme.ts              # Colors, spacing, fonts
│   ├── screens/
│   │   ├── LoginScreen.tsx       # Auth screen with glassmorphism
│   │   ├── DashboardScreen.tsx   # Main dashboard
│   │   ├── DevicesScreen.tsx     # Device list & add device
│   │   └── DeviceDetailScreen.tsx # Device detail with map
│   └── services/
│       └── api.ts                # API service layer
├── app/
│   └── _layout.tsx               # Navigation configuration
└── package.json
```

## 🎯 Key Screens

### 1. Login Screen
- Animated floating bubbles background
- Glassmorphism card design
- Toggle between Login/Register
- Email & password authentication
- Token storage in AsyncStorage

### 2. Dashboard
- Welcome header with user name
- Statistics cards (Total, Online, Offline devices)
- Quick action buttons
- Recent devices list with live status
- Auto-refresh every 10 seconds
- Pull-to-refresh support

### 3. Devices List
- Search functionality
- Live status indicators
- Add device modal
- Device registration with ID and name
- Pull-to-refresh

### 4. Device Detail
- Live device status
- Interactive map with device location
- Control buttons (Buzz, Request Position, Arm, Disarm)
- Alert history timeline
- Auto-refresh every 5 seconds

## 🔐 API Integration

The app connects to the backend at `https://iot.fyuko.app`

### Authentication Flow
1. User logs in → receives `auth_token`
2. Token stored in AsyncStorage
3. Token sent in `X-Auth-Token` header for all requests
4. Auto-logout on 401 errors

### API Endpoints Used
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me/devices` - Get user's devices
- `POST /devices/register` - Register new device
- `DELETE /devices/{id}` - Remove device
- `GET /devices/{id}/status` - Get device online status
- `GET /devices/{id}/current` - Get current device data
- `GET /api/devices/{id}/alerts` - Get device alerts
- `POST /api/send/{id}` - Send command to device

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366F1) - Calm, professional
- **Secondary**: Amber (#F59E0B) - Warm accent
- **Success**: Green (#10B981) - Online status
- **Danger**: Red (#EF4444) - Alerts, offline
- **Grays**: High contrast for readability

### Typography
- System fonts for performance
- Font sizes: 12px - 32px
- Font weights: 400, 500, 600, 700

### Spacing
- Consistent spacing scale (4, 8, 16, 24, 32, 48)
- Border radius: 4px - 24px
- Card padding: 16px default

## 🚦 Running in Production

### Build for Android
```bash
npm run android
# or with EAS
eas build --platform android
```

### Build for iOS
```bash
npm run ios
# or with EAS
eas build --platform ios
```

## 📝 Configuration

To change the API URL, edit `src/constants/theme.ts`:

```typescript
export const API_BASE_URL = 'https://your-api-url.com';
```

## 🐛 Troubleshooting

### Maps not showing
- Ensure you have internet connection
- Maps use default provider (no API key needed)
- Check device location permissions

### Authentication issues
- Check backend is running at correct URL
- Verify AsyncStorage is working (clear app data if needed)
- Check network inspector for API errors

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Development

Created with ❤️ using React Native and Expo.

For backend documentation, see `server.py` in the parent directory.
