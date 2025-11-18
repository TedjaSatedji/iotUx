/**
 * Web Polyfills for React Native modules
 * This file provides web-compatible shims for native-only modules
 */

// Polyfill for react-native-safe-area-context on web
if (typeof window !== 'undefined') {
  // Mock SafeAreaProvider
  const React = require('react');
  
  const SafeAreaProvider = ({ children }) => {
    return React.createElement(React.Fragment, null, children);
  };

  const SafeAreaView = ({ children, style, ...props }) => {
    const View = require('react-native').View;
    return React.createElement(View, { style, ...props }, children);
  };

  const useSafeAreaInsets = () => {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  };

  const useSafeAreaFrame = () => {
    return {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  // Export mocks
  if (typeof module !== 'undefined') {
    module.exports = {
      SafeAreaProvider,
      SafeAreaView,
      useSafeAreaInsets,
      useSafeAreaFrame,
      SafeAreaInsetsContext: React.createContext({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }),
      SafeAreaFrameContext: React.createContext({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    };
  }
}
