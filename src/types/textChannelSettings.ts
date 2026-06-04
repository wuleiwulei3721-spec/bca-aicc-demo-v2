export type TextChannelConfigCode = 'haloapp' | 'webchat' | 'whatsapp'

export type TextChannelSettingsStatus = 'Draft' | 'Published'

export interface TextChannelServiceRules {
  agentNoReplyAutoResponseMinutes: number
  agentNoReplyBreachMinutes: number
  agentNoReplyWarningMinutes: number
  maxConcurrentCustomersPerAgent: number
  webchatRecallLimitMinutes: number
}

export interface TextChannelCustomerTimeoutRules {
  autoCloseMinutes: number
  preCloseReminderMinutes: number
}

export interface TextChannelMessageTemplates {
  agentEndMessage: string
  agentNoReplyAutoResponseMessage: string
  autoCloseAgentMessage: string
  autoCloseCustomerMessage: string
  firstAccessReminder: string
  preCloseReminder: string
  welcomeMessage: string
}

export interface TextChannelQueueAlertConfig {
  channel: TextChannelConfigCode
  enabled: boolean
  recipients: string
  threshold: number
}

export interface TextChannelSettingsConfig {
  customerTimeout: TextChannelCustomerTimeoutRules
  messages: TextChannelMessageTemplates
  queueAlerts: TextChannelQueueAlertConfig[]
  serviceRules: TextChannelServiceRules
}
