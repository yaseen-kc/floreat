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
      <SignIn path="/login" forceRedirectUrl="/" />
    </Show>
  )
}

export default Login
