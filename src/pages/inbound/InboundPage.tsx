import { inboundCustomer } from '../../mock/inbound'
import { InteractionWorkspace } from './InteractionWorkspace'

export function InboundPage() {
  return (
    <InteractionWorkspace
      ariaLabel="Inbound call workspace"
      customer={inboundCustomer}
    />
  )
}
