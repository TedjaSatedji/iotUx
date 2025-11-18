import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface FloatingOrbProps {
  colors: string[];
  duration: number;
  delay: number;
  size: number;
  initialX: number;
  initialY: number;
  moveX: number;
  moveY: number;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({
  colors,
  duration,
  delay,
  size,
  initialX,
  initialY,
  moveX,
  moveY,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in with delay
    setTimeout(() => {
      opacity.value = withTiming(0.8, { 
        duration: 1500,
        easing: Easing.out(Easing.cubic) 
      });
    }, delay);

    // Complex floating motion (3-step cycle)
    translateX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(moveX * 0.3, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.quad) 
        }),
        withTiming(-moveX * 0.2, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.quad) 
        }),
        withTiming(0, { 
          duration: duration * 0.34, 
          easing: Easing.inOut(Easing.quad) 
        })
      ),
      -1,
      false
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-moveY * 0.15, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.quad) 
        }),
        withTiming(moveY * 0.12, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.quad) 
        }),
        withTiming(0, { 
          duration: duration * 0.34, 
          easing: Easing.inOut(Easing.quad) 
        })
      ),
      -1,
      false
    );

    // Breathing scale effect
    scale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 0 }),
        withTiming(1, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(0.9, { 
          duration: duration * 0.33, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(0.8, { 
          duration: duration * 0.34, 
          easing: Easing.inOut(Easing.sin) 
        })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          left: initialX,
          top: initialY,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
};

export const AuroraWaves: React.FC = () => {
  // Aurora orb configurations - inspired by HTML design
  const orbs = [
    {
      colors: ['rgba(0, 212, 255, 0.35)', 'rgba(0, 212, 255, 0.15)'], // Cyan - increased opacity
      duration: 8000,
      delay: 0,
      size: width * 0.975, // 1.5 * 0.65 = 0.975
      initialX: -width * 0.2,
      initialY: height * 0.1,
      moveX: width * 0.3,
      moveY: height * 0.15,
    },
    {
      colors: ['rgba(123, 44, 191, 0.28)', 'rgba(123, 44, 191, 0.12)'], // Purple - increased opacity
      duration: 10000,
      delay: 500,
      size: width * 1.17, // 1.8 * 0.65 = 1.17
      initialX: width * 0.5,
      initialY: height * 0.3,
      moveX: -width * 0.25,
      moveY: height * 0.12,
    },
    {
      colors: ['rgba(0, 245, 255, 0.25)', 'rgba(0, 245, 255, 0.1)'], // Bright Cyan - increased opacity
      duration: 9000,
      delay: 1000,
      size: width * 0.91, // 1.4 * 0.65 = 0.91
      initialX: -width * 0.1,
      initialY: height * 0.65,
      moveX: width * 0.28,
      moveY: -height * 0.1,
    },
    {
      colors: ['rgba(90, 103, 216, 0.3)', 'rgba(90, 103, 216, 0.15)'], // Indigo - increased opacity
      duration: 11000,
      delay: 1500,
      size: width * 1.04, // 1.6 * 0.65 = 1.04
      initialX: width * 0.4,
      initialY: -height * 0.05,
      moveX: -width * 0.22,
      moveY: height * 0.15,
    },
    {
      colors: ['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0.08)'], // Pink - increased opacity
      duration: 12000,
      delay: 2000,
      size: width * 1.105, // 1.7 * 0.65 = 1.105
      initialX: width * 0.6,
      initialY: height * 0.75,
      moveX: -width * 0.2,
      moveY: -height * 0.13,
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Pure black background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

      {/* Floating aurora orbs */}
      {orbs.map((orb, index) => (
        <FloatingOrb
          key={index}
          colors={orb.colors}
          duration={orb.duration}
          delay={orb.delay}
          size={orb.size}
          initialX={orb.initialX}
          initialY={orb.initialY}
          moveX={orb.moveX}
          moveY={orb.moveY}
        />
      ))}

      {/* Radial gradient overlay for depth */}
      <View style={styles.gradientOverlay} />

      {/* Blur layer for smooth aurora effect - stronger blur for softer edges */}
      <BlurView intensity={25} tint="dark" style={styles.blurOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  orbGradient: {
    flex: 1,
    borderRadius: 9999,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    opacity: 0.4,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
