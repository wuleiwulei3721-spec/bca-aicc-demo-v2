import { create } from 'zustand'
import { commonNumberDataSource } from '../api/commonNumberDataSource'
import type { CommonNumberQuery, CommonNumberWriteInput } from '../api/commonNumberApi'
import type { CommonNumberEntry } from '../types/commonNumber'

interface CommonNumberStore {
  entries: CommonNumberEntry[]
  error: string | null
  isLoading: boolean
  isMutating: boolean
  query: CommonNumberQuery
  create: (input: CommonNumberWriteInput) => Promise<CommonNumberEntry>
  delete: (id: string) => Promise<void>
  load: (query?: CommonNumberQuery) => Promise<void>
  update: (id: string, input: CommonNumberWriteInput) => Promise<CommonNumberEntry>
}

let latestLoadRequest = 0

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The Common Number request failed.'
}

export const useCommonNumberStore = create<CommonNumberStore>((set, get) => {
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
    create: (input) => runMutation(() => commonNumberDataSource.create(input)),
    delete: (id) => runMutation(() => commonNumberDataSource.delete(id)),
    load: async (query = {}) => {
      const requestId = ++latestLoadRequest
      set({ error: null, isLoading: true, query })
      try {
        const response = await commonNumberDataSource.list(query)
        if (requestId === latestLoadRequest) set({ entries: response.entries })
      } catch (error) {
        if (requestId === latestLoadRequest) set({ error: errorMessage(error) })
        throw error
      } finally {
        if (requestId === latestLoadRequest) set({ isLoading: false })
      }
    },
    update: (id, input) => runMutation(() => commonNumberDataSource.update(id, input)),
  }
})
