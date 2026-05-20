import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import './global.css'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme as useSystemColorScheme } from 'react-native'
import { colors } from '@/lib/colors'
import { useValue } from '@legendapp/state/react'
import { settings$ } from '@/states/settings'
import { useColorScheme } from 'nativewind'
import { useEffect } from 'react'
import { Toast } from '@/components/Toast'

export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const theme = useValue(settings$.theme)
  const { setColorScheme } = useColorScheme()
  const systemColorScheme = useSystemColorScheme()

  // Resolve 'system' to a concrete scheme before handing it to nativewind.
  // nativewind/react-native-css-interop calls Appearance.setColorScheme(null)
  // for 'system', and null crashes the native non-null check on this RN version.
  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark'

  useEffect(() => {
    setColorScheme(isDark ? 'dark' : 'light')
  }, [setColorScheme, isDark])

  const currentColors = isDark ? colors.dark : colors.light

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTintColor: currentColors.text,
          headerTitleStyle: { color: currentColors.text },
          headerStyle: { backgroundColor: currentColors.bg },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: currentColors.bg, paddingBottom: insets.bottom },
        }}
      />
      <Toast />
    </>
  )
}
