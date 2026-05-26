import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import {
  customerJourney,
  nextBestActions,
  quickActions,
  ticketingHistory,
} from '../../mock/inbound'
import type { CrmWorkspaceTab, CustomerInformation } from '../../types'
import { AssistantPanel } from './components/AssistantPanel'
import { CONVERSATION_TAB_KEY, CrmPanel } from './components/CrmPanel'
import type { ConversationWorkspaceConfig } from './components/ConversationWorkspace'
import { LeftColumn } from './components/LeftColumn'

const CRM_TAB_KEY = 'crm'

interface InteractionWorkspaceProps {
  ariaLabel: string
  className?: string
  conversation?: ConversationWorkspaceConfig
  conversationContent?: ReactNode
  conversationKey?: string
  customer: CustomerInformation
  leadPanel?: ReactNode
  overlay?: ReactNode
}

export function InteractionWorkspace({
  ariaLabel,
  className,
  conversation,
  conversationContent,
  conversationKey,
  customer,
  leadPanel,
  overlay,
}: InteractionWorkspaceProps) {
  const [crmWorkspace, setCrmWorkspace] = useState<{
    activeKey: string
    tabs: CrmWorkspaceTab[]
  }>({
    activeKey:
      conversation || conversationContent ? CONVERSATION_TAB_KEY : CRM_TAB_KEY,
    tabs: [],
  })

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

  return (
    <>
      <section
        className={['inbound-page', className].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
      >
        {leadPanel}
        <LeftColumn
          customer={customer}
          journey={customerJourney}
          nextBestActions={nextBestActions}
          quickActions={quickActions}
          tickets={ticketingHistory}
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
        <AssistantPanel />
      </section>
      {overlay}
    </>
  )
}
