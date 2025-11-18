import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'armed' | 'disarmed' | 'warning';
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label,
  size = 'medium' 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return COLORS.online;
      case 'offline':
        return COLORS.offline;
      case 'armed':
        return COLORS.warning;
      case 'disarmed':
        return COLORS.info;
      case 'warning':
        return COLORS.danger;
      default:
        return COLORS.gray400;
    }
  };

  const getStatusLabel = () => {
    if (label) return label;
    
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'armed':
        return 'Armed';
      case 'disarmed':
        return 'Disarmed';
      case 'warning':
        return 'Warning';
      default:
        return status;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          dotSize: 6,
          fontSize: FONT_SIZES.xs,
          paddingVertical: SPACING.xs / 2,
          paddingHorizontal: SPACING.xs,
        };
      case 'large':
        return {
          dotSize: 10,
          fontSize: FONT_SIZES.md,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
        };
      default:
        return {
          dotSize: 8,
          fontSize: FONT_SIZES.sm,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const statusColor = getStatusColor();

  return (
    <View
      style={[
        styles.badge,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          backgroundColor: `${statusColor}15`,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            width: sizeStyles.dotSize,
            height: sizeStyles.dotSize,
            backgroundColor: statusColor,
          },
        ]}
      />
      <Text
        style={[
          styles.label,
          {
            fontSize: sizeStyles.fontSize,
            color: statusColor,
          },
        ]}
      >
        {getStatusLabel()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
  },
  label: {
    fontWeight: '600',
  },
});
