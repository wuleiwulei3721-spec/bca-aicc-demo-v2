export type CommonNumberStatus = 'Active' | 'Disabled'

export interface CommonNumberEntry {
  id: string
  name: string
  number: string
  remark: string
  status: CommonNumberStatus
}
