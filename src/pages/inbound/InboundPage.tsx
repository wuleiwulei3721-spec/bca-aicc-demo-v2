import { bankAppVoiceCustomer, inboundCustomer } from '../../mock/inbound'
import type { CallInteraction } from '../../store'
import { InteractionWorkspace } from './InteractionWorkspace'

interface InboundPageProps {
  interaction: CallInteraction
}

export function InboundPage({ interaction }: InboundPageProps) {
  const customer =
    interaction.source === 'bankapp-voice'
      ? bankAppVoiceCustomer
      : inboundCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Inbound call workspace"
      customer={customer}
    />
  )
}
