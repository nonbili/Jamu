import { observable } from '@legendapp/state'
import { syncObservable } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

export type TidbitCategory = 'language' | 'food' | 'culture' | 'nature' | 'history'

export interface TidbitTranslation {
  title: string
  paragraphs: string[]
}

export interface Tidbit {
  slug: string
  title: string
  category: TidbitCategory
  date: string // ISO
  summary: string
  source: string | null
  paragraphs: string[]
  langs: string[] // translation codes available for this slug
  translation: TidbitTranslation | null // content for the currently loaded lang
}

interface Store {
  list: Tidbit[]
  lang: string // which language's data is currently loaded
  syncedAt: number
}

export const trivia$ = observable<Store>({
  list: [],
  lang: '',
  syncedAt: 0,
})

// Transient fetch status for the list UI. Not persisted, so it never resurfaces
// a stale "loading" after a relaunch.
export const triviaStatus$ = observable<{ loading: boolean; error: boolean }>({
  loading: false,
  error: false,
})

syncObservable(trivia$, {
  persist: {
    name: 'trivia',
    plugin: ObservablePersistMMKV,
  },
})
