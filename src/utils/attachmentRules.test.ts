/// <reference types="node" />
import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ATTACHMENT_MAX_BYTES, EMAIL_MAX_BYTES, createReference, estimateEmailSize,
  isAttachmentAllowedForChannel, mergeAttachmentReferences, mergeTemplateAttachmentReferences,
  validateAttachmentReferences, validateChannelAttachments, validateCurrentReference, validateLibraryFile,
} from './attachmentRules.ts'
import type { EmailSizeFields } from './attachmentRules.ts'
import type { AttachmentEntry, AttachmentReference } from '../types/attachment.ts'
import { getAttachmentContent, getAttachmentUrl, useAttachmentStore } from '../store/attachmentStore.ts'

const reference = (overrides: Partial<AttachmentReference> = {}): AttachmentReference => ({
  attachmentId: 'test-attachment', contentId: 'test-content', name: 'BANK 1 Guide',
  fileName: 'guide.pdf', mimeType: 'application/pdf', size: 100, sources: ['manual'], ...overrides,
})
const fields: EmailSizeFields = {
  sender: 'support@bank1.example', receiver: 'customer@example.com', subject: 'BANK 1 Guide', bodyHtml: '<p>Hello</p>',
}

// Build the documented mock message from actual bytes, including actual base64
// conversion and line wrapping. Do not reuse the estimator's length arithmetic.
function mockMime(input: EmailSizeFields, refs: readonly AttachmentReference[]): Buffer {
  const clean = (value: string) => value.replace(/[\r\n]/g, ' ')
  const quote = (value: string) => clean(value).replace(/["\\]/g, '\\$&')
  const base64 = (value: Buffer) => {
    const encoded = value.toString('base64')
    return encoded.match(/.{1,76}/g)?.map((line) => line + '\r\n').join('') ?? ''
  }
  const boundary = 'BANK1_ATTACHMENT_MIME_BOUNDARY'
  const lines = [
    `From: ${clean(input.sender)}`,
    `To: ${clean(input.receiver)}`,
    `Subject: ${clean(input.subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`, '',
    `--${boundary}`, 'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64', '',
  ]
  let message = lines.join('\r\n') + '\r\n' + base64(Buffer.from(input.bodyHtml, 'utf8'))
  for (const ref of refs) {
    message += [
      `--${boundary}`,
      `Content-Type: ${clean(ref.mimeType)}; name="${quote(ref.fileName)}"`,
      `Content-Disposition: attachment; filename="${quote(ref.fileName)}"`,
      'Content-Transfer-Encoding: base64', '', '',
    ].join('\r\n')
    message += base64(Buffer.alloc(ref.size, 0x61))
  }
  message += `--${boundary}--\r\n`
  return Buffer.from(message, 'utf8')
}

describe('channel and library rules', () => {
  it('uses the exact email whitelist, including uppercase extensions', () => {
    for (const [fileName, mimeType] of [
      ['guide.pdf', 'application/pdf'], ['image.png', 'image/png'], ['image.JPG', 'image/jpeg'],
      ['image.jpeg', 'image/jpeg'], ['image.gif', 'image/gif'], ['image.bmp', 'image/bmp'],
    ]) assert.equal(isAttachmentAllowedForChannel(reference({ fileName, mimeType }), 'email'), true, fileName)
    for (const [fileName, mimeType] of [
      ['image.webp', 'image/webp'], ['clip.mp4', 'video/mp4'], ['document.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      ['archive.zip', 'application/zip'], ['sound.mp3', 'audio/mpeg'], ['data.xml', 'application/xml'],
      ['image.svg', 'image/svg+xml'], ['image.avif', 'image/avif'], ['image.tiff', 'image/tiff'],
      ['image.JPG', 'image/png'],
    ]) assert.equal(isAttachmentAllowedForChannel(reference({ fileName, mimeType }), 'email'), false, fileName)
  })

  it('supports WebP, video and PDF in LiveChat and rejects unsupported formats', () => {
    for (const [fileName, mimeType] of [['image.webp', 'image/webp'], ['clip.mp4', 'video/mp4'], ['guide.pdf', 'application/pdf']]) {
      assert.deepEqual(validateChannelAttachments([reference({ fileName, mimeType })], 'livechat'), [])
    }
    for (const [fileName, mimeType] of [['sound.mp3', 'audio/mpeg'], ['archive.zip', 'application/zip'], ['document.doc', 'application/msword'], ['data.xml', 'application/xml']]) {
      assert.ok(validateChannelAttachments([reference({ fileName, mimeType })], 'livechat').length > 0, fileName)
    }
    assert.ok(validateChannelAttachments([reference(), reference({ attachmentId: 'second' })], 'livechat').some((error) => error.includes('one attachment')))
  })

  it('enforces the original-file decimal 20 MB boundary and rejects empty files', () => {
    assert.equal(ATTACHMENT_MAX_BYTES, 20_000_000)
    const file = { name: 'guide.pdf', type: 'application/pdf', size: 20_000_000 }
    assert.deepEqual(validateLibraryFile(file), [])
    assert.ok(validateLibraryFile({ ...file, size: 20_000_001 }).length > 0)
    assert.ok(validateLibraryFile({ ...file, size: 0 }).length > 0)
    assert.deepEqual(validateChannelAttachments([reference({ size: 20_000_000 })], 'email'), [])
    assert.ok(validateChannelAttachments([reference({ size: 20_000_001 })], 'email').length > 0)
    assert.ok(validateChannelAttachments([reference({ size: 0 })], 'email').length > 0)
  })

  it('does not impose an email attachment count or aggregate selection-size limit', () => {
    const refs = Array.from({ length: 7 }, (_, index) => reference({ attachmentId: `guide-${index}`, size: 2_000_000 }))
    assert.ok(refs.length > 5)
    assert.ok(refs.reduce((total, ref) => total + ref.size, 0) > EMAIL_MAX_BYTES)
    assert.deepEqual(validateChannelAttachments(refs, 'email'), [])
    assert.ok(estimateEmailSize(fields, refs) > EMAIL_MAX_BYTES)
  })
})

describe('mock MIME size', () => {
  it('matches independently serialized ASCII and Unicode messages with base64 attachment overhead', () => {
    const unicode = { sender: 'BANK 1 <support@bank1.example>', receiver: 'customer@example.com', subject: 'Guide — 銀行\r\nUpdate', bodyHtml: '<p>Hello 世界 👋</p>' }
    for (const input of [fields, unicode, { ...fields, bodyHtml: '' }]) {
      for (const size of [0, 1, 2, 3, 57, 58, 114, 115]) {
        const refs = [reference({ size, fileName: 'BANK 1 "guide"\\資料.pdf' })]
        assert.equal(estimateEmailSize(input, refs), mockMime(input, refs).byteLength)
      }
      assert.equal(estimateEmailSize(input, []), mockMime(input, []).byteLength)
    }
    const ref = reference({ size: 1_000 })
    const overhead = estimateEmailSize(fields, [ref]) - estimateEmailSize(fields, [])
    assert.ok(overhead > ref.size)
    assert.ok(estimateEmailSize({ ...fields, bodyHtml: '世界' }, []) > estimateEmailSize({ ...fields, bodyHtml: 'ab' }, []))
  })

  it('finds the largest attachment fitting the 10 MB message limit and verifies the next-byte jump', () => {
    assert.equal(EMAIL_MAX_BYTES, 10_000_000)
    let low = 0
    let high = ATTACHMENT_MAX_BYTES
    while (low < high) {
      const middle = Math.ceil((low + high) / 2)
      if (estimateEmailSize(fields, [reference({ size: middle })]) <= EMAIL_MAX_BYTES) low = middle
      else high = middle - 1
    }
    const fitting = reference({ size: low })
    const oversized = reference({ size: low + 1 })
    const fittingBytes = mockMime(fields, [fitting]).byteLength
    const oversizedBytes = mockMime(fields, [oversized]).byteLength
    assert.equal(estimateEmailSize(fields, [fitting]), fittingBytes)
    assert.equal(estimateEmailSize(fields, [oversized]), oversizedBytes)
    assert.ok(fittingBytes <= EMAIL_MAX_BYTES)
    assert.ok(oversizedBytes > EMAIL_MAX_BYTES)
    assert.ok(oversizedBytes > fittingBytes)
    assert.deepEqual(validateLibraryFile({ name: 'guide.pdf', type: 'application/pdf', size: 20_000_000 }), [])
    assert.ok(estimateEmailSize(fields, [reference({ size: 20_000_000 })]) > EMAIL_MAX_BYTES)
  })
})

describe('reference ownership', () => {
  it('deduplicates attachments and sources without mutating the inputs', () => {
    const first = reference()
    const shared = reference({ sources: ['template:a', 'manual'] })
    const second = reference({ attachmentId: 'second', sources: ['template:a'] })
    const current = [first]
    const incoming = [shared, second]
    const before = structuredClone({ current, incoming })
    const merged = mergeAttachmentReferences(current, incoming)
    assert.equal(merged.length, 2)
    assert.deepEqual(merged[0].sources, ['manual', 'template:a'])
    assert.deepEqual(merged[1], second)
    assert.deepEqual({ current, incoming }, before)
  })

  it('replaces template ownership while preserving manual and other shared sources', () => {
    const current = [
      reference({ sources: ['manual', 'template:old', 'shared:service'] }),
      reference({ attachmentId: 'template-only', sources: ['template:old'] }),
      reference({ attachmentId: 'shared-only', sources: ['shared:team', 'template:old'] }),
    ]
    const incoming = [reference(), reference({ attachmentId: 'new-guide' })]
    const before = structuredClone({ current, incoming })
    const merged = mergeTemplateAttachmentReferences(current, 'new', incoming)
    assert.equal(merged.length, 3)
    assert.deepEqual(merged.find((ref) => ref.attachmentId === 'test-attachment')?.sources, ['manual', 'shared:service', 'template:new'])
    assert.deepEqual(merged.find((ref) => ref.attachmentId === 'shared-only')?.sources, ['shared:team'])
    assert.deepEqual(merged.find((ref) => ref.attachmentId === 'new-guide')?.sources, ['template:new'])
    assert.equal(merged.some((ref) => ref.attachmentId === 'template-only'), false)
    assert.deepEqual({ current, incoming }, before)
  })
})

describe('memory attachment store', { concurrency: false }, () => {
  let snapshot: Pick<ReturnType<typeof useAttachmentStore.getState>, 'entries' | 'categories'>
  const state = () => useAttachmentStore.getState()
  const file = (text = 'BANK 1 original bytes') => new File([text], 'bank1-guide.pdf', { type: 'application/pdf' })
  const add = (categoryId: string, name = 'BANK 1 Test Guide') => state().addEntry({ name, categoryId, file: file() })
  const update = (entry: AttachmentEntry, changes: Partial<Parameters<ReturnType<typeof useAttachmentStore.getState>['updateEntry']>[1]>) => state().updateEntry(entry.id, { name: entry.name, categoryId: entry.categoryId, remark: entry.remark, status: entry.status, ...changes })

  beforeEach(() => {
    snapshot = structuredClone({ entries: state().entries, categories: state().categories })
  })
  afterEach(() => {
    useAttachmentStore.setState(snapshot)
    assert.deepEqual({ entries: state().entries, categories: state().categories }, snapshot)
  })

  it('derives names from filenames, ignores compatibility aliases, and preserves content on metadata edits', () => {
    const category = state().addCategory('Test metadata category')
    const entry = add(category.id)
    const duplicate = add(category.id, entry.name)
    assert.notEqual(entry.id, duplicate.id)
    assert.equal(entry.name, 'bank1-guide.pdf')
    assert.equal(duplicate.name, duplicate.fileName)
    assert.equal(entry.remark, '')
    const pending = createReference(entry)
    const changed = update(entry, { name: 'Updated display name', remark: 'Updated remark' })
    assert.equal(changed.id, entry.id)
    assert.equal(changed.contentId, entry.contentId)
    assert.equal(changed.fileName, entry.fileName)
    assert.equal(changed.name, entry.fileName)
    assert.equal(changed.remark, 'Updated remark')
    assert.equal(pending.name, entry.fileName)
    assert.deepEqual(validateAttachmentReferences([pending], state().entries, 'email'), [])
  })

  it('invalidates pending references after disabling, replacement and deletion', () => {
    const category = state().addCategory('Test pending category')
    const entry = add(category.id)
    const pending = createReference(entry)
    assert.deepEqual(validateCurrentReference(pending, state().entries), [])
    const disabled = update(entry, { status: 'Disabled' })
    assert.ok(validateCurrentReference(pending, state().entries).some((error) => error.includes('disabled')))
    const active = update(disabled, { status: 'Active' })
    assert.deepEqual(validateCurrentReference(pending, state().entries), [])
    const replaced = update(active, { name: 'Ignored replacement alias', file: new File(['BANK 1 replacement bytes'], 'bank1-replacement.pdf', { type: 'application/pdf' }) })
    assert.equal(replaced.id, entry.id)
    assert.equal(replaced.name, 'bank1-replacement.pdf')
    assert.equal(replaced.fileName, 'bank1-replacement.pdf')
    assert.equal(pending.name, 'bank1-guide.pdf')
    assert.equal(pending.fileName, 'bank1-guide.pdf')
    assert.notEqual(replaced.contentId, pending.contentId)
    assert.ok(validateCurrentReference(pending, state().entries).some((error) => error.includes('replaced')))
    state().removeEntry(replaced.id)
    assert.ok(validateCurrentReference(pending, state().entries).some((error) => error.includes('removed')))
  })

  it('keeps sent Blob bytes and URLs available after replacement and deletion', async () => {
    const category = state().addCategory('Test sent category')
    const entry = add(category.id)
    const sent = createReference(entry)
    const original = getAttachmentContent(sent.contentId)
    assert.ok(original)
    const originalBytes = await original.arrayBuffer()
    const originalUrl = getAttachmentUrl(sent.contentId)
    assert.ok(originalUrl?.startsWith('blob:'))
    assert.equal(getAttachmentUrl(sent.contentId), originalUrl)
    const replacement = update(entry, { file: file('different replacement content') })
    const replacementContent = getAttachmentContent(replacement.contentId)
    assert.ok(replacementContent)
    assert.notDeepEqual(await replacementContent.arrayBuffer(), originalBytes)
    assert.equal(getAttachmentContent(sent.contentId), original)
    assert.deepEqual(await getAttachmentContent(sent.contentId)!.arrayBuffer(), originalBytes)
    assert.equal(getAttachmentUrl(sent.contentId), originalUrl)
    state().removeEntry(replacement.id)
    assert.deepEqual(await getAttachmentContent(sent.contentId)!.arrayBuffer(), originalBytes)
    assert.equal(getAttachmentUrl(sent.contentId), originalUrl)
    assert.equal(getAttachmentContent('missing-test-content'), undefined)
    assert.equal(getAttachmentUrl('missing-test-content'), undefined)
  })

  it('supports category CRUD, normalized uniqueness, and blocks deletion while in use', () => {
    const category = state().addCategory('  Test Category  ')
    assert.equal(category.name, 'Test Category')
    assert.throws(() => state().addCategory(' test CATEGORY '), /already exists/)
    const other = state().addCategory('Test Other Category')
    assert.throws(() => state().updateCategory(other.id, ' TEST category '), /already exists/)
    state().updateCategory(category.id, '  TEST Category  ')
    assert.equal(state().categories.find((item) => item.id === category.id)?.name, 'TEST Category')
    const entry = add(category.id)
    assert.throws(() => state().removeCategory(category.id), /in use/)
    assert.ok(state().categories.some((item) => item.id === category.id))
    state().updateCategory(category.id, 'Renamed Test Category')
    assert.equal(state().entries.find((item) => item.id === entry.id)?.categoryId, category.id)
    state().removeEntry(entry.id)
    state().removeCategory(category.id)
    state().removeCategory(other.id)
    assert.equal(state().categories.some((item) => item.id === category.id || item.id === other.id), false)
    assert.throws(() => state().addCategory('   '), /required/)
  })
})
