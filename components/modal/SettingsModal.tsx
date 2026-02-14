import { Modal, Text, Pressable, View, Switch, ScrollView, useColorScheme as useSystemColorScheme } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { version } from '../../package.json'
import { useState, useMemo } from 'react'
import { useValue } from '@legendapp/state/react'
import { settings$ } from '@/states/settings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const repo = 'https://github.com/nonbili/Jamu'

type Tab = 'settings' | 'about'

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const insets = useSafeAreaInsets()
  const { quizCategories, theme } = useValue(settings$)
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const systemColorScheme = useSystemColorScheme()

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark'
    }
    return theme === 'dark'
  }, [theme, systemColorScheme])

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <View
        className="flex-1 bg-slate-50 dark:bg-slate-950"
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        <View className="flex-row justify-center mb-6">
          <View className="flex-row bg-slate-200 dark:bg-slate-800 rounded-xl p-1">
            <Pressable
              onPress={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-lg ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700' : 'bg-transparent'}`}
            >
              <Text className={`font-medium ${activeTab === 'settings' ? 'text-black dark:text-white' : 'text-slate-500'}`}>Settings</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('about')}
              className={`px-6 py-2 rounded-lg ${activeTab === 'about' ? 'bg-white dark:bg-slate-700' : 'bg-transparent'}`}
            >
              <Text className={`font-medium ${activeTab === 'about' ? 'text-black dark:text-white' : 'text-slate-500'}`}>About</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1">
          {activeTab === 'settings' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-8">
                <Text className="text-[12px] font-bold text-slate-500 mb-4 uppercase">
                  Appearance
                </Text>
                <View className="bg-white dark:bg-slate-900 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base dark:text-white">Theme</Text>
                    <View className="flex-row bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <Pressable
                          key={t}
                          onPress={() => {
                            // Use requestAnimationFrame to defer the state change 
                            // and avoid immediate re-render cycles that might 
                            // break the navigation context in the parent.
                            requestAnimationFrame(() => {
                              settings$.theme.set(t)
                            })
                          }}
                          className={`px-3 py-1.5 rounded-md ${theme === t ? 'bg-white dark:bg-slate-600' : ''}`}
                        >
                          <Text className={`text-xs capitalize ${theme === t ? 'text-black dark:text-white font-bold' : 'text-slate-500'}`}>
                            {t}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              <View className="mb-8">
                <Text className="text-[12px] font-bold text-slate-500 mb-4 uppercase">
                  Quiz Categories
                </Text>
                <View className="bg-white dark:bg-slate-900 rounded-2xl p-4">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-base dark:text-white">五十音 (Kana)</Text>
                    <Switch
                      value={quizCategories.gojuon}
                      onValueChange={(val) => settings$.quizCategories.gojuon.set(val)}
                    />
                  </View>
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-base dark:text-white">数字 (Numbers)</Text>
                    <Switch
                      value={quizCategories.numbers}
                      onValueChange={(val) => settings$.quizCategories.numbers.set(val)}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base dark:text-white">都道府県 (Prefectures)</Text>
                    <Switch
                      value={quizCategories.todofuken}
                      onValueChange={(val) => settings$.quizCategories.todofuken.set(val)}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View className="flex-1">
              <View className="items-center my-8">
                <Text className="text-2xl font-bold dark:text-white">Jamu</Text>
                <Text className="text-slate-500 mt-1">v{version}</Text>
              </View>
              <View className="bg-white dark:bg-slate-900 rounded-2xl p-4">
                <Text className="font-bold mb-2 dark:text-white">Source code</Text>
                <Pressable onPress={() => WebBrowser.openBrowserAsync(repo)}>
                  <Text className="text-blue-600 dark:text-blue-400">{repo}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View className="items-center mt-4">
          <Pressable 
            onPress={onClose}
            className="py-2 px-12 bg-slate-200 dark:bg-slate-800 rounded-full"
          >
            <Text className="font-medium dark:text-white">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
