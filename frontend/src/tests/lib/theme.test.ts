import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { resolveInitialTheme, toggleTheme, THEME_KEY } from '@/lib/theme'

function mockPrefersDark(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: dark }),
  )
}

describe('resolveInitialTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the persisted choice when present', () => {
    localStorage.setItem(THEME_KEY, 'dark')
    mockPrefersDark(false) // OS says light, but the saved value wins
    expect(resolveInitialTheme()).toBe('dark')

    localStorage.setItem(THEME_KEY, 'light')
    mockPrefersDark(true)
    expect(resolveInitialTheme()).toBe('light')
  })

  it('falls back to prefers-color-scheme: dark when nothing is saved', () => {
    mockPrefersDark(true)
    expect(resolveInitialTheme()).toBe('dark')
  })

  it('falls back to light when nothing is saved and the OS prefers light', () => {
    mockPrefersDark(false)
    expect(resolveInitialTheme()).toBe('light')
  })
})

describe('toggleTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('flips the dark class, persists the choice, and returns it', () => {
    expect(toggleTheme()).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')

    expect(toggleTheme()).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })
})
