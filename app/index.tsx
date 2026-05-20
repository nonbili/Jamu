import { Link, Stack } from 'expo-router'
import { Pressable, ScrollView, Text, Platform } from 'react-native'
import { useState } from 'react'
import { SettingsModal } from '@/components/modal/SettingsModal'
import { JapaneseMissingModal } from '@/components/modal/JapaneseMissingModal'
import { NouMenu } from '@/components/menu/NouMenu'

const items = [
  ['/gojuon', '🔤 五十音'],
  ['/number', '🔢 数字'],
  ['/nhk', '📰 NHK Easy News'],
  ['/quiz', '💡 クイズ'],
  ['/trivia', '🫘 豆知識'],
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
            <NouMenu
              trigger={Platform.OS === 'ios' ? 'ellipsis' : 'filled.MoreVert'}
              items={[
                {
                  label: 'Settings',
                  handler: () => setSettingsModalShown(true),
                },
              ]}
            />
          ),
        }}
      />
      <ScrollView className="bg-slate-50 dark:bg-slate-950">
        {items.map(([path, label]) => (
          <Link className="mt-1" href={path as any} key={path} asChild>
            <Pressable className="w-full bg-white dark:bg-slate-900 px-4 py-5 active:bg-slate-100 dark:active:bg-slate-800">
              <Text className="text-xl dark:text-white">{label}</Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
      {settingsModalShown && <SettingsModal onClose={() => setSettingsModalShown(false)} />}
      <JapaneseMissingModal />
    </>
  )
}
