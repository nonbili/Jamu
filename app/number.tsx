import { Image } from 'expo-image'
import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fragment, useState } from 'react'
import { Stack } from 'expo-router'
import { Tabs } from '@/components/tabs/Tabs'
import { measureWords } from '@/lib/numbers'
import { Kana } from '@/components/Kana'
import { colors } from '@/lib/colors'
import { speakJa, stopJa } from '@/components/Kana'
import { useColorScheme } from 'nativewind'

const items0: [number, string, string][] = [
  [1, '一', 'いち'],
  [2, '二', 'に'],
  [3, '三', 'さん'],
  [4, '四', 'よん し'],
  [5, '五', 'ご'],
  [6, '六', 'ろく'],
  [7, '七', 'なな しち'],
  [8, '八', 'はち'],
  [9, '九', 'きゅう く'],
  [10, '十', 'じゅう'],
  [11, '十一', 'じゅういち'],
  [12, '十二', 'じゅうに'],
  [13, '十三', 'じゅうさん'],
  [14, '十四', 'じゅうよん じゅうし'],
  [15, '十五', 'じゅうご'],
  [16, '十六', 'じゅうろく'],
  [17, '十七', 'じゅうなな じゅうしち'],
  [18, '十八', 'じゅうはち'],
  [19, '十九', 'じゅうきゅう じゅうく'],
  [20, '二十', 'にじゅう'],
  [30, '三十', 'さんじゅう'],
  [40, '四十', 'よんじゅう'],
  [50, '五十', 'ごじゅう'],
  [60, '六十', 'ろくじゅう'],
  [70, '七十', 'ななじゅう'],
  [80, '八十', 'はちじゅう'],
  [90, '九十', 'きゅうじゅう'],
]

const tabs1 = ['百', '千', '月', '日', '時', '分', '秒']
const tabs2 = Object.keys(measureWords).filter((x) => !tabs1.includes(x))

export default function NumberScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tabIndex, setTabIndex] = useState(-1)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'
  const currentColors = isDark ? colors.dark : colors.light

  const key = tabs1[tabIndex] || tabs2[tabIndex - tabs1.length]
  const items = measureWords[key as keyof typeof measureWords] || {}

  function startRead() {
    let texts
    if (tabIndex == -1) {
      texts = items0.map(([, kanji]) => kanji)
    } else {
      texts = Object.entries(items).map(([num]) => (key == 'つ' && num == '10' ? '10' : `${num}${key}`))
    }
    speakJa(texts, () => setIsPlaying(false))
    setIsPlaying(true)
  }

  function stopRead() {
    stopJa()
    setIsPlaying(false)
  }

  const onChangeTab = (index: number) => setTabIndex(tabIndex == index ? -1 : index)
  return (
    <>
      <Stack.Screen
        options={{
          title: '数字',
          headerRight: () => (
            <View className="flex-row items-center gap-3">
              <MaterialIcons.Button
                color={currentColors.icon}
                backgroundColor="transparent"
                iconStyle={{ marginRight: 0 }}
                name={isPlaying ? 'stop' : 'volume-up'}
                size={24}
                onPress={() => (isPlaying ? stopRead() : startRead())}
                underlayColor={currentColors.underlay}
              />
            </View>
          ),
        }}
      />
      <ScrollView className="py-3 bg-white dark:bg-slate-950">
        <View className="px-3 mb-5 gap-2">
          <Tabs tabs={tabs1} tabIndex={tabIndex} onChange={(index) => onChangeTab(index)} />
          <Tabs
            tabs={tabs2}
            tabIndex={tabIndex - tabs1.length}
            onChange={(index) => onChangeTab(tabs1.length + index)}
          />
        </View>

        {Object.entries(items).map(([num, kana]) => {
          return (
            <View className="flex-row items-center gap-8 mb-4 px-4" key={num}>
              <Text className="text-lg w-[20%] dark:text-white">{key == 'つ' && num == '10' ? '10' : `${num}${key}`}</Text>
              <Kana value={kana} />
            </View>
          )
        })}
        {tabIndex == -1 &&
          items0.map(([num, kanji, kana]) => (
            <View className="flex-row gap-8 mb-3 px-4" key={num}>
              <Text className="w-[10%] font-bold dark:text-white">{num}</Text>
              <Text className="w-[10%] dark:text-white">{kanji}</Text>
              <Kana value={kana} />
            </View>
          ))}
      </ScrollView>
    </>
  )
}
