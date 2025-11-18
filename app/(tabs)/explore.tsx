import { Redirect } from 'expo-router';

// This tab is hidden, redirect to devices
export default function TabTwoScreen() {
  return <Redirect href="/(tabs)/devices" />;
}
