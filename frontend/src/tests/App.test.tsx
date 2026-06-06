import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Controllable auth state shared with the Clerk mock.
const authState = vi.hoisted(() => ({ signedIn: false }))

vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Show: ({
    when,
    fallback,
    children,
  }: {
    when: string
    fallback?: React.ReactNode
    children?: React.ReactNode
  }) => {
    const pass = when === 'signed-in' ? authState.signedIn : !authState.signedIn
    return <>{pass ? children : fallback}</>
  },
  SignIn: () => <div data-testid="clerk-signin">SignIn widget</div>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
  useAuth: () => ({ getToken: async () => 'test-token' }),
}))

// Avoid real network calls from the Profile component.
vi.mock('@/api/authentication/login', () => ({
  fetchMe: vi.fn().mockResolvedValue({ firstName: 'Ada', email: 'ada@example.com' }),
}))

import App from '@/App'

function renderAppAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  beforeEach(() => {
    authState.signedIn = false
  })

  it('redirects unauthenticated users from a protected route to the login page', () => {
    authState.signedIn = false
    renderAppAt('/')
    expect(screen.getByTestId('clerk-signin')).toBeInTheDocument()
    expect(screen.queryByTestId('user-button')).not.toBeInTheDocument()
  })

  it('redirects authenticated users away from /login to the protected home', () => {
    authState.signedIn = true
    renderAppAt('/login')
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
    expect(screen.queryByTestId('clerk-signin')).not.toBeInTheDocument()
  })

  it('protects unknown routes for unauthenticated users', () => {
    authState.signedIn = false
    renderAppAt('/some/unknown/path')
    expect(screen.getByTestId('clerk-signin')).toBeInTheDocument()
  })
})
