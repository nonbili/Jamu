import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import './global.css'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { colors } from '@/lib/colors'

export default function RootLayout() {
  const insets = useSafeAreaInsets()

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      />
      <View style={{ height: insets.bottom, backgroundColor: colors.bg }} />
    </ThemeProvider>
  )
}
