import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

interface SettingsStore {
  nhkAutoPlaying: boolean
  quizCategories: {
    gojuon: boolean
    numbers: boolean
    todofuken: boolean
  }
}

export const settings$ = observable<SettingsStore>({
  nhkAutoPlaying: false,
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
