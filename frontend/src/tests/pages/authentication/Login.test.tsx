import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Controllable auth state shared with the Clerk mock.
const authState = vi.hoisted(() => ({ signedIn: false }))

vi.mock('@clerk/react', () => ({
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
}))

import Login from '@/pages/authentication/Login'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login/*" element={<Login />} />
        <Route path="/" element={<div data-testid="home">Home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Login page', () => {
  beforeEach(() => {
    authState.signedIn = false
  })

  it('renders the Clerk <SignIn> widget for signed-out users', () => {
    renderLogin()
    expect(screen.getByTestId('clerk-signin')).toBeInTheDocument()
    expect(screen.queryByTestId('home')).not.toBeInTheDocument()
  })

  it('redirects already-authenticated users to /', () => {
    authState.signedIn = true
    renderLogin()
    expect(screen.getByTestId('home')).toBeInTheDocument()
    expect(screen.queryByTestId('clerk-signin')).not.toBeInTheDocument()
  })
})
