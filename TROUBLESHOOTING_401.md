# 🔧 Quick Fix Guide - 401 Error

## Problem
Seeing "Failed to load data: Request failed with status code 401" error?

## Root Cause
There's an old/invalid authentication token stored in the app. This happens when:
- You logged in before but the session expired
- You're testing and switching between different accounts
- The backend was reset but your app still has old tokens

## Solution

### Method 1: Use Debug Tool (Recommended)
1. On the Login screen, click "🔧 API Debug Tool"
2. Click "Clear Storage" button
3. Go back and login again

### Method 2: Force Clear on iOS
1. Close the app completely
2. Open Expo Go app
3. Shake device → Clear React Native packager cache
4. Reopen the app

### Method 3: Reinstall
1. Close Expo Go
2. Reopen and scan QR code again

## Why This Happens
The app stores your login token locally for convenience. When you see 401:
- ✅ The app is working correctly
- ✅ Security is working (rejecting invalid tokens)
- ⚠️ You just need to clear old data and login fresh

## Prevention
After clearing storage once, this shouldn't happen again unless:
- You don't use the app for a long time (session expires)
- Backend server is reset/updated
- You manually logout and login with different account

## Still Having Issues?
Check the Debug Tool to:
1. Verify API connection: `Test Login API`
2. Check token validity: `Test /user/me`
3. See what's stored: `Check Storage`
