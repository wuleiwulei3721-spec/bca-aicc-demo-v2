import { create } from 'zustand'
import type {
  AgentServiceMode,
  BankAppCustomerType,
  LiveChat2EndReason,
  LiveChat2Message,
  LiveChat2Session,
  LiveChat2SessionInstances,
  LiveChat2SessionStatus,
  LiveChat2SortMode,
  LiveChat2StarColor,
  ServiceEndedBy,
  VerificationRule,
  VerificationV2Question,
  VerificationV2Rule,
} from '../types'
import { liveChat2Sessions, verificationRules } from '../mock/inbound'
import {
  defaultMonitoringHomeViewKey,
  defaultMonitoringMonitorViewKey,
  type MonitoringHomeViewKey,
  type MonitoringMonitorViewKey,
} from '../mock/monitoring'
import {
  verificationV2QuestionBank,
  verificationV2Rules,
} from '../mock/verificationRuleV2'
import { parseDurationSeconds } from '../utils/duration'
import {
  cloneVerificationV2QuestionBank,
  cloneVerificationV2Rules,
} from '../utils/verificationRuleV2'

export type InboundPopupSource = 'pstn' | 'bankapp-voice'
export type VideoCallPopupSource = 'standard' | 'bankapp-video'
export type BankAppPinVerificationStatus =
  | 'failed'
  | 'idle'
  | 'locked'
  | 'sent'
  | 'verified'
export type BankAppVideoShareState = 'idle' | 'sharing'
export type CallInteractionKind = 'voice' | 'video'
export type CallInteractionPhase = 'incoming' | 'active' | 'ended'
export type CallInteractionSource = InboundPopupSource | VideoCallPopupSource
export interface CallTransferContext {
  sourceAgentEmployeeId: string
  sourceAgentName: string
  transferredAt: number
}
export type DigitalHandoffReadiness =
  | 'available'
  | 'not-ready'
export type VoiceVideoHandoffReadiness =
  | 'active-call'
  | 'available'
  | 'not-ready'

export interface InteractionTiming {
  flashUntil: number
  startedAt: number
}

export interface LiveChat2SessionStatusState {
  endedBy: ServiceEndedBy | null
  endedAt: number | null
  endReason: LiveChat2EndReason | null
  endReasonName: string | null
  status: LiveChat2SessionStatus
}

export interface LiveChat2SessionSummaryOverride {
  lastMessage: string
  lastMessageAt: string
  lastMessageTime: string
  unreadCount: number
}

export interface CallInteraction {
  bankAppCustomerType?: BankAppCustomerType
  endedBy: ServiceEndedBy | null
  endedAt: number | null
  endReasonName: string | null
  flashUntil: number
  id: string
  kind: CallInteractionKind
  phase: CallInteractionPhase
  skillDisplayName: string
  source: CallInteractionSource
  startedAt: number
  tabKey: string
  title: string
  transferContext?: CallTransferContext
}

interface SetLiveChatTabOpenOptions {
  seedDefaultCurrentSessions?: boolean
}

const INTERACTION_FLASH_MS = 5000
const DEFAULT_INBOUND_SKILL_DISPLAY_NAME = 'Credit card activation'
const LIVE_CHAT_TAB_KEY = 'live-chat'
const LEGACY_LIVECHAT2_TAB_KEY = 'livechat2'
const MONITORING_MONITOR_TAB_KEY = 'monitor'
const DEFAULT_LIVECHAT2_CURRENT_SESSION_IDS = [
  'livechat2-001',
  'livechat2-005',
]
const LIVE_CHAT_TO_LIVECHAT2_SESSION_ID: Record<string, string> = {
  'live-chat-001': 'livechat2-001',
  'live-chat-002': 'livechat2-002',
  'live-chat-003': 'livechat2-003',
}
const liveChat2SessionById = Object.fromEntries(
  liveChat2Sessions.map((session) => [session.id, session]),
) as Record<string, (typeof liveChat2Sessions)[number]>
const fallbackLiveChat2SessionId =
  liveChat2Sessions.find((session) => !session.isInitialHistory)?.id ?? null

function cloneVerificationRules(): VerificationRule[] {
  return verificationRules.map((rule) => ({
    ...rule,
    notes: [...rule.notes],
    questions: rule.questions.map((question) => ({ ...question })),
    requiredGroups: { ...rule.requiredGroups },
  }))
}

function cloneVerificationRuleV2State() {
  return {
    verificationV2QuestionBank: cloneVerificationV2QuestionBank(
      verificationV2QuestionBank,
    ),
    verificationV2Rules: cloneVerificationV2Rules(verificationV2Rules),
  }
}

function formatLiveChat2Time(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(date)
}

function formatCurrentLiveChat2Time() {
  return formatLiveChat2Time(new Date())
}

function createLiveChat2Status(
  status: LiveChat2SessionStatus,
  endReason: LiveChat2EndReason | null = null,
  endReasonName: string | null = null,
): LiveChat2SessionStatusState {
  const endedBy =
    status === 'ended'
      ? endReason === 'customer'
        ? 'Customer'
        : endReason === 'timeout'
          ? 'System'
          : 'Agent'
      : null

  return {
    endedBy,
    endedAt: status === 'ended' ? Date.now() : null,
    endReason,
    endReasonName:
      status === 'ended'
        ? endReasonName ??
          (endedBy === 'System'
            ? 'Customer Timeout'
            : endedBy
              ? 'Normal'
              : null)
        : null,
    status,
  }
}

function createDefaultLiveChat2CurrentState(now: number) {
  const activeSessionIds = DEFAULT_LIVECHAT2_CURRENT_SESSION_IDS.filter(
    (sessionId) => Boolean(liveChat2SessionById[sessionId]),
  )
  const sessionStatuses: Record<string, LiveChat2SessionStatusState> = {}
  const sessionTimings: Record<string, InteractionTiming> = {}
  const starColors: Record<string, LiveChat2StarColor> = {}
  const unansweredSinceBySessionId: Record<string, number> = {}

  activeSessionIds.forEach((sessionId) => {
    const session = liveChat2SessionById[sessionId]
    const initialElapsedSeconds = parseDurationSeconds(
      session.customer.accessDuration,
    )

    sessionTimings[sessionId] = {
      flashUntil: 0,
      startedAt: now - initialElapsedSeconds * 1000,
    }
    sessionStatuses[sessionId] = createLiveChat2Status(
      session.status,
      session.endReason ?? (session.status === 'ended' ? 'customer' : null),
    )
    starColors[sessionId] = session.initialStarColor

    if (typeof session.initialUnansweredSeconds === 'number') {
      unansweredSinceBySessionId[sessionId] =
        now -
        Math.min(session.initialUnansweredSeconds, initialElapsedSeconds) *
          1000
    }
  })

  return {
    activeSessionIds,
    sessionStatuses,
    sessionTimings,
    starColors,
    unansweredSinceBySessionId,
  }
}

function getLiveChat2ReplacementSessionId(sessionId?: string) {
  if (!sessionId) {
    return null
  }

  if (LIVE_CHAT_TO_LIVECHAT2_SESSION_ID[sessionId]) {
    return LIVE_CHAT_TO_LIVECHAT2_SESSION_ID[sessionId]
  }

  if (liveChat2SessionById[sessionId]) {
    return sessionId
  }

  return fallbackLiveChat2SessionId
}

function cloneLiveChat2MessageForSession(
  message: LiveChat2Message,
  sourceSessionId: string,
  nextSessionId: string,
  timestamp?: number,
) {
  const nextMessage = {
    ...message,
    id: message.id.replace(sourceSessionId, nextSessionId),
  }

  if (typeof timestamp === 'number') {
    const messageDate = new Date(timestamp)
    nextMessage.time = formatLiveChat2Time(messageDate)
    nextMessage.timestamp = messageDate.toISOString()
  }

  return nextMessage
}

function createLiveChat2HandoffSession(
  sourceSession: LiveChat2Session,
  nextSessionId: string,
  accessSequence: number,
  now: number,
  bankAppCustomerType?: BankAppCustomerType,
): LiveChat2Session {
  const time = formatLiveChat2Time(new Date(now))
  const sourceMessages = [
    ...sourceSession.historyMessages,
    ...sourceSession.messages,
  ]
  const firstMessageTimestamp =
    now - Math.max(sourceMessages.length - 1, 0) * 60 * 1000
  const messageTimestampById = new Map(
    sourceMessages.map((message, index) => [
      message.id,
      firstMessageTimestamp + index * 60 * 1000,
    ]),
  )

  const isTextGuest =
    (sourceSession.channel === 'BankApp' ||
      sourceSession.channel === 'Webchat') &&
    bankAppCustomerType === 'guest'
  const textGuestProfile =
    sourceSession.channel === 'Webchat'
      ? {
          avatarInitials: 'MS',
          email: 'maya.santoso@example.com',
          name: 'Maya Santoso',
          phoneNumber: '081298760421',
        }
      : {
          avatarInitials: 'AP',
          email: 'ayu.pratama@example.com',
          name: 'Ayu Pratama',
          phoneNumber: '081234560219',
        }
  const customerProfile = isTextGuest
    ? {
        ...sourceSession.customer.profile,
        ...textGuestProfile,
        cisNumber: '-',
        customerType: 'Guest',
      }
    : {
        ...sourceSession.customer.profile,
        customerType:
          (sourceSession.channel === 'BankApp' ||
            sourceSession.channel === 'Webchat') &&
          bankAppCustomerType === 'registered'
            ? 'Regular Customer'
            : sourceSession.customer.profile.customerType,
      }

  return {
    ...sourceSession,
    accessSequence,
    bankAppLoginStatus:
      sourceSession.channel === 'BankApp'
        ? bankAppCustomerType ?? sourceSession.bankAppLoginStatus ?? 'registered'
        : sourceSession.bankAppLoginStatus,
    customer: {
      ...sourceSession.customer,
      bankAppLoginStatus:
        sourceSession.channel === 'BankApp'
          ? bankAppCustomerType ?? sourceSession.bankAppLoginStatus ?? 'registered'
          : sourceSession.customer.bankAppLoginStatus,
      profile: customerProfile,
    },
    historyMessages: sourceSession.historyMessages.map((message) =>
      cloneLiveChat2MessageForSession(
        message,
        sourceSession.id,
        nextSessionId,
        messageTimestampById.get(message.id),
      ),
    ),
    id: nextSessionId,
    lastMessageAt: new Date(now).toISOString(),
    lastMessageTime: time,
    messages: sourceSession.messages.map((message) =>
      cloneLiveChat2MessageForSession(
        message,
        sourceSession.id,
        nextSessionId,
        messageTimestampById.get(message.id),
      ),
    ),
    serviceStartedAt: time,
    status: 'active',
  }
}

function getCallInteractionTitle(
  kind: CallInteractionKind,
  source: CallInteractionSource,
) {
  if (kind === 'video') {
    return 'Video Call'
  }

  return source === 'bankapp-voice' ? 'Voice Call' : 'PSTN'
}

function getCallInteractionSkillDisplayName() {
  return DEFAULT_INBOUND_SKILL_DISPLAY_NAME
}

interface AppState {
  activeWorkspaceTabKey: string
  agentServiceMode: AgentServiceMode | null
  activeLiveChatSessionIds: string[]
  activeLiveChat2SessionIds: string[]
  bankAppVideoCallActivateWorkspace: boolean
  bankAppVideoCallRequestId: number
  bankAppVideoCustomerType: BankAppCustomerType
  bankAppPinVerificationAttempts: number
  bankAppPinVerificationRequestId: number
  bankAppPinVerificationStatus: BankAppPinVerificationStatus
  bankAppVideoShareState: BankAppVideoShareState
  bankAppVoiceCallActivateWorkspace: boolean
  bankAppVoiceCallRequestId: number
  bankAppVoiceCustomerType: BankAppCustomerType
  callInteractionOrder: string[]
  callInteractionSeq: number
  callInteractions: Record<string, CallInteraction>
  collapsed: boolean
  currentCallInteractionId: string | null
  currentMonitoringHomeViewKey: MonitoringHomeViewKey
  currentMonitoringMonitorViewKey: MonitoringMonitorViewKey
  customerOutboundCallRequestId: number
  digitalHandoffReadiness: DigitalHandoffReadiness
  isBankAppDemoTabOpen: boolean
  isEmailTabOpen: boolean
  isSocialMediaTabOpen: boolean
  isLiveChat2TabOpen: boolean
  isLiveChatTabOpen: boolean
  isMonitoringMonitorTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isScreenShareActive: boolean
  isWebchatDemoTabOpen: boolean
  isWhatsAppDemoTabOpen: boolean
  liveChat2ClosedSessionIds: string[]
  liveChat2DraftMessages: Record<string, string>
  liveChat2FocusRequestId: number
  liveChat2FocusSessionId: string | null
  liveChat2LastMessageOverrides: Record<string, LiveChat2SessionSummaryOverride>
  liveChat2MessagesBySessionId: Record<string, LiveChat2Message[]>
  liveChat2ReadSessionIds: string[]
  liveChat2RecalledMessageIds: string[]
  liveChat2SessionInstances: LiveChat2SessionInstances
  liveChat2SessionStatuses: Record<string, LiveChat2SessionStatusState>
  liveChat2SessionTimings: Record<string, InteractionTiming>
  liveChat2SortMode: LiveChat2SortMode
  liveChat2HandoffSeq: number
  liveChat2StarColors: Record<string, LiveChat2StarColor>
  liveChat2UnansweredSinceBySessionId: Record<string, number>
  liveChatSessionTimings: Record<string, InteractionTiming>
  liveChatFocusRequestId: number
  liveChatFocusSessionId: string | null
  readLiveChatSessionIds: string[]
  verificationRules: VerificationRule[]
  verificationV2QuestionBank: VerificationV2Question[]
  verificationV2Rules: VerificationV2Rule[]
  voiceVideoHandoffReadiness: VoiceVideoHandoffReadiness
  workspacePageTabOrder: string[]
  clearAgentServiceMode: () => void
  closeAllCallInteractionTabs: () => void
  closeBankAppDemoTab: () => void
  closeEmailTab: () => void
  closeSocialMediaTab: () => void
  closeCallInteractionTab: (interactionId: string) => void
  closeLiveChatSession: (sessionId: string) => void
  closeMonitoringMonitorTab: () => void
  closeWorkspacePageTab: (
    tabKey: string,
    fallbackTabKey?: string,
  ) => void
  closeWebchatDemoTab: () => void
  closeWhatsAppDemoTab: () => void
  completeBankAppPinVerification: (result?: 'failed' | 'verified') => void
  confirmBankAppVideoScreenShare: () => void
  createCallInteraction: (
    kind: CallInteractionKind,
    source?: CallInteractionSource,
    activate?: boolean,
    bankAppCustomerType?: BankAppCustomerType,
    transferContext?: CallTransferContext,
  ) => string
  markCallInteractionActive: (interactionId: string) => void
  markCallInteractionEnded: (
    interactionId: string,
    endedAt?: number,
    endReasonName?: string,
  ) => void
  markLiveChat2SessionRead: (sessionId: string) => void
  markLiveChatSessionRead: (sessionId: string) => void
  clearCurrentCallInteraction: () => void
  requestBankAppDemoWorkspace: () => void
  requestEmailWorkspace: () => void
  requestSocialMediaWorkspace: () => void
  requestBankAppPinVerification: (target?: 'bankapp' | 'webchat') => void
  requestBankAppVideoCall: (
    activate?: boolean,
    customerType?: BankAppCustomerType,
  ) => void
  requestBankAppVoiceCall: (
    activate?: boolean,
    customerType?: BankAppCustomerType,
  ) => void
  requestLiveChat2Workspace: (
    sessionIds: string[],
    options?: {
      initialElapsedSeconds?: Record<string, number | null>
      initialStarColors?: Record<string, LiveChat2StarColor>
      initialSessionStatuses?: Record<string, LiveChat2SessionStatusState>
      initialUnansweredSeconds?: Record<string, number | null>
      activate?: boolean
    },
  ) => void
  requestLiveChatWorkspace: (
    sessionId?: string,
    activate?: boolean,
    bankAppCustomerType?: BankAppCustomerType,
  ) => void
  requestCustomerOutboundCall: () => void
  requestMonitoringMonitorWorkspace: (
    viewKey?: MonitoringMonitorViewKey,
  ) => void
  openWorkspacePageTab: (tabKey: string) => void
  requestWebchatDemoWorkspace: () => void
  requestWhatsAppDemoWorkspace: () => void
  resetMonitoringViews: () => void
  resetVerificationRules: () => void
  resetVerificationRuleV2: () => void
  selectMonitoringHomeView: (viewKey: MonitoringHomeViewKey) => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setAgentServiceMode: (mode: AgentServiceMode) => void
  setCollapsed: (collapsed: boolean) => void
  setDigitalHandoffReadiness: (
    readiness: DigitalHandoffReadiness,
  ) => void
  setLiveChat2DraftMessage: (sessionId: string, message: string) => void
  setLiveChat2FocusedSession: (sessionId: string | null) => void
  setLiveChat2SortMode: (sortMode: LiveChat2SortMode) => void
  setLiveChat2StarColor: (
    sessionId: string,
    starColor: LiveChat2StarColor,
  ) => void
  setLiveChatTabOpen: (
    open: boolean,
    options?: SetLiveChatTabOpenOptions,
  ) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
  setScreenShareActive: (active: boolean) => void
  setVoiceVideoHandoffReadiness: (
    readiness: VoiceVideoHandoffReadiness,
  ) => void
  updateVerificationRule: (rule: VerificationRule) => void
  upsertVerificationV2Question: (question: VerificationV2Question) => void
  upsertVerificationV2Rule: (rule: VerificationV2Rule) => void
  deleteVerificationV2Rule: (ruleId: string) => void
  deleteVerificationV2Question: (questionId: string) => void
  startBankAppVideoScreenShare: () => void
  stopBankAppVideoScreenShare: () => void
  resetBankAppPinVerification: () => void
  resetBankAppVideoDesktopShare: () => void
  closeLiveChat2Session: (sessionId: string) => void
  endLiveChat2Session: (
    sessionId: string,
    endReason?: LiveChat2EndReason,
    baseMessages?: LiveChat2Message[],
    endReasonName?: string,
  ) => void
  recallLiveChat2Message: (messageId: string) => void
  sendLiveChat2Message: (
    sessionId: string,
    message: string,
    baseMessages: LiveChat2Message[],
    quotedMessage?: string | null,
  ) => void
  clearLiveChat2Sessions: () => void
  clearLiveChatSessions: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  agentServiceMode: null,
  activeLiveChatSessionIds: [],
  activeLiveChat2SessionIds: [],
  bankAppVideoCallActivateWorkspace: false,
  bankAppVideoCallRequestId: 0,
  bankAppVideoCustomerType: 'registered',
  bankAppPinVerificationAttempts: 0,
  bankAppPinVerificationRequestId: 0,
  bankAppPinVerificationStatus: 'idle',
  bankAppVideoShareState: 'idle',
  bankAppVoiceCallActivateWorkspace: false,
  bankAppVoiceCallRequestId: 0,
  bankAppVoiceCustomerType: 'registered',
  callInteractionOrder: [],
  callInteractionSeq: 0,
  callInteractions: {},
  collapsed: true,
  currentCallInteractionId: null,
  currentMonitoringHomeViewKey: defaultMonitoringHomeViewKey,
  currentMonitoringMonitorViewKey: defaultMonitoringMonitorViewKey,
  customerOutboundCallRequestId: 0,
  digitalHandoffReadiness: 'not-ready',
  isBankAppDemoTabOpen: false,
  isEmailTabOpen: false,
  isSocialMediaTabOpen: false,
  isLiveChat2TabOpen: false,
  isLiveChatTabOpen: false,
  isMonitoringMonitorTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isScreenShareActive: false,
  isWebchatDemoTabOpen: false,
  isWhatsAppDemoTabOpen: false,
  liveChat2ClosedSessionIds: [],
  liveChat2DraftMessages: {},
  liveChat2FocusRequestId: 0,
  liveChat2FocusSessionId: null,
  liveChat2LastMessageOverrides: {},
  liveChat2MessagesBySessionId: {},
  liveChat2ReadSessionIds: [],
  liveChat2RecalledMessageIds: [],
  liveChat2SessionInstances: {},
  liveChat2SessionStatuses: {},
  liveChat2SessionTimings: {},
  liveChat2SortMode: 'access-time',
  liveChat2HandoffSeq: 0,
  liveChat2StarColors: {},
  liveChat2UnansweredSinceBySessionId: {},
  liveChatSessionTimings: {},
  liveChatFocusRequestId: 0,
  liveChatFocusSessionId: null,
  readLiveChatSessionIds: [],
  verificationRules: cloneVerificationRules(),
  ...cloneVerificationRuleV2State(),
  voiceVideoHandoffReadiness: 'not-ready',
  workspacePageTabOrder: [],
  clearAgentServiceMode: () =>
    set({
      agentServiceMode: null,
      digitalHandoffReadiness: 'not-ready',
      voiceVideoHandoffReadiness: 'not-ready',
    }),
  closeAllCallInteractionTabs: () =>
    set((state) => ({
      activeWorkspaceTabKey: state.activeWorkspaceTabKey.startsWith('call-')
        ? state.isLiveChatTabOpen
          ? LIVE_CHAT_TAB_KEY
          : state.isLiveChat2TabOpen
            ? LEGACY_LIVECHAT2_TAB_KEY
            : 'home'
        : state.activeWorkspaceTabKey,
      bankAppVideoShareState: 'idle',
      callInteractionOrder: [],
      callInteractions: {},
      currentCallInteractionId: null,
      isOpenEyeVideoWindowVisible: false,
      isScreenShareActive: false,
    })),
  closeBankAppDemoTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'bankapp-demo'
          ? 'home'
          : state.activeWorkspaceTabKey,
      bankAppPinVerificationAttempts: 0,
      bankAppPinVerificationStatus: 'idle',
      isBankAppDemoTabOpen: false,
    })),
  closeEmailTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'email'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isEmailTabOpen: false,
    })),
  closeSocialMediaTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'social-media'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isSocialMediaTabOpen: false,
    })),
  closeCallInteractionTab: (interactionId) =>
    set((state) => {
      const interaction = state.callInteractions[interactionId]

      if (!interaction || interaction.phase !== 'ended') {
        return {}
      }

      const removedIndex = state.callInteractionOrder.indexOf(interactionId)
      const nextCallInteractionOrder = state.callInteractionOrder.filter(
        (itemId) => itemId !== interactionId,
      )
      const nextCallInteractions = { ...state.callInteractions }
      delete nextCallInteractions[interactionId]

      const fallbackInteractionId =
        nextCallInteractionOrder[Math.max(0, removedIndex - 1)] ??
        nextCallInteractionOrder[0]
      const fallbackInteraction = fallbackInteractionId
        ? nextCallInteractions[fallbackInteractionId]
        : null

      return {
        activeWorkspaceTabKey:
          state.activeWorkspaceTabKey === interaction.tabKey
            ? fallbackInteraction?.tabKey ??
              (state.isLiveChatTabOpen
                ? LIVE_CHAT_TAB_KEY
                : state.isLiveChat2TabOpen
                  ? LEGACY_LIVECHAT2_TAB_KEY
                  : 'home')
            : state.activeWorkspaceTabKey,
        callInteractionOrder: nextCallInteractionOrder,
        callInteractions: nextCallInteractions,
      }
    }),
  closeLiveChatSession: (sessionId) =>
    set((state) => {
      const nextActiveSessionIds = state.activeLiveChatSessionIds.filter(
        (activeSessionId) => activeSessionId !== sessionId,
      )
      const nextLiveChatSessionTimings = {
        ...state.liveChatSessionTimings,
      }
      delete nextLiveChatSessionTimings[sessionId]

      return {
        activeLiveChatSessionIds: nextActiveSessionIds,
        liveChatSessionTimings: nextLiveChatSessionTimings,
        readLiveChatSessionIds: state.readLiveChatSessionIds.filter(
          (readSessionId) => readSessionId !== sessionId,
        ),
        liveChatFocusSessionId:
          state.liveChatFocusSessionId === sessionId
            ? nextActiveSessionIds[0] ?? null
            : state.liveChatFocusSessionId,
      }
    }),
  closeMonitoringMonitorTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === MONITORING_MONITOR_TAB_KEY
          ? 'home'
          : state.activeWorkspaceTabKey,
      isMonitoringMonitorTabOpen: false,
    })),
  closeWorkspacePageTab: (tabKey, fallbackTabKey = 'home') =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === tabKey
          ? fallbackTabKey
          : state.activeWorkspaceTabKey,
      workspacePageTabOrder: state.workspacePageTabOrder.filter(
        (item) => item !== tabKey,
      ),
    })),
  closeWebchatDemoTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'webchat-demo'
          ? 'home'
          : state.activeWorkspaceTabKey,
      bankAppPinVerificationAttempts: 0,
      bankAppPinVerificationStatus: 'idle',
      isWebchatDemoTabOpen: false,
    })),
  closeWhatsAppDemoTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'whatsapp-demo'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isWhatsAppDemoTabOpen: false,
    })),
  completeBankAppPinVerification: (result = 'verified') =>
    set((state) => ({
      bankAppPinVerificationStatus:
        result === 'verified'
          ? 'verified'
          : state.bankAppPinVerificationAttempts >= 3
            ? 'locked'
            : 'failed',
    })),
  confirmBankAppVideoScreenShare: () =>
    set({
      activeWorkspaceTabKey: 'bankapp-demo',
      bankAppVideoShareState: 'sharing',
      isBankAppDemoTabOpen: true,
      isScreenShareActive: true,
    }),
  createCallInteraction: (
    kind,
    rawSource,
    activate = true,
    bankAppCustomerType,
    transferContext,
  ) => {
    let createdId = ''

    set((state) => {
      const remainingInteractionIds = state.callInteractionOrder.filter(
        (interactionId) =>
          state.callInteractions[interactionId]?.phase !== 'ended',
      )
      const remainingInteractions = Object.fromEntries(
        remainingInteractionIds.map((interactionId) => [
          interactionId,
          state.callInteractions[interactionId],
        ]),
      ) as Record<string, CallInteraction>
      const nextSeq = state.callInteractionSeq + 1
      const id = `call-${nextSeq}`
      const now = Date.now()
      const source =
        rawSource ??
        (kind === 'voice' ? 'pstn' : 'standard')
      const interaction: CallInteraction = {
        bankAppCustomerType:
          source === 'bankapp-voice' || source === 'bankapp-video'
            ? bankAppCustomerType ?? 'registered'
            : undefined,
        endedBy: null,
        endedAt: null,
        endReasonName: null,
        flashUntil: now + INTERACTION_FLASH_MS,
        id,
        kind,
        phase: 'incoming',
        skillDisplayName: getCallInteractionSkillDisplayName(),
        source,
        startedAt: now,
        tabKey: id,
        title: getCallInteractionTitle(kind, source),
        transferContext,
      }

      createdId = id

      return {
        activeWorkspaceTabKey: activate
          ? interaction.tabKey
          : state.activeWorkspaceTabKey,
        bankAppVideoShareState:
          kind === 'video' && source === 'bankapp-video'
            ? state.bankAppVideoShareState
            : kind === 'video'
              ? 'idle'
              : state.bankAppVideoShareState,
        callInteractionOrder: [...remainingInteractionIds, id],
        callInteractionSeq: nextSeq,
        callInteractions: {
          ...remainingInteractions,
          [id]: interaction,
        },
        currentCallInteractionId: id,
        isOpenEyeVideoWindowVisible: false,
        isScreenShareActive:
          kind === 'video' && source === 'bankapp-video'
            ? state.isScreenShareActive
            : kind === 'video'
              ? false
              : state.isScreenShareActive,
      }
    })

    return createdId
  },
  markCallInteractionActive: (interactionId) =>
    set((state) => {
      const interaction = state.callInteractions[interactionId]

      if (!interaction || interaction.phase === 'ended') {
        return {}
      }

      return {
        callInteractions: {
          ...state.callInteractions,
          [interactionId]: {
            ...interaction,
            phase: 'active',
          },
        },
      }
    }),
  markCallInteractionEnded: (
    interactionId,
    endedAt = Date.now(),
    endReasonName = 'Normal',
  ) =>
    set((state) => {
      const interaction = state.callInteractions[interactionId]

      if (!interaction || interaction.phase === 'ended') {
        return {}
      }

      return {
        bankAppVideoShareState:
          interaction.kind === 'video' ? 'idle' : state.bankAppVideoShareState,
        callInteractions: {
          ...state.callInteractions,
          [interactionId]: {
            ...interaction,
            endedBy: 'Agent',
            endedAt,
            endReasonName,
            phase: 'ended',
          },
        },
        currentCallInteractionId:
          state.currentCallInteractionId === interactionId
            ? null
            : state.currentCallInteractionId,
        isOpenEyeVideoWindowVisible:
          interaction.kind === 'video'
            ? false
            : state.isOpenEyeVideoWindowVisible,
        isScreenShareActive:
          interaction.kind === 'video' ? false : state.isScreenShareActive,
      }
    }),
  clearCurrentCallInteraction: () =>
    set({
      currentCallInteractionId: null,
    }),
  markLiveChat2SessionRead: (sessionId) =>
    set((state) => {
      const sourceOverride = state.liveChat2LastMessageOverrides[sessionId]

      return {
        liveChat2LastMessageOverrides: sourceOverride
          ? {
              ...state.liveChat2LastMessageOverrides,
              [sessionId]: {
                ...sourceOverride,
                unreadCount: 0,
              },
            }
          : state.liveChat2LastMessageOverrides,
        liveChat2ReadSessionIds: state.liveChat2ReadSessionIds.includes(
          sessionId,
        )
          ? state.liveChat2ReadSessionIds
          : [...state.liveChat2ReadSessionIds, sessionId],
      }
    }),
  markLiveChatSessionRead: (sessionId) =>
    set((state) =>
      state.readLiveChatSessionIds.includes(sessionId)
        ? {}
        : {
            readLiveChatSessionIds: [
              ...state.readLiveChatSessionIds,
              sessionId,
            ],
          },
    ),
  requestBankAppDemoWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'bankapp-demo',
      isBankAppDemoTabOpen: true,
    }),
  requestEmailWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'email',
      isEmailTabOpen: true,
    }),
  requestSocialMediaWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'social-media',
      isSocialMediaTabOpen: true,
    }),
  requestBankAppPinVerification: (target = 'bankapp') =>
    set((state) => {
      if (
        state.bankAppPinVerificationStatus === 'sent' ||
        state.bankAppPinVerificationStatus === 'verified' ||
        state.bankAppPinVerificationAttempts >= 3
      ) {
        return {}
      }

      return {
        activeWorkspaceTabKey:
          target === 'webchat' ? 'webchat-demo' : 'bankapp-demo',
        bankAppPinVerificationAttempts:
          state.bankAppPinVerificationAttempts + 1,
        bankAppPinVerificationRequestId:
          state.bankAppPinVerificationRequestId + 1,
        bankAppPinVerificationStatus: 'sent',
        isBankAppDemoTabOpen:
          target === 'webchat' ? state.isBankAppDemoTabOpen : true,
        isWebchatDemoTabOpen:
          target === 'webchat' ? true : state.isWebchatDemoTabOpen,
      }
    }),
  requestWebchatDemoWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'webchat-demo',
      isWebchatDemoTabOpen: true,
    }),
  requestWhatsAppDemoWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'whatsapp-demo',
      isWhatsAppDemoTabOpen: true,
    }),
  resetVerificationRules: () =>
    set({
      verificationRules: cloneVerificationRules(),
    }),
  resetVerificationRuleV2: () => set(cloneVerificationRuleV2State()),
  requestBankAppVideoCall: (activate = false, customerType = 'registered') =>
    set((state) => ({
      bankAppVideoCallActivateWorkspace: activate,
      bankAppVideoCustomerType: customerType,
      bankAppVideoCallRequestId: state.bankAppVideoCallRequestId + 1,
    })),
  requestBankAppVoiceCall: (activate = false, customerType = 'registered') =>
    set((state) => ({
      bankAppVoiceCallActivateWorkspace: activate,
      bankAppVoiceCustomerType: customerType,
      bankAppVoiceCallRequestId: state.bankAppVoiceCallRequestId + 1,
    })),
  requestLiveChat2Workspace: (sessionIds, options) =>
    set((state) => {
      const now = Date.now()
      const nextActiveSessionIds = [
        ...state.activeLiveChat2SessionIds,
        ...sessionIds.filter(
          (sessionId) =>
            !state.activeLiveChat2SessionIds.includes(sessionId) &&
            !state.liveChat2ClosedSessionIds.includes(sessionId),
        ),
      ]
      const nextTimings = { ...state.liveChat2SessionTimings }
      const nextStatuses = { ...state.liveChat2SessionStatuses }
      const nextStarColors = { ...state.liveChat2StarColors }
      const nextUnanswered = {
        ...state.liveChat2UnansweredSinceBySessionId,
      }

      sessionIds.forEach((sessionId) => {
        const initialElapsedSeconds =
          options?.initialElapsedSeconds?.[sessionId]
        const safeInitialElapsedSeconds =
          typeof initialElapsedSeconds === 'number'
            ? Math.max(0, initialElapsedSeconds)
            : 0

        if (!nextTimings[sessionId]) {
          nextTimings[sessionId] = {
            flashUntil: now + INTERACTION_FLASH_MS,
            startedAt: now - safeInitialElapsedSeconds * 1000,
          }
        }

        if (!nextStatuses[sessionId]) {
          const initialStatus = options?.initialSessionStatuses?.[sessionId]
          nextStatuses[sessionId] = initialStatus
            ? {
                ...initialStatus,
                endedAt:
                  initialStatus.status === 'ended'
                    ? (initialStatus.endedAt ?? now)
                    : null,
              }
            : createLiveChat2Status('active')
        }

        const initialStarColor = options?.initialStarColors?.[sessionId]
        if (initialStarColor && !nextStarColors[sessionId]) {
          nextStarColors[sessionId] = initialStarColor
        }

        const initialUnansweredSeconds =
          options?.initialUnansweredSeconds?.[sessionId]
        if (
          typeof initialUnansweredSeconds === 'number' &&
          !nextUnanswered[sessionId]
        ) {
          const safeInitialUnansweredSeconds =
            safeInitialElapsedSeconds > 0
              ? Math.min(
                  Math.max(0, initialUnansweredSeconds),
                  safeInitialElapsedSeconds,
                )
              : Math.max(0, initialUnansweredSeconds)
          nextUnanswered[sessionId] =
            now - safeInitialUnansweredSeconds * 1000
        }
      })

      return {
        activeLiveChat2SessionIds: nextActiveSessionIds,
        activeWorkspaceTabKey:
          options?.activate === false
            ? state.activeWorkspaceTabKey
            : LIVE_CHAT_TAB_KEY,
        isLiveChatTabOpen: true,
        isLiveChat2TabOpen: false,
        liveChat2FocusRequestId:
          sessionIds.length > 0
            ? state.liveChat2FocusRequestId + 1
            : state.liveChat2FocusRequestId,
        liveChat2FocusSessionId:
          state.liveChat2FocusSessionId ?? sessionIds[0] ?? null,
        liveChat2SessionStatuses: nextStatuses,
        liveChat2SessionTimings: nextTimings,
        liveChat2StarColors: nextStarColors,
        liveChat2UnansweredSinceBySessionId: nextUnanswered,
      }
    }),
  requestLiveChatWorkspace: (sessionId, activate = true, bankAppCustomerType) =>
    set((state) => {
      const liveChat2SessionId = getLiveChat2ReplacementSessionId(sessionId)
      const sourceSession = liveChat2SessionId
        ? liveChat2SessionById[liveChat2SessionId]
        : null
      const now = Date.now()
      const nextHandoffSeq = state.liveChat2HandoffSeq + 1
      const handoffSessionId =
        liveChat2SessionId && sourceSession
          ? `${liveChat2SessionId}-handoff-${nextHandoffSeq}`
          : null
      const handoffSession =
        handoffSessionId && sourceSession
          ? createLiveChat2HandoffSession(
              sourceSession,
              handoffSessionId,
              1000 + nextHandoffSeq,
              now,
              bankAppCustomerType,
            )
          : null
      let nextActiveSessionIds = state.activeLiveChat2SessionIds
      let nextClosedSessionIds = state.liveChat2ClosedSessionIds
      let nextDrafts = state.liveChat2DraftMessages
      let nextLastMessageOverrides = state.liveChat2LastMessageOverrides
      let nextMessagesBySessionId = state.liveChat2MessagesBySessionId
      let nextReadSessionIds = state.liveChat2ReadSessionIds
      let nextRecalledMessageIds = state.liveChat2RecalledMessageIds
      let nextSessionStatuses = state.liveChat2SessionStatuses
      let nextSessionTimings = state.liveChat2SessionTimings
      let nextStarColors = state.liveChat2StarColors
      let nextUnanswered = state.liveChat2UnansweredSinceBySessionId
      let nextSessionInstances = state.liveChat2SessionInstances

      if (handoffSessionId && handoffSession) {
        const initialUnansweredSeconds =
          typeof handoffSession.initialUnansweredSeconds === 'number'
            ? 0
            : null

        nextActiveSessionIds = [
          ...state.activeLiveChat2SessionIds,
          handoffSessionId,
        ]
        nextClosedSessionIds = state.liveChat2ClosedSessionIds.filter(
          (closedSessionId) => closedSessionId !== handoffSessionId,
        )
        nextDrafts = { ...state.liveChat2DraftMessages }
        nextLastMessageOverrides = {
          ...state.liveChat2LastMessageOverrides,
        }
        nextMessagesBySessionId = {
          ...state.liveChat2MessagesBySessionId,
        }
        nextReadSessionIds = state.liveChat2ReadSessionIds.filter(
          (readSessionId) => readSessionId !== handoffSessionId,
        )
        nextRecalledMessageIds = state.liveChat2RecalledMessageIds.filter(
          (messageId) => !messageId.includes(handoffSessionId),
        )
        nextSessionInstances = {
          ...state.liveChat2SessionInstances,
          [handoffSessionId]: handoffSession,
        }
        nextSessionStatuses = {
          ...state.liveChat2SessionStatuses,
          [handoffSessionId]: createLiveChat2Status('active'),
        }
        nextSessionTimings = {
          ...state.liveChat2SessionTimings,
          [handoffSessionId]: {
            flashUntil: now + INTERACTION_FLASH_MS,
            startedAt: now,
          },
        }
        nextStarColors = {
          ...state.liveChat2StarColors,
          [handoffSessionId]: 'gray',
        }
        nextUnanswered = { ...state.liveChat2UnansweredSinceBySessionId }

        if (initialUnansweredSeconds === null) {
          delete nextUnanswered[handoffSessionId]
        } else {
          nextUnanswered[handoffSessionId] =
            now - initialUnansweredSeconds * 1000
        }
      }

      return {
        activeLiveChat2SessionIds: nextActiveSessionIds,
        activeLiveChatSessionIds: [],
        activeWorkspaceTabKey: activate
          ? LIVE_CHAT_TAB_KEY
          : state.activeWorkspaceTabKey,
        isLiveChat2TabOpen: false,
        isLiveChatTabOpen: true,
        liveChat2ClosedSessionIds: nextClosedSessionIds,
        liveChat2DraftMessages: nextDrafts,
        liveChat2FocusRequestId: handoffSessionId
          ? state.liveChat2FocusRequestId + 1
          : state.liveChat2FocusRequestId,
        liveChat2FocusSessionId:
          handoffSessionId ?? state.liveChat2FocusSessionId,
        liveChat2LastMessageOverrides: nextLastMessageOverrides,
        liveChat2MessagesBySessionId: nextMessagesBySessionId,
        liveChat2ReadSessionIds: nextReadSessionIds,
        liveChat2RecalledMessageIds: nextRecalledMessageIds,
        liveChat2SessionInstances: nextSessionInstances,
        liveChat2SessionStatuses: nextSessionStatuses,
        liveChat2SessionTimings: nextSessionTimings,
        liveChat2StarColors: nextStarColors,
        liveChat2UnansweredSinceBySessionId: nextUnanswered,
        liveChat2HandoffSeq: handoffSessionId
          ? nextHandoffSeq
          : state.liveChat2HandoffSeq,
        liveChatFocusRequestId: state.liveChatFocusRequestId,
        liveChatFocusSessionId: null,
        liveChatSessionTimings: {},
        readLiveChatSessionIds: [],
      }
    }),
  requestCustomerOutboundCall: () =>
    set((state) => ({
      customerOutboundCallRequestId:
        state.customerOutboundCallRequestId + 1,
    })),
  openWorkspacePageTab: (tabKey) =>
    set((state) => ({
      activeWorkspaceTabKey: tabKey,
      workspacePageTabOrder: state.workspacePageTabOrder.includes(tabKey)
        ? state.workspacePageTabOrder
        : [...state.workspacePageTabOrder, tabKey],
    })),
  requestMonitoringMonitorWorkspace: (
    viewKey = defaultMonitoringMonitorViewKey,
  ) =>
    set({
      activeWorkspaceTabKey: MONITORING_MONITOR_TAB_KEY,
      currentMonitoringMonitorViewKey: viewKey,
      isMonitoringMonitorTabOpen: true,
    }),
  resetMonitoringViews: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === MONITORING_MONITOR_TAB_KEY
          ? 'home'
          : state.activeWorkspaceTabKey,
      currentMonitoringHomeViewKey: defaultMonitoringHomeViewKey,
      currentMonitoringMonitorViewKey: defaultMonitoringMonitorViewKey,
      isMonitoringMonitorTabOpen: false,
    })),
  selectMonitoringHomeView: (viewKey) =>
    set({
      activeWorkspaceTabKey: 'home',
      currentMonitoringHomeViewKey: viewKey,
    }),
  setActiveWorkspaceTabKey: (tabKey) =>
    set({
      activeWorkspaceTabKey: tabKey,
    }),
  setAgentServiceMode: (agentServiceMode) =>
    set({
      agentServiceMode,
    }),
  setCollapsed: (collapsed) => set({ collapsed }),
  setDigitalHandoffReadiness: (digitalHandoffReadiness) =>
    set({
      digitalHandoffReadiness,
    }),
  setLiveChat2DraftMessage: (sessionId, message) =>
    set((state) => {
      const nextDrafts = { ...state.liveChat2DraftMessages }

      if (message) {
        nextDrafts[sessionId] = message
      } else {
        delete nextDrafts[sessionId]
      }

      return {
        liveChat2DraftMessages: nextDrafts,
      }
    }),
  setLiveChat2FocusedSession: (sessionId) =>
    set((state) => ({
      liveChat2FocusRequestId: state.liveChat2FocusRequestId + 1,
      liveChat2FocusSessionId: sessionId,
    })),
  setLiveChat2SortMode: (liveChat2SortMode) =>
    set({
      liveChat2SortMode,
    }),
  setLiveChat2StarColor: (sessionId, starColor) =>
    set((state) => ({
      liveChat2StarColors: {
        ...state.liveChat2StarColors,
        [sessionId]: starColor,
      },
    })),
  setLiveChatTabOpen: (open, options) =>
    set((state) => {
      if (!open) {
        return {
          activeLiveChat2SessionIds: [],
          activeLiveChatSessionIds: [],
          activeWorkspaceTabKey:
            state.activeWorkspaceTabKey === LIVE_CHAT_TAB_KEY
              ? 'home'
              : state.activeWorkspaceTabKey,
          isLiveChat2TabOpen: false,
          isLiveChatTabOpen: false,
          liveChat2ClosedSessionIds: [],
          liveChat2DraftMessages: {},
          liveChat2FocusSessionId: null,
          liveChat2LastMessageOverrides: {},
          liveChat2MessagesBySessionId: {},
          liveChat2ReadSessionIds: [],
          liveChat2RecalledMessageIds: [],
          liveChat2SessionInstances: {},
          liveChat2SessionStatuses: {},
          liveChat2SessionTimings: {},
          liveChat2StarColors: {},
          liveChat2UnansweredSinceBySessionId: {},
          liveChat2HandoffSeq: 0,
          liveChatFocusSessionId: null,
          liveChatSessionTimings: {},
          readLiveChatSessionIds: [],
        }
      }

      const shouldSeedDefaultCurrentSessions =
        options?.seedDefaultCurrentSessions === true &&
        state.activeLiveChat2SessionIds.length === 0 &&
        state.liveChat2ClosedSessionIds.length === 0 &&
        Object.keys(state.liveChat2SessionInstances).length === 0 &&
        Object.keys(state.liveChat2SessionStatuses).length === 0
      const defaultCurrentState = shouldSeedDefaultCurrentSessions
        ? createDefaultLiveChat2CurrentState(Date.now())
        : null

      return {
        activeLiveChat2SessionIds:
          defaultCurrentState?.activeSessionIds ??
          state.activeLiveChat2SessionIds,
        activeLiveChatSessionIds: state.activeLiveChatSessionIds,
        activeWorkspaceTabKey: state.activeWorkspaceTabKey,
        isLiveChat2TabOpen: false,
        isLiveChatTabOpen: true,
        liveChat2ClosedSessionIds: state.liveChat2ClosedSessionIds,
        liveChat2DraftMessages: state.liveChat2DraftMessages,
        liveChat2FocusRequestId: defaultCurrentState
          ? state.liveChat2FocusRequestId + 1
          : state.liveChat2FocusRequestId,
        liveChat2FocusSessionId:
          defaultCurrentState?.activeSessionIds[0] ??
          state.liveChat2FocusSessionId,
        liveChat2LastMessageOverrides: state.liveChat2LastMessageOverrides,
        liveChat2MessagesBySessionId: state.liveChat2MessagesBySessionId,
        liveChat2ReadSessionIds: state.liveChat2ReadSessionIds,
        liveChat2RecalledMessageIds: state.liveChat2RecalledMessageIds,
        liveChat2SessionInstances: state.liveChat2SessionInstances,
        liveChat2SessionStatuses:
          defaultCurrentState?.sessionStatuses ??
          state.liveChat2SessionStatuses,
        liveChat2SessionTimings:
          defaultCurrentState?.sessionTimings ?? state.liveChat2SessionTimings,
        liveChat2StarColors:
          defaultCurrentState?.starColors ?? state.liveChat2StarColors,
        liveChat2UnansweredSinceBySessionId:
          defaultCurrentState?.unansweredSinceBySessionId ??
          state.liveChat2UnansweredSinceBySessionId,
        liveChat2HandoffSeq: state.liveChat2HandoffSeq,
        liveChatFocusSessionId: state.liveChatFocusSessionId,
        liveChatSessionTimings: state.liveChatSessionTimings,
        readLiveChatSessionIds: state.readLiveChatSessionIds,
      }
    }),
  setOpenEyeVideoWindowVisible: (visible) =>
    set({
      isOpenEyeVideoWindowVisible: visible,
    }),
  setScreenShareActive: (active) =>
    set({
      isScreenShareActive: active,
    }),
  setVoiceVideoHandoffReadiness: (voiceVideoHandoffReadiness) =>
    set({
      voiceVideoHandoffReadiness,
    }),
  updateVerificationRule: (rule) =>
    set((state) => ({
      verificationRules: state.verificationRules.map((item) =>
        item.id === rule.id
          ? {
              ...rule,
              notes: [...rule.notes],
              questions: rule.questions.map((question) => ({ ...question })),
              requiredGroups: { ...rule.requiredGroups },
            }
          : item,
      ),
    })),
  upsertVerificationV2Question: (question) =>
    set((state) => {
      const nextQuestion = { ...question }
      const existingQuestion = state.verificationV2QuestionBank.some(
        (item) => item.id === question.id,
      )

      return {
        verificationV2QuestionBank: existingQuestion
          ? state.verificationV2QuestionBank.map((item) =>
              item.id === question.id ? nextQuestion : item,
            )
          : [...state.verificationV2QuestionBank, nextQuestion],
      }
    }),
  upsertVerificationV2Rule: (rule) =>
    set((state) => {
      const nextRule = cloneVerificationV2Rules([rule])[0]
      const existingRule = state.verificationV2Rules.some(
        (item) => item.id === rule.id,
      )

      return {
        verificationV2Rules: existingRule
          ? state.verificationV2Rules.map((item) =>
              item.id === rule.id ? nextRule : item,
            )
          : [...state.verificationV2Rules, nextRule],
      }
    }),
  deleteVerificationV2Rule: (ruleId) =>
    set((state) => ({
      verificationV2Rules: state.verificationV2Rules.filter(
        (rule) => rule.id !== ruleId,
      ),
    })),
  deleteVerificationV2Question: (questionId) =>
    set((state) => ({
      verificationV2QuestionBank: state.verificationV2QuestionBank.filter(
        (question) => question.id !== questionId,
      ),
      verificationV2Rules: state.verificationV2Rules.map((rule) => {
        const removeQuestion = (questionIds: string[]) =>
          questionIds.filter((id) => id !== questionId)

        return {
          ...rule,
          groups: rule.groups
            ? {
                alternative: {
                  ...rule.groups.alternative,
                  questionIds: removeQuestion(
                    rule.groups.alternative.questionIds,
                  ),
                },
                dynamic: {
                  ...rule.groups.dynamic,
                  questionIds: removeQuestion(
                    rule.groups.dynamic.questionIds,
                  ),
                },
                mandatory: {
                  ...rule.groups.mandatory,
                  questionIds: removeQuestion(
                    rule.groups.mandatory.questionIds,
                  ),
                },
                static: {
                  ...rule.groups.static,
                  questionIds: removeQuestion(
                    rule.groups.static.questionIds,
                  ),
                },
              }
            : undefined,
          scenarios: rule.scenarios?.map((scenario) => ({
            ...scenario,
            questionBlocks: scenario.questionBlocks.map((block) => ({
              ...block,
              questionIds: removeQuestion(block.questionIds),
            })),
          })),
          specialRules: {
            ...rule.specialRules,
            scenarios: rule.specialRules.scenarios.map((scenario) => ({
              ...scenario,
              questionIds: removeQuestion(scenario.questionIds),
            })),
          },
        }
      }),
    })),
  startBankAppVideoScreenShare: () =>
    set({
      activeWorkspaceTabKey: 'bankapp-demo',
      bankAppVideoShareState: 'sharing',
      isBankAppDemoTabOpen: true,
      isScreenShareActive: true,
    }),
  stopBankAppVideoScreenShare: () =>
    set({
      bankAppVideoShareState: 'idle',
      isScreenShareActive: false,
    }),
  resetBankAppPinVerification: () =>
    set({
      bankAppPinVerificationAttempts: 0,
      bankAppPinVerificationStatus: 'idle',
    }),
  resetBankAppVideoDesktopShare: () =>
    set({
      bankAppVideoShareState: 'idle',
      isScreenShareActive: false,
    }),
  closeLiveChat2Session: (sessionId) =>
    set((state) => {
      const nextActiveSessionIds = state.activeLiveChat2SessionIds.filter(
        (activeSessionId) => activeSessionId !== sessionId,
      )
      const nextSessionTimings = { ...state.liveChat2SessionTimings }
      const nextUnanswered = {
        ...state.liveChat2UnansweredSinceBySessionId,
      }
      delete nextSessionTimings[sessionId]
      delete nextUnanswered[sessionId]

      return {
        activeLiveChat2SessionIds: nextActiveSessionIds,
        liveChat2ClosedSessionIds: state.liveChat2ClosedSessionIds.includes(
          sessionId,
        )
          ? state.liveChat2ClosedSessionIds
          : [sessionId, ...state.liveChat2ClosedSessionIds].slice(0, 30),
        liveChat2FocusSessionId:
          state.liveChat2FocusSessionId === sessionId
            ? nextActiveSessionIds[0] ?? null
            : state.liveChat2FocusSessionId,
        liveChat2ReadSessionIds: state.liveChat2ReadSessionIds.filter(
          (readSessionId) => readSessionId !== sessionId,
        ),
        liveChat2SessionTimings: nextSessionTimings,
        liveChat2UnansweredSinceBySessionId: nextUnanswered,
      }
    }),
  endLiveChat2Session: (
    sessionId,
    endReason = 'agent',
    baseMessages = [],
    endReasonName = 'Normal',
  ) =>
    set((state) => {
      const now = Date.now()
      const time = formatCurrentLiveChat2Time()
      const currentMessages = state.liveChat2MessagesBySessionId[sessionId]
      const systemMessage: LiveChat2Message = {
        id: `livechat2-system-${sessionId}-${now}`,
        kind: 'system',
        message:
          endReason === 'agent'
            ? endReasonName === 'Normal'
              ? 'Agent ended this service conversation.'
              : `Agent ended this service conversation. Reason: ${endReasonName}.`
            : endReason === 'customer'
              ? 'This user has ended the session.'
              : 'This session was closed due to customer timeout.',
        sender: 'system',
        senderName: 'System',
        time,
        timestamp: new Date(now).toISOString(),
      }

      const nextUnanswered = {
        ...state.liveChat2UnansweredSinceBySessionId,
      }
      delete nextUnanswered[sessionId]

      return {
        liveChat2LastMessageOverrides: {
          ...state.liveChat2LastMessageOverrides,
          [sessionId]: {
            lastMessage: systemMessage.message,
            lastMessageAt: systemMessage.timestamp,
            lastMessageTime: time,
            unreadCount: 0,
          },
        },
        liveChat2MessagesBySessionId: {
          ...state.liveChat2MessagesBySessionId,
          [sessionId]: [
            ...(currentMessages ?? baseMessages),
            systemMessage,
          ],
        },
        liveChat2ReadSessionIds: state.liveChat2ReadSessionIds.includes(
          sessionId,
        )
          ? state.liveChat2ReadSessionIds
          : [...state.liveChat2ReadSessionIds, sessionId],
        liveChat2SessionStatuses: {
          ...state.liveChat2SessionStatuses,
          [sessionId]: {
            endedBy:
              endReason === 'customer'
                ? 'Customer'
                : endReason === 'timeout'
                  ? 'System'
                  : 'Agent',
            endedAt: now,
            endReason,
            endReasonName:
              endReason === 'timeout' ? 'Customer Timeout' : endReasonName,
            status: 'ended',
          },
        },
        liveChat2UnansweredSinceBySessionId: nextUnanswered,
      }
    }),
  recallLiveChat2Message: (messageId) =>
    set((state) =>
      state.liveChat2RecalledMessageIds.includes(messageId)
        ? {}
        : {
            liveChat2RecalledMessageIds: [
              ...state.liveChat2RecalledMessageIds,
              messageId,
            ],
          },
    ),
  sendLiveChat2Message: (sessionId, message, baseMessages, quotedMessage) =>
    set((state) => {
      const now = Date.now()
      const time = formatCurrentLiveChat2Time()
      const nextMessage: LiveChat2Message = {
        id: `livechat2-agent-${sessionId}-${now}`,
        isCurrentAgent: true,
        kind: 'text',
        message,
        sender: 'agent',
        senderName: 'Nadia Putri',
        time,
        timestamp: new Date(now).toISOString(),
        quotedMessage: quotedMessage || undefined,
      }
      const nextDrafts = { ...state.liveChat2DraftMessages }
      const nextUnanswered = {
        ...state.liveChat2UnansweredSinceBySessionId,
      }
      delete nextDrafts[sessionId]
      delete nextUnanswered[sessionId]

      return {
        liveChat2DraftMessages: nextDrafts,
        liveChat2LastMessageOverrides: {
          ...state.liveChat2LastMessageOverrides,
          [sessionId]: {
            lastMessage: message,
            lastMessageAt: nextMessage.timestamp,
            lastMessageTime: time,
            unreadCount: 0,
          },
        },
        liveChat2MessagesBySessionId: {
          ...state.liveChat2MessagesBySessionId,
          [sessionId]: [
            ...(state.liveChat2MessagesBySessionId[sessionId] ??
              baseMessages),
            nextMessage,
          ],
        },
        liveChat2ReadSessionIds: state.liveChat2ReadSessionIds.includes(
          sessionId,
        )
          ? state.liveChat2ReadSessionIds
          : [...state.liveChat2ReadSessionIds, sessionId],
        liveChat2UnansweredSinceBySessionId: nextUnanswered,
      }
    }),
  clearLiveChat2Sessions: () =>
    set((state) => ({
      activeLiveChat2SessionIds: [],
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === LEGACY_LIVECHAT2_TAB_KEY
          ? state.isLiveChatTabOpen
            ? LIVE_CHAT_TAB_KEY
            : 'home'
          : state.activeWorkspaceTabKey,
      isLiveChat2TabOpen: false,
      liveChat2ClosedSessionIds: [],
      liveChat2DraftMessages: {},
      liveChat2FocusSessionId: null,
      liveChat2LastMessageOverrides: {},
      liveChat2MessagesBySessionId: {},
      liveChat2ReadSessionIds: [],
      liveChat2RecalledMessageIds: [],
      liveChat2SessionInstances: {},
      liveChat2SessionStatuses: {},
      liveChat2SessionTimings: {},
      liveChat2StarColors: {},
      liveChat2UnansweredSinceBySessionId: {},
      liveChat2HandoffSeq: 0,
    })),
  clearLiveChatSessions: () =>
    set({
      activeLiveChatSessionIds: [],
      liveChatFocusSessionId: null,
      liveChatSessionTimings: {},
      readLiveChatSessionIds: [],
    }),
}))
