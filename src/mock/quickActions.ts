import type { QuickActionEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

const DEFAULT_AUDIT_TIME = '2026-08-20 09:00:00'

export const defaultQuickActionEntries: QuickActionEntry[] = [
  {
    actionName: 'Buka Blokir BANK 1 ID',
    id: 'QA001',
    linkAddress: 'https://crm.bank1.example/quick-actions/unblock-abc-id',
    remark: 'Open the BANK 1 ID unblock workflow.',
    sortOrder: 1,
    status: 'Active',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    actionName: 'Verifikasi Dua Pertanyaan',
    id: 'QA002',
    linkAddress: 'https://crm.bank1.example/quick-actions/two-questions',
    remark: 'Open the two-question verification workflow.',
    sortOrder: 2,
    status: 'Active',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    actionName: 'Penggantian Kartu',
    id: 'QA003',
    linkAddress: 'https://crm.bank1.example/quick-actions/card-replacement',
    remark: 'Open the card replacement workflow.',
    sortOrder: 3,
    status: 'Active',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    actionName: 'Verifikasi Lima Pertanyaan',
    id: 'QA004',
    linkAddress: 'https://crm.bank1.example/quick-actions/five-questions',
    remark: 'Open the five-question verification workflow.',
    sortOrder: 4,
    status: 'Active',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    actionName: 'Panduan Penggantian Kartu',
    id: 'QA005',
    linkAddress:
      'https://crm.bank1.example/quick-actions/card-replacement-guide',
    remark: 'Open the card replacement guidance workflow.',
    sortOrder: 5,
    status: 'Active',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
]
