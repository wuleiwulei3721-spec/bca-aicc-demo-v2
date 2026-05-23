import { create } from 'zustand'

export type InboundPopupSource = 'pstn' | 'bankapp-voice'
export type VideoCallPopupSource = 'standard' | 'bankapp-video'

interface AppState {
  activeWorkspaceTabKey: string
  bankAppVideoCallRequestId: number
  bankAppVoiceCallRequestId: number
  collapsed: boolean
  customerOutboundCallRequestId: number
  inboundPopupSource: InboundPopupSource
  videoCallPopupSource: VideoCallPopupSource
  isBankAppDemoTabOpen: boolean
  isInboundTabOpen: boolean
  isLiveChatTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isVideoCallTabOpen: boolean
  inboundPopupRequestId: number
  liveChatFocusRequestId: number
  liveChatFocusSessionId: string | null
  videoCallPopupRequestId: number
  closeBankAppDemoTab: () => void
  closeInboundTab: () => void
  closeVideoCallTab: () => void
  requestBankAppDemoWorkspace: () => void
  requestBankAppVideoCall: () => void
  requestBankAppVoiceCall: () => void
  requestLiveChatWorkspace: (sessionId?: string, activate?: boolean) => void
  requestInboundPopup: (source?: InboundPopupSource, activate?: boolean) => void
  requestVideoCallPopup: (
    source?: VideoCallPopupSource,
    activate?: boolean,
  ) => void
  requestCustomerOutboundCall: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
  setLiveChatTabOpen: (open: boolean) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  bankAppVideoCallRequestId: 0,
  bankAppVoiceCallRequestId: 0,
  collapsed: true,
  customerOutboundCallRequestId: 0,
  inboundPopupSource: 'pstn',
  videoCallPopupSource: 'standard',
  isBankAppDemoTabOpen: false,
  isInboundTabOpen: false,
  isLiveChatTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isVideoCallTabOpen: false,
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
      isInboundTabOpen: false,
    })),
  closeVideoCallTab: () =>
    set((state) => ({
      activeWorkspaceTabKey:
        state.activeWorkspaceTabKey === 'video-call'
          ? state.isInboundTabOpen
            ? 'inbound'
            : 'home'
          : state.activeWorkspaceTabKey,
      isOpenEyeVideoWindowVisible: false,
      isVideoCallTabOpen: false,
    })),
  requestBankAppDemoWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'bankapp-demo',
      isBankAppDemoTabOpen: true,
    }),
  requestBankAppVideoCall: () =>
    set((state) => ({
      bankAppVideoCallRequestId: state.bankAppVideoCallRequestId + 1,
    })),
  requestBankAppVoiceCall: () =>
    set((state) => ({
      bankAppVoiceCallRequestId: state.bankAppVoiceCallRequestId + 1,
    })),
  requestLiveChatWorkspace: (sessionId, activate = true) =>
    set((state) => ({
      activeWorkspaceTabKey: activate
        ? 'live-chat'
        : state.activeWorkspaceTabKey,
      isLiveChatTabOpen: true,
      liveChatFocusRequestId: sessionId
        ? state.liveChatFocusRequestId + 1
        : state.liveChatFocusRequestId,
      liveChatFocusSessionId: sessionId ?? state.liveChatFocusSessionId,
    })),
  requestInboundPopup: (source = 'pstn', activate = true) =>
    set((state) => ({
      activeWorkspaceTabKey: activate ? 'inbound' : state.activeWorkspaceTabKey,
      inboundPopupSource: source,
      isInboundTabOpen: true,
      inboundPopupRequestId: state.inboundPopupRequestId + 1,
    })),
  requestVideoCallPopup: (source = 'standard', activate = true) =>
    set((state) => ({
      activeWorkspaceTabKey: activate
        ? 'video-call'
        : state.activeWorkspaceTabKey,
      isOpenEyeVideoWindowVisible: false,
      isVideoCallTabOpen: true,
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
      activeWorkspaceTabKey:
        !open && state.activeWorkspaceTabKey === 'live-chat'
          ? 'home'
          : state.activeWorkspaceTabKey,
      isLiveChatTabOpen: open,
      liveChatFocusSessionId: open ? state.liveChatFocusSessionId : null,
    })),
  setOpenEyeVideoWindowVisible: (visible) =>
    set({
      isOpenEyeVideoWindowVisible: visible,
    }),
}))
