import { Modal, Text, Pressable, View, Switch } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { version } from '../../package.json'
import { useState } from 'react'
import { use$ } from '@legendapp/state/react'
import { settings$ } from '@/states/settings'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const repo = 'https://github.com/nonbili/Jamu'

type Tab = 'settings' | 'about'

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const insets = useSafeAreaInsets()
  const { quizCategories } = use$(settings$)
  const [activeTab, setActiveTab] = useState<Tab>('settings')

  return (
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderRadius: 12, padding: 4 }}>
            <Pressable
              onPress={() => setActiveTab('settings')}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: activeTab === 'settings' ? 'white' : 'transparent',
              }}
            >
              <Text style={{ fontWeight: '500', color: activeTab === 'settings' ? 'black' : '#6b7280' }}>Settings</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('about')}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: activeTab === 'about' ? 'white' : 'transparent',
              }}
            >
              <Text style={{ fontWeight: '500', color: activeTab === 'about' ? 'black' : '#6b7280' }}>About</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {activeTab === 'settings' ? (
            <View style={{ marginBottom: 32 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 16, textTransform: 'uppercase' }}>
                Quiz Categories
              </Text>
              <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={{ fontSize: 16 }}>五十音 (Kana)</Text>
                  <Switch
                    value={quizCategories.gojuon}
                    onValueChange={(val) => settings$.quizCategories.gojuon.set(val)}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={{ fontSize: 16 }}>数字 (Numbers)</Text>
                  <Switch
                    value={quizCategories.numbers}
                    onValueChange={(val) => settings$.quizCategories.numbers.set(val)}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16 }}>都道府県 (Prefectures)</Text>
                  <Switch
                    value={quizCategories.todofuken}
                    onValueChange={(val) => settings$.quizCategories.todofuken.set(val)}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ alignItems: 'center', marginVertical: 32 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Jamu</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>v{version}</Text>
              </View>
              <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Source code</Text>
                <Pressable onPress={() => WebBrowser.openBrowserAsync(repo)}>
                  <Text style={{ color: '#2563eb' }}>{repo}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Pressable 
            onPress={onClose}
            style={{ paddingVertical: 8, paddingHorizontal: 48, backgroundColor: '#e5e7eb', borderRadius: 9999 }}
          >
            <Text style={{ fontWeight: '500' }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
