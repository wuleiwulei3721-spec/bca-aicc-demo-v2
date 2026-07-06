import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, DatePicker, Input, InputNumber, Select, Switch, Tabs, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  BaseButton,
  BaseCard,
  AdminModal,
  AdminTable,
  AdminPage,
} from '../../components'
import { useRoutingConfigStore } from '../../store'
import type {
  AccessSite,
  BusinessType,
  Channel,
  ChannelAccount,
  ChannelBusinessConfig,
  ChannelMediaBusinessConfig,
  ChannelType,
  MediaServiceRulePlan,
  MediaTypeCode,
  RouteFactor,
  RouteFactorCode,
  RoutingConfigStatus,
  SiteAccessRatioDetail,
  SiteAccessRatioGroup,
  SkillQueue,
  SkillQueuePrompt,
  VdnAccessPoint,
  HolidayScheduleRule,
  SpecialWorkingPlanRule,
  WorkingTimeRange,
  WorkingTimePlan,
  WorkScheduleRule,
} from '../../types'
import {
  RoutingConfigCrudPage,
  type RoutingConfigDraft,
  type RoutingConfigSelectOption,
} from './RoutingConfigCrudPage'
import { RoutingConfigStatusBadge } from './RoutingConfigStatusBadge'

const statusSwitchLabels = {
  checked: 'Enabled',
  unchecked: 'Disabled',
}

const statusFilterOptions: RoutingConfigSelectOption[] = [
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown) {
  return typeof value === 'number' ? value : Number(value) || 0
}

function booleanValue(value: unknown) {
  return value === true || value === 'true' || value === 'Yes'
}

function statusValue(value: unknown): RoutingConfigStatus {
  return value === 'Disabled' ? 'Disabled' : 'Active'
}

function fieldRequired(draft: RoutingConfigDraft, field: string, label: string) {
  return stringValue(draft[field]).trim() ? [] : [`${label} is required.`]
}

function validateCode(
  code: string,
  label: string,
  pattern = /^[A-Z0-9_-]+$/,
) {
  if (!code.trim()) {
    return [`${label} is required.`]
  }

  if (!pattern.test(code)) {
    return [`${label} must use uppercase letters, numbers, underscore, or hyphen.`]
  }

  return []
}

function validateUnique<RecordType extends object>(
  records: RecordType[],
  currentRecord: RecordType | null,
  idField: keyof RecordType,
  nextId: string,
  label: string,
) {
  const currentId = currentRecord ? String(currentRecord[idField]) : null
  const duplicated = records.some(
    (record) =>
      String(record[idField]) === nextId && String(record[idField]) !== currentId,
  )

  return duplicated ? [`${label} already exists.`] : []
}

function promptsToText(prompts: SkillQueuePrompt[]) {
  return prompts
    .map((prompt) => `${prompt.mediaCode}|${prompt.promptType}|${prompt.value}`)
    .join('\n')
}

function textToPrompts(value: string): SkillQueuePrompt[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [mediaCode, promptType, ...promptValue] = line.split('|')

      return {
        mediaCode: (mediaCode || 'TEXT') as MediaTypeCode,
        promptType:
          promptType === 'Wait Audio' ? 'Wait Audio' : 'Timeout Message',
        value: promptValue.join('|').trim(),
      }
    })
}

function renderRoutingStatus(status: RoutingConfigStatus) {
  return <RoutingConfigStatusBadge status={status} />
}

function useRoutingLookups() {
  const accessEntries = useRoutingConfigStore((state) => state.accessEntries)
  const channelAccounts = useRoutingConfigStore((state) => state.channelAccounts)
  const channelMediaRuleBindings = useRoutingConfigStore(
    (state) => state.channelMediaRuleBindings,
  )
  const channels = useRoutingConfigStore((state) => state.channels)
  const channelTypes = useRoutingConfigStore((state) => state.channelTypes)
  const mediaServiceRulePlans = useRoutingConfigStore(
    (state) => state.mediaServiceRulePlans,
  )
  const mediaTypes = useRoutingConfigStore((state) => state.mediaTypes)
  const routeFactors = useRoutingConfigStore((state) => state.routeFactors)
  const routingRules = useRoutingConfigStore((state) => state.routingRules)
  const siteAccessRatioGroups = useRoutingConfigStore(
    (state) => state.siteAccessRatioGroups,
  )
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const vdnAccessPoints = useRoutingConfigStore(
    (state) => state.vdnAccessPoints,
  )
  const workingTimePlans = useRoutingConfigStore(
    (state) => state.workingTimePlans,
  )

  return useMemo(() => {
    const channelOptions = channels.map((channel) => ({
      label: channel.channelName,
      value: channel.channelCode,
    }))
    const mediaOptions = mediaTypes.map((mediaType) => ({
      label: mediaType.mediaName,
      value: mediaType.mediaCode,
    }))
    const mediaServiceRulePlanOptions = mediaServiceRulePlans
      .filter((plan) => plan.status === 'Active')
      .map((plan) => ({
        label: plan.planName,
        value: plan.planCode,
      }))
    const vdnOptions = vdnAccessPoints.map((vdn) => ({
      label: vdn.vdnName,
      value: vdn.vdnCode,
    }))
    const workTimeOptions = [
      { label: 'Default 24/7', value: '' },
      ...workingTimePlans.map((plan) => ({
        label: plan.planName,
        value: plan.planCode,
      })),
    ]
    const skillQueueOptions = skillQueues.map((skillQueue) => ({
      label: skillQueue.skillQueueName,
      value: skillQueue.skillQueueCode,
    }))

    return {
      accessEntries,
      channelAccounts,
      channelMediaRuleBindings,
      channelOptions,
      channels,
      channelTypes,
      mediaServiceRulePlanOptions,
      mediaServiceRulePlans,
      mediaOptions,
      mediaTypes,
      routeFactors,
      routingRules,
      siteAccessRatioGroups,
      skillQueueOptions,
      skillQueues,
      vdnAccessPoints,
      vdnOptions,
      workingTimePlans,
      workTimeOptions,
    }
  }, [
    accessEntries,
    channelAccounts,
    channelMediaRuleBindings,
    channels,
    channelTypes,
    mediaServiceRulePlans,
    mediaTypes,
    routeFactors,
    routingRules,
    siteAccessRatioGroups,
    skillQueues,
    vdnAccessPoints,
    workingTimePlans,
  ])
}

export function RouteElementsPage() {
  const routeFactors = useRoutingConfigStore((state) => state.routeFactors)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules } = useRoutingLookups()
  const sortedRouteFactors = useMemo(
    () =>
      [...routeFactors].sort(
        (first, second) =>
          first.displayOrder - second.displayOrder ||
          first.factorCode.localeCompare(second.factorCode),
      ),
    [routeFactors],
  )

  const columns: ColumnsType<RouteFactor> = [
    {
      dataIndex: 'factorCode',
      title: 'Element ID',
      width: 160,
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      dataIndex: 'factorName',
      title: 'Element Name',
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 120,
      render: renderRoutingStatus,
    },
  ]

  return (
    <RoutingConfigCrudPage<RouteFactor>
      actionColumnTitle="Actions"
      actionLabels={{
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
      }}
      addButtonText="Add"
      columns={columns}
      createDraft={() => ({
        allowAny: true,
        displayOrder: 99,
        enabled: true,
        factorCode: '19',
        factorName: '',
        required: false,
        sourceEntity: 'country',
        status: 'Active',
      })}
      data={sortedRouteFactors}
      draftToRecord={(draft, currentRecord) => ({
        allowAny: currentRecord?.allowAny ?? true,
        displayOrder: currentRecord?.displayOrder ?? 99,
        enabled: statusValue(draft.status) === 'Active',
        factorCode: stringValue(draft.factorCode) as RouteFactorCode,
        factorName: stringValue(draft.factorName),
        required: currentRecord?.required ?? false,
        sourceEntity: currentRecord?.sourceEntity ?? 'country',
        status: statusValue(draft.status),
      })}
      emptyFilterLabel="All"
      entityName="Route Element"
      eyebrow={null}
      fields={[
        {
          key: 'factorCode',
          label: 'Element ID',
          readOnlyOnEdit: true,
          required: true,
          type: 'text',
        },
        {
          key: 'factorName',
          label: 'Element Name',
          required: true,
          type: 'text',
        },
        {
          key: 'status',
          label: 'Status',
          switchLabels: statusSwitchLabels,
          type: 'statusSwitch',
        },
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [record.factorCode, record.factorName].some((fieldValue) =>
              fieldValue.toLowerCase().includes(keyword),
            )
          },
          placeholder: 'Element ID / Name',
          type: 'text',
          width: 240,
        },
        {
          key: 'status',
          label: 'Status',
          match: (record, value) => record.status === value,
          options: statusFilterOptions,
          type: 'select',
          width: 200,
        },
      ]}
      getDeleteBlockReason={(record) =>
        routingRules.some((rule) =>
          rule.conditions.some(
            (condition) => condition.factorCode === record.factorCode,
          ),
        )
          ? 'This route element is used by skill routing rules. Disable it or remove the dependency first.'
          : null
      }
      idField="factorCode"
      modalLabels={{
        add: 'Add Route Element',
        cancel: 'Cancel',
        close: 'Close',
        delete: 'Delete Route Element',
        edit: 'Edit Route Element',
        save: 'Save',
        view: 'View Route Element',
      }}
      recordToDraft={(record) => ({
        factorCode: record.factorCode,
        factorName: record.factorName,
        status: record.status,
      })}
      resetButtonText="Reset"
      searchButtonText="Search"
      searchFields={['factorCode', 'factorName', 'status']}
      title="Route Elements"
      validationMessage="Please complete required fields"
      validateDraft={(draft, currentRecord) => {
        const errors: string[] = []
        const factorCode = stringValue(draft.factorCode).trim()
        const factorName = stringValue(draft.factorName).trim()
        const currentCode = currentRecord?.factorCode ?? null
        const duplicated = routeFactors.some(
          (record) =>
            record.factorCode === factorCode && record.factorCode !== currentCode,
        )

        if (!factorCode) {
          errors.push('Element ID is required.')
        } else if (!/^\d{2}$/.test(factorCode)) {
          errors.push('Element ID must be two digits.')
        }

        if (duplicated) {
          errors.push('Element ID already exists.')
        }

        if (!factorName) {
          errors.push('Element Name is required.')
        }

        return errors
      }}
      onDelete={(record) =>
        deleteEntity('routeFactors', 'factorCode', record.factorCode)
      }
      onSave={(record) =>
        upsertEntity('routeFactors', 'factorCode', record)
      }
    />
  )
}

export function VdnPage() {
  const vdnAccessPoints = useRoutingConfigStore(
    (state) => state.vdnAccessPoints,
  )
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules, skillQueues } = useRoutingLookups()

  return (
    <RoutingConfigCrudPage<VdnAccessPoint>
      columns={[
        {
          dataIndex: 'vdnCode',
          title: 'VDN ID',
          width: 190,
          render: (value: string) => <strong>{value}</strong>,
        },
        {
          dataIndex: 'vdnName',
          title: 'VDN Name',
          width: 220,
        },
        {
          dataIndex: 'platformVdnId',
          title: 'Platform VDN ID',
          width: 170,
        },
        {
          dataIndex: 'description',
          title: 'Description',
        },
      ]}
      createDraft={() => ({
        description: '',
        platformVdnId: '',
        status: 'Active',
        vdnCode: 'VDN_NEW',
        vdnName: '',
      })}
      data={vdnAccessPoints}
      description="Manage self-coded VDN access points."
      draftToRecord={(draft) => ({
        description: stringValue(draft.description),
        platformVdnId: stringValue(draft.platformVdnId),
        status: 'Active',
        vdnCode: stringValue(draft.vdnCode),
        vdnName: stringValue(draft.vdnName),
      })}
      fields={[
        { key: 'vdnCode', label: 'VDN ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'vdnName', label: 'VDN Name', required: true, type: 'text' },
        { key: 'platformVdnId', label: 'Platform VDN ID', required: true, type: 'text' },
        { key: 'description', label: 'Description', fullWidth: true, rows: 3, type: 'textarea' },
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [record.vdnCode, record.vdnName, record.platformVdnId].some(
              (fieldValue) => fieldValue.toLowerCase().includes(keyword),
            )
          },
          placeholder: 'VDN ID / Name / Platform ID',
          type: 'text',
          width: 240,
        },
      ]}
      getDeleteBlockReason={(record) => {
        if (skillQueues.some((queue) => queue.vdnCode === record.vdnCode)) {
          return 'This VDN is used by skill queues.'
        }

        return routingRules.some((rule) =>
          rule.conditions.some(
            (condition) =>
              condition.factorCode === '10' &&
              condition.factorValueCode === record.vdnCode,
          ),
        )
          ? 'This VDN is referenced by routing rules.'
          : null
      }}
      idField="vdnCode"
      recordToDraft={(record) => ({ ...record })}
      searchFields={['vdnCode', 'vdnName', 'platformVdnId']}
      tableScrollX={860}
      title="VDN"
      validateDraft={(draft, currentRecord) => [
        ...validateCode(stringValue(draft.vdnCode), 'VDN ID'),
        ...validateUnique(
          vdnAccessPoints,
          currentRecord,
          'vdnCode',
          stringValue(draft.vdnCode),
          'VDN ID',
        ),
        ...fieldRequired(draft, 'vdnName', 'VDN Name'),
        ...fieldRequired(draft, 'platformVdnId', 'Platform VDN ID'),
      ]}
      onDelete={(record) =>
        deleteEntity('vdnAccessPoints', 'vdnCode', record.vdnCode)
      }
      onSave={(record) =>
        upsertEntity('vdnAccessPoints', 'vdnCode', record)
      }
    />
  )
}

export function SitesPage() {
  const accessSites = useRoutingConfigStore((state) => state.accessSites)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules, siteAccessRatioGroups } = useRoutingLookups()

  return (
    <RoutingConfigCrudPage<AccessSite>
      columns={[
        {
          dataIndex: 'siteCode',
          title: 'Site ID',
          width: 150,
          render: (value: string) => <strong>{value}</strong>,
        },
        { dataIndex: 'siteName', title: 'Site Name', width: 180 },
        { dataIndex: 'ownerName', title: 'Owner', width: 160 },
        { dataIndex: 'ownerPhone', title: 'Owner Phone', width: 170 },
        { dataIndex: 'address', title: 'Address' },
      ]}
      createDraft={() => ({
        address: '',
        countryCode: 'ID',
        ownerName: '',
        ownerPhone: '',
        siteCode: 'SITE_NEW',
        siteName: '',
        status: 'Active',
      })}
      data={accessSites}
      draftToRecord={(draft) => ({
        address: stringValue(draft.address),
        countryCode: stringValue(draft.countryCode) || 'ID',
        ownerName: stringValue(draft.ownerName),
        ownerPhone: stringValue(draft.ownerPhone),
        siteCode: stringValue(draft.siteCode),
        siteName: stringValue(draft.siteName),
        status: 'Active',
      })}
      entityName="Site"
      fields={[
        { key: 'siteCode', label: 'Site ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'siteName', label: 'Site Name', required: true, type: 'text' },
        { key: 'address', label: 'Address', rows: 2, type: 'textarea' },
        { key: 'ownerName', label: 'Owner Name', type: 'text' },
        { key: 'ownerPhone', label: 'Owner Phone', type: 'text' },
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [record.siteCode, record.siteName].some((fieldValue) =>
              fieldValue.toLowerCase().includes(keyword),
            )
          },
          placeholder: 'Site ID / Name',
          type: 'text',
          width: 240,
        },
      ]}
      getDeleteBlockReason={(record) =>
        siteAccessRatioGroups.some((group) =>
          group.ratios.some((ratio) => ratio.siteCode === record.siteCode),
        ) ||
        routingRules.some((rule) =>
          rule.conditions.some(
            (condition) =>
              condition.factorCode === '13' &&
              condition.factorValueCode === record.siteCode,
          ),
        )
          ? 'This site is referenced by site access volume or routing rules.'
          : null
      }
      idField="siteCode"
      recordToDraft={(record) => ({ ...record })}
      searchFields={['siteCode', 'siteName', 'ownerName']}
      tableScrollX={900}
      title="Access Sites"
      validateDraft={(draft, currentRecord) => [
        ...validateCode(stringValue(draft.siteCode), 'Site ID'),
        ...validateUnique(
          accessSites,
          currentRecord,
          'siteCode',
          stringValue(draft.siteCode),
          'Site ID',
        ),
        ...fieldRequired(draft, 'siteName', 'Site Name'),
      ]}
      onDelete={(record) =>
        deleteEntity('accessSites', 'siteCode', record.siteCode)
      }
      onSave={(record) => upsertEntity('accessSites', 'siteCode', record)}
    />
  )
}

const defaultChannelBusinessConfigByMedia: Record<
  MediaTypeCode,
  ChannelMediaBusinessConfig
> = {
  TEXT: {
    accessSuccessWelcomeMessage:
      'Hello, BANK 1 digital assistant is ready to help you.',
    agentEndReminder:
      'Thank you for contacting BANK 1. We are glad to assist you.',
    agentNoReplyAutoResponseMessage:
      'Please hold on. We are still processing your request.',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentTimeoutNotice:
      'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
    assignedAgentGreeting:
      'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
    exceptionWorkTimePlanCode: '',
    maxConcurrentAccess: 50,
    minScanIntervalSeconds: 30,
    outsideServiceHoursMessage:
      'Sorry, we are currently outside service hours.',
    preTimeoutReminderMessage:
      'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'All agents are currently busy. Please try again later.',
    queueWaitingMessage: 'All agents are currently busy. Please wait.',
    webchatRecallLimitSeconds: 120,
  },
  NON_DM: {
    accessSuccessWelcomeMessage:
      'Hello, BANK 1 social service assistant is ready to help you.',
    agentEndReminder:
      'Thank you for contacting BANK 1. We are glad to assist you.',
    agentNoReplyAutoResponseMessage:
      'Please hold on. We are still processing your request.',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentTimeoutNotice:
      'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
    assignedAgentGreeting:
      'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
    exceptionWorkTimePlanCode: '',
    maxConcurrentAccess: 50,
    minScanIntervalSeconds: 30,
    outsideServiceHoursMessage:
      'Sorry, we are currently outside service hours.',
    preTimeoutReminderMessage:
      'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'All agents are currently busy. Please try again later.',
    queueWaitingMessage: 'All agents are currently busy. Please wait.',
    webchatRecallLimitSeconds: 120,
  },
  VIDEO: {
    accessSuccessWelcomeMessage:
      'Hello, BANK 1 video assistant is ready to help you.',
    agentEndReminder:
      'Thank you for contacting BANK 1. We are glad to assist you.',
    agentNoReplyAutoResponseMessage:
      'Please hold on. We are still processing your request.',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentTimeoutNotice:
      'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
    assignedAgentGreeting:
      'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
    exceptionWorkTimePlanCode: '',
    maxConcurrentAccess: 50,
    minScanIntervalSeconds: 30,
    outsideServiceHoursMessage:
      'Sorry, we are currently outside service hours.',
    preTimeoutReminderMessage:
      'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'All agents are currently busy. Please try again later.',
    queueWaitingMessage: 'All agents are currently busy. Please wait.',
    webchatRecallLimitSeconds: 120,
  },
  VOICE: {
    accessSuccessWelcomeMessage:
      'Hello, BANK 1 voice assistant is ready to help you.',
    agentEndReminder:
      'Thank you for contacting BANK 1. We are glad to assist you.',
    agentNoReplyAutoResponseMessage:
      'Please hold on. We are still processing your request.',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentTimeoutNotice:
      'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
    assignedAgentGreeting:
      'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
    exceptionWorkTimePlanCode: '',
    maxConcurrentAccess: 50,
    minScanIntervalSeconds: 30,
    outsideServiceHoursMessage:
      'Sorry, we are currently outside service hours.',
    preTimeoutReminderMessage:
      'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'All agents are currently busy. Please try again later.',
    queueWaitingMessage: 'All agents are currently busy. Please wait.',
    webchatRecallLimitSeconds: 120,
  },
}

function createDefaultChannelBusinessConfig(mediaCode: MediaTypeCode) {
  return { ...defaultChannelBusinessConfigByMedia[mediaCode] }
}

function normalizeChannelBusinessConfig(
  mediaTypes: MediaTypeCode[],
  businessConfig: ChannelBusinessConfig,
): ChannelBusinessConfig {
  return mediaTypes.reduce<ChannelBusinessConfig>((config, mediaCode) => {
    config[mediaCode] = {
      ...createDefaultChannelBusinessConfig(mediaCode),
      ...(businessConfig[mediaCode] ?? {}),
    }

    return config
  }, {})
}

function normalizeChannelDraft(channel: Channel): Channel {
  return {
    ...channel,
    accessConfig: { ...channel.accessConfig },
    businessConfig: normalizeChannelBusinessConfig(
      channel.mediaTypes,
      channel.businessConfig,
    ),
    mediaTypes: [...channel.mediaTypes],
  }
}

const channelBusinessVariablesByField: Partial<
  Record<keyof ChannelMediaBusinessConfig, string[]>
> = {
  accessSuccessWelcomeMessage: ['{customerName}', '{channelName}'],
  agentEndReminder: ['{customerName}', '{agentName}'],
  agentTimeoutNotice: ['{customerName}', '{timeoutMinutes}'],
  assignedAgentGreeting: [
    '{customerName}',
    '{agentName}',
    '{timeoutMinutes}',
  ],
  customerTimeoutNotice: ['{customerName}'],
  preTimeoutReminderMessage: ['{reminderMinutes}'],
}

export function ChannelTypesPage() {
  const channelTypes = useRoutingConfigStore((state) => state.channelTypes)
  const { mediaOptions } = useRoutingLookups()
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    status: '',
  })
  const [filterDraft, setFilterDraft] = useState({
    keyword: '',
    status: '',
  })
  const mediaLabelByValue = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const filteredChannelTypes = useMemo(
    () =>
      channelTypes.filter((channelType) => {
        const keyword = appliedFilters.keyword.trim().toLowerCase()
        const keywordMatched = keyword
          ? [
              channelType.channelTypeCode,
              channelType.channelTypeName,
              channelType.category,
            ].some((value) => value.toLowerCase().includes(keyword))
          : true
        const statusMatched = appliedFilters.status
          ? channelType.status === appliedFilters.status
          : true

        return keywordMatched && statusMatched
      }),
    [appliedFilters, channelTypes],
  )
  const columns: ColumnsType<ChannelType> = [
    {
      dataIndex: 'channelTypeCode',
      fixed: 'left',
      title: 'Type Code',
      width: 140,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'channelTypeName', title: 'Channel Type', width: 180 },
    {
      dataIndex: 'supportedMediaTypes',
      title: 'Supported Media',
      width: 220,
      render: (value: MediaTypeCode[]) => (
        <div className="routing-config-tag-list">
          {value.map((mediaType) => (
            <Tag key={mediaType}>
              {mediaLabelByValue.get(mediaType) ?? mediaType}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      dataIndex: 'accessParameterFields',
      title: 'Access Parameter Template',
      width: 520,
      render: (fields: ChannelType['accessParameterFields']) =>
        fields.length > 0 ? (
          <div className="routing-config-field-template-list">
            {fields.map((field) => (
              <Tag key={field.key}>{field.label}</Tag>
            ))}
          </div>
        ) : (
          <em className="routing-config-muted-text">No access parameters</em>
        ),
    },
    { dataIndex: 'category', title: 'Category', width: 140 },
    { dataIndex: 'licenseStatus', title: 'License', width: 120 },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 110,
      render: renderRoutingStatus,
    },
  ]

  return (
    <AdminPage title="Channel Types">
      <section className="routing-config-page">
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              <div className="routing-config-page__filters">
                <label
                  className="routing-config-page__filter"
                  style={{ width: 280 }}
                >
                  <span>Keyword</span>
                  <Input
                    placeholder="Type code / name / category"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        keyword: event.target.value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Status</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...statusFilterOptions,
                    ]}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        status: value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="routing-config-page__admin-actions">
                <BaseButton
                  variant="primary"
                  onClick={() => setAppliedFilters({ ...filterDraft })}
                >
                  Search
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  onClick={() => {
                    const nextFilters = { keyword: '', status: '' }

                    setFilterDraft(nextFilters)
                    setAppliedFilters(nextFilters)
                  }}
                >
                  Reset
                </BaseButton>
              </div>
            </div>
          </div>
          <AdminTable
            columns={columns}
            dataSource={filteredChannelTypes}
            pagination={{
              defaultPageSize: 20,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} records`,
            }}
            rowKey="channelTypeCode"
            scroll={{ x: 1450 }}
            size="small"
          />
        </BaseCard>
      </section>
    </AdminPage>
  )
}

export function ChannelsPage() {
  const channels = useRoutingConfigStore((state) => state.channels)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const {
    accessEntries,
    channelAccounts,
    channelTypes,
    mediaOptions,
    routingRules,
    workingTimePlans,
    workTimeOptions,
  } = useRoutingLookups()
  const [appliedFilters, setAppliedFilters] = useState({
    channelTypeCode: '',
    keyword: '',
    mediaTypes: [] as MediaTypeCode[],
    status: '',
  })
  const [filterDraft, setFilterDraft] = useState({
    channelTypeCode: '',
    keyword: '',
    mediaTypes: [] as MediaTypeCode[],
    status: '',
  })
  const [draft, setDraft] = useState<Channel>(() => ({
    accessConfig: {},
    businessConfig: normalizeChannelBusinessConfig(['TEXT'], {}),
    channelCode: 'WHATSAPP',
    channelId: '301',
    channelName: 'WhatsApp',
    channelTypeCode: 'WHATSAPP',
    mediaTypes: ['TEXT'],
    status: 'Active',
  }))
  const [modalMode, setModalMode] = useState<
    'accounts' | 'business' | 'edit' | null
  >(null)
  const [accountModalMode, setAccountModalMode] = useState<
    'add' | 'delete' | 'edit' | null
  >(null)
  const [accountDraft, setAccountDraft] = useState<ChannelAccount>({
    account: '',
    accountCode: '',
    accountName: '',
    channelCode: '',
    credentialRef: 'secret://aicc/new',
    purpose: '',
    status: 'Active',
  })
  const [businessMediaCode, setBusinessMediaCode] =
    useState<MediaTypeCode>('TEXT')
  const [notice, setNotice] = useState<string | null>(null)
  const [previewWorkingTimePlan, setPreviewWorkingTimePlan] =
    useState<WorkingTimePlan | null>(null)
  const [selectedAccount, setSelectedAccount] =
    useState<ChannelAccount | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [accountSubmitAttempted, setAccountSubmitAttempted] = useState(false)
  const businessMessageSelectionsRef = useRef<
    Record<string, { end: number; start: number }>
  >({})
  const businessMessageTextAreaRefs = useRef<
    Record<string, HTMLTextAreaElement | null>
  >({})
  const mediaLabelByValue = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const workingTimePlanByCode = useMemo(
    () => new Map(workingTimePlans.map((plan) => [plan.planCode, plan])),
    [workingTimePlans],
  )
  const channelTypeByCode = useMemo(
    () =>
      new Map(
        channelTypes.map((channelType) => [
          channelType.channelTypeCode,
          channelType,
        ]),
      ),
    [channelTypes],
  )
  const channelTypeOptions = useMemo(
    () =>
      channelTypes.map((channelType) => ({
        label: channelType.channelTypeName,
        value: channelType.channelTypeCode,
      })),
    [channelTypes],
  )
  const formatMediaTypes = (mediaTypes: MediaTypeCode[]) =>
    mediaTypes
      .map((mediaType) => mediaLabelByValue.get(mediaType) ?? mediaType)
      .join(', ')
  const canManageChannelAccounts = (channel: Channel) =>
    channel.channelTypeCode !== 'PHONE'
  const openModal = (mode: 'accounts' | 'business' | 'edit', record: Channel) => {
    if (mode === 'accounts' && !canManageChannelAccounts(record)) {
      return
    }

    const nextDraft = normalizeChannelDraft(record)
    const firstMedia = nextDraft.mediaTypes[0] ?? 'TEXT'

    setModalMode(mode)
    setSelectedChannel(record)
    setDraft(nextDraft)
    setBusinessMediaCode(firstMedia)
    setSubmitAttempted(false)
    setNotice(null)
  }
  const closeModal = () => {
    setModalMode(null)
    setSelectedChannel(null)
    setNotice(null)
    setPreviewWorkingTimePlan(null)
    setSubmitAttempted(false)
  }
  const updateDraft = <Key extends keyof Channel>(
    key: Key,
    value: Channel[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }
  const updateMediaTypes = (mediaTypes: MediaTypeCode[]) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      businessConfig: normalizeChannelBusinessConfig(
        mediaTypes,
        currentDraft.businessConfig,
      ),
      mediaTypes,
    }))

    if (!mediaTypes.includes(businessMediaCode)) {
      setBusinessMediaCode(mediaTypes[0] ?? 'TEXT')
    }
  }
  const updateBusinessConfig = <Key extends keyof ChannelMediaBusinessConfig>(
    mediaCode: MediaTypeCode,
    key: Key,
    value: ChannelMediaBusinessConfig[Key],
  ) => {
    setDraft((currentDraft) => {
      const currentConfig =
        currentDraft.businessConfig[mediaCode] ??
        createDefaultChannelBusinessConfig(mediaCode)

      return {
        ...currentDraft,
        businessConfig: {
          ...currentDraft.businessConfig,
          [mediaCode]: {
            ...currentConfig,
            [key]: value,
          },
        },
      }
    })
  }
  const validationErrors = useMemo(() => {
    if (!modalMode || modalMode === 'accounts') {
      return []
    }

    const errors: string[] = []

    if (draft.mediaTypes.length === 0) {
      errors.push('Media Type is required.')
    }

    if (modalMode === 'business') {
      const channelType = channelTypeByCode.get(draft.channelTypeCode)
      const usesSocialAccessCapacity = channelType?.category === 'social'

      draft.mediaTypes.forEach((mediaCode) => {
        const config =
          draft.businessConfig[mediaCode] ??
          createDefaultChannelBusinessConfig(mediaCode)
        const mediaLabel = mediaLabelByValue.get(mediaCode) ?? mediaCode

        if (mediaCode === 'NON_DM') {
          return
        }

        if (usesSocialAccessCapacity) {
          if (config.maxConcurrentAccess <= 0) {
            errors.push(
              `${mediaLabel} Maximum Concurrent Calls must be greater than 0.`,
            )
          }

          if (config.minScanIntervalSeconds <= 0) {
            errors.push(
              `${mediaLabel} Min Scan Interval Seconds must be greater than 0.`,
            )
          }
        }

        if (mediaCode === 'TEXT') {
          if (!config.accessSuccessWelcomeMessage.trim()) {
            errors.push(`${mediaLabel} Access Success Welcome Message is required.`)
          }

          if (
            config.preTimeoutReminderMinutes >=
            config.customerNoReplyTimeoutMinutes
          ) {
            errors.push(
              'DM Pre-timeout Reminder Time must be less than Customer No Reply Timeout.',
            )
          }

          if (config.agentNoReplyWarningSeconds > config.agentNoReplyBreachSeconds) {
            errors.push(
              'DM Agent No Reply Warning must be less than or equal to Breach.',
            )
          }

          if (
            config.agentNoReplyBreachSeconds >
            config.agentNoReplyTimeoutSeconds
          ) {
            errors.push(
              'DM Agent No Reply Breach must be less than or equal to Agent No Reply Timeout.',
            )
          }

          ;[
            ['Assigned Agent Greeting', config.assignedAgentGreeting],
            ['Agent End Reminder', config.agentEndReminder],
            ['Pre-timeout Reminder Message', config.preTimeoutReminderMessage],
            ['Customer Timeout Notice', config.customerTimeoutNotice],
            ['Agent Timeout Notice', config.agentTimeoutNotice],
            [
              'Agent No Reply Auto Response',
              config.agentNoReplyAutoResponseMessage,
            ],
            [
              'Outside Service Hours Message',
              config.outsideServiceHoursMessage,
            ],
            ['Queue Waiting Message', config.queueWaitingMessage],
            ['Queue Timeout Message', config.queueTimeoutMessage],
          ].forEach(([label, value]) => {
            if (!String(value).trim()) {
              errors.push(`DM ${label} is required.`)
            }
          })
        }
      })
    }

    return errors
  }, [
    channelTypeByCode,
    draft,
    mediaLabelByValue,
    modalMode,
  ])
  const accountValidationErrors = useMemo(() => {
    if (!accountModalMode || accountModalMode === 'delete') {
      return []
    }

    const errors: string[] = []

    if (!accountDraft.account.trim()) {
      errors.push('Account is required.')
    }

    if (!accountDraft.accountName.trim()) {
      errors.push('Account Name is required.')
    }

    if (!accountDraft.credentialRef.trim()) {
      errors.push('Credential / Secret Ref is required.')
    }

    const duplicatedAccount = channelAccounts.some(
      (account) =>
        account.channelCode === accountDraft.channelCode &&
        account.account === accountDraft.account.trim() &&
        account.accountCode !== selectedAccount?.accountCode,
    )

    if (duplicatedAccount) {
      errors.push('Account already exists under this channel.')
    }

    return errors
  }, [accountDraft, accountModalMode, channelAccounts, selectedAccount])
  const filteredChannels = useMemo(
    () =>
      channels.filter((channel) => {
        const keyword = appliedFilters.keyword.trim().toLowerCase()
        const keywordMatched = keyword
          ? [channel.channelId, channel.channelName, channel.channelCode].some((value) =>
              value.toLowerCase().includes(keyword),
            )
          : true
        const channelTypeMatched = appliedFilters.channelTypeCode
          ? channel.channelTypeCode === appliedFilters.channelTypeCode
          : true
        const mediaMatched =
          appliedFilters.mediaTypes.length === 0 ||
          appliedFilters.mediaTypes.some((mediaType) =>
            channel.mediaTypes.includes(mediaType),
          )
        const statusMatched = appliedFilters.status
          ? channel.status === appliedFilters.status
          : true

        return keywordMatched && channelTypeMatched && mediaMatched && statusMatched
      }),
    [appliedFilters, channels],
  )
  const paginationConfig = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} records`,
  }
  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const nextChannel: Channel = {
      ...draft,
      channelId: draft.channelId.trim(),
      channelName: draft.channelName.trim(),
      accessConfig: { ...draft.accessConfig },
      businessConfig: normalizeChannelBusinessConfig(
        draft.mediaTypes,
        draft.businessConfig,
      ),
      mediaTypes: [...draft.mediaTypes],
      status: draft.status,
    }

    upsertEntity('channels', 'channelId', nextChannel)

    closeModal()
  }
  const openAccountModal = (
    mode: 'add' | 'delete' | 'edit',
    account?: ChannelAccount,
  ) => {
    if (!selectedChannel) {
      return
    }

    const nextAccount =
      account ??
      ({
        account: '',
        accountCode: `ACC_${selectedChannel.channelCode}_${String(
          channelAccounts.filter(
            (item) => item.channelCode === selectedChannel.channelCode,
          ).length + 1,
        ).padStart(2, '0')}`,
        accountName: '',
        channelCode: selectedChannel.channelCode,
        credentialRef: 'secret://aicc/new',
        purpose: '',
        status: 'Active',
      } satisfies ChannelAccount)

    setSelectedAccount(account ?? null)
    setAccountDraft({ ...nextAccount })
    setAccountModalMode(mode)
    setAccountSubmitAttempted(false)
    setNotice(null)
  }
  const closeAccountModal = () => {
    setAccountModalMode(null)
    setSelectedAccount(null)
    setAccountSubmitAttempted(false)
  }
  const updateAccountDraft = <Key extends keyof ChannelAccount>(
    key: Key,
    value: ChannelAccount[Key],
  ) => {
    setAccountDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }
  const getAccountDeleteBlockReason = (record: ChannelAccount) =>
    routingRules.some((rule) =>
      rule.conditions.some(
        (condition) =>
          condition.factorCode === '17' &&
          condition.factorValueCode === record.accountCode,
      ),
    ) ||
    accessEntries.some((entry) => entry.accountCode === record.accountCode)
      ? 'This account is referenced by routing rules or access entries.'
      : null
  const handleAccountSave = () => {
    setAccountSubmitAttempted(true)

    if (accountValidationErrors.length > 0) {
      return
    }

    upsertEntity('channelAccounts', 'accountCode', {
      ...accountDraft,
      account: accountDraft.account.trim(),
      accountName: accountDraft.accountName.trim(),
      credentialRef: accountDraft.credentialRef.trim(),
      purpose: accountDraft.purpose.trim(),
    })
    closeAccountModal()
  }
  const handleAccountDelete = () => {
    if (!selectedAccount) {
      return
    }

    const blockReason = getAccountDeleteBlockReason(selectedAccount)

    if (blockReason) {
      setNotice(blockReason)
      return
    }

    deleteEntity(
      'channelAccounts',
      'accountCode',
      selectedAccount.accountCode,
    )
    closeAccountModal()
  }
  const renderBusinessNumberField = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
    label: string,
    min = 1,
    severity?: 'breach' | 'warning',
  ) => {
    const config =
      draft.businessConfig[mediaCode] ??
      createDefaultChannelBusinessConfig(mediaCode)

    return (
      <label className="routing-config-crud-modal__field">
        <span
          className={
            severity
              ? `routing-config-channel-business__sla-label routing-config-channel-business__sla-label--${severity}`
              : undefined
          }
        >
          {severity && (
            <i
              aria-hidden="true"
              className="routing-config-channel-business__sla-dot"
            />
          )}
          <span>{label}</span>
        </span>
        <InputNumber
          min={min}
          value={Number(config[field] ?? 0)}
          onChange={(value) =>
            updateBusinessConfig(mediaCode, field, Number(value) || 0)
          }
        />
      </label>
    )
  }
  const renderExceptionWorkTimePlanField = (mediaCode: MediaTypeCode) => {
    const config =
      draft.businessConfig[mediaCode] ??
      createDefaultChannelBusinessConfig(mediaCode)
    const rawValue = String(config.exceptionWorkTimePlanCode ?? '')
    const previewPlan = workingTimePlanByCode.get(rawValue)

    return (
      <label className="routing-config-crud-modal__field routing-config-channel-business__work-time-field">
        <span>Exception Working Time Plan</span>
        <div className="routing-config-channel-business__work-time-control">
          <Select
            options={workTimeOptions}
            value={rawValue}
            onChange={(value) =>
              updateBusinessConfig(
                mediaCode,
                'exceptionWorkTimePlanCode',
                value as never,
              )
            }
          />
          {previewPlan && (
            <BaseButton
              variant="secondary"
              onClick={() => setPreviewWorkingTimePlan(previewPlan)}
            >
              Preview
            </BaseButton>
          )}
        </div>
      </label>
    )
  }
  const getBusinessMessageFieldKey = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
  ) => `${mediaCode}_${String(field)}`
  const rememberBusinessMessageSelection = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
    element: HTMLTextAreaElement,
  ) => {
    const fieldKey = getBusinessMessageFieldKey(mediaCode, field)
    businessMessageTextAreaRefs.current[fieldKey] = element
    businessMessageSelectionsRef.current[fieldKey] = {
      end: element.selectionEnd,
      start: element.selectionStart,
    }
  }
  const queueBusinessMessageSelectionRemember = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
    element: HTMLTextAreaElement,
  ) => {
    window.requestAnimationFrame(() => {
      rememberBusinessMessageSelection(mediaCode, field, element)
    })
  }
  const insertBusinessMessageVariable = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
    variable: string,
  ) => {
    const config =
      draft.businessConfig[mediaCode] ??
      createDefaultChannelBusinessConfig(mediaCode)
    const currentValue = String(config[field] ?? '')
    const fieldKey = getBusinessMessageFieldKey(mediaCode, field)
    const messageTextArea = businessMessageTextAreaRefs.current[fieldKey]
    const storedSelection = businessMessageSelectionsRef.current[fieldKey]
    const shouldReadLiveSelection =
      messageTextArea && document.activeElement === messageTextArea
    const activeSelection =
      shouldReadLiveSelection &&
      Number.isFinite(messageTextArea.selectionStart) &&
      Number.isFinite(messageTextArea.selectionEnd)
        ? {
            end: messageTextArea.selectionEnd,
            start: messageTextArea.selectionStart,
          }
        : storedSelection
    const start = activeSelection
      ? Math.min(activeSelection.start, currentValue.length)
      : currentValue.length
    const end = activeSelection
      ? Math.min(activeSelection.end, currentValue.length)
      : currentValue.length
    const nextValue = `${currentValue.slice(0, start)}${variable}${currentValue.slice(end)}`
    const nextCursorPosition = start + variable.length

    updateBusinessConfig(mediaCode, field, nextValue as never)
    businessMessageSelectionsRef.current[fieldKey] = {
      end: nextCursorPosition,
      start: nextCursorPosition,
    }
    window.requestAnimationFrame(() => {
      const currentMessageTextArea =
        businessMessageTextAreaRefs.current[fieldKey]
      currentMessageTextArea?.focus()
      currentMessageTextArea?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      )
    })
  }
  const renderBusinessMessageField = (
    mediaCode: MediaTypeCode,
    field: keyof ChannelMediaBusinessConfig,
    label: string,
    rows = 2,
    full = false,
  ) => {
    const config =
      draft.businessConfig[mediaCode] ??
      createDefaultChannelBusinessConfig(mediaCode)
    const variableOptions = channelBusinessVariablesByField[field] ?? []

    return (
      <label
        className={`routing-config-crud-modal__field routing-config-media-rule-modal__message-field${
          full ? ' routing-config-crud-modal__field--full' : ''
        }`}
      >
        <span className="routing-config-media-rule-modal__field-heading">
          <span>{label}</span>
          {variableOptions.length > 0 && (
            <select
              aria-label={`${label} insert variable`}
              className="routing-config-media-rule-modal__variable-select"
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  insertBusinessMessageVariable(
                    mediaCode,
                    field,
                    event.target.value,
                  )
                }
              }}
            >
              <option value="">Insert Variable</option>
              {variableOptions.map((variable) => (
                <option key={variable} value={variable}>
                  {variable}
                </option>
              ))}
            </select>
          )}
        </span>
        <Input.TextArea
          rows={rows}
          value={String(config[field] ?? '')}
          onChange={(event) =>
            updateBusinessConfig(mediaCode, field, event.target.value)
          }
          onBlur={(event) =>
            rememberBusinessMessageSelection(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onClick={(event) =>
            rememberBusinessMessageSelection(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onFocus={(event) =>
            rememberBusinessMessageSelection(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onKeyDown={(event) =>
            queueBusinessMessageSelectionRemember(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onKeyUp={(event) =>
            rememberBusinessMessageSelection(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onMouseUp={(event) =>
            queueBusinessMessageSelectionRemember(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
          onSelect={(event) =>
            rememberBusinessMessageSelection(
              mediaCode,
              field,
              event.currentTarget,
            )
          }
        />
      </label>
    )
  }
  const renderBusinessMediaForm = (mediaCode: MediaTypeCode) => {
    const isText = mediaCode === 'TEXT'
    const isNonDm = mediaCode === 'NON_DM'
    const isWebchatText = draft.channelCode === 'WEBCHAT' && isText
    const isPhoneVoice =
      draft.channelTypeCode === 'PHONE' && mediaCode === 'VOICE'
    const channelType = channelTypeByCode.get(draft.channelTypeCode)
    const usesSocialAccessCapacity = channelType?.category === 'social'
    const hasAccessConfiguration =
      usesSocialAccessCapacity || isPhoneVoice || isText

    if (isNonDm) {
      return <div className="routing-config-channel-business" />
    }

    if (!hasAccessConfiguration && !isText) {
      return (
        <div className="routing-config-channel-business">
          <Alert
            showIcon
            message="No configuration available for this media type."
            type="info"
          />
        </div>
      )
    }

    return (
      <div className="routing-config-channel-business">
        {hasAccessConfiguration && (
          <section className="routing-config-media-rule-modal__section">
            <header>
              <strong>Access Configuration</strong>
            </header>
            <div className="routing-config-crud-modal__section-grid">
              {usesSocialAccessCapacity &&
                renderBusinessNumberField(
                  mediaCode,
                  'maxConcurrentAccess',
                  'Maximum Concurrent Calls',
                )}
              {usesSocialAccessCapacity &&
                renderBusinessNumberField(
                  mediaCode,
                  'minScanIntervalSeconds',
                  'Min Scan Interval Seconds',
                )}
              {isPhoneVoice && renderExceptionWorkTimePlanField(mediaCode)}
              {isText &&
                renderBusinessMessageField(
                  mediaCode,
                  'accessSuccessWelcomeMessage',
                  'Access Success Welcome Message',
                  2,
                  true,
                )}
            </div>
          </section>
        )}
        {isText && (
          <>
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Queue Configuration</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {renderBusinessMessageField(
                  mediaCode,
                  'outsideServiceHoursMessage',
                  'Outside Service Hours Message',
                  2,
                  true,
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'queueWaitingMessage',
                  'Queue Waiting Message',
                  2,
                  true,
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'queueTimeoutMessage',
                  'Queue Timeout Message',
                  2,
                  true,
                )}
              </div>
            </section>
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Agent Opening / Ending Configuration</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {renderBusinessMessageField(
                  mediaCode,
                  'assignedAgentGreeting',
                  'Assigned Agent Greeting',
                  3,
                  true,
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'agentEndReminder',
                  'Agent End Reminder',
                  2,
                  true,
                )}
              </div>
            </section>
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Customer No Reply Configuration</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {renderBusinessNumberField(
                  mediaCode,
                  'preTimeoutReminderMinutes',
                  'Pre-timeout Reminder Time (min)',
                )}
                {renderBusinessNumberField(
                  mediaCode,
                  'customerNoReplyTimeoutMinutes',
                  'Customer No Reply Timeout (min)',
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'preTimeoutReminderMessage',
                  'Pre-timeout Reminder Message',
                  2,
                  true,
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'customerTimeoutNotice',
                  'Customer Timeout Notice',
                  2,
                  true,
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'agentTimeoutNotice',
                  'Agent Timeout Notice',
                  2,
                  true,
                )}
              </div>
            </section>
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Agent No Reply Configuration</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {renderBusinessNumberField(
                  mediaCode,
                  'agentNoReplyTimeoutSeconds',
                  'Agent No Reply Timeout (sec)',
                )}
                {renderBusinessMessageField(
                  mediaCode,
                  'agentNoReplyAutoResponseMessage',
                  'Auto Response Message',
                  2,
                  true,
                )}
              </div>
            </section>
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Agent Service Configuration</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {isWebchatText &&
                  renderBusinessNumberField(
                    mediaCode,
                    'webchatRecallLimitSeconds',
                    'Webchat Message Recall Limit (sec)',
                  )}
                {renderBusinessNumberField(
                  mediaCode,
                  'agentNoReplyWarningSeconds',
                  'Agent No Reply Warning (sec)',
                  1,
                  'warning',
                )}
                {renderBusinessNumberField(
                  mediaCode,
                  'agentNoReplyBreachSeconds',
                  'Agent No Reply Breach (sec)',
                  1,
                  'breach',
                )}
              </div>
            </section>
          </>
        )}
      </div>
    )
  }
  const accountColumns: ColumnsType<ChannelAccount> = [
    {
      dataIndex: 'account',
      title: 'Account',
      width: 140,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'accountName', title: 'Account Name', width: 160 },
    {
      dataIndex: 'credentialRef',
      ellipsis: true,
      title: 'Credential / Secret Ref',
      width: 200,
    },
    { dataIndex: 'purpose', ellipsis: true, title: 'Purpose', width: 220 },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 92,
      render: renderRoutingStatus,
    },
    {
      title: 'Actions',
      width: 84,
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`Edit ${record.account}`}
            title="Edit"
            type="button"
            onClick={() => openAccountModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.account}`}
            title="Delete"
            type="button"
            onClick={() => openAccountModal('delete', record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]
  const selectedChannelAccounts = selectedChannel
    ? channelAccounts.filter(
        (account) => account.channelCode === selectedChannel.channelCode,
      )
    : []
  const columns: ColumnsType<Channel> = [
    {
      dataIndex: 'channelId',
      fixed: 'left',
      title: 'Channel ID',
      width: 110,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'channelName', title: 'Channel Name', width: 170 },
    {
      dataIndex: 'channelTypeCode',
      title: 'Channel Type',
      width: 160,
      render: (value: string) =>
        channelTypeByCode.get(value)?.channelTypeName ?? value,
    },
    {
      dataIndex: 'mediaTypes',
      title: 'Media Type',
      width: 200,
      render: (value: MediaTypeCode[]) => formatMediaTypes(value),
    },
    {
      title: 'Account Count',
      width: 120,
      render: (_, record) =>
        channelAccounts.filter(
          (account) => account.channelCode === record.channelCode,
        ).length,
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 120,
      render: renderRoutingStatus,
    },
    {
      fixed: 'right',
      title: 'Actions',
      width: 250,
      render: (_, record) => {
        const accountsEnabled = canManageChannelAccounts(record)

        return (
          <div className="routing-config-channel-actions">
            <button
              aria-label={`Edit ${record.channelId}`}
              type="button"
              onClick={() => openModal('edit', record)}
            >
              Edit
            </button>
            <button
              aria-label={`Account management ${record.channelId}`}
              disabled={!accountsEnabled}
              title={
                accountsEnabled
                  ? 'Account management'
                  : 'Phone channel has no account configuration.'
              }
              type="button"
              onClick={() => openModal('accounts', record)}
            >
              Accounts
            </button>
            <button
              aria-label={`Business config ${record.channelId}`}
              type="button"
              onClick={() => openModal('business', record)}
            >
              Business Config
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <AdminPage title="Channels">
      <section className="routing-config-page">
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              <div className="routing-config-page__filters">
                <label
                  className="routing-config-page__filter"
                  style={{ width: 240 }}
                >
                  <span>Keyword</span>
                  <Input
                    placeholder="Channel ID / Name"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        keyword: event.target.value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 220 }}
                >
                  <span>Channel Type</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...channelTypeOptions,
                    ]}
                    value={filterDraft.channelTypeCode}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        channelTypeCode: value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 220 }}
                >
                  <span>Media Type</span>
                  <Select
                    allowClear
                    maxTagCount="responsive"
                    mode="multiple"
                    options={mediaOptions}
                    placeholder="All"
                    value={filterDraft.mediaTypes}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        mediaTypes: value as MediaTypeCode[],
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Status</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...statusFilterOptions,
                    ]}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        status: value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="routing-config-page__admin-actions">
                <BaseButton
                  variant="primary"
                  onClick={() => setAppliedFilters({ ...filterDraft })}
                >
                  Search
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  onClick={() => {
                    const nextFilters = {
                      channelTypeCode: '',
                      keyword: '',
                      mediaTypes: [] as MediaTypeCode[],
                      status: '',
                    }

                    setFilterDraft(nextFilters)
                    setAppliedFilters(nextFilters)
                  }}
                >
                  Reset
                </BaseButton>
              </div>
            </div>
          </div>
          <AdminTable
            columns={columns}
            dataSource={filteredChannels}
            pagination={paginationConfig}
            rowKey="channelId"
            scroll={{ x: 1380 }}
            size="small"
          />
        </BaseCard>
      </section>

      <AdminModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(modalMode)}
        title={
          modalMode === 'business'
            ? 'Business Config'
            : modalMode === 'accounts'
              ? 'Account Management'
              : 'Edit Channel'
        }
        width={modalMode === 'accounts' ? 1120 : modalMode === 'business' ? 980 : 900}
        onCancel={closeModal}
      >
        <div className="routing-config-crud-modal__sections">
          {submitAttempted && validationErrors.length > 0 && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              message="Please check the form"
              description={
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
              type="warning"
            />
          )}
          {notice && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              message={notice}
              type="warning"
            />
          )}
          {modalMode === 'edit' && (
            <>
              <section className="routing-config-media-rule-modal__section">
                <header>
                  <strong>Basic Information</strong>
                </header>
                <div className="routing-config-crud-modal__section-grid">
                  <label className="routing-config-crud-modal__field">
                    <span>Channel ID</span>
                    <Input disabled value={draft.channelId} />
                  </label>
                  <label className="routing-config-crud-modal__field">
                    <span>Channel Name</span>
                    <Input disabled value={draft.channelName} />
                  </label>
                  <label className="routing-config-crud-modal__field">
                    <span>Channel Type</span>
                    <Input
                      disabled
                      value={
                        channelTypeByCode.get(draft.channelTypeCode)
                          ?.channelTypeName ?? draft.channelTypeCode
                      }
                    />
                  </label>
                  <label className="routing-config-crud-modal__field">
                    <span>
                      Media Type <strong>*</strong>
                    </span>
                    <Select
                      mode="multiple"
                      options={mediaOptions}
                      value={draft.mediaTypes}
                      onChange={(value) =>
                        updateMediaTypes(value as MediaTypeCode[])
                      }
                    />
                  </label>
                  <label className="routing-config-crud-modal__field routing-config-crud-modal__field--status">
                    <span>Status</span>
                    <span className="routing-config-crud-modal__switch-row">
                      <Switch
                        className="routing-config-status-switch"
                        checked={draft.status === 'Active'}
                        size="small"
                        onChange={(checked) =>
                          updateDraft('status', checked ? 'Active' : 'Disabled')
                        }
                      />
                      <em>
                        {draft.status === 'Active' ? 'Enabled' : 'Disabled'}
                      </em>
                    </span>
                  </label>
                </div>
              </section>
            </>
          )}
          {modalMode === 'business' && (
            <Tabs
              activeKey={businessMediaCode}
              items={draft.mediaTypes.map((mediaType) => ({
                children: renderBusinessMediaForm(mediaType),
                key: mediaType,
                label: mediaLabelByValue.get(mediaType) ?? mediaType,
              }))}
              onChange={(key) => setBusinessMediaCode(key as MediaTypeCode)}
            />
          )}
          {modalMode === 'accounts' && (
            <div className="routing-config-channel-accounts">
              <div className="routing-config-channel-accounts__toolbar">
                <strong>{selectedChannel?.channelName}</strong>
                <BaseButton
                  icon={<PlusOutlined />}
                  variant="primary"
                  onClick={() => openAccountModal('add')}
                >
                  Add Account
                </BaseButton>
              </div>
              {selectedChannelAccounts.length === 0 ? (
                <Alert
                  showIcon
                  message="No accounts configured."
                  type="info"
                />
              ) : (
                <div className="routing-config-channel-account-table">
                  <AdminTable
                    columns={accountColumns}
                    dataSource={selectedChannelAccounts}
                    pagination={false}
                    rowKey="accountCode"
                    scroll={{ x: 900 }}
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {modalMode === 'accounts' ? 'Close' : 'Cancel'}
          </BaseButton>
          {(modalMode === 'edit' || modalMode === 'business') && (
            <BaseButton variant="primary" onClick={handleSave}>
              Save
            </BaseButton>
          )}
        </div>
      </AdminModal>
      <AdminModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(accountModalMode)}
        title={`${accountModalMode === 'delete' ? 'Delete' : accountModalMode === 'edit' ? 'Edit' : 'Add'} Account`}
        width={720}
        onCancel={closeAccountModal}
      >
        <div className="routing-config-crud-modal__sections">
          {accountSubmitAttempted && accountValidationErrors.length > 0 && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              message="Please check the form"
              description={
                <ul>
                  {accountValidationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
              type="warning"
            />
          )}
          {accountModalMode === 'delete' ? (
            <Alert
              showIcon
              description={
                selectedAccount
                  ? getAccountDeleteBlockReason(selectedAccount) ??
                    'This only changes the current demo session.'
                  : ''
              }
              message={
                selectedAccount &&
                getAccountDeleteBlockReason(selectedAccount)
                  ? 'This account cannot be deleted.'
                  : `Delete ${selectedAccount?.accountName ?? ''}?`
              }
              type="warning"
            />
          ) : (
            <div className="routing-config-crud-modal__section-grid routing-config-crud-modal__section-grid--account">
              <label className="routing-config-crud-modal__field">
                <span>
                  Account <strong>*</strong>
                </span>
                <Input
                  value={accountDraft.account}
                  onChange={(event) =>
                    updateAccountDraft('account', event.target.value)
                  }
                />
              </label>
              <label className="routing-config-crud-modal__field">
                <span>
                  Account Name <strong>*</strong>
                </span>
                <Input
                  value={accountDraft.accountName}
                  onChange={(event) =>
                    updateAccountDraft('accountName', event.target.value)
                  }
                />
              </label>
              <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
                <span>
                  Credential / Secret Ref <strong>*</strong>
                </span>
                <Input.Password
                  value={accountDraft.credentialRef}
                  onChange={(event) =>
                    updateAccountDraft('credentialRef', event.target.value)
                  }
                />
              </label>
              <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
                <span>Purpose</span>
                <Input.TextArea
                  rows={2}
                  value={accountDraft.purpose}
                  onChange={(event) =>
                    updateAccountDraft('purpose', event.target.value)
                  }
                />
              </label>
              <label className="routing-config-crud-modal__field routing-config-crud-modal__field--status">
                <span>Status</span>
                <span className="routing-config-crud-modal__switch-row">
                  <Switch
                    className="routing-config-status-switch"
                    checked={accountDraft.status === 'Active'}
                    size="small"
                    onChange={(checked) =>
                      updateAccountDraft(
                        'status',
                        checked ? 'Active' : 'Disabled',
                      )
                    }
                  />
                  <em>
                    {accountDraft.status === 'Active' ? 'Enabled' : 'Disabled'}
                  </em>
                </span>
              </label>
            </div>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeAccountModal}>
            Cancel
          </BaseButton>
          {accountModalMode === 'delete' && (
            <BaseButton
              disabled={
                selectedAccount
                  ? Boolean(getAccountDeleteBlockReason(selectedAccount))
                  : true
              }
              variant="danger"
              onClick={handleAccountDelete}
            >
              Delete
            </BaseButton>
          )}
          {(accountModalMode === 'add' || accountModalMode === 'edit') && (
            <BaseButton variant="primary" onClick={handleAccountSave}>
              Save
            </BaseButton>
          )}
        </div>
      </AdminModal>
      <AdminModal
        className="routing-config-crud-modal routing-config-working-time-modal"
        kind="detail"
        open={Boolean(previewWorkingTimePlan)}
        title="View Working Time Plan"
        width={1080}
        onCancel={() => setPreviewWorkingTimePlan(null)}
      >
        {previewWorkingTimePlan && (
          <WorkingTimePlanPreviewContent plan={previewWorkingTimePlan} />
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton
            variant="secondary"
            onClick={() => setPreviewWorkingTimePlan(null)}
          >
            Close
          </BaseButton>
        </div>
      </AdminModal>
    </AdminPage>
  )
}

const mediaServiceVariablesByMessageField: Partial<
  Record<keyof MediaServiceRulePlan, string[]>
> = {
  accessSuccessWelcomeMessage: ['{customerName}', '{channelName}'],
  agentEndReminder: ['{customerName}', '{agentName}'],
  agentTimeoutNotice: ['{customerName}', '{timeoutMinutes}'],
  assignedAgentGreeting: [
    '{customerName}',
    '{agentName}',
    '{timeoutMinutes}',
  ],
  customerTimeoutNotice: ['{customerName}'],
  nonWorkingTimeMessage: ['{workTime}'],
  preTimeoutReminderMessage: ['{reminderMinutes}'],
  queueWaitingMessage: ['{estimatedWaitMinutes}'],
}

const mediaServiceModalTitleByMode = {
  add: '����ý�������򷽰�',
  delete: 'ɾ��ý�������򷽰�',
  edit: '�༭ý�������򷽰�',
  view: '�鿴ý�������򷽰�',
}

const mediaServiceModalMediaOptions: Array<{
  label: string
  value: MediaTypeCode
}> = [
  { label: 'Voice', value: 'VOICE' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'DM', value: 'TEXT' },
  { label: 'Non-DM', value: 'NON_DM' },
]

const mediaServiceAccessWelcomeMessageByMedia: Record<MediaTypeCode, string> = {
  TEXT: 'Hello, BANK 1 digital assistant is ready to help you.',
  VIDEO: 'Hello, BANK 1 video assistant is ready to help you.',
  VOICE: 'Hello, BANK 1 voice assistant is ready to help you.',
  NON_DM: 'Hello, BANK 1 social service assistant is ready to help you.',
}

function createDefaultMediaServiceRulePlan(
  existingPlans: MediaServiceRulePlan[],
  mediaCode: MediaTypeCode = 'TEXT',
): MediaServiceRulePlan {
  const nextIndex =
    existingPlans.filter((plan) => plan.mediaCode === mediaCode).length + 1

  return {
    accessSuccessWelcomeMessage:
      mediaServiceAccessWelcomeMessageByMedia[mediaCode],
    agentNoReplyAutoResponseMessage: '���Ժ��������ڴ����',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: '�ܸ���Ϊ������ף��������죡',
    assignedAgentGreeting:
      '�𾴵�{customerName}���ã�{agentName}��Ϊ��������������{timeoutMinutes}����δ�ظ����Ự���Զ��رգ�������ʱ�鿴��',
    agentTimeoutNotice: '�ͻ���ʱδ�ظ����Ự�Զ��رա�',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'δ�յ����Ļظ������Զ��رշ���������Ҫ���ٴ���ϵ�ͷ���',
    description: '',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode,
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      '��Ǹ������ʱ��Ϊ{workTime}�����ڴ�ʱ����ϵ���ǡ�',
    planCode: `MSRP_${mediaCode}_${String(nextIndex).padStart(2, '0')}`,
    planName: '',
    preTimeoutReminderMessage:
      'ϵͳδ�յ��ظ�������{reminderMinutes}���Ӻ�����Ự��',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage: '��ǰ�˹�����æ�����Ժ����ԡ�',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      '��ǰ�˹�����æ��Ԥ�Ƶȴ�{estimatedWaitMinutes}���ӡ�',
    status: 'Active',
    updatedAt: '',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  }
}

export function MediaServiceRulePlansPage() {
  const mediaServiceRulePlans = useRoutingConfigStore(
    (state) => state.mediaServiceRulePlans,
  )
  const channelMediaRuleBindings = useRoutingConfigStore(
    (state) => state.channelMediaRuleBindings,
  )
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { mediaOptions } = useRoutingLookups()
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    mediaCode: '',
    status: '',
  })
  const [filterDraft, setFilterDraft] = useState({
    keyword: '',
    mediaCode: '',
    status: '',
  })
  const [draft, setDraft] = useState<MediaServiceRulePlan>(() =>
    createDefaultMediaServiceRulePlan(mediaServiceRulePlans),
  )
  const [modalMode, setModalMode] = useState<
    'add' | 'delete' | 'edit' | 'view' | null
  >(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] =
    useState<MediaServiceRulePlan | null>(null)
  const messageSelectionsRef = useRef<
    Record<string, { end: number; start: number }>
  >({})
  const messageTextAreaRefs = useRef<Record<string, HTMLTextAreaElement | null>>(
    {},
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const mediaLabelByValue = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const openModal = (
    mode: 'add' | 'delete' | 'edit' | 'view',
    record?: MediaServiceRulePlan,
  ) => {
    setModalMode(mode)
    setSelectedPlan(record ?? null)
    setDraft(
      record
        ? { ...record }
        : createDefaultMediaServiceRulePlan(mediaServiceRulePlans),
    )
    setNotice(null)
    setSubmitAttempted(false)
  }
  const closeModal = () => {
    setModalMode(null)
    setNotice(null)
    setSelectedPlan(null)
  }
  const updateDraft = <Key extends keyof MediaServiceRulePlan>(
    key: Key,
    value: MediaServiceRulePlan[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }
  const updateDraftMediaCode = (mediaCode: MediaTypeCode) => {
    if (modalMode !== 'add') {
      return
    }

    const nextDefaults = createDefaultMediaServiceRulePlan(
      mediaServiceRulePlans,
      mediaCode,
    )

    messageSelectionsRef.current = {}
    messageTextAreaRefs.current = {}
    setDraft((currentDraft) => {
      const shouldReplaceGeneratedPlanCode =
        !currentDraft.planCode.trim() ||
        /^MSRP_(TEXT|VOICE|VIDEO|NON_DM)_\d+$/.test(currentDraft.planCode)
      const previousDefaultWelcome =
        mediaServiceAccessWelcomeMessageByMedia[currentDraft.mediaCode]
      const shouldReplaceWelcome =
        !currentDraft.accessSuccessWelcomeMessage.trim() ||
        currentDraft.accessSuccessWelcomeMessage === previousDefaultWelcome

      return {
        ...currentDraft,
        accessSuccessWelcomeMessage: shouldReplaceWelcome
          ? nextDefaults.accessSuccessWelcomeMessage
          : currentDraft.accessSuccessWelcomeMessage,
        mediaCode,
        planCode: shouldReplaceGeneratedPlanCode
          ? nextDefaults.planCode
          : currentDraft.planCode,
      }
    })
  }
  const rememberMessageSelection = (
    field: keyof MediaServiceRulePlan,
    element: HTMLTextAreaElement,
  ) => {
    const fieldKey = String(field)
    messageTextAreaRefs.current[fieldKey] = element
    messageSelectionsRef.current[fieldKey] = {
      end: element.selectionEnd,
      start: element.selectionStart,
    }
  }
  const queueMessageSelectionRemember = (
    field: keyof MediaServiceRulePlan,
    element: HTMLTextAreaElement,
  ) => {
    window.requestAnimationFrame(() => {
      rememberMessageSelection(field, element)
    })
  }
  const insertMessageVariable = (
    field: keyof MediaServiceRulePlan,
    variable: string,
  ) => {
    const currentValue = String(draft[field] ?? '')
    const fieldKey = String(field)
    const messageTextArea = messageTextAreaRefs.current[fieldKey]
    const storedSelection = messageSelectionsRef.current[fieldKey]
    const shouldReadLiveSelection =
      messageTextArea && document.activeElement === messageTextArea
    const activeSelection =
      shouldReadLiveSelection &&
      Number.isFinite(messageTextArea.selectionStart) &&
      Number.isFinite(messageTextArea.selectionEnd)
        ? {
            end: messageTextArea.selectionEnd,
            start: messageTextArea.selectionStart,
          }
        : storedSelection
    const start = activeSelection
      ? Math.min(activeSelection.start, currentValue.length)
      : currentValue.length
    const end = activeSelection
      ? Math.min(activeSelection.end, currentValue.length)
      : currentValue.length
    const nextValue = `${currentValue.slice(0, start)}${variable}${currentValue.slice(end)}`
    const nextCursorPosition = start + variable.length

    updateDraft(field, nextValue as never)
    messageSelectionsRef.current[fieldKey] = {
      end: nextCursorPosition,
      start: nextCursorPosition,
    }
    window.requestAnimationFrame(() => {
      const currentMessageTextArea = messageTextAreaRefs.current[fieldKey]
      currentMessageTextArea?.focus()
      currentMessageTextArea?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      )
    })
  }
  const validationErrors = useMemo(() => {
    if (!modalMode || modalMode === 'delete' || modalMode === 'view') {
      return []
    }

    const errors: string[] = []

    const planCode = draft.planCode.trim()

    if (!planCode) {
      errors.push('����IDΪ�����')
    } else if (!/^[A-Z0-9_-]+$/.test(planCode)) {
      errors.push('����IDֻ��ʹ�ô�дӢ����ĸ�����֡��»��߻����ַ���')
    }

    const duplicatedPlanCode = mediaServiceRulePlans.some(
      (plan) =>
        plan.planCode === planCode &&
        plan.planCode !== selectedPlan?.planCode,
    )

    if (duplicatedPlanCode) {
      errors.push('����ID�Ѵ��ڡ�')
    }

    if (!draft.planName.trim()) {
      errors.push('��������Ϊ�����')
    }

    const positiveNumberFields: Array<[keyof MediaServiceRulePlan, string]> = [
      [
        'maxConcurrentAccess',
        draft.mediaCode === 'VIDEO' ? '���벢����Ƶ��' : '���벢�������',
      ],
      ['minScanIntervalSeconds', '������Сɨ����'],
    ]

    if (draft.mediaCode === 'TEXT') {
      positiveNumberFields.push(
        ['maxQueueCustomers', '����Ŷ�����'],
        ['queueTimeoutMinutes', '�Ŷӳ�ʱʱ��'],
        ['preTimeoutReminderMinutes', 'δ�ظ���ʱǰ����ʱ��'],
        ['customerNoReplyTimeoutMinutes', '�ͻ�δ�ظ���ʱʱ��'],
        ['agentNoReplyTimeoutSeconds', '��ϯδ�ظ���ʱʱ��'],
        ['webchatRecallLimitSeconds', 'Webchat��Ϣ����ʱ��'],
        ['agentNoReplyWarningSeconds', '��ϯδ�ظ���ɫ����'],
        ['agentNoReplyBreachSeconds', '��ϯδ�ظ���ɫ��ʾ'],
      )
    }

    positiveNumberFields.forEach(([field, label]) => {
      const value = draft[field]

      if (typeof value !== 'number' || value <= 0) {
        errors.push(`${label}�������0��`)
      }
    })

    const requiredMessageFields: Array<[keyof MediaServiceRulePlan, string]> = [
      ['accessSuccessWelcomeMessage', '����ɹ���ӭ��'],
    ]

    if (draft.mediaCode === 'TEXT') {
      if (
        draft.preTimeoutReminderMinutes >= draft.customerNoReplyTimeoutMinutes
      ) {
        errors.push('δ�ظ���ʱǰ����ʱ�����С�ڿͻ�δ�ظ���ʱʱ����')
      }

      if (draft.agentNoReplyWarningSeconds > draft.agentNoReplyBreachSeconds) {
        errors.push('��ϯδ�ظ���ɫ����ʱ�����С�ڻ���ں�ɫ��ʾʱ�䡣')
      }

      if (draft.agentNoReplyBreachSeconds > draft.agentNoReplyTimeoutSeconds) {
        errors.push('��ϯδ�ظ���ɫ��ʾʱ�����С�ڻ������ϯδ�ظ���ʱʱ����')
      }

      requiredMessageFields.push(
        ['agentNoReplyAutoResponseMessage', '�Զ��ظ�����'],
        ['preTimeoutReminderMessage', 'δ�ظ���ʱǰ����'],
        ['customerTimeoutNotice', 'δ�ظ���ʱ�ͻ�����'],
        ['agentTimeoutNotice', 'δ�ظ���ʱ��ϯ����'],
        ['nonWorkingTimeMessage', '���˹�����ʱ����ʾ��'],
        ['queueWaitingMessage', '�Ŷ���ʾ��'],
        ['queueTimeoutMessage', '�Ŷӳ�ʱ��ʾ��'],
        ['assignedAgentGreeting', '������ϯ�ɹ��ʺ���'],
        ['agentEndReminder', '��ϯ�Ҷ�����'],
      )
    }

    requiredMessageFields.forEach(([field, label]) => {
      const value = draft[field]

      if (typeof value !== 'string' || !value.trim()) {
        errors.push(`${label}Ϊ�����`)
      }
    })

    return errors
  }, [
    draft,
    mediaServiceRulePlans,
    modalMode,
    selectedPlan,
  ])
  const filteredPlans = useMemo(
    () =>
      mediaServiceRulePlans.filter((plan) => {
        const keyword = appliedFilters.keyword.trim().toLowerCase()
        const keywordMatched = keyword
          ? [plan.planCode, plan.planName, plan.description].some((value) =>
              value.toLowerCase().includes(keyword),
            )
          : true
        const mediaMatched = appliedFilters.mediaCode
          ? plan.mediaCode === appliedFilters.mediaCode
          : true
        const statusMatched = appliedFilters.status
          ? plan.status === appliedFilters.status
          : true

        return keywordMatched && mediaMatched && statusMatched
      }),
    [appliedFilters, mediaServiceRulePlans],
  )
  const paginationConfig = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} records`,
  }
  const getDeleteBlockReason = (record: MediaServiceRulePlan) =>
    channelMediaRuleBindings.some(
      (binding) => binding.rulePlanCode === record.planCode,
    )
      ? '�ù��򷽰��ѱ�����ý������ã�����ɾ����'
      : null
  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const nextPlan: MediaServiceRulePlan = {
      ...draft,
      planCode: draft.planCode.trim(),
      planName: draft.planName.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
      updatedBy: 'Admin',
    }

    upsertEntity('mediaServiceRulePlans', 'planCode', nextPlan)
    closeModal()
  }
  const handleDelete = () => {
    if (!selectedPlan) {
      return
    }

    const blockReason = getDeleteBlockReason(selectedPlan)

    if (blockReason) {
      setNotice(blockReason)
      return
    }

    deleteEntity('mediaServiceRulePlans', 'planCode', selectedPlan.planCode)
    closeModal()
  }
  const isReadOnly = modalMode === 'delete' || modalMode === 'view'
  const deleteBlockReason =
    modalMode === 'delete' && selectedPlan
      ? getDeleteBlockReason(selectedPlan)
      : null
  const renderMessageField = (
    field: keyof MediaServiceRulePlan,
    label: string,
    rows = 2,
    full = false,
  ) => {
    const variableOptions = mediaServiceVariablesByMessageField[field] ?? []

    return (
      <label
        className={`routing-config-crud-modal__field routing-config-media-rule-modal__message-field${
          full ? ' routing-config-media-rule-modal__message-field--full' : ''
        }`}
      >
        <span className="routing-config-media-rule-modal__field-heading">
          <span>
            {label} <strong>*</strong>
          </span>
          {!isReadOnly && variableOptions.length > 0 && (
            <select
              aria-label={`${label}�������`}
              className="routing-config-media-rule-modal__variable-select"
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  insertMessageVariable(field, event.target.value)
                }
              }}
            >
              <option value="">�������</option>
              {variableOptions.map((variable) => (
                <option key={variable} value={variable}>
                  {variable}
                </option>
              ))}
            </select>
          )}
        </span>
        <Input.TextArea
          disabled={isReadOnly}
          rows={rows}
          value={String(draft[field] ?? '')}
          onChange={(event) =>
            updateDraft(field, event.target.value as never)
          }
          onBlur={(event) =>
            rememberMessageSelection(field, event.currentTarget)
          }
          onClick={(event) =>
            rememberMessageSelection(field, event.currentTarget)
          }
          onFocus={(event) =>
            rememberMessageSelection(field, event.currentTarget)
          }
          onKeyDown={(event) =>
            queueMessageSelectionRemember(field, event.currentTarget)
          }
          onKeyUp={(event) =>
            rememberMessageSelection(field, event.currentTarget)
          }
          onMouseUp={(event) =>
            queueMessageSelectionRemember(field, event.currentTarget)
          }
          onSelect={(event) =>
            rememberMessageSelection(field, event.currentTarget)
          }
        />
      </label>
    )
  }
  const renderNumberField = (
    field: keyof MediaServiceRulePlan,
    label: string,
    unit: string,
    min = 1,
  ) => (
    <label className="routing-config-crud-modal__field routing-config-media-rule-modal__number-field">
      <span>{label}</span>
      <span className="routing-config-media-rule-modal__number-control">
        <InputNumber
          disabled={isReadOnly}
          min={min}
          value={Number(draft[field] ?? 0)}
          onChange={(value) =>
            updateDraft(field, (Number(value) || 0) as never)
          }
        />
        <em>{unit}</em>
      </span>
    </label>
  )
  const renderModalStatus = () =>
    isReadOnly ? (
      <em>{draft.status === 'Active' ? '����' : '����'}</em>
    ) : (
      <span className="routing-config-crud-modal__switch-row">
        <Switch
          className="routing-config-status-switch"
          checked={draft.status === 'Active'}
          size="small"
          onChange={(checked) =>
            updateDraft('status', checked ? 'Active' : 'Disabled')
          }
        />
        <em>{draft.status === 'Active' ? '����' : '����'}</em>
      </span>
    )
  const columns: ColumnsType<MediaServiceRulePlan> = [
    {
      dataIndex: 'planCode',
      fixed: 'left',
      title: 'Plan ID',
      width: 180,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'planName', title: 'Plan Name', width: 200 },
    {
      dataIndex: 'mediaCode',
      title: 'Media Type',
      width: 120,
      render: (value: MediaTypeCode) => mediaLabelByValue.get(value) ?? value,
    },
    { dataIndex: 'description', title: 'Description', width: 260 },
    { dataIndex: 'updatedAt', title: 'Updated Date', width: 140 },
    { dataIndex: 'updatedBy', title: 'Updated By', width: 120 },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 120,
      render: renderRoutingStatus,
    },
    {
      fixed: 'right',
      title: 'Actions',
      width: 156,
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`View ${record.planCode}`}
            title="View"
            type="button"
            onClick={() => openModal('view', record)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${record.planCode}`}
            title="Edit"
            type="button"
            onClick={() => openModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.planCode}`}
            title="Delete"
            type="button"
            onClick={() => openModal('delete', record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminPage title="Media Service Rule Plans">
      <section className="routing-config-page">
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              <div className="routing-config-page__filters">
                <label
                  className="routing-config-page__filter"
                  style={{ width: 240 }}
                >
                  <span>Keyword</span>
                  <Input
                    placeholder="Plan ID / Name / Description"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        keyword: event.target.value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Media Type</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...mediaOptions,
                    ]}
                    value={filterDraft.mediaCode}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        mediaCode: value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Status</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...statusFilterOptions,
                    ]}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        status: value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="routing-config-page__admin-actions">
                <BaseButton
                  variant="primary"
                  onClick={() => setAppliedFilters({ ...filterDraft })}
                >
                  Search
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  onClick={() => {
                    const nextFilters = {
                      keyword: '',
                      mediaCode: '',
                      status: '',
                    }

                    setFilterDraft(nextFilters)
                    setAppliedFilters(nextFilters)
                  }}
                >
                  Reset
                </BaseButton>
              </div>
            </div>
            <div className="routing-config-page__add-action">
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={() => openModal('add')}
              >
                Add
              </BaseButton>
            </div>
          </div>
          <AdminTable
            columns={columns}
            dataSource={filteredPlans}
            pagination={paginationConfig}
            rowKey="planCode"
            scroll={{ x: 1250 }}
            size="small"
          />
        </BaseCard>
      </section>

      <AdminModal
        className="routing-config-crud-modal routing-config-media-rule-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(modalMode)}
        title={
          modalMode
            ? mediaServiceModalTitleByMode[modalMode]
            : 'ý�������򷽰�'
        }
        width={1120}
        onCancel={closeModal}
      >
        <div className="routing-config-media-rule-modal__form">
          {submitAttempted && validationErrors.length > 0 && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              message="������������"
              description={
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
              type="warning"
            />
          )}
          {notice && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              message={notice}
              type="warning"
            />
          )}
          {modalMode === 'delete' ? (
            <div className="routing-config-crud-modal__delete">
              {deleteBlockReason ? (
                <Alert
                  showIcon
                  description={deleteBlockReason}
                  message="��ǰ��¼����ɾ����"
                  type="warning"
                />
              ) : (
                <Alert
                  showIcon
                  description="�˲���ֻӰ�쵱ǰǰ����ʾ�Ự��"
                  message={`ȷ��ɾ�� ${selectedPlan?.planName ?? ''}��`}
                  type="warning"
                />
              )}
            </div>
          ) : (
            <>
              <section className="routing-config-media-rule-modal__section">
                <header>
                  <strong>������Ϣ</strong>
                </header>
                <div className="routing-config-media-rule-modal__basic-grid">
                  <label className="routing-config-crud-modal__field">
                    <span>
                      ����ID <strong>*</strong>
                    </span>
                    <Input
                      disabled={isReadOnly || modalMode === 'edit'}
                      value={draft.planCode}
                      onChange={(event) =>
                        updateDraft('planCode', event.target.value)
                      }
                    />
                  </label>
                  <label className="routing-config-crud-modal__field">
                    <span>
                      �������� <strong>*</strong>
                    </span>
                    <Input
                      disabled={isReadOnly}
                      value={draft.planName}
                      onChange={(event) =>
                        updateDraft('planName', event.target.value)
                      }
                    />
                  </label>
                  <label className="routing-config-crud-modal__field">
                    <span>ý������</span>
                    <Select
                      disabled={isReadOnly || modalMode === 'edit'}
                      options={mediaServiceModalMediaOptions}
                      value={draft.mediaCode}
                      onChange={(value) =>
                        updateDraftMediaCode(value as MediaTypeCode)
                      }
                    />
                  </label>
                  <label className="routing-config-crud-modal__field routing-config-crud-modal__field--status">
                    <span>״̬</span>
                    {renderModalStatus()}
                  </label>
                  <label className="routing-config-crud-modal__field routing-config-media-rule-modal__description">
                    <span>��ע</span>
                    <Input.TextArea
                      disabled={isReadOnly}
                      rows={2}
                      value={draft.description}
                      onChange={(event) =>
                        updateDraft('description', event.target.value)
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="routing-config-media-rule-modal__section">
                <header>
                  <strong>�ͻ���������</strong>
                </header>
                <div className="routing-config-media-rule-modal__subsections">
                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>
                      {draft.mediaCode === 'TEXT' ? '����������' : '��������'}
                    </h4>
                    <div className="routing-config-media-rule-modal__compact-row">
                      {renderNumberField(
                        'maxConcurrentAccess',
                        draft.mediaCode === 'VIDEO'
                          ? '���벢����Ƶ��'
                          : '���벢�������',
                        '��',
                      )}
                      {renderNumberField(
                        'minScanIntervalSeconds',
                        '������Сɨ����',
                        '��',
                      )}
                    </div>
                    <div className="routing-config-media-rule-modal__full-row">
                      {renderMessageField(
                        'accessSuccessWelcomeMessage',
                        '����ɹ���ӭ��',
                        2,
                        true,
                      )}
                    </div>
                  </div>

                  {draft.mediaCode === 'TEXT' && (
                    <>
                      <div className="routing-config-media-rule-modal__subsection">
                        <h4>�Ŷ�����</h4>
                        <div className="routing-config-media-rule-modal__full-row">
                          {renderMessageField(
                            'nonWorkingTimeMessage',
                            '���˹�����ʱ����ʾ��',
                            2,
                            true,
                          )}
                        </div>
                        <div className="routing-config-media-rule-modal__paired-row">
                          {renderNumberField(
                            'maxQueueCustomers',
                            '����Ŷ�����',
                            '��',
                          )}
                          {renderMessageField(
                            'queueWaitingMessage',
                            '�Ŷ���ʾ��',
                          )}
                        </div>
                        <div className="routing-config-media-rule-modal__paired-row">
                          {renderNumberField(
                            'queueTimeoutMinutes',
                            '�Ŷӳ�ʱʱ��',
                            '��',
                          )}
                          {renderMessageField(
                            'queueTimeoutMessage',
                            '�Ŷӳ�ʱ��ʾ��',
                          )}
                        </div>
                      </div>

                      <div className="routing-config-media-rule-modal__subsection">
                        <h4>�˹�����/��������</h4>
                        <div className="routing-config-media-rule-modal__full-row">
                          {renderMessageField(
                            'assignedAgentGreeting',
                            '������ϯ�ɹ��ʺ���',
                            2,
                            true,
                          )}
                        </div>
                        <div className="routing-config-media-rule-modal__full-row">
                          {renderMessageField(
                            'agentEndReminder',
                            '��ϯ�Ҷ�����',
                            2,
                            true,
                          )}
                        </div>
                      </div>

                      <div className="routing-config-media-rule-modal__subsection">
                        <h4>�ͻ�δ�ظ�����</h4>
                        <div className="routing-config-media-rule-modal__paired-row">
                          {renderNumberField(
                            'preTimeoutReminderMinutes',
                            'δ�ظ���ʱǰ����ʱ��',
                            '��',
                          )}
                          {renderMessageField(
                            'preTimeoutReminderMessage',
                            'δ�ظ���ʱǰ����',
                          )}
                        </div>
                        <div className="routing-config-media-rule-modal__paired-row">
                          {renderNumberField(
                            'customerNoReplyTimeoutMinutes',
                            '�ͻ�δ�ظ���ʱʱ��',
                            '��',
                          )}
                          {renderMessageField(
                            'customerTimeoutNotice',
                            'δ�ظ���ʱ�ͻ�����',
                          )}
                        </div>
                        <div className="routing-config-media-rule-modal__full-row">
                          {renderMessageField(
                            'agentTimeoutNotice',
                            'δ�ظ���ʱ��ϯ����',
                            2,
                            true,
                          )}
                        </div>
                      </div>

                      <div className="routing-config-media-rule-modal__subsection">
                        <h4>��ϯδ�ظ�����</h4>
                        <div className="routing-config-media-rule-modal__paired-row">
                          {renderNumberField(
                            'agentNoReplyTimeoutSeconds',
                            '��ϯδ�ظ���ʱʱ��',
                            '��',
                          )}
                          {renderMessageField(
                            'agentNoReplyAutoResponseMessage',
                            '�Զ��ظ�����',
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {draft.mediaCode === 'TEXT' && (
                <section className="routing-config-media-rule-modal__section">
                  <header>
                    <strong>��ϯ��������</strong>
                  </header>
                  <div className="routing-config-media-rule-modal__subsections">
                    <div className="routing-config-media-rule-modal__subsection">
                      <h4>Webchat ��Ϣ����</h4>
                      <div className="routing-config-media-rule-modal__compact-row">
                        {renderNumberField(
                          'webchatRecallLimitSeconds',
                          'Webchat��Ϣ����ʱ��',
                          '��',
                        )}
                      </div>
                    </div>

                    <div className="routing-config-media-rule-modal__subsection">
                      <h4>��ϯδ�ظ����񼶱�</h4>
                      <div className="routing-config-media-rule-modal__compact-row">
                        {renderNumberField(
                          'agentNoReplyWarningSeconds',
                          '��ɫ����',
                          '��',
                        )}
                        {renderNumberField(
                          'agentNoReplyBreachSeconds',
                          '��ɫ��ʾ',
                          '��',
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton
            autoInsertSpace={false}
            variant="secondary"
            onClick={closeModal}
          >
            <span>{modalMode === 'view' ? '�ر�' : 'ȡ��'}</span>
          </BaseButton>
          {modalMode === 'delete' && !deleteBlockReason && (
            <BaseButton
              autoInsertSpace={false}
              variant="danger"
              onClick={handleDelete}
            >
              <span>ɾ��</span>
            </BaseButton>
          )}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <BaseButton
              autoInsertSpace={false}
              variant="primary"
              onClick={handleSave}
            >
              <span>����</span>
            </BaseButton>
          )}
        </div>
      </AdminModal>
    </AdminPage>
  )
}

export function BusinessTypesPage() {
  const businessTypes = useRoutingConfigStore((state) => state.businessTypes)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules } = useRoutingLookups()

  return (
    <RoutingConfigCrudPage<BusinessType>
      columns={[
        {
          dataIndex: 'businessTypeCode',
          title: 'Business Type ID',
          width: 170,
          render: (value: string) => <strong>{value}</strong>,
        },
        {
          dataIndex: 'sourceBusinessCode',
          title: 'Source Business Code',
          width: 210,
        },
        { dataIndex: 'businessName', title: 'Business Name' },
        { dataIndex: 'status', title: 'Status', width: 120, render: renderRoutingStatus },
      ]}
      createDraft={() => ({
        businessName: '',
        businessTypeCode: '04',
        projectCode: 'BANK1',
        sourceBusinessCode: '',
        status: 'Active',
      })}
      data={businessTypes}
      description="Manage two-digit manual business type codes."
      draftToRecord={(draft) => ({
        businessName: stringValue(draft.businessName),
        businessTypeCode: stringValue(draft.businessTypeCode),
        projectCode: stringValue(draft.projectCode) || 'BANK1',
        sourceBusinessCode: stringValue(draft.sourceBusinessCode),
        status: statusValue(draft.status),
      })}
      fields={[
        { key: 'businessTypeCode', label: 'Business Type ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'sourceBusinessCode', label: 'Source Business Code', required: true, type: 'text' },
        { key: 'businessName', label: 'Business Name', required: true, type: 'text' },
        { key: 'status', label: 'Status', switchLabels: statusSwitchLabels, type: 'statusSwitch' },
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [
              record.businessTypeCode,
              record.sourceBusinessCode,
              record.businessName,
            ].some((fieldValue) => fieldValue.toLowerCase().includes(keyword))
          },
          placeholder: 'Business Type ID / Source Business Code / Name',
          type: 'text',
          width: 360,
        },
        {
          key: 'status',
          label: 'Status',
          match: (record, value) => record.status === value,
          options: statusFilterOptions,
          type: 'select',
          width: 200,
        },
      ]}
      getDeleteBlockReason={(record) =>
        routingRules.some((rule) =>
          rule.conditions.some(
            (condition) =>
              condition.factorCode === '15' &&
              condition.factorValueCode === record.businessTypeCode,
          ),
        )
          ? 'This business type is referenced by site access volume or routing rules.'
          : null
      }
      idField="businessTypeCode"
      recordToDraft={(record) => ({ ...record })}
      searchFields={['businessTypeCode', 'sourceBusinessCode', 'businessName']}
      title="Business Types"
      validateDraft={(draft, currentRecord) => [
        ...validateCode(
          stringValue(draft.businessTypeCode),
          'Business Type ID',
          /^\d{2}$/,
        ),
        ...validateUnique(
          businessTypes,
          currentRecord,
          'businessTypeCode',
          stringValue(draft.businessTypeCode),
          'Business Type ID',
        ),
        ...validateCode(
          stringValue(draft.sourceBusinessCode),
          'Source Business Code',
        ),
        ...validateUnique(
          businessTypes,
          currentRecord,
          'sourceBusinessCode',
          stringValue(draft.sourceBusinessCode),
          'Source Business Code',
        ),
        ...fieldRequired(draft, 'businessName', 'Business Name'),
      ]}
      onDelete={(record) =>
        deleteEntity(
          'businessTypes',
          'businessTypeCode',
          record.businessTypeCode,
        )
      }
      onSave={(record) =>
        upsertEntity('businessTypes', 'businessTypeCode', record)
      }
    />
  )
}

type SiteAccessVolumeModalMode = 'add' | 'delete' | 'edit' | 'view'

type SiteRatioDraftByMedia = Record<string, Record<string, number>>

interface SiteAccessVolumeChannelRow {
  channelCode: string
  channelId: string
  channelName: string
  groups: SiteAccessRatioGroup[]
  mediaCodes: MediaTypeCode[]
  status: RoutingConfigStatus
}

interface SiteAccessVolumeMediaRow {
  channelCode: string
  channelId: string
  channelName: string
  channelRow: SiteAccessVolumeChannelRow
  group?: SiteAccessRatioGroup
  mediaCode: MediaTypeCode
  rowKey: string
  rowSpan: number
  status: RoutingConfigStatus
}

function buildRatioGroupCode(channelCode: string, mediaCode: string) {
  return `RATIO_${channelCode}_${mediaCode}_DEFAULT`
}

function createEvenSiteRatios(sites: AccessSite[]) {
  if (sites.length === 0) {
    return {}
  }

  const baseRatio = Math.floor(100 / sites.length)
  let remainder = 100 - baseRatio * sites.length

  return sites.reduce<Record<string, number>>((draft, site) => {
    const extraRatio = remainder > 0 ? 1 : 0

    remainder -= extraRatio

    return {
      ...draft,
      [site.siteCode]: baseRatio + extraRatio,
    }
  }, {})
}

function createSiteRatioDraft(
  sites: AccessSite[],
  ratios?: SiteAccessRatioDetail[],
) {
  if (!ratios) {
    return createEvenSiteRatios(sites)
  }

  const ratioMap = new Map(
    ratios.map((ratio) => [ratio.siteCode, ratio.ratioPercent]),
  )

  return sites.reduce<Record<string, number>>(
    (draft, site) => ({
      ...draft,
      [site.siteCode]: ratioMap.get(site.siteCode) ?? 0,
    }),
    {},
  )
}

function siteRatioDraftToDetails(
  sites: AccessSite[],
  ratioDraft: Record<string, number> = {},
): SiteAccessRatioDetail[] {
  return sites.map((site) => ({
    ratioPercent: ratioDraft[site.siteCode] ?? 0,
    siteCode: site.siteCode,
  }))
}

function getSiteRatioTotal(ratioDraft: Record<string, number> = {}) {
  return Object.values(ratioDraft).reduce((sum, ratio) => sum + ratio, 0)
}

export function SiteAccessVolumePage() {
  const siteAccessRatioGroups = useRoutingConfigStore(
    (state) => state.siteAccessRatioGroups,
  )
  const accessSites = useRoutingConfigStore((state) => state.accessSites)
  const channels = useRoutingConfigStore((state) => state.channels)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { channelOptions, mediaOptions } = useRoutingLookups()
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    mediaCode: '',
    status: '',
  })
  const [filterDraft, setFilterDraft] = useState({
    keyword: '',
    mediaCode: '',
    status: '',
  })
  const [modalMode, setModalMode] =
    useState<SiteAccessVolumeModalMode | null>(null)
  const [modalStatus, setModalStatus] =
    useState<RoutingConfigStatus>('Active')
  const [notice, setNotice] = useState<string | null>(null)
  const [ratioDrafts, setRatioDrafts] = useState<SiteRatioDraftByMedia>({})
  const [selectedChannelCode, setSelectedChannelCode] = useState(
    channels[0]?.channelCode ?? '',
  )
  const [selectedChannelRow, setSelectedChannelRow] =
    useState<SiteAccessVolumeChannelRow | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const channelByCode = useMemo(
    () => new Map(channels.map((channel) => [channel.channelCode, channel])),
    [channels],
  )
  const channelLabelMap = useMemo(
    () => new Map(channelOptions.map((option) => [option.value, option.label])),
    [channelOptions],
  )
  const mediaLabelMap = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const paginationConfig = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} records`,
  }
  const getChannelMediaCodes = useCallback(
    (channelCode: string) => channelByCode.get(channelCode)?.mediaTypes ?? [],
    [channelByCode],
  )
  const getExistingRatioGroup = (channelCode: string, mediaCode: MediaTypeCode) =>
    siteAccessRatioGroups.find(
      (group) =>
        group.channelCode === channelCode && group.mediaCode === mediaCode,
    )
  const createChannelRatioDrafts = (channelCode: string) =>
    getChannelMediaCodes(channelCode).reduce<SiteRatioDraftByMedia>(
      (draft, mediaCode) => ({
        ...draft,
        [mediaCode]: createSiteRatioDraft(
          accessSites,
          getExistingRatioGroup(channelCode, mediaCode)?.ratios,
        ),
      }),
      {},
    )
  const getMediaLabel = useCallback(
    (mediaCode: string) => mediaLabelMap.get(mediaCode) ?? mediaCode,
    [mediaLabelMap],
  )
  const getChannelLabel = useCallback(
    (channelCode: string) => channelLabelMap.get(channelCode) ?? channelCode,
    [channelLabelMap],
  )
  const configuredChannelCodes = useMemo(
    () => new Set(siteAccessRatioGroups.map((group) => group.channelCode)),
    [siteAccessRatioGroups],
  )
  const addChannelOptions = useMemo(
    () =>
      channelOptions.map((option) => ({
        ...option,
        disabled: configuredChannelCodes.has(option.value),
      })),
    [channelOptions, configuredChannelCodes],
  )
  const firstAvailableAddChannelCode = useMemo(
    () =>
      channelOptions.find((option) => !configuredChannelCodes.has(option.value))
        ?.value ?? '',
    [channelOptions, configuredChannelCodes],
  )
  const siteAccessRows = useMemo<SiteAccessVolumeChannelRow[]>(() => {
    const groupsByChannel = new Map<string, SiteAccessRatioGroup[]>()

    siteAccessRatioGroups.forEach((group) => {
      groupsByChannel.set(group.channelCode, [
        ...(groupsByChannel.get(group.channelCode) ?? []),
        group,
      ])
    })

    return channels
      .map((channel) => {
        const groups = groupsByChannel.get(channel.channelCode) ?? []

        if (groups.length === 0) {
          return null
        }

        const channelMediaCodes = channel.mediaTypes
        const extraMediaCodes = groups
          .map((group) => group.mediaCode)
          .filter((mediaCode) => !channelMediaCodes.includes(mediaCode))
        const mediaCodes = [...channelMediaCodes, ...extraMediaCodes]
        const status: RoutingConfigStatus = groups.some(
          (group) => group.status === 'Active',
        )
          ? 'Active'
          : 'Disabled'

        return {
          channelCode: channel.channelCode,
          channelId: channel.channelId,
          channelName: channel.channelName,
          groups,
          mediaCodes,
          status,
        }
      })
      .filter((row): row is SiteAccessVolumeChannelRow => Boolean(row))
  }, [channels, siteAccessRatioGroups])
  const getConfiguredGroup = useCallback(
    (row: SiteAccessVolumeChannelRow, mediaCode: MediaTypeCode) =>
      row.groups.find((group) => group.mediaCode === mediaCode),
    [],
  )
  const getSiteConfigText = (group?: SiteAccessRatioGroup) => {
    if (!group) {
      return 'Not configured'
    }

    const ratioMap = new Map(
      group.ratios.map((ratio) => [ratio.siteCode, ratio.ratioPercent]),
    )

    return accessSites
      .map((site) => `${site.siteName} ${ratioMap.get(site.siteCode) ?? 0}%`)
      .join(' | ')
  }
  const modalMediaCodes = useMemo(
    () =>
      modalMode ? getChannelMediaCodes(selectedChannelCode) : [],
    [getChannelMediaCodes, modalMode, selectedChannelCode],
  )
  const isReadOnly = modalMode === 'delete' || modalMode === 'view'
  const validationErrors = useMemo(() => {
    if (!modalMode || isReadOnly) {
      return []
    }

    const errors: string[] = []

    if (!selectedChannelCode) {
      errors.push('Channel is required.')
    }

    if (accessSites.length === 0) {
      errors.push('At least one site is required.')
    }

    if (modalMediaCodes.length === 0) {
      errors.push('Selected channel has no configured media type.')
    }

    modalMediaCodes.forEach((mediaCode) => {
      const total = getSiteRatioTotal(ratioDrafts[mediaCode])

      if (total !== 100) {
        errors.push(
          `${getChannelLabel(selectedChannelCode)} / ${getMediaLabel(
            mediaCode,
          )} total must be 100%. Current total is ${total}%.`,
        )
      }
    })

    return errors
  }, [
    accessSites.length,
    getChannelLabel,
    getMediaLabel,
    isReadOnly,
    modalMediaCodes,
    modalMode,
    ratioDrafts,
    selectedChannelCode,
  ])
  const visibleValidationErrors = submitAttempted ? validationErrors : []
  const filteredData = useMemo<SiteAccessVolumeMediaRow[]>(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase()
    const mediaCodeFilter = appliedFilters.mediaCode

    return siteAccessRows
      .filter((record) => {
        if (appliedFilters.status && record.status !== appliedFilters.status) {
          return false
        }

        if (
          mediaCodeFilter &&
          !record.mediaCodes.some((mediaCode) => mediaCode === mediaCodeFilter)
        ) {
          return false
        }

        if (!keyword) {
          return true
        }

        return [record.channelId, record.channelCode, record.channelName].some(
          (value) => value.toLowerCase().includes(keyword),
        )
      })
      .flatMap((record) => {
        const visibleMediaCodes = mediaCodeFilter
          ? record.mediaCodes.filter((mediaCode) => mediaCode === mediaCodeFilter)
          : record.mediaCodes

        return visibleMediaCodes.map((mediaCode, mediaIndex) => ({
          channelCode: record.channelCode,
          channelId: record.channelId,
          channelName: record.channelName,
          channelRow: record,
          group: getConfiguredGroup(record, mediaCode),
          mediaCode,
          rowKey: `${record.channelCode}-${mediaCode}`,
          rowSpan: mediaIndex === 0 ? visibleMediaCodes.length : 0,
          status: record.status,
        }))
      })
  }, [
    appliedFilters.keyword,
    appliedFilters.mediaCode,
    appliedFilters.status,
    getConfiguredGroup,
    siteAccessRows,
  ])
  const columns: ColumnsType<SiteAccessVolumeMediaRow> = [
    {
      dataIndex: 'channelId',
      title: 'Channel ID',
      width: 130,
      render: (value: string, record) => ({
        children: <strong>{value}</strong>,
        props: { rowSpan: record.rowSpan },
      }),
    },
    {
      dataIndex: 'channelName',
      title: 'Channel Name',
      width: 170,
      render: (value: string, record) => ({
        children: value,
        props: { rowSpan: record.rowSpan },
      }),
    },
    {
      dataIndex: 'mediaCode',
      title: 'Media Type',
      width: 130,
      render: (value: MediaTypeCode) => getMediaLabel(value),
    },
    {
      dataIndex: 'groups',
      title: 'Site Configuration',
      render: (_, record) => (
        <span className="routing-config__site-config-line">
          {getSiteConfigText(record.group)}
        </span>
      ),
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 120,
      render: (value: RoutingConfigStatus, record) => ({
        children: renderRoutingStatus(value),
        props: { rowSpan: record.rowSpan },
      }),
    },
    {
      fixed: 'right',
      title: 'Actions',
      width: 156,
      render: (_, record) => (
        {
          children: (
            <div className="routing-config-crud__row-actions">
              <button
                aria-label={`View ${record.channelName}`}
                title="View"
                type="button"
                onClick={() => openChannelModal('view', record.channelRow)}
              >
                <EyeOutlined />
              </button>
              <button
                aria-label={`Edit ${record.channelName}`}
                title="Edit"
                type="button"
                onClick={() => openChannelModal('edit', record.channelRow)}
              >
                <EditOutlined />
              </button>
              <button
                aria-label={`Delete ${record.channelName}`}
                title="Delete"
                type="button"
                onClick={() => openChannelModal('delete', record.channelRow)}
              >
                <DeleteOutlined />
              </button>
            </div>
          ),
          props: { rowSpan: record.rowSpan },
        }
      ),
    },
  ]
  const modalTitle =
    modalMode === 'add'
      ? 'Add Site Access Volume'
      : modalMode === 'edit'
        ? 'Edit Site Access Volume'
        : modalMode === 'delete'
          ? 'Delete Site Access Volume'
          : 'View Site Access Volume'

  function openAddModal() {
    const defaultChannelCode = firstAvailableAddChannelCode

    setSelectedChannelRow(null)
    setSelectedChannelCode(defaultChannelCode)
    setRatioDrafts(createChannelRatioDrafts(defaultChannelCode))
    setModalStatus('Active')
    setModalMode('add')
    setNotice(null)
    setSubmitAttempted(false)
  }

  function openChannelModal(
    mode: Exclude<SiteAccessVolumeModalMode, 'add'>,
    row: SiteAccessVolumeChannelRow,
  ) {
    setSelectedChannelRow(row)
    setSelectedChannelCode(row.channelCode)
    setRatioDrafts(createChannelRatioDrafts(row.channelCode))
    setModalStatus(row.status)
    setModalMode(mode)
    setNotice(null)
    setSubmitAttempted(false)
  }

  function closeModal() {
    setModalMode(null)
    setRatioDrafts({})
    setSelectedChannelRow(null)
    setSubmitAttempted(false)
  }

  function handleChannelChange(channelCode: string) {
    setSelectedChannelCode(channelCode)
    setRatioDrafts(createChannelRatioDrafts(channelCode))
  }

  function handleRatioChange(
    mediaCode: string,
    siteCode: string,
    nextValue: number | null,
  ) {
    setRatioDrafts((currentDrafts) => ({
      ...currentDrafts,
      [mediaCode]: {
        ...(currentDrafts[mediaCode] ?? {}),
        [siteCode]: nextValue ?? 0,
      },
    }))
  }

  function handleSave() {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    if (modalMode === 'add') {
      modalMediaCodes.forEach((mediaCode) => {
        const existingGroup = getExistingRatioGroup(
          selectedChannelCode,
          mediaCode,
        )
        const nextRecord: SiteAccessRatioGroup = {
          channelCode: selectedChannelCode,
          mediaCode,
          ratioGroupCode:
            existingGroup?.ratioGroupCode ??
            buildRatioGroupCode(selectedChannelCode, mediaCode),
          ratios: siteRatioDraftToDetails(accessSites, ratioDrafts[mediaCode]),
          status: modalStatus,
        }

        upsertEntity('siteAccessRatioGroups', 'ratioGroupCode', nextRecord)
      })
      setNotice('Site Access Volume saved locally for this demo session.')
      closeModal()
      return
    }

    if (modalMode === 'edit' && selectedChannelRow) {
      modalMediaCodes.forEach((mediaCode) => {
        const existingGroup = getExistingRatioGroup(
          selectedChannelCode,
          mediaCode,
        )
        const nextRecord: SiteAccessRatioGroup = {
          channelCode: selectedChannelCode,
          mediaCode,
          ratioGroupCode:
            existingGroup?.ratioGroupCode ??
            buildRatioGroupCode(selectedChannelCode, mediaCode),
          ratios: siteRatioDraftToDetails(accessSites, ratioDrafts[mediaCode]),
          status: modalStatus,
        }

        upsertEntity('siteAccessRatioGroups', 'ratioGroupCode', nextRecord)
      })
      setNotice('Site Access Volume saved locally for this demo session.')
      closeModal()
    }
  }

  function handleDelete() {
    if (!selectedChannelRow) {
      return
    }

    siteAccessRatioGroups
      .filter((group) => group.channelCode === selectedChannelRow.channelCode)
      .forEach((group) =>
        deleteEntity(
          'siteAccessRatioGroups',
          'ratioGroupCode',
          group.ratioGroupCode,
        ),
      )
    setNotice('Site Access Volume deleted locally for this demo session.')
    closeModal()
  }

  function handleSearch() {
    setAppliedFilters(filterDraft)
  }

  function handleReset() {
    const resetFilters = { keyword: '', mediaCode: '', status: '' }

    setFilterDraft(resetFilters)
    setAppliedFilters(resetFilters)
  }

  return (
    <AdminPage title="Site Access Volume">
      <section className="routing-config-page">
        {notice && (
          <Alert
            showIcon
            className="routing-config-page__notice"
            message={notice}
            type="success"
          />
        )}
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              <div className="routing-config-page__filters">
                <label
                  className="routing-config-page__filter"
                  style={{ width: 240 }}
                >
                  <span>Keyword</span>
                  <Input
                    placeholder="Channel ID / Channel Name"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentFilters) => ({
                        ...currentFilters,
                        keyword: event.target.value,
                      }))
                    }
                    onPressEnter={handleSearch}
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Media Type</span>
                  <Select
                    options={[{ label: 'All', value: '' }, ...mediaOptions]}
                    value={filterDraft.mediaCode}
                    onChange={(value) =>
                      setFilterDraft((currentFilters) => ({
                        ...currentFilters,
                        mediaCode: value,
                      }))
                    }
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 200 }}
                >
                  <span>Status</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...statusFilterOptions,
                    ]}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentFilters) => ({
                        ...currentFilters,
                        status: value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="routing-config-page__admin-actions">
                <BaseButton variant="primary" onClick={handleSearch}>
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </div>
            </div>
            <div className="routing-config-page__add-action">
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={openAddModal}
              >
                Add
              </BaseButton>
            </div>
          </div>
          <AdminTable<SiteAccessVolumeMediaRow>
            columns={columns}
            dataSource={filteredData}
            pagination={paginationConfig}
            rowKey={(record) => record.rowKey}
            scroll={{ x: 980 }}
            size="small"
          />
        </BaseCard>
      </section>

      <AdminModal
        className="routing-config-crud-modal routing-config-site-volume-modal"
        kind="detail"
        open={Boolean(modalMode)}
        title={modalTitle}
        width={880}
        onCancel={closeModal}
      >
        {modalMode === 'delete' ? (
          <div className="routing-config-crud-modal__delete">
            <Alert
              showIcon
              message={`Delete site access volume for ${
                selectedChannelRow?.channelName ?? ''
              }?`}
              type="warning"
              description="This deletes all media allocation records for this channel in the current demo session."
            />
          </div>
        ) : (
          <div className="routing-config-site-volume-modal__form">
            {visibleValidationErrors.length > 0 && (
              <Alert
                showIcon
                className="routing-config-crud-modal__validation"
                message="Please complete required fields"
                type="warning"
                description={
                  <ul>
                    {visibleValidationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                }
              />
            )}
            <div className="routing-config-site-volume-modal__top">
              <label className="routing-config-crud-modal__field">
                <span>Channel</span>
                <Select
                  disabled={isReadOnly || modalMode === 'edit'}
                  options={
                    modalMode === 'add' ? addChannelOptions : channelOptions
                  }
                  placeholder="Select channel"
                  value={selectedChannelCode || undefined}
                  onChange={handleChannelChange}
                />
              </label>
              <label className="routing-config-crud-modal__field">
                <span>Status</span>
                {isReadOnly ? (
                  <em>
                    <RoutingConfigStatusBadge status={modalStatus} />
                  </em>
                ) : (
                  <span className="routing-config-status-control">
                    <Switch
                      checked={modalStatus !== 'Disabled'}
                      className="routing-config-status-switch"
                      size="small"
                      onChange={(checked) =>
                        setModalStatus(checked ? 'Active' : 'Disabled')
                      }
                    />
                    <span className="routing-config-status-control__text">
                      {modalStatus === 'Disabled' ? 'Disabled' : 'Enabled'}
                    </span>
                  </span>
                )}
              </label>
            </div>
            {modalMode === 'add' && !firstAvailableAddChannelCode && (
              <Alert
                showIcon
                message="All configured channels already have site access volume records."
                type="warning"
              />
            )}
            {modalMediaCodes.length === 0 ? (
              modalMode === 'add' && !firstAvailableAddChannelCode ? null : (
                <Alert
                  showIcon
                  message={
                    selectedChannelCode
                      ? 'Selected channel has no configured media type.'
                      : 'Channel is required.'
                  }
                  type="warning"
                />
              )
            ) : (
              <div className="routing-config-site-volume-modal__media-list">
                {modalMediaCodes.map((mediaCode) => {
                  const total = getSiteRatioTotal(ratioDrafts[mediaCode])

                  return (
                    <section
                      key={mediaCode}
                      className="routing-config-site-volume-modal__media"
                    >
                      <header>
                        <strong>{getMediaLabel(mediaCode)}</strong>
                        <Tag color={total === 100 ? 'green' : 'red'}>
                          Total {total}%
                        </Tag>
                      </header>
                      <div className="routing-config-site-volume-modal__site-list">
                        {accessSites.map((site) => (
                          <label key={site.siteCode}>
                            <span>
                              <strong>{site.siteName}</strong>
                            </span>
                            <InputNumber
                              addonAfter="%"
                              disabled={isReadOnly}
                              max={100}
                              min={0}
                              precision={0}
                              value={
                                ratioDrafts[mediaCode]?.[site.siteCode] ?? 0
                              }
                              onChange={(nextValue) =>
                                handleRatioChange(
                                  mediaCode,
                                  site.siteCode,
                                  nextValue,
                                )
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </div>
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && (
            <BaseButton variant="danger" onClick={handleDelete}>
              Delete
            </BaseButton>
          )}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <BaseButton variant="primary" onClick={handleSave}>
              Save
            </BaseButton>
          )}
        </div>
      </AdminModal>
    </AdminPage>
  )
}

type WorkingTimeModalMode = 'add' | 'delete' | 'edit' | 'view' | null

interface WorkingTimePlanFilters {
  keyword: string
  status: '' | RoutingConfigStatus
}

const workingTimeInitialFilters: WorkingTimePlanFilters = {
  keyword: '',
  status: '',
}

const workingTimeWeekdayOptions: RoutingConfigSelectOption[] = [
  { label: 'Mon', value: 'MON' },
  { label: 'Tue', value: 'TUE' },
  { label: 'Wed', value: 'WED' },
  { label: 'Thu', value: 'THU' },
  { label: 'Fri', value: 'FRI' },
  { label: 'Sat', value: 'SAT' },
  { label: 'Sun', value: 'SUN' },
]

function getLocalDateString() {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDatePickerValue(value: string) {
  return value ? dayjs(value, 'YYYY-MM-DD') : null
}

function formatDatePickerValue(value: Dayjs | null) {
  return value ? value.format('YYYY-MM-DD') : ''
}

function createWorkingTimeRuleId(prefix: string) {
  return `${prefix}_${Date.now()}`
}

function createTimeRange(
  startTime = '09:00',
  endTime = '18:00',
): WorkingTimeRange {
  return { endTime, startTime }
}

function createWorkScheduleRule(): WorkScheduleRule {
  return {
    ruleId: createWorkingTimeRuleId('WS'),
    timeRanges: [createTimeRange()],
    weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  }
}

function copyWorkScheduleRules(
  rules: WorkScheduleRule[],
  prefix: string,
): WorkScheduleRule[] {
  return rules.map((rule, index) => ({
    ...rule,
    ruleId: `${createWorkingTimeRuleId(prefix)}_${index}`,
    timeRanges: rule.timeRanges.map((range) => ({ ...range })),
    weekdays: [...rule.weekdays],
  }))
}

function createHolidayScheduleRule(): HolidayScheduleRule {
  return {
    closedAllDay: false,
    dateFrom: '',
    dateTo: '',
    holidayName: '',
    nonWorkingRanges: [createTimeRange('00:00', '23:59')],
    ruleId: createWorkingTimeRuleId('HR'),
  }
}

function createSpecialWorkingPlanRule(): SpecialWorkingPlanRule {
  return {
    dateFrom: '',
    dateTo: '',
    reason: '',
    ruleId: createWorkingTimeRuleId('SWP'),
    workingRanges: [createTimeRange()],
  }
}

function cloneWorkingTimePlan(plan: WorkingTimePlan): WorkingTimePlan {
  return {
    ...plan,
    holidayRules: (plan.holidayRules ?? []).map((rule) => ({
      ...rule,
      nonWorkingRanges: (rule.nonWorkingRanges ?? []).map((range) => ({
        ...range,
      })),
    })),
    ramadanSchedule: {
      ...plan.ramadanSchedule,
      workSchedules: (plan.ramadanSchedule?.workSchedules ?? []).map((rule) => ({
        ...rule,
        timeRanges: (rule.timeRanges ?? []).map((range) => ({ ...range })),
        weekdays: [...(rule.weekdays ?? [])],
      })),
    },
    specialWorkingPlans: (plan.specialWorkingPlans ?? []).map((rule) => ({
      ...rule,
      workingRanges: (rule.workingRanges ?? []).map((range) => ({
        ...range,
      })),
    })),
    workSchedules: (plan.workSchedules ?? []).map((rule) => ({
      ...rule,
      timeRanges: (rule.timeRanges ?? []).map((range) => ({ ...range })),
      weekdays: [...(rule.weekdays ?? [])],
    })),
  }
}

function createWorkingTimePlanDraft(): WorkingTimePlan {
  const today = getLocalDateString()

  return {
    description: '',
    holidayRules: [],
    planCode: 'WTP_NEW',
    planName: '',
    ramadanSchedule: {
      dateFrom: '',
      dateTo: '',
      enabled: false,
      workSchedules: [],
    },
    specialWorkingPlans: [],
    status: 'Active',
    updatedAt: today,
    updatedBy: 'Admin',
    workSchedules: [createWorkScheduleRule()],
  }
}


function normalizeWorkingTimePlan(draft: WorkingTimePlan): WorkingTimePlan {
  const normalizedDraft = cloneWorkingTimePlan(draft)
  const today = getLocalDateString()
  const nextPlan: WorkingTimePlan = {
    ...normalizedDraft,
    holidayRules: normalizedDraft.holidayRules.map((rule) => ({
      ...rule,
      closedAllDay: false,
      nonWorkingRanges:
        rule.nonWorkingRanges.length > 0
          ? rule.nonWorkingRanges
          : [createTimeRange('00:00', '23:59')],
    })),
    updatedAt: today,
    updatedBy: 'Admin',
  }

  if (!nextPlan.ramadanSchedule.enabled) {
    nextPlan.ramadanSchedule = {
      dateFrom: '',
      dateTo: '',
      enabled: false,
      workSchedules: [],
    }
  }

  return nextPlan
}

function isValidWorkingTimeRange(range: WorkingTimeRange) {
  return Boolean(range.startTime && range.endTime && range.startTime < range.endTime)
}

function validateWorkingTimeRange(
  range: WorkingTimeRange,
  label: string,
  errors: string[],
) {
  if (!range.startTime || !range.endTime) {
    errors.push(`${label} time range is required.`)
    return
  }

  if (!isValidWorkingTimeRange(range)) {
    errors.push(`${label} start time must be earlier than end time.`)
  }
}

function validateWorkingTimePlan(
  draft: WorkingTimePlan,
  workingTimePlans: WorkingTimePlan[],
  currentRecord: WorkingTimePlan | null,
) {
  const errors = [
    ...validateCode(draft.planCode, 'Plan ID'),
    ...validateUnique(
      workingTimePlans,
      currentRecord,
      'planCode',
      draft.planCode,
      'Plan ID',
    ),
    ...(draft.planName.trim() ? [] : ['Plan Name is required.']),
  ]

  if (draft.workSchedules.length === 0) {
    errors.push('Work Schedule requires at least one row.')
  }

  draft.workSchedules.forEach((rule, index) => {
    const rowLabel = `Work Schedule row ${index + 1}`

    if (rule.weekdays.length === 0) {
      errors.push(`${rowLabel} weekdays are required.`)
    }

    if (rule.timeRanges.length === 0) {
      errors.push(`${rowLabel} time range is required.`)
    }

    rule.timeRanges.forEach((range) =>
      validateWorkingTimeRange(range, rowLabel, errors),
    )
  })

  if (draft.ramadanSchedule.enabled) {
    if (!draft.ramadanSchedule.dateFrom || !draft.ramadanSchedule.dateTo) {
      errors.push('Ramadan date range is required.')
    } else if (
      draft.ramadanSchedule.dateFrom > draft.ramadanSchedule.dateTo
    ) {
      errors.push('Ramadan start date must be earlier than end date.')
    }

    if (draft.ramadanSchedule.workSchedules.length === 0) {
      errors.push('Ramadan Work Schedule requires at least one row.')
    }

    draft.ramadanSchedule.workSchedules.forEach((rule, index) => {
      const rowLabel = `Ramadan Work Schedule row ${index + 1}`

      if (rule.weekdays.length === 0) {
        errors.push(`${rowLabel} weekdays are required.`)
      }

      if (rule.timeRanges.length === 0) {
        errors.push(`${rowLabel} time range is required.`)
      }

      rule.timeRanges.forEach((range) =>
        validateWorkingTimeRange(range, rowLabel, errors),
      )
    })
  }

  draft.holidayRules.forEach((rule, index) => {
    const rowLabel = `Holiday Schedule row ${index + 1}`

    if (!rule.dateFrom || !rule.dateTo) {
      errors.push(`${rowLabel} date range is required.`)
    } else if (rule.dateFrom > rule.dateTo) {
      errors.push(`${rowLabel} start date must be earlier than end date.`)
    }

    if (!rule.holidayName.trim()) {
      errors.push(`${rowLabel} holiday name is required.`)
    }

    if (rule.nonWorkingRanges.length === 0) {
      errors.push(`${rowLabel} time range is required.`)
    }

    rule.nonWorkingRanges.forEach((range) =>
      validateWorkingTimeRange(range, rowLabel, errors),
    )
  })

  draft.specialWorkingPlans.forEach((rule, index) => {
    const rowLabel = `Special Working Plan row ${index + 1}`

    if (!rule.dateFrom || !rule.dateTo) {
      errors.push(`${rowLabel} date range is required.`)
    } else if (rule.dateFrom > rule.dateTo) {
      errors.push(`${rowLabel} start date must be earlier than end date.`)
    }

    if (!rule.reason.trim()) {
      errors.push(`${rowLabel} reason is required.`)
    }

    if (rule.workingRanges.length === 0) {
      errors.push(`${rowLabel} working time range is required.`)
    }

    rule.workingRanges.forEach((range) =>
      validateWorkingTimeRange(range, rowLabel, errors),
    )
  })

  return errors
}

export function WorkingTimePlansPage() {
  const workingTimePlans = useRoutingConfigStore(
    (state) => state.workingTimePlans,
  )
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { skillQueues } = useRoutingLookups()
  const [filterDraft, setFilterDraft] = useState<WorkingTimePlanFilters>(
    workingTimeInitialFilters,
  )
  const [appliedFilters, setAppliedFilters] = useState<WorkingTimePlanFilters>(
    workingTimeInitialFilters,
  )
  const [modalMode, setModalMode] = useState<WorkingTimeModalMode>(null)
  const [selectedPlan, setSelectedPlan] = useState<WorkingTimePlan | null>(null)
  const [draft, setDraft] = useState<WorkingTimePlan>(
    createWorkingTimePlanDraft,
  )
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [notice, setNotice] = useState('')
  const isReadOnly = modalMode === 'view'
  const isDeleteBlocked = Boolean(
    selectedPlan &&
      skillQueues.some((queue) => queue.workTimePlanCode === selectedPlan.planCode),
  )
  const validationErrors = useMemo(
    () => validateWorkingTimePlan(draft, workingTimePlans, selectedPlan),
    [draft, selectedPlan, workingTimePlans],
  )
  const visibleValidationErrors = submitAttempted ? validationErrors : []
  const filteredData = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase()

    return workingTimePlans.filter((plan) => {
      const matchesKeyword =
        !keyword ||
        [plan.planCode, plan.planName, plan.description]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      const matchesStatus =
        !appliedFilters.status || plan.status === appliedFilters.status

      return matchesKeyword && matchesStatus
    })
  }, [appliedFilters, workingTimePlans])
  const paginationConfig = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} records`,
  }
  const modalTitle =
    modalMode === 'add'
      ? 'Add Working Time Plan'
      : modalMode === 'edit'
        ? 'Edit Working Time Plan'
        : modalMode === 'delete'
          ? 'Delete Working Time Plan'
          : 'View Working Time Plan'

  function closeModal() {
    setModalMode(null)
    setSelectedPlan(null)
    setSubmitAttempted(false)
    setDraft(createWorkingTimePlanDraft())
  }

  function openModal(mode: Exclude<WorkingTimeModalMode, null>, plan?: WorkingTimePlan) {
    setModalMode(mode)
    setSelectedPlan(plan ?? null)
    setSubmitAttempted(false)
    setDraft(plan ? cloneWorkingTimePlan(plan) : createWorkingTimePlanDraft())
  }

  function updateDraft(patch: Partial<WorkingTimePlan>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }))
  }

  function updateWorkSchedule(
    index: number,
    patch: Partial<WorkScheduleRule>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      workSchedules: currentDraft.workSchedules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule,
      ),
    }))
  }

  function updateWorkScheduleRange(
    index: number,
    patch: Partial<WorkingTimeRange>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      workSchedules: currentDraft.workSchedules.map((rule, ruleIndex) =>
        ruleIndex === index
          ? {
              ...rule,
              timeRanges: [
                {
                  ...(rule.timeRanges[0] ?? createTimeRange()),
                  ...patch,
                },
              ],
            }
          : rule,
      ),
    }))
  }

  function updateRamadanSchedule(
    patch: Partial<WorkingTimePlan['ramadanSchedule']>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ramadanSchedule: {
        ...currentDraft.ramadanSchedule,
        ...patch,
      },
    }))
  }

  function updateRamadanWorkSchedule(
    index: number,
    patch: Partial<WorkScheduleRule>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ramadanSchedule: {
        ...currentDraft.ramadanSchedule,
        workSchedules: currentDraft.ramadanSchedule.workSchedules.map(
          (rule, ruleIndex) =>
            ruleIndex === index ? { ...rule, ...patch } : rule,
        ),
      },
    }))
  }

  function updateRamadanWorkScheduleRange(
    index: number,
    patch: Partial<WorkingTimeRange>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ramadanSchedule: {
        ...currentDraft.ramadanSchedule,
        workSchedules: currentDraft.ramadanSchedule.workSchedules.map(
          (rule, ruleIndex) =>
            ruleIndex === index
              ? {
                  ...rule,
                  timeRanges: [
                    {
                      ...(rule.timeRanges[0] ?? createTimeRange()),
                      ...patch,
                    },
                  ],
                }
              : rule,
        ),
      },
    }))
  }

  function updateHolidayRule(
    index: number,
    patch: Partial<HolidayScheduleRule>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      holidayRules: currentDraft.holidayRules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule,
      ),
    }))
  }

  function updateHolidayRange(
    index: number,
    patch: Partial<WorkingTimeRange>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      holidayRules: currentDraft.holidayRules.map((rule, ruleIndex) =>
        ruleIndex === index
          ? {
              ...rule,
              nonWorkingRanges: [
                {
                  ...(rule.nonWorkingRanges[0] ?? createTimeRange()),
                  ...patch,
                },
              ],
            }
          : rule,
      ),
    }))
  }

  function updateSpecialWorkingPlan(
    index: number,
    patch: Partial<SpecialWorkingPlanRule>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      specialWorkingPlans: currentDraft.specialWorkingPlans.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, ...patch } : rule,
      ),
    }))
  }

  function updateSpecialRange(
    index: number,
    patch: Partial<WorkingTimeRange>,
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      specialWorkingPlans: currentDraft.specialWorkingPlans.map(
        (rule, ruleIndex) =>
          ruleIndex === index
            ? {
                ...rule,
                workingRanges: [
                  {
                    ...(rule.workingRanges[0] ?? createTimeRange()),
                    ...patch,
                  },
                ],
              }
            : rule,
      ),
    }))
  }

  function handleSearch() {
    setAppliedFilters(filterDraft)
  }

  function handleReset() {
    setFilterDraft(workingTimeInitialFilters)
    setAppliedFilters(workingTimeInitialFilters)
  }

  function handleSave() {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const nextRecord = normalizeWorkingTimePlan(draft, selectedPlan)

    upsertEntity('workingTimePlans', 'planCode', nextRecord)
    setNotice('Working Time Plan saved locally for this demo session.')
    closeModal()
  }

  function handleDelete() {
    if (!selectedPlan || isDeleteBlocked) {
      return
    }

    deleteEntity('workingTimePlans', 'planCode', selectedPlan.planCode)
    setNotice('Working Time Plan deleted locally for this demo session.')
    closeModal()
  }

  const columns: ColumnsType<WorkingTimePlan> = [
    {
      dataIndex: 'planCode',
      title: 'Plan ID',
      width: 150,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'planName', title: 'Plan Name', width: 180 },
    {
      dataIndex: 'description',
      ellipsis: true,
      title: 'Description',
      width: 260,
      render: (value: string) => value || '-',
    },
    { dataIndex: 'updatedAt', title: 'Updated Date', width: 120 },
    { dataIndex: 'updatedBy', title: 'Updated By', width: 110 },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 100,
      render: renderRoutingStatus,
    },
    {
      fixed: 'right',
      render: (_value, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`View ${record.planCode}`}
            title="View"
            type="button"
            onClick={() => openModal('view', record)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${record.planCode}`}
            title="Edit"
            type="button"
            onClick={() => openModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.planCode}`}
            title="Delete"
            type="button"
            onClick={() => openModal('delete', record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 112,
    },
  ]

  const renderStatusField = () =>
    isReadOnly ? (
      <em>
        <RoutingConfigStatusBadge status={draft.status} />
      </em>
    ) : (
      <span className="routing-config-status-control">
        <Switch
          checked={draft.status !== 'Disabled'}
          className="routing-config-status-switch"
          size="small"
          onChange={(checked) =>
            updateDraft({ status: checked ? 'Active' : 'Disabled' })
          }
        />
        <span className="routing-config-status-control__text">
          {draft.status === 'Disabled' ? 'Disabled' : 'Enabled'}
        </span>
      </span>
    )

  const renderWorkScheduleTable = (
    rows: WorkScheduleRule[],
    options: {
      emptyText: string
      onDelete: (index: number) => void
      onRangeChange: (index: number, patch: Partial<WorkingTimeRange>) => void
      onRuleChange: (index: number, patch: Partial<WorkScheduleRule>) => void
    },
  ) => (
    <div className="routing-config-working-time-modal__list">
      {rows.length === 0 ? (
        <div className="routing-config-working-time-modal__empty">
          {options.emptyText}
        </div>
      ) : (
        rows.map((rule, index) => (
          <div
            key={rule.ruleId}
            className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--work ${
              index > 0
                ? 'routing-config-working-time-modal__schedule-row--no-label'
                : ''
            }`}
          >
            <label className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Weekdays</span>}
              <Select
                disabled={isReadOnly}
                maxTagCount="responsive"
                mode="multiple"
                options={workingTimeWeekdayOptions}
                value={rule.weekdays}
                onChange={(value) =>
                  options.onRuleChange(index, { weekdays: value })
                }
              />
            </label>
            <label className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Start</span>}
              <Input
                disabled={isReadOnly}
                type="time"
                value={rule.timeRanges[0]?.startTime ?? ''}
                onChange={(event) =>
                  options.onRangeChange(index, {
                    startTime: event.target.value,
                  })
                }
              />
            </label>
            <label className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>End</span>}
              <Input
                disabled={isReadOnly}
                type="time"
                value={rule.timeRanges[0]?.endTime ?? ''}
                onChange={(event) =>
                  options.onRangeChange(index, {
                    endTime: event.target.value,
                  })
                }
              />
            </label>
            {!isReadOnly && (
              <button
                className="routing-config-working-time-modal__icon-button"
                title="Delete"
                type="button"
                onClick={() => options.onDelete(index)}
              >
                <DeleteOutlined />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderScheduleSections = () => (
    <>
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Work Schedule</strong>
          {!isReadOnly && (
            <BaseButton
              icon={<PlusOutlined />}
              variant="secondary"
              onClick={() =>
                updateDraft({
                  workSchedules: [
                    ...draft.workSchedules,
                    createWorkScheduleRule(),
                  ],
                })
              }
            >
              Add
            </BaseButton>
          )}
        </header>
        {renderWorkScheduleTable(draft.workSchedules, {
          emptyText: 'No work schedule configured.',
          onDelete: (index) =>
            updateDraft({
              workSchedules: draft.workSchedules.filter(
                (_rule, ruleIndex) => ruleIndex !== index,
              ),
            }),
          onRangeChange: updateWorkScheduleRange,
          onRuleChange: updateWorkSchedule,
        })}
      </section>

      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Ramadan Work Schedule</strong>
          <span className="routing-config-working-time-modal__section-actions">
            <span className="routing-config-status-control">
              <Switch
                checked={draft.ramadanSchedule.enabled}
                className="routing-config-status-switch"
                disabled={isReadOnly}
                size="small"
                onChange={(checked) =>
                  updateRamadanSchedule({ enabled: checked })
                }
              />
              <span className="routing-config-status-control__text">
                {draft.ramadanSchedule.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </span>
            {!isReadOnly && draft.ramadanSchedule.enabled && (
              <BaseButton
                icon={<PlusOutlined />}
                variant="secondary"
                onClick={() =>
                  updateRamadanSchedule({
                    workSchedules: [
                      ...draft.ramadanSchedule.workSchedules,
                      createWorkScheduleRule(),
                    ],
                  })
                }
              >
                Add
              </BaseButton>
            )}
          </span>
        </header>
        {draft.ramadanSchedule.enabled && (
          <>
            <div className="routing-config-working-time-modal__ramadan-dates">
              <label className="routing-config-crud-modal__field">
                <span>Start Date</span>
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(draft.ramadanSchedule.dateFrom)}
                  onChange={(value) =>
                    updateRamadanSchedule({
                      dateFrom: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              <label className="routing-config-crud-modal__field">
                <span>End Date</span>
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(draft.ramadanSchedule.dateTo)}
                  onChange={(value) =>
                    updateRamadanSchedule({
                      dateTo: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              {!isReadOnly && (
                <BaseButton
                  variant="secondary"
                  onClick={() =>
                    updateRamadanSchedule({
                      workSchedules: copyWorkScheduleRules(
                        draft.workSchedules,
                        'RMD',
                      ),
                    })
                  }
                >
                  Copy from Work Schedule
                </BaseButton>
              )}
            </div>
            {renderWorkScheduleTable(draft.ramadanSchedule.workSchedules, {
              emptyText: 'No Ramadan work schedule configured.',
              onDelete: (index) =>
                updateRamadanSchedule({
                  workSchedules: draft.ramadanSchedule.workSchedules.filter(
                    (_rule, ruleIndex) => ruleIndex !== index,
                  ),
                }),
              onRangeChange: updateRamadanWorkScheduleRange,
              onRuleChange: updateRamadanWorkSchedule,
            })}
          </>
        )}
      </section>

      <details
        className="routing-config-working-time-modal__details"
        open={draft.holidayRules.length > 0}
      >
        <summary>
          <strong>Holiday Schedule</strong>
          {!isReadOnly && (
            <BaseButton
              icon={<PlusOutlined />}
              variant="secondary"
              onClick={(event) => {
                event.preventDefault()
                updateDraft({
                  holidayRules: [
                    ...draft.holidayRules,
                    createHolidayScheduleRule(),
                  ],
                })
              }}
            >
              Add
            </BaseButton>
          )}
        </summary>
        <div className="routing-config-working-time-modal__list">
          {draft.holidayRules.map((rule, index) => (
            <div
              key={rule.ruleId}
              className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--holiday ${
                index > 0
                  ? 'routing-config-working-time-modal__schedule-row--no-label'
                  : ''
              }`}
            >
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Start Date</span>}
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(rule.dateFrom)}
                  onChange={(value) =>
                    updateHolidayRule(index, {
                      dateFrom: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>End Date</span>}
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(rule.dateTo)}
                  onChange={(value) =>
                    updateHolidayRule(index, {
                      dateTo: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Holiday Name</span>}
                <Input
                  disabled={isReadOnly}
                  value={rule.holidayName}
                  onChange={(event) =>
                    updateHolidayRule(index, {
                      holidayName: event.target.value,
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Start</span>}
                <Input
                  disabled={isReadOnly}
                  type="time"
                  value={rule.nonWorkingRanges[0]?.startTime ?? ''}
                  onChange={(event) =>
                    updateHolidayRange(index, {
                      startTime: event.target.value,
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>End</span>}
                <Input
                  disabled={isReadOnly}
                  type="time"
                  value={rule.nonWorkingRanges[0]?.endTime ?? ''}
                  onChange={(event) =>
                    updateHolidayRange(index, {
                      endTime: event.target.value,
                    })
                  }
                />
              </label>
              {!isReadOnly && (
                <button
                  className="routing-config-working-time-modal__icon-button"
                  title="Delete"
                  type="button"
                  onClick={() =>
                    updateDraft({
                      holidayRules: draft.holidayRules.filter(
                        (_rule, ruleIndex) => ruleIndex !== index,
                      ),
                    })
                  }
                >
                  <DeleteOutlined />
                </button>
              )}
            </div>
          ))}
        </div>
      </details>

      <details
        className="routing-config-working-time-modal__details"
        open={draft.specialWorkingPlans.length > 0}
      >
        <summary>
          <strong>Special Working Plan</strong>
          {!isReadOnly && (
            <BaseButton
              icon={<PlusOutlined />}
              variant="secondary"
              onClick={(event) => {
                event.preventDefault()
                updateDraft({
                  specialWorkingPlans: [
                    ...draft.specialWorkingPlans,
                    createSpecialWorkingPlanRule(),
                  ],
                })
              }}
            >
              Add
            </BaseButton>
          )}
        </summary>
        <div className="routing-config-working-time-modal__list">
          {draft.specialWorkingPlans.map((rule, index) => (
            <div
              key={rule.ruleId}
              className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--special ${
                index > 0
                  ? 'routing-config-working-time-modal__schedule-row--no-label'
                  : ''
              }`}
            >
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Start Date</span>}
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(rule.dateFrom)}
                  onChange={(value) =>
                    updateSpecialWorkingPlan(index, {
                      dateFrom: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>End Date</span>}
                <DatePicker
                  disabled={isReadOnly}
                  format="YYYY-MM-DD"
                  value={getDatePickerValue(rule.dateTo)}
                  onChange={(value) =>
                    updateSpecialWorkingPlan(index, {
                      dateTo: formatDatePickerValue(value),
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Reason</span>}
                <Input
                  disabled={isReadOnly}
                  value={rule.reason}
                  onChange={(event) =>
                    updateSpecialWorkingPlan(index, {
                      reason: event.target.value,
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>Start</span>}
                <Input
                  disabled={isReadOnly}
                  type="time"
                  value={rule.workingRanges[0]?.startTime ?? ''}
                  onChange={(event) =>
                    updateSpecialRange(index, {
                      startTime: event.target.value,
                    })
                  }
                />
              </label>
              <label className="routing-config-working-time-modal__row-field">
                {index === 0 && <span>End</span>}
                <Input
                  disabled={isReadOnly}
                  type="time"
                  value={rule.workingRanges[0]?.endTime ?? ''}
                  onChange={(event) =>
                    updateSpecialRange(index, {
                      endTime: event.target.value,
                    })
                  }
                />
              </label>
              {!isReadOnly && (
                <button
                  className="routing-config-working-time-modal__icon-button"
                  title="Delete"
                  type="button"
                  onClick={() =>
                    updateDraft({
                      specialWorkingPlans: draft.specialWorkingPlans.filter(
                        (_rule, ruleIndex) => ruleIndex !== index,
                      ),
                    })
                  }
                >
                  <DeleteOutlined />
                </button>
              )}
            </div>
          ))}
        </div>
      </details>

      <div className="routing-config-working-time-modal__priority-note">
        {
          'Priority: Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule.'
        }
      </div>
    </>
  )

  return (
    <AdminPage title="Working Time Plans">
      <section className="routing-config-page">
        {notice && (
          <Alert
            showIcon
            className="routing-config-page__notice"
            message={notice}
            type="success"
          />
        )}
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              <div className="routing-config-page__filters">
                <label
                  className="routing-config-page__filter"
                  style={{ width: 240 }}
                >
                  <span>Keyword</span>
                  <Input
                    placeholder="Plan ID / Name / Description"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentFilters) => ({
                        ...currentFilters,
                        keyword: event.target.value,
                      }))
                    }
                    onPressEnter={handleSearch}
                  />
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 180 }}
                >
                  <span>Status</span>
                  <Select
                    options={[
                      { label: 'All', value: '' },
                      ...statusFilterOptions,
                    ]}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentFilters) => ({
                        ...currentFilters,
                        status: value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="routing-config-page__admin-actions">
                <BaseButton variant="primary" onClick={handleSearch}>
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </div>
            </div>
            <div className="routing-config-page__add-action">
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={() => openModal('add')}
              >
                Add
              </BaseButton>
            </div>
          </div>
          <AdminTable<WorkingTimePlan>
            columns={columns}
            dataSource={filteredData}
            pagination={paginationConfig}
            rowKey={(record) => record.planCode}
            scroll={{ x: 1080 }}
            size="small"
          />
        </BaseCard>
      </section>

      <AdminModal
        className="routing-config-crud-modal routing-config-working-time-modal"
        kind="detail"
        open={Boolean(modalMode)}
        title={modalTitle}
        width={1080}
        onCancel={closeModal}
      >
        {modalMode === 'delete' ? (
          <div className="routing-config-crud-modal__delete">
            <Alert
              showIcon
              description={
                isDeleteBlocked
                  ? 'This working time plan is used by skill queues. Disable it or remove the queue reference before deleting.'
                  : 'This deletes the working time plan in the current demo session.'
              }
              message={`Delete ${selectedPlan?.planName ?? ''}?`}
              type={isDeleteBlocked ? 'error' : 'warning'}
            />
          </div>
        ) : (
          <div className="routing-config-working-time-modal__form">
            {visibleValidationErrors.length > 0 && (
              <Alert
                showIcon
                className="routing-config-crud-modal__validation"
                description={
                  <ul>
                    {visibleValidationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                }
                message="Please complete required fields"
                type="warning"
              />
            )}
            <section className="routing-config-working-time-modal__section">
              <header>
                <strong>Basic Info</strong>
              </header>
              <div className="routing-config-working-time-modal__basic-grid">
                <label className="routing-config-crud-modal__field">
                  <span>
                    Plan ID <strong>*</strong>
                  </span>
                  {isReadOnly ? (
                    <em>{draft.planCode}</em>
                  ) : (
                    <Input
                      disabled={modalMode === 'edit'}
                      value={draft.planCode}
                      onChange={(event) =>
                        updateDraft({ planCode: event.target.value })
                      }
                    />
                  )}
                </label>
                <label className="routing-config-crud-modal__field">
                  <span>
                    Plan Name <strong>*</strong>
                  </span>
                  {isReadOnly ? (
                    <em>{draft.planName}</em>
                  ) : (
                    <Input
                      value={draft.planName}
                      onChange={(event) =>
                        updateDraft({ planName: event.target.value })
                      }
                    />
                  )}
                </label>
                <label className="routing-config-crud-modal__field">
                  <span>Status</span>
                  {renderStatusField()}
                </label>
                <label className="routing-config-crud-modal__field routing-config-working-time-modal__description">
                  <span>Description</span>
                  {isReadOnly ? (
                    <em>{draft.description || '-'}</em>
                  ) : (
                    <Input.TextArea
                      rows={2}
                      value={draft.description}
                      onChange={(event) =>
                        updateDraft({ description: event.target.value })
                      }
                    />
                  )}
                </label>
              </div>
            </section>
            {renderScheduleSections()}
          </div>
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && (
            <BaseButton
              disabled={isDeleteBlocked}
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </BaseButton>
          )}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <BaseButton variant="primary" onClick={handleSave}>
              Save
            </BaseButton>
          )}
        </div>
      </AdminModal>
    </AdminPage>
  )
}

function formatWorkingTimeWeekdays(weekdays: string[]) {
  const weekdayLabelMap = new Map(
    workingTimeWeekdayOptions.map((option) => [option.value, option.label]),
  )

  return weekdays.map((weekday) => weekdayLabelMap.get(weekday) ?? weekday).join(', ') || '-'
}

function formatWorkingTimeRanges(ranges: WorkingTimeRange[]) {
  return ranges
    .map((range) => `${range.startTime || '-'} - ${range.endTime || '-'}`)
    .join(', ') || '-'
}

function WorkingTimePlanPreviewContent({ plan }: { plan: WorkingTimePlan }) {
  const renderWorkScheduleRows = (
    rows: WorkScheduleRule[],
    emptyText: string,
  ) => (
    <div className="routing-config-working-time-modal__list">
      {rows.length === 0 ? (
        <div className="routing-config-working-time-modal__empty">
          {emptyText}
        </div>
      ) : (
        rows.map((rule, index) => (
          <div
            className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--work ${
              index > 0
                ? 'routing-config-working-time-modal__schedule-row--no-label'
                : ''
            }`}
            key={rule.ruleId}
          >
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Weekdays</span>}
              <em>{formatWorkingTimeWeekdays(rule.weekdays)}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Time Range</span>}
              <em>{formatWorkingTimeRanges(rule.timeRanges)}</em>
            </span>
          </div>
        ))
      )}
    </div>
  )
  const renderHolidayRows = () => (
    <div className="routing-config-working-time-modal__list">
      {plan.holidayRules.length === 0 ? (
        <div className="routing-config-working-time-modal__empty">
          No holiday schedule configured.
        </div>
      ) : (
        plan.holidayRules.map((rule, index) => (
          <div
            className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--holiday ${
              index > 0
                ? 'routing-config-working-time-modal__schedule-row--no-label'
                : ''
            }`}
            key={rule.ruleId}
          >
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Start Date</span>}
              <em>{rule.dateFrom || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>End Date</span>}
              <em>{rule.dateTo || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Holiday Name</span>}
              <em>{rule.holidayName || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Non-working Time</span>}
              <em>{formatWorkingTimeRanges(rule.nonWorkingRanges)}</em>
            </span>
          </div>
        ))
      )}
    </div>
  )
  const renderSpecialWorkingRows = () => (
    <div className="routing-config-working-time-modal__list">
      {plan.specialWorkingPlans.length === 0 ? (
        <div className="routing-config-working-time-modal__empty">
          No special working plan configured.
        </div>
      ) : (
        plan.specialWorkingPlans.map((rule, index) => (
          <div
            className={`routing-config-working-time-modal__schedule-row routing-config-working-time-modal__schedule-row--special ${
              index > 0
                ? 'routing-config-working-time-modal__schedule-row--no-label'
                : ''
            }`}
            key={rule.ruleId}
          >
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Start Date</span>}
              <em>{rule.dateFrom || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>End Date</span>}
              <em>{rule.dateTo || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Reason</span>}
              <em>{rule.reason || '-'}</em>
            </span>
            <span className="routing-config-working-time-modal__row-field">
              {index === 0 && <span>Working Time</span>}
              <em>{formatWorkingTimeRanges(rule.workingRanges)}</em>
            </span>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="routing-config-working-time-modal__form">
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Basic Info</strong>
        </header>
        <div className="routing-config-working-time-modal__basic-grid">
          <label className="routing-config-crud-modal__field">
            <span>Plan ID</span>
            <em>{plan.planCode}</em>
          </label>
          <label className="routing-config-crud-modal__field">
            <span>Plan Name</span>
            <em>{plan.planName}</em>
          </label>
          <label className="routing-config-crud-modal__field">
            <span>Status</span>
            <em>
              <RoutingConfigStatusBadge status={plan.status} />
            </em>
          </label>
          <label className="routing-config-crud-modal__field routing-config-working-time-modal__description">
            <span>Description</span>
            <em>{plan.description || '-'}</em>
          </label>
        </div>
      </section>
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Work Schedule</strong>
        </header>
        {renderWorkScheduleRows(plan.workSchedules, 'No work schedule configured.')}
      </section>
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Ramadan Work Schedule</strong>
          <span className="routing-config-status-control">
            <span className="routing-config-status-control__text">
              {plan.ramadanSchedule.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </span>
        </header>
        {plan.ramadanSchedule.enabled ? (
          <>
            <div className="routing-config-working-time-modal__ramadan-dates">
              <label className="routing-config-crud-modal__field">
                <span>Start Date</span>
                <em>{plan.ramadanSchedule.dateFrom || '-'}</em>
              </label>
              <label className="routing-config-crud-modal__field">
                <span>End Date</span>
                <em>{plan.ramadanSchedule.dateTo || '-'}</em>
              </label>
            </div>
            {renderWorkScheduleRows(
              plan.ramadanSchedule.workSchedules,
              'No Ramadan work schedule configured.',
            )}
          </>
        ) : (
          <div className="routing-config-working-time-modal__empty">
            Ramadan schedule is disabled.
          </div>
        )}
      </section>
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Holiday Schedule</strong>
        </header>
        {renderHolidayRows()}
      </section>
      <section className="routing-config-working-time-modal__section">
        <header>
          <strong>Special Working Plan</strong>
        </header>
        {renderSpecialWorkingRows()}
      </section>
      <div className="routing-config-working-time-modal__priority-note">
        Priority: Special Working Plan &gt; Holiday Schedule &gt; Ramadan Work
        Schedule &gt; Work Schedule.
      </div>
    </div>
  )
}

export function SkillQueuesPage() {
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules, vdnOptions, workingTimePlans, workTimeOptions } =
    useRoutingLookups()
  const [previewWorkingTimePlan, setPreviewWorkingTimePlan] =
    useState<WorkingTimePlan | null>(null)
  const vdnLabelMap = useMemo(
    () => new Map(vdnOptions.map((option) => [option.value, option.label])),
    [vdnOptions],
  )
  const workTimeLabelMap = useMemo(
    () => new Map(workTimeOptions.map((option) => [option.value, option.label])),
    [workTimeOptions],
  )
  const workingTimePlanByCode = useMemo(
    () => new Map(workingTimePlans.map((plan) => [plan.planCode, plan])),
    [workingTimePlans],
  )

  return (
    <>
      <RoutingConfigCrudPage<SkillQueue>
      columns={[
        {
          dataIndex: 'skillQueueCode',
          title: 'Skill ID',
          width: 150,
          render: (value: string) => <strong>{value}</strong>,
        },
        { dataIndex: 'platformSkillId', title: 'Platform Skill ID', width: 140 },
        { dataIndex: 'skillQueueName', title: 'Skill Name', width: 210 },
        {
          dataIndex: 'vdnCode',
          title: 'VDN',
          width: 150,
          render: (value: string) => vdnLabelMap.get(value) ?? value,
        },
        {
          dataIndex: 'workTimePlanCode',
          title: 'Work Time Plan',
          width: 150,
          render: (value: string) =>
            workTimeLabelMap.get(value) ?? 'Default 24/7',
        },
        { dataIndex: 'assignedAgentCount', title: 'Agents', width: 72 },
      ]}
      createDraft={() => ({
        assignedAgentCount: 0,
        maxQueueCustomers: 60,
        nonWorkingTimeMessage:
          'Service hours are currently closed. Please contact us during working hours.',
        platformSkillId: '',
        promptsText: 'TEXT|Timeout Message|Queue timeout.',
        queueTimeoutMessage:
          'All agents are busy. Please start a new conversation later.',
        queueTimeoutMinutes: 10,
        queueWaitingMessage:
          'All agents are busy. Estimated waiting time is {estimatedWaitMinutes} minutes.',
        skillQueueCode: 'SQ_NEW',
        skillQueueName: '',
        status: 'Active',
        supportsVideo: 'false',
        vdnCode: vdnOptions[0]?.value ?? '',
        workTimePlanCode: '',
      })}
      data={skillQueues}
      draftToRecord={(draft) => ({
        assignedAgentCount: numberValue(draft.assignedAgentCount),
        maxQueueCustomers: numberValue(draft.maxQueueCustomers),
        nonWorkingTimeMessage: stringValue(draft.nonWorkingTimeMessage),
        platformSkillId: stringValue(draft.platformSkillId),
        prompts: textToPrompts(stringValue(draft.promptsText)),
        queueTimeoutMessage: stringValue(draft.queueTimeoutMessage),
        queueTimeoutMinutes: numberValue(draft.queueTimeoutMinutes),
        queueWaitingMessage: stringValue(draft.queueWaitingMessage),
        skillQueueCode: stringValue(draft.skillQueueCode),
        skillQueueName: stringValue(draft.skillQueueName),
        status: 'Active',
        supportsVideo: booleanValue(draft.supportsVideo),
        vdnCode: stringValue(draft.vdnCode),
        workTimePlanCode: stringValue(draft.workTimePlanCode),
      })}
      fields={[]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [
              record.skillQueueCode,
              record.platformSkillId,
              record.skillQueueName,
            ].some((item) => item.toLowerCase().includes(keyword))
          },
          placeholder: 'Skill ID / Platform Skill ID / Skill Name',
          type: 'text',
          width: 300,
        },
        {
          key: 'vdnCode',
          label: 'VDN',
          options: vdnOptions,
          type: 'select',
          width: 220,
        },
      ]}
      getDeleteBlockReason={(record) =>
        routingRules.some(
          (rule) => rule.targetSkillQueueCode === record.skillQueueCode,
        )
          ? 'This skill queue is used by routing rules.'
          : null
      }
      idField="skillQueueCode"
      modalWidth={820}
      recordToDraft={(record) => ({
        assignedAgentCount: record.assignedAgentCount,
        maxQueueCustomers: record.maxQueueCustomers,
        nonWorkingTimeMessage: record.nonWorkingTimeMessage,
        platformSkillId: record.platformSkillId,
        promptsText: promptsToText(record.prompts),
        queueTimeoutMessage: record.queueTimeoutMessage,
        queueTimeoutMinutes: record.queueTimeoutMinutes,
        queueWaitingMessage: record.queueWaitingMessage,
        skillQueueCode: record.skillQueueCode,
        skillQueueName: record.skillQueueName,
        supportsVideo: record.supportsVideo ? 'true' : 'false',
        vdnCode: record.vdnCode,
        workTimePlanCode: record.workTimePlanCode,
      })}
      renderFormContent={({ draft, isReadOnly, mode, setDraftValue }) => {
        const isEditMode = mode === 'edit'
        const renderRequiredMark = () => <strong>*</strong>
        const renderTextField = (
          key: string,
          label: string,
          options?: {
            readOnly?: boolean
            readOnlyOnEdit?: boolean
            required?: boolean
          },
        ) => {
          const disabled =
            Boolean(options?.readOnly) ||
            (isEditMode && Boolean(options?.readOnlyOnEdit))

          return (
            <label className="routing-config-crud-modal__field">
              <span>
                {label}
                {options?.required && renderRequiredMark()}
              </span>
              {isReadOnly ? (
                <em>{stringValue(draft[key])}</em>
              ) : (
                <Input
                  disabled={disabled}
                  value={stringValue(draft[key])}
                  onChange={(event) =>
                    setDraftValue(key, event.target.value)
                  }
                />
              )}
            </label>
          )
        }
        const renderSelectField = (
          key: string,
          label: string,
          options: RoutingConfigSelectOption[],
          required = false,
        ) => {
          const rawValue = stringValue(draft[key])
          const displayValue =
            options.find((option) => option.value === rawValue)?.label ??
            rawValue

          return (
            <label className="routing-config-crud-modal__field">
              <span>
                {label}
                {required && renderRequiredMark()}
              </span>
              {isReadOnly ? (
                <em>{displayValue}</em>
              ) : (
                <Select
                  options={options}
                  value={rawValue}
                  onChange={(value) => setDraftValue(key, value)}
                />
              )}
            </label>
          )
        }
        const renderWorkTimePlanField = () => {
          const rawValue = stringValue(draft.workTimePlanCode)
          const previewPlan = workingTimePlanByCode.get(rawValue)
          const displayValue =
            workTimeLabelMap.get(rawValue) ??
            (rawValue ? rawValue : 'Default 24/7')

          return (
            <label className="routing-config-crud-modal__field routing-config-skill-queue-modal__work-time-field">
              <span>Work Time Plan</span>
              <div className="routing-config-skill-queue-modal__work-time-control">
                {isReadOnly ? (
                  <em>{displayValue}</em>
                ) : (
                  <Select
                    options={workTimeOptions}
                    value={rawValue}
                    onChange={(value) => setDraftValue('workTimePlanCode', value)}
                  />
                )}
                {previewPlan && (
                  <BaseButton
                    variant="secondary"
                    onClick={() => setPreviewWorkingTimePlan(previewPlan)}
                  >
                    Preview
                  </BaseButton>
                )}
              </div>
            </label>
          )
        }
        const renderNumberField = (
          key: string,
          label: string,
          unit: string,
          options?: {
            max?: number
            min?: number
            readOnly?: boolean
            required?: boolean
          },
        ) => {
          const value = numberValue(draft[key])

          return (
            <label className="routing-config-crud-modal__field routing-config-media-rule-modal__number-field">
              <span>
                {label}
                {options?.required && renderRequiredMark()}
              </span>
              {isReadOnly || options?.readOnly ? (
                <em>
                  {value} {unit}
                </em>
              ) : (
                <span className="routing-config-media-rule-modal__number-control">
                  <InputNumber
                    max={options?.max}
                    min={options?.min ?? 1}
                    value={value}
                    onChange={(nextValue) =>
                      setDraftValue(key, Number(nextValue) || 0)
                    }
                  />
                  <em>{unit}</em>
                </span>
              )}
            </label>
          )
        }
        return (
          <div className="routing-config-skill-queue-modal">
            <section className="routing-config-media-rule-modal__section">
              <header>
                <strong>Basic Information</strong>
              </header>
              <div className="routing-config-crud-modal__section-grid">
                {renderTextField('skillQueueCode', 'Skill ID', {
                  readOnlyOnEdit: true,
                  required: true,
                })}
                {renderTextField('platformSkillId', 'Platform Skill ID', {
                  required: true,
                })}
                {renderTextField('skillQueueName', 'Skill Name', {
                  required: true,
                })}
                {renderSelectField('vdnCode', 'VDN', vdnOptions, true)}
                {renderWorkTimePlanField()}
                {renderNumberField('assignedAgentCount', 'Assigned Agents', 'agents', {
                  readOnly: true,
                })}
              </div>
            </section>
          </div>
        )
      }}
      searchFields={['skillQueueCode', 'platformSkillId', 'skillQueueName', 'vdnCode']}
      title="Skill Queues"
      validateDraft={(draft, currentRecord) => [
        ...validateCode(stringValue(draft.skillQueueCode), 'Skill ID'),
        ...validateUnique(
          skillQueues,
          currentRecord,
          'skillQueueCode',
          stringValue(draft.skillQueueCode),
          'Skill ID',
        ),
        ...fieldRequired(draft, 'platformSkillId', 'Platform Skill ID'),
        ...fieldRequired(draft, 'skillQueueName', 'Skill Name'),
        ...fieldRequired(draft, 'vdnCode', 'VDN'),
      ]}
      onDelete={(record) =>
        deleteEntity('skillQueues', 'skillQueueCode', record.skillQueueCode)
      }
      onSave={(record) => upsertEntity('skillQueues', 'skillQueueCode', record)}
      />
      <AdminModal
        className="routing-config-crud-modal routing-config-working-time-modal"
        kind="detail"
        open={Boolean(previewWorkingTimePlan)}
        title="View Working Time Plan"
        width={1080}
        onCancel={() => setPreviewWorkingTimePlan(null)}
      >
        {previewWorkingTimePlan && (
          <WorkingTimePlanPreviewContent plan={previewWorkingTimePlan} />
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton
            variant="secondary"
            onClick={() => setPreviewWorkingTimePlan(null)}
          >
            Close
          </BaseButton>
        </div>
      </AdminModal>
    </>
  )
}

