module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // ⚠️ garde seulement un des deux
    'react-native-worklets/plugin',

    // si tu utilises aussi VisionCamera
    // 'react-native-worklets-core/plugin',
  ],
};