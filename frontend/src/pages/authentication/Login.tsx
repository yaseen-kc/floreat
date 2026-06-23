import { Show, SignIn } from '@clerk/react'
import { Navigate } from 'react-router-dom'

/**
 * Login page hosted at `/login`.
 *
 * Renders Clerk's prebuilt <SignIn> for signed-out users and redirects
 * already-authenticated users to `/`. The `path` prop matches the splat
 * route (`/login/*`) so Clerk can drive its nested sub-flows, and
 * `forceRedirectUrl` sends users to `/` after a successful sign-in.
 */
function Login() {
  return (
    <Show when="signed-out" fallback={<Navigate to="/" replace />}>
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-12">
        <div className="flex items-center gap-3">
          <div
            className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">Strukt</span>
        </div>
        <SignIn path="/login" forceRedirectUrl="/" />
      </div>
    </Show>
  )
}

export default Login
