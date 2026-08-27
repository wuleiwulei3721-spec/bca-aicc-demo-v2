import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Alert, Checkbox, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  BaseButton,
  BaseCard,
  AdminFilterField,
  AdminModal,
  AdminTable,
  AdminPage,
  AdminToolbar,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { routingProjectCode } from '../../mock/routingConfiguration'
import { useAuthStore, useRoutingConfigStore } from '../../store'
import type {
  RouteFactor,
  RouteFactorCode,
  RoutingConfigStatus,
  RoutingRule,
} from '../../types'
import { RoutingConfigStatusBadge } from './RoutingConfigStatusBadge'
import { formatAuditActor, formatAuditDateTime } from '../../utils/audit'

type BatchSelections = Partial<Record<RouteFactorCode, string[]>>
type FactorValueMap = Partial<Record<RouteFactorCode, string>>
type RuleFactorFilters = Partial<Record<RouteFactorCode, string[]>>
type RuleModalMode = 'delete' | 'edit' | 'view'

interface RulePreviewRow {
  existingRule?: RoutingRule
  key: string
  status: RoutingConfigStatus
  valueMap: FactorValueMap
}

interface RuleDraft {
  status: RoutingConfigStatus
  targetSkillQueueCode: string
}

const defaultBatchPriority = 70
const initialBatchSelections: BatchSelections = {
  '13': ['SITE_JKT', 'SITE_SBY', 'SITE_SG_DR'],
  '11': ['WHATSAPP'],
  '12': ['TEXT'],
  '16': ['ID'],
  '15': ['01'],
}

function createRuleValueMap(rule: RoutingRule) {
  return rule.conditions.reduce<FactorValueMap>((currentMap, condition) => {
    currentMap[condition.factorCode] = condition.factorValueCode
    return currentMap
  }, {})
}

function getConditionValue(
  ruleConditions: Array<{ factorCode: RouteFactorCode; factorValueCode: string }>,
  factorCode: RouteFactorCode,
) {
  return (
    ruleConditions.find((condition) => condition.factorCode === factorCode)
      ?.factorValueCode ?? ''
  )
}

function renderRoutingStatus(status: RoutingConfigStatus) {
  return <RoutingConfigStatusBadge status={status} />
}

function createRuleKey(factors: RouteFactor[], valueMap: FactorValueMap) {
  return factors
    .map(
      (factor) =>
        `${factor.factorCode}:${valueMap[factor.factorCode] ?? ''}`,
    )
    .join('|')
}

function createHash(input: string) {
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(0, 6)
}

function createRuleCode(ruleKey: string) {
  return `RR-${routingProjectCode}-${createHash(ruleKey)}`
}

function createUniqueRuleCode(baseCode: string, rules: RoutingRule[]) {
  if (!rules.some((rule) => rule.ruleCode === baseCode)) {
    return baseCode
  }

  const suffix = createHash(`${baseCode}-${rules.length}`)
  return `${baseCode}-${suffix.slice(0, 3)}`
}

function createCombinations(
  factors: RouteFactor[],
  selections: BatchSelections,
) {
  let combinations: FactorValueMap[] = [{}]

  factors.forEach((factor) => {
    const selectedValues = selections[factor.factorCode]?.length
      ? selections[factor.factorCode] ?? []
      : ['']

    combinations = combinations.flatMap((combination) =>
      selectedValues.map((value) => ({
        ...combination,
        [factor.factorCode]: value,
      })),
    )
  })

  return combinations.slice(0, 160)
}

export function SkillRoutingRulesPage() {
  const authSession = useAuthStore((state) => state.session)
  const routeFactors = useRoutingConfigStore((state) => state.routeFactors)
  const routingRules = useRoutingConfigStore((state) => state.routingRules)
  const setRoutingRules = useRoutingConfigStore((state) => state.setRoutingRules)
  const channelAccounts = useRoutingConfigStore((state) => state.channelAccounts)
  const accessEntries = useRoutingConfigStore((state) => state.accessEntries)
  const accessSites = useRoutingConfigStore((state) => state.accessSites)
  const businessTypes = useRoutingConfigStore((state) => state.businessTypes)
  const channels = useRoutingConfigStore((state) => state.channels)
  const languageTypes = useRoutingConfigStore((state) => state.languageTypes)
  const mediaTypes = useRoutingConfigStore((state) => state.mediaTypes)
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const vdnAccessPoints = useRoutingConfigStore(
    (state) => state.vdnAccessPoints,
  )
  const [batchSelections, setBatchSelections] = useState<BatchSelections>(
    initialBatchSelections,
  )
  const [targetSkillQueueCode, setTargetSkillQueueCode] =
    useState('SQ_GENERAL_ID')
  const [batchModalOpen, setBatchModalOpen] = useState(false)
  const [excludedDuplicateKeys, setExcludedDuplicateKeys] = useState<string[]>([])
  const [batchWarning, setBatchWarning] = useState<string | null>(null)
  const [factorFilters, setFactorFilters] = useState<RuleFactorFilters>({})
  const [factorFilterDrafts, setFactorFilterDrafts] =
    useState<RuleFactorFilters>({})
  const [targetQueueFilter, setTargetQueueFilter] = useState('ALL')
  const [targetQueueFilterDraft, setTargetQueueFilterDraft] = useState('ALL')
  const [ruleStatusFilter, setRuleStatusFilter] = useState('ALL')
  const [ruleStatusFilterDraft, setRuleStatusFilterDraft] = useState('ALL')
  const { notify } = useOperationFeedback()
  const auditActor = formatAuditActor(
    authSession?.employeeId,
    authSession?.displayName,
  )
  const [modalMode, setModalMode] = useState<RuleModalMode | null>(null)
  const [selectedRule, setSelectedRule] = useState<RoutingRule | null>(null)
  const [ruleDraft, setRuleDraft] = useState<RuleDraft>({
    status: 'Active',
    targetSkillQueueCode: 'SQ_GENERAL_ID',
  })

  const activeFactors = useMemo(
    () =>
      routeFactors
        .filter((factor) => factor.enabled && factor.status === 'Active')
        .sort((first, second) => first.displayOrder - second.displayOrder),
    [routeFactors],
  )
  const activeSkillQueues = useMemo(
    () => skillQueues.filter((skillQueue) => skillQueue.status === 'Active'),
    [skillQueues],
  )
  const skillQueueOptions = useMemo(
    () =>
      activeSkillQueues.map((skillQueue) => ({
        label: skillQueue.skillQueueName,
        value: skillQueue.skillQueueCode,
      })),
    [activeSkillQueues],
  )
  const ruleStatusFilterOptions = [
    { label: 'Enabled', value: 'Active' },
    { label: 'Disabled', value: 'Disabled' },
  ]
  const factorValueOptions = useMemo(() => {
    const countryOptions = Array.from(
      new Set(accessSites.map((site) => site.countryCode)),
    ).map((countryCode) => ({
      factorCode: '14' as const,
      label: countryCode,
      value: countryCode,
    }))

    return [
      ...vdnAccessPoints.map((vdn) => ({
        factorCode: '10' as const,
        label: vdn.vdnName,
        value: vdn.vdnCode,
      })),
      ...channels.map((channel) => ({
        factorCode: '11' as const,
        label: channel.channelName,
        value: channel.channelCode,
      })),
      ...mediaTypes.map((mediaType) => ({
        factorCode: '12' as const,
        label: mediaType.mediaName,
        value: mediaType.mediaCode,
      })),
      ...accessSites.map((site) => ({
        factorCode: '13' as const,
        label: site.siteName,
        value: site.siteCode,
      })),
      ...countryOptions,
      ...businessTypes.map((businessType) => ({
        factorCode: '15' as const,
        label: businessType.businessName,
        value: businessType.businessTypeCode,
      })),
      ...languageTypes.map((language) => ({
        factorCode: '16' as const,
        label: language.languageName,
        value: language.languageCode,
      })),
      ...channelAccounts.map((account) => ({
        factorCode: '17' as const,
        label: account.accountName,
        value: account.accountCode,
      })),
      ...accessEntries.map((entry) => ({
        factorCode: '18' as const,
        label: entry.entryValue,
        value: entry.entryCode,
      })),
    ]
  }, [
    channelAccounts,
    accessEntries,
    accessSites,
    businessTypes,
    channels,
    languageTypes,
    mediaTypes,
    vdnAccessPoints,
  ])
  const valueLabelMap = useMemo(() => {
    const labelMap = new Map<string, string>()
    factorValueOptions.forEach((option) => {
      labelMap.set(`${option.factorCode}:${option.value}`, option.label)
    })
    return labelMap
  }, [factorValueOptions])
  const skillQueueLabelMap = useMemo(
    () =>
      new Map(
        skillQueues.map((skillQueue) => [
          skillQueue.skillQueueCode,
          skillQueue.skillQueueName,
        ]),
      ),
    [skillQueues],
  )
  const activeRules = useMemo(
    () => routingRules.filter((rule) => rule.status === 'Active'),
    [routingRules],
  )
  const batchCombinations = useMemo(
    () => createCombinations(activeFactors, batchSelections),
    [activeFactors, batchSelections],
  )
  const existingRuleByKey = useMemo(() => {
    const existingMap = new Map<string, RoutingRule>()

    activeRules.forEach((rule) => {
      existingMap.set(
        createRuleKey(activeFactors, createRuleValueMap(rule)),
        rule,
      )
    })

    return existingMap
  }, [activeFactors, activeRules])
  const batchPreviewRows = useMemo<RulePreviewRow[]>(
    () =>
      batchCombinations.map((combination) => {
        const key = createRuleKey(activeFactors, combination)

        return {
          existingRule: existingRuleByKey.get(key),
          key,
          status: 'Active',
          valueMap: combination,
        }
      }),
    [activeFactors, batchCombinations, existingRuleByKey],
  )
  const duplicatePreviewRows = useMemo(
    () => batchPreviewRows.filter((row) => Boolean(row.existingRule)),
    [batchPreviewRows],
  )

  const filteredRules = useMemo(() => {
    return routingRules.filter((rule) => {
      if (
        targetQueueFilter !== 'ALL' &&
        rule.targetSkillQueueCode !== targetQueueFilter
      ) {
        return false
      }

      if (ruleStatusFilter !== 'ALL' && rule.status !== ruleStatusFilter) {
        return false
      }

      return activeFactors.every((factor) => {
        const selectedValues = factorFilters[factor.factorCode] ?? []

        if (selectedValues.length === 0) {
          return true
        }

        const ruleValue = getConditionValue(
          rule.conditions,
          factor.factorCode,
        )

        return selectedValues.includes(ruleValue)
      })
    })
  }, [
    activeFactors,
    factorFilters,
    routingRules,
    ruleStatusFilter,
    targetQueueFilter,
  ])

  const paginationConfig = {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} / ${total} records`,
  }

  const factorOptions = (factor: RouteFactor) =>
    factorValueOptions
      .filter((option) => option.factorCode === factor.factorCode)
      .map((option) => ({
        label: option.label,
        value: option.value,
      }))

  const getFactorValueLabel = (factorCode: RouteFactorCode, value: string) => {
    if (!value) {
      return ''
    }

    return valueLabelMap.get(`${factorCode}:${value}`) ?? value
  }

  const renderSkillQueueValue = (skillQueueCode: string) => (
    <span className="routing-config__skill-value" title={skillQueueCode}>
      {skillQueueLabelMap.get(skillQueueCode) ?? skillQueueCode}
    </span>
  )

  const renderRuleFactorValue = (rule: RoutingRule, factor: RouteFactor) => {
    const value = getConditionValue(rule.conditions, factor.factorCode)

    return getFactorValueLabel(factor.factorCode, value)
  }

  const updateBatchSelection = (
    factorCode: RouteFactorCode,
    values: string[],
  ) => {
    setBatchSelections((currentSelections) => ({
      ...currentSelections,
      [factorCode]: values,
    }))
    setExcludedDuplicateKeys([])
    setBatchWarning(null)
  }

  const updateDuplicateSelection = (duplicateKey: string, checked: boolean) => {
    setExcludedDuplicateKeys((currentKeys) => {
      if (checked) {
        return currentKeys.filter((key) => key !== duplicateKey)
      }

      return Array.from(new Set([...currentKeys, duplicateKey]))
    })
    setBatchWarning(null)
  }

  const updateAllDuplicateSelections = (checked: boolean) => {
    setExcludedDuplicateKeys(
      checked ? [] : duplicatePreviewRows.map((duplicate) => duplicate.key),
    )
    setBatchWarning(null)
  }

  const openBatchModal = () => {
    setBatchWarning(null)
    setExcludedDuplicateKeys([])
    setBatchModalOpen(true)
  }

  const closeBatchModal = () => {
    setBatchWarning(null)
    setBatchModalOpen(false)
  }

  const applyBatchRules = () => {
    const nextRules = [...routingRules]
    const excludedDuplicateKeySet = new Set(excludedDuplicateKeys)
    const updatedAt = formatAuditDateTime(new Date())
    let createdCount = 0
    let overwrittenCount = 0

    batchCombinations.forEach((combination) => {
      const ruleKey = createRuleKey(activeFactors, combination)
      const ruleIndex = nextRules.findIndex(
        (rule) =>
          rule.status === 'Active' &&
          createRuleKey(activeFactors, createRuleValueMap(rule)) === ruleKey,
      )

      if (ruleIndex >= 0) {
        if (excludedDuplicateKeySet.has(ruleKey)) {
          return
        }

        nextRules[ruleIndex] = {
          ...nextRules[ruleIndex],
          status: 'Active',
          targetSkillQueueCode,
          updatedAt,
          updatedBy: auditActor,
        }
        overwrittenCount += 1
        return
      }

      const baseRuleCode = createRuleCode(ruleKey)
      const nextRule: RoutingRule = {
        conditions: activeFactors.map((factor) => ({
          factorCode: factor.factorCode,
          factorValueCode: combination[factor.factorCode] ?? '',
        })),
        effectiveFrom: '2026-06-02',
        factorSetVersion: 'BANK1-RF-2026-06',
        priority: defaultBatchPriority,
        ruleCode: createUniqueRuleCode(baseRuleCode, nextRules),
        status: 'Active',
        targetSkillQueueCode,
        updatedAt,
        updatedBy: auditActor,
      }

      nextRules.push(nextRule)
      createdCount += 1
    })

    if (createdCount === 0 && overwrittenCount === 0) {
      setBatchWarning('No routing rule changes selected.')
      return
    }

    setRoutingRules(nextRules)
    notify(
      overwrittenCount > 0
        ? `Batch rules applied. ${createdCount} new rule(s), ${overwrittenCount} duplicate rule(s) overwritten.`
        : `Batch rules applied. ${createdCount} new rule(s) created.`,
    )
    closeBatchModal()
  }

  const handleRuleSearch = () => {
    setFactorFilters(factorFilterDrafts)
    setTargetQueueFilter(targetQueueFilterDraft)
    setRuleStatusFilter(ruleStatusFilterDraft)
  }

  const handleRuleReset = () => {
    setFactorFilters({})
    setFactorFilterDrafts({})
    setTargetQueueFilter('ALL')
    setTargetQueueFilterDraft('ALL')
    setRuleStatusFilter('ALL')
    setRuleStatusFilterDraft('ALL')
  }

  const openRuleModal = (mode: RuleModalMode, rule: RoutingRule) => {
    setSelectedRule(rule)
    setRuleDraft({
      status: rule.status,
      targetSkillQueueCode: rule.targetSkillQueueCode,
    })
    setModalMode(mode)
  }

  const closeRuleModal = () => {
    setModalMode(null)
    setSelectedRule(null)
  }

  const handleSaveRule = () => {
    if (!selectedRule) {
      return
    }

    setRoutingRules(
      routingRules.map((rule) =>
        rule.ruleCode === selectedRule.ruleCode
          ? {
              ...rule,
              status: ruleDraft.status,
              targetSkillQueueCode: ruleDraft.targetSkillQueueCode,
              updatedAt: formatAuditDateTime(new Date()),
              updatedBy: auditActor,
            }
          : rule,
      ),
    )
    notify('Routing rule updated locally for this demo session.')
    closeRuleModal()
  }

  const handleDeleteRule = () => {
    if (!selectedRule) {
      return
    }

    setRoutingRules(
      routingRules.filter((rule) => rule.ruleCode !== selectedRule.ruleCode),
    )
    notify('Routing rule deleted locally for this demo session.')
    closeRuleModal()
  }

  const ruleColumns: ColumnsType<RoutingRule> = [
    {
      dataIndex: 'ruleCode',
      title: 'Rule ID',
      width: 150,
      render: (ruleCode: string) => <strong>{ruleCode}</strong>,
    },
    ...activeFactors.map((factor) => ({
      key: factor.factorCode,
      title: factor.factorName,
      ellipsis: true,
      width: 108,
      render: (_: unknown, record: RoutingRule) => {
        const value = getConditionValue(record.conditions, factor.factorCode)
        const label = getFactorValueLabel(factor.factorCode, value)

        return (
          <span
            className="routing-config__table-factor-value"
            title={value}
          >
            {label}
          </span>
        )
      },
    })),
    {
      dataIndex: 'targetSkillQueueCode',
      title: 'Target Skill Queue',
      width: 160,
      render: renderSkillQueueValue,
    },
    {
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => formatAuditDateTime(updatedAt),
      title: 'Updated Time',
      width: 164,
    },
    {
      dataIndex: 'updatedBy',
      ellipsis: true,
      title: 'Updated By',
      width: 180,
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 96,
      render: renderRoutingStatus,
    },
    {
      title: 'Actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`View ${record.ruleCode}`}
            title="View"
            type="button"
            onClick={() => openRuleModal('view', record)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${record.ruleCode}`}
            title="Edit"
            type="button"
            onClick={() => openRuleModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.ruleCode}`}
            title="Delete"
            type="button"
            onClick={() => openRuleModal('delete', record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]

  const previewColumns: ColumnsType<RulePreviewRow> = [
    {
      key: 'selected',
      title: duplicatePreviewRows.length > 0 ? (
        <Checkbox
          aria-label="Select all duplicate routes"
          checked={
            duplicatePreviewRows.length > 0 &&
            duplicatePreviewRows.every(
              (duplicate) => !excludedDuplicateKeys.includes(duplicate.key),
            )
          }
          indeterminate={
            duplicatePreviewRows.some(
              (duplicate) => !excludedDuplicateKeys.includes(duplicate.key),
            ) &&
            duplicatePreviewRows.some((duplicate) =>
              excludedDuplicateKeys.includes(duplicate.key),
            )
          }
          onChange={(event) => updateAllDuplicateSelections(event.target.checked)}
        />
      ) : null,
      width: 34,
      render: (_, row) =>
        row.existingRule ? (
          <Checkbox
            checked={!excludedDuplicateKeys.includes(row.key)}
            aria-label={`Select duplicate ${row.key}`}
            onChange={(event) =>
              updateDuplicateSelection(row.key, event.target.checked)
            }
          />
        ) : null,
    },
    ...activeFactors.map((factor) => ({
      key: factor.factorCode,
      title: factor.factorName,
      ellipsis: true,
      width: 88,
      render: (_: unknown, row: RulePreviewRow) => (
        <span
          className="routing-config__duplicate-value"
          title={row.valueMap[factor.factorCode] ?? ''}
        >
          {getFactorValueLabel(
            factor.factorCode,
            row.valueMap[factor.factorCode] ?? '',
          )}
        </span>
      ),
    })),
    {
      key: 'originalSkillQueue',
      title: 'Original Skill Queue',
      ellipsis: true,
      width: 128,
      render: (_, row) =>
        row.existingRule
          ? renderSkillQueueValue(row.existingRule.targetSkillQueueCode)
          : null,
    },
    {
      key: 'targetSkillQueue',
      title: 'Target Skill Queue',
      ellipsis: true,
      width: 128,
      render: () => renderSkillQueueValue(targetSkillQueueCode),
    },
    {
      key: 'status',
      title: 'Status',
      width: 90,
      render: (_, row) => renderRoutingStatus(row.status),
    },
  ]

  const modalReadOnly = modalMode === 'view' || modalMode === 'delete'
  const modalTitle =
    modalMode === 'edit'
      ? 'Edit Skill Routing Rule'
      : modalMode === 'delete'
        ? 'Delete Skill Routing Rule'
        : 'View Skill Routing Rule'

  return (
    <AdminPage title="Skill Routing Rules">
      <section className="routing-config-page routing-config-rules">

        <BaseCard compact>
          <AdminToolbar
            className="routing-config-page__admin-toolbar--rules"
            filters={
              <>
                {activeFactors.map((factor) => (
                  <AdminFilterField
                    key={factor.factorCode}
                    label={factor.factorName}
                    width={180}
                  >
                    <Select
                      maxTagCount="responsive"
                      mode="multiple"
                      showSearch
                      optionFilterProp="label"
                      options={factorOptions(factor)}
                      value={factorFilterDrafts[factor.factorCode] ?? []}
                      onChange={(values) =>
                        setFactorFilterDrafts((currentDrafts) => ({
                          ...currentDrafts,
                          [factor.factorCode]: values,
                        }))
                      }
                    />
                  </AdminFilterField>
                ))}
                <AdminFilterField label="Target Skill Queue" width={180}>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={[
                      {
                        label: 'All',
                        value: 'ALL',
                      },
                      ...skillQueueOptions,
                    ]}
                    value={targetQueueFilterDraft}
                    onChange={setTargetQueueFilterDraft}
                  />
                </AdminFilterField>
                <AdminFilterField label="Status" width={180}>
                  <Select
                    options={[
                      {
                        label: 'All',
                        value: 'ALL',
                      },
                      ...ruleStatusFilterOptions,
                    ]}
                    value={ruleStatusFilterDraft}
                    onChange={setRuleStatusFilterDraft}
                  />
                </AdminFilterField>
                <div className="routing-config-page__admin-actions routing-config-page__admin-actions--rules-inline">
                  <BaseButton variant="primary" onClick={handleRuleSearch}>
                    Search
                  </BaseButton>
                  <BaseButton variant="secondary" onClick={handleRuleReset}>
                    Reset
                  </BaseButton>
                </div>
              </>
            }
            filtersClassName="routing-config-page__filters--rules"
            primaryActions={
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={openBatchModal}
              >
                Batch Add
              </BaseButton>
            }
          />
          <AdminTable<RoutingRule>
            columns={ruleColumns}
            dataSource={filteredRules}
            pagination={paginationConfig}
            rowKey="ruleCode"
            scroll={{ x: 1180 }}
            size="small"
          />
        </BaseCard>
      </section>

      <AdminModal
        className="routing-config-crud-modal"
        kind="detail"
        open={batchModalOpen}
        title="Batch Add Skill Routing Rules"
        width={980}
        onCancel={closeBatchModal}
      >
        <div className="routing-config-batch-modal">
          <section className="routing-config-batch-modal__section">
            <h3>Route Elements</h3>
            <div className="routing-config__batch-factor-list">
              {activeFactors.map((factor) => (
                <label
                  key={factor.factorCode}
                  className="routing-config__batch-factor-row"
                >
                  <span>{factor.factorName}</span>
                  <Select
                    maxTagCount="responsive"
                    mode="multiple"
                    options={factorOptions(factor)}
                    value={batchSelections[factor.factorCode] ?? []}
                    onChange={(values) =>
                      updateBatchSelection(factor.factorCode, values)
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="routing-config-batch-modal__section">
            <h3>Target Routing</h3>
            <label className="routing-config__batch-target-row">
              <span>Target Skill Queue</span>
              <Select
                options={skillQueueOptions}
                value={targetSkillQueueCode}
                onChange={setTargetSkillQueueCode}
              />
            </label>
          </section>

          <section className="routing-config-batch-modal__section">
            <h3>Duplicate Routing Rules</h3>
            {duplicatePreviewRows.length > 0 && (
              <p className="routing-config-batch-modal__hint">
                The following route combinations already exist. Selected rows
                will update the existing skill queue to the current target
                queue; unselected rows will remain unchanged.
              </p>
            )}
            <AdminTable<RulePreviewRow>
              className="routing-config__preview-table"
              columns={previewColumns}
              dataSource={duplicatePreviewRows}
              pagination={false}
              rowKey="key"
              scroll={{ y: 240 }}
              size="small"
            />
          </section>

          {batchWarning && (
            <div className="routing-config__batch-message">
              {batchWarning}
            </div>
          )}
        </div>
        <div className="routing-config-crud-modal__footer">
          <BaseButton
            variant="secondary"
            onClick={closeBatchModal}
          >
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={applyBatchRules}>
            Save
          </BaseButton>
        </div>
      </AdminModal>

      <AdminModal
        className="routing-config-crud-modal"
        kind="detail"
        open={Boolean(modalMode)}
        title={modalTitle}
        width={760}
        onCancel={closeRuleModal}
      >
        {modalMode === 'delete' ? (
          <div className="routing-config-crud-modal__delete">
            <Alert
              showIcon
              message={`Delete ${selectedRule?.ruleCode ?? ''}?`}
              type="warning"
              description="This removes the rule from the current demo session. Master data references are not affected."
            />
          </div>
        ) : (
          <div className="routing-config-rule-modal">
            <div className="routing-config-crud-modal__form routing-config-rule-modal__form">
              {activeFactors.map((factor) => (
                <label
                  key={factor.factorCode}
                  className="routing-config-crud-modal__field"
                >
                  <span>{factor.factorName}</span>
                  <em>
                    {selectedRule ? renderRuleFactorValue(selectedRule, factor) : ''}
                  </em>
                </label>
              ))}
              <label className="routing-config-crud-modal__field">
                <span>Target Skill Queue</span>
                {modalReadOnly ? (
                  <em>
                    {selectedRule
                      ? renderSkillQueueValue(selectedRule.targetSkillQueueCode)
                      : ''}
                  </em>
                ) : (
                  <Select
                    options={skillQueueOptions}
                    value={ruleDraft.targetSkillQueueCode}
                    onChange={(value) =>
                      setRuleDraft((currentDraft) => ({
                        ...currentDraft,
                        targetSkillQueueCode: value,
                      }))
                    }
                  />
                )}
              </label>
              <label className="routing-config-crud-modal__field">
                <span>Status</span>
                {modalReadOnly ? (
                  <em>
                    {selectedRule ? renderRoutingStatus(selectedRule.status) : ''}
                  </em>
                ) : (
                  <span className="routing-config-status-control">
                    <Switch
                      checked={ruleDraft.status !== 'Disabled'}
                      className="routing-config-status-switch"
                      size="small"
                      onChange={(checked) =>
                        setRuleDraft((currentDraft) => ({
                          ...currentDraft,
                          status: checked ? 'Active' : 'Disabled',
                        }))
                      }
                    />
                    <span className="routing-config-status-control__text">
                      {ruleDraft.status === 'Disabled'
                        ? 'Disabled'
                        : 'Enabled'}
                    </span>
                  </span>
                )}
              </label>
              <label className="routing-config-crud-modal__field">
                <span>Updated Time</span>
                <em>
                  {selectedRule?.updatedAt
                    ? formatAuditDateTime(selectedRule.updatedAt)
                    : ''}
                </em>
              </label>
              <label className="routing-config-crud-modal__field">
                <span>Updated By</span>
                <em>{selectedRule?.updatedBy ?? ''}</em>
              </label>
            </div>
          </div>
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeRuleModal}>
            {modalReadOnly ? 'Close' : 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && (
            <BaseButton variant="danger" onClick={handleDeleteRule}>
              Delete
            </BaseButton>
          )}
          {modalMode === 'edit' && (
            <BaseButton variant="primary" onClick={handleSaveRule}>
              Save
            </BaseButton>
          )}
        </div>
      </AdminModal>
    </AdminPage>
  )
}
