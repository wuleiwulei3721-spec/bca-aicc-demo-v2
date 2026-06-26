import { create } from 'zustand'
import { defaultBlacklistEntries } from '../mock/blacklist'
import { defaultBusyReasons } from '../mock/busyReasons'
import { defaultCommonLinkEntries } from '../mock/commonLinks'
import { defaultCommonNumberEntries } from '../mock/commonNumbers'
import {
  defaultCommonPhraseCategories,
  defaultCommonPhraseEntries,
} from '../mock/commonPhrases'
import { defaultPriorityListEntries } from '../mock/priorityList'
import { defaultSensitiveWordEntries } from '../mock/sensitiveWords'
import type {
  BlacklistEntry,
  BusyReason,
  CommonLinkEntry,
  CommonNumberEntry,
  CommonPhraseCategory,
  CommonPhraseEntry,
  PriorityListEntry,
  SensitiveWordEntry,
  SensitiveWordMatch,
} from '../types'

interface CallManagementStore {
  addBlacklistEntries: (entries: BlacklistEntry[]) => void
  addCommonPhraseCategory: (category: CommonPhraseCategory) => void
  addCommonPhraseEntry: (entry: CommonPhraseEntry) => void
  addCommonLinkEntry: (entry: CommonLinkEntry) => void
  addCommonNumberEntry: (entry: CommonNumberEntry) => void
  addPriorityListEntries: (entries: PriorityListEntry[]) => void
  addSensitiveWordEntry: (entry: SensitiveWordEntry) => void
  blacklistEntries: BlacklistEntry[]
  busyReasons: BusyReason[]
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
  deleteSensitiveWordEntries: (ids: string[]) => void
  findSensitiveWordMatches: (message: string) => SensitiveWordMatch[]
  moveCommonPhraseEntries: (phraseIds: string[], categoryId: string) => void
  priorityListEntries: PriorityListEntry[]
  resetBlacklistEntries: () => void
  resetBusyReasons: () => void
  resetCommonLinkEntries: () => void
  resetCommonNumberEntries: () => void
  resetCommonPhrases: () => void
  resetPriorityListEntries: () => void
  resetSensitiveWordEntries: () => void
  renameCommonPhraseCategory: (categoryId: string, categoryName: string) => void
  sensitiveWordEntries: SensitiveWordEntry[]
  updateCommonLinkEntry: (entry: CommonLinkEntry) => void
  updateCommonNumberEntry: (entry: CommonNumberEntry) => void
  updateCommonPhraseEntry: (entry: CommonPhraseEntry) => void
  updateSensitiveWordEntry: (entry: SensitiveWordEntry) => void
  upsertBusyReason: (busyReason: BusyReason) => void
}

function cloneBlacklistEntries() {
  return defaultBlacklistEntries.map((entry) => ({ ...entry }))
}

function cloneBusyReasons() {
  return defaultBusyReasons.map((reason) => ({ ...reason }))
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

function cloneSensitiveWordEntries() {
  return defaultSensitiveWordEntries.map((entry) => ({ ...entry }))
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
  addSensitiveWordEntry: (entry) =>
    set((state) => ({
      sensitiveWordEntries: [{ ...entry }, ...state.sensitiveWordEntries],
    })),
  blacklistEntries: cloneBlacklistEntries(),
  busyReasons: cloneBusyReasons(),
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
  deleteSensitiveWordEntries: (ids) =>
    set((state) => {
      const idSet = new Set(ids)

      return {
        sensitiveWordEntries: state.sensitiveWordEntries.filter(
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
  moveCommonPhraseEntries: (phraseIds, categoryId) =>
    set((state) => {
      const idSet = new Set(phraseIds)

      return {
        commonPhraseEntries: state.commonPhraseEntries.map((entry) =>
          idSet.has(entry.phraseId) ? { ...entry, categoryId } : entry,
        ),
      }
    }),
  priorityListEntries: clonePriorityListEntries(),
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
  resetPriorityListEntries: () =>
    set({ priorityListEntries: clonePriorityListEntries() }),
  resetSensitiveWordEntries: () =>
    set({ sensitiveWordEntries: cloneSensitiveWordEntries() }),
  renameCommonPhraseCategory: (categoryId, categoryName) =>
    set((state) => ({
      commonPhraseCategories: state.commonPhraseCategories.map((category) =>
        category.categoryId === categoryId
          ? { ...category, categoryName }
          : category,
      ),
    })),
  sensitiveWordEntries: cloneSensitiveWordEntries(),
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
  updateSensitiveWordEntry: (entry) =>
    set((state) => ({
      sensitiveWordEntries: state.sensitiveWordEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? { ...entry } : currentEntry,
      ),
    })),
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
