import { create } from 'zustand'
import type { AttachmentCategory, AttachmentEntry } from '../types/attachment'
import { createReference, inferAttachmentMime, validateLibraryFile } from '../utils/attachmentRules.ts'
import { DEFAULT_AUDIT_ACTOR, formatAuditDateTime } from '../utils/audit.ts'
import { bank1GuideVideo, bank1ServicePng } from './attachmentDemoAssets.ts'
import { getCategoryDepth, getCategoryDescendantIds } from '../utils/categoryTree'

export interface AttachmentInput {
  name?: string
  categoryId: string
  remark?: string
  status?: AttachmentEntry['status']
  updatedBy?: string
  file?: File
}
export interface AttachmentState {
  entries: AttachmentEntry[]
  categories: AttachmentCategory[]
  addEntry: (input: AttachmentInput) => AttachmentEntry
  updateEntry: (id: string, input: AttachmentInput) => AttachmentEntry
  removeEntry: (id: string) => void
  addCategory: (name: string, parentId?: string | null) => AttachmentCategory
  updateCategory: (id: string, name: string) => void
  removeCategory: (id: string) => void
}
const contents = new Map<string, Blob>()
const urls = new Map<string, string>()
let sequence = 0
let attachmentSequence = 100003
const newId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`
const normalized = (value: string) => value.trim().toLowerCase()
function fail(message: string): never { throw new Error(message) }

export function getAttachmentContent(contentId: string): Blob | undefined { return contents.get(contentId) }
export function getAttachmentUrl(contentId: string): string | undefined {
  const content = contents.get(contentId)
  if (!content) return undefined
  let url = urls.get(contentId)
  if (!url) { url = URL.createObjectURL(content); urls.set(contentId, url) }
  return url
}
export function downloadAttachment(contentId: string, fileName: string): boolean {
  const url = getAttachmentUrl(contentId)
  if (!url) return false
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  return true
}
export const getAttachmentReference = createReference

function buildPdf(): Blob {
  const stream = 'BT /F1 18 Tf 50 760 Td (BANK 1 - Dispute Follow-up) Tj 0 -32 Td /F1 11 Tf (Please contact BANK 1 for assistance with your dispute.) Tj ET\n'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = pdf.length
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return new Blob([pdf], { type: 'application/pdf' })
}
const pdf = buildPdf()
const png = bank1ServicePng
const video = bank1GuideVideo
contents.set('content-bank1-dispute-v1', pdf)
contents.set('content-bank1-service-v1', png)
contents.set('content-bank1-video-v1', video)
const initialEntries: AttachmentEntry[] = [
  { id: '100001', contentId: 'content-bank1-video-v1', name: 'BANK 1 Service Guide', fileName: 'bank1-service-guide.mp4', mimeType: video.type, size: video.size, categoryId: 'category-service-guides', status: 'Active', remark: 'BANK 1 demo service guide.', updatedAt: formatAuditDateTime(new Date()), updatedBy: DEFAULT_AUDIT_ACTOR },
  { id: '100002', contentId: 'content-bank1-dispute-v1', name: 'BANK 1 Dispute Follow-up', fileName: 'dispute-follow-up.pdf', mimeType: pdf.type, size: pdf.size, categoryId: 'category-disputes', status: 'Active', remark: 'BANK 1 dispute follow-up information.', updatedAt: formatAuditDateTime(new Date()), updatedBy: DEFAULT_AUDIT_ACTOR },
  { id: '100003', contentId: 'content-bank1-service-v1', name: 'BANK 1 Service Image', fileName: 'service-image.png', mimeType: png.type, size: png.size, categoryId: 'category-service-guides', status: 'Active', remark: 'BANK 1 demo service information.', updatedAt: formatAuditDateTime(new Date()), updatedBy: DEFAULT_AUDIT_ACTOR },
]

export const useAttachmentStore = create<AttachmentState>((set, get) => {
  const categoryName = (name: string, parentId: string | null, id?: string) => {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 100) fail('Category name is required and must be 100 characters or fewer.')
    if (get().categories.some((category) => category.id !== id && (category.parentId ?? null) === parentId && normalized(category.name) === normalized(trimmed))) fail('Category name already exists.')
    return trimmed
  }
  const saveEntry = (input: AttachmentInput, existing?: AttachmentEntry): AttachmentEntry => {
    const name = input.file?.name ?? existing?.fileName ?? ''
    const remark = (input.remark ?? '').trim()
    if (remark.length > 2000) fail('Remark must be 2000 characters or fewer.')
    if (!get().categories.some((category) => category.id === input.categoryId)) fail('Choose an existing category.')
    if (input.status !== undefined && input.status !== 'Active' && input.status !== 'Disabled') fail('Choose a valid status.')
    if (!existing && !input.file) fail('Choose a file.')
    const errors = input.file ? validateLibraryFile(input.file) : []
    if (errors.length) fail(errors.join(' '))
    let contentId = existing?.contentId ?? ''
    if (input.file) {
      contentId = newId('content')
      contents.set(contentId, new Blob([input.file], { type: inferAttachmentMime(input.file) }))
    }
    const entry: AttachmentEntry = {
      id: existing?.id ?? String(++attachmentSequence), contentId, name, remark,
      categoryId: input.categoryId, status: input.status ?? existing?.status ?? 'Active',
      fileName: input.file?.name ?? existing!.fileName,
      mimeType: input.file ? inferAttachmentMime(input.file) : existing!.mimeType,
      size: input.file?.size ?? existing!.size,
      updatedAt: formatAuditDateTime(new Date()), updatedBy: input.updatedBy?.trim() || DEFAULT_AUDIT_ACTOR,
    }
    set({ entries: existing ? get().entries.map((item) => item.id === entry.id ? entry : item) : [...get().entries, entry] })
    return entry
  }
  return {
    entries: initialEntries.map((entry) => ({ ...entry, name: entry.fileName })),
    categories: [
      { id: 'category-service', name: 'Customer Service' },
      { id: 'category-accounts', name: 'Accounts', parentId: 'category-service' },
      { id: 'category-service-guides', name: 'Service Guides', parentId: 'category-accounts' },
      { id: 'category-cards', name: 'Cards', parentId: 'category-service' },
      { id: 'category-disputes', name: 'Disputes', parentId: 'category-cards' },
    ],
    addEntry: (input) => saveEntry(input),
    updateEntry: (id, input) => {
      const existing = get().entries.find((entry) => entry.id === id)
      if (!existing) return fail('Attachment no longer exists.')
      return saveEntry(input, existing)
    },
    removeEntry: (id) => {
      if (!get().entries.some((entry) => entry.id === id)) fail('Attachment no longer exists.')
      set({ entries: get().entries.filter((entry) => entry.id !== id) })
    },
    addCategory: (name, parentId = null) => {
      if (parentId !== null) {
        if (!get().categories.some((category) => category.id === parentId)) fail('Parent category no longer exists.')
        if (getCategoryDepth(get().categories, parentId) >= 5) fail('Categories support a maximum of five levels.')
      }
      const category: AttachmentCategory = { id: newId('category'), name: categoryName(name, parentId), parentId }
      set({ categories: [...get().categories, category] })
      return category
    },
    updateCategory: (id, name) => {
      const existing = get().categories.find((category) => category.id === id)
      if (!existing) return fail('Category no longer exists.')
      const nextName = categoryName(name, existing.parentId ?? null, id)
      set({ categories: get().categories.map((category) => category.id === id ? { ...category, name: nextName } : category) })
    },
    removeCategory: (id) => {
      set((state) => {
        if (!state.categories.some((category) => category.id === id)) fail('Category no longer exists.')
        const subtree = getCategoryDescendantIds(state.categories, id)
        return {
          categories: state.categories.filter((category) => !subtree.has(category.id)),
          entries: state.entries.filter((entry) => !subtree.has(entry.categoryId)),
        }
      })
    },
  }
})
