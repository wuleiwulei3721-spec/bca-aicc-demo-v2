export type BusyReasonStatus = 'Active' | 'Disabled'
export type BusyReasonProductivityType = 'Productive' | 'Non-Productive'

export interface BusyReason {
  busyReasonId: string
  busyReasonName: string
  productivityType: BusyReasonProductivityType
  remark: string
  status: BusyReasonStatus
  updatedAt: string
  updatedBy: string
}
