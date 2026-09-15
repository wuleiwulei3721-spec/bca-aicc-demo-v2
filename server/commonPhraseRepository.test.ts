import { strict as assert } from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { createCommonPhraseHttpServer } from './commonPhraseHttp.ts'
import {
  createCommonPhraseRepository,
  CommonPhraseRepositoryError,
} from './commonPhraseRepository.ts'

function withRepository<T>(callback: (databasePath: string) => T) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'common-phrase-'))
  const databasePath = path.join(directory, 'test.sqlite')

  try {
    return callback(databasePath)
  } finally {
    rmSync(directory, { force: true, recursive: true })
  }
}

async function withHttpServer<T>(callback: (baseUrl: string) => Promise<T>) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'common-phrase-http-'))
  const databasePath = path.join(directory, 'test.sqlite')
  const { closeDatabase, server } = createCommonPhraseHttpServer(databasePath)

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0

  try {
    return await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
    closeDatabase()
    rmSync(directory, { force: true, recursive: true })
  }
}

test('seeds, queries, creates, updates, and persists common phrases', () => {
  withRepository((databasePath) => {
    const database = new DatabaseSync(databasePath)
    const repository = createCommonPhraseRepository(database)
    const initial = repository.list()

    assert.equal(initial.entries.length, 3)
    assert.equal(initial.categories.length, 2)
    assert.equal(repository.list({ status: 'Active' }).entries.length, 3)

    const created = repository.createPhrase({
      categoryId: initial.categories[0].categoryId,
      phraseText: 'A new locally persisted phrase.',
      shortcutCode: 'local-new',
      status: 'Active',
      updatedBy: '888888-Agent',
    })

    assert.equal(repository.list({ shortcutCode: 'LOCAL' }).entries[0].phraseId, created.phraseId)

    const updated = repository.updatePhrase(created.phraseId, {
      categoryId: initial.categories[1].categoryId,
      phraseText: 'The phrase was edited and disabled.',
      shortcutCode: 'local-edited',
      status: 'Disabled',
      updatedBy: '888888-Agent',
    })

    assert.equal(updated.status, 'Disabled')
    assert.equal(repository.list({ status: 'Active' }).entries.length, 3)
    assert.equal(repository.list({ status: 'Disabled' }).entries.length, 1)

    database.close()

    const reopenedDatabase = new DatabaseSync(databasePath)
    const reopenedRepository = createCommonPhraseRepository(reopenedDatabase)
    assert.equal(reopenedRepository.list({ shortcutCode: 'local-edited' }).entries.length, 1)
    reopenedDatabase.close()
  })
})

test('enforces normalized uniqueness and cascades category deletion', () => {
  withRepository((databasePath) => {
    const database = new DatabaseSync(databasePath)
    const repository = createCommonPhraseRepository(database)
    const initial = repository.list()

    assert.throws(
      () =>
        repository.createPhrase({
          categoryId: initial.categories[0].categoryId,
          phraseText: 'Duplicate shortcut',
          shortcutCode: ' AB ',
          status: 'Active',
        }),
      (error: unknown) =>
        error instanceof CommonPhraseRepositoryError &&
        error.statusCode === 409,
    )

    repository.deleteCategory(initial.categories[1].categoryId)
    assert.equal(repository.list().entries.length, 1)
    database.close()
  })
})

test('moves selected phrases and updates their audit metadata', () => {
  withRepository((databasePath) => {
    const database = new DatabaseSync(databasePath)
    const repository = createCommonPhraseRepository(database)
    const initial = repository.list()
    const phrase = initial.entries[0]

    repository.movePhrases({
      categoryId: initial.categories[0].categoryId,
      phraseIds: [phrase.phraseId],
      updatedBy: '888888-Agent',
    })

    const moved = repository.list({ shortcutCode: phrase.shortcutCode }).entries[0]
    assert.equal(moved.categoryId, initial.categories[0].categoryId)
    assert.equal(moved.updatedBy, '888888-Agent')
    database.close()
  })
})

test('serves the browser API with query and status endpoints', async () => {
  await withHttpServer(async (baseUrl) => {
    const initialResponse = await fetch(`${baseUrl}/api/common-phrases`)
    const initial = (await initialResponse.json()) as {
      categories: Array<{ categoryId: string }>
      entries: Array<{ phraseId: string; shortcutCode: string }>
    }

    assert.equal(initialResponse.status, 200)
    assert.equal(initial.entries.length, 3)

    const createdResponse = await fetch(`${baseUrl}/api/common-phrases`, {
      body: JSON.stringify({
        categoryId: initial.categories[0].categoryId,
        phraseText: 'HTTP API phrase',
        shortcutCode: 'http-api',
        status: 'Active',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const created = (await createdResponse.json()) as {
      data: { phraseId: string }
    }

    assert.equal(createdResponse.status, 201)

    const statusResponse = await fetch(
      `${baseUrl}/api/common-phrases/${created.data.phraseId}/status`,
      {
        body: JSON.stringify({ status: 'Disabled' }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      },
    )

    assert.equal(statusResponse.status, 200)

    const activeResponse = await fetch(
      `${baseUrl}/api/common-phrases?status=Active&shortcutCode=http-api`,
    )
    const active = (await activeResponse.json()) as {
      entries: Array<{ phraseId: string }>
    }

    assert.equal(activeResponse.status, 200)
    assert.equal(active.entries.length, 0)
  })
})
