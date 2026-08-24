import { create } from 'zustand'
import { defaultBlacklistEntries } from '../mock/blacklist'
import { defaultBusyReasons } from '../mock/busyReasons'
import { createDefaultCallRecords } from '../mock/callRecords'
import { defaultCommonLinkEntries } from '../mock/commonLinks'
import { defaultCommonNumberEntries } from '../mock/commonNumbers'
import { defaultGlobalControlConfiguration } from '../mock/globalControlConfiguration'
import { createDefaultLoginLogs } from '../mock/loginLogs'
import {
  defaultCommonPhraseCategories,
  defaultCommonPhraseEntries,
} from '../mock/commonPhrases'
import { defaultPriorityListEntries } from '../mock/priorityList'
import { defaultQuickActionEntries } from '../mock/quickActions'
import { defaultSensitiveWordEntries } from '../mock/sensitiveWords'
import { defaultSessionEndReasonEntries } from '../mock/sessionEndReasons'
import type {
  BlacklistEntry,
  BlacklistStatus,
  BusyReason,
  CallRecord,
  CallRecordSummary,
  CommonLinkEntry,
  CommonNumberEntry,
  CommonPhraseCategory,
  CommonPhraseEntry,
  GlobalControlConfiguration,
  LoginLogEntry,
  LoginLogLogoutType,
  LoginLogOperation,
  PriorityListEntry,
  QuickActionEntry,
  QuickActionReorderDirection,
  SensitiveWordEntry,
  SensitiveWordMatch,
  SessionEndMediaType,
  SessionEndReasonEntry,
} from '../types'

interface CallManagementStore {
  addBlacklistEntries: (entries: BlacklistEntry[]) => void
  addCommonPhraseCategory: (category: CommonPhraseCategory) => void
  addCommonPhraseEntry: (entry: CommonPhraseEntry) => void
  addCommonLinkEntry: (entry: CommonLinkEntry) => void
  addCommonNumberEntry: (entry: CommonNumberEntry) => void
  addPriorityListEntries: (entries: PriorityListEntry[]) => void
  addQuickActionEntry: (entry: QuickActionEntry) => void
  addSensitiveWordEntry: (entry: SensitiveWordEntry) => void
  addSessionEndReasonEntry: (entry: SessionEndReasonEntry) => void
  blacklistEntries: BlacklistEntry[]
  busyReasons: BusyReason[]
  callRecords: CallRecord[]
  commonLinkEntries: CommonLinkEntry[]
  commonNumberEntries: CommonNumberEntry[]
  commonPhraseCategories: CommonPhraseCategory[]
  commonPhraseEntries: CommonPhraseEntry[]
  deleteBlacklistEntries: (ids: string[]) => void
  deleteCommonPhraseCategory: (categoryId: string) => void
  deleteCommonPhraseEntries: (phraseIds: string[]) => void
  deleteCommonLinkEntries: (ids: string[]) => void
  deleteCommonNumberEntries: (ids: string[]) => void
  deletePriorityListEntries: (ids: string[]) => void
  deleteQuickActionEntries: (ids: string[], updatedBy: string) => void
  deleteSensitiveWordEntries: (ids: string[]) => void
  deleteSessionEndReasonEntries: (ids: string[]) => void
  findSensitiveWordMatches: (message: string) => SensitiveWordMatch[]
  getActiveSessionEndReasonsByMedia: (
    mediaType: SessionEndMediaType,
  ) => SessionEndReasonEntry[]
  globalControlConfiguration: GlobalControlConfiguration
  loginLogs: LoginLogEntry[]
  moveCommonPhraseEntries: (phraseIds: string[], categoryId: string) => void
  moveQuickActionEntry: (
    id: string,
    direction: QuickActionReorderDirection,
    updatedBy: string,
  ) => void
  priorityListEntries: PriorityListEntry[]
  quickActionEntries: QuickActionEntry[]
  recordLoginLog: (entry: {
    employeeId: string
    employeeName: string
    logoutType: LoginLogLogoutType | null
    occurredAt?: string
    operation: LoginLogOperation
  }) => void
  resetBlacklistEntries: () => void
  resetBusyReasons: () => void
  resetCommonLinkEntries: () => void
  resetCommonNumberEntries: () => void
  resetCommonPhrases: () => void
  resetGlobalControlConfiguration: () => void
  resetPriorityListEntries: () => void
  resetQuickActionEntries: () => void
  resetSensitiveWordEntries: () => void
  resetSessionEndReasonEntries: () => void
  renameCommonPhraseCategory: (categoryId: string, categoryName: string) => void
  sensitiveWordEntries: SensitiveWordEntry[]
  sessionEndReasonEntries: SessionEndReasonEntry[]
  updateCallRecordSummary: (recordId: string, summary: CallRecordSummary) => void
  updateBlacklistEntryStatus: (id: string, status: BlacklistStatus) => void
  updateGlobalControlConfiguration: (
    configuration: GlobalControlConfiguration,
  ) => void
  updateCommonLinkEntry: (entry: CommonLinkEntry) => void
  updateCommonNumberEntry: (entry: CommonNumberEntry) => void
  updateCommonPhraseEntry: (entry: CommonPhraseEntry) => void
  updateQuickActionEntry: (entry: QuickActionEntry) => void
  updateSensitiveWordEntry: (entry: SensitiveWordEntry) => void
  updateSessionEndReasonEntry: (entry: SessionEndReasonEntry) => void
  upsertBusyReason: (busyReason: BusyReason) => void
}

function cloneBlacklistEntries() {
  return defaultBlacklistEntries.map((entry) => ({ ...entry }))
}

function cloneBusyReasons() {
  return defaultBusyReasons.map((reason) => ({ ...reason }))
}

function cloneCallRecords() {
  return createDefaultCallRecords().map((record) => ({
    ...record,
    summary: {
      ...record.summary,
      tickets: record.summary.tickets.map((ticket) => ({
        ...ticket,
      })),
    },
    transcript: record.transcript.map((line) => ({ ...line })),
  }))
}

function cloneCommonPhraseCategories() {
  return defaultCommonPhraseCategories.map((category) => ({ ...category }))
}

function cloneCommonLinkEntries() {
  return defaultCommonLinkEntries.map((entry) => ({ ...entry }))
}

function cloneCommonNumberEntries() {
  return defaultCommonNumberEntries.map((entry) => ({ ...entry }))
}

function cloneCommonPhraseEntries() {
  return defaultCommonPhraseEntries.map((entry) => ({ ...entry }))
}

function clonePriorityListEntries() {
  return defaultPriorityListEntries.map((entry) => ({ ...entry }))
}

function cloneQuickActionEntries() {
  return defaultQuickActionEntries.map((entry) => ({ ...entry }))
}

function cloneSensitiveWordEntries() {
  return defaultSensitiveWordEntries.map((entry) => ({ ...entry }))
}

function cloneSessionEndReasonEntries() {
  return defaultSessionEndReasonEntries.map((entry) => ({
    ...entry,
    mediaTypes: [...entry.mediaTypes],
  }))
}

function cloneGlobalControlConfiguration(): GlobalControlConfiguration {
  return { ...defaultGlobalControlConfiguration }
}

function cloneLoginLogs() {
  return createDefaultLoginLogs().map((entry) => ({ ...entry }))
}

function normalizeMatchValue(value: string) {
  return value.trim().toLowerCase()
}

export const useCallManagementStore = create<CallManagementStore>((set) => ({
  addBlacklistEntries: (entries) =>
    set((state) => ({
      blacklistEntries: [
        ...entries.map((entry) => ({ ...entry })),
        ...state.blacklistEntries,
      ],
    })),
  addCommonPhraseCategory: (category) =>
    set((state) => ({
      commonPhraseCategories: [
        ...state.commonPhraseCategories,
        { ...category },
      ],
    })),
  addCommonPhraseEntry: (entry) =>
    set((state) => ({
      commonPhraseEntries: [{ ...entry }, ...state.commonPhraseEntries],
    })),
  addCommonLinkEntry: (entry) =>
    set((state) => ({
      commonLinkEntries: [{ ...entry }, ...state.commonLinkEntries],
    })),
  addCommonNumberEntry: (entry) =>
    set((state) => ({
      commonNumberEntries: [{ ...entry }, ...state.commonNumberEntries],
    })),
  addPriorityListEntries: (entries) =>
    set((state) => ({
      priorityListEntries: [
        ...entries.map((entry) => ({ ...entry })),
        ...state.priorityListEntries,
      ],
    })),
  addQuickActionEntry: (entry) =>
    set((state) => {
      const orderedEntries = [...state.quickActionEntries].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      )

      return {
        quickActionEntries: [
          ...orderedEntries,
          { ...entry, sortOrder: orderedEntries.length + 1 },
        ],
      }
    }),
  addSensitiveWordEntry: (entry) =>
    set((state) => ({
      sensitiveWordEntries: [{ ...entry }, ...state.sensitiveWordEntries],
    })),
  addSessionEndReasonEntry: (entry) =>
    set((state) => ({
      sessionEndReasonEntries: [
        { ...entry, mediaTypes: [...entry.mediaTypes] },
        ...state.sessionEndReasonEntries,
      ],
    })),
  blacklistEntries: cloneBlacklistEntries(),
  busyReasons: cloneBusyReasons(),
  callRecords: cloneCallRecords(),
  commonLinkEntries: cloneCommonLinkEntries(),
  commonNumberEntries: cloneCommonNumberEntries(),
  commonPhraseCategories: cloneCommonPhraseCategories(),
  commonPhraseEntries: cloneCommonPhraseEntries(),
  deleteBlacklistEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        blacklistEntries: state.blacklistEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  deleteCommonPhraseCategory: (categoryId) =>
    set((state) => ({
      commonPhraseCategories: state.commonPhraseCategories.filter(
        (category) => category.categoryId !== categoryId,
      ),
      commonPhraseEntries: state.commonPhraseEntries.filter(
        (entry) => entry.categoryId !== categoryId,
      ),
    })),
  deleteCommonPhraseEntries: (phraseIds) =>
    set((state) => {
      const idSet = new Set(phraseIds)

      return {
        commonPhraseEntries: state.commonPhraseEntries.filter(
          (entry) => !idSet.has(entry.phraseId),
        ),
      }
    }),
  deleteCommonLinkEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        commonLinkEntries: state.commonLinkEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  deleteCommonNumberEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        commonNumberEntries: state.commonNumberEntries.filter(
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
  deleteQuickActionEntries: (ids, updatedBy) =>
    set((state) => {
      const idSet = new Set(ids)
      const updatedAt = new Date().toISOString()
      const remainingEntries = state.quickActionEntries
        .filter((entry) => !idSet.has(entry.id))
        .sort((first, second) => first.sortOrder - second.sortOrder)

      return {
        quickActionEntries: remainingEntries.map((entry, index) => {
          const sortOrder = index + 1

          return entry.sortOrder === sortOrder
            ? entry
            : { ...entry, sortOrder, updatedAt, updatedBy }
        }),
      }
    }),
  deleteSensitiveWordEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        sensitiveWordEntries: state.sensitiveWordEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  deleteSessionEndReasonEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        sessionEndReasonEntries: state.sessionEndReasonEntries.filter(
          (entry) => !idSet.has(entry.id),
        ),
      }
    }),
  findSensitiveWordMatches: (message) => {
    const normalizedMessage = normalizeMatchValue(message)

    if (!normalizedMessage) {
      return []
    }

    return useCallManagementStore
      .getState()
      .sensitiveWordEntries.filter((entry) => {
        const normalizedWord = normalizeMatchValue(entry.word)

        return normalizedWord
          ? normalizedMessage.includes(normalizedWord)
          : false
      })
      .map((entry) => ({
        category: entry.category,
        id: entry.id,
        word: entry.word,
      }))
  },
  getActiveSessionEndReasonsByMedia: (mediaType) =>
    useCallManagementStore
      .getState()
      .sessionEndReasonEntries.filter(
        (entry) =>
          entry.status === 'Active' && entry.mediaTypes.includes(mediaType),
      ),
  globalControlConfiguration: cloneGlobalControlConfiguration(),
  loginLogs: cloneLoginLogs(),
  moveCommonPhraseEntries: (phraseIds, categoryId) =>
    set((state) => {
      const idSet = new Set(phraseIds)

      return {
        commonPhraseEntries: state.commonPhraseEntries.map((entry) =>
          idSet.has(entry.phraseId) && entry.categoryId !== categoryId
            ? { ...entry, categoryId }
            : entry,
        ),
      }
    }),
  moveQuickActionEntry: (id, direction, updatedBy) =>
    set((state) => {
      const orderedEntries = [...state.quickActionEntries].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      )
      const sourceIndex = orderedEntries.findIndex((entry) => entry.id === id)

      if (sourceIndex < 0) {
        return state
      }

      const targetIndex =
        direction === 'top'
          ? 0
          : direction === 'up'
            ? Math.max(0, sourceIndex - 1)
            : direction === 'down'
              ? Math.min(orderedEntries.length - 1, sourceIndex + 1)
              : orderedEntries.length - 1

      if (sourceIndex === targetIndex) {
        return state
      }

      const [movedEntry] = orderedEntries.splice(sourceIndex, 1)
      orderedEntries.splice(targetIndex, 0, movedEntry)

      const updatedAt = new Date().toISOString()

      return {
        quickActionEntries: orderedEntries.map((entry, index) => {
          const sortOrder = index + 1

          return entry.sortOrder === sortOrder
            ? entry
            : { ...entry, sortOrder, updatedAt, updatedBy }
        }),
      }
    }),
  priorityListEntries: clonePriorityListEntries(),
  quickActionEntries: cloneQuickActionEntries(),
  recordLoginLog: (entry) =>
    set((state) => ({
      loginLogs: [
        {
          ...entry,
          id: `login-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          occurredAt: entry.occurredAt ?? new Date().toISOString(),
        },
        ...state.loginLogs,
      ],
    })),
  resetBlacklistEntries: () =>
    set({ blacklistEntries: cloneBlacklistEntries() }),
  resetBusyReasons: () => set({ busyReasons: cloneBusyReasons() }),
  resetCommonLinkEntries: () =>
    set({ commonLinkEntries: cloneCommonLinkEntries() }),
  resetCommonNumberEntries: () =>
    set({ commonNumberEntries: cloneCommonNumberEntries() }),
  resetCommonPhrases: () =>
    set({
      commonPhraseCategories: cloneCommonPhraseCategories(),
      commonPhraseEntries: cloneCommonPhraseEntries(),
    }),
  resetGlobalControlConfiguration: () =>
    set({ globalControlConfiguration: cloneGlobalControlConfiguration() }),
  resetPriorityListEntries: () =>
    set({ priorityListEntries: clonePriorityListEntries() }),
  resetQuickActionEntries: () =>
    set({ quickActionEntries: cloneQuickActionEntries() }),
  resetSensitiveWordEntries: () =>
    set({ sensitiveWordEntries: cloneSensitiveWordEntries() }),
  resetSessionEndReasonEntries: () =>
    set({ sessionEndReasonEntries: cloneSessionEndReasonEntries() }),
  renameCommonPhraseCategory: (categoryId, categoryName) =>
    set((state) => ({
      commonPhraseCategories: state.commonPhraseCategories.map((category) =>
        category.categoryId === categoryId
          ? { ...category, categoryName }
          : category,
      ),
    })),
  sensitiveWordEntries: cloneSensitiveWordEntries(),
  sessionEndReasonEntries: cloneSessionEndReasonEntries(),
  updateCallRecordSummary: (recordId, summary) =>
    set((state) => ({
      callRecords: state.callRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              summary: {
                ...summary,
                tickets: summary.tickets.map((ticket) => ({
                  ...ticket,
                })),
              },
            }
          : record,
      ),
    })),
  updateBlacklistEntryStatus: (id, status) =>
    set((state) => ({
      blacklistEntries: state.blacklistEntries.map((entry) =>
        entry.id === id ? { ...entry, status } : entry,
      ),
    })),
  updateGlobalControlConfiguration: (configuration) =>
    set({ globalControlConfiguration: { ...configuration } }),
  updateCommonLinkEntry: (entry) =>
    set((state) => ({
      commonLinkEntries: state.commonLinkEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? { ...entry } : currentEntry,
      ),
    })),
  updateCommonNumberEntry: (entry) =>
    set((state) => ({
      commonNumberEntries: state.commonNumberEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? { ...entry } : currentEntry,
      ),
    })),
  updateCommonPhraseEntry: (entry) =>
    set((state) => ({
      commonPhraseEntries: state.commonPhraseEntries.map((currentEntry) =>
        currentEntry.phraseId === entry.phraseId
          ? { ...entry }
          : currentEntry,
      ),
    })),
  updateQuickActionEntry: (entry) =>
    set((state) => ({
      quickActionEntries: state.quickActionEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? { ...entry } : currentEntry,
      ),
    })),
  updateSensitiveWordEntry: (entry) =>
    set((state) => ({
      sensitiveWordEntries: state.sensitiveWordEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? { ...entry } : currentEntry,
      ),
    })),
  updateSessionEndReasonEntry: (entry) =>
    set((state) => ({
      sessionEndReasonEntries: state.sessionEndReasonEntries.map(
        (currentEntry) =>
          currentEntry.id === entry.id
            ? { ...entry, mediaTypes: [...entry.mediaTypes] }
            : currentEntry,
      ),
    })),
  upsertBusyReason: (busyReason) =>
    set((state) => {
      const nextReason = {
        ...busyReason,
        supportsOutbound:
          busyReason.status === 'Active' && busyReason.supportsOutbound,
      }
      const existingIndex = state.busyReasons.findIndex(
        (reason) => reason.busyReasonId === nextReason.busyReasonId,
      )
      const baseReasons =
        existingIndex >= 0
          ? state.busyReasons.map((reason, index) =>
              index === existingIndex ? nextReason : reason,
            )
          : [...state.busyReasons, nextReason]
      return {
        busyReasons: baseReasons,
      }
    }),
}))
