export type QuickActionStatus = 'Active' | 'Disabled'

export interface QuickActionEntry {
  actionName: string
  id: string
  linkAddress: string
  remark: string
  sortOrder: number
  status: QuickActionStatus
  updatedAt: string
  updatedBy: string
}

export type QuickActionReorderDirection = 'top' | 'up' | 'down' | 'bottom'
