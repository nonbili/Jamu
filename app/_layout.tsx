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
import { Toast } from '@/components/Toast'

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const theme = useValue(settings$.theme)
  const { setColorScheme } = useColorScheme()
  const systemColorScheme = useSystemColorScheme()

  useEffect(() => {
    setColorScheme(theme)
  }, [setColorScheme, theme])

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
      <>
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
        {insets.bottom > 0 && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: insets.bottom,
              backgroundColor: currentColors.bg,
            }}
          />
        )}
        <Toast />
      </>
    </ThemeProvider>
  )
}
