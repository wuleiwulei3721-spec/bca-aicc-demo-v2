import type { CallRecord } from '../types'

function daysAgo(days: number, hour = 9, minute = 30) {
  const date = new Date()

  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)

  return date.toISOString()
}

function todaySlot(index: number, totalSlots: number) {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now.getTime() - 15 * 60 * 1000)

  start.setHours(0, 5, 0, 0)

  if (end.getTime() <= start.getTime()) {
    start.setHours(0, Math.max(0, index), 0, 0)
    return start.toISOString()
  }

  const ratio = totalSlots <= 1 ? 1 : (totalSlots - 1 - index) / (totalSlots - 1)
  const timestamp = start.getTime() + (end.getTime() - start.getTime()) * ratio

  return new Date(timestamp).toISOString()
}

function addSeconds(isoDate: string, seconds: number) {
  return new Date(Date.parse(isoDate) + seconds * 1000).toISOString()
}

function createRecord(
  record: Omit<CallRecord, 'endedAt'> & {
    endedAt?: string
  },
): CallRecord {
  const endedAt = record.endedAt ?? addSeconds(record.startedAt, record.durationSeconds)

  return {
    ...record,
    endedAt,
  }
}

function createTranscript(
  recordId: string,
  customerText: string,
  agentText: string,
  systemText?: string,
): CallRecord['transcript'] {
  return [
    {
      id: `${recordId}-t1`,
      speaker: 'Customer',
      text: customerText,
      time: '00:18',
    },
    {
      id: `${recordId}-t2`,
      speaker: 'Agent',
      text: agentText,
      time: '01:02',
    },
    ...(systemText
      ? [
          {
            id: `${recordId}-t3`,
            speaker: 'System' as const,
            text: systemText,
            time: '05:20',
          },
        ]
      : []),
  ]
}

export function createDefaultCallRecords(): CallRecord[] {
  const todayStarts = Array.from({ length: 12 }, (_, index) =>
    todaySlot(index, 12),
  )
  const recentVoiceStart = todayStarts[0]
  const recentVideoStart = todayStarts[1]
  const recentDmStart = todayStarts[2]
  const recentWhatsappStart = todayStarts[3]
  const todayVoiceStartTwo = todayStarts[4]
  const todayVideoStartTwo = todayStarts[5]
  const todayBankAppDmStart = todayStarts[6]
  const todayWebchatStart = todayStarts[7]
  const todayPhoneStart = todayStarts[8]
  const todayWhatsAppStart = todayStarts[9]
  const todayVoiceStartThree = todayStarts[10]
  const todayDmStartTwo = todayStarts[11]
  const dayOneVoiceStart = daysAgo(1, 10, 18)
  const dayTwoDmStart = daysAgo(2, 15, 42)
  const dayThreeVideoStart = daysAgo(3, 11, 8)
  const dayFourVoiceStart = daysAgo(4, 16, 24)
  const dayFiveVideoStart = daysAgo(5, 9, 36)
  const daySixDmStart = daysAgo(6, 14, 12)
  const daySevenVoiceStart = daysAgo(7, 12, 24)
  const dayEightDmStart = daysAgo(8, 17, 30)
  const dayNineVideoStart = daysAgo(9, 8, 54)
  const dayTenVoiceStart = daysAgo(10, 13, 16)
  const dayElevenDmStart = daysAgo(11, 18, 22)
  const oldVoiceStart = daysAgo(12, 9, 6)
  const oldVideoStartTwo = daysAgo(15, 11, 42)
  const oldDmStartTwo = daysAgo(18, 16, 8)
  const oldDmStart = daysAgo(21, 13, 48)
  const oldVoiceStartTwo = daysAgo(28, 10, 34)
  const oldWhatsAppStart = daysAgo(32, 15, 12)
  const oldVideoStart = daysAgo(36, 17, 16)

  return [
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 811-4200-7712',
      customerId: '00000078410',
      customerName: 'Chessa Nur',
      durationSeconds: 436,
      endedBy: 'Agent',
      id: 'call-record-001',
      mediaType: 'Voice',
      queueName: 'Credit Card Activation',
      recordNo: 'CR202607070001',
      endReason: 'Normal',
      startedAt: recentVoiceStart,
      qmScore: 92,
      summary: {
        businessTypes: ['Credit Card'],
        description:
          'Customer requested card activation status and delivery confirmation. Verified customer identity, confirmed activation path, and advised customer to retry BankApp card menu.',
        ticketNo: 'TK-260707-001',
      },
      transcript: [
        {
          id: 'call-record-001-t1',
          speaker: 'System',
          text: 'Recording started. Speech-to-text transcript generated automatically.',
          time: '00:00',
        },
        {
          id: 'call-record-001-t2',
          speaker: 'Customer',
          text: 'I need help checking whether my new credit card is already active.',
          time: '00:24',
        },
        {
          id: 'call-record-001-t3',
          speaker: 'Agent',
          text: 'I will verify the card status and guide you through the secure activation menu.',
          time: '00:41',
        },
        {
          id: 'call-record-001-t4',
          speaker: 'Customer',
          text: 'The BankApp menu still asks me to confirm delivery.',
          time: '03:10',
        },
        {
          id: 'call-record-001-t5',
          speaker: 'Agent',
          text: 'The delivery confirmation is now updated. Please reopen the card activation menu.',
          time: '06:58',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00080217',
      customerId: '00080217',
      customerName: 'Lukman Hakim',
      durationSeconds: 675,
      endedBy: 'Agent',
      id: 'call-record-021',
      mediaType: 'Video',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202607050002',
      endReason: 'Normal',
      startedAt: dayFiveVideoStart,
      qmScore: 96,
      summary: {
        businessTypes: ['Mobile Banking'],
        description:
          'Customer needed support enabling transaction notification. Guided customer through BankApp notification settings.',
        ticketNo: 'TK-260705-002',
      },
      transcript: createTranscript(
        'call-record-021',
        'I do not receive BankApp transaction notifications.',
        'Please open notification settings and enable transaction alerts.',
        'Customer confirmed notification setting was enabled.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 817-4000-9821',
      customerId: '00055671',
      customerName: 'Ratna Wijaya',
      durationSeconds: 574,
      endedBy: 'Agent',
      id: 'call-record-022',
      mediaType: 'Voice',
      queueName: 'Credit Card Service',
      recordNo: 'CR202607030002',
      endReason: 'Normal',
      startedAt: daySevenVoiceStart,
      qmScore: 88,
      summary: {
        businessTypes: ['Credit Card'],
        description:
          'Customer requested billing cycle explanation. Explained due date, minimum payment, and statement cutoff.',
        ticketNo: 'TK-260703-002',
      },
      transcript: createTranscript(
        'call-record-022',
        'Can you explain why the card bill due date changed?',
        'The due date follows the statement cutoff. I will explain the billing cycle.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Webchat',
      contact: 'BankID 00090624',
      customerId: '00090624',
      customerName: 'Citra Larasati',
      durationSeconds: 805,
      endedBy: 'System',
      id: 'call-record-023',
      mediaType: 'DM',
      queueName: 'General Service',
      recordNo: 'CR202607020001',
      endReason: 'Customer Timeout',
      startedAt: dayEightDmStart,
      qmScore: null,
      summary: {
        businessTypes: ['Branch Service'],
        description:
          'Customer asked about branch operating hours. Shared branch search path before the session timed out.',
        ticketNo: 'TK-260702-001',
      },
      transcript: createTranscript(
        'call-record-023',
        'What time does the nearest branch close today?',
        'Please use Branch Locator. I can also help check by city name.',
        'Conversation closed after customer inactivity.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00074420',
      customerId: '00074420',
      customerName: 'Bayu Prakoso',
      durationSeconds: 932,
      endedBy: 'Agent',
      id: 'call-record-024',
      mediaType: 'Video',
      queueName: 'Priority Service',
      recordNo: 'CR202607010002',
      endReason: 'Problem Teknis',
      startedAt: dayNineVideoStart,
      qmScore: 81,
      summary: {
        businessTypes: ['Investment'],
        description:
          'Customer screen was frozen during portfolio review. Agent documented technical issue and shared relationship manager route.',
        ticketNo: 'TK-260701-002',
      },
      transcript: createTranscript(
        'call-record-024',
        'The investment screen is frozen during the call.',
        'I will record the technical issue and provide the relationship manager contact path.',
        'Agent selected abnormal end reason Problem Teknis.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00061249',
      customerId: '00061249',
      customerName: 'Aldo Kurnia',
      durationSeconds: 469,
      endedBy: 'Customer',
      id: 'call-record-025',
      mediaType: 'Voice',
      queueName: 'Loan Service',
      recordNo: 'CR202606300001',
      endReason: 'Normal',
      startedAt: dayTenVoiceStart,
      qmScore: 90,
      summary: {
        businessTypes: ['Loan'],
        description:
          'Customer asked about car loan installment proof. Explained statement download and email request option.',
        ticketNo: 'TK-260630-001',
      },
      transcript: createTranscript(
        'call-record-025',
        'I need proof of my car loan installment.',
        'You can download the repayment statement or request an email copy.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'WhatsApp',
      contact: '+62 812-7004-1883',
      customerId: '00047593',
      customerName: 'Nina Safitri',
      durationSeconds: 612,
      endedBy: 'Agent',
      id: 'call-record-026',
      mediaType: 'DM',
      queueName: 'Card Service',
      recordNo: 'CR202606290001',
      endReason: 'Normal',
      startedAt: dayElevenDmStart,
      qmScore: 92,
      summary: {
        businessTypes: ['Debit Card'],
        description:
          'Customer requested debit card delivery tracking. Shared delivery tracking path and expected delivery date.',
        ticketNo: 'TK-260629-001',
      },
      transcript: createTranscript(
        'call-record-026',
        'Can I track my debit card delivery from WhatsApp?',
        'The tracking detail is available in BankApp Cards under replacement card.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00035812',
      customerId: '00035812',
      customerName: 'Gita Wulandari',
      durationSeconds: 718,
      endedBy: 'System',
      id: 'call-record-027',
      mediaType: 'Video',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202606260001',
      endReason: 'Channel Gateway Error',
      startedAt: oldVideoStartTwo,
      qmScore: null,
      summary: {
        businessTypes: ['BankApp'],
        description:
          'Customer attempted video support for BankApp login issue. Session ended due to channel gateway error.',
        ticketNo: 'TK-260626-001',
      },
      transcript: createTranscript(
        'call-record-027',
        'The video support page keeps reconnecting.',
        'I will keep the case note and ask you to retry from BankApp after reconnecting.',
        'System ended service due to channel gateway error.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Webchat',
      contact: 'guest-8451',
      customerId: '-',
      customerName: 'Guest Customer',
      durationSeconds: 384,
      endedBy: 'Customer',
      id: 'call-record-028',
      mediaType: 'DM',
      queueName: '',
      recordNo: 'CR202606230001',
      endReason: 'Normal',
      startedAt: oldDmStartTwo,
      qmScore: 85,
      summary: {
        businessTypes: ['Others'],
        description:
          'Guest customer asked about account opening requirements. Shared document checklist and branch appointment path.',
        ticketNo: 'TK-260623-001',
      },
      transcript: createTranscript(
        'call-record-028',
        'What documents do I need for account opening?',
        'Please prepare ID, tax number if available, and appointment confirmation.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 811-9200-7144',
      customerId: '00081945',
      customerName: 'Fauzan Ibrahim',
      durationSeconds: 1041,
      endedBy: 'Agent',
      id: 'call-record-029',
      mediaType: 'Voice',
      queueName: 'Fraud Support',
      recordNo: 'CR202606090001',
      endReason: 'Normal',
      startedAt: oldVoiceStartTwo,
      qmScore: 97,
      summary: {
        businessTypes: ['Dispute', 'Credit Card'],
        description:
          'Customer reported unknown online card transaction. Blocked card and created dispute review ticket.',
        ticketNo: 'TK-260609-001',
      },
      transcript: createTranscript(
        'call-record-029',
        'There is an online transaction that I did not authorize.',
        'I will block the card and create a dispute review ticket.',
        'Dispute review ticket created.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'WhatsApp',
      contact: '+62 812-1019-3044',
      customerId: '00077116',
      customerName: 'Hana Prameswari',
      durationSeconds: 548,
      endedBy: 'Agent',
      id: 'call-record-030',
      mediaType: 'DM',
      queueName: 'General Service',
      recordNo: 'CR202606050001',
      endReason: 'Nasabah Tidak Ada Respons Lebih Lanjut',
      startedAt: oldWhatsAppStart,
      qmScore: 78,
      summary: {
        businessTypes: ['Account Service'],
        description:
          'Customer asked about dormant account reactivation but stopped responding after receiving the reactivation checklist.',
        ticketNo: 'TK-260605-001',
      },
      transcript: createTranscript(
        'call-record-030',
        'How can I reactivate a dormant account?',
        'Please visit a branch with ID and account ownership document for reactivation.',
        'Agent selected no further response abnormal end reason.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 811-8890-4412',
      customerId: '00054218',
      customerName: 'Tara Oktaviani',
      durationSeconds: 386,
      endedBy: 'System',
      id: 'call-record-013',
      mediaType: 'Voice',
      queueName: 'General Service',
      recordNo: 'CR202607100005',
      endReason: 'Connection Lost',
      startedAt: todayPhoneStart,
      qmScore: null,
      summary: {
        businessTypes: ['Account Service'],
        description:
          'Customer asked about account statement delivery. Explained statement cycle and advised customer to retry after service restoration.',
        ticketNo: 'TK-260710-005',
      },
      transcript: createTranscript(
        'call-record-013',
        'My statement is not available in the app yet.',
        'I will check the statement cycle and confirm when it should appear.',
        'Voice call disconnected by system connection loss.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00088431',
      customerId: '00088431',
      customerName: 'Indra Saputra',
      durationSeconds: 762,
      endedBy: 'Agent',
      id: 'call-record-014',
      mediaType: 'Video',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202607100006',
      endReason: 'Normal',
      startedAt: todayVideoStartTwo,
      qmScore: 93,
      summary: {
        businessTypes: ['Mobile Banking', 'Account Service'],
        description:
          'Customer needed help with biometric login reset. Reviewed shared screen and guided customer to reset biometric access.',
        ticketNo: 'TK-260710-006',
      },
      transcript: createTranscript(
        'call-record-014',
        'The biometric login setting keeps failing.',
        'Please share your screen and open Security Settings so I can guide you.',
        'Customer completed biometric reset.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00071204',
      customerId: '00071204',
      customerName: 'Vina Maharani',
      durationSeconds: 624,
      endedBy: 'Customer',
      id: 'call-record-015',
      mediaType: 'DM',
      queueName: 'Card Service',
      recordNo: 'CR202607100007',
      endReason: 'Normal',
      startedAt: todayBankAppDmStart,
      qmScore: 89,
      summary: {
        businessTypes: ['Debit Card'],
        description:
          'Customer asked how to replace a damaged debit card. Shared replacement steps and branch pickup options.',
        ticketNo: 'TK-260710-007',
      },
      transcript: createTranscript(
        'call-record-015',
        'My debit card is damaged. Can I request a replacement?',
        'Yes. You can request replacement from Cards, then choose pickup or delivery.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Webchat',
      contact: 'guest-2049',
      customerId: '-',
      customerName: 'Guest Customer',
      durationSeconds: 438,
      endedBy: 'Agent',
      id: 'call-record-016',
      mediaType: 'DM',
      queueName: '',
      recordNo: 'CR202607100008',
      endReason: 'Problem Teknis',
      startedAt: todayWebchatStart,
      qmScore: 82,
      summary: {
        businessTypes: ['Others'],
        description:
          'Guest customer reported webchat page refresh issue. Advised browser refresh and provided contact center callback option.',
        ticketNo: 'TK-260710-008',
      },
      transcript: createTranscript(
        'call-record-016',
        'The webchat page keeps refreshing when I type.',
        'Please refresh once and keep this ticket number if the issue repeats.',
        'Agent selected abnormal end reason Problem Teknis.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'WhatsApp',
      contact: '+62 813-1100-7822',
      customerId: '00090133',
      customerName: 'Yusuf Ananda',
      durationSeconds: 708,
      endedBy: 'System',
      id: 'call-record-017',
      mediaType: 'DM',
      queueName: 'Priority Service',
      recordNo: 'CR202607100009',
      endReason: 'Customer Timeout',
      startedAt: todayWhatsAppStart,
      qmScore: null,
      summary: {
        businessTypes: ['Priority Banking'],
        description:
          'Customer asked about priority lounge eligibility. Shared eligibility checklist before session timed out.',
        ticketNo: 'TK-260710-009',
      },
      transcript: createTranscript(
        'call-record-017',
        'Do I still have priority lounge access this month?',
        'I will check the eligibility criteria and share the current checklist.',
        'Conversation closed after customer timeout.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00049318',
      customerId: '00049318',
      customerName: 'Melati Santoso',
      durationSeconds: 552,
      endedBy: 'Agent',
      id: 'call-record-018',
      mediaType: 'Voice',
      queueName: 'Paylater Service',
      recordNo: 'CR202607100010',
      endReason: 'Normal',
      startedAt: todayVoiceStartTwo,
      qmScore: 91,
      summary: {
        businessTypes: ['Paylater'],
        description:
          'Customer requested repayment amount clarification. Confirmed outstanding amount and explained payment schedule.',
        ticketNo: 'TK-260710-010',
      },
      transcript: createTranscript(
        'call-record-018',
        'I want to confirm the Paylater amount due this week.',
        'The outstanding amount is visible under Paylater repayment schedule.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 815-6400-2219',
      customerId: '00067804',
      customerName: 'Agus Permana',
      durationSeconds: 842,
      endedBy: 'Agent',
      id: 'call-record-019',
      mediaType: 'Voice',
      queueName: 'Fraud Support',
      recordNo: 'CR202607100011',
      endReason: 'Hening & Tidak Ada Respons',
      startedAt: todayVoiceStartThree,
      qmScore: 76,
      summary: {
        businessTypes: ['Dispute', 'Debit Card'],
        description:
          'Customer initially reported suspicious cash withdrawal, then stopped responding. Agent documented the risk and opened follow-up task.',
        ticketNo: 'TK-260710-011',
      },
      transcript: createTranscript(
        'call-record-019',
        'I do not recognize a cash withdrawal from this morning.',
        'I can help secure the card first and document a dispute follow-up.',
        'Agent selected no-response abnormal end reason.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00031560',
      customerId: '00031560',
      customerName: 'Reno Mahardika',
      durationSeconds: 498,
      endedBy: 'Customer',
      id: 'call-record-020',
      mediaType: 'DM',
      queueName: 'Loan Service',
      recordNo: 'CR202607100012',
      endReason: 'Normal',
      startedAt: todayDmStartTwo,
      qmScore: 87,
      summary: {
        businessTypes: ['Loan'],
        description:
          'Customer asked about personal loan application document status. Shared pending document list and upload path.',
        ticketNo: 'TK-260710-012',
      },
      transcript: createTranscript(
        'call-record-020',
        'Which document is still pending for my personal loan application?',
        'The proof of income is pending. Please upload it through the application detail page.',
      ),
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00012345',
      customerId: '00012345',
      customerName: 'Dimas Satria',
      durationSeconds: 698,
      endedBy: 'Agent',
      id: 'call-record-002',
      mediaType: 'Video',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202607070002',
      endReason: 'Problem Teknis',
      startedAt: recentVideoStart,
      qmScore: 88,
      summary: {
        businessTypes: ['Mobile Banking'],
        description:
          'Customer could not complete device binding during BankApp login. Reviewed shared screen, confirmed device binding step, and advised customer to remove old device registration.',
        ticketNo: 'TK-260707-002',
      },
      transcript: [
        {
          id: 'call-record-002-t1',
          speaker: 'System',
          text: 'Video replay available. Audio transcript generated automatically.',
          time: '00:00',
        },
        {
          id: 'call-record-002-t2',
          speaker: 'Customer',
          text: 'The app keeps asking me to bind the device again.',
          time: '00:36',
        },
        {
          id: 'call-record-002-t3',
          speaker: 'Agent',
          text: 'Please share the screen so I can check which device binding step is blocked.',
          time: '01:05',
        },
        {
          id: 'call-record-002-t4',
          speaker: 'System',
          text: 'Customer started desktop sharing.',
          time: '01:48',
        },
        {
          id: 'call-record-002-t5',
          speaker: 'Agent',
          text: 'I can see the old device registration. Remove it first, then continue the binding flow.',
          time: '08:22',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Webchat',
      contact: 'guest-7118',
      customerId: '-',
      customerName: 'Ayu Lestari',
      durationSeconds: 884,
      endedBy: 'Customer',
      id: 'call-record-003',
      mediaType: 'DM',
      queueName: '',
      recordNo: 'CR202607070003',
      endReason: 'Normal',
      startedAt: recentDmStart,
      qmScore: 95,
      summary: {
        businessTypes: ['Account Service'],
        description:
          'Guest customer asked how to update statement delivery preference. Explained secure channel requirement and sent the customer to BankApp profile settings.',
        ticketNo: 'TK-260707-003',
      },
      transcript: [
        {
          id: 'call-record-003-t1',
          speaker: 'System',
          text: 'Webchat conversation started from public web channel.',
          time: '00:00',
        },
        {
          id: 'call-record-003-t2',
          speaker: 'Customer',
          text: 'Can I change my monthly statement to email only?',
          time: '00:22',
        },
        {
          id: 'call-record-003-t3',
          speaker: 'Agent',
          text: 'Yes. For security, please update it from BankApp after login.',
          time: '01:03',
        },
        {
          id: 'call-record-003-t4',
          speaker: 'Customer',
          text: 'Thanks, I will try from the app.',
          time: '13:42',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'WhatsApp',
      contact: '+62 812-4500-2291',
      customerId: '00000811220',
      customerName: 'Rizky Pratama',
      durationSeconds: 512,
      endedBy: 'Agent',
      id: 'call-record-004',
      mediaType: 'DM',
      queueName: 'Card Service',
      recordNo: 'CR202607070004',
      endReason: 'Normal',
      startedAt: recentWhatsappStart,
      qmScore: 90,
      summary: {
        businessTypes: ['Debit Card'],
        description:
          'Customer asked why ATM cash withdrawal was rejected. Confirmed daily withdrawal limit was reached and shared next available withdrawal time.',
        ticketNo: 'TK-260707-004',
      },
      transcript: [
        {
          id: 'call-record-004-t1',
          speaker: 'Customer',
          text: 'My ATM withdrawal was rejected. Is my card blocked?',
          time: '00:14',
        },
        {
          id: 'call-record-004-t2',
          speaker: 'Agent',
          text: 'Your card is active. I am checking recent transaction limits.',
          time: '00:48',
        },
        {
          id: 'call-record-004-t3',
          speaker: 'Agent',
          text: 'The withdrawal was declined because the daily limit was reached.',
          time: '05:55',
        },
        {
          id: 'call-record-004-t4',
          speaker: 'Customer',
          text: 'Understood. I will wait until tomorrow.',
          time: '08:16',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00034520',
      customerId: '00034520',
      customerName: 'Maya Surya',
      durationSeconds: 341,
      endedBy: 'Agent',
      id: 'call-record-005',
      mediaType: 'Voice',
      queueName: 'Loan Service',
      recordNo: 'CR202607060001',
      endReason: 'Normal',
      startedAt: dayOneVoiceStart,
      qmScore: 86,
      summary: {
        businessTypes: ['Loan'],
        description:
          'Customer requested mortgage repayment schedule explanation. Explained installment schedule and transferred to loan specialist for rate simulation.',
        ticketNo: 'TK-260706-001',
      },
      transcript: [
        {
          id: 'call-record-005-t1',
          speaker: 'Customer',
          text: 'I want to understand my mortgage repayment schedule.',
          time: '00:18',
        },
        {
          id: 'call-record-005-t2',
          speaker: 'Agent',
          text: 'I can explain the current schedule and transfer you for a rate simulation.',
          time: '00:52',
        },
        {
          id: 'call-record-005-t3',
          speaker: 'System',
          text: 'Call transferred to Loan Service Specialist.',
          time: '05:41',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00072964',
      customerId: '00072964',
      customerName: 'Nadia Putri',
      durationSeconds: 1048,
      endedBy: 'System',
      id: 'call-record-006',
      mediaType: 'DM',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202607050001',
      endReason: 'Customer Timeout',
      startedAt: dayTwoDmStart,
      qmScore: null,
      summary: {
        businessTypes: ['BankApp', 'Debit Card'],
        description:
          'Customer could not find card delivery tracking menu. Sent navigation guidance and confirmed customer found the delivery tracking page.',
        ticketNo: 'TK-260705-001',
      },
      transcript: [
        {
          id: 'call-record-006-t1',
          speaker: 'Customer',
          text: 'Where can I track my replacement card?',
          time: '00:11',
        },
        {
          id: 'call-record-006-t2',
          speaker: 'Agent',
          text: 'Open Cards, choose Replacement Card, then Delivery Tracking.',
          time: '01:06',
        },
        {
          id: 'call-record-006-t3',
          speaker: 'Customer',
          text: 'Found it. Thank you.',
          time: '17:28',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00067412',
      customerId: '00067412',
      customerName: 'Fajar Nugroho',
      durationSeconds: 742,
      endedBy: 'Customer',
      id: 'call-record-007',
      mediaType: 'Video',
      queueName: 'Priority Service',
      recordNo: 'CR202607040001',
      endReason: 'Normal',
      startedAt: dayThreeVideoStart,
      qmScore: 94,
      summary: {
        businessTypes: ['Priority Banking', 'Investment'],
        description:
          'Customer needed help reading investment portfolio dashboard. Explained portfolio dashboard sections and advised customer to contact relationship manager for product decision.',
        ticketNo: 'TK-260704-001',
      },
      transcript: [
        {
          id: 'call-record-007-t1',
          speaker: 'System',
          text: 'Video replay available. Customer shared BankApp screen.',
          time: '00:00',
        },
        {
          id: 'call-record-007-t2',
          speaker: 'Customer',
          text: 'Can you explain what this portfolio screen means?',
          time: '00:47',
        },
        {
          id: 'call-record-007-t3',
          speaker: 'Agent',
          text: 'I can explain the dashboard layout, but investment decisions should be discussed with your relationship manager.',
          time: '02:16',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 815-7700-3419',
      customerId: '00013220',
      customerName: 'Sinta Dewi',
      durationSeconds: 617,
      endedBy: 'Agent',
      id: 'call-record-008',
      mediaType: 'Voice',
      queueName: 'Fraud Support',
      recordNo: 'CR202607030001',
      endReason: 'Hening & Tidak Ada Respons',
      startedAt: dayFourVoiceStart,
      qmScore: 79,
      summary: {
        businessTypes: ['Dispute', 'Credit Card'],
        description:
          'Customer reported suspicious card transaction. Guided customer through blocking path and opened dispute review ticket.',
        ticketNo: 'TK-260703-001',
      },
      transcript: [
        {
          id: 'call-record-008-t1',
          speaker: 'Customer',
          text: 'I saw a transaction that I did not make.',
          time: '00:30',
        },
        {
          id: 'call-record-008-t2',
          speaker: 'Agent',
          text: 'I will help block the card first and then open a dispute review.',
          time: '00:59',
        },
        {
          id: 'call-record-008-t3',
          speaker: 'System',
          text: 'Dispute review ticket created.',
          time: '10:17',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Webchat',
      contact: 'BankID 00044092',
      customerId: '00044092',
      customerName: 'Kevin Halim',
      durationSeconds: 489,
      endedBy: 'Agent',
      id: 'call-record-009',
      mediaType: 'DM',
      queueName: 'General Service',
      recordNo: 'CR202607010001',
      endReason: 'Normal',
      startedAt: daySixDmStart,
      qmScore: 91,
      summary: {
        businessTypes: ['Branch Service'],
        description:
          'Customer requested branch appointment information. Shared branch appointment guidance and confirmed the customer selected a slot.',
        ticketNo: 'TK-260701-001',
      },
      transcript: [
        {
          id: 'call-record-009-t1',
          speaker: 'Customer',
          text: 'Can I book a branch visit for account document update?',
          time: '00:18',
        },
        {
          id: 'call-record-009-t2',
          speaker: 'Agent',
          text: 'Yes, I will share the appointment steps and required documents.',
          time: '00:51',
        },
        {
          id: 'call-record-009-t3',
          speaker: 'Customer',
          text: 'I selected tomorrow morning. Thank you.',
          time: '08:09',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'Phone',
      contact: '+62 811-3300-8890',
      customerId: '00022185',
      customerName: 'Arif Wijaya',
      durationSeconds: 394,
      endedBy: 'System',
      id: 'call-record-010',
      mediaType: 'Voice',
      queueName: 'Paylater Service',
      recordNo: 'CR202606250001',
      endReason: 'Connection Lost',
      startedAt: oldVoiceStart,
      qmScore: null,
      summary: {
        businessTypes: ['Paylater'],
        description:
          'Customer asked about Paylater repayment due date. Confirmed due date and explained repayment menu in BankApp.',
        ticketNo: 'TK-260625-001',
      },
      transcript: [
        {
          id: 'call-record-010-t1',
          speaker: 'Customer',
          text: 'When is my Paylater repayment due?',
          time: '00:27',
        },
        {
          id: 'call-record-010-t2',
          speaker: 'Agent',
          text: 'Your due date is visible in the Paylater repayment menu.',
          time: '01:18',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'WhatsApp',
      contact: '+62 812-6011-7788',
      customerId: '00066812',
      customerName: 'Lina Hartono',
      durationSeconds: 936,
      endedBy: 'Customer',
      id: 'call-record-011',
      mediaType: 'DM',
      queueName: 'Credit Card Service',
      recordNo: 'CR202606160001',
      endReason: 'Normal',
      startedAt: oldDmStart,
      qmScore: 84,
      summary: {
        businessTypes: ['Credit Card'],
        description:
          'Customer requested annual fee information. Shared annual fee policy and advised customer to review current promotion eligibility.',
        ticketNo: 'TK-260616-001',
      },
      transcript: [
        {
          id: 'call-record-011-t1',
          speaker: 'Customer',
          text: 'Can you explain my annual fee?',
          time: '00:09',
        },
        {
          id: 'call-record-011-t2',
          speaker: 'Agent',
          text: 'I can explain the fee and promotion eligibility rules.',
          time: '00:46',
        },
      ],
    }),
    createRecord({
      agentId: '10027',
      agentName: 'Budi Kartika',
      channel: 'BankApp',
      contact: 'BankID 00056194',
      customerId: '00056194',
      customerName: 'Putra Mahendra',
      durationSeconds: 1124,
      endedBy: 'System',
      id: 'call-record-012',
      mediaType: 'Video',
      queueName: 'Digital Banking Support',
      recordNo: 'CR202606010001',
      endReason: 'System Error',
      startedAt: oldVideoStart,
      qmScore: null,
      summary: {
        businessTypes: ['BankApp', 'Account Service'],
        description:
          'Customer could not find e-statement download page. Guided customer through shared screen and confirmed e-statement download succeeded.',
        ticketNo: 'TK-260601-001',
      },
      transcript: [
        {
          id: 'call-record-012-t1',
          speaker: 'System',
          text: 'Video replay available. Customer shared BankApp screen.',
          time: '00:00',
        },
        {
          id: 'call-record-012-t2',
          speaker: 'Customer',
          text: 'I cannot find the e-statement download button.',
          time: '00:33',
        },
        {
          id: 'call-record-012-t3',
          speaker: 'Agent',
          text: 'Please open Account Detail, then choose Statement and Download.',
          time: '02:01',
        },
      ],
    }),
  ]
}
