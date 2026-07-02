export type EmployeeStatus = 'Normal' | 'Resigned' | 'Frozen' | 'Disabled'

export type EmployeePositionType = 'Management' | 'Agent'

export type EmployeeRole = 'Agent' | 'TL' | 'SPV' | 'OM' | 'QA'

export interface EmployeeOrganizationUnit {
  children?: EmployeeOrganizationUnit[]
  unitId: string
  unitName: string
}

export interface EmployeeSkillSetting {
  agentWeight: number
  skillQueueCode: string
  skillWeight: number
}

export interface EmployeeProfile {
  aiccExtension: string
  aiccId: string
  aiccPassword: string
  alias?: string
  email: string
  employeeId: string
  employeeName: string
  employeePassword: string
  gender: string
  homeRole: EmployeeRole
  internalNumber: string
  language: string
  lastLoginTime: string
  liveChatMaxServices: number
  positionLevel: string
  positionType: EmployeePositionType
  returnTaskType: string
  roleName: EmployeeRole
  skillSettings: EmployeeSkillSetting[]
  status: EmployeeStatus
  teamName: string
  unitId: string
  unitName: string
  vdn: string
  officePhone: string
}
