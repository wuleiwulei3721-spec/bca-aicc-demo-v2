export type SocialMediaInteractionChannel =
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn'
  | 'TikTok'
  | 'Twitter'
  | 'YouTube'

export type SocialMediaMessageType =
  | 'Chat'
  | 'Comment'
  | 'Mention'
  | 'Review'

export type SocialMediaConversationRole = 'Agent' | 'Customer'

export interface SocialMediaConversationMessage {
  content: string
  id: string
  messageTime: string
  originalContentUrl?: string
  role: SocialMediaConversationRole
  sender: string
}

export interface SocialMediaInteractionLogRecord {
  agentName: string
  alert: boolean
  alertReason?: string
  alertTitle?: string
  bcaAccount: string
  channel: SocialMediaInteractionChannel
  conversation: SocialMediaConversationMessage[]
  customerAccount: string
  customerContactTime: string
  distributeToAgentTime: string
  firstResponseTime: string
  id: string
  messageType: SocialMediaMessageType
  qmScore: number | null
  responseDurationSeconds: number
  status: 'Closed' | 'In Progress'
  summary: string
  team: string
  ticketTypes: string[]
}

export interface SocialMediaInteractionAgentOption {
  name: string
  role: string
  team: string
}
