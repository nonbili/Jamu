import { observable } from '@legendapp/state'

interface UIStore {
  japaneseMissingModalOpen: boolean
  toast: {
    message: string
    visible: boolean
  }
}

export const ui$ = observable<UIStore>({
  japaneseMissingModalOpen: false,
  toast: {
    message: '',
    visible: false,
  },
})

let toastTimeout: ReturnType<typeof setTimeout>

export function showToast(message: string) {
  ui$.toast.set({ message, visible: true })
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    ui$.toast.visible.set(false)
  }, 2000)
}
