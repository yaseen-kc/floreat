import { describe, it, expect, beforeEach } from 'vitest'
import { useSaveStatusStore } from '@/stores/save-status-store'

describe('save-status store', () => {
  beforeEach(() => {
    useSaveStatusStore.getState().reset()
  })

  it('starts idle', () => {
    expect(useSaveStatusStore.getState().status).toBe('idle')
  })

  it('enters the saving state with a default message', () => {
    useSaveStatusStore.getState().saving()
    const s = useSaveStatusStore.getState()
    expect(s.status).toBe('saving')
    expect(s.message).toBe('Saving…')
  })

  it('enters the saved state with a message and timestamp', () => {
    useSaveStatusStore.getState().saved('Saved')
    const s = useSaveStatusStore.getState()
    expect(s.status).toBe('saved')
    expect(s.message).toBe('Saved')
    expect(typeof s.savedAt).toBe('number')
  })

  it('resets back to idle', () => {
    useSaveStatusStore.getState().saving()
    useSaveStatusStore.getState().reset()
    const s = useSaveStatusStore.getState()
    expect(s.status).toBe('idle')
    expect(s.savedAt).toBeNull()
  })
})
