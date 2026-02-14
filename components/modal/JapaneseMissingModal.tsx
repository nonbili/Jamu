import { Modal, Text, Pressable, View, TouchableOpacity, useColorScheme as useSystemColorScheme } from 'react-native'
import { useValue } from '@legendapp/state/react'
import { ui$ } from '@/states/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { settings$ } from '@/states/settings'
import { useMemo } from 'react'

export const JapaneseMissingModal = () => {
  const insets = useSafeAreaInsets()
  const open = useValue(ui$.japaneseMissingModalOpen)
  const onClose = () => ui$.japaneseMissingModalOpen.set(false)
  const theme = useValue(settings$.theme)
  const systemColorScheme = useSystemColorScheme()

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark'
    }
    return theme === 'dark'
  }, [theme, systemColorScheme])

  return (
    open && (
      <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
        <View
          className="flex-1 bg-slate-50 dark:bg-slate-950"
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,
          }}
        >
          <View className="flex-1">
            <View className="items-center my-8">
              <Text className="text-lg font-medium dark:text-white">Install Japanese Language</Text>
            </View>
            <View>
              <Text className="mb-4 leading-[20px] dark:text-slate-300">
                We use Android Text-to-Speech to read kana and number, Japanese seems to be missing on your device,
                please install it.
              </Text>
              <Text className="mb-2 leading-[20px] dark:text-slate-300">1. Open the system settings</Text>
              <Text className="mb-2 leading-[20px] dark:text-slate-300">
                2. Navigate to System &gt; Language & region &gt; Speech &gt; Text-to-speech output &gt; Preferrerd
                engine &gt; Install voice data
              </Text>
              <Text className="mb-2 leading-[20px] dark:text-slate-300">3. Select Japanese</Text>
            </View>
          </View>
          <View className="items-center mt-12">
            <TouchableOpacity onPress={onClose} className="py-2 px-6 bg-slate-200 dark:bg-slate-800 rounded-full">
              <Text className="text-center dark:text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  )
}
