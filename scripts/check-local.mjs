import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const apiBaseUrl = process.env.COMMON_PHRASE_API_URL ?? 'http://127.0.0.1:3001'
const databasePath = process.env.COMMON_PHRASE_DB_PATH
  ? path.resolve(process.env.COMMON_PHRASE_DB_PATH)
  : path.resolve('data/common-phrases.sqlite')
const startedAt = performance.now()

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function getJson(route) {
  const response = await fetch(`${apiBaseUrl}${route}`, {
    signal: AbortSignal.timeout(1500),
  })
  const text = await response.text()
  let payload

  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error(`${route} returned non-JSON data (HTTP ${response.status})`)
  }

  assertCondition(response.ok, `${route} returned HTTP ${response.status}`)
  return payload
}

function checkDatabase() {
  const database = new DatabaseSync(databasePath)

  try {
    const integrity = database.prepare('PRAGMA integrity_check').get()
    assertCondition(integrity?.integrity_check === 'ok', 'SQLite integrity check failed')

    const tables = database
      .prepare(`
        SELECT name
        FROM sqlite_schema
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
      `)
      .all()
      .map((row) => row.name)

    assertCondition(
      tables.includes('common_phrase_categories') && tables.includes('common_phrases'),
      'Common Phrase tables are missing',
    )

    const categories = database
      .prepare('SELECT COUNT(*) AS count FROM common_phrase_categories')
      .get()
    const phrases = database
      .prepare('SELECT COUNT(*) AS count FROM common_phrases')
      .get()

    return {
      categoryCount: Number(categories?.count ?? 0),
      phraseCount: Number(phrases?.count ?? 0),
    }
  } finally {
    database.close()
  }
}

try {
  const database = checkDatabase()
  const health = await getJson('/api/health')
  assertCondition(health.status === 'ok', 'API health status is not ok')

  const all = await getJson('/api/common-phrases')
  assertCondition(Array.isArray(all.categories), 'API categories payload is invalid')
  assertCondition(Array.isArray(all.entries), 'API entries payload is invalid')
  assertCondition(all.categories.length === database.categoryCount, 'API/database category counts differ')
  assertCondition(all.entries.length === database.phraseCount, 'API/database phrase counts differ')

  const active = await getJson('/api/common-phrases?status=Active')
  assertCondition(
    active.entries.every((entry) => entry.status === 'Active'),
    'Active filter returned a non-active phrase',
  )

  const elapsed = Math.round(performance.now() - startedAt)
  console.log(`Local check passed in ${elapsed}ms`)
  console.log(`API: ${apiBaseUrl} | SQLite: ${databasePath}`)
  console.log(`Categories: ${database.categoryCount} | Phrases: ${database.phraseCount} | Active: ${active.entries.length}`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Local check failed: ${message}`)
  console.error('Start the local stack with: npm run dev')
  process.exitCode = 1
}
