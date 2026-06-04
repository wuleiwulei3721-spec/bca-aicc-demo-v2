import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, DatePicker, Input, InputNumber, Select, Switch, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import {
  BaseButton,
  BaseCard,
  BaseModal,
  BaseTable,
  PageContainer,
} from '../../components'
import { useRoutingConfigStore } from '../../store'
import type {
  AccessAccount,
  AccessAccountExtensionConfig,
  AccessSite,
  BusinessType,
  Channel,
  ChannelMediaRuleBinding,
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
  type RoutingConfigField,
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

const videoSupportOptions: RoutingConfigSelectOption[] = [
  { label: 'No', value: 'false' },
  { label: 'Yes', value: 'true' },
]

interface AccessAccountConfigField {
  key: string
  label: string
}

interface AccessAccountChannelSchema {
  fields: AccessAccountConfigField[]
}

const accessAccountChannelSchemas: Record<string, AccessAccountChannelSchema> = {
  HALOAPP: {
    fields: [
      { key: 'tenantId', label: 'Tenant ID' },
      { key: 'appId', label: 'App ID' },
      { key: 'webhookUrl', label: 'Webhook URL' },
      { key: 'signatureSecretRef', label: 'Signature Secret Ref' },
    ],
  },
  WEBCHAT: {
    fields: [
      { key: 'widgetId', label: 'Widget ID' },
      { key: 'allowedDomain', label: 'Allowed Domain' },
      { key: 'webhookUrl', label: 'Webhook URL' },
      { key: 'signatureSecretRef', label: 'Signature Secret Ref' },
    ],
  },
  WHATSAPP: {
    fields: [
      { key: 'wabaId', label: 'WABA ID' },
      { key: 'phoneNumberId', label: 'Phone Number ID' },
      { key: 'metaAppId', label: 'Meta App ID' },
      { key: 'webhookVerifyTokenRef', label: 'Webhook Verify Token Ref' },
    ],
  },
  EMAIL: {
    fields: [
      { key: 'mailboxAddress', label: 'Mailbox Address' },
      { key: 'imapHost', label: 'IMAP Host' },
      { key: 'imapPort', label: 'IMAP Port' },
      { key: 'smtpHost', label: 'SMTP Host' },
      { key: 'smtpPort', label: 'SMTP Port' },
      { key: 'authSecretRef', label: 'Auth Secret Ref' },
    ],
  },
  INSTAGRAM: {
    fields: [
      { key: 'instagramAccountId', label: 'Instagram Account ID' },
      { key: 'username', label: 'Username' },
      { key: 'linkedPageId', label: 'Linked Page ID' },
      { key: 'webhookVerifyTokenRef', label: 'Webhook Verify Token Ref' },
    ],
  },
  LINKEDIN: {
    fields: [
      { key: 'organizationId', label: 'Organization ID' },
      { key: 'developerAppId', label: 'Developer App ID' },
      { key: 'oauthClientId', label: 'OAuth Client ID' },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref' },
    ],
  },
  FACEBOOK: {
    fields: [
      { key: 'pageId', label: 'Page ID' },
      { key: 'pageName', label: 'Page Name' },
      { key: 'metaAppId', label: 'Meta App ID' },
      { key: 'webhookVerifyTokenRef', label: 'Webhook Verify Token Ref' },
    ],
  },
  X: {
    fields: [
      { key: 'appId', label: 'App ID' },
      { key: 'accountHandle', label: 'Account Handle' },
      { key: 'webhookEnvironment', label: 'Webhook Environment' },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref' },
    ],
  },
  TIKTOK: {
    fields: [
      { key: 'appId', label: 'App ID' },
      { key: 'clientKey', label: 'Client Key' },
      { key: 'webhookUrl', label: 'Webhook URL' },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref' },
    ],
  },
  YOUTUBE: {
    fields: [
      { key: 'channelId', label: 'Channel ID' },
      { key: 'googleProjectId', label: 'Google Project ID' },
      { key: 'oauthClientId', label: 'OAuth Client ID' },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref' },
    ],
  },
  APPSTORE: {
    fields: [
      { key: 'issuerId', label: 'Issuer ID' },
      { key: 'keyId', label: 'Key ID' },
      { key: 'appId', label: 'App ID' },
      { key: 'privateKeySecretRef', label: 'Private Key Secret Ref' },
    ],
  },
  PLAYSTORE: {
    fields: [
      { key: 'packageName', label: 'Package Name' },
      { key: 'googleProjectId', label: 'Google Project ID' },
      { key: 'serviceAccountEmail', label: 'Service Account Email' },
      { key: 'serviceAccountSecretRef', label: 'Service Account Secret Ref' },
    ],
  },
}

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

function getAccessAccountSchema(channelCode: string) {
  return (
    accessAccountChannelSchemas[channelCode] ?? {
      fields: [],
    }
  )
}

function buildAccessAccountExtensionConfig(
  draft: RoutingConfigDraft,
  channelCode: string,
): AccessAccountExtensionConfig {
  return getAccessAccountSchema(channelCode).fields.reduce<AccessAccountExtensionConfig>(
    (config, field) => ({
      ...config,
      [field.key]: stringValue(draft[field.key]),
    }),
    {},
  )
}

function buildAccessAccountDraft(record: AccessAccount): RoutingConfigDraft {
  const configDraft = getAccessAccountSchema(record.channelCode).fields.reduce<RoutingConfigDraft>(
    (draft, field) => ({
      ...draft,
      [field.key]: record.extensionConfig[field.key] ?? '',
    }),
    {},
  )

  return {
    accountCode: record.accountCode,
    accountName: record.accountName,
    channelCode: record.channelCode,
    externalAccountId: record.externalAccountId,
    secretRef: record.secretRef,
    status: record.status,
    ...configDraft,
  }
}

function buildAccessAccountConfigFields(channelCode: string): RoutingConfigField[] {
  return getAccessAccountSchema(channelCode).fields.map((field) => ({
    key: field.key,
    label: field.label,
    required: true,
    type: 'text',
  }))
}

function validateNumberRange(
  value: unknown,
  label: string,
  min: number,
  max: number,
) {
  const nextValue = numberValue(value)

  if (nextValue < min || nextValue > max) {
    return [`${label} must be between ${min} and ${max}.`]
  }

  return []
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
  const accessAccounts = useRoutingConfigStore((state) => state.accessAccounts)
  const channelMediaRuleBindings = useRoutingConfigStore(
    (state) => state.channelMediaRuleBindings,
  )
  const channels = useRoutingConfigStore((state) => state.channels)
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
      { label: 'Default 24x7', value: '' },
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
      accessAccounts,
      channelMediaRuleBindings,
      channelOptions,
      channels,
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
    accessAccounts,
    channelMediaRuleBindings,
    channels,
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
        {
          dataIndex: 'status',
          title: 'Status',
          width: 120,
          render: renderRoutingStatus,
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
        status: statusValue(draft.status),
        vdnCode: stringValue(draft.vdnCode),
        vdnName: stringValue(draft.vdnName),
      })}
      fields={[
        { key: 'vdnCode', label: 'VDN ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'vdnName', label: 'VDN Name', required: true, type: 'text' },
        { key: 'platformVdnId', label: 'Platform VDN ID', required: true, type: 'text' },
        { key: 'status', label: 'Status', switchLabels: statusSwitchLabels, type: 'statusSwitch' },
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
        {
          key: 'status',
          label: 'Status',
          match: (record, value) => record.status === value,
          options: statusFilterOptions,
          type: 'select',
          width: 200,
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
      tableScrollX={980}
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
        { dataIndex: 'status', title: 'Status', width: 120, render: renderRoutingStatus },
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
        status: statusValue(draft.status),
      })}
      entityName="Site"
      fields={[
        { key: 'siteCode', label: 'Site ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'siteName', label: 'Site Name', required: true, type: 'text' },
        { key: 'address', label: 'Address', rows: 2, type: 'textarea' },
        { key: 'ownerName', label: 'Owner Name', type: 'text' },
        { key: 'ownerPhone', label: 'Owner Phone', type: 'text' },
        { key: 'status', label: 'Status', switchLabels: statusSwitchLabels, type: 'statusSwitch' },
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
      tableScrollX={1020}
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

export function ChannelsPage() {
  const channels = useRoutingConfigStore((state) => state.channels)
  const channelMediaRuleBindings = useRoutingConfigStore(
    (state) => state.channelMediaRuleBindings,
  )
  const mediaServiceRulePlans = useRoutingConfigStore(
    (state) => state.mediaServiceRulePlans,
  )
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { accessAccounts, mediaOptions, routingRules } = useRoutingLookups()
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    mediaTypes: [] as MediaTypeCode[],
    status: '',
  })
  const [filterDraft, setFilterDraft] = useState({
    keyword: '',
    mediaTypes: [] as MediaTypeCode[],
    status: '',
  })
  const [bindingDrafts, setBindingDrafts] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState<Channel>(() => ({
    channelCategory: 'messaging',
    channelCode: 'CHANNEL_701',
    channelId: '701',
    channelName: '',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  }))
  const [modalMode, setModalMode] = useState<
    'add' | 'delete' | 'edit' | 'view' | null
  >(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const mediaLabelByValue = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const textRulePlanOptions = useMemo(
    () =>
      mediaServiceRulePlans
        .filter((plan) => plan.mediaCode === 'TEXT' && plan.status === 'Active')
        .map((plan) => ({
          label: plan.planName,
          value: plan.planCode,
        })),
    [mediaServiceRulePlans],
  )
  const rulePlanLabelByCode = useMemo(
    () =>
      new Map(
        mediaServiceRulePlans.map((plan) => [plan.planCode, plan.planName]),
      ),
    [mediaServiceRulePlans],
  )
  const bindingByChannelMedia = useMemo(
    () =>
      new Map(
        channelMediaRuleBindings.map((binding) => [
          `${binding.channelCode}_${binding.mediaCode}`,
          binding,
        ]),
      ),
    [channelMediaRuleBindings],
  )
  const formatMediaTypes = (mediaTypes: MediaTypeCode[]) =>
    mediaTypes
      .map((mediaType) => mediaLabelByValue.get(mediaType) ?? mediaType)
      .join(', ')
  const getRulePlanText = (channelCode: string, mediaCode: MediaTypeCode) => {
    const mediaLabel = mediaLabelByValue.get(mediaCode) ?? mediaCode

    if (mediaCode !== 'TEXT') {
      return `${mediaLabel} · Reserved / Not configured`
    }

    const binding = bindingByChannelMedia.get(`${channelCode}_${mediaCode}`)
    const planName = binding
      ? rulePlanLabelByCode.get(binding.rulePlanCode)
      : null

    return `${mediaLabel} · ${planName ?? 'Not configured'}`
  }
  const createDefaultChannel = () => {
    const nextChannelId = String(
      Math.max(700, ...channels.map((channel) => Number(channel.channelId) || 0)) +
        1,
    )

    return {
      channelCategory: 'messaging' as const,
      channelCode: `CHANNEL_${nextChannelId}`,
      channelId: nextChannelId,
      channelName: '',
      maxConcurrency: 50,
      mediaTypes: ['TEXT'] as MediaTypeCode[],
      minScanIntervalSeconds: 30,
      status: 'Active' as RoutingConfigStatus,
    }
  }
  const buildBindingDrafts = (record: Channel) => {
    if (!record.mediaTypes.includes('TEXT')) {
      return {}
    }

    return {
      TEXT:
        bindingByChannelMedia.get(`${record.channelCode}_TEXT`)?.rulePlanCode ??
        textRulePlanOptions[0]?.value ??
        '',
    }
  }
  const getDeleteBlockReason = (record: Channel) =>
    accessAccounts.some((account) => account.channelCode === record.channelCode) ||
    routingRules.some((rule) =>
      rule.conditions.some(
        (condition) =>
          condition.factorCode === '11' &&
          condition.factorValueCode === record.channelCode,
      ),
    )
      ? 'This channel is referenced by access accounts or routing rules.'
      : null
  const openModal = (
    mode: 'add' | 'delete' | 'edit' | 'view',
    record?: Channel,
  ) => {
    const nextDraft = record
      ? {
          ...record,
          mediaTypes: [...record.mediaTypes],
        }
      : createDefaultChannel()

    setModalMode(mode)
    setSelectedChannel(record ?? null)
    setDraft(nextDraft)
    setBindingDrafts(buildBindingDrafts(nextDraft))
    setSubmitAttempted(false)
    setNotice(null)
  }
  const closeModal = () => {
    setModalMode(null)
    setSelectedChannel(null)
    setNotice(null)
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
      mediaTypes,
    }))
    setBindingDrafts((currentDraft) => {
      if (!mediaTypes.includes('TEXT')) {
        return {}
      }

      return {
        TEXT:
          currentDraft.TEXT ??
          textRulePlanOptions[0]?.value ??
          '',
      }
    })
  }
  const validationErrors = useMemo(() => {
    if (!modalMode || modalMode === 'delete' || modalMode === 'view') {
      return []
    }

    const errors: string[] = []
    const channelId = draft.channelId.trim()

    if (!channelId) {
      errors.push('Channel ID is required.')
    } else if (!/^\d+$/.test(channelId)) {
      errors.push('Channel ID must use numbers.')
    }

    errors.push(
      ...validateUnique(
        channels,
        selectedChannel,
        'channelId',
        channelId,
        'Channel ID',
      ),
    )

    if (!draft.channelName.trim()) {
      errors.push('Channel Name is required.')
    }

    if (draft.mediaTypes.length === 0) {
      errors.push('Media Type is required.')
    }

    if (draft.maxConcurrency <= 0) {
      errors.push('Max Concurrent Calls must be greater than 0.')
    }

    if (draft.minScanIntervalSeconds <= 0) {
      errors.push('Min Scan Interval Seconds must be greater than 0.')
    }

    if (draft.status === 'Active' && draft.mediaTypes.includes('TEXT')) {
      const rulePlanCode = bindingDrafts.TEXT
      const activeTextPlan = mediaServiceRulePlans.find(
        (plan) =>
          plan.planCode === rulePlanCode &&
          plan.mediaCode === 'TEXT' &&
          plan.status === 'Active',
      )

      if (!activeTextPlan) {
        errors.push('Active Text media must bind an enabled Text rule plan.')
      }
    }

    return errors
  }, [
    bindingDrafts.TEXT,
    channels,
    draft,
    mediaServiceRulePlans,
    modalMode,
    selectedChannel,
  ])
  const filteredChannels = useMemo(
    () =>
      channels.filter((channel) => {
        const keyword = appliedFilters.keyword.trim().toLowerCase()
        const keywordMatched = keyword
          ? [channel.channelId, channel.channelName].some((value) =>
              value.toLowerCase().includes(keyword),
            )
          : true
        const mediaMatched =
          appliedFilters.mediaTypes.length === 0 ||
          appliedFilters.mediaTypes.some((mediaType) =>
            channel.mediaTypes.includes(mediaType),
          )
        const statusMatched = appliedFilters.status
          ? channel.status === appliedFilters.status
          : true

        return keywordMatched && mediaMatched && statusMatched
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

    const channelCode =
      selectedChannel?.channelCode ?? `CHANNEL_${draft.channelId.trim()}`
    const nextChannel: Channel = {
      ...draft,
      channelCode,
      channelId: draft.channelId.trim(),
      channelName: draft.channelName.trim(),
      maxConcurrency: Number(draft.maxConcurrency),
      mediaTypes: [...draft.mediaTypes],
      minScanIntervalSeconds: Number(draft.minScanIntervalSeconds),
      status: draft.status,
    }

    upsertEntity('channels', 'channelId', nextChannel)

    if (nextChannel.mediaTypes.includes('TEXT') && bindingDrafts.TEXT) {
      const binding: ChannelMediaRuleBinding = {
        bindingCode: `${channelCode}_TEXT`,
        channelCode,
        mediaCode: 'TEXT',
        rulePlanCode: bindingDrafts.TEXT,
        status: nextChannel.status === 'Active' ? 'Active' : 'Disabled',
      }

      upsertEntity('channelMediaRuleBindings', 'bindingCode', binding)
    } else {
      deleteEntity('channelMediaRuleBindings', 'bindingCode', `${channelCode}_TEXT`)
    }

    closeModal()
  }
  const handleDelete = () => {
    if (!selectedChannel) {
      return
    }

    const blockReason = getDeleteBlockReason(selectedChannel)

    if (blockReason) {
      setNotice(blockReason)
      return
    }

    deleteEntity('channels', 'channelId', selectedChannel.channelId)
    deleteEntity(
      'channelMediaRuleBindings',
      'bindingCode',
      `${selectedChannel.channelCode}_TEXT`,
    )
    closeModal()
  }
  const isReadOnly = modalMode === 'delete' || modalMode === 'view'
  const deleteBlockReason =
    modalMode === 'delete' && selectedChannel
      ? getDeleteBlockReason(selectedChannel)
      : null
  const columns: ColumnsType<Channel> = [
    {
      dataIndex: 'channelId',
      fixed: 'left',
      title: 'Channel ID',
      width: 110,
      render: (value: string) => <strong>{value}</strong>,
    },
    { dataIndex: 'channelName', title: 'Channel Name', width: 150 },
    {
      dataIndex: 'mediaTypes',
      title: 'Media Type',
      width: 200,
      render: (value: MediaTypeCode[]) => formatMediaTypes(value),
    },
    {
      title: 'Rule Plan',
      width: 260,
      render: (_, record) => (
        <div className="routing-config-rule-plan-summary">
          {record.mediaTypes.map((mediaType) => (
            <span key={mediaType}>
              {getRulePlanText(record.channelCode, mediaType)}
            </span>
          ))}
        </div>
      ),
    },
    {
      dataIndex: 'maxConcurrency',
      title: 'Max Concurrent Calls',
      width: 160,
    },
    {
      dataIndex: 'minScanIntervalSeconds',
      title: 'Min Scan Interval (s)',
      width: 160,
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
      width: 156,
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`View ${record.channelId}`}
            title="View"
            type="button"
            onClick={() => openModal('view', record)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${record.channelId}`}
            title="Edit"
            type="button"
            onClick={() => openModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.channelId}`}
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
    <PageContainer title="Channels">
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
          <BaseTable
            columns={columns}
            dataSource={filteredChannels}
            pagination={paginationConfig}
            rowKey="channelId"
            scroll={{ x: 1370 }}
            size="small"
          />
        </BaseCard>
      </section>

      <BaseModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(modalMode)}
        title={`${modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : modalMode === 'delete' ? 'Delete' : 'View'} Channel`}
        width={900}
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
          {modalMode === 'delete' ? (
            <div className="routing-config-crud-modal__delete">
              {deleteBlockReason ? (
                <Alert
                  showIcon
                  description={deleteBlockReason}
                  message="This record cannot be deleted."
                  type="warning"
                />
              ) : (
                <Alert
                  showIcon
                  description="This only changes the current demo session."
                  message={`Delete ${selectedChannel?.channelName ?? ''}?`}
                  type="warning"
                />
              )}
            </div>
          ) : (
            <>
              <div className="routing-config-crud-modal__section-grid">
                <label className="routing-config-crud-modal__field">
                  <span>
                    Channel ID <strong>*</strong>
                  </span>
                  <Input
                    disabled={isReadOnly || modalMode === 'edit'}
                    value={draft.channelId}
                    onChange={(event) =>
                      updateDraft('channelId', event.target.value)
                    }
                  />
                </label>
                <label className="routing-config-crud-modal__field">
                  <span>
                    Channel Name <strong>*</strong>
                  </span>
                  <Input
                    disabled={isReadOnly}
                    value={draft.channelName}
                    onChange={(event) =>
                      updateDraft('channelName', event.target.value)
                    }
                  />
                </label>
                <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
                  <span>
                    Media Type <strong>*</strong>
                  </span>
                  <Select
                    disabled={isReadOnly}
                    mode="multiple"
                    options={mediaOptions}
                    value={draft.mediaTypes}
                    onChange={(value) =>
                      updateMediaTypes(value as MediaTypeCode[])
                    }
                  />
                </label>
                <label className="routing-config-crud-modal__field">
                  <span>Max Concurrent Calls</span>
                  <InputNumber
                    disabled={isReadOnly}
                    min={1}
                    value={draft.maxConcurrency}
                    onChange={(value) =>
                      updateDraft('maxConcurrency', Number(value) || 0)
                    }
                  />
                </label>
                <label className="routing-config-crud-modal__field">
                  <span>Min Scan Interval Seconds</span>
                  <InputNumber
                    disabled={isReadOnly}
                    min={1}
                    value={draft.minScanIntervalSeconds}
                    onChange={(value) =>
                      updateDraft('minScanIntervalSeconds', Number(value) || 0)
                    }
                  />
                </label>
                <label className="routing-config-crud-modal__field routing-config-crud-modal__field--status">
                  <span>Status</span>
                  {isReadOnly ? (
                    <RoutingConfigStatusBadge status={draft.status} />
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
                      <em>
                        {draft.status === 'Active' ? 'Enabled' : 'Disabled'}
                      </em>
                    </span>
                  )}
                </label>
              </div>
              <section className="routing-config-crud-modal__section">
                <strong className="routing-config-crud-modal__section-title">
                  Media Rule Plan Binding
                </strong>
                <div className="routing-config-media-binding-list">
                  {draft.mediaTypes.map((mediaType) => (
                    <div
                      className="routing-config-media-binding-row"
                      key={mediaType}
                    >
                      <span>{mediaLabelByValue.get(mediaType) ?? mediaType}</span>
                      {mediaType === 'TEXT' ? (
                        <Select
                          disabled={isReadOnly}
                          options={textRulePlanOptions}
                          placeholder="Select Text rule plan"
                          value={bindingDrafts.TEXT || undefined}
                          onChange={(value) =>
                            setBindingDrafts((currentDraft) => ({
                              ...currentDraft,
                              TEXT: value,
                            }))
                          }
                        />
                      ) : (
                        <em>Reserved / Not configured</em>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {modalMode === 'view' ? 'Close' : 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && !deleteBlockReason && (
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
      </BaseModal>
    </PageContainer>
  )
}

const mediaServiceTemplateVariables = [
  '{customerName}',
  '{channelName}',
  '{agentName}',
  '{timeoutMinutes}',
  '{reminderMinutes}',
  '{estimatedWaitMinutes}',
  '{workTime}',
]

function createDefaultMediaServiceRulePlan(
  existingPlans: MediaServiceRulePlan[],
): MediaServiceRulePlan {
  const nextIndex = existingPlans.length + 1

  return {
    accessSuccessWelcomeMessage:
      'Hello, the intelligent assistant is ready to serve you.',
    agentNoReplyAutoResponseMessage: 'Please wait, we are processing...',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: 'Thank you for contacting us. Have a great day!',
    assignedAgentGreeting:
      'Dear {customerName}, {agentName} will serve you. If you do not reply within {timeoutMinutes} minutes, this conversation will close automatically. Please check messages in time.',
    agentTimeoutNotice:
      'Customer timeout no reply, conversation closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We have not received your reply. The service has been closed automatically. Please contact us again if needed.',
    description: '',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      'Sorry, our working time is {workTime}. Please contact us during service hours.',
    planCode: `MSRP_TEXT_${String(nextIndex).padStart(2, '0')}`,
    planName: '',
    preTimeoutReminderMessage:
      'Please reply soon. This conversation will close in {reminderMinutes} minute.',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'Agents are currently busy. Please try again later.',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      'Our agents are busy now. Estimated waiting time is {estimatedWaitMinutes} minutes.',
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
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const mediaLabelByValue = useMemo(
    () => new Map(mediaOptions.map((option) => [option.value, option.label])),
    [mediaOptions],
  )
  const textMediaOptions = mediaOptions.filter((option) => option.value === 'TEXT')
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
  const validationErrors = useMemo(() => {
    if (!modalMode || modalMode === 'delete' || modalMode === 'view') {
      return []
    }

    const errors: string[] = []

    errors.push(
      ...validateCode(draft.planCode.trim(), 'Plan ID'),
      ...validateUnique(
        mediaServiceRulePlans,
        selectedPlan,
        'planCode',
        draft.planCode.trim(),
        'Plan ID',
      ),
    )

    if (!draft.planName.trim()) {
      errors.push('Plan Name is required.')
    }

    if (draft.mediaCode !== 'TEXT') {
      errors.push('Only Text media rule plans are supported now.')
    }

    const positiveNumberFields: Array<[keyof MediaServiceRulePlan, string]> = [
      ['maxConcurrentAccess', 'Max Concurrent Access'],
      ['minScanIntervalSeconds', 'Minimum Scan Interval'],
      ['maxQueueCustomers', 'Max Queue Customers'],
      ['queueTimeoutMinutes', 'Queue Timeout'],
      ['preTimeoutReminderMinutes', 'Pre-timeout Reminder Time'],
      ['customerNoReplyTimeoutMinutes', 'No Reply Timeout'],
      ['agentNoReplyTimeoutSeconds', 'Agent No Reply Timeout'],
      ['webchatRecallLimitSeconds', 'Webchat Message Recall Limit'],
      ['agentNoReplyWarningSeconds', 'Agent No Reply Warning Seconds'],
      ['agentNoReplyBreachSeconds', 'Agent No Reply Breach Seconds'],
    ]

    positiveNumberFields.forEach(([field, label]) => {
      const value = draft[field]

      if (typeof value !== 'number' || value <= 0) {
        errors.push(`${label} must be greater than 0.`)
      }
    })

    if (
      draft.preTimeoutReminderMinutes >= draft.customerNoReplyTimeoutMinutes
    ) {
      errors.push('Pre-timeout Reminder Time must be less than No Reply Timeout.')
    }

    if (draft.agentNoReplyWarningSeconds > draft.agentNoReplyBreachSeconds) {
      errors.push('Agent No Reply Warning Seconds must be less than or equal to Breach Seconds.')
    }

    if (draft.agentNoReplyBreachSeconds > draft.agentNoReplyTimeoutSeconds) {
      errors.push('Agent No Reply Breach Seconds must be less than or equal to Agent No Reply Timeout.')
    }

    const requiredMessageFields: Array<[keyof MediaServiceRulePlan, string]> = [
      ['agentNoReplyAutoResponseMessage', 'Agent No Reply Auto Response Message'],
      ['accessSuccessWelcomeMessage', 'Access Success Welcome Message'],
      ['preTimeoutReminderMessage', 'Pre-timeout Reminder Message'],
      ['customerTimeoutNotice', 'Customer Timeout Notice'],
      ['agentTimeoutNotice', 'Agent Timeout Notice'],
      ['nonWorkingTimeMessage', 'Non-working Time Message'],
      ['queueWaitingMessage', 'Queue Waiting Message'],
      ['queueTimeoutMessage', 'Queue Timeout Message'],
      ['assignedAgentGreeting', 'Assigned Agent Greeting'],
      ['agentEndReminder', 'Agent End Reminder'],
    ]

    requiredMessageFields.forEach(([field, label]) => {
      const value = draft[field]

      if (typeof value !== 'string' || !value.trim()) {
        errors.push(`${label} is required.`)
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
      ? 'This rule plan is referenced by channel media bindings.'
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
  ) => (
    <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
      <span>
        {label} <strong>*</strong>
      </span>
      <Input.TextArea
        disabled={isReadOnly}
        rows={rows}
        value={String(draft[field] ?? '')}
        onChange={(event) =>
          updateDraft(field, event.target.value as never)
        }
      />
    </label>
  )
  const renderNumberField = (
    field: keyof MediaServiceRulePlan,
    label: string,
    addonAfter: string,
    min = 1,
  ) => (
    <label className="routing-config-crud-modal__field">
      <span>{label}</span>
      <InputNumber
        addonAfter={addonAfter}
        disabled={isReadOnly}
        min={min}
        value={Number(draft[field] ?? 0)}
        onChange={(value) =>
          updateDraft(field, (Number(value) || 0) as never)
        }
      />
    </label>
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
    <PageContainer title="Media Service Rule Plans">
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
                      ...textMediaOptions,
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
          <BaseTable
            columns={columns}
            dataSource={filteredPlans}
            pagination={paginationConfig}
            rowKey="planCode"
            scroll={{ x: 1250 }}
            size="small"
          />
        </BaseCard>
      </section>

      <BaseModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(modalMode)}
        title={`${modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : modalMode === 'delete' ? 'Delete' : 'View'} Media Service Rule Plan`}
        width={1080}
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
          {modalMode === 'delete' ? (
            <div className="routing-config-crud-modal__delete">
              {deleteBlockReason ? (
                <Alert
                  showIcon
                  description={deleteBlockReason}
                  message="This record cannot be deleted."
                  type="warning"
                />
              ) : (
                <Alert
                  showIcon
                  description="This only changes the current demo session."
                  message={`Delete ${selectedPlan?.planName ?? ''}?`}
                  type="warning"
                />
              )}
            </div>
          ) : (
            <>
              <section className="routing-config-crud-modal__section">
                <header>
                  <strong className="routing-config-crud-modal__section-title">
                    Basic Info
                  </strong>
                </header>
                <div className="routing-config-crud-modal__section-grid">
                  <label className="routing-config-crud-modal__field">
                    <span>
                      Plan ID <strong>*</strong>
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
                      Plan Name <strong>*</strong>
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
                    <span>Media Type</span>
                    <Select
                      disabled
                      options={textMediaOptions}
                      value={draft.mediaCode}
                    />
                  </label>
                  <label className="routing-config-crud-modal__field routing-config-crud-modal__field--status">
                    <span>Status</span>
                    {isReadOnly ? (
                      <RoutingConfigStatusBadge status={draft.status} />
                    ) : (
                      <span className="routing-config-crud-modal__switch-row">
                        <Switch
                          className="routing-config-status-switch"
                          checked={draft.status === 'Active'}
                          size="small"
                          onChange={(checked) =>
                            updateDraft(
                              'status',
                              checked ? 'Active' : 'Disabled',
                            )
                          }
                        />
                        <em>
                          {draft.status === 'Active' ? 'Enabled' : 'Disabled'}
                        </em>
                      </span>
                    )}
                  </label>
                  <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
                    <span>Description</span>
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

              <section className="routing-config-crud-modal__section">
                <header>
                  <strong className="routing-config-crud-modal__section-title">
                    Customer Service Configuration
                  </strong>
                </header>
                <div className="routing-config-media-rule-modal__variables">
                  {mediaServiceTemplateVariables.map((variable) => (
                    <Tag key={variable}>{variable}</Tag>
                  ))}
                </div>
                <div className="routing-config-media-rule-modal__subsections">
                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Access Configuration</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderNumberField(
                        'maxConcurrentAccess',
                        'Max Concurrent Access',
                        'items',
                      )}
                      {renderNumberField(
                        'minScanIntervalSeconds',
                        'Minimum Scan Interval',
                        'sec',
                      )}
                      {renderMessageField(
                        'accessSuccessWelcomeMessage',
                        'Access Success Welcome Message',
                      )}
                    </div>
                  </div>

                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Queue Configuration</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderMessageField(
                        'nonWorkingTimeMessage',
                        'Non-working Time Message',
                      )}
                      {renderNumberField(
                        'maxQueueCustomers',
                        'Max Queue Customers',
                        'customers',
                      )}
                      {renderNumberField(
                        'queueTimeoutMinutes',
                        'Queue Timeout',
                        'min',
                      )}
                      {renderMessageField(
                        'queueWaitingMessage',
                        'Queue Waiting Message',
                      )}
                      {renderMessageField(
                        'queueTimeoutMessage',
                        'Queue Timeout Message',
                      )}
                    </div>
                  </div>

                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Agent Opening / Ending Configuration</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderMessageField(
                        'assignedAgentGreeting',
                        'Assigned Agent Greeting',
                      )}
                      {renderMessageField(
                        'agentEndReminder',
                        'Agent End Reminder',
                      )}
                    </div>
                  </div>

                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Customer No Reply Configuration</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderNumberField(
                        'preTimeoutReminderMinutes',
                        'Pre-timeout Reminder Time',
                        'min',
                      )}
                      {renderMessageField(
                        'preTimeoutReminderMessage',
                        'Pre-timeout Reminder Message',
                      )}
                      {renderNumberField(
                        'customerNoReplyTimeoutMinutes',
                        'No Reply Timeout',
                        'min',
                      )}
                      {renderMessageField(
                        'customerTimeoutNotice',
                        'Customer Timeout Notice',
                      )}
                      {renderMessageField(
                        'agentTimeoutNotice',
                        'Agent Timeout Notice',
                      )}
                    </div>
                  </div>

                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Agent No Reply Configuration</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderNumberField(
                        'agentNoReplyTimeoutSeconds',
                        'Agent No Reply Timeout',
                        'sec',
                      )}
                      {renderMessageField(
                        'agentNoReplyAutoResponseMessage',
                        'Auto Response Message',
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="routing-config-crud-modal__section">
                <header>
                  <strong className="routing-config-crud-modal__section-title">
                    Agent Service Configuration
                  </strong>
                </header>
                <div className="routing-config-media-rule-modal__subsections">
                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Webchat Message Recall</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderNumberField(
                        'webchatRecallLimitSeconds',
                        'Webchat Message Recall Limit',
                        'sec',
                      )}
                    </div>
                  </div>

                  <div className="routing-config-media-rule-modal__subsection">
                    <h4>Agent No Reply Service Level</h4>
                    <div className="routing-config-crud-modal__section-grid">
                      {renderNumberField(
                        'agentNoReplyWarningSeconds',
                        'Warning',
                        'sec',
                      )}
                      {renderNumberField(
                        'agentNoReplyBreachSeconds',
                        'Breach',
                        'sec',
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {modalMode === 'view' ? 'Close' : 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && !deleteBlockReason && (
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
      </BaseModal>
    </PageContainer>
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
        { dataIndex: 'businessName', title: 'Business Name' },
        { dataIndex: 'status', title: 'Status', width: 120, render: renderRoutingStatus },
      ]}
      createDraft={() => ({
        businessName: '',
        businessTypeCode: '04',
        projectCode: 'BANK1',
        status: 'Active',
      })}
      data={businessTypes}
      description="Manage two-digit manual business type codes."
      draftToRecord={(draft) => ({
        businessName: stringValue(draft.businessName),
        businessTypeCode: stringValue(draft.businessTypeCode),
        projectCode: stringValue(draft.projectCode) || 'BANK1',
        status: statusValue(draft.status),
      })}
      fields={[
        { key: 'businessTypeCode', label: 'Business Type ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'businessName', label: 'Business Name', required: true, type: 'text' },
        { key: 'status', label: 'Status', switchLabels: statusSwitchLabels, type: 'statusSwitch' },
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) => {
            const keyword = value.toLowerCase()

            return [record.businessTypeCode, record.businessName].some(
              (fieldValue) => fieldValue.toLowerCase().includes(keyword),
            )
          },
          placeholder: 'Business Type ID / Name',
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
      searchFields={['businessTypeCode', 'businessName']}
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
    <PageContainer title="Site Access Volume">
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
          <BaseTable<SiteAccessVolumeMediaRow>
            columns={columns}
            dataSource={filteredData}
            pagination={paginationConfig}
            rowKey={(record) => record.rowKey}
            scroll={{ x: 980 }}
            size="small"
          />
        </BaseCard>
      </section>

      <BaseModal
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
      </BaseModal>
    </PageContainer>
  )
}

export function AccessAccountsPage() {
  const accessAccounts = useRoutingConfigStore((state) => state.accessAccounts)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { channels, routingRules } = useRoutingLookups()
  const accountChannelOptions = useMemo(
    () =>
      channels
        .filter((channel) => channel.channelCode !== 'PHONE')
        .map((channel) => ({
          label: channel.channelName,
          value: channel.channelCode,
        })),
    [channels],
  )
  const channelNameByCode = useMemo(
    () =>
      new Map(
        channels.map((channel) => [channel.channelCode, channel.channelName]),
      ),
    [channels],
  )
  const defaultChannelCode = accountChannelOptions[0]?.value ?? 'WHATSAPP'

  return (
    <RoutingConfigCrudPage<AccessAccount>
      columns={[
        {
          dataIndex: 'accountCode',
          title: 'Account ID',
          width: 170,
          render: (value: string) => <strong>{value}</strong>,
        },
        { dataIndex: 'accountName', ellipsis: true, title: 'Account Name', width: 210 },
        {
          dataIndex: 'channelCode',
          title: 'Channel',
          width: 130,
          render: (value: string) => channelNameByCode.get(value) ?? value,
        },
        {
          dataIndex: 'externalAccountId',
          ellipsis: true,
          title: 'External Account ID',
          width: 180,
        },
        { dataIndex: 'secretRef', ellipsis: true, title: 'Secret Ref', width: 220 },
        { dataIndex: 'status', title: 'Status', width: 110, render: renderRoutingStatus },
      ]}
      createDraft={() => ({
        accountCode: 'ACC_NEW',
        accountName: '',
        channelCode: defaultChannelCode,
        externalAccountId: '',
        secretRef: 'secret://aicc/new',
        status: 'Active',
      })}
      data={accessAccounts}
      draftToRecord={(draft) => ({
        accountCode: stringValue(draft.accountCode),
        accountName: stringValue(draft.accountName),
        channelCode: stringValue(draft.channelCode),
        externalAccountId: stringValue(draft.externalAccountId),
        extensionConfig: buildAccessAccountExtensionConfig(
          draft,
          stringValue(draft.channelCode),
        ),
        secretRef: stringValue(draft.secretRef),
        status: statusValue(draft.status),
      })}
      fields={({ draft }) => [
        {
          key: 'accountCode',
          label: 'Account ID',
          readOnlyOnEdit: true,
          required: true,
          type: 'text',
        },
        { key: 'accountName', label: 'Account Name', required: true, type: 'text' },
        {
          key: 'channelCode',
          label: 'Channel',
          options: accountChannelOptions,
          required: true,
          type: 'select',
        },
        {
          key: 'externalAccountId',
          label: 'External Account ID',
          required: true,
          type: 'text',
        },
        { key: 'secretRef', label: 'Secret Ref', required: true, type: 'text' },
        {
          key: 'status',
          label: 'Status',
          switchLabels: statusSwitchLabels,
          type: 'statusSwitch',
        },
        ...buildAccessAccountConfigFields(stringValue(draft.channelCode)),
      ]}
      filters={[
        {
          key: 'keyword',
          label: 'Keyword',
          match: (record, value) =>
            [
              record.accountCode,
              record.accountName,
              record.externalAccountId,
              record.channelCode,
              channelNameByCode.get(record.channelCode) ?? '',
            ]
              .join(' ')
              .toLowerCase()
              .includes(value.toLowerCase()),
          placeholder: 'ID / name / external ID',
          type: 'text',
          width: 240,
        },
        {
          key: 'channelCode',
          label: 'Channel',
          options: accountChannelOptions,
          type: 'select',
          width: 220,
        },
        {
          key: 'status',
          label: 'Status',
          options: statusFilterOptions,
          type: 'select',
          width: 180,
        },
      ]}
      getDeleteBlockReason={(record) =>
        routingRules.some((rule) =>
          rule.conditions.some(
            (condition) =>
              condition.factorCode === '17' &&
              condition.factorValueCode === record.accountCode,
          ),
        )
          ? 'This access account is referenced by routing rules.'
          : null
      }
      idField="accountCode"
      recordToDraft={buildAccessAccountDraft}
      searchFields={['accountCode', 'accountName', 'channelCode', 'externalAccountId']}
      title="Access Accounts"
      validateDraft={(draft, currentRecord) => [
        ...validateCode(stringValue(draft.accountCode), 'Account ID'),
        ...validateUnique(
          accessAccounts,
          currentRecord,
          'accountCode',
          stringValue(draft.accountCode),
          'Account ID',
        ),
        ...fieldRequired(draft, 'accountName', 'Account Name'),
        ...fieldRequired(draft, 'channelCode', 'Channel'),
        ...fieldRequired(draft, 'externalAccountId', 'External Account ID'),
        ...fieldRequired(draft, 'secretRef', 'Secret Ref'),
        ...getAccessAccountSchema(stringValue(draft.channelCode)).fields.flatMap(
          (field) => fieldRequired(draft, field.key, field.label),
        ),
      ]}
      onDelete={(record) =>
        deleteEntity('accessAccounts', 'accountCode', record.accountCode)
      }
      onSave={(record) => upsertEntity('accessAccounts', 'accountCode', record)}
    />
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
    <PageContainer title="Working Time Plans">
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
          <BaseTable<WorkingTimePlan>
            columns={columns}
            dataSource={filteredData}
            pagination={paginationConfig}
            rowKey={(record) => record.planCode}
            scroll={{ x: 1080 }}
            size="small"
          />
        </BaseCard>
      </section>

      <BaseModal
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
      </BaseModal>
    </PageContainer>
  )
}

export function SkillQueuesPage() {
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const upsertEntity = useRoutingConfigStore((state) => state.upsertEntity)
  const deleteEntity = useRoutingConfigStore((state) => state.deleteEntity)
  const { routingRules, vdnOptions, workTimeOptions } = useRoutingLookups()
  const vdnLabelMap = useMemo(
    () => new Map(vdnOptions.map((option) => [option.value, option.label])),
    [vdnOptions],
  )
  const workTimeLabelMap = useMemo(
    () => new Map(workTimeOptions.map((option) => [option.value, option.label])),
    [workTimeOptions],
  )

  return (
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
            workTimeLabelMap.get(value) ?? 'Default 24x7',
        },
        {
          dataIndex: 'maxQueueSize',
          title: 'Max Queue Size',
          width: 116,
          render: (value: number) => `${value} items`,
        },
        {
          dataIndex: 'queueTimeoutSeconds',
          title: 'Queue Timeout',
          width: 116,
          render: (value: number) => `${value} sec`,
        },
        {
          dataIndex: 'supportsVideo',
          title: 'Supports Video',
          width: 112,
          render: (value: boolean) => (value ? 'Yes' : 'No'),
        },
        { dataIndex: 'assignedAgentCount', title: 'Agents', width: 72 },
        { dataIndex: 'status', title: 'Status', width: 100, render: renderRoutingStatus },
      ]}
      createDraft={() => ({
        assignedAgentCount: 0,
        maxQueueSize: 60,
        platformSkillId: '',
        promptsText: 'TEXT|Timeout Message|Queue timeout.',
        queueTimeoutSeconds: 100,
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
        maxQueueSize: numberValue(draft.maxQueueSize),
        platformSkillId: stringValue(draft.platformSkillId),
        prompts: textToPrompts(stringValue(draft.promptsText)),
        queueTimeoutSeconds: numberValue(draft.queueTimeoutSeconds),
        skillQueueCode: stringValue(draft.skillQueueCode),
        skillQueueName: stringValue(draft.skillQueueName),
        status: statusValue(draft.status),
        supportsVideo: booleanValue(draft.supportsVideo),
        vdnCode: stringValue(draft.vdnCode),
        workTimePlanCode: stringValue(draft.workTimePlanCode),
      })}
      fields={[
        { key: 'skillQueueCode', label: 'Skill ID', readOnlyOnEdit: true, required: true, type: 'text' },
        { key: 'platformSkillId', label: 'Platform Skill ID', required: true, type: 'text' },
        { key: 'skillQueueName', label: 'Skill Name', required: true, type: 'text' },
        { key: 'vdnCode', label: 'VDN', options: vdnOptions, required: true, type: 'select' },
        { key: 'workTimePlanCode', label: 'Work Time Plan', options: workTimeOptions, type: 'select' },
        { key: 'supportsVideo', label: 'Supports Video', options: videoSupportOptions, required: true, type: 'select' },
        { addonAfter: 'items', key: 'maxQueueSize', label: 'Max Queue Size', max: 60000, min: 1, required: true, type: 'number' },
        { addonAfter: 'sec', key: 'queueTimeoutSeconds', label: 'Queue Timeout', max: 10000, min: 0, required: true, type: 'number' },
        { addonAfter: 'agents', key: 'assignedAgentCount', label: 'Assigned Agents', readOnly: true, type: 'number' },
        { key: 'status', label: 'Status', required: true, switchLabels: statusSwitchLabels, type: 'statusSwitch' },
      ]}
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
        {
          key: 'status',
          label: 'Status',
          options: statusFilterOptions,
          type: 'select',
          width: 200,
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
      recordToDraft={(record) => ({
        assignedAgentCount: record.assignedAgentCount,
        maxQueueSize: record.maxQueueSize,
        platformSkillId: record.platformSkillId,
        promptsText: promptsToText(record.prompts),
        queueTimeoutSeconds: record.queueTimeoutSeconds,
        skillQueueCode: record.skillQueueCode,
        skillQueueName: record.skillQueueName,
        status: record.status,
        supportsVideo: record.supportsVideo ? 'true' : 'false',
        vdnCode: record.vdnCode,
        workTimePlanCode: record.workTimePlanCode,
      })}
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
        ...fieldRequired(draft, 'supportsVideo', 'Supports Video'),
        ...validateNumberRange(draft.maxQueueSize, 'Max Queue Size', 1, 60000),
        ...validateNumberRange(
          draft.queueTimeoutSeconds,
          'Queue Timeout',
          0,
          10000,
        ),
      ]}
      onDelete={(record) =>
        deleteEntity('skillQueues', 'skillQueueCode', record.skillQueueCode)
      }
      onSave={(record) => upsertEntity('skillQueues', 'skillQueueCode', record)}
    />
  )
}

