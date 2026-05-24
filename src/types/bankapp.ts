export type BankAppContactMethod = 'voice' | 'video' | 'livechat'

export type BankAppCustomerType = 'registered' | 'guest'

export type BankAppLanguage = 'id' | 'en'

export type BankAppBusinessType =
  | 'mobile-login'
  | 'card-issue'
  | 'transaction-dispute'
  | 'account-info'

export type BankAppDemoStep =
  | 'channel'
  | 'phone-number'
  | 'personal-info'
  | 'business'
  | 'confirm'
  | 'calling'
  | 'connected'
  | 'chat'
  | 'agent-workspace'
  | 'share-select'
  | 'screen-sharing'
  | 'closed'

export interface BankAppBusinessOption {
  id: BankAppBusinessType
  label: string
  labelId: string
  description: string
  guestSkill: string
  registeredSkill: string
  sla: string
}

export interface BankAppContactMethodOption {
  id: BankAppContactMethod
  label: string
  description: string
}
