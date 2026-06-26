import type {
  CustomerInformation,
  CrmWorkspaceTab,
  CustomerJourneyItem,
  NextBestActionItem,
  QuickActionItem,
  TicketHistoryItem,
} from '../../../types'
import { CustomerInformationCard } from './CustomerInformationCard'
import type { CustomerVerificationPanelConfig } from './CustomerInformationCard'
import { CustomerJourneyCard } from './CustomerJourneyCard'
import { NextBestActionCard } from './NextBestActionCard'
import { QuickActionCard } from './QuickActionCard'
import { TicketingHistoryCard } from './TicketingHistoryCard'

interface LeftColumnProps {
  accessMenuLabel?: string
  accessMenuName?: string
  customer: CustomerInformation
  identityRefreshPasteValue: string
  journey: CustomerJourneyItem[]
  tickets: TicketHistoryItem[]
  nextBestActions: NextBestActionItem[]
  quickActions: QuickActionItem[]
  onCustomerIdentityRefresh: (customerId: string) => boolean
  onOpenCrm: (tab: CrmWorkspaceTab) => void
  onOpenVerification: (config: CustomerVerificationPanelConfig) => void
  showIvrJourney?: boolean
  showTransferHistory?: boolean
}

export function LeftColumn({
  accessMenuLabel,
  accessMenuName,
  customer,
  identityRefreshPasteValue,
  journey,
  tickets,
  nextBestActions,
  quickActions,
  onCustomerIdentityRefresh,
  onOpenCrm,
  onOpenVerification,
  showIvrJourney,
  showTransferHistory,
}: LeftColumnProps) {
  return (
    <div className="inbound-left-column">
      <div className="inbound-left-column__fixed">
        <CustomerInformationCard
          accessMenuLabel={accessMenuLabel}
          accessMenuName={accessMenuName}
          customer={customer}
          identityRefreshPasteValue={identityRefreshPasteValue}
          showIvrJourney={showIvrJourney}
          showTransferHistory={showTransferHistory}
          onCustomerIdentityRefresh={onCustomerIdentityRefresh}
          onOpenVerification={onOpenVerification}
        />
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
