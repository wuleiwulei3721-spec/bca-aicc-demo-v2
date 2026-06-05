import { create } from 'zustand'
import { defaultBusyReasons } from '../mock/busyReasons'
import type { BusyReason } from '../types'

interface CallManagementStore {
  busyReasons: BusyReason[]
}

function cloneBusyReasons() {
  return defaultBusyReasons.map((reason) => ({ ...reason }))
}

export const useCallManagementStore = create<CallManagementStore>(() => ({
  busyReasons: cloneBusyReasons(),
}))
