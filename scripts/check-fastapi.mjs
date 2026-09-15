const apiBaseUrl = process.env.AICC_API_URL ?? 'http://127.0.0.1:8000'
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
  const payload = await response.json().catch(() => null)
  assertCondition(response.ok, `${route} returned HTTP ${response.status}`)
  return payload
}

try {
  const health = await getJson('/api/health')
  assertCondition(health?.status === 'ok', 'FastAPI health status is not ok')
  assertCondition(
    health?.backend === 'fastapi',
    'The configured API is not the FastAPI backend',
  )
  assertCondition(
    health?.database === 'aicc_demo_local',
    'FastAPI is not connected to aicc_demo_local',
  )

  const all = await getJson('/api/common-phrases')
  assertCondition(Array.isArray(all?.categories), 'API categories payload is invalid')
  assertCondition(Array.isArray(all?.entries), 'API entries payload is invalid')
  assertCondition(
    all.entries.every((entry) =>
      ['phraseId', 'shortcutCode', 'phraseText', 'remark', 'sortOrder', 'status',
        'createdAt', 'createdBy', 'updatedAt', 'updatedBy'].every(
        (field) => field in entry,
      ),
    ),
    'Common Phrase response is missing Demo model fields',
  )

  const active = await getJson('/api/common-phrases?status=Active')
  assertCondition(
    active.entries.every((entry) => entry.status === 'Active'),
    'Active filter returned a non-active phrase',
  )

  const commonNumbers = await getJson('/api/common-numbers')
  assertCondition(
    Array.isArray(commonNumbers?.entries),
    'Common Number entries payload is invalid',
  )
  assertCondition(
    commonNumbers.entries.every((entry) =>
      ['id', 'name', 'number', 'status', 'remark', 'updatedAt', 'updatedBy'].every(
        (field) => field in entry,
      ),
    ),
    'Common Number response is missing Demo model fields',
  )
  const activeCommonNumbers = await getJson('/api/common-numbers?status=Active')
  assertCondition(
    activeCommonNumbers.entries.every((entry) => entry.status === 'Active'),
    'Common Number Active filter returned a non-active entry',
  )

  const commonLinks = await getJson('/api/common-links')
  assertCondition(
    Array.isArray(commonLinks?.entries),
    'Common Link entries payload is invalid',
  )
  assertCondition(
    commonLinks.entries.every((entry) =>
      ['id', 'websiteName', 'websiteUrl', 'remark', 'updatedAt', 'updatedBy'].every(
        (field) => field in entry,
      ),
    ),
    'Common Link response is missing Demo model fields',
  )
  const commonLinkByName = await getJson('/api/common-links?websiteName=BANK%201')
  assertCondition(
    commonLinkByName.entries.every((entry) =>
      entry.websiteName.toLowerCase().includes('bank 1'),
    ),
    'Common Link Website Name filter returned a non-matching entry',
  )

  const elapsed = Math.round(performance.now() - startedAt)
  console.log(`FastAPI check passed in ${elapsed}ms`)
  console.log(`API: ${apiBaseUrl} | Categories: ${all.categories.length} | Phrases: ${all.entries.length}`)
  console.log(`Common Numbers: ${commonNumbers.entries.length} | Active: ${activeCommonNumbers.entries.length}`)
  console.log(`Common Links: ${commonLinks.entries.length}`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`FastAPI check failed: ${message}`)
  console.error('Start the FastAPI stack with: python backend/run.py')
  process.exitCode = 1
}
