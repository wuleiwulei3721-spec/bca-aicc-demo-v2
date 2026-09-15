import type { LiveChat2Session } from '../../../types'

function getCustomerMessageName(messages: LiveChat2Session['messages']) {
  return messages.find(
    (message) => message.sender === 'customer' && message.senderName.trim(),
  )?.senderName
}

export function getLiveChat2CustomerDisplayName(session: LiveChat2Session) {
  return (
    session.customerDisplayName?.trim() ||
    getCustomerMessageName(session.messages) ||
    getCustomerMessageName(session.historyMessages) ||
    session.customer.profile.name
  )
}
