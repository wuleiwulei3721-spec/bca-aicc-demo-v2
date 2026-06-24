import type { SensitiveWordCategory, SensitiveWordEntry } from '../types'

export const sensitiveWordCategoryLabels: Record<
  SensitiveWordCategory,
  string
> = {
  harassment: 'Harassment / Discriminatory Language',
  'personal-data': 'Personal Data Exposure',
  profanity: 'Profanity / Offensive Language',
  'regulatory-risk': 'Regulatory or Compliance Risk',
  'security-credential': 'Security Credential',
}

export const sensitiveWordCategoryOptions: Array<{
  label: string
  value: SensitiveWordCategory
}> = Object.entries(sensitiveWordCategoryLabels).map(([value, label]) => ({
  label,
  value: value as SensitiveWordCategory,
}))

export const defaultSensitiveWordEntries: SensitiveWordEntry[] = [
  {
    category: 'security-credential',
    id: 'SW001',
    remark: 'Blocks agents from asking customers to disclose OTP values.',
    word: 'OTP',
  },
  {
    category: 'security-credential',
    id: 'SW002',
    remark: 'PIN must not be requested or repeated in chat.',
    word: 'PIN',
  },
  {
    category: 'personal-data',
    id: 'SW003',
    remark: 'Prevents requests for full card number in customer replies.',
    word: 'full card number',
  },
  {
    category: 'personal-data',
    id: 'SW004',
    remark: 'Demo guard for national ID exposure.',
    word: 'national ID',
  },
  {
    category: 'regulatory-risk',
    id: 'SW005',
    remark: 'Avoids making guaranteed approval promises.',
    word: 'guaranteed approval',
  },
  {
    category: 'regulatory-risk',
    id: 'SW006',
    remark: 'Avoids unconditional fee-waiver commitments.',
    word: 'waive all fees',
  },
  {
    category: 'profanity',
    id: 'SW007',
    remark: 'Generic offensive wording placeholder for demo review.',
    word: 'offensive phrase',
  },
  {
    category: 'harassment',
    id: 'SW008',
    remark: 'Generic discriminatory wording placeholder for demo review.',
    word: 'discriminatory remark',
  },
]
