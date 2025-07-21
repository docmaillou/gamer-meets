const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          // Add packages that need to be transpiled for web
          '@expo/vector-icons',
          'react-native-svg',
          'expo-linear-gradient',
        ]
      }
    },
    argv
  );

  // Customize the config before returning it
  
  // Add support for React Native Web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
    'react-native/Libraries/vendor/emitter/EventEmitter$': 'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
    'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter'
  };

  // Configure module rules for better compatibility
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    use: 'babel-loader',
    exclude: /node_modules\/(?!(react-native-.*|@expo\/.*|expo-.*))/
  });

  // Ensure proper file extensions are resolved
  config.resolve.extensions = [
    '.web.tsx',
    '.web.ts', 
    '.web.jsx',
    '.web.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.json'
  ];

  // Add polyfills for better browser compatibility
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util"),
    "buffer": require.resolve("buffer")
  };

  return config;
};