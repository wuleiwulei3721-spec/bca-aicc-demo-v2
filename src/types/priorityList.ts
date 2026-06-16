export type PriorityListMatchRule = 'email_domain_match' | 'exact_match'

export interface PriorityListEntry {
  channel: string
  createdAt: string
  createdBy: string
  id: string
  identifier: string
  matchRule: PriorityListMatchRule
  remark: string
}
