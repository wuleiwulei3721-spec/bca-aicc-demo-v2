export type BusyReasonStatus = 'Active' | 'Disabled'

export interface BusyReason {
  busyReasonId: string
  busyReasonName: string
  remark: string
  status: BusyReasonStatus
  updatedAt: string
  updatedBy: string
}
