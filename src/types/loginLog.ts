export type LoginLogOperation = 'Login' | 'Log Out'

export type LoginLogLogoutType = 'System' | 'User'

export interface LoginLogEntry {
  employeeId: string
  employeeName: string
  id: string
  logoutType: LoginLogLogoutType | null
  occurredAt: string
  operation: LoginLogOperation
}
