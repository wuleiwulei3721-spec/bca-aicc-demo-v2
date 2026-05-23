import { bankAppVoiceCustomer, inboundCustomer } from '../../mock/inbound'
import { useAppStore } from '../../store'
import { InteractionWorkspace } from './InteractionWorkspace'

export function InboundPage() {
  const inboundPopupSource = useAppStore((state) => state.inboundPopupSource)
  const customer =
    inboundPopupSource === 'bankapp-voice'
      ? bankAppVoiceCustomer
      : inboundCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Inbound call workspace"
      customer={customer}
    />
  )
}
