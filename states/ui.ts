import { observable } from '@legendapp/state'

interface Store {
  nhkAutoPlaying: boolean
  japaneseMissingModalOpen: boolean
}

export const ui$ = observable<Store>({
  nhkAutoPlaying: false,
  japaneseMissingModalOpen: false,
})
