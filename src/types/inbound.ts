export type AccessChannel =
  | 'Phone'
  | 'Haloapps Voice'
  | 'Haloapps Video'
  | 'Haloapps'
  | 'WhatsApp'
  | 'Webchat'
  | 'Webchat Voice'

export type VerificationStatus =
  | 'Verified'
  | 'Unverified'
  | 'Verification Failed'

export type JourneyChannel =
  | 'Email'
  | 'X'
  | 'Instagram'
  | 'TikTok'
  | 'WhatsApp'

export type InteractionResult = 'Success' | 'Failed'

export interface CustomerProfile {
  avatarInitials: string
  avatarUrl: string
  name: string
  phoneNumber: string
  email: string
  cisNumber: string
  customerType: string
}

export interface CustomerInformation {
  accessChannel: AccessChannel
  accessDuration: string
  profile: CustomerProfile
  verificationStatus: VerificationStatus
}

export interface LiveChatSession {
  id: string
  channel: Extract<AccessChannel, 'WhatsApp' | 'Haloapps' | 'Webchat'>
  customer: CustomerInformation
  intent: string
  lastMessage: string
  lastMessageTime: string
  priority: 'High' | 'Normal'
  unreadCount: number
}

export interface CallFlowStep {
  id: string
  nodeName: string
  actionTime: string
}

export interface CallTransferRecord {
  id: string
  agentId: string
  transferAgent: string
  agentSkill: string
  serviceDuration: string
  transferTime: string
}

export interface CallFlowDetail {
  ivrDuration: string
  ivrJourney: CallFlowStep[]
  transferHistory: CallTransferRecord[]
}

export interface VerificationQuestion {
  id: string
  question: string
  answer: string
}

export interface InteractionConversationMessage {
  id: string
  sender: 'Customer' | 'Agent'
  message: string
  time: string
}

export interface CustomerJourneyItem {
  id: string
  channel: JourneyChannel
  summary: string
  result: InteractionResult
  date: string
  communicationDetail: string
  summaryNotes: string
  resolutionResult: string
  followUpNotes: string
  conversation: InteractionConversationMessage[]
}

export interface TicketHistoryItem {
  id: string
  ticketType: string
  ticketNumber: string
  createdDate: string
}

export interface NextBestActionItem {
  id: string
  recommendedService: string
  crmLink: string
}

export interface QuickActionItem {
  id: string
  label: string
  crmLink: string
}

export type CrmWorkspaceTabKind =
  | 'ticket'
  | 'next-best-action'
  | 'quick-action'

export interface CrmWorkspaceTab {
  key: string
  title: string
  kind: CrmWorkspaceTabKind
  crmLink: string
  reference?: string
  description?: string
}
