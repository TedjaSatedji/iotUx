const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure platform-specific extensions are resolved correctly
config.resolver.sourceExts = [...config.resolver.sourceExts, 'tsx', 'ts', 'jsx', 'js'];
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;
