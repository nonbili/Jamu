import React from 'react'
import { Text, View } from 'react-native'
import { useValue } from '@legendapp/state/react'
import { ui$ } from '@/states/ui'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export const Toast = () => {
  const toast = useValue(ui$.toast)

  if (!toast.visible) return null

  return (
    <View className="absolute bottom-24 left-0 right-0 items-center pointer-events-none" style={{ zIndex: 9999 }}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="bg-slate-800/90 dark:bg-slate-200/90 px-6 py-2 rounded-full"
      >
        <Text className="text-white dark:text-slate-900 font-medium">{toast.message}</Text>
      </Animated.View>
    </View>
  )
}
