import { create } from 'zustand'
import { defaultBusyReasons } from '../mock/busyReasons'
import type { BusyReason } from '../types'

interface CallManagementStore {
  busyReasons: BusyReason[]
  deleteBusyReason: (busyReasonId: string) => void
  resetBusyReasons: () => void
  upsertBusyReason: (busyReason: BusyReason) => void
}

function cloneBusyReasons() {
  return defaultBusyReasons.map((reason) => ({ ...reason }))
}

export const useCallManagementStore = create<CallManagementStore>((set) => ({
  busyReasons: cloneBusyReasons(),
  deleteBusyReason: (busyReasonId) =>
    set((state) => ({
      busyReasons: state.busyReasons.filter(
        (reason) => reason.busyReasonId !== busyReasonId,
      ),
    })),
  resetBusyReasons: () => set({ busyReasons: cloneBusyReasons() }),
  upsertBusyReason: (busyReason) =>
    set((state) => {
      const nextReason = { ...busyReason }
      const existingIndex = state.busyReasons.findIndex(
        (reason) => reason.busyReasonId === nextReason.busyReasonId,
      )
      const baseReasons =
        existingIndex >= 0
          ? state.busyReasons.map((reason, index) =>
              index === existingIndex ? nextReason : reason,
            )
          : [...state.busyReasons, nextReason]
      const normalizedReasons = nextReason.isDefault
        ? baseReasons.map((reason) => ({
            ...reason,
            isDefault: reason.busyReasonId === nextReason.busyReasonId,
          }))
        : baseReasons

      return {
        busyReasons: normalizedReasons,
      }
    }),
}))
