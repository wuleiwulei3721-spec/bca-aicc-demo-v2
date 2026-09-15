import { defaultCommonLinkEntries } from '../mock/commonLinks'
import type { CommonLinkEntry } from '../types/commonLink'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'
import {
  CommonLinkApiError,
  type CommonLinkQuery,
  type CommonLinkService,
  type CommonLinkWriteInput,
} from './commonLinkApi'

let entries = defaultCommonLinkEntries.map((entry) => ({ ...entry }))

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function fail(message: string, statusCode = 400, code = 'VALIDATION_ERROR'): never {
  throw new CommonLinkApiError(message, statusCode, code)
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function validate(input: CommonLinkWriteInput, id?: string) {
  const websiteName = input.websiteName?.trim()
  const websiteUrl = input.websiteUrl?.trim()
  const remark = input.remark?.trim() ?? ''
  if (!websiteName) fail('Website Name is required.')
  if (!websiteUrl) fail('Website URL is required.')
  if (websiteName.length > 200) fail('Website Name must be 200 characters or fewer.')
  if (websiteUrl.length > 200) fail('Website URL must be 200 characters or fewer.')
  if (!isValidHttpUrl(websiteUrl)) fail('Website URL must start with http:// or https://.')
  if (remark.length > 2000) fail('Remark must be 2000 characters or fewer.')
  if (entries.some((entry) => entry.id !== id && normalize(entry.websiteName) === normalize(websiteName))) {
    fail('Website Name already exists.', 409, 'DUPLICATE_NAME')
  }
  if (entries.some((entry) => entry.id !== id && normalize(entry.websiteUrl) === normalize(websiteUrl))) {
    fail('Website URL already exists.', 409, 'DUPLICATE_URL')
  }
  return { remark, updatedBy: input.updatedBy?.trim() || DEFAULT_AUDIT_ACTOR, websiteName, websiteUrl }
}

function clone(entry: CommonLinkEntry) {
  return { ...entry }
}

function getEntry(id: string) {
  const entry = entries.find((candidate) => candidate.id === id.trim())
  if (!entry) fail('Common link was not found.', 404, 'NOT_FOUND')
  return entry
}

export const commonLinkDemoApi: CommonLinkService = {
  async list(query: CommonLinkQuery = {}) {
    const websiteName = query.websiteName ? normalize(query.websiteName) : ''
    const websiteUrl = query.websiteUrl ? normalize(query.websiteUrl) : ''
    return {
      entries: entries
        .filter((entry) => (!websiteName || normalize(entry.websiteName).includes(websiteName)) && (!websiteUrl || normalize(entry.websiteUrl).includes(websiteUrl)))
        .map(clone),
    }
  },
  async create(input) {
    const value = validate(input)
    const entry: CommonLinkEntry = {
      id: `CL-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
      ...value,
      updatedAt: new Date().toISOString(),
    }
    entries = [entry, ...entries]
    return clone(entry)
  },
  async update(id, input) {
    const entry = getEntry(id)
    const value = validate(input, entry.id)
    Object.assign(entry, value, { updatedAt: new Date().toISOString() })
    return clone(entry)
  },
  async delete(id) {
    const entry = getEntry(id)
    entries = entries.filter((candidate) => candidate.id !== entry.id)
  },
}
