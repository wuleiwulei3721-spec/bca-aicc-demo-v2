import type {
  AgentServiceMode,
  AuthSession,
  LoginPayload,
  LoginResult,
} from '../types'

export const demoLoginAccount = {
  password: '888888',
  username: '888888',
}

export const agentServiceModeOptions: Array<{
  label: string
  value: AgentServiceMode
}> = [
  { label: 'Voice only', value: 'voice' },
  { label: 'Digital only', value: 'digital' },
  { label: 'Voice + Digital', value: 'voice-digital' },
]

export const demoLdapFailureMessage =
  'LDAP authentication failed. User name or password is invalid.'

function createDemoSessionId() {
  return `demo-session-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

export function authenticateDemoLogin(payload: LoginPayload): LoginResult {
  const username = payload.username.trim()
  const password = payload.password

  if (
    username.toLowerCase() !== demoLoginAccount.username ||
    password !== demoLoginAccount.password
  ) {
    return {
      errorCode: 'LDAP_INVALID_CREDENTIALS',
      message: demoLdapFailureMessage,
      ok: false,
    }
  }

  const now = new Date()
  const expiresAt = addMinutes(now, 120)
  const extension = payload.extension?.trim()
  const session: AuthSession = {
    crmSso: {
      expiresAt: expiresAt.toISOString(),
      issuedAt: now.toISOString(),
      relayState: 'aicc-crm-workspace',
      subject: 'uid=888888,ou=People,dc=bank1,dc=local',
    },
    displayName: 'Budi Kartika',
    employeeId: 'EMP-10027',
    expiresAt: expiresAt.toISOString(),
    extension: extension || undefined,
    ldapDn: 'uid=888888,ou=People,dc=bank1,dc=local',
    loginAt: now.toISOString(),
    permissions: [
      'workspace:agent',
      'interaction:voice',
      'interaction:digital',
      'crm:sso',
      'call-management:view',
    ],
    role: 'agent',
    roleName: 'Agent',
    sessionId: createDemoSessionId(),
    team: 'PBK BSB',
    username: '888888',
  }

  return {
    ok: true,
    session,
  }
}
