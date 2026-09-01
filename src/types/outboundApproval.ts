export type ExternalOutboundReason =
  | 'financial-risk'
  | 'miss-information'

export const externalOutboundReasonOptions: {
  label: string
  value: ExternalOutboundReason
}[] = [
  { label: 'Miss Information', value: 'miss-information' },
  { label: 'Financial Risk', value: 'financial-risk' },
]

export type ExternalOperationApprovalType =
  | 'outbound-number'
  | 'customer-outbound'

export type ExternalOperationApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'consumed'

export interface ExternalOperationApprovalScope {
  customerId?: string
  outboundReason?: ExternalOutboundReason
  targetNumber: string
  type: ExternalOperationApprovalType
}

export interface ExternalOperationApproval extends ExternalOperationApprovalScope {
  agentEmployeeId: string
  agentName: string
  createdAt: number
  id: string
  reviewNote?: string
  resolvedAt?: number
  status: ExternalOperationApprovalStatus
  updatedAt: number
}

export type ExternalOperationApprovalEventKind =
  | 'approved'
  | 'cancelled'
  | 'consumed'
  | 'created'
  | 'rejected'

export interface ExternalOperationApprovalEvent {
  approval: ExternalOperationApproval
  kind: ExternalOperationApprovalEventKind
}
