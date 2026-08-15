import type { ServiceEndedBy } from './sessionEndReason'

export type CallRecordChannel = 'Phone' | 'BankApp' | 'Webchat' | 'WhatsApp'

export type CallRecordMediaType = 'Voice' | 'Video' | 'DM'

export type CallRecordCallType = 'Customer' | 'Transfer' | 'Conference'

export type CallRecordRatingScore = 1 | 2 | 3 | 4 | 5

export type CallRecordEndReason =
  | 'Normal'
  | 'Hening & Tidak Ada Respons'
  | 'Problem Teknis'
  | 'Nasabah Tidak Ada Respons Lebih Lanjut'
  | 'Customer Timeout'
  | 'Connection Lost'
  | 'System Error'
  | 'Channel Gateway Error'

export type CallRecordMessageSender = 'Agent' | 'Customer' | 'System'

export interface CallRecordTranscriptLine {
  id: string
  speaker: CallRecordMessageSender
  text: string
  time: string
}

export interface CallRecordTicket {
  categories: string[]
  id: string
}

export interface CallRecordSummary {
  description: string
  tickets: CallRecordTicket[]
}

export interface CallRecord {
  id: string
  agentId: string
  agentName: string
  callType: CallRecordCallType
  channel: CallRecordChannel
  contact: string
  customerId: string
  customerName: string
  durationSeconds: number
  endedBy: ServiceEndedBy
  endedAt: string
  endReason: CallRecordEndReason
  mediaType: CallRecordMediaType
  qmScore: number | null
  queueName: string
  ratingFeedback: string | null
  ratingScore: CallRecordRatingScore | null
  recordNo: string
  startedAt: string
  summary: CallRecordSummary
  transcript: CallRecordTranscriptLine[]
}
