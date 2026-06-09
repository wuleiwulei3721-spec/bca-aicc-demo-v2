import { Navigate, useLocation } from 'react-router-dom'
import { BasicLayout } from '../layouts'
import { LoginPage } from '../pages'
import { useAuthStore } from '../store'

export function PublicLoginRoute() {
  const session = useAuthStore((state) => state.session)

  if (session) {
    return <Navigate replace to="/" />
  }

  return <LoginPage />
}

export function RequireAuth() {
  const location = useLocation()
  const session = useAuthStore((state) => state.session)

  if (!session) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    )
  }

  return <BasicLayout />
}
