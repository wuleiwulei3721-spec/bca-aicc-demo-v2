import type { SessionEndReasonEntry } from '../types'

export const defaultSessionEndReasonEntries: SessionEndReasonEntry[] = [
  {
    id: 'SER002',
    mediaTypes: ['DM'],
    reasonName: 'Problem Teknis',
    remark: 'Technical issue during direct-message service.',
    status: 'Active',
  },
  {
    id: 'SER003',
    mediaTypes: ['DM'],
    reasonName: 'Nasabah Tidak Ada Respons Lebih Lanjut',
    remark: 'Direct-message service ended because the customer stopped responding.',
    status: 'Active',
  },
]
