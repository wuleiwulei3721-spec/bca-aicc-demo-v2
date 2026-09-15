import { create } from 'zustand'
import { commonLinkDataSource } from '../api/commonLinkDataSource'
import type { CommonLinkQuery, CommonLinkWriteInput } from '../api/commonLinkApi'
import type { CommonLinkEntry } from '../types/commonLink'

interface CommonLinkStore {
  entries: CommonLinkEntry[]
  error: string | null
  isLoading: boolean
  isMutating: boolean
  query: CommonLinkQuery
  create: (input: CommonLinkWriteInput) => Promise<CommonLinkEntry>
  delete: (id: string) => Promise<void>
  load: (query?: CommonLinkQuery) => Promise<void>
  update: (id: string, input: CommonLinkWriteInput) => Promise<CommonLinkEntry>
}

let latestLoadRequest = 0

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The Common Link request failed.'
}

export const useCommonLinkStore = create<CommonLinkStore>((set, get) => {
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
    entries: [], error: null, isLoading: false, isMutating: false, query: {},
    create: (input) => runMutation(() => commonLinkDataSource.create(input)),
    delete: (id) => runMutation(() => commonLinkDataSource.delete(id)),
    load: async (query = {}) => {
      const requestId = ++latestLoadRequest
      set({ error: null, isLoading: true, query })
      try {
        const response = await commonLinkDataSource.list(query)
        if (requestId === latestLoadRequest) set({ entries: response.entries })
      } catch (error) {
        if (requestId === latestLoadRequest) set({ error: errorMessage(error) })
        throw error
      } finally {
        if (requestId === latestLoadRequest) set({ isLoading: false })
      }
    },
    update: (id, input) => runMutation(() => commonLinkDataSource.update(id, input)),
  }
})
