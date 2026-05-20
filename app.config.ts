import 'ts-node/register'

import { ExpoConfig } from 'expo/config'
import { version, versionCode, buildNumber } from './package.json'

module.exports = ({ config }: { config: ExpoConfig }) => {
  return {
    name: 'Jamu',
    slug: 'jamu',
    version,
    icon: './assets/images/icon.png',
    scheme: 'jamu',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'jp.nonbili.jamu',
      buildNumber,
    },
    android: {
      versionCode,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'jp.nonbili.jamu',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-font',
      'expo-audio',
      'expo-image',
      'expo-web-browser',
      './plugins/withAndroidPlugin.ts',
    ],
    experiments: {
      typedRoutes: true,
    },
  }
}
