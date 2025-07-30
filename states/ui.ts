import { observable } from '@legendapp/state'

interface Store {
  nhkAutoPlaying: boolean
}

export const ui$ = observable<Store>({
  nhkAutoPlaying: false,
})
