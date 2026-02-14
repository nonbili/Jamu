import { Link, Stack } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { colors } from '@/lib/colors'
import { settings$ } from '@/states/settings'
import { useValue, observer } from '@legendapp/state/react'

const allCategories = [
  { id: 'gojuon', label: '🔤 五十音', description: 'Hiragana & Katakana' },
  { id: 'numbers', label: '🔢 数字', description: 'Numbers & Units' },
  { id: 'todofuken', label: '🗾 都道府県', description: 'Prefectures' },
  { id: 'mixed', label: '🎲 ランダム', description: 'Mixed Quiz' },
]

const QuizIndex = observer(() => {
  const { quizCategories } = useValue(settings$)
  
  const categories = allCategories.filter(cat => {
    if (cat.id === 'mixed') return true
    return quizCategories[cat.id as keyof typeof quizCategories]
  })

  return (
    <>
      <Stack.Screen options={{ title: 'クイズ', headerBackTitle: 'Back' }} />
      <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View className="p-4">
          <Text className="mb-4 text-sm font-bold text-slate-500 uppercase">Categories</Text>
          {categories.length > 1 ? (
            categories.map((cat) => (
              <Link key={cat.id} href={`/quiz/${cat.id}` as any} asChild>
                <Pressable className="mb-3 rounded-xl bg-white dark:bg-slate-900 p-5 active:bg-slate-100 dark:active:bg-slate-800">
                  <Text className="text-xl font-bold dark:text-white">{cat.label}</Text>
                  <Text className="text-slate-500 dark:text-slate-400">{cat.description}</Text>
                </Pressable>
              </Link>
            ))
          ) : (
            <View className="bg-white dark:bg-slate-900 p-5 rounded-xl mb-3">
              <Text className="text-slate-500 dark:text-slate-400 text-center">Please enable at least one category in Settings.</Text>
            </View>
          )}

          <Text className="mb-4 mt-8 text-sm font-bold text-slate-500 uppercase">History</Text>
          <Link href="/quiz/history" asChild>
            <Pressable className="rounded-xl bg-white dark:bg-slate-900 p-5 active:bg-slate-100 dark:active:bg-slate-800">
              <Text className="text-lg dark:text-white">View Last 20 Sessions</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </>
  )
})

export default QuizIndex
