import type { InternalChatSession } from '../types'

export const internalChatSessions: InternalChatSession[] = [
  {
    id: 'chat-001',
    agentName: 'Siti Rahmawati',
    employeeId: 'AICC1024',
    department: 'Priority Banking',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    latestMessage: 'I can take the escalation after verification.',
    latestMessageTime: '10:42',
    latestMessageTimestamp: 1759824120,
    unreadCount: 3,
    messages: [
      {
        id: 'msg-001',
        sender: 'agent',
        content: 'Do you need supervisor support for this card case?',
        time: '10:38',
      },
      {
        id: 'msg-002',
        sender: 'self',
        content: 'Yes, customer is asking for limit exception details.',
        time: '10:39',
      },
      {
        id: 'msg-003',
        sender: 'agent',
        content: 'I can take the escalation after verification.',
        time: '10:42',
      },
    ],
  },
  {
    id: 'chat-002',
    agentName: 'Rangga Aditya',
    employeeId: 'AICC1088',
    department: 'Card Service',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    latestMessage: 'Use the replacement route in CRM if the card is damaged.',
    latestMessageTime: '10:29',
    latestMessageTimestamp: 1759823340,
    unreadCount: 1,
    messages: [
      {
        id: 'msg-004',
        sender: 'self',
        content: 'Can you confirm the card replacement path?',
        time: '10:26',
      },
      {
        id: 'msg-005',
        sender: 'agent',
        content: 'Use the replacement route in CRM if the card is damaged.',
        time: '10:29',
      },
    ],
  },
  {
    id: 'chat-003',
    agentName: 'Maya Anggraini',
    employeeId: 'AICC1142',
    department: 'Loan Service',
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    latestMessage: 'KPR eligibility matrix is updated in the knowledge base.',
    latestMessageTime: '09:54',
    latestMessageTimestamp: 1759820040,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-006',
        sender: 'agent',
        content: 'KPR eligibility matrix is updated in the knowledge base.',
        time: '09:54',
      },
      {
        id: 'msg-007',
        sender: 'self',
        content: 'Thanks, I will use the updated version.',
        time: '09:55',
      },
    ],
  },
  {
    id: 'chat-004',
    agentName: 'Arif Prasetyo',
    employeeId: 'AICC1167',
    department: 'Digital Banking',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    latestMessage: 'Haloapps voice callback is stable now.',
    latestMessageTime: '09:12',
    latestMessageTimestamp: 1759817520,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-008',
        sender: 'self',
        content: 'Any issue with Haloapps voice callback today?',
        time: '09:10',
      },
      {
        id: 'msg-009',
        sender: 'agent',
        content: 'Haloapps voice callback is stable now.',
        time: '09:12',
      },
    ],
  },
]
