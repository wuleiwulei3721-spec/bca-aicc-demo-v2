export type AuthRole =
  | 'admin'
  | 'agent'
  | 'monitor'
  | 'supervisor'
  | 'team-leader'

export type AgentServiceMode = 'digital' | 'voice' | 'voice-digital'

export interface AuthCrmSsoContext {
  expiresAt: string
  issuedAt: string
  relayState: string
  subject: string
}

export interface AuthSession {
  avatarUrl?: string
  crmSso: AuthCrmSsoContext
  displayName: string
  employeeId: string
  expiresAt: string
  extension?: string
  ldapDn: string
  loginAt: string
  permissions: string[]
  role: AuthRole
  roleName: string
  sessionId: string
  team: string
  username: string
}

export interface LoginPayload {
  extension?: string
  password: string
  username: string
}

export type LoginResult =
  | {
      ok: true
      session: AuthSession
    }
  | {
      errorCode: string
      message: string
      ok: false
    }
