import type {
  TextChannelConfigCode,
  TextChannelSettingsConfig,
} from '../types'

export interface TextChannelMeta {
  code: TextChannelConfigCode
  label: string
  tone: 'bankapp' | 'webchat' | 'whatsapp'
}

export const textChannelMetas: TextChannelMeta[] = [
  {
    code: 'haloapp',
    label: 'Haloapp',
    tone: 'bankapp',
  },
  {
    code: 'webchat',
    label: 'Webchat',
    tone: 'webchat',
  },
  {
    code: 'whatsapp',
    label: 'WhatsApp',
    tone: 'whatsapp',
  },
]

export const textChannelAlertRecipients = [
  'Monitoring Team',
  'Supervisor Team',
  'Digital Operations',
]

export const textChannelMessageVariables = [
  '{timeoutMinutes}',
  '{reminderMinutes}',
  '{channel}',
  '{customerName}',
]

export const defaultTextChannelSettings: TextChannelSettingsConfig = {
  customerTimeout: {
    autoCloseMinutes: 5,
    preCloseReminderMinutes: 1,
  },
  messages: {
    agentEndMessage:
      'Thank you for contacting BANK 1. The agent has ended this conversation.',
    agentNoReplyAutoResponseMessage: 'Please wait, we are processing...',
    autoCloseAgentMessage:
      'Customer timeout no reply, conversation closed automatically.',
    autoCloseCustomerMessage:
      'This conversation has been closed due to inactivity. Please start a new conversation if you need further assistance.',
    firstAccessReminder:
      'Hello, if you do not reply for {timeoutMinutes} minutes, the conversation will be closed automatically. Please check this conversation in time.',
    preCloseReminder:
      'Please reply in time. If no response is received, the system will end this conversation in {reminderMinutes} minute(s).',
    welcomeMessage:
      'Welcome to BANK 1 customer service. An agent will assist you shortly.',
  },
  queueAlerts: [
    {
      channel: 'haloapp',
      enabled: true,
      recipients: 'Monitoring Team',
      threshold: 10,
    },
    {
      channel: 'webchat',
      enabled: true,
      recipients: 'Monitoring Team',
      threshold: 10,
    },
    {
      channel: 'whatsapp',
      enabled: true,
      recipients: 'Monitoring Team',
      threshold: 10,
    },
  ],
  serviceRules: {
    agentNoReplyAutoResponseMinutes: 2,
    agentNoReplyBreachMinutes: 2,
    agentNoReplyWarningMinutes: 1,
    maxConcurrentCustomersPerAgent: 3,
    webchatRecallLimitMinutes: 2,
  },
}
