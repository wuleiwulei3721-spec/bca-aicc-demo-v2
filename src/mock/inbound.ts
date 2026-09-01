import type {
  CallFlowDetail,
  CustomerIdentityRefreshResult,
  CustomerInformation,
  CustomerJourneyItem,
  LiveChat2Session,
  LiveChatSession,
  NextBestActionItem,
  TicketHistoryItem,
  VerificationBusinessTypeOption,
  VerificationRule,
  VerificationQuestion,
} from '../types'

export const inboundCustomer: CustomerInformation = {
  accessChannel: 'Phone',
  accessDuration: '05:23',
  profile: {
    avatarInitials: 'DP',
    avatarUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80',
    name: 'Dimas Abimanyu Prabowo',
    phoneNumber: '+62 21 25563000',
    email: 'Dimas@gmail.com',
    emailVerificationStatus: 'Verified',
    cisNumber: '00000078987',
    customerType: 'Priority Customer',
    segmentation: 'Prioritas - Upper Mass',
    crmContacts: {
      Phone: ['+62 21 25563000', '+62 21 5088 1001'],
      WhatsApp: ['+62 878 2510 0234'],
      BankApp: ['dimas.bank1'],
      Email: ['Dimas@gmail.com', 'dimas.abimanyu@example.net'],
      Instagram: ['@dimas.abimanyu'],
      X: ['@dimasabimanyu'],
      LinkedIn: ['linkedin.com/in/dimas-abimanyu'],
      'App Store': ['Dimas A.'],
    },
  },
  verificationStatus: 'Unverified',
}

export const CRM_DEMO_CIS_NUMBER =
  inboundCustomer.profile.cisNumber

export const unidentifiedInboundCustomer: CustomerInformation = {
  accessChannel: 'Phone',
  accessDuration: '05:23',
  profile: {
    avatarInitials: '?',
    avatarUrl: '',
    name: 'Unidentified Customer',
    phoneNumber: '',
    email: '',
    cisNumber: '',
    customerType: '',
  },
  verificationStatus: 'Unverified',
}

export const unidentifiedCustomerJourney: CustomerJourneyItem[] = []

export const unidentifiedTicketingHistory: TicketHistoryItem[] = []

export const bankAppVoiceCustomer: CustomerInformation = {
  accessChannel: 'BankApp Voice',
  accessDuration: '00:12',
  bankAppLoginStatus: 'registered',
  profile: {
    avatarInitials: 'SA',
    avatarUrl: '',
    name: 'Sari Amelia',
    phoneNumber: '08123456789',
    email: 'sari.amelia@example.com',
    emailVerificationStatus: 'Unverified',
    cisNumber: '00000056231',
    customerType: 'Regular Customer',
  },
  verificationStatus: 'Unverified',
}

export const bankAppVoiceGuestCustomer: CustomerInformation = {
  accessChannel: 'BankApp Voice',
  accessDuration: '00:12',
  bankAppLoginStatus: 'guest',
  profile: {
    avatarInitials: 'GU',
    avatarUrl: '',
    name: 'Unidentified Customer',
    phoneNumber: '',
    email: '',
    cisNumber: '',
    customerType: '',
  },
  verificationStatus: 'Unverified',
}

export const bankAppVideoCustomer: CustomerInformation = {
  accessChannel: 'BankApp Video',
  accessDuration: '00:12',
  profile: {
    avatarInitials: 'SA',
    avatarUrl: '',
    name: 'Sari Amelia',
    phoneNumber: '08123456789',
    email: 'sari.amelia@example.com',
    emailVerificationStatus: 'Unverified',
    cisNumber: '00000056231',
    customerType: 'Regular Customer',
  },
  verificationStatus: 'Unverified',
}

export const bankAppVideoGuestCustomer: CustomerInformation = {
  accessChannel: 'BankApp Video',
  accessDuration: '00:12',
  profile: {
    avatarInitials: 'GU',
    avatarUrl: '',
    name: 'Unidentified Customer',
    phoneNumber: '',
    email: '',
    cisNumber: '',
    customerType: '',
  },
  verificationStatus: 'Unverified',
}

export const liveChatSessions: LiveChatSession[] = [
  {
    id: 'live-chat-001',
    channel: 'WhatsApp',
    customer: {
      ...unidentifiedInboundCustomer,
      accessChannel: 'WhatsApp',
      accessDuration: '00:48',
    },
    conversation: [
      {
        id: 'live-chat-001-history-1',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        senderRole: 'Customer',
        message:
          'My debit card was blocked yesterday after I confirmed the transaction.',
        time: '13:58',
      },
      {
        id: 'live-chat-001-history-2',
        sender: 'agent',
        senderName: 'Rina Putri',
        senderRole: 'Previous Agent',
        message:
          'I have checked the fraud hold and submitted the unlock request for review.',
        time: '14:01',
      },
      {
        id: 'live-chat-001-history-3',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        senderRole: 'Customer',
        message: 'How long will it take? I need to use the card today.',
        time: '14:05',
      },
      {
        id: 'live-chat-001-history-4',
        sender: 'agent',
        senderName: 'Andi Saputra',
        senderRole: 'Previous Agent',
        message:
          'The review is complete. The current agent will help you verify and reopen access.',
        time: '14:18',
      },
      {
        id: 'live-chat-001-current-1',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        senderRole: 'Customer',
        message: 'My debit card is still blocked after verification.',
        time: '14:32',
      },
    ],
    intent: 'Card unlock',
    lastMessage: 'My debit card is still blocked after verification.',
    lastMessageTime: '14:32',
    priority: 'High',
    unreadCount: 3,
  },
  {
    id: 'live-chat-002',
    channel: 'BankApp',
    customer: {
      accessChannel: 'BankApp',
      accessDuration: '02:11',
      profile: {
        avatarInitials: 'SA',
        avatarUrl: '',
        name: 'Sari Amelia',
        phoneNumber: '08123456789',
        email: 'sari.amelia@example.com',
        emailVerificationStatus: 'Unverified',
        cisNumber: '00000056231',
        customerType: 'Regular Customer',
      },
      verificationStatus: 'Unverified',
    },
    conversation: [
      {
        id: 'live-chat-002-history-1',
        sender: 'customer',
        senderName: 'Sari Amelia',
        senderRole: 'Customer',
        message: 'I forgot my mobile banking password this morning.',
        time: '14:12',
      },
      {
        id: 'live-chat-002-history-2',
        sender: 'agent',
        senderName: 'Maya Lestari',
        senderRole: 'Previous Agent',
        message:
          'I have confirmed the registered phone number and sent the reset guidance.',
        time: '14:15',
      },
      {
        id: 'live-chat-002-history-3',
        sender: 'customer',
        senderName: 'Sari Amelia',
        senderRole: 'Customer',
        message:
          'The reset page says my device is not recognized. Can you help me?',
        time: '14:23',
      },
      {
        id: 'live-chat-002-current-1',
        sender: 'customer',
        senderName: 'Sari Amelia',
        senderRole: 'Customer',
        message: 'I cannot access my mobile banking account today.',
        time: '14:29',
      },
    ],
    intent: 'Mobile banking login',
    lastMessage: 'I cannot access my mobile banking account today.',
    lastMessageTime: '14:29',
    priority: 'Normal',
    unreadCount: 1,
  },
  {
    id: 'live-chat-003',
    channel: 'Webchat',
    customer: {
      ...unidentifiedInboundCustomer,
      accessChannel: 'Webchat',
      accessDuration: '03:44',
    },
    conversation: [
      {
        id: 'live-chat-003-history-1',
        sender: 'customer',
        senderName: 'Rafi Firmansyah',
        senderRole: 'Customer',
        message:
          'I noticed a different installment fee on my credit card statement.',
        time: '13:46',
      },
      {
        id: 'live-chat-003-history-2',
        sender: 'agent',
        senderName: 'Budi Hartono',
        senderRole: 'Previous Agent',
        message:
          'I checked the billing cycle and escalated the fee difference to card operations.',
        time: '13:52',
      },
      {
        id: 'live-chat-003-history-3',
        sender: 'agent',
        senderName: 'Nadia Putri',
        senderRole: 'Current Agent',
        message:
          'I will review the billing note and confirm the adjusted installment amount.',
        time: '14:18',
        isCurrentAgent: true,
      },
      {
        id: 'live-chat-003-current-1',
        sender: 'customer',
        senderName: 'Rafi Firmansyah',
        senderRole: 'Customer',
        message: 'Please help me check why the installment fee changed.',
        time: '14:24',
      },
    ],
    intent: 'Credit card billing',
    lastMessage: 'Please help me check why the installment fee changed.',
    lastMessageTime: '14:24',
    priority: 'Normal',
    unreadCount: 0,
  },
]

export const liveChat2Sessions: LiveChat2Session[] = [
  {
    id: 'livechat2-001',
    accessSequence: 1,
    channel: 'WhatsApp',
    customer: {
      ...unidentifiedInboundCustomer,
      accessChannel: 'WhatsApp',
      accessDuration: '00:18',
    },
    historyMessages: [
      {
        id: 'livechat2-001-history-1',
        kind: 'text',
        message:
          'Customer reported a blocked debit card after three incorrect PIN attempts at an ATM.',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        time: '13:42',
        timestamp: '2026-05-27T13:42:00+08:00',
      },
      {
        id: 'livechat2-001-history-2',
        kind: 'text',
        message:
          'I confirmed the card is active and routed the case to Card Services for unblock authorization.',
        sender: 'agent',
        senderEmployeeId: 'AICC1024',
        senderName: 'Rina Putri',
        time: '13:45',
        timestamp: '2026-05-27T13:45:00+08:00',
      },
      {
        id: 'livechat2-001-history-3',
        kind: 'system',
        message: 'Rina Putri transferred the conversation to Nadia Putri.',
        sender: 'system',
        senderName: 'System',
        time: '13:50',
        timestamp: '2026-05-27T13:50:00+08:00',
      },
    ],
    initialStarColor: 'yellow',
    initialUnansweredSeconds: 38,
    intent: 'Debit card unblock',
    lastMessage:
      'Please help. I need to withdraw cash before my travel this afternoon.',
    lastMessageAt: '2026-05-27T14:32:00+08:00',
    lastMessageTime: '14:32',
    messages: [
      {
        id: 'livechat2-001-message-1',
        kind: 'system',
        message:
          'Welcome to BANK 1. If you do not reply for 5 minutes, this conversation may be closed automatically.',
        sender: 'system',
        senderName: 'System',
        time: '14:28',
        timestamp: '2026-05-27T14:28:00+08:00',
      },
      {
        id: 'livechat2-001-message-2',
        kind: 'text',
        message:
          'Hi BANK 1, my debit card is blocked after I changed my PIN.',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        time: '14:30',
        timestamp: '2026-05-27T14:30:00+08:00',
      },
      {
        id: 'livechat2-001-message-3',
        isCurrentAgent: true,
        kind: 'text',
        message:
          'I will verify your card status and submit the unblock request after authentication.',
        sender: 'agent',
        senderEmployeeId: 'AICC1205',
        senderName: 'Nadia Putri',
        time: '14:31',
        timestamp: '2026-05-27T14:31:00+08:00',
      },
      {
        id: 'livechat2-001-message-4',
        kind: 'text',
        message:
          'Please help. I need to withdraw cash before my travel this afternoon.',
        sender: 'customer',
        senderName: 'Dimas Abimanyu Prabowo',
        time: '14:32',
        timestamp: '2026-05-27T14:32:00+08:00',
      },
    ],
    queueName: 'Card Services',
    serviceStartedAt: '14:28',
    status: 'active',
    transferSource: {
      agentName: 'Rina Putri',
      employeeId: 'AGT-1024',
      team: 'Card Support',
      transferredAt: '14:28',
    },
    unreadCount: 2,
  },
  {
    id: 'livechat2-002',
    accessSequence: 2,
    bankAppLoginStatus: 'registered',
    channel: 'BankApp',
    customer: {
      accessChannel: 'BankApp',
      accessDuration: '01:12',
      profile: {
        avatarInitials: 'SA',
        avatarUrl: '',
        name: 'Sari Amelia',
        phoneNumber: '08123456789',
        email: 'sari.amelia@example.com',
        emailVerificationStatus: 'Unverified',
        cisNumber: '00000056231',
        customerType: 'Regular Customer',
      },
      verificationStatus: 'Unverified',
    },
    historyMessages: [
      {
        id: 'livechat2-002-history-1',
        kind: 'text',
        message:
          'I changed to a new phone and cannot complete mobile banking sign-in.',
        sender: 'customer',
        senderName: 'Sari Amelia',
        time: '13:58',
        timestamp: '2026-05-27T13:58:00+08:00',
      },
      {
        id: 'livechat2-002-history-2',
        kind: 'text',
        message:
          'Please keep your registered mobile number ready for verification.',
        sender: 'agent',
        senderEmployeeId: 'AICC1088',
        senderName: 'Maya Lestari',
        time: '14:00',
        timestamp: '2026-05-27T14:00:00+08:00',
      },
    ],
    initialStarColor: 'red',
    initialUnansweredSeconds: 76,
    intent: 'Mobile banking device binding',
    lastMenuName: 'Mobile banking device binding',
    lastMessage:
      'Can you keep my account access secure while you reset the device?',
    lastMessageAt: '2026-05-27T14:34:00+08:00',
    lastMessageTime: '14:34',
    messages: [
      {
        id: 'livechat2-002-message-1',
        kind: 'text',
        message:
          'The BANK 1 app says this device is not registered to my account.',
        sender: 'customer',
        senderName: 'Sari Amelia',
        time: '14:24',
        timestamp: '2026-05-27T14:24:00+08:00',
      },
      {
        id: 'livechat2-002-message-2',
        isCurrentAgent: true,
        kind: 'text',
        message:
          'I can help reset the device binding after we complete verification.',
        sender: 'agent',
        senderEmployeeId: 'AICC1205',
        senderName: 'Nadia Putri',
        time: '14:27',
        timestamp: '2026-05-27T14:27:00+08:00',
      },
      {
        id: 'livechat2-002-message-3',
        kind: 'text',
        message:
          'Can you keep my account access secure while you reset the device?',
        sender: 'customer',
        senderName: 'Sari Amelia',
        time: '14:34',
        timestamp: '2026-05-27T14:34:00+08:00',
      },
    ],
    queueName: 'Digital Banking Support',
    serviceStartedAt: '14:24',
    status: 'active',
    unreadCount: 10,
  },
  {
    id: 'livechat2-003',
    accessSequence: 3,
    channel: 'Webchat',
    customer: {
      ...unidentifiedInboundCustomer,
      accessChannel: 'Webchat',
      accessDuration: '02:06',
    },
    historyMessages: [
      {
        id: 'livechat2-003-history-1',
        kind: 'text',
        message:
          'Customer started Webchat from the BANK 1 website after logging in.',
        sender: 'system',
        senderName: 'System',
        time: '14:05',
        timestamp: '2026-05-27T14:05:00+08:00',
      },
    ],
    initialStarColor: 'gray',
    initialUnansweredSeconds: 0,
    intent: 'Webchat credit card inquiry',
    lastMessage:
      'Hello, I need help checking my credit card billing.',
    lastMessageAt: '2026-05-27T14:35:00+08:00',
    lastMessageTime: '14:35',
    messages: [
      {
        id: 'livechat2-003-message-1',
        kind: 'text',
        message: 'Hello, I am browsing from the BANK 1 website.',
        sender: 'customer',
        senderName: 'Rafi Firmansyah',
        time: '14:31',
        timestamp: '2026-05-27T14:31:00+08:00',
      },
      {
        id: 'livechat2-003-message-2',
        kind: 'image',
        message: 'Uploaded product screenshot',
        sender: 'customer',
        senderName: 'Rafi Firmansyah',
        time: '14:33',
        timestamp: '2026-05-27T14:33:00+08:00',
      },
      {
        id: 'livechat2-003-message-3',
        kind: 'text',
        message: 'Hello, I need help checking my credit card billing.',
        sender: 'customer',
        senderName: 'Rafi Firmansyah',
        time: '14:35',
        timestamp: '2026-05-27T14:35:00+08:00',
      },
    ],
    queueName: 'Webchat Card Service',
    serviceStartedAt: '14:31',
    status: 'active',
    unreadCount: 1,
  },
  {
    id: 'livechat2-004',
    accessSequence: 4,
    channel: 'WhatsApp',
    customer: {
      ...unidentifiedInboundCustomer,
      accessChannel: 'WhatsApp',
      accessDuration: '00:42',
    },
    historyMessages: [
      {
        id: 'livechat2-004-history-1',
        kind: 'file',
        fileName: 'statement-dispute.pdf',
        message: 'Credit card statement attachment',
        sender: 'customer',
        senderName: 'Andika Saputra',
        time: '14:12',
        timestamp: '2026-05-27T14:12:00+08:00',
      },
    ],
    initialStarColor: 'blue',
    initialUnansweredSeconds: null,
    intent: 'Credit card installment conversion',
    lastMessage: 'Thank you, please send the installment confirmation to me.',
    lastMessageAt: '2026-05-27T14:21:00+08:00',
    lastMessageTime: '14:21',
    messages: [
      {
        id: 'livechat2-004-message-1',
        kind: 'text',
        message:
          'I want to convert this credit card transaction into installments.',
        sender: 'customer',
        senderName: 'Andika Saputra',
        time: '14:14',
        timestamp: '2026-05-27T14:14:00+08:00',
      },
      {
        id: 'livechat2-004-message-2',
        isCurrentAgent: true,
        kind: 'text',
        message:
          'I have checked the eligible transaction and registered the installment request.',
        sender: 'agent',
        senderEmployeeId: 'AICC1205',
        senderName: 'Nadia Putri',
        time: '14:20',
        timestamp: '2026-05-27T14:20:00+08:00',
      },
      {
        id: 'livechat2-004-message-3',
        kind: 'text',
        message: 'Thank you, please send the installment confirmation to me.',
        sender: 'customer',
        senderName: 'Andika Saputra',
        time: '14:21',
        timestamp: '2026-05-27T14:21:00+08:00',
      },
    ],
    queueName: 'Credit Card Services',
    serviceStartedAt: '14:14',
    status: 'active',
    unreadCount: 0,
  },
  {
    id: 'livechat2-005',
    accessSequence: 5,
    bankAppLoginStatus: 'registered',
    channel: 'BankApp',
    customer: {
      accessChannel: 'BankApp',
      accessDuration: '02:53',
      profile: {
        avatarInitials: 'LN',
        avatarUrl: '',
        name: 'Lina Nuraini',
        phoneNumber: '08123456789',
        email: 'lina.nuraini@example.com',
        emailVerificationStatus: 'Unverified',
        cisNumber: '00000077124',
        customerType: 'Regular Customer',
      },
      verificationStatus: 'Verified',
    },
    endReason: 'customer',
    historyMessages: [
      {
        id: 'livechat2-005-history-1',
        kind: 'text',
        message:
          'Customer authenticated through BANK 1 mobile app before chat routing.',
        sender: 'system',
        senderName: 'System',
        time: '14:18',
        timestamp: '2026-05-27T14:18:00+08:00',
      },
    ],
    initialStarColor: 'gray',
    initialUnansweredSeconds: null,
    intent: 'Replacement card delivery',
    lastMenuName: 'Replacement card delivery',
    lastMessage: 'Customer ended the conversation after receiving delivery status.',
    lastMessageAt: '2026-05-27T14:39:25+08:00',
    lastMessageTime: '14:39',
    messages: [
      {
        id: 'livechat2-005-message-1',
        kind: 'text',
        message:
          'I want to check whether my replacement debit card has been delivered.',
        sender: 'customer',
        senderName: 'Lina Nuraini',
        time: '14:36',
        timestamp: '2026-05-27T14:36:00+08:00',
      },
      {
        id: 'livechat2-005-message-2',
        isCurrentAgent: true,
        kind: 'text',
        message:
          'I am checking the courier status and registered delivery address now.',
        sender: 'agent',
        senderEmployeeId: 'AICC1205',
        senderName: 'Nadia Putri',
        time: '14:38',
        timestamp: '2026-05-27T14:38:00+08:00',
      },
      {
        id: 'livechat2-005-message-3',
        kind: 'system',
        message:
          'Customer ended the conversation after receiving delivery status.',
        sender: 'system',
        senderName: 'System',
        time: '14:39',
        timestamp: '2026-05-27T14:39:25+08:00',
      },
    ],
    queueName: 'Card Services',
    serviceStartedAt: '14:36',
    status: 'ended',
    unreadCount: 0,
  },
  {
    id: 'livechat2-history-001',
    accessSequence: 99,
    bankAppLoginStatus: 'registered',
    channel: 'BankApp',
    customer: {
      accessChannel: 'BankApp',
      accessDuration: '08:46',
      profile: {
        avatarInitials: 'RA',
        avatarUrl: '',
        name: 'Raka Aditya',
        phoneNumber: '08123456789',
        email: 'raka.aditya@example.com',
        emailVerificationStatus: 'Unverified',
        cisNumber: '00000068221',
        customerType: 'Regular Customer',
      },
      verificationStatus: 'Verified',
    },
    historyMessages: [],
    initialStarColor: 'gray',
    initialUnansweredSeconds: null,
    intent: 'Paylater repayment schedule',
    isInitialHistory: true,
    lastMenuName: 'Paylater repayment schedule',
    lastMessage: 'The updated repayment schedule has been sent.',
    lastMessageAt: '2026-05-27T13:52:00+08:00',
    lastMessageTime: '13:52',
    messages: [
      {
        id: 'livechat2-history-001-message-1',
        kind: 'text',
        message: 'Please help me check my BANK 1 Paylater repayment schedule.',
        sender: 'customer',
        senderName: 'Raka Aditya',
        time: '13:42',
        timestamp: '2026-05-27T13:42:00+08:00',
      },
      {
        id: 'livechat2-history-001-message-2',
        isCurrentAgent: true,
        kind: 'text',
        message: 'The updated repayment schedule has been sent.',
        sender: 'agent',
        senderEmployeeId: 'AICC1205',
        senderName: 'Nadia Putri',
        time: '13:52',
        timestamp: '2026-05-27T13:52:00+08:00',
      },
    ],
    queueName: 'Paylater Support',
    serviceStartedAt: '13:42',
    status: 'ended',
    unreadCount: 0,
  },
]

export const callFlowDetail: CallFlowDetail = {
  ivrDuration: '02:35',
  ivrJourney: [
    {
      id: 'ivr-002',
      nodeName: 'Bahasa Indonesia',
      actionTime: '14:18:15',
    },
    {
      id: 'ivr-003',
      nodeName: 'Credit Card',
      actionTime: '14:18:38',
    },
    {
      id: 'ivr-004',
      nodeName: 'Report Lost Card & Check Credit Card Application Status',
      actionTime: '14:19:06',
    },
  ],
  transferHistory: [
    {
      id: 'transfer-001',
      agentId: 'AIC23018',
      transferAgent: 'Rina Putri',
      agentSkill: 'Credit Card Service',
      serviceDuration: '08:35',
      transferTime: '14:32',
    },
    {
      id: 'transfer-002',
      agentId: 'AIC21042',
      transferAgent: 'Andi Saputra',
      agentSkill: 'Priority Banking TL',
      serviceDuration: '03:12',
      transferTime: '14:41',
    },
  ],
}

export const verificationBusinessTypes: VerificationBusinessTypeOption[] = [
  { code: 'perbankan', enabled: true, label: 'Perbankan' },
  { code: 'kartu-kredit', enabled: true, label: 'Kartu Kredit' },
  { code: 'paylater', enabled: true, label: 'Paylater' },
]

const perbankanQuestions: VerificationQuestion[] = [
  {
    answer: 'Santoso',
    answerSource: 'CRM customer profile',
    group: 'mandatory',
    id: 'perbankan-mandatory-001',
    question: 'Mohon sebutkan nama gadis ibu kandung Anda.',
    sequence: 1,
  },
  {
    answer: 'Transfer Rp 1.250.000 ke Raka Aditya',
    answerSource: 'Core banking transaction history',
    group: 'dynamic',
    id: 'perbankan-dynamic-001',
    question: 'Mohon sebutkan salah satu dari 5 transaksi keluar terakhir.',
    sequence: 2,
  },
  {
    answer: 'myBank, KlikBank, dan mobile banking',
    answerSource: 'E-Channel profile',
    group: 'dynamic',
    id: 'perbankan-dynamic-002',
    question: 'Mohon sebutkan fasilitas E-Channel yang Anda miliki.',
    sequence: 3,
  },
  {
    answer: 'Debit Mastercard Platinum',
    answerSource: 'Card profile',
    group: 'dynamic',
    id: 'perbankan-dynamic-003',
    question: 'Mohon sebutkan jenis kartu debit yang Anda miliki.',
    sequence: 4,
  },
  {
    answer: 'Tahapan',
    answerSource: 'Account profile',
    group: 'dynamic',
    id: 'perbankan-dynamic-004',
    question: 'Mohon sebutkan jenis rekening yang Anda miliki.',
    sequence: 5,
  },
  {
    answer: 'KCU BANK 1 Sudirman',
    answerSource: 'Account opening branch',
    group: 'dynamic',
    id: 'perbankan-dynamic-005',
    question: 'Mohon sebutkan cabang asal rekening Anda.',
    sequence: 6,
  },
  {
    answer: 'Dimas@gmail.com',
    answerSource: 'CRM customer profile',
    group: 'static',
    id: 'perbankan-static-001',
    question: 'Mohon sebutkan alamat email yang terdaftar.',
    sequence: 7,
  },
  {
    answer: '087825100234',
    answerSource: 'CRM customer profile',
    group: 'static',
    id: 'perbankan-static-002',
    question: 'Mohon sebutkan nomor HP yang terdaftar.',
    sequence: 8,
  },
  {
    answer: '3174********0001',
    answerSource: 'Identity document profile',
    group: 'static',
    id: 'perbankan-static-003',
    question: 'Mohon sebutkan NIK, paspor, atau KITAS yang terdaftar.',
    sequence: 9,
  },
  {
    answer: 'Jl. Senopati Raya No. 88, Jakarta Selatan',
    answerSource: 'CRM customer profile',
    group: 'static',
    id: 'perbankan-static-004',
    question: 'Mohon sebutkan alamat yang terdaftar.',
    sequence: 10,
  },
  {
    answer: 'Dimas Abimanyu Prabowo',
    answerSource: 'KTP profile',
    group: 'static',
    id: 'perbankan-static-005',
    question: 'Mohon sebutkan nama lengkap sesuai KTP.',
    sequence: 11,
  },
  {
    answer: 'Jakarta, 18 Mei 1988',
    answerSource: 'KTP profile',
    group: 'static',
    id: 'perbankan-static-006',
    question: 'Mohon sebutkan tempat dan tanggal lahir.',
    sequence: 12,
  },
]

const kartuKreditQuestions: VerificationQuestion[] = [
  {
    answer: 'Santoso',
    answerSource: 'Cardholder profile',
    group: 'mandatory',
    id: 'card-mandatory-001',
    question: 'Mohon sebutkan nama gadis ibu kandung Anda.',
    sequence: 1,
  },
  {
    answer: 'E-mail billing ke Dimas@gmail.com',
    answerSource: 'Credit card billing profile',
    group: 'static',
    id: 'card-static-001',
    question:
      'Mohon konfirmasi alamat penagihan kartu kredit. Jika e-mail, sebutkan alamat e-mail.',
    sequence: 2,
  },
  {
    answer: 'Jl. Senopati Raya No. 88, Jakarta Selatan',
    answerSource: 'Credit card billing profile',
    group: 'static',
    id: 'card-static-002',
    question:
      'Mohon sebutkan e-mail atau alamat penagihan yang belum ditanyakan.',
    sequence: 3,
  },
  {
    answer: 'myBank',
    answerSource: 'Credit card payment history',
    group: 'dynamic',
    id: 'card-dynamic-001',
    question:
      'Mohon sebutkan channel pembayaran terakhir tagihan kartu kredit.',
    sequence: 4,
  },
  {
    answer: 'Rangga Pratama',
    answerSource: 'Supplementary card profile',
    group: 'alternative',
    id: 'card-alternative-001',
    question: 'Mohon sebutkan nama pemilik kartu tambahan, jika ada.',
    sequence: 5,
  },
  {
    answer: 'Rp 75.000.000',
    answerSource: 'Credit card limit profile',
    group: 'alternative',
    id: 'card-alternative-002',
    question: 'Mohon sebutkan limit gabungan kartu kredit Anda.',
    sequence: 6,
  },
  {
    answer: 'Jakarta, 18 Mei 1988',
    answerSource: 'Cardholder profile',
    group: 'alternative',
    id: 'card-alternative-003',
    question: 'Mohon sebutkan tempat dan tanggal lahir.',
    sequence: 7,
  },
  {
    answer: '2 kartu kredit',
    answerSource: 'Credit card profile',
    group: 'alternative',
    id: 'card-alternative-004',
    question: 'Mohon sebutkan berapa kartu kredit yang Anda miliki.',
    sequence: 8,
  },
  {
    answer: 'Nomor berakhiran 4412, valid thru 08/29',
    answerSource: 'Credit card profile',
    group: 'layering',
    id: 'card-layering-001',
    notes: 'Layering demo for ATO or add-on requests.',
    question: 'Mohon sebutkan nomor kartu kredit dan expired date.',
    sequence: 9,
  },
  {
    answer: 'Transaksi marketplace Rp 2.450.000',
    answerSource: 'Credit card transaction history',
    group: 'layering',
    id: 'card-layering-002',
    notes: 'Layering demo for ATO or add-on requests.',
    question: 'Mohon sebutkan transaksi terakhir kartu kredit.',
    sequence: 10,
  },
]

const paylaterQuestions: VerificationQuestion[] = [
  {
    answer: 'Santoso',
    answerSource: 'CRM customer profile',
    group: 'mandatory',
    id: 'paylater-mandatory-001',
    question: 'Mohon sebutkan nama gadis ibu kandung Anda.',
    sequence: 1,
  },
  {
    answer: '087825100234',
    answerSource: 'CRM customer profile',
    group: 'static',
    id: 'paylater-static-001',
    question: 'Mohon sebutkan nomor telepon atau HP yang terdaftar.',
    sequence: 2,
  },
  {
    answer: 'dimas.bank1',
    answerSource: 'Paylater profile',
    group: 'static',
    id: 'paylater-static-002',
    question: 'Mohon sebutkan BANK 1 ID yang terkoneksi dengan Paylater.',
    sequence: 3,
  },
  {
    answer: 'Dimas@gmail.com',
    answerSource: 'CRM customer profile',
    group: 'static',
    id: 'paylater-static-003',
    question: 'Mohon sebutkan alamat email nasabah.',
    sequence: 4,
  },
  {
    answer: 'Dimas Abimanyu Prabowo',
    answerSource: 'KTP profile',
    group: 'static',
    id: 'paylater-static-004',
    question: 'Mohon sebutkan nama lengkap sesuai KTP.',
    sequence: 5,
  },
  {
    answer: 'Rp 12.000.000',
    answerSource: 'Paylater limit profile',
    group: 'dynamic',
    id: 'paylater-dynamic-001',
    question: 'Mohon sebutkan limit Paylater Anda.',
    sequence: 6,
  },
  {
    answer: 'Rp 680.000',
    answerSource: 'Paylater transaction history',
    group: 'dynamic',
    id: 'paylater-dynamic-002',
    question: 'Mohon sebutkan nominal transaksi Paylater terakhir.',
    sequence: 7,
  },
  {
    answer: 'Rp 725.000',
    answerSource: 'Paylater repayment history',
    group: 'dynamic',
    id: 'paylater-dynamic-003',
    question: 'Mohon sebutkan nominal pembayaran tagihan Paylater terakhir.',
    sequence: 8,
  },
]

export const verificationRules: VerificationRule[] = [
  {
    businessType: 'perbankan',
    channelType: 'phone',
    correctRequired: 5,
    id: 'phone-perbankan',
    maxWrongAttempts: 3,
    needLayering: false,
    notes: [
      'Mandatory question counts toward the total correct answer requirement.',
      'Wrong answers are counted across the whole verification session.',
      'Skip does not count as wrong and does not count as correct.',
    ],
    questions: perbankanQuestions,
    requiredGroups: {
      dynamic: 2,
      mandatory: 1,
      static: 2,
    },
    status: 'enabled',
    summary:
      '5 correct answers: 1 mandatory, 2 dynamic, and 2 static. Max wrong: 3.',
  },
  {
    businessType: 'perbankan',
    channelType: 'bankapp-registered',
    correctRequired: 3,
    id: 'bankapp-registered-perbankan',
    maxWrongAttempts: 3,
    needLayering: false,
    notes: [
      'Demo treats a successful 4-digit BankApp PIN as BankApp Registered.',
      'Customer confirmation is still needed for whether this reduction applies to other authenticated channels.',
    ],
    questions: perbankanQuestions,
    requiredGroups: {
      dynamic: 2,
      mandatory: 1,
    },
    status: 'enabled',
    summary:
      'BankApp Registered: 3 correct answers, including 1 mandatory and 2 dynamic. Max wrong: 3.',
  },
  {
    businessType: 'kartu-kredit',
    channelType: 'phone',
    correctRequired: 4,
    id: 'phone-kartu-kredit',
    maxWrongAttempts: 3,
    needLayering: true,
    notes: [
      'ATO and add-on scenarios may require 4 additional layering questions.',
      'Layering trigger is a customer-confirmation item for production.',
    ],
    questions: kartuKreditQuestions,
    requiredGroups: {
      mandatory: 1,
    },
    status: 'enabled',
    summary:
      '4 correct answers with mother maiden name as mandatory. Max wrong: 3.',
  },
  {
    businessType: 'kartu-kredit',
    channelType: 'bankapp-registered',
    correctRequired: 3,
    id: 'bankapp-registered-kartu-kredit',
    maxWrongAttempts: 3,
    needLayering: true,
    notes: [
      'Demo follows the customer document rule that BankApp Registered can pass with 3 correct answers.',
      'ATO and add-on layering remains available as visible reference questions.',
    ],
    questions: kartuKreditQuestions,
    requiredGroups: {
      mandatory: 1,
    },
    status: 'enabled',
    summary:
      'BankApp Registered: 3 correct answers with mother maiden name as mandatory. Max wrong: 3.',
  },
  {
    businessType: 'paylater',
    channelType: 'bankapp-registered',
    correctRequired: 3,
    id: 'bankapp-registered-paylater',
    maxWrongAttempts: 3,
    needLayering: false,
    notes: [
      'Demo follows the BankApp Registered banking threshold until BANK 1 confirms a Paylater-specific rule.',
      'The source document says Paylater may follow banking verification or internal Bank policy.',
    ],
    questions: paylaterQuestions,
    requiredGroups: {
      mandatory: 1,
      static: 2,
    },
    status: 'enabled',
    summary:
      'Demo default: 3 correct answers, including 1 mandatory and 2 static. Max wrong: 3.',
  },
]

export const verificationQuestions: VerificationQuestion[] =
  verificationRules[0].questions

export const customerJourney: CustomerJourneyItem[] = [
  {
    id: 'journey-011',
    channel: 'Phone',
    callRecordId: 'call-record-001',
    summary: 'Credit Card',
    result: 'Success',
    date: '30 Dec',
    communicationDetail:
      'Customer requested card activation status and delivery confirmation by phone.',
    summaryNotes: 'Customer was guided to the BankApp card activation menu.',
    resolutionResult: 'Card activation path confirmed.',
    followUpNotes: 'No follow-up required.',
    conversation: [],
  },
  {
    id: 'journey-012',
    channel: 'BankApp',
    callRecordId: 'call-record-021',
    summary: 'Mobile Banking',
    result: 'Success',
    date: '29 Dec',
    communicationDetail:
      'Customer requested help with BankApp transaction notifications.',
    summaryNotes: 'Notification settings were reviewed during the service.',
    resolutionResult: 'Transaction alert setting enabled.',
    followUpNotes: 'Customer confirmed the setting.',
    conversation: [],
  },
  {
    id: 'journey-013',
    channel: 'Webchat',
    callRecordId: 'call-record-023',
    summary: 'Branch Service',
    result: 'Failed',
    date: '28 Dec',
    communicationDetail:
      'Customer asked about branch operating hours through Webchat.',
    summaryNotes: 'The branch search path was shared before inactivity timeout.',
    resolutionResult: 'Session ended after customer inactivity.',
    followUpNotes: 'No follow-up required.',
    conversation: [],
  },
  {
    id: 'journey-001',
    channel: 'WhatsApp',
    callRecordId: 'call-record-026',
    summary: 'Card Unlock',
    result: 'Success',
    date: '24 Sep',
    communicationDetail:
      'Customer requested debit card unlock after a temporary fraud hold. Agent completed security checks and restored usage.',
    summaryNotes:
      'Customer confirmed recent transactions and asked to receive future fraud alerts through WhatsApp.',
    resolutionResult: 'Card unlock completed after account verification.',
    followUpNotes:
      'Monitor fraud alert delivery preference in the next statement cycle.',
    conversation: [
      {
        id: 'conv-001-1',
        sender: 'Customer',
        message: 'My debit card is blocked after I tried to pay at a store.',
        time: '09:12',
      },
      {
        id: 'conv-001-2',
        sender: 'Agent',
        message: 'I will verify your account and check the card status.',
        time: '09:13',
      },
      {
        id: 'conv-001-3',
        sender: 'Customer',
        message: 'Yes, the last transaction was mine.',
        time: '09:15',
      },
      {
        id: 'conv-001-4',
        sender: 'Agent',
        message: 'The card is now unlocked. Please retry the transaction.',
        time: '09:17',
      },
    ],
  },
  {
    id: 'journey-002',
    channel: 'Email',
    summary: 'Card Replacement',
    result: 'Failed',
    date: '13 Oct',
    communicationDetail:
      'Replacement card request was submitted by email, but proof of address was incomplete.',
    summaryNotes:
      'Follow-up email sent with required document list and branch appointment options.',
    resolutionResult: 'Request pending due to incomplete address document.',
    followUpNotes:
      'Customer should upload proof of address before branch card issuance.',
    conversation: [
      {
        id: 'conv-002-1',
        sender: 'Customer',
        message: 'I need a replacement card because my card is damaged.',
        time: '13:02',
      },
      {
        id: 'conv-002-2',
        sender: 'Agent',
        message: 'We received the request, but the address proof is missing.',
        time: '13:05',
      },
      {
        id: 'conv-002-3',
        sender: 'Customer',
        message: 'I will send the document today.',
        time: '13:08',
      },
    ],
  },
  {
    id: 'journey-003',
    channel: 'Instagram',
    summary: 'Credit Limit Inquiry',
    result: 'Success',
    date: '29 Oct',
    communicationDetail:
      'Customer asked about eligibility for a higher credit card limit through social messaging.',
    summaryNotes:
      'Agent explained eligibility criteria and directed customer to authenticated CRM flow.',
    resolutionResult: 'Eligibility information provided through secure flow.',
    followUpNotes:
      'Offer limit review once income document is submitted.',
    conversation: [
      {
        id: 'conv-003-1',
        sender: 'Customer',
        message: 'Can I increase my credit card limit this month?',
        time: '10:21',
      },
      {
        id: 'conv-003-2',
        sender: 'Agent',
        message: 'You may request a review after we verify recent income.',
        time: '10:23',
      },
      {
        id: 'conv-003-3',
        sender: 'Customer',
        message: 'Please send the secure submission link.',
        time: '10:24',
      },
    ],
  },
  {
    id: 'journey-004',
    channel: 'X',
    summary: 'Mobile Login Issue',
    result: 'Success',
    date: '03 Nov',
    communicationDetail:
      'Customer reported a blocked mobile banking login after multiple failed attempts.',
    summaryNotes:
      'Issue resolved after password reset and device verification guidance.',
    resolutionResult: 'Mobile login restored after password reset.',
    followUpNotes:
      'Remind customer not to share OTP or mobile banking credentials.',
    conversation: [
      {
        id: 'conv-004-1',
        sender: 'Customer',
        message: 'I cannot log in to mobile banking.',
        time: '16:42',
      },
      {
        id: 'conv-004-2',
        sender: 'Agent',
        message: 'Your login was locked after several failed attempts.',
        time: '16:44',
      },
      {
        id: 'conv-004-3',
        sender: 'Agent',
        message: 'Please complete the reset and confirm your device.',
        time: '16:48',
      },
    ],
  },
  {
    id: 'journey-005',
    channel: 'TikTok',
    summary: 'Promo Clarification',
    result: 'Success',
    date: '11 Nov',
    communicationDetail:
      'Customer asked about a campaign video mentioning installment benefits.',
    summaryNotes:
      'Agent confirmed campaign period and sent a CRM-backed product reference.',
    resolutionResult: 'Campaign terms explained and product reference sent.',
    followUpNotes:
      'No follow-up required unless customer submits installment request.',
    conversation: [
      {
        id: 'conv-005-1',
        sender: 'Customer',
        message: 'I saw a campaign about installment benefits.',
        time: '12:06',
      },
      {
        id: 'conv-005-2',
        sender: 'Agent',
        message: 'The campaign is active until the end of this month.',
        time: '12:08',
      },
      {
        id: 'conv-005-3',
        sender: 'Customer',
        message: 'Please send me the eligible product details.',
        time: '12:09',
      },
    ],
  },
  {
    id: 'journey-006',
    channel: 'WhatsApp',
    callRecordId: 'call-record-030',
    summary: 'Account Statement',
    result: 'Success',
    date: '19 Nov',
    communicationDetail:
      'Customer requested monthly statement delivery for savings account.',
    summaryNotes:
      'Statement delivery preference updated and customer notified of next cycle.',
    resolutionResult: 'Statement delivery preference updated successfully.',
    followUpNotes:
      'Customer will receive the next cycle statement by email.',
    conversation: [
      {
        id: 'conv-006-1',
        sender: 'Customer',
        message: 'Can my savings statement be sent to email every month?',
        time: '08:32',
      },
      {
        id: 'conv-006-2',
        sender: 'Agent',
        message: 'I can update your statement delivery preference now.',
        time: '08:33',
      },
      {
        id: 'conv-006-3',
        sender: 'Agent',
        message: 'The preference has been updated for the next cycle.',
        time: '08:36',
      },
    ],
  },
  {
    id: 'journey-007',
    channel: 'Email',
    summary: 'Mortgage Rate',
    result: 'Failed',
    date: '28 Nov',
    communicationDetail:
      'Customer requested a mortgage rate quote, but income details were not provided.',
    summaryNotes:
      'Agent sent a secure form link and suggested a branch consultation.',
    resolutionResult: 'Mortgage quote pending income information.',
    followUpNotes:
      'Schedule branch consultation after customer submits income details.',
    conversation: [
      {
        id: 'conv-007-1',
        sender: 'Customer',
        message: 'I want to know the current mortgage rate.',
        time: '14:18',
      },
      {
        id: 'conv-007-2',
        sender: 'Agent',
        message: 'We need income details to provide an accurate estimate.',
        time: '14:20',
      },
      {
        id: 'conv-007-3',
        sender: 'Customer',
        message: 'Please send me the secure form.',
        time: '14:23',
      },
    ],
  },
  {
    id: 'journey-008',
    channel: 'Instagram',
    summary: 'Branch Queue',
    result: 'Success',
    date: '05 Dec',
    communicationDetail:
      'Customer asked for queue availability at a nearby priority banking branch.',
    summaryNotes:
      'Agent shared appointment slots and customer selected afternoon visit.',
    resolutionResult: 'Branch appointment slot shared and selected.',
    followUpNotes:
      'Customer selected afternoon visit at priority banking branch.',
    conversation: [
      {
        id: 'conv-008-1',
        sender: 'Customer',
        message: 'Is there a priority queue available near my office?',
        time: '11:02',
      },
      {
        id: 'conv-008-2',
        sender: 'Agent',
        message: 'There are afternoon appointment slots available today.',
        time: '11:04',
      },
      {
        id: 'conv-008-3',
        sender: 'Customer',
        message: 'Please reserve the afternoon slot.',
        time: '11:05',
      },
    ],
  },
  {
    id: 'journey-009',
    channel: 'X',
    summary: 'Payment Dispute',
    result: 'Success',
    date: '14 Dec',
    communicationDetail:
      'Customer reported a merchant payment mismatch through public social channel.',
    summaryNotes:
      'Agent moved the case to secure messaging and opened a dispute review.',
    resolutionResult: 'Payment dispute review opened in secure channel.',
    followUpNotes:
      'Dispute team will update customer within two business days.',
    conversation: [
      {
        id: 'conv-009-1',
        sender: 'Customer',
        message: 'My merchant payment amount does not match the receipt.',
        time: '17:10',
      },
      {
        id: 'conv-009-2',
        sender: 'Agent',
        message: 'For security, I will move this case to secure messaging.',
        time: '17:12',
      },
      {
        id: 'conv-009-3',
        sender: 'Agent',
        message: 'A dispute review has been opened for this payment.',
        time: '17:17',
      },
    ],
  },
  {
    id: 'journey-010',
    channel: 'TikTok',
    summary: 'Card Benefits',
    result: 'Success',
    date: '22 Dec',
    communicationDetail:
      'Customer asked about travel benefits after seeing a short-form video campaign.',
    summaryNotes:
      'Agent shared eligible card benefits and next best product route.',
    resolutionResult: 'Travel benefit information shared with product route.',
    followUpNotes:
      'Recommend travel insurance bundle if customer confirms itinerary.',
    conversation: [
      {
        id: 'conv-010-1',
        sender: 'Customer',
        message: 'Does my card include travel benefits?',
        time: '15:28',
      },
      {
        id: 'conv-010-2',
        sender: 'Agent',
        message: 'Your card includes selected travel and lounge benefits.',
        time: '15:30',
      },
      {
        id: 'conv-010-3',
        sender: 'Customer',
        message: 'Please send the benefit summary.',
        time: '15:31',
      },
    ],
  },
]

export const ticketingHistory: TicketHistoryItem[] = [
  {
    caseCategory: 'REQ/R001 BLOKIR HILANG (LOST)',
    id: 'ticket-001',
    product: 'JASA/PASPOR BCA',
    ticketNumber: 'CRM000145',
    createdDate: '24 Sep',
  },
  {
    caseCategory: 'REQ/R005 GANTI KARTU/HILANG',
    id: 'ticket-002',
    product: 'KARTU KREDIT BCA/AMEX PLATINUM',
    ticketNumber: 'CRM000146',
    createdDate: '13 Oct',
  },
  {
    caseCategory:
      'REQ/R010 UBAH/DATA NASABAH/DATA KORESPONDENSI (NSBH GIRO,TAPRES,BCA DOLAR)',
    id: 'ticket-003',
    product: 'TABUNGAN/TAHAPAN',
    ticketNumber: 'CRM000147',
    createdDate: '29 Oct',
  },
  {
    caseCategory: 'REQ/R036 AKTIFKAN USER ID',
    id: 'ticket-004',
    product: 'JASA/MOBILE Perbankan BCA',
    ticketNumber: 'CRM000148',
    createdDate: '03 Nov',
  },
  {
    caseCategory: 'REQ/R019 PENGAKTIFAN PIN',
    id: 'ticket-005',
    product: 'JASA/PASPOR BCA',
    ticketNumber: 'CRM000149',
    createdDate: '11 Nov',
  },
  {
    caseCategory: 'COMPL/C004 MERASA TDK TRANSAKSI KRT KREDIT/RETAIL/HALOBCA',
    id: 'ticket-006',
    product: 'KARTU KREDIT BCA REGULER',
    ticketNumber: 'CRM000150',
    createdDate: '19 Nov',
  },
  {
    caseCategory: 'REQ/R005 GANTI KARTU/HILANG',
    id: 'ticket-007',
    product: 'KARTU KREDIT BCA/AMEX PLATINUM',
    ticketNumber: 'CRM000151',
    createdDate: '28 Nov',
  },
  {
    caseCategory: 'REQ/R009 NAIK LIMIT/SEMENTARA (BCNS)',
    id: 'ticket-008',
    product: 'KARTU KREDIT BCA REGULER',
    ticketNumber: 'CRM000152',
    createdDate: '05 Dec',
  },
  {
    caseCategory: 'INF/I68888 PRODUCT/KARTU KREDIT',
    id: 'ticket-009',
    product: 'LAIN-LAIN',
    ticketNumber: 'CRM000153',
    createdDate: '14 Dec',
  },
  {
    caseCategory:
      'REQ/R010 UBAH/DATA NASABAH/DATA KORESPONDENSI (NSBH GIRO,TAPRES,BCA DOLAR)',
    id: 'ticket-010',
    product: 'TABUNGAN/TAHAPAN',
    ticketNumber: 'CRM000154',
    createdDate: '22 Dec',
  },
]

export function lookupCustomerByCis(
  cisNumber: string,
): CustomerIdentityRefreshResult | null {
  if (cisNumber.trim() !== CRM_DEMO_CIS_NUMBER) {
    return null
  }

  return {
    customer: inboundCustomer,
    journey: customerJourney,
    tickets: ticketingHistory,
  }
}

export const nextBestActions: NextBestActionItem[] = [
  {
    id: 'nba-001',
    recommendedService: 'Aktivasi Kartu Kredit Mastercard',
    crmLink: '/crm/recommendations/mastercard-activation',
  },
  {
    id: 'nba-002',
    recommendedService: 'Pengajuan KPR',
    crmLink: '/crm/recommendations/mortgage-application',
  },
  {
    id: 'nba-003',
    recommendedService: 'Upgrade Limit',
    crmLink: '/crm/recommendations/priority-savings',
  },
  {
    id: 'nba-004',
    recommendedService: 'Aktivasi BANK 1 Mobile',
    crmLink: '/crm/recommendations/travel-insurance',
  },
]
