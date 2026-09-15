import {
  defaultCommonPhraseCategories,
  defaultCommonPhraseEntries,
} from '../mock/commonPhrases'
import { DEFAULT_AUDIT_ACTOR } from '../utils/audit'
import {
  CommonPhraseApiError,
  type CommonPhraseListResponse,
  type CommonPhraseQuery,
  type CommonPhraseService,
  type CommonPhraseWriteInput,
} from './commonPhraseApi'
import type {
  CommonPhraseCategory,
  CommonPhraseEntry,
  CommonPhraseStatus,
} from '../types/commonPhrase'

const MAX_SHORTCUT_CODE_LENGTH = 50
const MAX_PHRASE_LENGTH = 2000
const MAX_REMARK_LENGTH = 2000
const VALID_STATUSES: CommonPhraseStatus[] = ['Active', 'Disabled']

let categories: CommonPhraseCategory[] = defaultCommonPhraseCategories.map(
  (category) => ({ ...category }),
)
let entries: CommonPhraseEntry[] = defaultCommonPhraseEntries.map((entry) => ({
  ...entry,
}))

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function fail(
  message: string,
  statusCode = 400,
  code = 'VALIDATION_ERROR',
): never {
  throw new CommonPhraseApiError(message, statusCode, code)
}

function requiredString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    fail(`${fieldName} is required.`)
  }

  return (value as string).trim()
}

function statusValue(value: unknown): CommonPhraseStatus {
  if (
    typeof value !== 'string' ||
    !VALID_STATUSES.includes(value as CommonPhraseStatus)
  ) {
    fail('Status must be Active or Disabled.')
  }

  return value as CommonPhraseStatus
}

function auditActor(value?: string) {
  return value?.trim() || DEFAULT_AUDIT_ACTOR
}

function auditTime() {
  return new Date().toISOString()
}

function createId(prefix: string) {
  const randomId = globalThis.crypto?.randomUUID?.()

  return `${prefix}-${randomId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
}

function getCategory(categoryId: string) {
  const category = categories.find((item) => item.categoryId === categoryId)

  if (!category) {
    fail('Category was not found.', 404, 'NOT_FOUND')
  }

  return category
}

function getEntry(phraseId: string) {
  const entry = entries.find((item) => item.phraseId === phraseId)

  if (!entry) {
    fail('Common phrase was not found.', 404, 'NOT_FOUND')
  }

  return entry
}

function validatePhraseInput(input: CommonPhraseWriteInput) {
  const categoryId = requiredString(input.categoryId, 'Category')
  const shortcutCode = requiredString(input.shortcutCode, 'Shortcut Code')
  const phraseText = requiredString(input.phraseText, 'Common Phrase')
  const remark = typeof input.remark === 'string' ? input.remark.trim() : ''

  if (shortcutCode.length > MAX_SHORTCUT_CODE_LENGTH) {
    fail(
      `Shortcut Code must be ${MAX_SHORTCUT_CODE_LENGTH} characters or fewer.`,
    )
  }

  if (phraseText.length > MAX_PHRASE_LENGTH) {
    fail(`Common Phrase must be ${MAX_PHRASE_LENGTH} characters or fewer.`)
  }

  if (remark.length > MAX_REMARK_LENGTH) {
    fail(`Remark must be ${MAX_REMARK_LENGTH} characters or fewer.`)
  }

  getCategory(categoryId)

  return {
    categoryId,
    phraseText,
    remark,
    sortOrder:
      input.sortOrder === undefined
        ? undefined
        : Number.isInteger(input.sortOrder) && input.sortOrder >= 0
          ? input.sortOrder
          : (() => {
              fail('Sort Order must be a non-negative integer.')
            })(),
    shortcutCode,
    status: statusValue(input.status),
    updatedBy: auditActor(input.updatedBy),
  }
}

function assertCategoryNameAvailable(categoryName: string, categoryId?: string) {
  const normalizedName = normalizeValue(categoryName)
  const existing = categories.find(
    (category) => normalizeValue(category.categoryName) === normalizedName,
  )

  if (existing && existing.categoryId !== categoryId) {
    fail('Category Name already exists.', 409, 'DUPLICATE_CATEGORY_NAME')
  }
}

function assertShortcutCodeAvailable(shortcutCode: string, phraseId?: string) {
  const normalizedCode = normalizeValue(shortcutCode)
  const existing = entries.find(
    (entry) => normalizeValue(entry.shortcutCode) === normalizedCode,
  )

  if (existing && existing.phraseId !== phraseId) {
    fail('Shortcut Code already exists.', 409, 'DUPLICATE_SHORTCUT_CODE')
  }
}

function cloneCategory(category: CommonPhraseCategory) {
  return { ...category }
}

function cloneEntry(entry: CommonPhraseEntry) {
  return { ...entry }
}

function listResponse(query: CommonPhraseQuery = {}): CommonPhraseListResponse {
  const normalizedCategoryId = query.categoryId?.trim()
  const normalizedShortcutCode = query.shortcutCode
    ? normalizeValue(query.shortcutCode)
    : ''
  const normalizedPhraseText = query.phraseText
    ? normalizeValue(query.phraseText)
    : ''
  const filteredEntries = entries.filter((entry) => {
    const categoryMatched = normalizedCategoryId
      ? entry.categoryId === normalizedCategoryId
      : true
    const shortcutMatched = normalizedShortcutCode
      ? normalizeValue(entry.shortcutCode).includes(normalizedShortcutCode)
      : true
    const phraseMatched = normalizedPhraseText
      ? normalizeValue(entry.phraseText).includes(normalizedPhraseText)
      : true
    const statusMatched = query.status ? entry.status === query.status : true

    return categoryMatched && shortcutMatched && phraseMatched && statusMatched
  })
  const categoryCounts = entries.reduce<Record<string, number>>(
    (counts, entry) => {
      counts[entry.categoryId] = (counts[entry.categoryId] ?? 0) + 1
      return counts
    },
    {},
  )

  return {
    categories: categories.map(cloneCategory),
    categoryCounts,
    entries: filteredEntries.slice().reverse().map(cloneEntry),
  }
}

export const commonPhraseDemoApi: CommonPhraseService = {
  async list(query = {}) {
    return listResponse(query)
  },

  async createCategory(categoryName) {
    const normalizedName = requiredString(categoryName, 'Category Name')
    assertCategoryNameAvailable(normalizedName)
    const category = {
      categoryId: createId('public-category'),
      categoryName: normalizedName,
      sortOrder:
        categories.reduce(
          (maximum, category) => Math.max(maximum, category.sortOrder),
          0,
        ) + 1,
    }

    categories = [...categories, category]
    return cloneCategory(category)
  },

  async renameCategory(categoryId, categoryName) {
    const category = getCategory(requiredString(categoryId, 'Category'))
    const normalizedName = requiredString(categoryName, 'Category Name')
    assertCategoryNameAvailable(normalizedName, category.categoryId)
    category.categoryName = normalizedName
    return cloneCategory(category)
  },

  async deleteCategory(categoryId) {
    const category = getCategory(requiredString(categoryId, 'Category'))
    categories = categories.filter((item) => item.categoryId !== category.categoryId)
    entries = entries.filter((entry) => entry.categoryId !== category.categoryId)
  },

  async createPhrase(input) {
    const validated = validatePhraseInput(input)
    assertShortcutCodeAvailable(validated.shortcutCode)
    const entry: CommonPhraseEntry = {
      categoryId: validated.categoryId,
      phraseId: createId('public-phrase'),
      phraseText: validated.phraseText,
      remark: validated.remark,
      sortOrder:
        validated.sortOrder ??
        entries.reduce(
          (maximum, entry) => Math.max(maximum, entry.sortOrder),
          0,
        ) + 1,
      shortcutCode: validated.shortcutCode,
      status: validated.status,
      createdAt: auditTime(),
      createdBy: validated.updatedBy,
      updatedAt: auditTime(),
      updatedBy: validated.updatedBy,
    }

    entries = [...entries, entry]
    return cloneEntry(entry)
  },

  async updatePhrase(phraseId, input) {
    const currentEntry = getEntry(requiredString(phraseId, 'Phrase ID'))
    const validated = validatePhraseInput(input)
    assertShortcutCodeAvailable(validated.shortcutCode, currentEntry.phraseId)
    Object.assign(currentEntry, {
      categoryId: validated.categoryId,
      phraseText: validated.phraseText,
      remark: validated.remark,
      sortOrder: validated.sortOrder ?? currentEntry.sortOrder,
      shortcutCode: validated.shortcutCode,
      status: validated.status,
      updatedAt: auditTime(),
      updatedBy: validated.updatedBy,
    })

    return cloneEntry(currentEntry)
  },

  async updateStatus(phraseId, status, updatedBy) {
    const entry = getEntry(requiredString(phraseId, 'Phrase ID'))
    entry.status = statusValue(status)
    entry.updatedAt = auditTime()
    entry.updatedBy = auditActor(updatedBy)
    return cloneEntry(entry)
  },

  async deletePhrase(phraseId) {
    const entry = getEntry(requiredString(phraseId, 'Phrase ID'))
    entries = entries.filter((item) => item.phraseId !== entry.phraseId)
  },

  async movePhrases(phraseIds, categoryId, updatedBy) {
    const targetCategoryId = requiredString(categoryId, 'Category')
    const ids = Array.from(
      new Set(phraseIds.map((phraseId) => phraseId.trim()).filter(Boolean)),
    )

    if (ids.length === 0) {
      fail('At least one phrase is required.')
    }

    getCategory(targetCategoryId)
    const nextUpdatedAt = auditTime()
    const nextUpdatedBy = auditActor(updatedBy)

    ids.forEach((phraseId) => {
      const entry = getEntry(phraseId)
      entry.categoryId = targetCategoryId
      entry.updatedAt = nextUpdatedAt
      entry.updatedBy = nextUpdatedBy
    })
  },
}
