import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CUSTOMER_IDENTITY_REFRESH_DEMO_ID,
  customerJourney,
  lookupCustomerIdentityRefresh,
  nextBestActions,
  quickActions,
  ticketingHistory,
} from '../../mock/inbound'
import type {
  CrmWorkspaceTab,
  CustomerInformation,
  CustomerJourneyItem,
  TicketHistoryItem,
} from '../../types'
import { AssistantPanel } from './components/AssistantPanel'
import type { AssistantPanelExtraTab } from './components/AssistantPanel'
import { CONVERSATION_TAB_KEY, CrmPanel } from './components/CrmPanel'
import type { ConversationWorkspaceConfig } from './components/ConversationWorkspace'
import { LeftColumn } from './components/LeftColumn'

const CRM_TAB_KEY = 'crm'

interface InteractionWorkspaceProps {
  accessMenuLabel?: string
  accessMenuName?: string
  ariaLabel: string
  assistantActiveKey?: string
  assistantExtraTabs?: AssistantPanelExtraTab[]
  className?: string
  conversation?: ConversationWorkspaceConfig
  conversationContent?: ReactNode
  conversationKey?: string
  customer: CustomerInformation
  initialJourney?: CustomerJourneyItem[]
  initialTickets?: TicketHistoryItem[]
  leadPanel?: ReactNode
  onAssistantActiveKeyChange?: (activeKey: string) => void
  onAssistantCloseExtraTab?: (targetKey: string) => void
  overlay?: ReactNode
  showIvrJourney?: boolean
}

export function InteractionWorkspace({
  accessMenuLabel,
  accessMenuName,
  ariaLabel,
  assistantActiveKey,
  assistantExtraTabs,
  className,
  conversation,
  conversationContent,
  conversationKey,
  customer,
  initialJourney,
  initialTickets,
  leadPanel,
  onAssistantActiveKeyChange,
  onAssistantCloseExtraTab,
  overlay,
  showIvrJourney,
}: InteractionWorkspaceProps) {
  const [crmWorkspace, setCrmWorkspace] = useState<{
    activeKey: string
    tabs: CrmWorkspaceTab[]
  }>({
    activeKey:
      conversation || conversationContent ? CONVERSATION_TAB_KEY : CRM_TAB_KEY,
    tabs: [],
  })
  const initialJourneyItems = initialJourney ?? customerJourney
  const initialTicketItems = initialTickets ?? ticketingHistory
  const sourceCustomerKey = [
    customer.accessChannel,
    customer.profile.cisNumber,
    customer.profile.phoneNumber,
    customer.profile.email,
    customer.profile.name,
  ].join(':')
  const sourceCustomer = useMemo<CustomerInformation>(
    () => ({
      accessChannel: customer.accessChannel,
      accessDuration: '',
      profile: {
        avatarInitials: customer.profile.avatarInitials,
        avatarUrl: customer.profile.avatarUrl,
        cisNumber: customer.profile.cisNumber,
        customerType: customer.profile.customerType,
        email: customer.profile.email,
        name: customer.profile.name,
        phoneNumber: customer.profile.phoneNumber,
      },
      verificationStatus: customer.verificationStatus,
    }),
    [
      customer.accessChannel,
      customer.profile.avatarInitials,
      customer.profile.avatarUrl,
      customer.profile.cisNumber,
      customer.profile.customerType,
      customer.profile.email,
      customer.profile.name,
      customer.profile.phoneNumber,
      customer.verificationStatus,
    ],
  )
  const sourceIdentityData = useMemo<{
    customer: CustomerInformation
    journey: CustomerJourneyItem[]
    tickets: TicketHistoryItem[]
  }>(
    () => ({
      customer: sourceCustomer,
      journey: initialJourneyItems,
      tickets: initialTicketItems,
    }),
    [initialJourneyItems, initialTicketItems, sourceCustomer],
  )
  const [identityOverride, setIdentityOverride] = useState<{
    data: {
      customer: CustomerInformation
      journey: CustomerJourneyItem[]
      tickets: TicketHistoryItem[]
    }
    sourceKey: string
  } | null>(null)
  const identityData =
    identityOverride?.sourceKey === sourceCustomerKey
      ? identityOverride.data
      : sourceIdentityData

  const displayCustomer = useMemo(
    () => ({
      ...identityData.customer,
      accessChannel: customer.accessChannel,
      accessDuration: customer.accessDuration,
    }),
    [customer.accessChannel, customer.accessDuration, identityData.customer],
  )

  const openCrmWorkspaceTab = useCallback((tab: CrmWorkspaceTab) => {
    setCrmWorkspace((current) => ({
      activeKey: tab.key,
      tabs: current.tabs.some((item) => item.key === tab.key)
        ? current.tabs
        : [...current.tabs, tab],
    }))
  }, [])

  const closeCrmWorkspaceTab = useCallback((targetKey: string) => {
    setCrmWorkspace((current) => {
      const removedIndex = current.tabs.findIndex(
        (tab) => tab.key === targetKey,
      )
      const tabs = current.tabs.filter((tab) => tab.key !== targetKey)
      const nextActiveTab =
        tabs[Math.max(0, removedIndex - 1)] ?? tabs[0]

      return {
        activeKey:
          current.activeKey === targetKey
            ? nextActiveTab?.key ?? CRM_TAB_KEY
            : current.activeKey,
        tabs,
      }
    })
  }, [])

  const refreshCustomerIdentity = useCallback(
    (customerId: string) => {
      const refreshResult = lookupCustomerIdentityRefresh(customerId)

      if (!refreshResult) {
        return false
      }

      setIdentityOverride({
        data: {
          customer: {
            ...refreshResult.customer,
            accessChannel: customer.accessChannel,
            accessDuration: customer.accessDuration,
          },
          journey: refreshResult.journey,
          tickets: refreshResult.tickets,
        },
        sourceKey: sourceCustomerKey,
      })

      return true
    },
    [customer.accessChannel, customer.accessDuration, sourceCustomerKey],
  )

  return (
    <>
      <section
        className={['inbound-page', className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      >
        {leadPanel}
        <LeftColumn
          accessMenuLabel={accessMenuLabel}
          accessMenuName={accessMenuName}
          customer={displayCustomer}
          identityRefreshPasteValue={CUSTOMER_IDENTITY_REFRESH_DEMO_ID}
          journey={identityData.journey}
          nextBestActions={nextBestActions}
          quickActions={quickActions}
          tickets={identityData.tickets}
          showIvrJourney={showIvrJourney}
          onCustomerIdentityRefresh={refreshCustomerIdentity}
          onOpenCrm={openCrmWorkspaceTab}
        />
        <CrmPanel
          activeKey={crmWorkspace.activeKey}
          conversation={conversation}
          conversationContent={conversationContent}
          conversationKey={conversationKey}
          workspaceTabs={crmWorkspace.tabs}
          onActiveKeyChange={(activeKey) =>
            setCrmWorkspace((current) => ({ ...current, activeKey }))
          }
          onCloseTab={closeCrmWorkspaceTab}
        />
        <AssistantPanel
          activeKey={assistantActiveKey}
          extraTabs={assistantExtraTabs}
          onActiveKeyChange={onAssistantActiveKeyChange}
          onCloseExtraTab={onAssistantCloseExtraTab}
        />
      </section>
      {overlay}
    </>
  )
}
