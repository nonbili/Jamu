import { Button, Modal, Text, Pressable, View, Switch, TouchableOpacity, ActivityIndicator } from 'react-native'
import { NouLink } from '../NouLink'
import { version } from '../../package.json'
import { useState } from 'react'
import { colors } from '@/lib/colors'
import { clsx } from '@/lib/utils'
import { use$ } from '@legendapp/state/react'
import { ui$ } from '@/states/ui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const repo = 'https://github.com/nonbili/Jamu'

export const JapaneseMissingModal = () => {
  const insets = useSafeAreaInsets()
  const open = use$(ui$.japaneseMissingModalOpen)
  const onClose = () => ui$.japaneseMissingModalOpen.set(false)

  return (
    open && (
      <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#f5f5f4',
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 16,
          }}
        >
          <View className="flex-1">
            <View className="items-center my-8">
              <Text className="text-lg font-medium">Install Japanese Language</Text>
            </View>
            <View className="leading-[40px]">
              <Text className="mb-4 leading-[20px]">
                We use Android Text-to-Speech to read kana and number, Japanese seems to be missing on your device,
                please install it.
              </Text>
              <Text className="mb-2 leading-[20px]">1. Open the system settings</Text>
              <Text className="mb-2 leading-[20px]">
                2. Navigate to System &gt; Language & region &gt; Speech &gt; Text-to-speech output &gt; Preferrerd
                engine &gt; Install voice data
              </Text>
              <Text className="mb-2 leading-[20px]">3. Select Japanese</Text>
            </View>
          </View>
          <View className="items-center mt-12">
            <TouchableOpacity onPress={onClose}>
              <Text className="py-2 px-6 text-center bg-gray-200 rounded-full">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  )
}
