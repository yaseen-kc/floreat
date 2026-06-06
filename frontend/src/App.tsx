import './App.css'
import { ClerkProvider, Show, UserButton, useAuth } from '@clerk/react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/authentication/Login'
import { fetchMe, type Me } from './api/authentication/login'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file.')
}

function App() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/login"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      <Routes>
        {/* Splat route so Clerk can drive its nested sign-in sub-flows. */}
        <Route path="/login/*" element={<Login />} />

        {/* Every other route is protected: signed-out users are sent to /login. */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ClerkProvider>
  )
}

/**
 * Gate for authenticated-only routes. Renders the matched child route when the
 * user is signed in, otherwise redirects to /login.
 */
function ProtectedLayout() {
  return (
    <Show when="signed-in" fallback={<Navigate to="/login" replace />}>
      <Outlet />
    </Show>
  )
}

function Home() {
  return (
    <header>
      <UserButton />
      <Profile />
    </header>
  )
}

function Profile() {
  const { getToken } = useAuth()
  const [user, setUser] = useState<Me | null>(null)

  useEffect(() => {
    getToken()
      .then((token) => fetchMe(token))
      .then(setUser)
      .catch(console.error)
  }, [getToken])

  if (!user) return <p>Loading...</p>
  return <p>Welcome, {user.firstName ?? user.email}!</p>
}

export default App
