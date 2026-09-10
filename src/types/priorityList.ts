export type PriorityListMatchRule = 'exact_match' | 'partial_match'

export interface PriorityListEntry {
  channel: string
  countryCode?: string
  createdAt: string
  createdBy: string
  id: string
  identifier: string
  matchRule: PriorityListMatchRule
  reason: string
}
