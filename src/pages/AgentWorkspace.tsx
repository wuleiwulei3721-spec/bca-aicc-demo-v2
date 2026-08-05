import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { HomeOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { BaseTabs, PageContainer } from '../components'
import {
  isWorkspacePageTabKey,
  workspacePageTabByTabKey,
} from '../config/workspacePageTabs'
import { useNow } from '../hooks/useNow'
import { liveChat2Sessions } from '../mock/inbound'
import {
  monitoringScreenshotViewByKey,
  type MonitoringScreenshotView,
} from '../mock/monitoring'
import { useAppStore } from '../store'
import type { InteractionTiming } from '../store'
import type { LiveChat2Session } from '../types'
import type { InteractionSlaState } from '../utils/duration'
import {
  formatDuration,
  getElapsedSeconds,
  getLiveChatSlaState,
} from '../utils/duration'
import { BankAppDemoPage } from './bankapp'
import { EmailPage } from './email'
import { InboundPage, LiveChat2Page, VideoCallPage } from './inbound'
import { SocialMediaPage } from './social-media'
import { WebchatDemoPage } from './webchat'
import { WhatsAppDemoPage } from './whatsapp'

const HOME_TAB_KEY = 'home'
const MONITORING_MONITOR_TAB_KEY = 'monitor'
const BANKAPP_DEMO_TAB_KEY = 'bankapp-demo'
const WEBCHAT_DEMO_TAB_KEY = 'webchat-demo'
const WHATSAPP_DEMO_TAB_KEY = 'whatsapp-demo'
const EMAIL_TAB_KEY = 'email'
const SOCIAL_MEDIA_TAB_KEY = 'social-media'
const LIVE_CHAT_TAB_KEY = 'live-chat'
const EMAIL_TAB_WARNING_SECONDS = 29 * 60 + 59
const EMAIL_TAB_BREACH_SECONDS = 39 * 60 + 59
const staticLiveChat2SessionById = Object.fromEntries(
  liveChat2Sessions.map((session) => [session.id, session]),
) as Record<string, LiveChat2Session>

interface WorkspaceTabLabelProps {
  durationEndedAt?: number | null
  durationStartedAt?: number | null
  emailBreachElapsedSeconds?: number
  emailWarningElapsedSeconds?: number
  flashScope?: 'label' | 'tab'
  icon?: ReactNode
  isFlashing?: boolean
  label: string
  now: number
  slaState?: InteractionSlaState
  unreadCount?: number
  unansweredBreachCount?: number
  unansweredWarningCount?: number
}

interface WorkspaceDurationTiming extends InteractionTiming {
  endedAt?: number | null
}

function getLatestFlashUntil(timings: InteractionTiming[]) {
  if (timings.length === 0) {
    return 0
  }

  return Math.max(...timings.map((timing) => timing.flashUntil))
}

function getLongestDurationTiming(
  timings: WorkspaceDurationTiming[],
  now: number,
) {
  if (timings.length === 0) {
    return null
  }

  return timings.reduce((longestTiming, timing) => {
    const longestElapsedSeconds = getElapsedSeconds(
      longestTiming.startedAt,
      longestTiming.endedAt ?? now,
    )
    const elapsedSeconds = getElapsedSeconds(
      timing.startedAt,
      timing.endedAt ?? now,
    )

    if (elapsedSeconds > longestElapsedSeconds) {
      return timing
    }

    if (
      elapsedSeconds === longestElapsedSeconds &&
      timing.startedAt < longestTiming.startedAt
    ) {
      return timing
    }

    return longestTiming
  })
}

function formatCompactDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60

  return `${minutes}m${String(remainingSeconds).padStart(2, '0')}s`
}

function WorkspaceTabLabel({
  durationEndedAt,
  durationStartedAt,
  emailBreachElapsedSeconds,
  emailWarningElapsedSeconds,
  flashScope = 'label',
  icon,
  isFlashing = false,
  label,
  now,
  slaState = 'normal',
  unreadCount = 0,
  unansweredBreachCount = 0,
  unansweredWarningCount = 0,
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
        isFlashing && flashScope === 'label'
          ? 'workspace-tab-label--flash'
          : '',
        isFlashing && flashScope === 'tab'
          ? 'workspace-tab-label--tab-flash'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && <span className="workspace-tab-label__icon">{icon}</span>}
      <span className="workspace-tab-label__text">{label}</span>
      {elapsedSeconds !== null && (
        <span className="workspace-tab-label__duration">
          ({formatDuration(elapsedSeconds)})
        </span>
      )}
      {unreadCount > 0 && (
        <span className="workspace-tab-label__unread">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      {emailWarningElapsedSeconds !== undefined && (
        <span className="workspace-tab-label__email-alert workspace-tab-label__email-alert--warning">
          <span>1</span>
          <time>({formatCompactDuration(emailWarningElapsedSeconds)})</time>
        </span>
      )}
      {emailBreachElapsedSeconds !== undefined && (
        <span className="workspace-tab-label__email-alert workspace-tab-label__email-alert--breach">
          <span>2</span>
          <time>({formatCompactDuration(emailBreachElapsedSeconds)})</time>
        </span>
      )}
      {(unansweredWarningCount > 0 || unansweredBreachCount > 0) && (
        <span
          className="workspace-tab-label__sla-alerts"
          title={`Unanswered warning ${unansweredWarningCount}, breach ${unansweredBreachCount}`}
        >
          {unansweredWarningCount > 0 && (
            <span className="workspace-tab-label__sla-alert workspace-tab-label__sla-alert--warning">
              {unansweredWarningCount > 99 ? '99+' : unansweredWarningCount}
            </span>
          )}
          {unansweredBreachCount > 0 && (
            <span className="workspace-tab-label__sla-alert workspace-tab-label__sla-alert--breach">
              {unansweredBreachCount > 99 ? '99+' : unansweredBreachCount}
            </span>
          )}
        </span>
      )}
    </span>
  )
}

function MonitoringScreenshotWorkspace({
  view,
}: {
  view: MonitoringScreenshotView
}) {
  return (
    <section
      aria-label={`${view.label} screenshot`}
      className="monitoring-screenshot-workspace"
    >
      <div className="monitoring-screenshot-workspace__viewport">
        <img
          alt={view.alt}
          className="monitoring-screenshot-workspace__image"
          draggable={false}
          src={view.imageSrc}
        />
      </div>
    </section>
  )
}

function getFallbackTabKey(
  items: TabsProps['items'],
  targetKey: string,
) {
  const tabKeys =
    items
      ?.map((item) => (typeof item?.key === 'string' ? item.key : null))
      .filter((item): item is string => Boolean(item)) ?? []
  const targetIndex = tabKeys.indexOf(targetKey)

  if (targetIndex > 0) {
    return tabKeys[targetIndex - 1]
  }

  return tabKeys[targetIndex + 1] ?? HOME_TAB_KEY
}

export function AgentWorkspace() {
  const activeKey = useAppStore((state) => state.activeWorkspaceTabKey)
  const currentMonitoringHomeViewKey = useAppStore(
    (state) => state.currentMonitoringHomeViewKey,
  )
  const currentMonitoringMonitorViewKey = useAppStore(
    (state) => state.currentMonitoringMonitorViewKey,
  )
  const activeLiveChat2SessionIds = useAppStore(
    (state) => state.activeLiveChat2SessionIds,
  )
  const hasBankAppDemoTab = useAppStore(
    (state) => state.isBankAppDemoTabOpen,
  )
  const hasWhatsAppDemoTab = useAppStore(
    (state) => state.isWhatsAppDemoTabOpen,
  )
  const hasEmailTab = useAppStore((state) => state.isEmailTabOpen)
  const hasSocialMediaTab = useAppStore(
    (state) => state.isSocialMediaTabOpen,
  )
  const hasWebchatDemoTab = useAppStore(
    (state) => state.isWebchatDemoTabOpen,
  )
  const hasLiveChatTab = useAppStore((state) => state.isLiveChatTabOpen)
  const hasMonitoringMonitorTab = useAppStore(
    (state) => state.isMonitoringMonitorTabOpen,
  )
  const workspacePageTabOrder = useAppStore(
    (state) => state.workspacePageTabOrder,
  )
  const callInteractionOrder = useAppStore(
    (state) => state.callInteractionOrder,
  )
  const callInteractions = useAppStore((state) => state.callInteractions)
  const currentCallInteractionId = useAppStore(
    (state) => state.currentCallInteractionId,
  )
  const liveChat2LastMessageOverrides = useAppStore(
    (state) => state.liveChat2LastMessageOverrides,
  )
  const liveChat2ReadSessionIds = useAppStore(
    (state) => state.liveChat2ReadSessionIds,
  )
  const liveChat2SessionInstances = useAppStore(
    (state) => state.liveChat2SessionInstances,
  )
  const liveChat2SessionStatuses = useAppStore(
    (state) => state.liveChat2SessionStatuses,
  )
  const liveChat2SessionTimings = useAppStore(
    (state) => state.liveChat2SessionTimings,
  )
  const liveChat2UnansweredSinceBySessionId = useAppStore(
    (state) => state.liveChat2UnansweredSinceBySessionId,
  )
  const closeBankAppDemoTab = useAppStore(
    (state) => state.closeBankAppDemoTab,
  )
  const closeWhatsAppDemoTab = useAppStore(
    (state) => state.closeWhatsAppDemoTab,
  )
  const closeEmailTab = useAppStore((state) => state.closeEmailTab)
  const closeSocialMediaTab = useAppStore(
    (state) => state.closeSocialMediaTab,
  )
  const closeWebchatDemoTab = useAppStore(
    (state) => state.closeWebchatDemoTab,
  )
  const closeMonitoringMonitorTab = useAppStore(
    (state) => state.closeMonitoringMonitorTab,
  )
  const closeWorkspacePageTab = useAppStore(
    (state) => state.closeWorkspacePageTab,
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
        activeLiveChat2SessionIds.length > 0,
    ),
  )

  const activeLiveChat2Timings = useMemo(
    () =>
      activeLiveChat2SessionIds
        .map((sessionId) => {
          const timing = liveChat2SessionTimings[sessionId]
          const status = liveChat2SessionStatuses[sessionId]

          if (!timing || status?.status === 'ended') {
            return null
          }

          return timing
        })
        .filter(
          (timing): timing is WorkspaceDurationTiming => Boolean(timing),
        ),
    [
      activeLiveChat2SessionIds,
      liveChat2SessionStatuses,
      liveChat2SessionTimings,
    ],
  )
  const liveChat2DurationTiming = getLongestDurationTiming(
    activeLiveChat2Timings,
    now,
  )
  const latestLiveChat2FlashUntil =
    getLatestFlashUntil(activeLiveChat2Timings)
  const liveChat2SessionById = useMemo(
    () => ({
      ...staticLiveChat2SessionById,
      ...liveChat2SessionInstances,
    }),
    [liveChat2SessionInstances],
  )
  const liveChatUnreadCount = useMemo(
    () =>
      activeLiveChat2SessionIds.reduce((total, sessionId) => {
        const session = liveChat2SessionById[sessionId]
        const status =
          liveChat2SessionStatuses[sessionId]?.status ?? session?.status

        if (
          !session ||
          session.isInitialHistory ||
          status === 'ended' ||
          liveChat2ReadSessionIds.includes(sessionId)
        ) {
          return total
        }

        const unreadCount =
          liveChat2LastMessageOverrides[sessionId]?.unreadCount ??
          session.unreadCount

        return total + Math.max(0, unreadCount)
      }, 0),
    [
      activeLiveChat2SessionIds,
      liveChat2SessionById,
      liveChat2LastMessageOverrides,
      liveChat2ReadSessionIds,
      liveChat2SessionStatuses,
    ],
  )
  const liveChatUnansweredAlertCounts = useMemo(
    () =>
      activeLiveChat2SessionIds.reduce(
        (counts, sessionId) => {
          const session = liveChat2SessionById[sessionId]
          const status =
            liveChat2SessionStatuses[sessionId]?.status ?? session?.status
          const unansweredSince =
            liveChat2UnansweredSinceBySessionId[sessionId]

          if (
            !session ||
            session.isInitialHistory ||
            status === 'ended' ||
            !unansweredSince
          ) {
            return counts
          }

          const elapsedSeconds = getElapsedSeconds(unansweredSince, now)
          const unansweredState = getLiveChatSlaState(elapsedSeconds)

          if (unansweredState === 'warning') {
            return {
              ...counts,
              warning: counts.warning + 1,
            }
          }

          if (unansweredState === 'breach') {
            return {
              ...counts,
              breach: counts.breach + 1,
            }
          }

          return counts
        },
        { breach: 0, warning: 0 },
      ),
    [
      activeLiveChat2SessionIds,
      liveChat2SessionById,
      liveChat2SessionStatuses,
      liveChat2UnansweredSinceBySessionId,
      now,
    ],
  )

  const tabItems = useMemo<TabsProps['items']>(() => {
    const currentHomeScreenshot =
      monitoringScreenshotViewByKey[currentMonitoringHomeViewKey]
    const currentMonitorScreenshot =
      monitoringScreenshotViewByKey[currentMonitoringMonitorViewKey]
    const items: TabsProps['items'] = [
      {
        key: HOME_TAB_KEY,
        closable: false,
        label: (
          <WorkspaceTabLabel icon={<HomeOutlined />} label="Home" now={now} />
        ),
        children: (
          <MonitoringScreenshotWorkspace view={currentHomeScreenshot} />
        ),
      },
    ]

    if (hasMonitoringMonitorTab) {
      items.push({
        key: MONITORING_MONITOR_TAB_KEY,
        closable: true,
        label: (
          <WorkspaceTabLabel
            label="Monitor"
            now={now}
          />
        ),
        children: (
          <MonitoringScreenshotWorkspace view={currentMonitorScreenshot} />
        ),
      })
    }

    if (hasBankAppDemoTab) {
      items.push({
        key: BANKAPP_DEMO_TAB_KEY,
        closable: true,
        label: (
          <WorkspaceTabLabel
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
            label="WhatsApp Demo"
            now={now}
          />
        ),
        children: <WhatsAppDemoPage />,
      })
    }

    if (hasEmailTab) {
      items.push({
        key: EMAIL_TAB_KEY,
        closable: true,
        label: (
          <WorkspaceTabLabel
            emailBreachElapsedSeconds={EMAIL_TAB_BREACH_SECONDS}
            emailWarningElapsedSeconds={EMAIL_TAB_WARNING_SECONDS}
            label="Email"
            now={now}
          />
        ),
        children: activeKey === EMAIL_TAB_KEY ? <EmailPage /> : null,
      })
    }

    if (hasSocialMediaTab) {
      items.push({
        key: SOCIAL_MEDIA_TAB_KEY,
        closable: true,
        label: <WorkspaceTabLabel label="Social Media" now={now} />,
        children:
          activeKey === SOCIAL_MEDIA_TAB_KEY ? <SocialMediaPage /> : null,
      })
    }

    if (hasWebchatDemoTab) {
      items.push({
        key: WEBCHAT_DEMO_TAB_KEY,
        closable: true,
        label: (
          <WorkspaceTabLabel
            label="Webchat Demo"
            now={now}
          />
        ),
        children: <WebchatDemoPage />,
      })
    }

    if (hasLiveChatTab) {
      items.push({
        key: LIVE_CHAT_TAB_KEY,
        closable: false,
        label: (
          <WorkspaceTabLabel
            durationEndedAt={liveChat2DurationTiming?.endedAt}
            durationStartedAt={liveChat2DurationTiming?.startedAt}
            flashScope="tab"
            isFlashing={latestLiveChat2FlashUntil > now}
            label="Live Chat"
            now={now}
            unansweredBreachCount={liveChatUnansweredAlertCounts.breach}
            unansweredWarningCount={liveChatUnansweredAlertCounts.warning}
            unreadCount={liveChatUnreadCount}
          />
        ),
        children:
          activeKey === LIVE_CHAT_TAB_KEY ? <LiveChat2Page /> : null,
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

    workspacePageTabOrder.forEach((tabKey) => {
      const definition = workspacePageTabByTabKey[tabKey]

      if (!definition) {
        return
      }

      items.push({
        key: definition.tabKey,
        closable: true,
        label: (
          <WorkspaceTabLabel
            label={definition.label}
            now={now}
          />
        ),
        children: definition.element,
      })
    })

    return items
  }, [
    activeKey,
    callInteractionOrder,
    callInteractions,
    currentMonitoringHomeViewKey,
    currentMonitoringMonitorViewKey,
    currentCallInteractionId,
    hasBankAppDemoTab,
    hasEmailTab,
    hasSocialMediaTab,
    hasLiveChatTab,
    hasMonitoringMonitorTab,
    hasWebchatDemoTab,
    hasWhatsAppDemoTab,
    workspacePageTabOrder,
    liveChat2DurationTiming,
    liveChatUnansweredAlertCounts,
    liveChatUnreadCount,
    latestLiveChat2FlashUntil,
    now,
  ])

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove' && targetKey === BANKAPP_DEMO_TAB_KEY) {
      closeBankAppDemoTab()
    }

    if (action === 'remove' && targetKey === WHATSAPP_DEMO_TAB_KEY) {
      closeWhatsAppDemoTab()
    }

    if (action === 'remove' && targetKey === EMAIL_TAB_KEY) {
      closeEmailTab()
    }

    if (action === 'remove' && targetKey === SOCIAL_MEDIA_TAB_KEY) {
      closeSocialMediaTab()
    }

    if (action === 'remove' && targetKey === WEBCHAT_DEMO_TAB_KEY) {
      closeWebchatDemoTab()
    }

    if (action === 'remove' && targetKey === MONITORING_MONITOR_TAB_KEY) {
      closeMonitoringMonitorTab()
    }

    if (
      action === 'remove' &&
      typeof targetKey === 'string' &&
      isWorkspacePageTabKey(targetKey)
    ) {
      closeWorkspacePageTab(targetKey, getFallbackTabKey(tabItems, targetKey))
      return
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
