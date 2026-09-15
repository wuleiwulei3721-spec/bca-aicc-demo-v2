import { create } from 'zustand'
import { commonPhraseDataSource } from '../api/commonPhraseDataSource'
import type {
  CommonPhraseQuery,
  CommonPhraseWriteInput,
} from '../api/commonPhraseApi'
import type {
  CommonPhraseCategory,
  CommonPhraseEntry,
  CommonPhraseStatus,
} from '../types/commonPhrase'

interface CommonPhraseStore {
  categories: CommonPhraseCategory[]
  categoryCounts: Record<string, number>
  entries: CommonPhraseEntry[]
  error: string | null
  isLoading: boolean
  isMutating: boolean
  query: CommonPhraseQuery
  createCategory: (categoryName: string) => Promise<CommonPhraseCategory>
  createPhrase: (input: CommonPhraseWriteInput) => Promise<CommonPhraseEntry>
  deleteCategory: (categoryId: string) => Promise<void>
  deletePhrase: (phraseId: string) => Promise<void>
  load: (query?: CommonPhraseQuery) => Promise<void>
  movePhrases: (
    phraseIds: string[],
    categoryId: string,
    updatedBy?: string,
  ) => Promise<void>
  renameCategory: (
    categoryId: string,
    categoryName: string,
  ) => Promise<CommonPhraseCategory>
  updatePhrase: (
    phraseId: string,
    input: CommonPhraseWriteInput,
  ) => Promise<CommonPhraseEntry>
  updateStatus: (
    phraseId: string,
    status: CommonPhraseStatus,
    updatedBy?: string,
  ) => Promise<CommonPhraseEntry>
}

let latestLoadRequest = 0

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'The Common Phrase request failed.'
}

export const useCommonPhraseStore = create<CommonPhraseStore>((set, get) => {
  const refreshCurrentQuery = () => get().load(get().query)

  const runMutation = async <Result>(operation: () => Promise<Result>) => {
    set({ error: null, isMutating: true })

    try {
      const result = await operation()
      await refreshCurrentQuery()
      return result
    } catch (error) {
      set({ error: errorMessage(error) })
      throw error
    } finally {
      set({ isMutating: false })
    }
  }

  return {
    categories: [],
    categoryCounts: {},
    createCategory: (categoryName) =>
      runMutation(() => commonPhraseDataSource.createCategory(categoryName)),
    createPhrase: (input) =>
      runMutation(() => commonPhraseDataSource.createPhrase(input)),
    deleteCategory: (categoryId) =>
      runMutation(async () => {
        await commonPhraseDataSource.deleteCategory(categoryId)
      }),
    deletePhrase: (phraseId) =>
      runMutation(async () => {
        await commonPhraseDataSource.deletePhrase(phraseId)
      }),
    entries: [],
    error: null,
    isLoading: false,
    isMutating: false,
    load: async (query = {}) => {
      const requestId = ++latestLoadRequest
      set({ error: null, isLoading: true, query })

      try {
        const response = await commonPhraseDataSource.list(query)

        if (requestId === latestLoadRequest) {
          set({
            categories: response.categories,
            categoryCounts: response.categoryCounts,
            entries: response.entries,
          })
        }
      } catch (error) {
        if (requestId === latestLoadRequest) {
          set({ error: errorMessage(error) })
        }
        throw error
      } finally {
        if (requestId === latestLoadRequest) {
          set({ isLoading: false })
        }
      }
    },
    movePhrases: (phraseIds, categoryId, updatedBy) =>
      runMutation(async () => {
        await commonPhraseDataSource.movePhrases(phraseIds, categoryId, updatedBy)
      }),
    query: {},
    renameCategory: (categoryId, categoryName) =>
      runMutation(() =>
        commonPhraseDataSource.renameCategory(categoryId, categoryName),
      ),
    updatePhrase: (phraseId, input) =>
      runMutation(() => commonPhraseDataSource.updatePhrase(phraseId, input)),
    updateStatus: (phraseId, status, updatedBy) =>
      runMutation(() =>
        commonPhraseDataSource.updateStatus(phraseId, status, updatedBy),
      ),
  }
})
