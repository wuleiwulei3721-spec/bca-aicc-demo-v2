export type AgentStatus =
  | 'Unsigned'
  | 'Ready'
  | 'Not Ready'
  | `AUX - ${string}`
  | `Pre-AUX - ${string}`

export type CallStatus =
  | 'Idle'
  | 'Incoming'
  | 'Talking'
  | 'Hold'

export interface AgentProfile {
  avatarUrl: string
  role: string
  name: string
  team: string
  status: AgentStatus
}
