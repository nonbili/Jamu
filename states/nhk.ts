import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

export interface News {
  id: string
  image: string
  title: string
  publishedAt: Date
  voiceId: string
  webUrl: string
}

interface Store {
  list: News[]
  syncedAt: number
  autoPlay: boolean
}

export const nhk$ = observable<Store>({
  list: [],
  syncedAt: 0,
  autoPlay: false,
})

syncObservable(nhk$, {
  persist: {
    name: 'nhk',
    plugin: ObservablePersistMMKV,
  },
})
