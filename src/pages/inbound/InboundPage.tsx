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
  const isOutbound = interaction.source === 'outbound'
  const customer = isOutbound
    ? {
        ...unidentifiedInboundCustomer,
        accessDuration: '00:00',
        profile: {
          ...unidentifiedInboundCustomer.profile,
          name: 'Outbound Customer',
          phoneNumber: interaction.outboundNumber ?? '-',
        },
      }
    : isBankAppVoice
    ? interaction.bankAppCustomerType === 'guest'
      ? bankAppVoiceGuestCustomer
      : bankAppVoiceCustomer
    : unidentifiedInboundCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Inbound call workspace"
      customer={customer}
      initialJourney={
        isBankAppVoice || isOutbound ? undefined : unidentifiedCustomerJourney
      }
      initialTickets={
        isBankAppVoice || isOutbound ? undefined : unidentifiedTicketingHistory
      }
      showIvrJourney={!isOutbound}
      transferContext={interaction.transferContext}
    />
  )
}
