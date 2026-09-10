import type { CommonNumberEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

export const defaultCommonNumberEntries: CommonNumberEntry[] = [
  {
    id: 'CN001',
    name: 'VIP Hotline',
    number: '1500888',
    remark: 'Transfer customer to the VIP exclusive service IVR.',
    status: 'Active',
    updatedAt: '2026-06-18 09:20:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    id: 'CN002',
    name: 'Lost Card IVR',
    number: '1500911',
    remark: 'Transfer customer to card loss reporting and emergency blocking.',
    status: 'Active',
    updatedAt: '2026-06-18 09:22:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    id: 'CN003',
    name: 'Credit Card Service IVR',
    number: '1500668',
    remark: 'Transfer customer to credit card service self-service menu.',
    status: 'Active',
    updatedAt: '2026-06-18 09:25:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    id: 'CN004',
    name: 'Branch Appointment IVR',
    number: '1500776',
    remark: 'Inactive demo entry for transfer list filtering.',
    status: 'Disabled',
    updatedAt: '2026-06-18 09:28:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
]
