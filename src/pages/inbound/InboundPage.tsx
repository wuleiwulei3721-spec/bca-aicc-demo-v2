import { useState } from 'react'
import {
  customerJourney,
  inboundCustomer,
  nextBestActions,
  quickActions,
  ticketingHistory,
} from '../../mock/inbound'
import { AssistantPanel } from './components/AssistantPanel'
import { CrmPanel } from './components/CrmPanel'
import { LeftColumn } from './components/LeftColumn'

export function InboundPage() {
  const [activeCrmLink, setActiveCrmLink] = useState<string>()

  return (
    <section className="inbound-page" aria-label="Inbound call workspace">
      <LeftColumn
        customer={inboundCustomer}
        journey={customerJourney}
        nextBestActions={nextBestActions}
        quickActions={quickActions}
        tickets={ticketingHistory}
        onOpenCrm={setActiveCrmLink}
      />
      <CrmPanel activeCrmLink={activeCrmLink} />
      <AssistantPanel />
    </section>
  )
}
