import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '@clerk/react'
import { fetchMe, type Me } from '@/api/authentication/login'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'ESTIMATOR' | 'SALES_COORDINATOR'
type AuthState = { user: Me | null; loading: boolean; hasRole: (role: Role | Role[]) => boolean; can: (permission: string) => boolean }
const AuthContext = createContext<AuthState | null>(null)

export function AuthorizationProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth()
  const [user, setUser] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    if (!isSignedIn) { setUser(null); setLoading(false); return }
    setLoading(true)
    getToken().then((token) => fetchMe(token)).then((me) => { if (active) setUser(me) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [getToken, isSignedIn])
  const value = useMemo<AuthState>(() => ({ user, loading, hasRole: (role) => Array.isArray(role) ? role.includes(user?.role as Role) : user?.role === role, can: (permission) => (user?.permissions ?? []).includes(permission) }), [loading, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthorization() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuthorization must be used inside AuthorizationProvider')
  return value
}
