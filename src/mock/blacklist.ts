import type { BlacklistEntry } from '../types'

export const defaultBlacklistEntries: BlacklistEntry[] = [
  {
    channel: 'Phone',
    createdAt: '2026-06-10 09:12',
    createdBy: 'Admin',
    id: 'BL001',
    remark: 'Fraud risk review pending across all service channels.',
    restrictedNumber: '08123456789',
    restrictionPolicy: 'block-access',
    validityDays: 30,
  },
  {
    channel: 'Phone',
    createdAt: '2026-06-10 10:45',
    createdBy: 'Supervisor',
    id: 'BL002',
    remark: 'Keep the customer in IVR self-service during cooling-off.',
    restrictedNumber: '0215550133',
    restrictionPolicy: 'block-transfer-to-agent',
    validityDays: null,
  },
  {
    channel: 'WhatsApp',
    createdAt: '2026-06-11 08:20',
    createdBy: 'Admin',
    id: 'BL003',
    remark: 'Repeated spam message pattern, retain digital containment.',
    restrictedNumber: '6281211122233',
    restrictionPolicy: 'block-transfer-to-agent',
    validityDays: 7,
  },
  {
    channel: 'Bankapp',
    createdAt: '2026-06-11 11:05',
    createdBy: 'Risk Ops',
    id: 'BL004',
    remark: 'Temporary access block while customer risk review is open.',
    restrictedNumber: '00012345',
    restrictionPolicy: 'block-access',
    validityDays: 14,
  },
]
