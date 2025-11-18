import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [COLORS.primary, COLORS.primaryDark];
      case 'secondary':
        return [COLORS.secondary, COLORS.secondaryDark];
      case 'danger':
        return [COLORS.danger, '#DC2626'];
      default:
        return [COLORS.gray300, COLORS.gray400];
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      ...SHADOWS.medium,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: 'transparent',
      };
    }

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    let paddingVertical = SPACING.md;
    let paddingHorizontal = SPACING.lg;

    if (size === 'small') {
      paddingVertical = SPACING.sm;
      paddingHorizontal = SPACING.md;
    } else if (size === 'large') {
      paddingVertical = SPACING.lg;
      paddingHorizontal = SPACING.xl;
    }

    return {
      paddingVertical,
      paddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };
  };

  const getTextStyle = (): TextStyle => {
    let fontSize = FONT_SIZES.md;

    if (size === 'small') {
      fontSize = FONT_SIZES.sm;
    } else if (size === 'large') {
      fontSize = FONT_SIZES.lg;
    }

    return {
      fontSize,
      fontWeight: '600',
      color: variant === 'outline' ? COLORS.primary : COLORS.white,
    };
  };

  const buttonContent = (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyle(), style]}
      activeOpacity={0.8}
    >
      {variant === 'outline' ? (
        <View style={getContentStyle()}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : (
            <Text style={getTextStyle()}>{title}</Text>
          )}
        </View>
      ) : (
        <LinearGradient colors={getGradientColors()} style={getContentStyle()}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={getTextStyle()}>{title}</Text>
          )}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  return buttonContent;
};

import { View } from 'react-native';
