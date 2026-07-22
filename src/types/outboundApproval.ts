export type ExternalOperationApprovalType =
  | 'outbound-number'
  | 'transfer-number'
  | 'customer-outbound'

export type ExternalOperationApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'consumed'

export interface ExternalOperationApprovalScope {
  customerId?: string
  targetNumber: string
  type: ExternalOperationApprovalType
}

export interface ExternalOperationApproval extends ExternalOperationApprovalScope {
  agentAvatarUrl: string
  agentName: string
  createdAt: number
  expiresAt: number
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
  | 'expired'
  | 'rejected'

export interface ExternalOperationApprovalEvent {
  approval: ExternalOperationApproval
  kind: ExternalOperationApprovalEventKind
}
