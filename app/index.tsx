import { Redirect } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { authAPI } from '../src/services/api';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start splash animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const authenticated = await authAPI.isAuthenticated();
      console.log('✅ Auth check result:', authenticated);
      
      // Minimum splash duration (like Instagram)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        setIsAuthenticated(authenticated);
      });
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      await authAPI.logout();
      
      // Still show splash animation before showing error
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
        setIsAuthenticated(false);
      });
    }
  };

  // Show splash screen
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View
          style={[
            styles.splashContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  }

  if (isAuthenticated === null) {
    return null; // Should never reach here with new flow
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/devices" />;
  }

  return <LoginScreen />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 225,
    height: 225,
  },
});
