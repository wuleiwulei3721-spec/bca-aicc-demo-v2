import type { CommonLinkEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

export const defaultCommonLinkEntries: CommonLinkEntry[] = [
  {
    id: 'CL001',
    remark: 'Official BANK 1 homepage for general customer reference.',
    updatedAt: '2026-06-18 09:10:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
    websiteName: 'BANK 1 Official Website',
    websiteUrl: 'https://www.bank1.example',
  },
  {
    id: 'CL002',
    remark: 'Customer support and product FAQ reference.',
    updatedAt: '2026-06-18 09:12:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
    websiteName: 'BANK 1 Help Center',
    websiteUrl: 'https://help.bank1.example',
  },
  {
    id: 'CL003',
    remark: 'Security education page for fraud prevention guidance.',
    updatedAt: '2026-06-18 09:15:00',
    updatedBy: DEFAULT_AUDIT_ACTOR,
    websiteName: 'Security Awareness Center',
    websiteUrl: 'https://security.bank1.example',
  },
]
