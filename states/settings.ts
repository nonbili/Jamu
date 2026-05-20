import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

interface SettingsStore {
  theme: 'light' | 'dark' | 'system'
  nhkAutoPlaying: boolean
  triviaBilingual: boolean
  triviaLang: string
  quizCategories: {
    gojuon: boolean
    numbers: boolean
    todofuken: boolean
  }
}

export const settings$ = observable<SettingsStore>({
  theme: 'system',
  nhkAutoPlaying: false,
  triviaBilingual: false,
  triviaLang: 'en',
  quizCategories: {
    gojuon: true,
    numbers: true,
    todofuken: true,
  },
})

syncObservable(settings$, {
  persist: {
    name: 'settings',
    plugin: ObservablePersistMMKV,
  },
})
