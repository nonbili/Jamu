import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import './global.css'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View, useColorScheme as useSystemColorScheme } from 'react-native'
import { colors } from '@/lib/colors'
import { useValue } from '@legendapp/state/react'
import { settings$ } from '@/states/settings'
import { useColorScheme } from 'nativewind'
import { useEffect, useMemo } from 'react'

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const theme = useValue(settings$.theme)
  const { setColorScheme } = useColorScheme()
  const systemColorScheme = useSystemColorScheme()

  useEffect(() => {
    setColorScheme(theme)
  }, [theme])

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark'
    }
    return theme === 'dark'
  }, [theme, systemColorScheme])

  const navigationTheme = useMemo(() => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: isDark ? colors.dark.bg : colors.light.bg,
    },
  }), [isDark])

  const currentColors = isDark ? colors.dark : colors.light

  return (
    <ThemeProvider value={navigationTheme}>
      <View style={{ flex: 1, backgroundColor: currentColors.bg }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerTintColor: currentColors.text,
            headerTitleStyle: { color: currentColors.text },
            headerStyle: { backgroundColor: currentColors.bg },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: currentColors.bg },
          }}
        />
        <View style={{ height: insets.bottom, backgroundColor: currentColors.bg }} />
      </View>
    </ThemeProvider>
  )
}
