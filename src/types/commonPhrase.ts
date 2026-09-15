export type CommonPhraseStatus = 'Active' | 'Disabled'

export interface CommonPhraseCategory {
  categoryId: string
  categoryName: string
  sortOrder: number
}

export interface CommonPhraseEntry {
  categoryId: string
  phraseId: string
  phraseText: string
  remark: string
  sortOrder: number
  shortcutCode: string
  status: CommonPhraseStatus
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}
