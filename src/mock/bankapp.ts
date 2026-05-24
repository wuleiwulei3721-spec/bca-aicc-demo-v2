import type {
  BankAppBusinessOption,
  BankAppContactMethod,
  BankAppContactMethodOption,
} from '../types'

export const bankAppContactMethods: BankAppContactMethodOption[] = [
  {
    id: 'voice',
    label: 'Voice Call',
    description: 'In-app voice call routed to an available agent.',
  },
  {
    id: 'video',
    label: 'Video Call',
    description: 'Secure video support for high-touch service cases.',
  },
  {
    id: 'livechat',
    label: 'Live Chat',
    description: 'Authenticated in-app chat with conversation history.',
  },
]

export const bankAppBusinessOptions: BankAppBusinessOption[] = [
  {
    id: 'mobile-login',
    label: 'Mobile Banking Login',
    labelId: 'Login Mobile Banking',
    description: 'Customer cannot access the mobile banking account.',
    guestSkill: 'General Digital Banking',
    registeredSkill: 'Authenticated Digital Banking',
    sla: '< 30 sec queue',
  },
  {
    id: 'card-issue',
    label: 'Card Issue',
    labelId: 'Layanan Kartu',
    description: 'Debit or credit card block, unlock, or replacement request.',
    guestSkill: 'Card Information',
    registeredSkill: 'Card Service Skill',
    sla: '< 45 sec queue',
  },
  {
    id: 'transaction-dispute',
    label: 'Transaction Dispute',
    labelId: 'Sanggahan Transaksi',
    description: 'Customer reports an incorrect or suspicious transaction.',
    guestSkill: 'Transaction Information',
    registeredSkill: 'Dispute Resolution Skill',
    sla: '< 60 sec queue',
  },
  {
    id: 'account-info',
    label: 'Account Information',
    labelId: 'Informasi Rekening',
    description: 'Customer asks about balance, statement, or account profile.',
    guestSkill: 'General Account Information',
    registeredSkill: 'Account Service Skill',
    sla: '< 30 sec queue',
  },
]

export const bankAppScreenshotSources = {
  businessConfirm: {
    livechat: '/screenshots/bankapp/livechat-business-confirm-sanitized.png',
    video: '/screenshots/bankapp/video-business-confirm-sanitized.png',
    voice: '/screenshots/bankapp/voice-business-confirm-sanitized.png',
  } satisfies Record<BankAppContactMethod, string>,
  businessSelection: {
    livechat: '/screenshots/bankapp/livechat-business-selection-sanitized.png',
    video: '/screenshots/bankapp/video-business-selection-sanitized.png',
    voice: '/screenshots/bankapp/voice-business-selection-sanitized.png',
  } satisfies Record<BankAppContactMethod, string>,
  channel: '/screenshots/bankapp/channel-selection-sanitized.png',
  serviceClosed: '/screenshots/bankapp/service-closed.png',
  textChat: '/screenshots/bankapp/livechat-chat.png',
  textLogin: '/screenshots/bankapp/text-login-sanitized.png',
  textQueue: '/screenshots/bankapp/livechat-queue.png',
  videoConnected: '/screenshots/bankapp/video-connected-new.png',
  videoScreenSharing: '/screenshots/bankapp/video-screen-sharing.png',
  voiceCalling: '/screenshots/bankapp/voice-calling.png',
  voiceConnected: '/screenshots/bankapp/voice-connected.png',
  voicePhoneNumber: '/screenshots/bankapp/voice-phone-number-sanitized.png',
}

export const whatsAppScreenshotSources = {
  agentChat: '/screenshots/whatsapp/agent-chat.png',
  businessSelection: '/screenshots/whatsapp/business-selection.png',
  chatRequest: '/screenshots/whatsapp/chat-request.png',
  satisfactionRating: '/screenshots/whatsapp/satisfaction-rating.png',
}
