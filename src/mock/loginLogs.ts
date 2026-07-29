import type { LoginLogEntry } from '../types'

function todayAt(hour: number, minute: number, second: number) {
  const date = new Date()

  date.setHours(hour, minute, second, 0)
  return date.toISOString()
}

function daysAgoAt(days: number, hour: number, minute: number, second: number) {
  const date = new Date()

  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, second, 0)
  return date.toISOString()
}

export function createDefaultLoginLogs(): LoginLogEntry[] {
  return [
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-001',
      logoutType: null,
      occurredAt: todayAt(8, 2, 16),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-002',
      logoutType: null,
      occurredAt: todayAt(8, 14, 32),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-003',
      logoutType: 'System',
      occurredAt: todayAt(10, 18, 5),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-004',
      logoutType: null,
      occurredAt: todayAt(10, 31, 44),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-005',
      logoutType: 'User',
      occurredAt: todayAt(11, 7, 29),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-006',
      logoutType: 'System',
      occurredAt: todayAt(11, 42, 51),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-007',
      logoutType: null,
      occurredAt: todayAt(11, 56, 8),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-008',
      logoutType: null,
      occurredAt: daysAgoAt(1, 8, 9, 24),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-009',
      logoutType: 'User',
      occurredAt: daysAgoAt(1, 16, 42, 37),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-010',
      logoutType: null,
      occurredAt: daysAgoAt(2, 8, 21, 9),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-011',
      logoutType: 'System',
      occurredAt: daysAgoAt(2, 15, 3, 52),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-012',
      logoutType: null,
      occurredAt: daysAgoAt(3, 7, 58, 41),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-013',
      logoutType: 'User',
      occurredAt: daysAgoAt(3, 17, 11, 26),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-014',
      logoutType: null,
      occurredAt: daysAgoAt(4, 8, 6, 18),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-015',
      logoutType: 'User',
      occurredAt: daysAgoAt(4, 16, 33, 45),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-016',
      logoutType: null,
      occurredAt: daysAgoAt(5, 8, 12, 57),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10027',
      employeeName: 'Budi Kartika',
      id: 'login-log-017',
      logoutType: 'System',
      occurredAt: daysAgoAt(5, 14, 49, 33),
      operation: 'Log Out',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-018',
      logoutType: null,
      occurredAt: daysAgoAt(6, 8, 17, 6),
      operation: 'Login',
    },
    {
      employeeId: 'EMP-10108',
      employeeName: 'Maya Santoso',
      id: 'login-log-019',
      logoutType: 'User',
      occurredAt: daysAgoAt(6, 17, 2, 18),
      operation: 'Log Out',
    },
  ]
}
