import type { AuthRole, AuthSession, LoginPayload, LoginResult } from '../types'

interface DemoLoginAccount {
  displayName: string
  employeeId: string
  ldapDn: string
  password: string
  permissions: string[]
  role: AuthRole
  roleName: string
  team: string
  username: string
}

export const demoLoginAccounts: DemoLoginAccount[] = [
  {
    displayName: 'Budi Kartika',
    employeeId: 'EMP-10027',
    ldapDn: 'uid=888888,ou=People,dc=bank1,dc=local',
    password: '888888',
    permissions: [
      'workspace:agent',
      'interaction:voice',
      'interaction:digital',
      'crm:sso',
      'call-management:view',
    ],
    role: 'agent',
    roleName: 'Agent',
    team: 'PBK BSB',
    username: '888888',
  },
  {
    displayName: 'Maya Santoso',
    employeeId: 'EMP-10108',
    ldapDn: 'uid=666666,ou=People,dc=bank1,dc=local',
    password: '666666',
    permissions: [
      'workspace:agent',
      'interaction:voice',
      'interaction:digital',
      'crm:sso',
      'call-management:view',
      'transfer:external-number',
    ],
    role: 'team-leader',
    roleName: 'TL',
    team: 'Card Service TL',
    username: '666666',
  },
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

  const account = demoLoginAccounts.find(
    (candidate) =>
      candidate.username === username.toLowerCase() &&
      candidate.password === password,
  )

  if (!account) {
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
      subject: account.ldapDn,
    },
    displayName: account.displayName,
    employeeId: account.employeeId,
    expiresAt: expiresAt.toISOString(),
    extension: extension || undefined,
    ldapDn: account.ldapDn,
    loginAt: now.toISOString(),
    permissions: account.permissions,
    role: account.role,
    roleName: account.roleName,
    sessionId: createDemoSessionId(),
    team: account.team,
    username: account.username,
  }

  return {
    ok: true,
    session,
  }
}
