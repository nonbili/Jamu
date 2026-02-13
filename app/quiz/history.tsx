import { Stack } from 'expo-router'
import { ScrollView, Text, View, Pressable, ToastAndroid, Platform } from 'react-native'
import { quiz$ } from '@/states/quiz'
import { observer } from '@legendapp/state/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'

const HistoryPage = observer(() => {
  const history = quiz$.history.get()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text)
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT)
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <>
      <Stack.Screen options={{ title: 'History' }} />
      <ScrollView className="flex-1 bg-slate-50">
        <View className="p-4">
          {history.length === 0 ? (
            <Text className="text-center text-slate-500 mt-10">No history yet.</Text>
          ) : (
            history.map((session) => {
              const correctCount = session.questions.reduce((acc, q) => (q.answer === q.userAnswer ? acc + 1 : acc), 0)
              const isExpanded = expandedId === session.id

              return (
                <Pressable
                  key={session.id}
                  onPress={() => setExpandedId(isExpanded ? null : session.id)}
                  className="mb-4 bg-white p-4 rounded-xl shadow-sm overflow-hidden active:bg-slate-50"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View>
                      <Text className="text-lg font-bold capitalize">{session.category}</Text>
                      <Text className="text-slate-400 text-xs">
                        {dayjs(session.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-blue-600">
                        {correctCount} / {session.questions.length}
                      </Text>
                      <MaterialIcons name={isExpanded ? 'expand-less' : 'expand-more'} size={20} color="#94a3b8" />
                    </View>
                  </View>

                  <View className="flex-row mt-1 flex-wrap">
                    {session.questions.map((q, i) => (
                      <View
                        key={i}
                        className={`w-5 h-5 rounded-full mr-1 mb-1 items-center justify-center ${
                          q.answer === q.userAnswer ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <Text
                          className={`text-[10px] ${q.answer === q.userAnswer ? 'text-green-700' : 'text-red-700'}`}
                        >
                          {q.answer === q.userAnswer ? '✓' : '✕'}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {isExpanded && (
                    <View className="mt-4 pt-4 border-t border-slate-100">
                      {session.questions.map((q, i) => (
                        <Pressable
                          key={i}
                          onLongPress={() => copyToClipboard(`${q.question} - ${q.answer}`)}
                          className="mb-3 active:bg-slate-50 rounded p-1"
                        >
                          <View className="flex-row justify-between">
                            <Text className="font-bold text-slate-800">{q.question}</Text>
                            <Text className={q.answer === q.userAnswer ? 'text-green-600' : 'text-red-600'}>
                              {q.userAnswer} {q.answer !== q.userAnswer && `(→ ${q.answer})`}
                            </Text>
                          </View>
                        </Pressable>
                      ))}
                      {/* <Text className="text-[10px] text-slate-300 text-center mt-2 italic">Long press to copy question and answer</Text> */}
                    </View>
                  )}
                </Pressable>
              )
            })
          )}
        </View>
      </ScrollView>
    </>
  )
})

export default HistoryPage
