import { Link, Redirect, Stack } from 'expo-router'
import { Image } from 'expo-image'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Button, ContextMenu } from '@expo/ui/jetpack-compose'
import { colors } from '@/lib/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SettingsModal } from '@/components/modal/SettingsModal'
import { JapaneseMissingModal } from '@/components/modal/JapaneseMissingModal'

const items = [
  ['/gojuon', '🔤 五十音'],
  ['/number', '🔢 数字'],
  ['/nhk', '📰 NHK Easy News'],
  ['/quiz', '❓ クイズ'],
]

export default function HomeScreen() {
  const [settingsModalShown, setSettingsModalShown] = useState(false)

  return (
    <>
      <Stack.Screen
        options={{
          title: '🎌',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View className="-mr-3">
              <ContextMenu color={colors.bg}>
                <ContextMenu.Items>
                  <Button
                    elementColors={{
                      containerColor: colors.bg,
                      contentColor: colors.text,
                    }}
                    onPress={() => setSettingsModalShown(true)}
                  >
                    Settings
                  </Button>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                  <Button
                    elementColors={{
                      containerColor: 'transparent',
                      contentColor: colors.icon,
                    }}
                    leadingIcon="filled.MoreVert"
                  />
                </ContextMenu.Trigger>
              </ContextMenu>
            </View>
          ),
        }}
      />
      <ScrollView className="bg-slate-50">
        {items.map(([path, label]) => (
          <Link className="mt-1" href={path as any} key={path} asChild>
            <Pressable className="w-full bg-white px-4 py-5 active:bg-slate-100">
              <Text className="text-xl">{label}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
      {settingsModalShown && <SettingsModal onClose={() => setSettingsModalShown(false)} />}
      <JapaneseMissingModal />
    </>
  )
}
