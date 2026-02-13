import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: string
  userAnswer?: string
}

export interface QuizSession {
  id: string
  category: string
  questions: QuizQuestion[]
  createdAt: number
}

interface QuizStore {
  history: QuizSession[]
}

export const quiz$ = observable<QuizStore>({
  history: [],
})

syncObservable(quiz$, {
  persist: {
    name: 'quiz',
    plugin: ObservablePersistMMKV,
  },
})

export function addQuizSession(session: QuizSession) {
  quiz$.history.set((history) => {
    const newHistory = [session, ...(history || [])]
    return newHistory.slice(0, 20)
  })
}
