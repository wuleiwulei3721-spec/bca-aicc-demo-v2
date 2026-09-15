import { randomUUID } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import {
  defaultCommonPhraseCategories,
  defaultCommonPhraseEntries,
} from './commonPhraseSeed.ts'
import type {
  CommonPhraseCategory,
  CommonPhraseEntry,
  CommonPhraseStatus,
} from '../src/types/commonPhrase.ts'

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

export interface CommonPhraseCategoryWriteInput {
  categoryName: string
}

export interface CommonPhraseMoveInput {
  categoryId: string
  phraseIds: string[]
  updatedBy?: string
}

export class CommonPhraseRepositoryError extends Error {
  readonly code: string
  readonly statusCode: number

  constructor(message: string, statusCode = 400, code = 'VALIDATION_ERROR') {
    super(message)
    this.name = 'CommonPhraseRepositoryError'
    this.code = code
    this.statusCode = statusCode
  }
}

const DEFAULT_AUDIT_ACTOR = '1234-Admin'
const MAX_SHORTCUT_CODE_LENGTH = 50
const MAX_PHRASE_LENGTH = 2000
const MAX_REMARK_LENGTH = 2000
const ACTIVE_STATUS: CommonPhraseStatus = 'Active'
const VALID_STATUSES: CommonPhraseStatus[] = ['Active', 'Disabled']

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function auditActor(value?: string) {
  const normalizedValue = value?.trim()

  return normalizedValue || DEFAULT_AUDIT_ACTOR
}

function auditTime() {
  return new Date().toISOString()
}

function requiredString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CommonPhraseRepositoryError(`${fieldName} is required.`)
  }

  return value.trim()
}

function statusValue(value: unknown): CommonPhraseStatus {
  if (typeof value !== 'string' || !VALID_STATUSES.includes(value as CommonPhraseStatus)) {
    throw new CommonPhraseRepositoryError('Status must be Active or Disabled.')
  }

  return value as CommonPhraseStatus
}

function rowString(row: Record<string, unknown>, key: string) {
  const value = row[key]

  return typeof value === 'string' ? value : String(value ?? '')
}

function withTransaction<T>(database: DatabaseSync, callback: () => T) {
  database.exec('BEGIN')

  try {
    const result = callback()
    database.exec('COMMIT')
    return result
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
}

function createSchema(database: DatabaseSync) {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS common_phrase_categories (
      category_id TEXT PRIMARY KEY,
      category_name TEXT NOT NULL,
      category_name_normalized TEXT NOT NULL UNIQUE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS common_phrases (
      phrase_id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      shortcut_code TEXT NOT NULL,
      shortcut_code_normalized TEXT NOT NULL UNIQUE,
      phrase_text TEXT NOT NULL,
      remark TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK (status IN ('Active', 'Disabled')),
      created_at TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES common_phrase_categories(category_id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS common_phrases_category_idx
      ON common_phrases(category_id);
    CREATE INDEX IF NOT EXISTS common_phrases_status_idx
      ON common_phrases(status);
  `)

  const addColumnIfMissing = (tableName: string, columnDefinition: string) => {
    const columns = database
      .prepare(`PRAGMA table_info(${tableName})`)
      .all() as Array<Record<string, unknown>>
    const columnName = columnDefinition.split(' ')[0]

    if (!columns.some((column) => column.name === columnName)) {
      database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`)
    }
  }

  addColumnIfMissing(
    'common_phrase_categories',
    'sort_order INTEGER NOT NULL DEFAULT 0',
  )
  addColumnIfMissing('common_phrases', "remark TEXT NOT NULL DEFAULT ''")
  addColumnIfMissing(
    'common_phrases',
    'sort_order INTEGER NOT NULL DEFAULT 0',
  )
  addColumnIfMissing(
    'common_phrases',
    "created_at TEXT NOT NULL DEFAULT ''",
  )
  addColumnIfMissing(
    'common_phrases',
    "created_by TEXT NOT NULL DEFAULT ''",
  )
  database.exec(`
    UPDATE common_phrase_categories SET sort_order = rowid WHERE sort_order = 0;
    UPDATE common_phrases SET sort_order = rowid WHERE sort_order = 0;
    UPDATE common_phrases SET created_at = updated_at WHERE created_at = '';
    UPDATE common_phrases SET created_by = updated_by WHERE created_by = '';
  `)
}

function seedDatabase(database: DatabaseSync) {
  const categoryCount = database
    .prepare('SELECT COUNT(*) AS count FROM common_phrase_categories')
    .get() as Record<string, unknown> | undefined

  if (Number(categoryCount?.count ?? 0) > 0) {
    return
  }

  withTransaction(database, () => {
    const addCategory = database.prepare(`
      INSERT INTO common_phrase_categories
        (category_id, category_name, category_name_normalized, sort_order)
      VALUES (?, ?, ?, ?)
    `)
    const addPhrase = database.prepare(`
      INSERT INTO common_phrases
        (phrase_id, category_id, shortcut_code, shortcut_code_normalized,
         phrase_text, remark, sort_order, status, created_at, created_by,
         updated_at, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    defaultCommonPhraseCategories.forEach((category) => {
      addCategory.run(
        category.categoryId,
        category.categoryName,
        normalizeValue(category.categoryName),
        category.sortOrder,
      )
    })

    defaultCommonPhraseEntries.forEach((entry) => {
      addPhrase.run(
        entry.phraseId,
        entry.categoryId,
        entry.shortcutCode,
        normalizeValue(entry.shortcutCode),
        entry.phraseText,
        entry.remark,
        entry.sortOrder,
        ACTIVE_STATUS,
        entry.createdAt,
        entry.createdBy,
        entry.updatedAt,
        entry.updatedBy,
      )
    })
  })
}

function mapCategory(row: Record<string, unknown>): CommonPhraseCategory {
  return {
    categoryId: rowString(row, 'category_id'),
    categoryName: rowString(row, 'category_name'),
    sortOrder: Number(row.sort_order ?? 0),
  }
}

function mapEntry(row: Record<string, unknown>): CommonPhraseEntry {
  return {
    categoryId: rowString(row, 'category_id'),
    phraseId: rowString(row, 'phrase_id'),
    phraseText: rowString(row, 'phrase_text'),
    remark: rowString(row, 'remark'),
    sortOrder: Number(row.sort_order ?? 0),
    shortcutCode: rowString(row, 'shortcut_code'),
    status: statusValue(row.status),
    createdAt: rowString(row, 'created_at'),
    createdBy: rowString(row, 'created_by'),
    updatedAt: rowString(row, 'updated_at'),
    updatedBy: rowString(row, 'updated_by'),
  }
}

export function createCommonPhraseRepository(database: DatabaseSync) {
  createSchema(database)
  seedDatabase(database)

  const getCategory = (categoryId: string) => {
    const row = database
      .prepare(`
        SELECT category_id, category_name, sort_order
        FROM common_phrase_categories
        WHERE category_id = ?
      `)
      .get(categoryId) as Record<string, unknown> | undefined

    if (!row) {
      throw new CommonPhraseRepositoryError(
        'Category was not found.',
        404,
        'NOT_FOUND',
      )
    }

    return mapCategory(row)
  }

  const getEntry = (phraseId: string) => {
    const row = database
      .prepare(`
        SELECT phrase_id, category_id, shortcut_code, phrase_text, remark,
               sort_order, status, created_at, created_by, updated_at, updated_by
        FROM common_phrases
        WHERE phrase_id = ?
      `)
      .get(phraseId) as Record<string, unknown> | undefined

    if (!row) {
      throw new CommonPhraseRepositoryError(
        'Common phrase was not found.',
        404,
        'NOT_FOUND',
      )
    }

    return mapEntry(row)
  }

  const validatePhraseInput = (input: CommonPhraseWriteInput) => {
    const categoryId = requiredString(input.categoryId, 'Category')
    const shortcutCode = requiredString(input.shortcutCode, 'Shortcut Code')
    const phraseText = requiredString(input.phraseText, 'Common Phrase')

    if (shortcutCode.length > MAX_SHORTCUT_CODE_LENGTH) {
      throw new CommonPhraseRepositoryError(
        `Shortcut Code must be ${MAX_SHORTCUT_CODE_LENGTH} characters or fewer.`,
      )
    }

    if (phraseText.length > MAX_PHRASE_LENGTH) {
      throw new CommonPhraseRepositoryError(
        `Common Phrase must be ${MAX_PHRASE_LENGTH} characters or fewer.`,
      )
    }

    const remark = typeof input.remark === 'string' ? input.remark.trim() : ''

    if (remark.length > MAX_REMARK_LENGTH) {
      throw new CommonPhraseRepositoryError(
        `Remark must be ${MAX_REMARK_LENGTH} characters or fewer.`,
      )
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
                throw new CommonPhraseRepositoryError(
                  'Sort Order must be a non-negative integer.',
                )
              })(),
      shortcutCode,
      status: statusValue(input.status),
      updatedBy: auditActor(input.updatedBy),
    }
  }

  const assertShortcutCodeAvailable = (
    shortcutCode: string,
    phraseId?: string,
  ) => {
    const existing = database
      .prepare(`
        SELECT phrase_id
        FROM common_phrases
        WHERE shortcut_code_normalized = ?
      `)
      .get(normalizeValue(shortcutCode)) as Record<string, unknown> | undefined

    if (existing && rowString(existing, 'phrase_id') !== phraseId) {
      throw new CommonPhraseRepositoryError(
        'Shortcut Code already exists.',
        409,
        'DUPLICATE_SHORTCUT_CODE',
      )
    }
  }

  return {
    list(query: CommonPhraseQuery = {}): CommonPhraseListResponse {
      const where: string[] = []
      const parameters: string[] = []

      if (query.categoryId?.trim()) {
        where.push('category_id = ?')
        parameters.push(query.categoryId.trim())
      }

      if (query.shortcutCode?.trim()) {
        where.push('instr(lower(shortcut_code), lower(?)) > 0')
        parameters.push(query.shortcutCode.trim())
      }

      if (query.phraseText?.trim()) {
        where.push('instr(lower(phrase_text), lower(?)) > 0')
        parameters.push(query.phraseText.trim())
      }

      if (query.status) {
        where.push('status = ?')
        parameters.push(statusValue(query.status))
      }

      const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
      const entries = database
        .prepare(`
          SELECT phrase_id, category_id, shortcut_code, phrase_text, remark,
                 sort_order, status, created_at, created_by, updated_at, updated_by
          FROM common_phrases
          ${whereClause}
          ORDER BY sort_order ASC, rowid ASC
        `)
        .all(...parameters)
        .map((row) => mapEntry(row))
      const categories = database
        .prepare(`
          SELECT category_id, category_name, sort_order
          FROM common_phrase_categories
          ORDER BY sort_order ASC, rowid ASC
        `)
        .all()
        .map((row) => mapCategory(row))
      const categoryCounts = Object.fromEntries(
        database
          .prepare(`
            SELECT category_id, COUNT(*) AS count
            FROM common_phrases
            GROUP BY category_id
          `)
          .all()
          .map((row) => [rowString(row, 'category_id'), Number(row.count ?? 0)]),
      )

      return { categories, categoryCounts, entries }
    },

    createCategory(input: CommonPhraseCategoryWriteInput) {
      const categoryName = requiredString(input.categoryName, 'Category Name')
      const normalizedName = normalizeValue(categoryName)
      const existing = database
        .prepare(`
          SELECT category_id
          FROM common_phrase_categories
          WHERE category_name_normalized = ?
        `)
        .get(normalizedName)

      if (existing) {
        throw new CommonPhraseRepositoryError(
          'Category Name already exists.',
          409,
          'DUPLICATE_CATEGORY_NAME',
        )
      }

      const category = {
        categoryId: `public-category-${randomUUID()}`,
        categoryName,
        sortOrder: Number(
          (
            database
              .prepare(
                'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM common_phrase_categories',
              )
              .get() as Record<string, unknown>
          ).next_order,
        ),
      }

      database
        .prepare(`
          INSERT INTO common_phrase_categories
            (category_id, category_name, category_name_normalized, sort_order)
          VALUES (?, ?, ?, ?)
        `)
        .run(
          category.categoryId,
          category.categoryName,
          normalizedName,
          category.sortOrder,
        )

      return category
    },

    renameCategory(categoryId: string, input: CommonPhraseCategoryWriteInput) {
      const category = getCategory(requiredString(categoryId, 'Category'))
      const categoryName = requiredString(input.categoryName, 'Category Name')
      const normalizedName = normalizeValue(categoryName)
      const existing = database
        .prepare(`
          SELECT category_id
          FROM common_phrase_categories
          WHERE category_name_normalized = ?
        `)
        .get(normalizedName) as Record<string, unknown> | undefined

      if (existing && rowString(existing, 'category_id') !== category.categoryId) {
        throw new CommonPhraseRepositoryError(
          'Category Name already exists.',
          409,
          'DUPLICATE_CATEGORY_NAME',
        )
      }

      database
        .prepare(`
          UPDATE common_phrase_categories
          SET category_name = ?, category_name_normalized = ?
          WHERE category_id = ?
        `)
        .run(categoryName, normalizedName, category.categoryId)

      return { categoryId: category.categoryId, categoryName }
    },

    deleteCategory(categoryId: string) {
      const category = getCategory(requiredString(categoryId, 'Category'))

      database
        .prepare('DELETE FROM common_phrase_categories WHERE category_id = ?')
        .run(category.categoryId)
    },

    createPhrase(input: CommonPhraseWriteInput) {
      const validated = validatePhraseInput(input)
      assertShortcutCodeAvailable(validated.shortcutCode)
      const phraseId = `public-phrase-${randomUUID()}`
      const updatedAt = auditTime()
      const sortOrder =
        validated.sortOrder ??
        Number(
          (
            database
              .prepare(
                'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM common_phrases',
              )
              .get() as Record<string, unknown>
          ).next_order,
        )

      database
        .prepare(`
          INSERT INTO common_phrases
            (phrase_id, category_id, shortcut_code, shortcut_code_normalized,
             phrase_text, remark, sort_order, status, created_at, created_by,
             updated_at, updated_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .run(
          phraseId,
          validated.categoryId,
          validated.shortcutCode,
          normalizeValue(validated.shortcutCode),
          validated.phraseText,
          validated.remark,
          sortOrder,
          validated.status,
          updatedAt,
          validated.updatedBy,
          updatedAt,
          validated.updatedBy,
        )

      return getEntry(phraseId)
    },

    updatePhrase(phraseId: string, input: CommonPhraseWriteInput) {
      const currentEntry = getEntry(requiredString(phraseId, 'Phrase ID'))
      const validated = validatePhraseInput(input)
      assertShortcutCodeAvailable(validated.shortcutCode, currentEntry.phraseId)
      const updatedAt = auditTime()

      database
        .prepare(`
          UPDATE common_phrases
          SET category_id = ?, shortcut_code = ?, shortcut_code_normalized = ?,
              phrase_text = ?, remark = ?, sort_order = ?, status = ?,
              updated_at = ?, updated_by = ?
          WHERE phrase_id = ?
        `)
        .run(
          validated.categoryId,
          validated.shortcutCode,
          normalizeValue(validated.shortcutCode),
          validated.phraseText,
          validated.remark,
          validated.sortOrder ?? currentEntry.sortOrder,
          validated.status,
          updatedAt,
          validated.updatedBy,
          currentEntry.phraseId,
        )

      return getEntry(currentEntry.phraseId)
    },

    updateStatus(
      phraseId: string,
      status: CommonPhraseStatus,
      updatedBy?: string,
    ) {
      const currentEntry = getEntry(requiredString(phraseId, 'Phrase ID'))
      const nextStatus = statusValue(status)
      const updatedAt = auditTime()

      database
        .prepare(`
          UPDATE common_phrases
          SET status = ?, updated_at = ?, updated_by = ?
          WHERE phrase_id = ?
        `)
        .run(nextStatus, updatedAt, auditActor(updatedBy), currentEntry.phraseId)

      return getEntry(currentEntry.phraseId)
    },

    deletePhrases(phraseIds: string[]) {
      const ids = Array.from(
        new Set(phraseIds.map((phraseId) => phraseId.trim()).filter(Boolean)),
      )

      if (ids.length === 0) {
        throw new CommonPhraseRepositoryError('At least one phrase is required.')
      }

      withTransaction(database, () => {
        const deletePhrase = database.prepare(
          'DELETE FROM common_phrases WHERE phrase_id = ?',
        )

        ids.forEach((phraseId) => {
          getEntry(phraseId)
          deletePhrase.run(phraseId)
        })
      })
    },

    movePhrases(input: CommonPhraseMoveInput) {
      const categoryId = requiredString(input.categoryId, 'Category')
      const phraseIds = Array.from(
        new Set(input.phraseIds.map((phraseId) => phraseId.trim()).filter(Boolean)),
      )

      if (phraseIds.length === 0) {
        throw new CommonPhraseRepositoryError('At least one phrase is required.')
      }

      getCategory(categoryId)
      const updatedAt = auditTime()
      const updatedBy = auditActor(input.updatedBy)

      withTransaction(database, () => {
        const movePhrase = database.prepare(`
          UPDATE common_phrases
          SET category_id = ?, updated_at = ?, updated_by = ?
          WHERE phrase_id = ?
        `)

        phraseIds.forEach((phraseId) => {
          const entry = getEntry(phraseId)
          movePhrase.run(categoryId, updatedAt, updatedBy, entry.phraseId)
        })
      })
    },
  }
}
