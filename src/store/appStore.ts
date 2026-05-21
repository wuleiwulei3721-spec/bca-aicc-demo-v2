import { create } from 'zustand'

interface AppState {
  activeWorkspaceTabKey: string
  collapsed: boolean
  customerOutboundCallRequestId: number
  isInboundTabOpen: boolean
  isLiveChatTabOpen: boolean
  isOpenEyeVideoWindowVisible: boolean
  isVideoCallTabOpen: boolean
  inboundPopupRequestId: number
  videoCallPopupRequestId: number
  closeInboundTab: () => void
  closeVideoCallTab: () => void
  requestLiveChatWorkspace: () => void
  requestInboundPopup: () => void
  requestVideoCallPopup: () => void
  requestCustomerOutboundCall: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
  setLiveChatTabOpen: (open: boolean) => void
  setOpenEyeVideoWindowVisible: (visible: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  collapsed: true,
  customerOutboundCallRequestId: 0,
  isInboundTabOpen: false,
  isLiveChatTabOpen: false,
  isOpenEyeVideoWindowVisible: false,
  isVideoCallTabOpen: false,
  inboundPopupRequestId: 0,
  videoCallPopupRequestId: 0,
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
  requestLiveChatWorkspace: () =>
    set({
      activeWorkspaceTabKey: 'live-chat',
      isLiveChatTabOpen: true,
    }),
  requestInboundPopup: () =>
    set((state) => ({
      activeWorkspaceTabKey: 'inbound',
      isInboundTabOpen: true,
      inboundPopupRequestId: state.inboundPopupRequestId + 1,
    })),
  requestVideoCallPopup: () =>
    set((state) => ({
      activeWorkspaceTabKey: 'video-call',
      isOpenEyeVideoWindowVisible: false,
      isVideoCallTabOpen: true,
      videoCallPopupRequestId: state.videoCallPopupRequestId + 1,
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
    })),
  setOpenEyeVideoWindowVisible: (visible) =>
    set({
      isOpenEyeVideoWindowVisible: visible,
    }),
}))
