import { create } from 'zustand'

export type InboundPopupSource = 'pstn' | 'bankapp-voice'
export type VideoCallPopupSource = 'standard' | 'bankapp-video'
export type BankAppVideoShareState = 'idle' | 'selecting-program' | 'sharing'

export interface InteractionTiming {
  flashUntil: number
  startedAt: number
}

const INTERACTION_FLASH_MS = 5000

function createInteractionTiming(): InteractionTiming {
  const now = Date.now()

  return {
    flashUntil: now + INTERACTION_FLASH_MS,
    startedAt: now,
  }
}

interface AppState {
  activeWorkspaceTabKey: string
  activeLiveChatSessionIds: string[]
  bankAppVideoCallActivateWorkspace: boolean
  bankAppVideoCallRequestId: number
  bankAppVideoShareState: BankAppVideoShareState
  bankAppVoiceCallActivateWorkspace: boolean
  bankAppVoiceCallRequestId: number
  collapsed: boolean
  customerOutboundCallRequestId: number
  inboundPopupSource: InboundPopupSource
  videoCallPopupSource: VideoCallPopupSource
  inboundInteractionTiming: InteractionTiming | null
  isBankAppDemoTabOpen: boolean
  isInboundTabOpen: boolean
  isLiveChatTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isScreenShareActive: boolean
  isVideoCallTabOpen: boolean
  isWhatsAppDemoTabOpen: boolean
  liveChatSessionTimings: Record<string, InteractionTiming>
  videoCallInteractionTiming: InteractionTiming | null
  inboundPopupRequestId: number
  liveChatFocusRequestId: number
  liveChatFocusSessionId: string | null
  videoCallPopupRequestId: number
  closeBankAppDemoTab: () => void
  closeInboundTab: () => void
  closeLiveChatSession: (sessionId: string) => void
  closeVideoCallTab: () => void
  closeWhatsAppDemoTab: () => void
  confirmBankAppVideoScreenShare: () => void
  clearCallInteractionTimings: () => void
  requestBankAppDemoWorkspace: () => void
  requestBankAppVideoCall: (activate?: boolean) => void
  requestBankAppVoiceCall: (activate?: boolean) => void
  requestLiveChatWorkspace: (sessionId?: string, activate?: boolean) => void
  requestInboundPopup: (source?: InboundPopupSource, activate?: boolean) => void
  requestVideoCallPopup: (
    source?: VideoCallPopupSource,
    activate?: boolean,
  ) => void
  requestCustomerOutboundCall: () => void
  requestWhatsAppDemoWorkspace: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
  setLiveChatTabOpen: (open: boolean) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
  setScreenShareActive: (active: boolean) => void
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
  collapsed: true,
  customerOutboundCallRequestId: 0,
  inboundPopupSource: 'pstn',
  videoCallPopupSource: 'standard',
  inboundInteractionTiming: null,
  isBankAppDemoTabOpen: false,
  isInboundTabOpen: false,
  isLiveChatTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isScreenShareActive: false,
  isVideoCallTabOpen: false,
  isWhatsAppDemoTabOpen: false,
  liveChatSessionTimings: {},
  videoCallInteractionTiming: null,
  inboundPopupRequestId: 0,
  liveChatFocusRequestId: 0,
  liveChatFocusSessionId: null,
  videoCallPopupRequestId: 0,
  closeBankAppDemoTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'bankapp-demo'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isBankAppDemoTabOpen: false,
    })),
  closeInboundTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'inbound'
          ? state.isVideoCallTabOpen
            ? 'video-call'
            : 'home'
          : state.activeWorkspaceTabKey,
      inboundInteractionTiming: null,
      isInboundTabOpen: false,
    })),
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
        liveChatFocusSessionId:
          state.liveChatFocusSessionId === sessionId
            ? nextActiveSessionIds[0] ?? null
            : state.liveChatFocusSessionId,
      }
    }),
  closeVideoCallTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'video-call'
          ? state.isInboundTabOpen
            ? 'inbound'
            : 'home'
          : state.activeWorkspaceTabKey,
      isOpenEyeVideoWindowVisible: false,
      isScreenShareActive: false,
      bankAppVideoShareState: 'idle',
      isVideoCallTabOpen: false,
      videoCallInteractionTiming: null,
    })),
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
  clearCallInteractionTimings: () =>
    set({
      inboundInteractionTiming: null,
      videoCallInteractionTiming: null,
    }),
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
      }
    }),
  requestInboundPopup: (source = 'pstn', activate = true) =>
    set((state) => ({
      activeWorkspaceTabKey: activate ? 'inbound' : state.activeWorkspaceTabKey,
      inboundInteractionTiming: createInteractionTiming(),
      inboundPopupSource: source,
      isInboundTabOpen: true,
      inboundPopupRequestId: state.inboundPopupRequestId + 1,
    })),
  requestVideoCallPopup: (source = 'standard', activate = true) =>
    set((state) => ({
      activeWorkspaceTabKey: activate
        ? 'video-call'
        : state.activeWorkspaceTabKey,
      bankAppVideoShareState:
        source === 'bankapp-video' ? state.bankAppVideoShareState : 'idle',
      isOpenEyeVideoWindowVisible: false,
      isScreenShareActive:
        source === 'bankapp-video' ? state.isScreenShareActive : false,
      isVideoCallTabOpen: true,
      videoCallInteractionTiming: createInteractionTiming(),
      videoCallPopupRequestId: state.videoCallPopupRequestId + 1,
      videoCallPopupSource: source,
    })),
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
    })),
  setOpenEyeVideoWindowVisible: (visible) =>
    set({
      isOpenEyeVideoWindowVisible: visible,
    }),
  setScreenShareActive: (active) =>
    set({
      isScreenShareActive: active,
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
    }),
}))
