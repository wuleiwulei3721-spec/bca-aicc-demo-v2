export type BlacklistChannel = string

export type BlacklistRestrictionPolicy =
  | 'block-access'
  | 'block-transfer-to-agent'

export type BlacklistStatus = 'Active' | 'Disabled'

export interface BlacklistEntry {
  channel: BlacklistChannel
  countryCode?: string
  createdAt: string
  createdBy: string
  id: string
  identifier: string
  phoneNumber?: string
  reason: string
  restrictionPolicy: BlacklistRestrictionPolicy
  status: BlacklistStatus
}
