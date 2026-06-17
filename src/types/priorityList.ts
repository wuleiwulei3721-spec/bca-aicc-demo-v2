export type PriorityListMatchRule = 'exact_match' | 'partial_match'

export interface PriorityListEntry {
  channel: string
  createdAt: string
  createdBy: string
  id: string
  identifier: string
  matchRule: PriorityListMatchRule
  remark: string
}
