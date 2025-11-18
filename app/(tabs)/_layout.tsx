import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { COLORS, FONT_SIZES } from '../../src/constants/theme';
import { authAPI } from '../../src/services/api';

function TabIcon({ icon }: { icon: string }) {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
}

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok = await authAPI.isAuthenticated();
        if (mounted && !ok) {
          router.replace('/');
        }
      } catch {
        if (mounted) router.replace('/');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray200,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
        },
      }}
    >
      {/* Hidden home tab - redirect to dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      
      {/* Main devices/dashboard tab */}
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => <TabIcon icon="📊" />,
        }}
      />
      
      {/* Hide explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}