import { create } from 'zustand'
import {
  accessEntries,
  accessSites,
  businessTypes,
  channelAccounts,
  channelMediaRuleBindings,
  channelMediaSettings,
  channels,
  channelTypes,
  languageTypes,
  mediaServiceRulePlans,
  mediaTypes,
  routeFactors,
  routingRules,
  siteAccessRatioGroups,
  skillQueues,
  vdnAccessPoints,
  workingTimePlans,
} from '../mock/routingConfiguration'
import type {
  AccessEntry,
  AccessSite,
  BusinessType,
  Channel,
  ChannelAccount,
  ChannelMedia,
  ChannelMediaRuleBinding,
  ChannelType,
  LanguageType,
  MediaServiceRulePlan,
  MediaType,
  RouteFactor,
  RoutingRule,
  SiteAccessRatioGroup,
  SkillQueue,
  VdnAccessPoint,
  WorkingTimePlan,
} from '../types'

export interface RoutingConfigCollections {
  accessEntries: AccessEntry[]
  accessSites: AccessSite[]
  businessTypes: BusinessType[]
  channelAccounts: ChannelAccount[]
  channelMediaRuleBindings: ChannelMediaRuleBinding[]
  channelMediaSettings: ChannelMedia[]
  channels: Channel[]
  channelTypes: ChannelType[]
  languageTypes: LanguageType[]
  mediaServiceRulePlans: MediaServiceRulePlan[]
  mediaTypes: MediaType[]
  routeFactors: RouteFactor[]
  routingRules: RoutingRule[]
  siteAccessRatioGroups: SiteAccessRatioGroup[]
  skillQueues: SkillQueue[]
  vdnAccessPoints: VdnAccessPoint[]
  workingTimePlans: WorkingTimePlan[]
}

export type RoutingCollectionKey = keyof RoutingConfigCollections

export type RoutingCollectionItem<K extends RoutingCollectionKey> =
  RoutingConfigCollections[K][number]

interface RoutingConfigStore extends RoutingConfigCollections {
  deleteEntity: <K extends RoutingCollectionKey>(
    collectionKey: K,
    idField: keyof RoutingCollectionItem<K>,
    idValue: string,
  ) => void
  resetRoutingConfig: () => void
  setRoutingRules: (rules: RoutingRule[]) => void
  upsertEntity: <K extends RoutingCollectionKey>(
    collectionKey: K,
    idField: keyof RoutingCollectionItem<K>,
    item: RoutingCollectionItem<K>,
  ) => void
}

function cloneInitialState(): RoutingConfigCollections {
  return {
    accessEntries: accessEntries.map((item) => ({ ...item })),
    accessSites: accessSites.map((item) => ({ ...item })),
    businessTypes: businessTypes.map((item) => ({ ...item })),
    channelAccounts: channelAccounts.map((item) => ({ ...item })),
    channelMediaRuleBindings: channelMediaRuleBindings.map((item) => ({
      ...item,
    })),
    channelMediaSettings: channelMediaSettings.map((item) => ({ ...item })),
    channels: channels.map((item) => ({
      ...item,
      accessConfig: { ...item.accessConfig },
      businessConfig: Object.fromEntries(
        Object.entries(item.businessConfig).map(([mediaCode, config]) => [
          mediaCode,
          config ? { ...config } : config,
        ]),
      ),
      mediaTypes: [...item.mediaTypes],
    })),
    channelTypes: channelTypes.map((item) => ({
      ...item,
      accessParameterFields: item.accessParameterFields.map((field) => ({
        ...field,
      })),
      supportedMediaTypes: [...item.supportedMediaTypes],
    })),
    languageTypes: languageTypes.map((item) => ({ ...item })),
    mediaServiceRulePlans: mediaServiceRulePlans.map((item) => ({ ...item })),
    mediaTypes: mediaTypes.map((item) => ({ ...item })),
    routeFactors: routeFactors.map((item) => ({ ...item })),
    routingRules: routingRules.map((item) => ({
      ...item,
      conditions: item.conditions.map((condition) => ({ ...condition })),
    })),
    siteAccessRatioGroups: siteAccessRatioGroups.map((item) => ({
      ...item,
      ratios: item.ratios.map((ratio) => ({ ...ratio })),
    })),
    skillQueues: skillQueues.map((item) => ({
      ...item,
      prompts: item.prompts.map((prompt) => ({ ...prompt })),
    })),
    vdnAccessPoints: vdnAccessPoints.map((item) => ({ ...item })),
    workingTimePlans: workingTimePlans.map((item) => ({
      ...item,
      holidayRules: item.holidayRules.map((rule) => ({
        ...rule,
        nonWorkingRanges: rule.nonWorkingRanges.map((range) => ({
          ...range,
        })),
      })),
      ramadanSchedule: {
        ...item.ramadanSchedule,
        workSchedules: item.ramadanSchedule.workSchedules.map((rule) => ({
          ...rule,
          timeRanges: rule.timeRanges.map((range) => ({ ...range })),
          weekdays: [...rule.weekdays],
        })),
      },
      specialWorkingPlans: item.specialWorkingPlans.map((rule) => ({
        ...rule,
        workingRanges: rule.workingRanges.map((range) => ({ ...range })),
      })),
      workSchedules: item.workSchedules.map((rule) => ({
        ...rule,
        timeRanges: rule.timeRanges.map((range) => ({ ...range })),
        weekdays: [...rule.weekdays],
      })),
    })),
  }
}

export const useRoutingConfigStore = create<RoutingConfigStore>((set) => ({
  ...cloneInitialState(),
  deleteEntity: (collectionKey, idField, idValue) =>
    set((state) => ({
      [collectionKey]: state[collectionKey].filter(
        (item) => String(item[idField]) !== idValue,
      ),
    })),
  resetRoutingConfig: () => set(cloneInitialState()),
  setRoutingRules: (routingRules) => set({ routingRules }),
  upsertEntity: (collectionKey, idField, item) =>
    set((state) => {
      const items = state[collectionKey]
      const itemId = String(item[idField])
      const existingIndex = items.findIndex(
        (currentItem) => String(currentItem[idField]) === itemId,
      )
      const nextItems =
        existingIndex >= 0
          ? items.map((currentItem, index) =>
              index === existingIndex ? item : currentItem,
            )
          : [...items, item]

      return {
        [collectionKey]: nextItems,
      }
    }),
}))
