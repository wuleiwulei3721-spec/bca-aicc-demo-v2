import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import mysql from 'mysql2/promise'

const defaults = {
  host: process.env.AICC_MYSQL_HOST ?? '127.0.0.1',
  port: process.env.AICC_MYSQL_PORT ?? '3306',
  database: process.env.AICC_MYSQL_DATABASE ?? 'aicc_demo_local',
  user: process.env.AICC_MYSQL_USER ?? 'root',
}
const defaultTableSelector = process.env.MYSQL_TABLES ?? 'common_phrase'

function escapeIdentifier(value) {
  return `\`${value.replaceAll('`', '``')}\``
}

function matchingTables(tables, selector) {
  const values = selector
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (values.includes('all')) {
    return tables
  }

  return tables.filter((table) =>
    values.some((value) => table.toLowerCase() === value || table.toLowerCase().includes(value)),
  )
}

const rl = readline.createInterface({ input, output })
let connection

try {
  if (!['127.0.0.1', 'localhost', '::1'].includes(defaults.host)) {
    throw new Error('This inspector only allows a local MySQL host.')
  }
  if (defaults.database !== 'aicc_demo_local') {
    throw new Error('This inspector only allows the aicc_demo_local database.')
  }

  const password = process.env.AICC_MYSQL_PASSWORD

  if (!password) {
    throw new Error('Run this through npm run db:mysql-schema so PowerShell can collect the local password securely.')
  }

  connection = await mysql.createConnection({
    host: defaults.host,
    port: Number(defaults.port),
    user: defaults.user,
    password,
    database: defaults.database,
    connectTimeout: 10000,
  })

  const [rows] = await connection.query(
    `SELECT TABLE_NAME AS tableName
       FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
        AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME`,
    [defaults.database],
  )
  const tables = rows.map((row) => row.tableName)

  console.log(`\nConnected. Found ${tables.length} tables in ${defaults.database}.`)
  let selected = matchingTables(tables, defaultTableSelector)

  if (selected.length > 0) {
    console.log(`Automatically selected: ${selected.join(', ')}`)
  } else {
    console.log(tables.join('\n'))
    console.log('\nNo Common Phrase-style table names were found automatically.')
    console.log('Enter exact table names or keywords separated by commas.')
    const selector = await rl.question('Tables: ')
    selected = matchingTables(tables, selector)
  }

  if (selected.length === 0) {
    throw new Error('No matching tables selected.')
  }

  const statements = [
    '-- Schema-only export. No table rows were queried.',
    `-- Source database: ${defaults.database}`,
    `-- Exported at: ${new Date().toISOString()}`,
    'SET FOREIGN_KEY_CHECKS = 0;',
  ]

  for (const table of selected) {
    const [createRows] = await connection.query(
      `SHOW CREATE TABLE ${escapeIdentifier(table)}`,
    )
    const createSql = createRows[0]?.['Create Table']

    if (typeof createSql !== 'string') {
      throw new Error(`Could not read CREATE TABLE for ${table}.`)
    }

    statements.push(`\n-- ${table}\n${createSql};`)
  }

  statements.push('SET FOREIGN_KEY_CHECKS = 1;\n')

  const outputPath = path.resolve('data/mysql-schema-export.sql')
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${statements.join('\n')}\n`, 'utf8')

  console.log(`\nExported ${selected.length} table definitions to ${outputPath}`)
  console.log('The export contains schema only; it does not contain passwords or row data.')
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`MySQL schema inspection failed: ${message}`)
  process.exitCode = 1
} finally {
  rl.close()
  await connection?.end().catch(() => undefined)
}
