export type BusyReasonStatus = 'Active' | 'Disabled'

export interface BusyReason {
  busyReasonId: string
  busyReasonName: string
  isDefault: boolean
  remark: string
  status: BusyReasonStatus
  updatedAt: string
  updatedBy: string
}
