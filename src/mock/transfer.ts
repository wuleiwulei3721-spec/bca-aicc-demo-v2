import type {
  TransferAgent,
  TransferSkill,
  TransferSystemNumber,
} from '../types'

export const transferAgents: TransferAgent[] = [
  {
    id: 'agent-001',
    marker: 'SPV',
    employeeId: 'AICC1024',
    department: 'Priority Banking',
    name: 'Siti Rahmawati',
    skillName: 'Priority Customer',
    status: 'Ready',
    extension: '81024',
  },
  {
    id: 'agent-002',
    marker: 'TL',
    employeeId: 'AICC1088',
    department: 'Card Service',
    name: 'Maya Lestari',
    skillName: 'Credit Card',
    status: 'Ready',
    extension: '81088',
  },
  {
    id: 'agent-003',
    employeeId: 'AICC1142',
    department: 'Loan Service',
    name: 'Maya Anggraini',
    skillName: 'Loan',
    status: 'Ready',
    extension: '81142',
  },
  {
    id: 'agent-004',
    employeeId: 'AICC1167',
    department: 'Digital Banking',
    name: 'Arif Prasetyo',
    skillName: 'Banking Service',
    status: 'Ready',
    extension: '81167',
  },
  {
    id: 'agent-005',
    employeeId: 'AICC1205',
    department: 'Credit Card',
    name: 'Nadia Putri',
    skillName: 'Credit Card',
    status: 'Ready',
    extension: '81205',
  },
  {
    id: 'agent-006',
    employeeId: 'AICC1244',
    department: 'Branch Support',
    name: 'Bambang Wijaya',
    skillName: 'Debit Card',
    status: 'Ready',
    extension: '81244',
  },
]

export const transferSkills: TransferSkill[] = [
  {
    id: 'skill-001',
    skillId: 'SK1001',
    skillName: 'Credit Card',
  },
  {
    id: 'skill-002',
    skillId: 'SK1002',
    skillName: 'Banking Service',
  },
  {
    id: 'skill-003',
    skillId: 'SK1003',
    skillName: 'Loan',
  },
  {
    id: 'skill-004',
    skillId: 'SK1004',
    skillName: 'Priority Customer',
  },
  {
    id: 'skill-005',
    skillId: 'SK1005',
    skillName: 'Debit Card',
  },
]

export const transferSystemNumbers: TransferSystemNumber[] = [
  {
    id: 'number-001',
    label: 'Fraud Monitoring Desk',
    number: '+62 21 5088 1001',
  },
  {
    id: 'number-002',
    label: 'Card Authorization Center',
    number: '+62 21 5088 1002',
  },
  {
    id: 'number-003',
    label: 'Branch Escalation Line',
    number: '+62 21 5088 1003',
  },
]
