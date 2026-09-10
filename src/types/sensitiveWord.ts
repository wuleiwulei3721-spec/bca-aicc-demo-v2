export type SensitiveWordCategory =
  | 'harassment'
  | 'personal-data'
  | 'profanity'
  | 'regulatory-risk'
  | 'security-credential'

export interface SensitiveWordEntry {
  category: SensitiveWordCategory
  id: string
  remark: string
  updatedAt: string
  updatedBy: string
  word: string
}

export interface SensitiveWordMatch {
  category: SensitiveWordCategory
  id: string
  word: string
}
