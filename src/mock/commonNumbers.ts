import type { CommonNumberEntry } from '../types'

export const defaultCommonNumberEntries: CommonNumberEntry[] = [
  {
    id: 'CN001',
    name: 'VIP Hotline',
    number: '1500888',
    remark: 'Transfer customer to the VIP exclusive service IVR.',
    status: 'Active',
  },
  {
    id: 'CN002',
    name: 'Lost Card IVR',
    number: '1500911',
    remark: 'Transfer customer to card loss reporting and emergency blocking.',
    status: 'Active',
  },
  {
    id: 'CN003',
    name: 'Credit Card Service IVR',
    number: '1500668',
    remark: 'Transfer customer to credit card service self-service menu.',
    status: 'Active',
  },
  {
    id: 'CN004',
    name: 'Branch Appointment IVR',
    number: '1500776',
    remark: 'Inactive demo entry for transfer list filtering.',
    status: 'Disabled',
  },
]
