import type { CustomerInformation } from './inbound'

export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash'

export type EmailDirection = 'inbound' | 'outbound'

export type EmailHandlingStatus =
  | 'new'
  | 'read'
  | 'replied'
  | 'ignored'
  | 'draft'
  | 'failed'
  | 'sent'
  | 'transferred'
  | 'trashed'

export type EmailIgnoreReason = 'AD' | 'Spam' | 'Sales Email'

export type EmailComposeMode = 'new' | 'reply' | 'transfer' | 'draft'

export type EmailLanguage = 'EN' | 'ID'

export type EmailStatus = 'open' | 'pending' | 'closed'

export interface EmailCwuRegistration {
  businessTypes: string[]
  category: string[]
  note: string
  product: string[]
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
  attachmentName?: string
  language?: EmailLanguage
  sentAt: number
  customer: CustomerInformation
  hasAttachment?: boolean
  isRead: boolean
  ignoreReason?: EmailIgnoreReason
  emailStatus?: EmailStatus
  repliedAt?: number
  slaStartedAt?: number
  slaStoppedAt?: number
  slaTargetSeconds?: number
  cwu?: EmailCwuRegistration
  transferSourceMessageId?: string
}

export interface EmailTemplate {
  id: string
  name: string
  attachmentName?: string
  subjectPrefix?: string
  bodyHtml: string
  localizedBodyHtml?: Partial<Record<EmailLanguage, string>>
}

export interface EmailComposeDraft {
  attachmentName?: string
  autoSavedAt?: number
  bodyHtml: string
  draftMessageId?: string
  emailStatus?: EmailStatus
  language: EmailLanguage
  mode: EmailComposeMode
  receiver: string
  receiverLocked?: boolean
  sender: string
  sourceMessageId?: string
  subject: string
  templateId?: string
  threadId: string
}
