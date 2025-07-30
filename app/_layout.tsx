import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import './global.css'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'

export default function RootLayout() {
  const insets = useSafeAreaInsets()

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack />
      <View style={{ height: insets.bottom }} />
    </ThemeProvider>
  )
}
