import type { CommonPhraseCategory, CommonPhraseEntry } from '../types'

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
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-ad',
    phraseText:
      'For your security, never share OTP, PIN, CVV, password, or full card number in this chat.',
    shortcutCode: 'ad',
  },
  {
    categoryId: 'public-security',
    phraseId: 'public-af',
    phraseText: 'I can help with one more request before we close this conversation.',
    shortcutCode: 'af',
  },
]
