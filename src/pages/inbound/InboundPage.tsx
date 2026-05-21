import { useCallback, useState } from 'react'
import {
  customerJourney,
  inboundCustomer,
  nextBestActions,
  quickActions,
  ticketingHistory,
} from '../../mock/inbound'
import type { CrmWorkspaceTab } from '../../types'
import { AssistantPanel } from './components/AssistantPanel'
import { CrmPanel } from './components/CrmPanel'
import { LeftColumn } from './components/LeftColumn'

const CRM_TAB_KEY = 'crm'

export function InboundPage() {
  const [crmWorkspace, setCrmWorkspace] = useState<{
    activeKey: string
    tabs: CrmWorkspaceTab[]
  }>({
    activeKey: CRM_TAB_KEY,
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
    <section className="inbound-page" aria-label="Inbound call workspace">
      <LeftColumn
        customer={inboundCustomer}
        journey={customerJourney}
        nextBestActions={nextBestActions}
        quickActions={quickActions}
        tickets={ticketingHistory}
        onOpenCrm={openCrmWorkspaceTab}
      />
      <CrmPanel
        activeKey={crmWorkspace.activeKey}
        workspaceTabs={crmWorkspace.tabs}
        onActiveKeyChange={(activeKey) =>
          setCrmWorkspace((current) => ({ ...current, activeKey }))
        }
        onCloseTab={closeCrmWorkspaceTab}
      />
      <AssistantPanel />
    </section>
  )
}
