import { create } from 'zustand'
import { defaultBlacklistEntries } from '../mock/blacklist'
import { defaultBusyReasons } from '../mock/busyReasons'
import { defaultPriorityListEntries } from '../mock/priorityList'
import type { BlacklistEntry, BusyReason, PriorityListEntry } from '../types'

interface CallManagementStore {
  addBlacklistEntries: (entries: BlacklistEntry[]) => void
  addPriorityListEntries: (entries: PriorityListEntry[]) => void
  blacklistEntries: BlacklistEntry[]
  busyReasons: BusyReason[]
  deleteBlacklistEntries: (ids: string[]) => void
  deletePriorityListEntries: (ids: string[]) => void
  priorityListEntries: PriorityListEntry[]
  resetBlacklistEntries: () => void
  resetBusyReasons: () => void
  resetPriorityListEntries: () => void
  upsertBusyReason: (busyReason: BusyReason) => void
}

function cloneBlacklistEntries() {
  return defaultBlacklistEntries.map((entry) => ({ ...entry }))
}

function cloneBusyReasons() {
  return defaultBusyReasons.map((reason) => ({ ...reason }))
}

function clonePriorityListEntries() {
  return defaultPriorityListEntries.map((entry) => ({ ...entry }))
}

export const useCallManagementStore = create<CallManagementStore>((set) => ({
  addBlacklistEntries: (entries) =>
    set((state) => ({
      blacklistEntries: [
        ...entries.map((entry) => ({ ...entry })),
        ...state.blacklistEntries,
      ],
    })),
  addPriorityListEntries: (entries) =>
    set((state) => ({
      priorityListEntries: [
        ...entries.map((entry) => ({ ...entry })),
        ...state.priorityListEntries,
      ],
    })),
  blacklistEntries: cloneBlacklistEntries(),
  busyReasons: cloneBusyReasons(),
  deleteBlacklistEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        blacklistEntries: state.blacklistEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  deletePriorityListEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        priorityListEntries: state.priorityListEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  priorityListEntries: clonePriorityListEntries(),
  resetBlacklistEntries: () =>
    set({ blacklistEntries: cloneBlacklistEntries() }),
  resetBusyReasons: () => set({ busyReasons: cloneBusyReasons() }),
  resetPriorityListEntries: () =>
    set({ priorityListEntries: clonePriorityListEntries() }),
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
