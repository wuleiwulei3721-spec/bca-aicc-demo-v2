export interface InternalChatMessage {
  id: string
  sender: 'self' | 'agent'
  content: string
  time: string
}

export interface InternalChatSession {
  id: string
  agentName: string
  employeeId: string
  department: string
  latestMessage: string
  latestMessageTime: string
  latestMessageTimestamp: number
  unreadCount: number
  messages: InternalChatMessage[]
}
