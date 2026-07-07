import type { CallRecord } from '../types'

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

function daysAgo(days: number, hour = 9, minute = 30) {
  const date = new Date()

  date.setDate(date.getDate() - days)
  date.setHours(hour, minute, 0, 0)

  return date.toISOString()
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

export function createDefaultCallRecords(): CallRecord[] {
  const recentVoiceStart = minutesAgo(48)
  const recentVideoStart = minutesAgo(132)
  const recentDmStart = minutesAgo(310)
  const recentWhatsappStart = minutesAgo(820)
  const dayOneVoiceStart = daysAgo(1, 10, 18)
  const dayTwoDmStart = daysAgo(2, 15, 42)
  const dayThreeVideoStart = daysAgo(3, 11, 8)
  const dayFourVoiceStart = daysAgo(4, 16, 24)
  const daySixDmStart = daysAgo(6, 14, 12)
  const oldVoiceStart = daysAgo(12, 9, 6)
  const oldDmStart = daysAgo(21, 13, 48)
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
