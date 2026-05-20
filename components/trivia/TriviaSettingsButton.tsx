import { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useValue } from '@legendapp/state/react'
import { settings$ } from '@/states/settings'
import { languageNames } from '@/lib/trivia'
import { colors } from '@/lib/colors'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const LANGS = ['en', 'zh', 'fr', 'it', 'es']

function TriviaSettingsModal({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets()
  const { triviaBilingual, triviaLang } = useValue(settings$)

  const selectNoTranslation = () => settings$.triviaBilingual.set(false)
  const selectLang = (lang: string) => settings$.assign({ triviaLang: lang, triviaBilingual: true })

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View
        className="flex-1 bg-slate-50 dark:bg-slate-950"
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        <Text className="text-[12px] font-bold text-slate-500 mb-4 uppercase">翻訳</Text>

        <View className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <Pressable
            onPress={selectNoTranslation}
            className="flex-row items-center justify-between px-4 py-3 active:bg-slate-100 dark:active:bg-slate-800"
          >
            <Text className="text-base dark:text-white">翻訳なし</Text>
            {!triviaBilingual && <MaterialIcons name="check" size={20} color="#2563eb" />}
          </Pressable>
          {LANGS.map((lang) => (
            <Pressable
              key={lang}
              onPress={() => selectLang(lang)}
              className="flex-row items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 active:bg-slate-100 dark:active:bg-slate-800"
            >
              <Text className="text-base dark:text-white">{languageNames[lang] ?? lang}</Text>
              {triviaBilingual && triviaLang === lang && (
                <MaterialIcons name="check" size={20} color="#2563eb" />
              )}
            </Pressable>
          ))}
        </View>

        <View className="items-center mt-auto">
          <Pressable onPress={onClose} className="py-2 px-12 bg-slate-200 dark:bg-slate-800 rounded-full">
            <Text className="font-medium dark:text-white">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export function TriviaSettingsButton() {
  const [open, setOpen] = useState(false)
  const { colorScheme } = useColorScheme()
  const c = colors[colorScheme === 'dark' ? 'dark' : 'light']

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={8}>
        <MaterialIcons name="translate" size={24} color={c.icon} />
      </Pressable>
      {open && <TriviaSettingsModal onClose={() => setOpen(false)} />}
    </>
  )
}
