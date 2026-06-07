import { create } from 'zustand'

interface ToastState {
  message: string
  visible: boolean
  show: (msg: string) => void
}

export const useToast = create<ToastState>((set) => ({
  message: '',
  visible: false,
  show: (msg) => {
    set({ message: msg, visible: true })
    setTimeout(() => set({ visible: false }), 2400)
  },
}))

export function Toast() {
  const { message, visible } = useToast()

  return (
    <div
      className={`fixed bottom-[84px] left-1/2 -translate-x-1/2 bg-foreground text-background px-[18px] py-[10px] rounded-[10px] text-[13.5px] font-semibold shadow-lg z-[80] transition-all duration-250 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      }`}
    >
      {message}
    </div>
  )
}
