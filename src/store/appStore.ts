import { create } from 'zustand'

interface AppState {
  activeWorkspaceTabKey: string
  collapsed: boolean
  customerOutboundCallRequestId: number
  isInboundTabOpen: boolean
  inboundPopupRequestId: number
  closeInboundTab: () => void
  requestInboundPopup: () => void
  requestCustomerOutboundCall: () => void
  setActiveWorkspaceTabKey: (tabKey: string) => void
  setCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeWorkspaceTabKey: 'home',
  collapsed: true,
  customerOutboundCallRequestId: 0,
  isInboundTabOpen: false,
  inboundPopupRequestId: 0,
  closeInboundTab: () =>
    set({
      activeWorkspaceTabKey: 'home',
      isInboundTabOpen: false,
    }),
  requestInboundPopup: () =>
    set((state) => ({
      activeWorkspaceTabKey: 'inbound',
      isInboundTabOpen: true,
      inboundPopupRequestId: state.inboundPopupRequestId + 1,
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
}))
