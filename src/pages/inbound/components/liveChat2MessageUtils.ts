import type { LiveChat2Message } from '../../../types'

export interface LiveChat2MessageLocateRequest {
  messageId: string
  requestId: number
}

function isClientWelcomeMessage(message: LiveChat2Message) {
  return (
    message.sender === 'system' &&
    message.message.trim().toLowerCase().startsWith('welcome.')
  )
}

export function getLiveChat2VisibleMessages(
  historyMessages: LiveChat2Message[],
  messages: LiveChat2Message[],
) {
  return [...historyMessages, ...messages].filter(
    (message) => !isClientWelcomeMessage(message),
  )
}
