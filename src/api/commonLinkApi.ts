import type { CommonLinkEntry } from '../types/commonLink'

export interface CommonLinkQuery {
  websiteName?: string
  websiteUrl?: string
}

export interface CommonLinkWriteInput {
  remark?: string
  updatedBy?: string
  websiteName: string
  websiteUrl: string
}

export interface CommonLinkService {
  list: (query?: CommonLinkQuery) => Promise<{ entries: CommonLinkEntry[] }>
  create: (input: CommonLinkWriteInput) => Promise<CommonLinkEntry>
  update: (id: string, input: CommonLinkWriteInput) => Promise<CommonLinkEntry>
  delete: (id: string) => Promise<void>
}

interface CommonLinkApiErrorPayload {
  error?: { code?: string; message?: string }
}

export class CommonLinkApiError extends Error {
  readonly code: string
  readonly statusCode: number

  constructor(message: string, statusCode: number, code = 'API_ERROR') {
    super(message)
    this.name = 'CommonLinkApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch {
    throw new CommonLinkApiError(
      'The local Common Link service is unavailable.',
      0,
      'SERVICE_UNAVAILABLE',
    )
  }

  const payload = (await response.json().catch(() => null)) as
    | T
    | CommonLinkApiErrorPayload
    | null
  if (!response.ok) {
    const errorPayload = payload as CommonLinkApiErrorPayload | null
    throw new CommonLinkApiError(
      errorPayload?.error?.message ?? 'The Common Link request failed.',
      response.status,
      errorPayload?.error?.code,
    )
  }
  return payload as T
}

function queryString(query: CommonLinkQuery) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export const commonLinkApi: CommonLinkService = {
  list(query = {}) {
    return request<{ entries: CommonLinkEntry[] }>(
      `/api/common-links${queryString(query)}`,
    )
  },
  create(input) {
    return request<{ data: CommonLinkEntry }>('/api/common-links', {
      body: JSON.stringify(input),
      method: 'POST',
    }).then((response) => response.data)
  },
  update(id, input) {
    return request<{ data: CommonLinkEntry }>(
      `/api/common-links/${encodeURIComponent(id)}`,
      { body: JSON.stringify(input), method: 'PATCH' },
    ).then((response) => response.data)
  },
  delete(id) {
    return request<{ data: null }>(
      `/api/common-links/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    ).then(() => undefined)
  },
}
