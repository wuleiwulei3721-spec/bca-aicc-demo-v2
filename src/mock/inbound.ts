import type {
  CallFlowDetail,
  CustomerInformation,
  CustomerJourneyItem,
  NextBestActionItem,
  QuickActionItem,
  TicketHistoryItem,
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
    phoneNumber: '087825100234',
    email: 'Dimas@gmail.com',
    cisNumber: '00000078987',
    customerType: 'Priority Customer',
  },
  verificationStatus: 'Unverified',
}

export const callFlowDetail: CallFlowDetail = {
  ivrDuration: '02:35',
  ivrJourney: [
    {
      id: 'ivr-001',
      nodeName: 'Phone',
      actionTime: '14:18:02',
    },
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
      nodeName: 'Limit Adjustment',
      actionTime: '14:19:06',
    },
    {
      id: 'ivr-005',
      nodeName: 'Transfer to Agent',
      actionTime: '14:19:30',
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

export const verificationQuestions: VerificationQuestion[] = [
  {
    id: 'verify-001',
    question: "What is your mother's last name?",
    answer: 'Santoso',
  },
  {
    id: 'verify-002',
    question: 'What is your registered place of birth?',
    answer: 'Jakarta',
  },
  {
    id: 'verify-003',
    question: 'What is the last four digits of your primary savings account?',
    answer: '8987',
  },
  {
    id: 'verify-004',
    question: 'What is your registered billing postal code?',
    answer: '12190',
  },
  {
    id: 'verify-005',
    question: 'Which branch opened your customer profile?',
    answer: 'BCA Sudirman Main Branch',
  },
  {
    id: 'verify-006',
    question: 'What is your latest card transaction merchant category?',
    answer: 'Supermarket',
  },
  {
    id: 'verify-007',
    question: 'What is the mobile number registered for banking alerts?',
    answer: '087825100234',
  },
  {
    id: 'verify-008',
    question: 'What is the email address registered in CRM?',
    answer: 'Dimas@gmail.com',
  },
  {
    id: 'verify-009',
    question: 'What is your customer segment in CRM?',
    answer: 'Priority Customer',
  },
  {
    id: 'verify-010',
    question: 'What is your last successful service request type?',
    answer: 'Card Unlock',
  },
]

export const customerJourney: CustomerJourneyItem[] = [
  {
    id: 'journey-001',
    channel: 'WhatsApp',
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
    id: 'ticket-001',
    ticketType: 'Debit Card Block',
    ticketNumber: 'CRM000145',
    createdDate: '24 Sep',
  },
  {
    id: 'ticket-002',
    ticketType: 'Lost Card Report',
    ticketNumber: 'CRM000146',
    createdDate: '13 Oct',
  },
  {
    id: 'ticket-003',
    ticketType: 'Customer Data Correction',
    ticketNumber: 'CRM000147',
    createdDate: '29 Oct',
  },
  {
    id: 'ticket-004',
    ticketType: 'Mobile Banking Activation',
    ticketNumber: 'CRM000148',
    createdDate: '03 Nov',
  },
  {
    id: 'ticket-005',
    ticketType: 'Card PIN Reset',
    ticketNumber: 'CRM000149',
    createdDate: '11 Nov',
  },
  {
    id: 'ticket-006',
    ticketType: 'Transaction Cancellation',
    ticketNumber: 'CRM000150',
    createdDate: '19 Nov',
  },
  {
    id: 'ticket-007',
    ticketType: 'Card Replacement',
    ticketNumber: 'CRM000151',
    createdDate: '28 Nov',
  },
  {
    id: 'ticket-008',
    ticketType: 'Limit Increase',
    ticketNumber: 'CRM000152',
    createdDate: '05 Dec',
  },
  {
    id: 'ticket-009',
    ticketType: 'Promotion Claim',
    ticketNumber: 'CRM000153',
    createdDate: '14 Dec',
  },
  {
    id: 'ticket-010',
    ticketType: 'Address Update',
    ticketNumber: 'CRM000154',
    createdDate: '22 Dec',
  },
]

export const nextBestActions: NextBestActionItem[] = [
  {
    id: 'nba-001',
    recommendedService: 'Mastercard Credit Card Activation',
    createdDate: '22 Dec',
    crmLink: '/crm/recommendations/mastercard-activation',
  },
  {
    id: 'nba-002',
    recommendedService: 'Mortgage Application',
    createdDate: '14 Dec',
    crmLink: '/crm/recommendations/mortgage-application',
  },
  {
    id: 'nba-003',
    recommendedService: 'Priority Savings Review',
    createdDate: '05 Dec',
    crmLink: '/crm/recommendations/priority-savings',
  },
  {
    id: 'nba-004',
    recommendedService: 'Travel Insurance Bundle',
    createdDate: '28 Nov',
    crmLink: '/crm/recommendations/travel-insurance',
  },
]

export const quickActions: QuickActionItem[] = [
  {
    id: 'quick-001',
    label: 'Unblock ABC ID',
    crmLink: '/crm/quick-actions/unblock-abc-id',
  },
  {
    id: 'quick-002',
    label: 'Two Questions',
    crmLink: '/crm/quick-actions/two-questions',
  },
  {
    id: 'quick-003',
    label: 'Card Replacement',
    crmLink: '/crm/quick-actions/card-replacement',
  },
  {
    id: 'quick-004',
    label: 'Five Questions',
    crmLink: '/crm/quick-actions/five-questions',
  },
  {
    id: 'quick-005',
    label: 'Card Replacement Guide',
    crmLink: '/crm/quick-actions/card-replacement-guide',
  },
]
