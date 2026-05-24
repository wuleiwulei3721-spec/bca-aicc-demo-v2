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
import type { InteractionTiming } from '../store'
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
const INBOUND_TAB_KEY = 'inbound'
const VIDEO_CALL_TAB_KEY = 'video-call'

interface InteractionTabLabelProps {
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

function InteractionTabLabel({
  durationStartedAt,
  icon,
  isFlashing = false,
  label,
  now,
  slaState = 'normal',
}: InteractionTabLabelProps) {
  const elapsedSeconds =
    durationStartedAt === null || durationStartedAt === undefined
      ? null
      : getElapsedSeconds(durationStartedAt, now)

  return (
    <span
      className={[
        'interaction-tab-label',
        slaState !== 'normal' ? `interaction-tab-label--${slaState}` : '',
        isFlashing ? 'interaction-tab-label--flash' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
      <span className="interaction-tab-label__text">{label}</span>
      {elapsedSeconds !== null && (
        <span className="interaction-tab-label__duration">
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
  const hasInboundTab = useAppStore((state) => state.isInboundTabOpen)
  const hasVideoCallTab = useAppStore((state) => state.isVideoCallTabOpen)
  const inboundInteractionTiming = useAppStore(
    (state) => state.inboundInteractionTiming,
  )
  const inboundPopupSource = useAppStore((state) => state.inboundPopupSource)
  const liveChatSessionTimings = useAppStore(
    (state) => state.liveChatSessionTimings,
  )
  const videoCallInteractionTiming = useAppStore(
    (state) => state.videoCallInteractionTiming,
  )
  const closeBankAppDemoTab = useAppStore(
    (state) => state.closeBankAppDemoTab,
  )
  const closeWhatsAppDemoTab = useAppStore(
    (state) => state.closeWhatsAppDemoTab,
  )
  const closeInboundTab = useAppStore((state) => state.closeInboundTab)
  const closeVideoCallTab = useAppStore((state) => state.closeVideoCallTab)
  const setActiveKey = useAppStore(
    (state) => state.setActiveWorkspaceTabKey,
  )
  const now = useNow(
    Boolean(
      inboundInteractionTiming ||
        videoCallInteractionTiming ||
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
  const inboundTabLabel =
    inboundPopupSource === 'bankapp-voice' ? 'Voice Call' : 'PSTN'

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
        children: <BankAppDemoPage />,
      })
    }

    if (hasWhatsAppDemoTab) {
      items.push({
        key: WHATSAPP_DEMO_TAB_KEY,
        closable: true,
        label: (
          <span>
            <MessageOutlined />
            WhatsApp Demo
          </span>
        ),
        children: <WhatsAppDemoPage />,
      })
    }

    if (hasLiveChatTab) {
      items.push({
        key: LIVE_CHAT_TAB_KEY,
        closable: false,
        label: (
          <InteractionTabLabel
            durationStartedAt={liveChatDurationStartedAt}
            icon={<MessageOutlined />}
            isFlashing={
              activeKey !== LIVE_CHAT_TAB_KEY &&
              latestLiveChatFlashUntil > now
            }
            label="Live Chat"
            now={now}
            slaState={liveChatSlaState}
          />
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
          <InteractionTabLabel
            durationStartedAt={inboundInteractionTiming?.startedAt}
            icon={<CustomerServiceOutlined />}
            isFlashing={
              activeKey !== INBOUND_TAB_KEY &&
              Boolean(inboundInteractionTiming?.flashUntil) &&
              (inboundInteractionTiming?.flashUntil ?? 0) > now
            }
            label={inboundTabLabel}
            now={now}
          />
        ),
        children: <InboundPage />,
      })
    }

    if (hasVideoCallTab) {
      items.push({
        key: VIDEO_CALL_TAB_KEY,
        closable: true,
        label: (
          <InteractionTabLabel
            durationStartedAt={videoCallInteractionTiming?.startedAt}
            icon={<VideoCameraOutlined />}
            isFlashing={
              activeKey !== VIDEO_CALL_TAB_KEY &&
              Boolean(videoCallInteractionTiming?.flashUntil) &&
              (videoCallInteractionTiming?.flashUntil ?? 0) > now
            }
            label="Video Call"
            now={now}
          />
        ),
        children:
          activeKey === VIDEO_CALL_TAB_KEY ? <VideoCallPage /> : null,
      })
    }

    return items
  }, [
    activeKey,
    inboundInteractionTiming,
    inboundTabLabel,
    latestLiveChatFlashUntil,
    hasBankAppDemoTab,
    hasInboundTab,
    hasLiveChatTab,
    hasVideoCallTab,
    hasWhatsAppDemoTab,
    liveChatDurationStartedAt,
    liveChatSlaState,
    now,
    videoCallInteractionTiming,
  ])

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && targetKey === BANKAPP_DEMO_TAB_KEY) {
      closeBankAppDemoTab()
    }

    if (action === 'remove' && targetKey === WHATSAPP_DEMO_TAB_KEY) {
      closeWhatsAppDemoTab()
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
