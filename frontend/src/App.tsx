import './App.css'
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/react'
import { useEffect, useState } from 'react'
import { apiFetch } from './lib/api'

function App() {
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
          <Profile />
        </Show>
      </header>
    </>
  )
}

function Profile() {
  const { getToken } = useAuth()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getToken().then((token) => apiFetch('/api/me', token)).then(setUser).catch(console.error)
  }, [getToken])

  if (!user) return <p>Loading...</p>
  return (
    <p>Welcome, {user.firstName ?? user.email}!</p>
  )
}

export default App
