import {
  bankAppVoiceGuestCustomer,
  bankAppVoiceCustomer,
  unidentifiedCustomerJourney,
  unidentifiedInboundCustomer,
  unidentifiedTicketingHistory,
} from '../../mock/inbound'
import type { CallInteraction } from '../../store'
import { InteractionWorkspace } from './InteractionWorkspace'

interface InboundPageProps {
  interaction: CallInteraction
}

export function InboundPage({ interaction }: InboundPageProps) {
  const isBankAppVoice = interaction.source === 'bankapp-voice'
  const customer = isBankAppVoice
    ? interaction.bankAppCustomerType === 'guest'
      ? bankAppVoiceGuestCustomer
      : bankAppVoiceCustomer
    : unidentifiedInboundCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Inbound call workspace"
      customer={customer}
      initialJourney={isBankAppVoice ? undefined : unidentifiedCustomerJourney}
      initialTickets={isBankAppVoice ? undefined : unidentifiedTicketingHistory}
      showIvrJourney
    />
  )
}
