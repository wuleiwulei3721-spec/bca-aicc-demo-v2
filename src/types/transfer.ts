export interface TransferAgent {
  id: string
  marker?: 'SPV' | 'TL'
  employeeId: string
  department: string
  name: string
  extension: string
}

export interface TransferSkill {
  id: string
  skillId: string
  skillName: string
}

export interface TransferSystemNumber {
  id: string
  label: string
  number: string
}
