import { create } from 'zustand'
import type {
  LiveChat2EndReason,
  LiveChat2Message,
  LiveChat2SessionStatus,
  LiveChat2SortMode,
  LiveChat2StarColor,
} from '../types'

export type InboundPopupSource = 'pstn' | 'bankapp-voice'
export type VideoCallPopupSource = 'standard' | 'bankapp-video'
export type BankAppVideoShareState = 'idle' | 'selecting-program' | 'sharing'
export type CallInteractionKind = 'voice' | 'video'
export type CallInteractionPhase = 'incoming' | 'active' | 'ended'
export type CallInteractionSource = InboundPopupSource | VideoCallPopupSource
export type VoiceVideoHandoffReadiness =
  | 'active-call'
  | 'available'
  | 'not-ready'

export interface InteractionTiming {
  flashUntil: number
  startedAt: number
}

export interface LiveChat2SessionStatusState {
  endedAt: number | null
  endReason: LiveChat2EndReason | null
  status: LiveChat2SessionStatus
}

export interface LiveChat2SessionSummaryOverride {
  lastMessage: string
  lastMessageAt: string
  lastMessageTime: string
  unreadCount: number
}

export interface CallInteraction {
  endedAt: number | null
  flashUntil: number
  id: string
  kind: CallInteractionKind
  phase: CallInteractionPhase
  source: CallInteractionSource
  startedAt: number
  tabKey: string
  title: string
}

const INTERACTION_FLASH_MS = 5000

function createInteractionTiming(): InteractionTiming {
  const now = Date.now()

  return {
    flashUntil: now + INTERACTION_FLASH_MS,
    startedAt: now,
  }
}

function formatCurrentLiveChat2Time() {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(new Date())
}

function createLiveChat2Status(
  status: LiveChat2SessionStatus,
  endReason: LiveChat2EndReason | null = null,
): LiveChat2SessionStatusState {
  return {
    endedAt: status === 'ended' ? Date.now() : null,
    endReason,
    status,
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

interface AppState {
  activeWorkspaceTabKey: string
  activeLiveChatSessionIds: string[]
  activeLiveChat2SessionIds: string[]
  bankAppVideoCallActivateWorkspace: boolean
  bankAppVideoCallRequestId: number
  bankAppVideoShareState: BankAppVideoShareState
  bankAppVoiceCallActivateWorkspace: boolean
  bankAppVoiceCallRequestId: number
  callInteractionOrder: string[]
  callInteractionSeq: number
  callInteractions: Record<string, CallInteraction>
  collapsed: boolean
  currentCallInteractionId: string | null
  customerOutboundCallRequestId: number
  isBankAppDemoTabOpen: boolean
  isLiveChat2TabOpen: boolean
  isLiveChatTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isScreenShareActive: boolean
  isWhatsAppDemoTabOpen: boolean
  liveChat2ClosedSessionIds: string[]
  liveChat2DraftMessages: Record<string, string>
  liveChat2FocusRequestId: number
  liveChat2FocusSessionId: string | null
  liveChat2LastMessageOverrides: Record<string, LiveChat2SessionSummaryOverride>
  liveChat2MessagesBySessionId: Record<string, LiveChat2Message[]>
  liveChat2ReadSessionIds: string[]
  liveChat2RecalledMessageIds: string[]
  liveChat2SessionStatuses: Record<string, LiveChat2SessionStatusState>
  liveChat2SessionTimings: Record<string, InteractionTiming>
  liveChat2SortMode: LiveChat2SortMode
  liveChat2StarColors: Record<string, LiveChat2StarColor>
  liveChat2UnansweredSinceBySessionId: Record<string, number>
  liveChatSessionTimings: Record<string, InteractionTiming>
  liveChatFocusRequestId: number
  liveChatFocusSessionId: string | null
  readLiveChatSessionIds: string[]
  voiceVideoHandoffReadiness: VoiceVideoHandoffReadiness
  closeAllCallInteractionTabs: () => void
  closeBankAppDemoTab: () => void
  closeCallInteractionTab: (interactionId: string) => void
  closeLiveChatSession: (sessionId: string) => void
  closeWhatsAppDemoTab: () => void
  confirmBankAppVideoScreenShare: () => void
  createCallInteraction: (
    kind: CallInteractionKind,
    source?: CallInteractionSource,
    activate?: boolean,
  ) => string
  markCallInteractionActive: (interactionId: string) => void
  markCallInteractionEnded: (interactionId: string, endedAt?: number) => void
  markLiveChat2SessionRead: (sessionId: string) => void
  markLiveChatSessionRead: (sessionId: string) => void
  clearCurrentCallInteraction: () => void
  requestBankAppDemoWorkspace: () => void
  requestBankAppVideoCall: (activate?: boolean) => void
  requestBankAppVoiceCall: (activate?: boolean) => void
  requestLiveChat2Workspace: (
    sessionIds: string[],
    options?: {
      initialStarColors?: Record<string, LiveChat2StarColor>
      initialUnansweredSeconds?: Record<string, number | null>
      activate?: boolean
    },
  ) => void
  requestLiveChatWorkspace: (sessionId?: string, activate?: boolean) => void
  requestCustomerOutboundCall: () => void
  requestWhatsAppDemoWorkspace: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
  setLiveChat2DraftMessage: (sessionId: string, message: string) => void
  setLiveChat2FocusedSession: (sessionId: string | null) => void
  setLiveChat2SortMode: (sortMode: LiveChat2SortMode) => void
  setLiveChat2StarColor: (
    sessionId: string,
    starColor: LiveChat2StarColor,
  ) => void
  setLiveChatTabOpen: (open: boolean) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
  setScreenShareActive: (active: boolean) => void
  setVoiceVideoHandoffReadiness: (
    readiness: VoiceVideoHandoffReadiness,
  ) => void
  startBankAppVideoShareSelection: () => void
  resetBankAppVideoDesktopShare: () => void
  closeLiveChat2Session: (sessionId: string) => void
  endLiveChat2Session: (
    sessionId: string,
    endReason?: LiveChat2EndReason,
    baseMessages?: LiveChat2Message[],
  ) => void
  recallLiveChat2Message: (messageId: string) => void
  sendLiveChat2Message: (
    sessionId: string,
    message: string,
    baseMessages: LiveChat2Message[],
  ) => void
  clearLiveChat2Sessions: () => void
  clearLiveChatSessions: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  activeLiveChatSessionIds: [],
  activeLiveChat2SessionIds: [],
  bankAppVideoCallActivateWorkspace: false,
  bankAppVideoCallRequestId: 0,
  bankAppVideoShareState: 'idle',
  bankAppVoiceCallActivateWorkspace: false,
  bankAppVoiceCallRequestId: 0,
  callInteractionOrder: [],
  callInteractionSeq: 0,
  callInteractions: {},
  collapsed: true,
  currentCallInteractionId: null,
  customerOutboundCallRequestId: 0,
  isBankAppDemoTabOpen: false,
  isLiveChat2TabOpen: false,
  isLiveChatTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isScreenShareActive: false,
  isWhatsAppDemoTabOpen: false,
  liveChat2ClosedSessionIds: [],
  liveChat2DraftMessages: {},
  liveChat2FocusRequestId: 0,
  liveChat2FocusSessionId: null,
  liveChat2LastMessageOverrides: {},
  liveChat2MessagesBySessionId: {},
  liveChat2ReadSessionIds: [],
  liveChat2RecalledMessageIds: [],
  liveChat2SessionStatuses: {},
  liveChat2SessionTimings: {},
  liveChat2SortMode: 'access-time',
  liveChat2StarColors: {},
  liveChat2UnansweredSinceBySessionId: {},
  liveChatSessionTimings: {},
  liveChatFocusRequestId: 0,
  liveChatFocusSessionId: null,
  readLiveChatSessionIds: [],
  voiceVideoHandoffReadiness: 'not-ready',
  closeAllCallInteractionTabs: () =>
    set((state) => ({
      activeWorkspaceTabKey: state.activeWorkspaceTabKey.startsWith('call-')
        ? state.isLiveChatTabOpen
          ? 'live-chat'
          : state.isLiveChat2TabOpen
            ? 'livechat2'
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
      isBankAppDemoTabOpen: false,
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
                ? 'live-chat'
                : state.isLiveChat2TabOpen
                  ? 'livechat2'
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
  closeWhatsAppDemoTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'whatsapp-demo'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isWhatsAppDemoTabOpen: false,
    })),
  confirmBankAppVideoScreenShare: () =>
    set({
      activeWorkspaceTabKey: 'bankapp-demo',
      bankAppVideoShareState: 'sharing',
      isBankAppDemoTabOpen: true,
      isScreenShareActive: true,
    }),
  createCallInteraction: (kind, rawSource, activate = true) => {
    let createdId = ''

    set((state) => {
      const nextSeq = state.callInteractionSeq + 1
      const id = `call-${nextSeq}`
      const now = Date.now()
      const source =
        rawSource ??
        (kind === 'voice' ? 'pstn' : 'standard')
      const interaction: CallInteraction = {
        endedAt: null,
        flashUntil: now + INTERACTION_FLASH_MS,
        id,
        kind,
        phase: 'incoming',
        source,
        startedAt: now,
        tabKey: id,
        title: getCallInteractionTitle(kind, source),
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
        callInteractionOrder: [...state.callInteractionOrder, id],
        callInteractionSeq: nextSeq,
        callInteractions: {
          ...state.callInteractions,
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
  markCallInteractionEnded: (interactionId, endedAt = Date.now()) =>
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
            endedAt,
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
  requestWhatsAppDemoWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'whatsapp-demo',
      isWhatsAppDemoTabOpen: true,
    }),
  requestBankAppVideoCall: (activate = false) =>
    set((state) => ({
      bankAppVideoCallActivateWorkspace: activate,
      bankAppVideoCallRequestId: state.bankAppVideoCallRequestId + 1,
    })),
  requestBankAppVoiceCall: (activate = false) =>
    set((state) => ({
      bankAppVoiceCallActivateWorkspace: activate,
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
        if (!nextTimings[sessionId]) {
          nextTimings[sessionId] = {
            flashUntil: now + INTERACTION_FLASH_MS,
            startedAt: now,
          }
        }

        if (!nextStatuses[sessionId]) {
          nextStatuses[sessionId] = createLiveChat2Status('active')
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
          nextUnanswered[sessionId] =
            now - Math.max(0, initialUnansweredSeconds) * 1000
        }
      })

      return {
        activeLiveChat2SessionIds: nextActiveSessionIds,
        activeWorkspaceTabKey:
          options?.activate === false
            ? state.activeWorkspaceTabKey
            : 'livechat2',
        isLiveChat2TabOpen: true,
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
  requestLiveChatWorkspace: (sessionId, activate = true) =>
    set((state) => {
      const nextActiveLiveChatSessionIds =
        sessionId && !state.activeLiveChatSessionIds.includes(sessionId)
          ? [...state.activeLiveChatSessionIds, sessionId]
          : state.activeLiveChatSessionIds
      const nextLiveChatSessionTimings =
        sessionId && !state.liveChatSessionTimings[sessionId]
          ? {
              ...state.liveChatSessionTimings,
              [sessionId]: createInteractionTiming(),
            }
          : state.liveChatSessionTimings
      const nextReadLiveChatSessionIds =
        sessionId && !state.activeLiveChatSessionIds.includes(sessionId)
          ? state.readLiveChatSessionIds.filter(
              (readSessionId) => readSessionId !== sessionId,
            )
          : state.readLiveChatSessionIds

      return {
        activeLiveChatSessionIds: nextActiveLiveChatSessionIds,
        activeWorkspaceTabKey: activate
          ? 'live-chat'
          : state.activeWorkspaceTabKey,
        isLiveChatTabOpen: true,
        liveChatFocusRequestId: sessionId
          ? state.liveChatFocusRequestId + 1
          : state.liveChatFocusRequestId,
        liveChatFocusSessionId: sessionId ?? state.liveChatFocusSessionId,
        liveChatSessionTimings: nextLiveChatSessionTimings,
        readLiveChatSessionIds: nextReadLiveChatSessionIds,
      }
    }),
  requestCustomerOutboundCall: () =>
    set((state) => ({
      customerOutboundCallRequestId:
        state.customerOutboundCallRequestId + 1,
    })),
  setActiveWorkspaceTabKey: (tabKey) =>
    set({
      activeWorkspaceTabKey: tabKey,
    }),
  setCollapsed: (collapsed) => set({ collapsed }),
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
  setLiveChatTabOpen: (open) =>
    set((state) => ({
      activeLiveChatSessionIds: open ? state.activeLiveChatSessionIds : [],
      activeWorkspaceTabKey:
        !open && state.activeWorkspaceTabKey === 'live-chat'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isLiveChatTabOpen: open,
      liveChatFocusSessionId: open ? state.liveChatFocusSessionId : null,
      liveChatSessionTimings: open ? state.liveChatSessionTimings : {},
      readLiveChatSessionIds: open ? state.readLiveChatSessionIds : [],
    })),
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
  startBankAppVideoShareSelection: () =>
    set({
      bankAppVideoShareState: 'selecting-program',
      isScreenShareActive: false,
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
  endLiveChat2Session: (sessionId, endReason = 'agent', baseMessages = []) =>
    set((state) => {
      const now = Date.now()
      const time = formatCurrentLiveChat2Time()
      const currentMessages = state.liveChat2MessagesBySessionId[sessionId]
      const systemMessage: LiveChat2Message = {
        id: `livechat2-system-${sessionId}-${now}`,
        kind: 'system',
        message:
          endReason === 'agent'
            ? 'Agent ended this service conversation.'
            : endReason === 'customer'
              ? 'Customer ended this service conversation.'
              : 'Customer timeout closed this service conversation.',
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
            endedAt: now,
            endReason,
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
  sendLiveChat2Message: (sessionId, message, baseMessages) =>
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
        state.activeWorkspaceTabKey === 'livechat2'
          ? state.isLiveChatTabOpen
            ? 'live-chat'
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
      liveChat2SessionStatuses: {},
      liveChat2SessionTimings: {},
      liveChat2StarColors: {},
      liveChat2UnansweredSinceBySessionId: {},
    })),
  clearLiveChatSessions: () =>
    set({
      activeLiveChatSessionIds: [],
      liveChatFocusSessionId: null,
      liveChatSessionTimings: {},
      readLiveChatSessionIds: [],
    }),
}))
