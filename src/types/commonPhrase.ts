export interface CommonPhraseCategory {
  categoryId: string
  categoryName: string
}

export interface CommonPhraseEntry {
  categoryId: string
  phraseId: string
  phraseText: string
  shortcutCode: string
  updatedAt: string
  updatedBy: string
}
