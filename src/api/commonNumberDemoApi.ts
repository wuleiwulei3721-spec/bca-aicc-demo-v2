import { defaultCommonNumberEntries } from '../mock/commonNumbers'
import type { CommonNumberEntry, CommonNumberStatus } from '../types/commonNumber'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'
import {
  CommonNumberApiError,
  type CommonNumberQuery,
  type CommonNumberService,
  type CommonNumberWriteInput,
} from './commonNumberApi'

let entries = defaultCommonNumberEntries.map((entry) => ({ ...entry }))

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function fail(message: string, statusCode = 400, code = 'VALIDATION_ERROR'): never {
  throw new CommonNumberApiError(message, statusCode, code)
}

function validate(input: CommonNumberWriteInput, id?: string) {
  const name = input.name?.trim()
  const number = input.number?.trim()
  const remark = input.remark?.trim() ?? ''
  if (!name) fail('Name is required.')
  if (!number) fail('Number is required.')
  if (name.length > 200) fail('Name must be 200 characters or fewer.')
  if (number.length > 200) fail('Number must be 200 characters or fewer.')
  if (remark.length > 2000) fail('Remark must be 2000 characters or fewer.')
  if (!['Active', 'Disabled'].includes(input.status)) {
    fail('Status must be Active or Disabled.')
  }
  if (entries.some((entry) => entry.id !== id && normalize(entry.name) === normalize(name))) {
    fail('Name already exists.', 409, 'DUPLICATE_NAME')
  }
  if (entries.some((entry) => entry.id !== id && normalize(entry.number) === normalize(number))) {
    fail('Number already exists.', 409, 'DUPLICATE_NUMBER')
  }
  return { name, number, remark, status: input.status as CommonNumberStatus, updatedBy: input.updatedBy?.trim() || DEFAULT_AUDIT_ACTOR }
}

function clone(entry: CommonNumberEntry) {
  return { ...entry }
}

function getEntry(id: string) {
  const entry = entries.find((candidate) => candidate.id === id.trim())
  if (!entry) fail('Common number was not found.', 404, 'NOT_FOUND')
  return entry
}

export const commonNumberDemoApi: CommonNumberService = {
  async list(query: CommonNumberQuery = {}) {
    const name = query.name ? normalize(query.name) : ''
    const number = query.number ? normalize(query.number) : ''
    return {
      entries: entries
        .filter((entry) => (!name || normalize(entry.name).includes(name)) && (!number || normalize(entry.number).includes(number)) && (!query.status || entry.status === query.status))
        .map(clone),
    }
  },
  async create(input) {
    const value = validate(input)
    const entry: CommonNumberEntry = {
      id: `CN-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
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
