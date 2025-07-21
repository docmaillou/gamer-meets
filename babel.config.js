module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': '.',
            '@/components': './components',
            '@/services': './services',
            '@/hooks': './hooks',
            '@/types': './types',
            '@/utils': './utils',
            '@/context': './context',
            '@/translations': './translations'
          }
        }
      ]
    ]
  };
};