import { Link, Stack } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { colors } from '@/lib/colors'
import { settings$ } from '@/states/settings'
import { use$ } from '@legendapp/state/react'
import { observer } from '@legendapp/state/react'

const allCategories = [
  { id: 'gojuon', label: '🔤 五十音', description: 'Hiragana & Katakana' },
  { id: 'numbers', label: '🔢 数字', description: 'Numbers & Units' },
  { id: 'todofuken', label: '🗾 都道府県', description: 'Prefectures' },
  { id: 'mixed', label: '🎲 ランダム', description: 'Mixed Quiz' },
]

const QuizIndex = observer(() => {
  const { quizCategories } = use$(settings$)
  
  const categories = allCategories.filter(cat => {
    if (cat.id === 'mixed') return true
    return quizCategories[cat.id as keyof typeof quizCategories]
  })

  return (
    <>
      <Stack.Screen options={{ title: 'クイズ', headerBackTitle: 'Back' }} />
      <ScrollView className="flex-1 bg-slate-50">
        <View className="p-4">
          <Text className="mb-4 text-sm font-bold text-slate-500">CATEGORIES</Text>
          {categories.length > 1 ? (
            categories.map((cat) => (
              <Link key={cat.id} href={`/quiz/${cat.id}` as any} asChild>
                <Pressable className="mb-3 rounded-xl bg-white p-5 shadow-sm active:bg-slate-100">
                  <Text className="text-xl font-bold">{cat.label}</Text>
                  <Text className="text-slate-500">{cat.description}</Text>
                </Pressable>
              </Link>
            ))
          ) : (
            <View className="bg-white p-5 rounded-xl shadow-sm mb-3">
              <Text className="text-slate-500 text-center">Please enable at least one category in Settings.</Text>
            </View>
          )}

          <Text className="mb-4 mt-8 text-sm font-bold text-slate-500">HISTORY</Text>
          <Link href="/quiz/history" asChild>
            <Pressable className="rounded-xl bg-white p-5 shadow-sm active:bg-slate-100">
              <Text className="text-lg">View Last 20 Sessions</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </>
  )
})

export default QuizIndex
