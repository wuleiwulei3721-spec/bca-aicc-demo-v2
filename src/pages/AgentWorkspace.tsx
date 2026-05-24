import { useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  CustomerServiceOutlined,
  HomeOutlined,
  MessageOutlined,
  MobileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { BaseTabs, PageContainer } from '../components'
import { useNow } from '../hooks/useNow'
import { useAppStore } from '../store'
import type { CallInteraction, InteractionTiming } from '../store'
import type { InteractionSlaState } from '../utils/duration'
import {
  formatDuration,
  getElapsedSeconds,
  getLiveChatSlaState,
} from '../utils/duration'
import { BankAppDemoPage } from './bankapp'
import { InboundPage, LiveChatPage, VideoCallPage } from './inbound'
import { WhatsAppDemoPage } from './whatsapp'

const HOME_TAB_KEY = 'home'
const BANKAPP_DEMO_TAB_KEY = 'bankapp-demo'
const WHATSAPP_DEMO_TAB_KEY = 'whatsapp-demo'
const LIVE_CHAT_TAB_KEY = 'live-chat'

interface WorkspaceTabLabelProps {
  durationEndedAt?: number | null
  durationStartedAt?: number | null
  icon: ReactNode
  isFlashing?: boolean
  label: string
  now: number
  slaState?: InteractionSlaState
}

function getLiveChatTabSlaState(
  timings: InteractionTiming[],
  now: number,
): InteractionSlaState {
  if (
    timings.some(
      (timing) => getLiveChatSlaState(getElapsedSeconds(timing.startedAt, now)) === 'breach',
    )
  ) {
    return 'breach'
  }

  if (
    timings.some(
      (timing) => getLiveChatSlaState(getElapsedSeconds(timing.startedAt, now)) === 'warning',
    )
  ) {
    return 'warning'
  }

  return 'normal'
}

function getLongestRunningStartedAt(timings: InteractionTiming[]) {
  if (timings.length === 0) {
    return null
  }

  return Math.min(...timings.map((timing) => timing.startedAt))
}

function getLatestFlashUntil(timings: InteractionTiming[]) {
  if (timings.length === 0) {
    return 0
  }

  return Math.max(...timings.map((timing) => timing.flashUntil))
}

function getCallInteractionIcon(interaction: CallInteraction) {
  return interaction.kind === 'video' ? (
    <VideoCameraOutlined />
  ) : (
    <CustomerServiceOutlined />
  )
}

function WorkspaceTabLabel({
  durationEndedAt,
  durationStartedAt,
  icon,
  isFlashing = false,
  label,
  now,
  slaState = 'normal',
}: WorkspaceTabLabelProps) {
  const elapsedSeconds =
    durationStartedAt === null || durationStartedAt === undefined
      ? null
      : getElapsedSeconds(durationStartedAt, durationEndedAt ?? now)

  return (
    <span
      className={[
        'workspace-tab-label',
        slaState !== 'normal' ? `workspace-tab-label--${slaState}` : '',
        isFlashing ? 'workspace-tab-label--flash' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="workspace-tab-label__icon">{icon}</span>
      <span className="workspace-tab-label__text">{label}</span>
      {elapsedSeconds !== null && (
        <span className="workspace-tab-label__duration">
          ({formatDuration(elapsedSeconds)})
        </span>
      )}
    </span>
  )
}

export function AgentWorkspace() {
  const activeKey = useAppStore((state) => state.activeWorkspaceTabKey)
  const activeLiveChatSessionIds = useAppStore(
    (state) => state.activeLiveChatSessionIds,
  )
  const hasBankAppDemoTab = useAppStore(
    (state) => state.isBankAppDemoTabOpen,
  )
  const hasWhatsAppDemoTab = useAppStore(
    (state) => state.isWhatsAppDemoTabOpen,
  )
  const hasLiveChatTab = useAppStore((state) => state.isLiveChatTabOpen)
  const callInteractionOrder = useAppStore(
    (state) => state.callInteractionOrder,
  )
  const callInteractions = useAppStore((state) => state.callInteractions)
  const currentCallInteractionId = useAppStore(
    (state) => state.currentCallInteractionId,
  )
  const liveChatSessionTimings = useAppStore(
    (state) => state.liveChatSessionTimings,
  )
  const closeBankAppDemoTab = useAppStore(
    (state) => state.closeBankAppDemoTab,
  )
  const closeWhatsAppDemoTab = useAppStore(
    (state) => state.closeWhatsAppDemoTab,
  )
  const closeCallInteractionTab = useAppStore(
    (state) => state.closeCallInteractionTab,
  )
  const setActiveKey = useAppStore(
    (state) => state.setActiveWorkspaceTabKey,
  )
  const now = useNow(
    Boolean(
      callInteractionOrder.some(
        (interactionId) =>
          callInteractions[interactionId]?.phase !== 'ended',
      ) ||
        activeLiveChatSessionIds.length > 0,
    ),
  )

  const activeLiveChatTimings = useMemo(
    () =>
      activeLiveChatSessionIds
        .map((sessionId) => liveChatSessionTimings[sessionId])
        .filter((timing): timing is InteractionTiming => Boolean(timing)),
    [activeLiveChatSessionIds, liveChatSessionTimings],
  )
  const liveChatDurationStartedAt =
    getLongestRunningStartedAt(activeLiveChatTimings)
  const liveChatSlaState = getLiveChatTabSlaState(activeLiveChatTimings, now)
  const latestLiveChatFlashUntil =
    getLatestFlashUntil(activeLiveChatTimings)

  const tabItems = useMemo<TabsProps['items']>(() => {
    const items: TabsProps['items'] = [
      {
        key: HOME_TAB_KEY,
        closable: false,
        label: (
          <WorkspaceTabLabel icon={<HomeOutlined />} label="Home" now={now} />
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
          <WorkspaceTabLabel
            icon={<MobileOutlined />}
            label="BankApp Demo"
            now={now}
          />
        ),
        children: <BankAppDemoPage />,
      })
    }

    if (hasWhatsAppDemoTab) {
      items.push({
        key: WHATSAPP_DEMO_TAB_KEY,
        closable: true,
        label: (
          <WorkspaceTabLabel
            icon={<MessageOutlined />}
            label="WhatsApp Demo"
            now={now}
          />
        ),
        children: <WhatsAppDemoPage />,
      })
    }

    if (hasLiveChatTab) {
      items.push({
        key: LIVE_CHAT_TAB_KEY,
        closable: false,
        label: (
          <WorkspaceTabLabel
            durationStartedAt={liveChatDurationStartedAt}
            icon={<MessageOutlined />}
            isFlashing={latestLiveChatFlashUntil > now}
            label="Live Chat"
            now={now}
            slaState={liveChatSlaState}
          />
        ),
        children:
          activeKey === LIVE_CHAT_TAB_KEY ? <LiveChatPage /> : null,
      })
    }

    callInteractionOrder.forEach((interactionId) => {
      const interaction = callInteractions[interactionId]

      if (!interaction) {
        return
      }

      const isCurrentActiveInteraction =
        interaction.id === currentCallInteractionId &&
        interaction.phase !== 'ended'

      items.push({
        key: interaction.tabKey,
        closable: interaction.phase === 'ended',
        label: (
          <WorkspaceTabLabel
            durationEndedAt={interaction.endedAt}
            durationStartedAt={interaction.startedAt}
            icon={getCallInteractionIcon(interaction)}
            isFlashing={
              activeKey !== interaction.tabKey &&
              interaction.phase !== 'ended' &&
              interaction.flashUntil > now
            }
            label={interaction.title}
            now={now}
          />
        ),
        children:
          interaction.kind === 'video' ? (
            <VideoCallPage
              interaction={interaction}
              isCurrentActive={isCurrentActiveInteraction}
            />
          ) : (
            <InboundPage interaction={interaction} />
          ),
      })
    })

    return items
  }, [
    activeKey,
    callInteractionOrder,
    callInteractions,
    currentCallInteractionId,
    latestLiveChatFlashUntil,
    hasBankAppDemoTab,
    hasLiveChatTab,
    hasWhatsAppDemoTab,
    liveChatDurationStartedAt,
    liveChatSlaState,
    now,
  ])

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && targetKey === BANKAPP_DEMO_TAB_KEY) {
      closeBankAppDemoTab()
    }

    if (action === 'remove' && targetKey === WHATSAPP_DEMO_TAB_KEY) {
      closeWhatsAppDemoTab()
    }

    if (action === 'remove' && typeof targetKey === 'string') {
      const interaction = Object.values(callInteractions).find(
        (item) => item.tabKey === targetKey,
      )

      if (interaction) {
        closeCallInteractionTab(interaction.id)
      }
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
