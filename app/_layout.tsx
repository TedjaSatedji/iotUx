import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NetworkService } from '../src/utils/network-utils';

export default function RootLayout() {
  useEffect(() => {
    // Initialize network service on app startup
    NetworkService.init();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="device-detail" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
