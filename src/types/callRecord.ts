import type { ServiceEndedBy } from './sessionEndReason'

export type CallRecordChannel = 'Phone' | 'BankApp' | 'Webchat' | 'WhatsApp'

export type CallRecordMediaType = 'Voice' | 'Video' | 'DM'

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

export interface CallRecordSummary {
  businessTypes: string[]
  description: string
  ticketNo: string
}

export interface CallRecord {
  id: string
  agentId: string
  agentName: string
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
  recordNo: string
  startedAt: string
  summary: CallRecordSummary
  transcript: CallRecordTranscriptLine[]
}
