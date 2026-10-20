export type AttachmentChannel = 'email' | 'livechat'

export interface AttachmentCategory {
  id: string
  name: string
  parentId?: string | null
}

export interface AttachmentEntry {
  id: string
  contentId: string
  name: string
  fileName: string
  mimeType: string
  size: number
  categoryId: string
  status: 'Active' | 'Disabled'
  remark: string
  updatedAt: string
  updatedBy: string
}

export interface AttachmentReference {
  attachmentId: string
  contentId: string
  name: string
  fileName: string
  mimeType: string
  size: number
  sources: string[]
}
