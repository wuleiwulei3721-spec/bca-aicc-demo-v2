import { create } from 'zustand'

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
  isLiveChatTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isScreenShareActive: boolean
  isWhatsAppDemoTabOpen: boolean
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
  markLiveChatSessionRead: (sessionId: string) => void
  clearCurrentCallInteraction: () => void
  requestBankAppDemoWorkspace: () => void
  requestBankAppVideoCall: (activate?: boolean) => void
  requestBankAppVoiceCall: (activate?: boolean) => void
  requestLiveChatWorkspace: (sessionId?: string, activate?: boolean) => void
  requestCustomerOutboundCall: () => void
  requestWhatsAppDemoWorkspace: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
  setLiveChatTabOpen: (open: boolean) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
  setScreenShareActive: (active: boolean) => void
  setVoiceVideoHandoffReadiness: (
    readiness: VoiceVideoHandoffReadiness,
  ) => void
  startBankAppVideoShareSelection: () => void
  resetBankAppVideoDesktopShare: () => void
  clearLiveChatSessions: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  activeLiveChatSessionIds: [],
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
  isLiveChatTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isScreenShareActive: false,
  isWhatsAppDemoTabOpen: false,
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
              (state.isLiveChatTabOpen ? 'live-chat' : 'home')
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
  clearLiveChatSessions: () =>
    set({
      activeLiveChatSessionIds: [],
      liveChatFocusSessionId: null,
      liveChatSessionTimings: {},
      readLiveChatSessionIds: [],
    }),
}))
