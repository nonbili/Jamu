import { observable } from '@legendapp/state'

interface UIStore {
  japaneseMissingModalOpen: boolean
}

export const ui$ = observable<UIStore>({
  japaneseMissingModalOpen: false,
})
