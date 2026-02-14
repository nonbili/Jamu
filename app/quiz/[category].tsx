import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { Text, View, Pressable, ScrollView } from 'react-native'
import { generateQuizSession } from '@/lib/quiz'
import { QuizQuestion, addQuizSession } from '@/states/quiz'
import { settings$ } from '@/states/settings'
import * as Haptics from 'expo-haptics'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Clipboard from 'expo-clipboard'
import { showToast } from '@/states/ui'

const categoryLabels: Record<string, string> = {
  gojuon: '五十音',
  numbers: '数字',
  todofuken: '都道府県',
  mixed: 'ランダム',
}

export default function QuizSessionPage() {
  const params = useLocalSearchParams()
  const category = params.category as string
  const label = category ? categoryLabels[category] || category : 'Quiz'
  const router = useRouter()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (category) {
      const { quizCategories } = settings$.get()
      setQuestions(generateQuizSession(category, quizCategories))
    }
  }, [category])

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text)
    showToast('Copied to clipboard')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 items-center justify-center">
        <Stack.Screen options={{ title: `${label} クイズ` }} />
        <Text className="dark:text-white">Loading questions...</Text>
      </View>
    )
  }

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (option: string) => {
    if (isFinished) return

    const newAnswers = [...answers, option]
    setAnswers(newAnswers)

    if (option === currentQuestion.answer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setIsFinished(true)
      const session = {
        id: Math.random().toString(36).substring(7),
        category: category!,
        questions: questions.map((q, i) => ({ ...q, userAnswer: newAnswers[i] })),
        createdAt: Date.now(),
      }
      addQuizSession(session)
    }
  }

  if (isFinished) {
    const correctCount = questions.reduce((acc, q, i) => (q.answer === answers[i] ? acc + 1 : acc), 0)

    return (
      <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950">
        <Stack.Screen options={{ title: 'Result' }} />
        <View className="p-6 items-center">
          <Text className="text-4xl mb-2">🎉</Text>
          <Text className="text-2xl font-bold mb-4 dark:text-white">Quiz Finished!</Text>
          <Text className="text-lg mb-8 dark:text-slate-300">
            Score: {correctCount} / {questions.length}
          </Text>

          <View className="w-full mb-8">
            {questions.map((q, i) => (
              <Pressable
                key={i}
                onLongPress={() => copyToClipboard(`${q.question} - ${q.answer}`)}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-3 active:bg-slate-50 dark:active:bg-slate-800"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-2xl font-bold dark:text-white">{q.question}</Text>
                  <MaterialIcons
                    name={q.answer === answers[i] ? 'check-circle' : 'cancel'}
                    size={24}
                    color={q.answer === answers[i] ? '#22c55e' : '#ef4444'}
                  />
                </View>
                <View className="flex-row gap-4">
                  <View>
                    <Text className="text-xs text-slate-400 dark:text-slate-500">YOUR ANSWER</Text>
                    <Text
                      className={q.answer === answers[i] ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}
                    >
                      {answers[i]}
                    </Text>
                  </View>
                  {q.answer !== answers[i] && (
                    <View>
                      <Text className="text-xs text-slate-400 dark:text-slate-500">CORRECT ANSWER</Text>
                      <Text className="text-green-600 font-medium">{q.answer}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            className="bg-blue-500 px-12 py-4 rounded-full active:bg-blue-600"
            onPress={() => router.replace('/quiz')}
          >
            <Text className="text-white font-bold text-lg">Back to Menu</Text>
          </Pressable>
        </View>
      </ScrollView>
    )
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 p-6">
      <Stack.Screen options={{ title: `${label} クイズ` }} />
      <View className="mb-8">
        <Text className="text-slate-500 dark:text-slate-400 mb-2">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <View className="h-full bg-blue-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </View>
      </View>

      <Pressable
        onLongPress={() => copyToClipboard(currentQuestion.question)}
        className="flex-1 items-center justify-center mb-12 bg-white dark:bg-slate-900 rounded-3xl active:bg-slate-50 dark:active:bg-slate-800"
      >
        <Text className="text-6xl font-bold text-center px-4 dark:text-white">{currentQuestion.question}</Text>
        {/* <Text className="text-slate-300 text-xs mt-4">Long press to copy</Text> */}
      </Pressable>

      <View className="flex-row flex-wrap justify-between">
        {currentQuestion.options.map((option) => (
          <Pressable
            key={option}
            onPress={() => handleAnswer(option)}
            className="w-[48%] bg-white dark:bg-slate-900 mb-4 p-6 rounded-2xl items-center active:bg-slate-100 dark:active:bg-slate-800"
          >
            <Text className="text-xl font-medium text-center dark:text-white">{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}
