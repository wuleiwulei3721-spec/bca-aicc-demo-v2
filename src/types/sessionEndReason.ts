export type ServiceEndedBy = 'Agent' | 'Customer' | 'System'

export type SessionEndMediaType = 'Voice' | 'Video' | 'DM'

export type SessionEndReasonStatus = 'Active' | 'Disabled'

export interface SessionEndReasonEntry {
  id: string
  mediaTypes: SessionEndMediaType[]
  reasonName: string
  remark: string
  status: SessionEndReasonStatus
  updatedAt: string
  updatedBy: string
}
