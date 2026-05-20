import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'
import { useEffect } from 'react'
import { trivia$, triviaStatus$ } from '@/states/trivia'
import { settings$ } from '@/states/settings'
import { useValue } from '@legendapp/state/react'
import { fetchTidbits, categoryLabels } from '@/lib/trivia'
import { Link, Stack } from 'expo-router'
import dayjs from 'dayjs'
import { TriviaSettingsButton } from '@/components/trivia/TriviaSettingsButton'

export default function TriviaScreen() {
  const list = useValue(trivia$.list)
  const { loading, error } = useValue(triviaStatus$)
  const { triviaBilingual, triviaLang } = useValue(settings$)
  const lang = triviaBilingual ? triviaLang : 'ja'

  useEffect(() => {
    fetchTidbits(lang)
  }, [lang])

  return (
    <>
      <Stack.Screen
        options={{
          title: '豆知識',
          headerRight: () => <TriviaSettingsButton />,
        }}
      />
      <FlatList
        className="bg-slate-50 dark:bg-slate-950"
        contentContainerStyle={list.length === 0 ? { flex: 1 } : undefined}
        data={list}
        keyExtractor={(item) => item.slug}
        ListEmptyComponent={
          loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center gap-3">
              <Text className="text-gray-500 dark:text-gray-400">読み込めませんでした</Text>
              <Pressable
                className="px-4 py-2 rounded bg-blue-50 dark:bg-blue-950 active:opacity-70"
                onPress={() => fetchTidbits(lang)}
              >
                <Text className="text-blue-600 dark:text-blue-400">再読み込み</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Link className="mt-1" href={`/trivia/${item.slug}`}>
            <View className="bg-white dark:bg-slate-900 w-full px-4 py-4">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {categoryLabels[item.category] ?? item.category}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {dayjs(item.date).format('YYYY/MM/DD')}
                </Text>
              </View>
              <Text className="text-base font-semibold dark:text-white" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm mt-1 text-gray-500 dark:text-gray-400" numberOfLines={2}>
                {item.summary}
              </Text>
            </View>
          </Link>
        )}
      />
    </>
  )
}
