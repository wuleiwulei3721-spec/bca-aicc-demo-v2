export type RoutingConfigStatus =
  | 'Active'
  | 'Disabled'
  | 'Draft'
  | 'Replaced'

export type RouteFactorCode =
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'

export type RouteFactorSourceEntity =
  | 'vdn'
  | 'channel'
  | 'media_type'
  | 'site'
  | 'country'
  | 'business_type'
  | 'language'
  | 'access_account'
  | 'access_entry'

export type ChannelCategory =
  | 'voice'
  | 'owned-digital'
  | 'messaging'
  | 'email'
  | 'social'
  | 'app-store'

export type MediaTypeCode = 'VOICE' | 'VIDEO' | 'TEXT' | 'NON_DM'

export type ChannelScanMode = 'webhook' | 'polling' | 'manual'

export type RoutingRiskLevel = 'success' | 'warning' | 'error'

export interface ChannelAccessParameterField {
  key: string
  label: string
  required: boolean
}

export interface ChannelType {
  accessParameterFields: ChannelAccessParameterField[]
  category: ChannelCategory
  channelTypeCode: string
  channelTypeName: string
  licenseStatus: 'Licensed' | 'Unlicensed'
  status: RoutingConfigStatus
  supportedMediaTypes: MediaTypeCode[]
}

export type ChannelAccessConfig = Record<string, string>

export interface ChannelMediaBusinessConfig {
  accessSuccessWelcomeMessage: string
  agentEndReminder: string
  agentNoReplyAutoResponseMessage: string
  agentNoReplyBreachSeconds: number
  agentNoReplyTimeoutSeconds: number
  agentNoReplyWarningSeconds: number
  agentTimeoutNotice: string
  assignedAgentGreeting: string
  customerNoReplyTimeoutMinutes: number
  customerTimeoutNotice: string
  maxConcurrentAccess: number
  minScanIntervalSeconds: number
  newCustomerAlertSound: string
  outsideServiceHoursMessage: string
  longQueueWaitingMessage: string
  longQueueWaitingSeconds: number
  preTimeoutReminderMessage: string
  preTimeoutReminderMinutes: number
  queueTimeoutMessage: string
  queueTimeoutSeconds: number
  queueWaitingMessage: string
}

export type ChannelBusinessConfig = Partial<
  Record<MediaTypeCode, ChannelMediaBusinessConfig>
>

export interface RouteFactor {
  allowAny: boolean
  displayOrder: number
  enabled: boolean
  factorCode: RouteFactorCode
  factorName: string
  required: boolean
  sourceEntity: RouteFactorSourceEntity
  status: RoutingConfigStatus
}

export interface VdnAccessPoint {
  description: string
  platformVdnId: string
  status: RoutingConfigStatus
  vdnCode: string
  vdnName: string
}

export interface AccessSite {
  address: string
  countryCode: string
  ownerName: string
  ownerPhone: string
  siteCode: string
  siteName: string
  status: RoutingConfigStatus
}

export interface Channel {
  accessConfig: ChannelAccessConfig
  businessConfig: ChannelBusinessConfig
  channelCode: string
  channelId: string
  channelName: string
  mediaTypes: MediaTypeCode[]
  status: RoutingConfigStatus
  channelTypeCode: string
}

export interface MediaType {
  mediaCode: MediaTypeCode
  mediaName: string
  status: RoutingConfigStatus
}

export interface ChannelMedia {
  channelCode: string
  channelMediaCode: string
  extensionConfig: string
  maxConcurrency: number
  mediaCode: MediaTypeCode
  minScanIntervalSeconds: number | null
  scanMode: ChannelScanMode
  status: RoutingConfigStatus
}

export interface MediaServiceRulePlan {
  agentNoReplyAutoResponseMessage: string
  agentNoReplyBreachSeconds: number
  agentNoReplyTimeoutSeconds: number
  agentNoReplyWarningSeconds: number
  agentEndReminder: string
  assignedAgentGreeting: string
  accessSuccessWelcomeMessage: string
  agentTimeoutNotice: string
  customerNoReplyTimeoutMinutes: number
  customerTimeoutNotice: string
  description: string
  maxConcurrentAccess: number
  maxQueueCustomers: number
  mediaCode: MediaTypeCode
  minScanIntervalSeconds: number
  nonWorkingTimeMessage: string
  planCode: string
  planName: string
  preTimeoutReminderMessage: string
  preTimeoutReminderMinutes: number
  queueTimeoutMessage: string
  queueTimeoutMinutes: number
  queueWaitingMessage: string
  status: RoutingConfigStatus
  updatedAt: string
  updatedBy: string
}

export interface ChannelMediaRuleBinding {
  bindingCode: string
  channelCode: string
  mediaCode: MediaTypeCode
  rulePlanCode: string
  status: RoutingConfigStatus
}

export interface LanguageType {
  languageCode: string
  languageName: string
  locale: string
  status: RoutingConfigStatus
}

export interface BusinessType {
  businessName: string
  businessTypeCode: string
  sourceBusinessCode: string
  projectCode: string
  status: RoutingConfigStatus
}

export interface SiteAccessRatioDetail {
  ratioPercent: number
  siteCode: string
}

export interface SiteAccessRatioGroup {
  channelCode: string
  mediaCode: MediaTypeCode
  ratioGroupCode: string
  ratios: SiteAccessRatioDetail[]
  status: RoutingConfigStatus
}

export interface ChannelAccount {
  account: string
  accountCode: string
  accountName: string
  channelCode: string
  credentialRef: string
  purpose: string
  status: RoutingConfigStatus
}

export interface AccessEntry {
  accountCode: string
  channelMediaCode: string
  entryCode: string
  entryValue: string
  status: RoutingConfigStatus
  vdnCode?: string
}

export interface WorkingTimeRange {
  endTime: string
  startTime: string
}

export interface WorkScheduleRule {
  ruleId: string
  timeRanges: WorkingTimeRange[]
  weekdays: string[]
}

export interface HolidayScheduleRule {
  closedAllDay: boolean
  dateFrom: string
  dateTo: string
  holidayName: string
  nonWorkingRanges: WorkingTimeRange[]
  ruleId: string
}

export interface SpecialWorkingPlanRule {
  dateFrom: string
  dateTo: string
  reason: string
  ruleId: string
  workingRanges: WorkingTimeRange[]
}

export interface RamadanSchedule {
  dateFrom: string
  dateTo: string
  enabled: boolean
  workSchedules: WorkScheduleRule[]
}

export interface WorkingTimePlan {
  description: string
  holidayRules: HolidayScheduleRule[]
  planCode: string
  planName: string
  ramadanSchedule: RamadanSchedule
  specialWorkingPlans: SpecialWorkingPlanRule[]
  status: RoutingConfigStatus
  updatedAt: string
  updatedBy: string
  workSchedules: WorkScheduleRule[]
}

export interface SkillQueuePrompt {
  mediaCode: MediaTypeCode
  promptType: 'Wait Audio' | 'Timeout Message'
  value: string
}

export interface SkillQueue {
  accessCode: string
  assignedAgentCount: number
  maxQueueCustomers: number
  nonWorkingTimeMessage: string
  platformSkillId: string
  prompts: SkillQueuePrompt[]
  queueTimeoutMessage: string
  queueTimeoutMinutes: number
  queueWaitingMessage: string
  skillQueueCode: string
  skillQueueName: string
  status: RoutingConfigStatus
  supportsVideo: boolean
  vdnCode: string
  workTimePlanCode: string
}

export interface RoutingRuleCondition {
  factorCode: RouteFactorCode
  factorValueCode: string
}

export interface RoutingRule {
  conditions: RoutingRuleCondition[]
  effectiveFrom: string
  effectiveTo?: string
  factorSetVersion: string
  priority: number
  ruleCode: string
  status: RoutingConfigStatus
  targetSkillQueueCode: string
  updatedAt: string
  updatedBy: string
}

export interface RoutingRuleIndex {
  factor01Value: string
  factor02Value: string
  factor03Value: string
  factor04Value: string
  factor05Value: string
  factor06Value: string
  factor07Value: string
  factor08Value: string
  factor09Value: string
  factor10Value: string
  originalRuleCode: string
  specificityScore: number
  targetSkillQueueCode: string
}

export interface RoutingValidationItem {
  description: string
  level: RoutingRiskLevel
  title: string
}
