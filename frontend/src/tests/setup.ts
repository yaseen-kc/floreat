import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('@clerk/react', async () => {
  const actual = await vi.importActual<typeof import('@clerk/react')>('@clerk/react')
  return {
    ...actual,
    useAuth: () => ({ getToken: async () => 'test-token', userId: 'test-user' }),
  }
})

// jsdom does not implement matchMedia. Default to a desktop (non-matching) stub
// so components that read it (e.g. successToast's ≤640px guard) work under test.
// Tests that care about the result override it via vi.stubGlobal('matchMedia', ...).
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
})
