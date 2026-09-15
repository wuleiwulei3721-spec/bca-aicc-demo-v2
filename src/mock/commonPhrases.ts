import type { CommonPhraseCategory, CommonPhraseEntry } from '../types'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'

const DEFAULT_AUDIT_TIME = '2026-06-18 09:00:00'

export const defaultCommonPhraseCategories: CommonPhraseCategory[] = [
  {
    categoryId: 'public-verification',
    categoryName: 'Verification',
    sortOrder: 1,
  },
  {
    categoryId: 'public-security',
    categoryName: 'Security',
    sortOrder: 2,
  },
]

export const defaultCommonPhraseEntries: CommonPhraseEntry[] = [
  {
    categoryId: 'public-verification',
    phraseId: 'public-ab',
    phraseText:
      'For verification, please confirm your registered mobile number and date of birth.',
    remark: 'Use before collecting verification answers.',
    sortOrder: 1,
    shortcutCode: 'ab',
    status: 'Active',
    createdAt: DEFAULT_AUDIT_TIME,
    createdBy: DEFAULT_AUDIT_ACTOR,
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-ad',
    phraseText:
      'For your security, never share OTP, PIN, CVV, password, or full card number in this chat.',
    remark: 'Security reminder for chat conversations.',
    sortOrder: 2,
    shortcutCode: 'ad',
    status: 'Active',
    createdAt: DEFAULT_AUDIT_TIME,
    createdBy: DEFAULT_AUDIT_ACTOR,
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-af',
    phraseText: 'I can help with one more request before we close this conversation.',
    remark: 'Conversation closing prompt.',
    sortOrder: 3,
    shortcutCode: 'af',
    status: 'Active',
    createdAt: DEFAULT_AUDIT_TIME,
    createdBy: DEFAULT_AUDIT_ACTOR,
    updatedAt: DEFAULT_AUDIT_TIME,
    updatedBy: DEFAULT_AUDIT_ACTOR,
  },
]
