const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-safe-area-context'],
      },
    },
    argv
  );

  // Add aliases for native modules on web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-safe-area-context': 'react-native-safe-area-context/src/index.tsx',
  };

  return config;
};
