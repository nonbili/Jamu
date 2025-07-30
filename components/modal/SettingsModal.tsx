import { Button, Modal, Text, Pressable, View, Switch, TouchableOpacity, ActivityIndicator } from 'react-native'
import { NouLink } from '../NouLink'
import { version } from '../../package.json'
import { useState } from 'react'
import { colors } from '@/lib/colors'
import { clsx } from '@/lib/utils'
import { use$ } from '@legendapp/state/react'

const repo = 'https://github.com/nonbili/Jamu'

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View className="flex-1 bg-[#f5f5f4] py-4 px-4">
        <View className="flex-1">
          <View className="items-center my-8">
            <Text className="text-lg font-medium">Jamu</Text>
            <Text>v{version}</Text>
          </View>
          <View className="">
            <Text className="font-medium">Source code</Text>
            <NouLink className="text-blue-600" href={repo}>
              {repo}
            </NouLink>
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
}
