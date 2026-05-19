import type {
  CustomerInformation,
  CustomerJourneyItem,
  NextBestActionItem,
  QuickActionItem,
  TicketHistoryItem,
} from '../../../types'
import { CustomerInformationCard } from './CustomerInformationCard'
import { CustomerJourneyCard } from './CustomerJourneyCard'
import { NextBestActionCard } from './NextBestActionCard'
import { QuickActionCard } from './QuickActionCard'
import { TicketingHistoryCard } from './TicketingHistoryCard'

interface LeftColumnProps {
  customer: CustomerInformation
  journey: CustomerJourneyItem[]
  tickets: TicketHistoryItem[]
  nextBestActions: NextBestActionItem[]
  quickActions: QuickActionItem[]
  onOpenCrm: (link: string) => void
}

export function LeftColumn({
  customer,
  journey,
  tickets,
  nextBestActions,
  quickActions,
  onOpenCrm,
}: LeftColumnProps) {
  return (
    <div className="inbound-left-column">
      <div className="inbound-left-column__fixed">
        <CustomerInformationCard customer={customer} />
      </div>
      <div className="inbound-left-column__scroll">
        <CustomerJourneyCard items={journey} />
        <TicketingHistoryCard items={tickets} onOpenCrm={onOpenCrm} />
        <NextBestActionCard items={nextBestActions} onOpenCrm={onOpenCrm} />
        <QuickActionCard items={quickActions} onOpenCrm={onOpenCrm} />
      </div>
    </div>
  )
}
