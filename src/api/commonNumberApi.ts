import type { CommonNumberEntry, CommonNumberStatus } from '../types/commonNumber'

export interface CommonNumberQuery {
  name?: string
  number?: string
  status?: CommonNumberStatus
}

export interface CommonNumberWriteInput {
  name: string
  number: string
  remark?: string
  status: CommonNumberStatus
  updatedBy?: string
}

export interface CommonNumberService {
  list: (query?: CommonNumberQuery) => Promise<{ entries: CommonNumberEntry[] }>
  create: (input: CommonNumberWriteInput) => Promise<CommonNumberEntry>
  update: (id: string, input: CommonNumberWriteInput) => Promise<CommonNumberEntry>
  delete: (id: string) => Promise<void>
}

interface CommonNumberApiErrorPayload {
  error?: { code?: string; message?: string }
}

export class CommonNumberApiError extends Error {
  readonly code: string
  readonly statusCode: number

  constructor(message: string, statusCode: number, code = 'API_ERROR') {
    super(message)
    this.name = 'CommonNumberApiError'
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
    throw new CommonNumberApiError(
      'The local Common Number service is unavailable.',
      0,
      'SERVICE_UNAVAILABLE',
    )
  }

  const payload = (await response.json().catch(() => null)) as
    | T
    | CommonNumberApiErrorPayload
    | null
  if (!response.ok) {
    const errorPayload = payload as CommonNumberApiErrorPayload | null
    throw new CommonNumberApiError(
      errorPayload?.error?.message ?? 'The Common Number request failed.',
      response.status,
      errorPayload?.error?.code,
    )
  }
  return payload as T
}

function queryString(query: CommonNumberQuery) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

export const commonNumberApi: CommonNumberService = {
  list(query = {}) {
    return request<{ entries: CommonNumberEntry[] }>(
      `/api/common-numbers${queryString(query)}`,
    )
  },
  create(input) {
    return request<{ data: CommonNumberEntry }>('/api/common-numbers', {
      body: JSON.stringify(input),
      method: 'POST',
    }).then((response) => response.data)
  },
  update(id, input) {
    return request<{ data: CommonNumberEntry }>(
      `/api/common-numbers/${encodeURIComponent(id)}`,
      { body: JSON.stringify(input), method: 'PATCH' },
    ).then((response) => response.data)
  },
  delete(id) {
    return request<{ data: null }>(
      `/api/common-numbers/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    ).then(() => undefined)
  },
}
