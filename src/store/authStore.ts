import { create } from 'zustand'
import { authenticateDemoLogin } from '../mock/auth'
import type { AuthSession, LoginPayload, LoginResult } from '../types'
import { clearExternalOperationApprovals } from '../utils/outboundApproval'

const AUTH_SESSION_STORAGE_KEY = 'bank1-aicc-auth-session'

function isSessionValid(session: AuthSession | null) {
  return Boolean(session && Date.parse(session.expiresAt) > Date.now())
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const session = JSON.parse(rawSession) as AuthSession

    if (!isSessionValid(session)) {
      window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
      clearExternalOperationApprovals()
      return null
    }

    return session
  } catch {
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    clearExternalOperationApprovals()
    return null
  }
}

function writeStoredSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  )
}

function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
}

interface AuthState {
  login: (payload: LoginPayload) => LoginResult
  logout: () => void
  session: AuthSession | null
}

export const useAuthStore = create<AuthState>((set) => ({
  login: (payload) => {
    const result = authenticateDemoLogin(payload)

    if (result.ok) {
      writeStoredSession(result.session)
      set({ session: result.session })
    }

    return result
  },
  logout: () => {
    clearExternalOperationApprovals()
    clearStoredSession()
    set({ session: null })
  },
  session: readStoredSession(),
}))
