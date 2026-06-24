import { create } from 'zustand'

export type SaveState = 'idle' | 'saving' | 'saved'

interface SaveStatusState {
  status: SaveState
  message: string
  /** Timestamp (ms) of the last successful save, or null. */
  savedAt: number | null
  /** Enter the saving state (spinner + "Saving…"). */
  saving: (message?: string) => void
  /** Enter the saved state (check + message). */
  saved: (message?: string) => void
  /** Reset back to idle (pill hidden). */
  reset: () => void
}

/**
 * Centralized autosave status (DESIGN.md §7.5). Mirrors the prototype's
 * `SaveStatus.saving()/saved()` API: callers only toggle state + text, the
 * pill drives its own color/icon from `status`.
 */
export const useSaveStatusStore = create<SaveStatusState>((set) => ({
  status: 'idle',
  message: '',
  savedAt: null,
  saving: (message = 'Saving…') => set({ status: 'saving', message }),
  saved: (message = 'Saved') => set({ status: 'saved', message, savedAt: Date.now() }),
  reset: () => set({ status: 'idle', message: '', savedAt: null }),
}))
