import type { SessionEndReasonEntry } from '../types'

export const defaultSessionEndReasonEntries: SessionEndReasonEntry[] = [
  {
    id: 'SER001',
    mediaTypes: ['Voice', 'Video'],
    reasonName: 'Hening & Tidak Ada Respons',
    remark: 'Abnormal voice or video end when the customer is silent or gives no response.',
    status: 'Active',
  },
  {
    id: 'SER002',
    mediaTypes: ['Voice', 'Video', 'DM'],
    reasonName: 'Problem Teknis',
    remark: 'Technical issue during voice, video, or direct-message service.',
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
