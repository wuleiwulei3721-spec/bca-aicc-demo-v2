import type { CustomerInformation } from './inbound'

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash'

export type EmailDirection = 'inbound' | 'outbound'

export type EmailHandlingStatus =
  | 'new'
  | 'read'
  | 'replied'
  | 'ignored'
  | 'draft'
  | 'sent'
  | 'trashed'

export type EmailIgnoreReason = 'AD' | 'Spam' | 'Sales Email'

export interface EmailCwuRegistration {
  businessTypes: string[]
  summary: string
  registeredAt: number
}

export interface EmailMessage {
  id: string
  threadId: string
  folder: EmailFolder
  originalFolder?: Exclude<EmailFolder, 'trash'>
  direction: EmailDirection
  handlingStatus: EmailHandlingStatus
  sender: string
  receiver: string
  subject: string
  preview: string
  bodyHtml: string
  sentAt: number
  customer: CustomerInformation
  hasAttachment?: boolean
  isRead: boolean
  ignoreReason?: EmailIgnoreReason
  repliedAt?: number
  slaStartedAt?: number
  slaStoppedAt?: number
  slaTargetSeconds?: number
  cwu?: EmailCwuRegistration
}

export interface EmailTemplate {
  id: string
  name: string
  subjectPrefix?: string
  bodyHtml: string
}

export interface EmailComposeDraft {
  bodyHtml: string
  draftMessageId?: string
  mode: 'new' | 'reply' | 'forward' | 'draft'
  receiver: string
  sender: string
  sourceMessageId?: string
  subject: string
  templateId?: string
  threadId: string
}

