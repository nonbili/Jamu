import { Link, Redirect, Stack } from 'expo-router'
import { Image } from 'expo-image'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Button, ContextMenu } from '@expo/ui/jetpack-compose'
import { colors } from '@/lib/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SettingsModal } from '@/components/modal/SettingsModal'

const items = [
  ['/gojuon', '🔤 五十音'],
  ['/number', '🔢 数字'],
  ['/nhk', '📰 NHK Easy News'],
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
                {/* @ts-expect-error ?? */}
                <ContextMenu.Items>
                  <Button
                    elementColors={{
                      containerColor: colors.bg,
                      contentColor: colors.text,
                    }}
                    onPress={() => setSettingsModalShown(true)}
                  >
                    About
                  </Button>
                </ContextMenu.Items>
                <ContextMenu.Trigger>
                  <MaterialIcons.Button
                    color={colors.icon}
                    backgroundColor="transparent"
                    iconStyle={{ marginRight: 0 }}
                    name="more-vert"
                    size={24}
                    underlayColor={colors.underlay}
                  />
                </ContextMenu.Trigger>
              </ContextMenu>
            </View>
          ),
        }}
      />
      <ScrollView className="">
        {items.map(([path, label]) => (
          <Link className="mt-1" href={path as any} key={path}>
            <View className="w-full bg-white px-4 py-5">
              <Text className="text-xl">{label}</Text>
            </View>
          </Link>
        ))}
      </ScrollView>
      {settingsModalShown && <SettingsModal onClose={() => setSettingsModalShown(false)} />}
    </>
  )
}
