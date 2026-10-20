import type { AttachmentChannel, AttachmentEntry, AttachmentReference } from '../types/attachment.ts'

export const ATTACHMENT_MAX_BYTES = 20_000_000
export const EMAIL_MAX_BYTES = 10_000_000
export type AttachmentKind = 'image' | 'video' | 'pdf'
type FileMetadata = { name: string; type: string; size: number }
type ReferenceMetadata = Pick<AttachmentReference, 'fileName' | 'mimeType' | 'size'>
const extensionTypes: Record<string, string> = {
  pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  gif: 'image/gif', bmp: 'image/bmp', webp: 'image/webp', svg: 'image/svg+xml',
  avif: 'image/avif', ico: 'image/x-icon', tif: 'image/tiff', tiff: 'image/tiff',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', ogv: 'video/ogg',
  avi: 'video/x-msvideo', m4v: 'video/x-m4v', mpeg: 'video/mpeg', mpg: 'video/mpeg',
}
const emailExtensions = new Set(['pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp'])
const rejectedExtensions = new Set(['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'zip', 'rar', '7z', 'tar', 'gz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'xml'])
const extension = (name: string) => name.split('.').length > 1 ? name.split('.').pop()!.toLowerCase() : ''
const normalizeMime = (mime: string) => mime.split(';')[0].trim().toLowerCase()

export function inferAttachmentMime(file: Pick<FileMetadata, 'name' | 'type'>): string {
  const mime = normalizeMime(file.type)
  return mime && mime !== 'application/octet-stream' ? mime : extensionTypes[extension(file.name)] ?? ''
}

export function getAttachmentKind(value: { mimeType: string }): AttachmentKind | undefined {
  const mime = normalizeMime(value.mimeType)
  if (mime === 'application/pdf') return 'pdf'
  if (/^image\/[^\s/]+$/.test(mime)) return 'image'
  if (/^video\/[^\s/]+$/.test(mime)) return 'video'
  return undefined
}

export function validateLibraryFile(file: FileMetadata): string[] {
  const errors: string[] = []
  if (!Number.isSafeInteger(file.size) || file.size <= 0) errors.push('Choose a nonempty file.')
  if (file.size > ATTACHMENT_MAX_BYTES) errors.push('Files must be 20 MB or smaller.')
  if (!file.name.trim() || rejectedExtensions.has(extension(file.name)) || !getAttachmentKind({ mimeType: inferAttachmentMime(file) })) {
    errors.push('Only images, videos and PDF files are supported.')
  }
  return errors
}

export function isAttachmentAllowedForChannel(ref: ReferenceMetadata, channel: AttachmentChannel): boolean {
  const mime = normalizeMime(ref.mimeType)
  const ext = extension(ref.fileName)
  if (rejectedExtensions.has(ext) || !getAttachmentKind(ref)) return false
  if (channel === 'livechat') return true
  return emailExtensions.has(ext) && extensionTypes[ext] === mime
}

export function validateChannelAttachments(refs: readonly AttachmentReference[], channel: AttachmentChannel): string[] {
  const errors: string[] = []
  if (channel === 'livechat' && refs.length > 1) errors.push('LiveChat supports one attachment at a time.')
  for (const ref of refs) {
    if (!isAttachmentAllowedForChannel(ref, channel)) errors.push(`${ref.name}: file type is unavailable for this channel.`)
    if (!Number.isSafeInteger(ref.size) || ref.size <= 0 || ref.size > ATTACHMENT_MAX_BYTES) errors.push(`${ref.name}: file must be nonempty and 20 MB or smaller.`)
  }
  return errors
}

export function validateCurrentReference(ref: AttachmentReference, entries: readonly AttachmentEntry[]): string[] {
  const entry = entries.find((item) => item.id === ref.attachmentId)
  if (!entry) return [`${ref.name}: attachment was removed from the library.`]
  const errors: string[] = []
  if (entry.status !== 'Active') errors.push(`${ref.name}: attachment is disabled.`)
  if (entry.contentId !== ref.contentId) errors.push(`${ref.name}: file was replaced; select it again.`)
  return errors
}

export function validateAttachmentReferences(refs: readonly AttachmentReference[], entries: readonly AttachmentEntry[], channel: AttachmentChannel): string[] {
  return [...validateChannelAttachments(refs, channel), ...refs.flatMap((ref) => validateCurrentReference(ref, entries))]
}

export function formatAttachmentSize(size: number): string {
  if (size < 1_000) return `${size} B`
  if (size < 1_000_000) return `${(size / 1_000).toFixed(2)} KB`
  return `${(size / 1_000_000).toFixed(2)} MB`
}

export function createReference(entry: AttachmentEntry, source = 'manual'): AttachmentReference {
  return { attachmentId: entry.id, contentId: entry.contentId, name: entry.name, fileName: entry.fileName, mimeType: entry.mimeType, size: entry.size, sources: [source] }
}

export function mergeAttachmentReferences(current: readonly AttachmentReference[], incoming: readonly AttachmentReference[]): AttachmentReference[] {
  const merged = new Map<string, AttachmentReference>()
  for (const ref of [...current, ...incoming]) {
    const previous = merged.get(ref.attachmentId)
    merged.set(ref.attachmentId, { ...(previous ?? ref), sources: [...new Set([...(previous?.sources ?? []), ...ref.sources])] })
  }
  return [...merged.values()]
}

export function mergeTemplateAttachmentReferences(current: readonly AttachmentReference[], templateId: string, incoming: readonly AttachmentReference[]): AttachmentReference[] {
  const retained = current.map((ref) => ({ ...ref, sources: ref.sources.filter((source) => !source.startsWith('template:')) })).filter((ref) => ref.sources.length > 0)
  return mergeAttachmentReferences(retained, incoming.map((ref) => ({ ...ref, sources: [`template:${templateId}`] })))
}

export interface EmailSizeFields { sender: string; receiver: string; subject: string; bodyHtml: string }
// Deterministic mock MIME serialization: UTF-8 headers, base64 parts, CRLF endings.
// Each nonempty base64 part has lines of up to 76 characters, each ending in CRLF.
export function estimateEmailSize(fields: EmailSizeFields, attachments: readonly AttachmentReference[]): number {
  const bytes = (text: string) => new TextEncoder().encode(text).length
  const header = (text: string) => text.replace(/[\r\n]/g, ' ')
  const quoted = (text: string) => header(text).replace(/["\\]/g, '\\$&')
  const encodedLength = (size: number) => {
    const characters = 4 * Math.ceil(size / 3)
    return characters + 2 * Math.ceil(characters / 76)
  }
  const boundary = 'BANK1_ATTACHMENT_MIME_BOUNDARY'
  let total = bytes(`From: ${header(fields.sender)}\r\nTo: ${header(fields.receiver)}\r\nSubject: ${header(fields.subject)}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`)
  total += bytes(`--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n`) + encodedLength(bytes(fields.bodyHtml))
  for (const ref of attachments) {
    total += bytes(`--${boundary}\r\nContent-Type: ${header(ref.mimeType)}; name="${quoted(ref.fileName)}"\r\nContent-Disposition: attachment; filename="${quoted(ref.fileName)}"\r\nContent-Transfer-Encoding: base64\r\n\r\n`) + encodedLength(ref.size)
  }
  return total + bytes(`--${boundary}--\r\n`)
}
