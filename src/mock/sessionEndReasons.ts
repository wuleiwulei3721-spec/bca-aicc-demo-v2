import type { SessionEndReasonEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

export const defaultSessionEndReasonEntries: SessionEndReasonEntry[] = [
  {
    id: 'SER002',
    mediaTypes: ['DM'],
    reasonName: 'Problem Teknis',
    remark: 'Technical issue during direct-message service.',
    status: 'Disabled',
    updatedAt: '2026-06-18 09:50:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    id: 'SER003',
    mediaTypes: ['DM'],
    reasonName: 'Nasabah Tidak Ada Respons Lebih Lanjut',
    remark: 'Direct-message service ended because the customer stopped responding.',
    status: 'Disabled',
    updatedAt: '2026-06-18 09:52:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
]
