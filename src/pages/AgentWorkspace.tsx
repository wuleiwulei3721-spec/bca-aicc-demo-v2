import { useMemo } from 'react'
import {
  CustomerServiceOutlined,
  HomeOutlined,
  MessageOutlined,
  MobileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { BaseTabs, PageContainer } from '../components'
import { useAppStore } from '../store'
import { BankAppDemoPage } from './bankapp'
import { InboundPage, LiveChatPage, VideoCallPage } from './inbound'

const HOME_TAB_KEY = 'home'
const BANKAPP_DEMO_TAB_KEY = 'bankapp-demo'
const LIVE_CHAT_TAB_KEY = 'live-chat'
const INBOUND_TAB_KEY = 'inbound'
const VIDEO_CALL_TAB_KEY = 'video-call'

export function AgentWorkspace() {
  const activeKey = useAppStore((state) => state.activeWorkspaceTabKey)
  const hasBankAppDemoTab = useAppStore(
    (state) => state.isBankAppDemoTabOpen,
  )
  const hasLiveChatTab = useAppStore((state) => state.isLiveChatTabOpen)
  const hasInboundTab = useAppStore((state) => state.isInboundTabOpen)
  const hasVideoCallTab = useAppStore((state) => state.isVideoCallTabOpen)
  const closeBankAppDemoTab = useAppStore(
    (state) => state.closeBankAppDemoTab,
  )
  const closeInboundTab = useAppStore((state) => state.closeInboundTab)
  const closeVideoCallTab = useAppStore((state) => state.closeVideoCallTab)
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

    if (hasBankAppDemoTab) {
      items.push({
        key: BANKAPP_DEMO_TAB_KEY,
        closable: true,
        label: (
          <span>
            <MobileOutlined />
            BankApp Demo
          </span>
        ),
        children:
          activeKey === BANKAPP_DEMO_TAB_KEY ? <BankAppDemoPage /> : null,
      })
    }

    if (hasLiveChatTab) {
      items.push({
        key: LIVE_CHAT_TAB_KEY,
        closable: false,
        label: (
          <span>
            <MessageOutlined />
            Live Chat
          </span>
        ),
        children:
          activeKey === LIVE_CHAT_TAB_KEY ? <LiveChatPage /> : null,
      })
    }

    if (hasInboundTab) {
      items.push({
        key: INBOUND_TAB_KEY,
        closable: true,
        label: (
          <span>
            <CustomerServiceOutlined />
            PSTN / Voice Call
          </span>
        ),
        children: <InboundPage />,
      })
    }

    if (hasVideoCallTab) {
      items.push({
        key: VIDEO_CALL_TAB_KEY,
        closable: true,
        label: (
          <span>
            <VideoCameraOutlined />
            Video Call
          </span>
        ),
        children:
          activeKey === VIDEO_CALL_TAB_KEY ? <VideoCallPage /> : null,
      })
    }

    return items
  }, [
    activeKey,
    hasBankAppDemoTab,
    hasInboundTab,
    hasLiveChatTab,
    hasVideoCallTab,
  ])

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && targetKey === BANKAPP_DEMO_TAB_KEY) {
      closeBankAppDemoTab()
    }

    if (action === 'remove' && targetKey === INBOUND_TAB_KEY) {
      closeInboundTab()
    }

    if (action === 'remove' && targetKey === VIDEO_CALL_TAB_KEY) {
      closeVideoCallTab()
    }
  }

  return (
    <PageContainer>
      <BaseTabs
        activeKey={activeKey}
        className="agent-workspace-tabs"
        hideAdd
        items={tabItems}
        type="editable-card"
        variant="toolbar"
        onChange={setActiveKey}
        onEdit={handleEdit}
      />
    </PageContainer>
  )
}
