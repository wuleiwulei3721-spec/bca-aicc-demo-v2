import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCommonPhraseHttpServer } from './commonPhraseHttp.ts'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectDirectory = path.resolve(serverDirectory, '..')
const databaseDirectory = path.join(projectDirectory, 'data')
const databasePath = process.env.COMMON_PHRASE_DB_PATH ?? path.join(databaseDirectory, 'common-phrases.sqlite')
const port = Number(process.env.PORT ?? 3001)

await mkdir(path.dirname(databasePath), { recursive: true })

const { closeDatabase, server } = createCommonPhraseHttpServer(databasePath)
let isShuttingDown = false

const shutdown = () => {
  if (isShuttingDown) {
    return
  }

  isShuttingDown = true
  server.close(() => {
    closeDatabase()
    process.exit(0)
  })
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)

server.listen(port, '127.0.0.1', () => {
  console.log(`Common Phrase API listening on http://127.0.0.1:${port}`)
  console.log(`SQLite database: ${databasePath}`)
})
