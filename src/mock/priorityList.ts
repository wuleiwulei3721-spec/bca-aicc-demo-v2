import type { PriorityListEntry } from '../types'

export const defaultPriorityListEntries: PriorityListEntry[] = [
  {
    channel: 'Phone',
    createdAt: '2026-06-11 09:15',
    createdBy: 'Admin',
    id: 'PL001',
    priorityNumber: '08129876543',
    remark: 'Priority queue for high-value customer support.',
  },
  {
    channel: 'WhatsApp',
    createdAt: '2026-06-11 10:20',
    createdBy: 'Supervisor',
    id: 'PL002',
    priorityNumber: '6281299900011',
    remark: 'Fraud alert follow-up customer, prioritize during queue.',
  },
  {
    channel: 'Haloapp',
    createdAt: '2026-06-11 11:35',
    createdBy: 'Admin',
    id: 'PL003',
    priorityNumber: '00045678',
    remark: 'Registered mobile customer with active service escalation.',
  },
]
