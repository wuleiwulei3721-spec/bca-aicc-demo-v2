export type AgentStatus =
  | 'Unsigned'
  | 'Ready'
  | 'Not Ready'
  | 'AUX - Ibadah'
  | 'AUX - Makan'

export type CallStatus =
  | 'Idle'
  | 'Incoming'
  | 'Talking'
  | 'Hold'
  | 'Mute'

export interface AgentProfile {
  avatarUrl: string
  role: string
  name: string
  team: string
  status: AgentStatus
}
