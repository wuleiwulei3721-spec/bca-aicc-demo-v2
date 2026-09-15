import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import {
  CommonPhraseRepositoryError,
  createCommonPhraseRepository,
} from './commonPhraseRepository.ts'
import type {
  CommonPhraseCategoryWriteInput,
  CommonPhraseMoveInput,
  CommonPhraseQuery,
  CommonPhraseWriteInput,
} from './commonPhraseRepository.ts'

const MAX_REQUEST_BODY_BYTES = 1_000_000

interface JsonRecord {
  [key: string]: unknown
}

export interface CommonPhraseHttpServer {
  closeDatabase: () => void
  server: Server
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function queryValue(value: string | null) {
  return value?.trim() || undefined
}

async function readJson(request: IncomingMessage): Promise<JsonRecord> {
  const chunks: Buffer[] = []
  let totalBytes = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    totalBytes += buffer.length

    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      throw new CommonPhraseRepositoryError(
        'Request body is too large.',
        413,
        'PAYLOAD_TOO_LARGE',
      )
    }

    chunks.push(buffer)
  }

  if (chunks.length === 0) {
    return {}
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new CommonPhraseRepositoryError(
      'Request body must be valid JSON.',
      400,
      'INVALID_JSON',
    )
  }

  if (!isRecord(parsed)) {
    throw new CommonPhraseRepositoryError(
      'Request body must be a JSON object.',
      400,
      'INVALID_JSON',
    )
  }

  return parsed
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function sendError(response: ServerResponse, error: unknown) {
  if (error instanceof CommonPhraseRepositoryError) {
    sendJson(response, error.statusCode, {
      error: {
        code: error.code,
        message: error.message,
      },
    })
    return
  }

  console.error(error)
  sendJson(response, 500, {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'The local Common Phrase service failed.',
    },
  })
}

function phraseWriteInput(body: JsonRecord): CommonPhraseWriteInput {
  return {
    categoryId: stringValue(body.categoryId),
    phraseText: stringValue(body.phraseText),
    remark: stringValue(body.remark),
    sortOrder:
      typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
    shortcutCode: stringValue(body.shortcutCode),
    status: stringValue(body.status) as CommonPhraseWriteInput['status'],
    updatedBy: queryValue(stringValue(body.updatedBy)),
  }
}

function categoryWriteInput(body: JsonRecord): CommonPhraseCategoryWriteInput {
  return { categoryName: stringValue(body.categoryName) }
}

function commonPhraseQuery(url: URL): CommonPhraseQuery {
  return {
    categoryId: queryValue(url.searchParams.get('categoryId')),
    phraseText: queryValue(url.searchParams.get('phraseText')),
    shortcutCode: queryValue(url.searchParams.get('shortcutCode')),
    status: queryValue(url.searchParams.get('status')) as CommonPhraseQuery['status'],
  }
}

export function createCommonPhraseHttpServer(
  databasePath: string,
): CommonPhraseHttpServer {
  const database = new DatabaseSync(databasePath)
  const repository = createCommonPhraseRepository(database)
  const server = createServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
      response.statusCode = 204
      response.setHeader('Access-Control-Allow-Origin', '*')
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
      response.end()
      return
    }

    try {
      const url = new URL(request.url ?? '/', 'http://localhost')
      const pathname = url.pathname.replace(/\/$/, '') || '/'

      if (request.method === 'GET' && pathname === '/api/health') {
        sendJson(response, 200, { status: 'ok' })
        return
      }

      if (request.method === 'GET' && pathname === '/api/common-phrases') {
        sendJson(response, 200, repository.list(commonPhraseQuery(url)))
        return
      }

      if (pathname === '/api/common-phrase-categories') {
        const body = request.method === 'GET' ? {} : await readJson(request)

        if (request.method === 'POST') {
          sendJson(response, 201, {
            data: repository.createCategory(categoryWriteInput(body)),
          })
          return
        }

        const categoryId = url.searchParams.get('id') ?? ''

        if (request.method === 'PATCH') {
          sendJson(response, 200, {
            data: repository.renameCategory(categoryId, categoryWriteInput(body)),
          })
          return
        }

        if (request.method === 'DELETE') {
          repository.deleteCategory(categoryId)
          sendJson(response, 200, { data: null })
          return
        }
      }

      if (request.method === 'POST' && pathname === '/api/common-phrases/move') {
        const body = await readJson(request)
        const moveInput: CommonPhraseMoveInput = {
          categoryId: stringValue(body.categoryId),
          phraseIds: Array.isArray(body.phraseIds)
            ? body.phraseIds.map(stringValue)
            : [],
          updatedBy: queryValue(stringValue(body.updatedBy)),
        }
        repository.movePhrases(moveInput)
        sendJson(response, 200, { data: null })
        return
      }

      const statusMatch = pathname.match(/^\/api\/common-phrases\/([^/]+)\/status$/)

      if (statusMatch) {
        if (request.method !== 'PATCH') {
          throw new CommonPhraseRepositoryError('Method not allowed.', 405, 'METHOD_NOT_ALLOWED')
        }

        const body = await readJson(request)
        sendJson(response, 200, {
          data: repository.updateStatus(
            decodeURIComponent(statusMatch[1]),
            stringValue(body.status) as CommonPhraseWriteInput['status'],
            queryValue(stringValue(body.updatedBy)),
          ),
        })
        return
      }

      const phraseMatch = pathname.match(/^\/api\/common-phrases\/([^/]+)$/)

      if (phraseMatch) {
        const phraseId = decodeURIComponent(phraseMatch[1])

        if (request.method === 'PATCH') {
          sendJson(response, 200, {
            data: repository.updatePhrase(
              phraseId,
              phraseWriteInput(await readJson(request)),
            ),
          })
          return
        }

        if (request.method === 'DELETE') {
          repository.deletePhrases([phraseId])
          sendJson(response, 200, { data: null })
          return
        }
      }

      if (request.method === 'POST' && pathname === '/api/common-phrases') {
        sendJson(response, 201, {
          data: repository.createPhrase(phraseWriteInput(await readJson(request))),
        })
        return
      }

      throw new CommonPhraseRepositoryError('API route was not found.', 404, 'NOT_FOUND')
    } catch (error) {
      sendError(response, error)
    }
  })

  return {
    closeDatabase: () => database.close(),
    server,
  }
}
