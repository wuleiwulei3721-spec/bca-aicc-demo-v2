import { useMemo } from 'react'
import { CustomerServiceOutlined, HomeOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { PageContainer } from '../components'
import { useAppStore } from '../store'
import { InboundPage } from './inbound'

const HOME_TAB_KEY = 'home'
const INBOUND_TAB_KEY = 'inbound'

export function AgentWorkspace() {
  const activeKey = useAppStore((state) => state.activeWorkspaceTabKey)
  const hasInboundTab = useAppStore((state) => state.isInboundTabOpen)
  const closeInboundTab = useAppStore((state) => state.closeInboundTab)
  const setActiveKey = useAppStore(
    (state) => state.setActiveWorkspaceTabKey,
  )

  const tabItems = useMemo<TabsProps['items']>(() => {
    const items: TabsProps['items'] = [
      {
        key: HOME_TAB_KEY,
        closable: false,
        label: (
          <span>
            <HomeOutlined />
            Home
          </span>
        ),
        children: (
          <section className="home-workspace">
            <div className="home-workspace__panel">
              <div className="home-workspace__mark">AICC</div>
              <h2>Agent Desktop Ready</h2>
              <p>
                The console is standing by for an inbound voice interaction.
              </p>
            </div>
          </section>
        ),
      },
    ]

    if (hasInboundTab) {
      items.push({
        key: INBOUND_TAB_KEY,
        closable: true,
        label: (
          <span>
            <CustomerServiceOutlined />
            Inbound
          </span>
        ),
        children: <InboundPage />,
      })
    }

    return items
  }, [hasInboundTab])

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && targetKey === INBOUND_TAB_KEY) {
      closeInboundTab()
    }
  }

  return (
    <PageContainer>
      <Tabs
        activeKey={activeKey}
        className="agent-workspace-tabs"
        hideAdd
        items={tabItems}
        type="editable-card"
        onChange={setActiveKey}
        onEdit={handleEdit}
      />
    </PageContainer>
  )
}
