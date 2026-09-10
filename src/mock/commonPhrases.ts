import type { CommonPhraseCategory, CommonPhraseEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

const DEFAULT_AUDIT_TIME = '2026-06-18 09:00:00'

export const defaultCommonPhraseCategories: CommonPhraseCategory[] = [
  {
    categoryId: 'public-verification',
    categoryName: 'Verification',
  },
  {
    categoryId: 'public-security',
    categoryName: 'Security',
  },
]

export const defaultCommonPhraseEntries: CommonPhraseEntry[] = [
  {
    categoryId: 'public-verification',
    phraseId: 'public-ab',
    phraseText:
      'For verification, please confirm your registered mobile number and date of birth.',
    shortcutCode: 'ab',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-ad',
    phraseText:
      'For your security, never share OTP, PIN, CVV, password, or full card number in this chat.',
    shortcutCode: 'ad',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-af',
    phraseText: 'I can help with one more request before we close this conversation.',
    shortcutCode: 'af',
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
]
