export type BlacklistChannel = string

export type BlacklistRestrictionPolicy =
  | 'block-access'
  | 'block-transfer-to-agent'

export interface BlacklistEntry {
  channel: BlacklistChannel
  createdAt: string
  createdBy: string
  id: string
  remark: string
  restrictedNumber: string
  restrictionPolicy: BlacklistRestrictionPolicy
  validityDays: number | null
}
