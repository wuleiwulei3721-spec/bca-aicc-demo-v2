import type { ReactNode } from 'react'
import type {
  CustomerInformation,
  CrmWorkspaceTab,
  CustomerJourneyItem,
  NextBestActionItem,
  TicketHistoryItem,
} from '../../../types'
import type { CallTransferContext } from '../../../store'
import { CustomerInformationCard } from './CustomerInformationCard'
import type { CustomerVerificationPanelConfig } from './CustomerInformationCard'
import { CustomerJourneyCard } from './CustomerJourneyCard'
import { NextBestActionCard } from './NextBestActionCard'
import { QuickActionCard } from './QuickActionCard'
import { TicketingHistoryCard } from './TicketingHistoryCard'

function hasCrmCustomerIdentity(cisNumber: string) {
  return /^\d{6,}$/.test(cisNumber.trim())
}

interface LeftColumnProps {
  accessChannelNode?: ReactNode
  accessMenuLabel?: string
  accessMenuName?: string
  customer: CustomerInformation
  journey: CustomerJourneyItem[]
  tickets: TicketHistoryItem[]
  nextBestActions: NextBestActionItem[]
  onOpenCrm: (tab: CrmWorkspaceTab) => void
  onSendEmail?: () => void
  onOpenVerification: (config: CustomerVerificationPanelConfig) => void
  onVerificationFinish: CustomerVerificationPanelConfig['onFinish']
  verificationConditions?: CustomerVerificationPanelConfig['initialConditions']
  showIvrJourney?: boolean
  showTransferHistory?: boolean
  transferContext?: CallTransferContext
}

export function LeftColumn({
  accessChannelNode,
  accessMenuLabel,
  accessMenuName,
  customer,
  journey,
  tickets,
  nextBestActions,
  onOpenCrm,
  onSendEmail,
  onOpenVerification,
  onVerificationFinish,
  verificationConditions,
  showIvrJourney,
  showTransferHistory,
  transferContext,
}: LeftColumnProps) {
  const hasCustomerIdentity = hasCrmCustomerIdentity(customer.profile.cisNumber)
  const customerJourney = hasCustomerIdentity ? journey : []
  const customerTickets = hasCustomerIdentity ? tickets : []
  const customerNextBestActions = hasCustomerIdentity ? nextBestActions : []

  return (
    <div className="inbound-left-column">
      <div className="inbound-left-column__fixed">
        <CustomerInformationCard
          accessChannelNode={accessChannelNode}
          accessMenuLabel={accessMenuLabel}
          accessMenuName={accessMenuName}
          customer={customer}
          onSendEmail={onSendEmail}
          showIvrJourney={showIvrJourney}
          showTransferHistory={showTransferHistory}
          transferContext={transferContext}
          onOpenVerification={onOpenVerification}
          onVerificationFinish={onVerificationFinish}
          verificationConditions={verificationConditions}
        />
      </div>
      <div className="inbound-left-column__scroll">
        <CustomerJourneyCard items={customerJourney} />
        <TicketingHistoryCard items={customerTickets} onOpenCrm={onOpenCrm} />
        <NextBestActionCard
          items={customerNextBestActions}
          onOpenCrm={onOpenCrm}
        />
        <QuickActionCard onOpenCrm={onOpenCrm} />
      </div>
    </div>
  )
}
