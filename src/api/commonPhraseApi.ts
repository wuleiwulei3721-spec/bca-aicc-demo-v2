import type {
  CommonPhraseCategory,
  CommonPhraseEntry,
  CommonPhraseStatus,
} from '../types/commonPhrase'

export interface CommonPhraseQuery {
  categoryId?: string
  phraseText?: string
  shortcutCode?: string
  status?: CommonPhraseStatus
}

export interface CommonPhraseListResponse {
  categories: CommonPhraseCategory[]
  categoryCounts: Record<string, number>
  entries: CommonPhraseEntry[]
}

export interface CommonPhraseWriteInput {
  categoryId: string
  phraseText: string
  remark?: string
  sortOrder?: number
  shortcutCode: string
  status: CommonPhraseStatus
  updatedBy?: string
}

export interface CommonPhraseService {
  list: (query?: CommonPhraseQuery) => Promise<CommonPhraseListResponse>
  createCategory: (categoryName: string) => Promise<CommonPhraseCategory>
  renameCategory: (
    categoryId: string,
    categoryName: string,
  ) => Promise<CommonPhraseCategory>
  deleteCategory: (categoryId: string) => Promise<void>
  createPhrase: (input: CommonPhraseWriteInput) => Promise<CommonPhraseEntry>
  updatePhrase: (
    phraseId: string,
    input: CommonPhraseWriteInput,
  ) => Promise<CommonPhraseEntry>
  updateStatus: (
    phraseId: string,
    status: CommonPhraseStatus,
    updatedBy?: string,
  ) => Promise<CommonPhraseEntry>
  deletePhrase: (phraseId: string) => Promise<void>
  movePhrases: (
    phraseIds: string[],
    categoryId: string,
    updatedBy?: string,
  ) => Promise<void>
}

interface CommonPhraseApiErrorPayload {
  error?: {
    code?: string
    message?: string
  }
}

export class CommonPhraseApiError extends Error {
  readonly code: string
  readonly statusCode: number

  constructor(message: string, statusCode: number, code = 'API_ERROR') {
    super(message)
    this.name = 'CommonPhraseApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      ...init,
    })
  } catch {
    throw new CommonPhraseApiError(
      'The local Common Phrase service is unavailable.',
      0,
      'SERVICE_UNAVAILABLE',
    )
  }

  const payload = (await response.json().catch(() => null)) as
    | T
    | CommonPhraseApiErrorPayload
    | null

  if (!response.ok) {
    const errorPayload = payload as CommonPhraseApiErrorPayload | null
    throw new CommonPhraseApiError(
      errorPayload?.error?.message ?? 'The Common Phrase request failed.',
      response.status,
      errorPayload?.error?.code,
    )
  }

  return payload as T
}

function queryString(query: CommonPhraseQuery) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  const serialized = params.toString()

  return serialized ? `?${serialized}` : ''
}

function jsonBody(body: unknown): RequestInit {
  return {
    body: JSON.stringify(body),
    method: 'POST',
  }
}

export const commonPhraseApi: CommonPhraseService = {
  list(query: CommonPhraseQuery = {}) {
    return request<CommonPhraseListResponse>(
      `/api/common-phrases${queryString(query)}`,
    )
  },

  createCategory(categoryName: string) {
    return request<{ data: CommonPhraseCategory }>(
      '/api/common-phrase-categories',
      jsonBody({ categoryName }),
    ).then((response) => response.data)
  },

  renameCategory(categoryId: string, categoryName: string) {
    return request<{ data: CommonPhraseCategory }>(
      `/api/common-phrase-categories?id=${encodeURIComponent(categoryId)}`,
      {
        body: JSON.stringify({ categoryName }),
        method: 'PATCH',
      },
    ).then((response) => response.data)
  },

  deleteCategory(categoryId: string) {
    return request<{ data: null }>(
      `/api/common-phrase-categories?id=${encodeURIComponent(categoryId)}`,
      { method: 'DELETE' },
    ).then(() => undefined)
  },

  createPhrase(input: CommonPhraseWriteInput) {
    return request<{ data: CommonPhraseEntry }>(
      '/api/common-phrases',
      jsonBody(input),
    ).then((response) => response.data)
  },

  updatePhrase(phraseId: string, input: CommonPhraseWriteInput) {
    return request<{ data: CommonPhraseEntry }>(
      `/api/common-phrases/${encodeURIComponent(phraseId)}`,
      {
        body: JSON.stringify(input),
        method: 'PATCH',
      },
    ).then((response) => response.data)
  },

  updateStatus(
    phraseId: string,
    status: CommonPhraseStatus,
    updatedBy?: string,
  ) {
    return request<{ data: CommonPhraseEntry }>(
      `/api/common-phrases/${encodeURIComponent(phraseId)}/status`,
      {
        body: JSON.stringify({ status, updatedBy }),
        method: 'PATCH',
      },
    ).then((response) => response.data)
  },

  deletePhrase(phraseId: string) {
    return request<{ data: null }>(
      `/api/common-phrases/${encodeURIComponent(phraseId)}`,
      { method: 'DELETE' },
    ).then(() => undefined)
  },

  movePhrases(phraseIds: string[], categoryId: string, updatedBy?: string) {
    return request<{ data: null }>(
      '/api/common-phrases/move',
      jsonBody({ categoryId, phraseIds, updatedBy }),
    ).then(() => undefined)
  },
}
