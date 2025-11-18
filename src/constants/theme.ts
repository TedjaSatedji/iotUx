export const COLORS = {
  // Primary colors - calm and professional
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Secondary colors - warm accent
  secondary: '#F59E0B',
  secondaryDark: '#D97706',
  secondaryLight: '#FBBF24',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  // Online/Offline indicators
  online: '#10B981',
  offline: '#6B7280',
  
  // Neutral colors - calm and easy on eyes
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays - high contrast for readability
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background colors
  background: '#F9FAFB',
  backgroundDark: '#111827',
  
  // Card colors
  card: '#FFFFFF',
  cardDark: '#1F2937',
  
  // Glassmorphism
  glassLight: 'rgba(255, 255, 255, 0.15)',
  glassDark: 'rgba(255, 255, 255, 0.05)',
  
  // Bubble colors for login animation
  bubble1: 'rgba(99, 102, 241, 0.3)', // Indigo
  bubble2: 'rgba(139, 92, 246, 0.3)', // Purple
  bubble3: 'rgba(59, 130, 246, 0.3)', // Blue
  bubble4: 'rgba(16, 185, 129, 0.3)', // Green
  bubble5: 'rgba(245, 158, 11, 0.3)', // Amber
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const API_BASE_URL = 'https://iot.fyuko.app';
