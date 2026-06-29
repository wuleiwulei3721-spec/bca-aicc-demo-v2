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
    livechat: '/screenshots/haloapp-v18/text-self-service-confirm-optimized.jpg',
    video: '/screenshots/haloapp-v18/voice-video-business-menu-optimized.jpg',
    voice: '/screenshots/haloapp-v18/voice-video-business-menu-optimized.jpg',
  } satisfies Record<BankAppContactMethod, string>,
  businessSelection: {
    livechat: '/screenshots/haloapp-v18/text-self-service-confirm-optimized.jpg',
    video: '/screenshots/haloapp-v18/voice-video-business-menu-optimized.jpg',
    voice: '/screenshots/haloapp-v18/voice-video-business-menu-optimized.jpg',
  } satisfies Record<BankAppContactMethod, string>,
  agentTextConnected: '/screenshots/haloapp-v18/agent-text-connected-optimized.jpg',
  agentVideoConnected: '/screenshots/haloapp-v18/agent-video-connected-optimized.jpg',
  channel: '/screenshots/haloapp-v18/channel-selection-optimized.jpg',
  pinInput: '/screenshots/haloapp-v18/pin-input-client-optimized.jpg',
  serviceClosed: '/screenshots/haloapp-v18/satisfaction-rating-optimized.jpg',
  textAgentConnected: '/screenshots/haloapp-v18/text-agent-connected-client-optimized.jpg',
  textChat: '/screenshots/haloapp-v18/text-chat-client-optimized.jpg',
  textLogin: '/screenshots/haloapp-v18/text-guest-contact-optimized.jpg',
  textQueue: '/screenshots/haloapp-v18/text-queue-optimized.jpg',
  videoConnected: '/screenshots/haloapp-v18/video-call-optimized.jpg',
  videoQueue: '/screenshots/haloapp-v18/video-queue-optimized.jpg',
  videoScreenSharing: '/screenshots/haloapp-v18/video-client-share-start-optimized.jpg',
  videoScreenShareViewer: '/screenshots/haloapp-v18/openeye-screen-share-view-optimized.jpg',
  voiceCalling: '/screenshots/haloapp-v18/voice-queue-optimized.jpg',
  voiceConnected: '/screenshots/haloapp-v18/voice-call-optimized.jpg',
  voiceQuestionVerification: '/screenshots/haloapp-v18/voice-question-verification-optimized.jpg',
  voicePhoneNumber: '/screenshots/haloapp-v18/voice-video-guest-info-optimized.jpg',
}

export const whatsAppScreenshotSources = {
  agentChat: '/screenshots/whatsapp/agent-chat.png',
  businessSelection: '/screenshots/whatsapp/business-selection.png',
  chatRequest: '/screenshots/whatsapp/chat-request.png',
  satisfactionRating: '/screenshots/whatsapp/satisfaction-rating.png',
}

export const webchatScreenshotSources = {
  agentChat: '/screenshots/webchat/text-agent-chat-optimized.jpg',
  customerMessage: '/screenshots/webchat/text-customer-message-optimized.jpg',
  entry: '/screenshots/webchat/text-login-business-optimized.jpg',
  queue: '/screenshots/webchat/text-queue-optimized.jpg',
  satisfactionRating: '/screenshots/webchat/satisfaction-rating-optimized.jpg',
}
