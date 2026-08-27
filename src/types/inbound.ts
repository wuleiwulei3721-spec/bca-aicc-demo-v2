export type AccessChannel =
  | 'Phone'
  | 'Video'
  | 'Email'
  | 'BankApp'
  | 'BankApp Voice'
  | 'BankApp Video'
  | 'WhatsApp'
  | 'Webchat'
  | 'Webchat Voice'

export type VerificationStatus =
  | 'Verified'
  | 'Verifying'
  | 'Unverified'
  | 'Verification Failed'

export type CustomerEmailVerificationStatus = 'Verified' | 'Unverified'

export type CustomerContactChannel =
  | 'Phone'
  | 'WhatsApp'
  | 'BankApp'
  | 'Email'
  | 'Facebook'
  | 'Instagram'
  | 'X'
  | 'TikTok'
  | 'YouTube'
  | 'LinkedIn'
  | 'App Store'
  | 'Play Store'

export type CustomerCrmContacts = Partial<
  Record<CustomerContactChannel, string[]>
>

export type JourneyChannel =
  | 'Phone'
  | 'BankApp'
  | 'Webchat'
  | 'Email'
  | 'Facebook'
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
  emailVerificationStatus?: CustomerEmailVerificationStatus
  cisNumber: string
  customerType: string
  segmentation?: string
  crmContacts?: CustomerCrmContacts
}

export interface CustomerInformation {
  accessChannel: AccessChannel
  accessDuration: string
  bankAppLoginStatus?: 'guest' | 'registered'
  profile: CustomerProfile
  verificationStatus: VerificationStatus
}

export interface CustomerIdentityRefreshResult {
  customer: CustomerInformation
  journey: CustomerJourneyItem[]
  tickets: TicketHistoryItem[]
}

export interface LiveChatConversationMessage {
  id: string
  sender: 'customer' | 'agent'
  senderName: string
  senderRole: string
  message: string
  time: string
  isCurrentAgent?: boolean
}

export interface LiveChatSession {
  id: string
  channel: Extract<AccessChannel, 'WhatsApp' | 'BankApp' | 'Webchat'>
  customer: CustomerInformation
  conversation: LiveChatConversationMessage[]
  intent: string
  lastMessage: string
  lastMessageTime: string
  priority: 'High' | 'Normal'
  unreadCount: number
}

export type LiveChat2SortMode = 'access-time' | 'message-time'

export type LiveChat2StarColor = 'gray' | 'red' | 'blue' | 'yellow'

export type LiveChat2SessionStatus = 'active' | 'ended'

export type LiveChat2EndReason = 'agent' | 'customer' | 'timeout'

export type LiveChat2MessageSender = 'agent' | 'bot' | 'customer' | 'system'

export type LiveChat2MessageKind = 'file' | 'image' | 'system' | 'text'

export interface LiveChat2TransferSource {
  agentName: string
  employeeId: string
  team: string
  transferredAt: string
}

export interface LiveChat2Message {
  id: string
  kind: LiveChat2MessageKind
  message: string
  sender: LiveChat2MessageSender
  senderName: string
  time: string
  timestamp: string
  fileName?: string
  isCurrentAgent?: boolean
  quotedMessage?: string
}

export interface LiveChat2Session {
  id: string
  accessSequence: number
  bankAppLoginStatus?: 'guest' | 'registered'
  channel: Extract<AccessChannel, 'WhatsApp' | 'BankApp' | 'Webchat'>
  customer: CustomerInformation
  historyMessages: LiveChat2Message[]
  initialStarColor: LiveChat2StarColor
  initialUnansweredSeconds: number | null
  intent: string
  lastMenuName?: string
  endReason?: LiveChat2EndReason
  isInitialHistory?: boolean
  lastMessage: string
  lastMessageAt: string
  lastMessageTime: string
  messages: LiveChat2Message[]
  queueName: string
  serviceStartedAt: string
  status: LiveChat2SessionStatus
  transferSource?: LiveChat2TransferSource
  unreadCount: number
}

export type LiveChat2SessionInstances = Record<string, LiveChat2Session>

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

export type VerificationChannelType =
  | 'phone'
  | 'bankapp-registered'
  | 'bankapp-unregistered'
  | 'whatsapp'
  | 'webchat'
  | 'video'

export type VerificationBusinessType =
  | 'perbankan'
  | 'kartu-kredit'
  | 'paylater'

export type VerificationQuestionGroup =
  | 'mandatory'
  | 'dynamic'
  | 'static'
  | 'alternative'
  | 'layering'
  | 'special'

export type VerificationRuleStatus = 'enabled' | 'disabled'

export interface VerificationBusinessTypeOption {
  code: VerificationBusinessType
  enabled: boolean
  label: string
}

export interface VerificationQuestion {
  answerSource?: string
  group: VerificationQuestionGroup
  id: string
  question: string
  answer: string
  notes?: string
  sequence: number
}

export interface VerificationRule {
  businessType: VerificationBusinessType
  channelType: VerificationChannelType
  correctRequired: number
  id: string
  maxWrongAttempts: number | null
  needLayering: boolean
  notes: string[]
  questions: VerificationQuestion[]
  requiredGroups: Partial<Record<VerificationQuestionGroup, number>>
  status: VerificationRuleStatus
  summary: string
}

export interface InteractionConversationMessage {
  id: string
  sender: 'Customer' | 'Agent'
  message: string
  time: string
}

export interface CustomerJourneyItem {
  callRecordId?: string
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
  caseCategory: string
  id: string
  product: string
  ticketNumber: string
  createdDate: string
}

export interface NextBestActionItem {
  id: string
  recommendedService: string
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
