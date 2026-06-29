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
    livechat: '/screenshots/haloapp-v18/text-self-service-confirm.png',
    video: '/screenshots/haloapp-v18/voice-video-business-menu.png',
    voice: '/screenshots/haloapp-v18/voice-video-business-menu.png',
  } satisfies Record<BankAppContactMethod, string>,
  businessSelection: {
    livechat: '/screenshots/haloapp-v18/text-self-service-confirm.png',
    video: '/screenshots/haloapp-v18/voice-video-business-menu.png',
    voice: '/screenshots/haloapp-v18/voice-video-business-menu.png',
  } satisfies Record<BankAppContactMethod, string>,
  agentTextConnected: '/screenshots/haloapp-v18/agent-text-connected.png',
  agentVideoConnected: '/screenshots/haloapp-v18/agent-video-connected.png',
  channel: '/screenshots/haloapp-v18/channel-selection.png',
  pinInput: '/screenshots/haloapp-v18/pin-input-client.png',
  serviceClosed: '/screenshots/haloapp-v18/satisfaction-rating.png',
  textAgentConnected: '/screenshots/haloapp-v18/text-agent-connected-client.png',
  textChat: '/screenshots/haloapp-v18/text-chat-client.png',
  textLogin: '/screenshots/haloapp-v18/text-guest-contact.png',
  textQueue: '/screenshots/haloapp-v18/text-queue.png',
  videoConnected: '/screenshots/haloapp-v18/video-call.png',
  videoQueue: '/screenshots/haloapp-v18/video-queue.png',
  videoScreenSharing: '/screenshots/haloapp-v18/video-client-share-start.png',
  videoScreenShareViewer: '/screenshots/haloapp-v18/openeye-screen-share-view.png',
  voiceCalling: '/screenshots/haloapp-v18/voice-queue.png',
  voiceConnected: '/screenshots/haloapp-v18/voice-call.png',
  voiceQuestionVerification: '/screenshots/haloapp-v18/voice-question-verification.png',
  voicePhoneNumber: '/screenshots/haloapp-v18/voice-video-guest-info.png',
}

export const whatsAppScreenshotSources = {
  agentChat: '/screenshots/whatsapp/agent-chat.png',
  businessSelection: '/screenshots/whatsapp/business-selection.png',
  chatRequest: '/screenshots/whatsapp/chat-request.png',
  satisfactionRating: '/screenshots/whatsapp/satisfaction-rating.png',
}

export const webchatScreenshotSources = {
  agentChat: '/screenshots/webchat/text-agent-chat.png',
  customerMessage: '/screenshots/webchat/text-customer-message.png',
  entry: '/screenshots/webchat/text-login-business.png',
  queue: '/screenshots/webchat/text-queue.png',
  satisfactionRating: '/screenshots/webchat/satisfaction-rating.png',
}
