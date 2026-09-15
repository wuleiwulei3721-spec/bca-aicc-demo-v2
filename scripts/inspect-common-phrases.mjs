import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const databasePath = process.env.COMMON_PHRASE_DB_PATH
  ? path.resolve(process.env.COMMON_PHRASE_DB_PATH)
  : path.resolve('data/common-phrases.sqlite')
const database = new DatabaseSync(databasePath)

try {
  console.log(`SQLite: ${databasePath}`)
  console.log('\nTABLES')
  console.table(
    database
      .prepare(`
        SELECT name, sql
        FROM sqlite_schema
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `)
      .all(),
  )

  console.log('\nINDEXES')
  console.table(
    database
      .prepare(`
        SELECT name, tbl_name, sql
        FROM sqlite_schema
        WHERE type = 'index'
          AND sql IS NOT NULL
        ORDER BY name
      `)
      .all(),
  )

  console.log('\nCATEGORIES')
  console.table(
    database
      .prepare(`
        SELECT category_id, category_name, category_name_normalized
        FROM common_phrase_categories
        ORDER BY category_name
      `)
      .all(),
  )

  console.log('\nPHRASES')
  console.table(
    database
      .prepare(`
        SELECT
          p.phrase_id,
          c.category_name,
          p.shortcut_code,
          p.phrase_text,
          p.status,
          p.updated_at,
          p.updated_by
        FROM common_phrases p
        JOIN common_phrase_categories c ON c.category_id = p.category_id
        ORDER BY p.shortcut_code
      `)
      .all(),
  )
} finally {
  database.close()
}
