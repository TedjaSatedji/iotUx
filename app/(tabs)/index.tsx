import { Redirect } from 'expo-router';

// Redirect to devices tab (dashboard)
export default function HomeScreen() {
  return <Redirect href="/(tabs)/devices" />;
}
