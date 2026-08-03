import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Alert, Input, Select, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminFormField,
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
} from '../../components'
import {
  useAuthStore,
  useCallManagementStore,
  useRoutingConfigStore,
} from '../../store'
import type { PriorityListEntry } from '../../types'

type PriorityListModalMode = 'batch' | null

interface PriorityListFilters {
  channels: string[]
  identifier: string
  matchRule: PriorityListEntry['matchRule'] | ''
}

interface PriorityListDraft {
  channels: string[]
  identifiers: string
  matchRule: PriorityListEntry['matchRule']
  reason: string
}

interface PriorityListDuplicateRow {
  channel: string
  existingNo: number
  identifier: string
  key: string
  matchRule: PriorityListEntry['matchRule']
}

const defaultFilters: PriorityListFilters = {
  channels: [],
  identifier: '',
  matchRule: '',
}

const defaultDraft: PriorityListDraft = {
  channels: [],
  identifiers: '',
  matchRule: 'exact_match',
  reason: '',
}

const matchRuleLabels: Record<PriorityListEntry['matchRule'], string> = {
  exact_match: 'Exact Match',
  partial_match: 'Partial Match',
}

const matchRuleOptions = Object.entries(matchRuleLabels).map(
  ([value, label]) => ({
    label,
    value,
  }),
)

const identifierTooltip = (
  <div className="priority-list-management__identifier-tooltip">
    <p>
      Enter customer identifiers for priority queue matching. Select one or
      more channels, then separate multiple identifiers with semicolons.
    </p>
    <p>
      The system saves one record per selected channel and identifier.
    </p>
    <p>
      Exact Match means the customer identifier must equal the configured
      value. Partial Match means the customer identifier contains the
      configured value.
    </p>
    <div className="priority-list-management__identifier-examples">
      <strong>Batch examples</strong>
      <span>Phone: 08129876543;08123456789;08122222222</span>
      <span>Social Media: Bank;Bank_1;Bank_2;Bank_3</span>
      <span>Email/Webchat: 123@gmail.com;@ojk.co.id;@bi.go.id</span>
    </div>
  </div>
)

function formatSavedTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function parseIdentifiers(value: string) {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase()
}

function getDuplicateKey(
  channel: string,
  identifier: string,
  matchRule: PriorityListEntry['matchRule'],
) {
  return `${channel.trim().toLowerCase()}::${normalizeIdentifier(identifier)}::${matchRule}`
}

function getUniqueIdentifiers(identifiers: string[]) {
  const seenIdentifiers = new Set<string>()

  return identifiers.filter((identifier) => {
    const normalizedIdentifier = normalizeIdentifier(identifier)

    if (seenIdentifiers.has(normalizedIdentifier)) {
      return false
    }

    seenIdentifiers.add(normalizedIdentifier)
    return true
  })
}

function getNextSequence(entries: PriorityListEntry[]) {
  return entries.reduce((maxSequence, entry) => {
    const match = /^PL(\d+)$/.exec(entry.id)

    return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
  }, 0)
}

export function PriorityListManagementPage() {
  const authSession = useAuthStore((state) => state.session)
  const priorityListEntries = useCallManagementStore(
    (state) => state.priorityListEntries,
  )
  const addPriorityListEntries = useCallManagementStore(
    (state) => state.addPriorityListEntries,
  )
  const deletePriorityListEntries = useCallManagementStore(
    (state) => state.deletePriorityListEntries,
  )
  const routingChannels = useRoutingConfigStore((state) => state.channels)
  const [appliedFilters, setAppliedFilters] =
    useState<PriorityListFilters>(defaultFilters)
  const [filterDraft, setFilterDraft] =
    useState<PriorityListFilters>(defaultFilters)
  const [draft, setDraft] = useState<PriorityListDraft>(defaultDraft)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [modalMode, setModalMode] = useState<PriorityListModalMode>(null)
  const [notice, setNotice] = useState('')
  const [saveWarning, setSaveWarning] = useState('')
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const selectedCount = selectedEntryIds.length
  const enabledChannelOptions = useMemo(() => {
    const channelNames = new Set<string>()

    return routingChannels
      .filter((channel) => channel.status === 'Active')
      .map((channel) => channel.channelName.trim())
      .filter((channelName) => {
        if (!channelName || channelNames.has(channelName)) {
          return false
        }

        channelNames.add(channelName)
        return true
      })
      .map((channelName) => ({
        label: channelName,
        value: channelName,
      }))
  }, [routingChannels])
  const channelFormOptions = useMemo(
    () => enabledChannelOptions,
    [enabledChannelOptions],
  )
  const filteredEntries = useMemo(
    () =>
      priorityListEntries.filter((entry) => {
        const identifierKeyword = appliedFilters.identifier
          .trim()
          .toLowerCase()
        const channelMatched =
          appliedFilters.channels.length === 0
            ? true
            : appliedFilters.channels.includes(entry.channel)
        const identifierMatched = identifierKeyword
          ? entry.identifier.toLowerCase().includes(identifierKeyword)
          : true
        const matchRuleMatched = appliedFilters.matchRule
          ? entry.matchRule === appliedFilters.matchRule
          : true

        return channelMatched && identifierMatched && matchRuleMatched
      }),
    [appliedFilters, priorityListEntries],
  )

  const parsedIdentifiers = useMemo(
    () => parseIdentifiers(draft.identifiers),
    [draft.identifiers],
  )

  const existingPriorityListKeys = useMemo(() => {
    const existingKeys = new Map<string, PriorityListDuplicateRow>()

    priorityListEntries.forEach((entry, index) => {
      const key = getDuplicateKey(
        entry.channel,
        entry.identifier,
        entry.matchRule,
      )

      existingKeys.set(key, {
        channel: entry.channel,
        existingNo: index + 1,
        identifier: entry.identifier,
        key,
        matchRule: entry.matchRule,
      })
    })

    return existingKeys
  }, [priorityListEntries])

  const duplicateRows = useMemo(() => {
    if (!modalMode || draft.channels.length === 0) {
      return []
    }

    return getUniqueIdentifiers(parsedIdentifiers).flatMap((identifier) => {
      return draft.channels.flatMap((channel) => {
        const key = getDuplicateKey(channel, identifier, draft.matchRule)
        const existingRecord = existingPriorityListKeys.get(key)

        return existingRecord
          ? [
              {
                channel,
                existingNo: existingRecord.existingNo,
                identifier,
                key,
                matchRule: draft.matchRule,
              },
            ]
          : []
      })
    })
  }, [
    draft.channels,
    draft.matchRule,
    existingPriorityListKeys,
    modalMode,
    parsedIdentifiers,
  ])

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []

    if (draft.channels.length === 0) {
      errors.push(
        'Channel is required. Please select at least one enabled channel.',
      )
    }

    if (!draft.identifiers.trim()) {
      errors.push('Identifier is required.')
    } else if (parsedIdentifiers.length === 0) {
      errors.push('At least one identifier is required.')
    }

    if (!draft.reason.trim()) {
      errors.push('Reason is required.')
    }

    return errors
  }, [
    draft.channels.length,
    draft.identifiers,
    draft.reason,
    modalMode,
    parsedIdentifiers.length,
  ])

  const updateDraft = <Key extends keyof PriorityListDraft>(
    key: Key,
    value: PriorityListDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
    setNotice('')
    setSaveWarning('')
  }

  const createDefaultDraft = (): PriorityListDraft => ({
    ...defaultDraft,
  })

  const openCreateModal = (mode: Exclude<PriorityListModalMode, null>) => {
    setDraft(createDefaultDraft())
    setModalMode(mode)
    setSubmitAttempted(false)
    setNotice('')
    setSaveWarning('')
  }

  const closeModal = () => {
    setDraft(createDefaultDraft())
    setModalMode(null)
    setSubmitAttempted(false)
    setSaveWarning('')
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
    setSelectedEntryIds([])
  }

  const handleReset = () => {
    setFilterDraft(defaultFilters)
    setAppliedFilters(defaultFilters)
    setSelectedEntryIds([])
  }

  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const uniqueIdentifiers = getUniqueIdentifiers(parsedIdentifiers)
    const baseSequence = getNextSequence(priorityListEntries)
    const createdAt = formatSavedTime(new Date())
    const createdBy = authSession?.displayName ?? 'Admin'
    const reason = draft.reason.trim()
    const nextEntries: PriorityListEntry[] = []

    uniqueIdentifiers.forEach((identifier) => {
      draft.channels.forEach((channel) => {
        const key = getDuplicateKey(channel, identifier, draft.matchRule)

        if (existingPriorityListKeys.has(key)) {
          return
        }

        nextEntries.push({
          channel,
          createdAt,
          createdBy,
          id: `PL${String(baseSequence + nextEntries.length + 1).padStart(
            3,
            '0',
          )}`,
          identifier,
          matchRule: draft.matchRule,
          reason,
        })
      })
    })

    if (nextEntries.length === 0) {
      setSaveWarning('All selected identifiers already exist.')
      return
    }

    addPriorityListEntries(nextEntries)
    setNotice(
      nextEntries.length === 1
        ? `Priority list record added.${
            duplicateRows.length > 0
              ? ` ${duplicateRows.length} duplicate record(s) skipped.`
              : ''
          }`
        : `${nextEntries.length} priority list records added.${
            duplicateRows.length > 0
              ? ` ${duplicateRows.length} duplicate record(s) skipped.`
              : ''
          }`,
    )
    closeModal()
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
  }

  const openDeleteConfirm = () => {
    if (selectedCount === 0) {
      return
    }

    setDeleteConfirmOpen(true)
    setNotice('')
  }

  const handleDeleteSelected = () => {
    const deletedCount = selectedEntryIds.length

    if (deletedCount === 0) {
      return
    }

    deletePriorityListEntries(selectedEntryIds)
    setSelectedEntryIds([])
    setDeleteConfirmOpen(false)
    setNotice(
      deletedCount === 1
        ? 'Selected priority list record deleted.'
        : `${deletedCount} selected priority list records deleted.`,
    )
  }

  const columns: ColumnsType<PriorityListEntry> = [
    {
      key: 'sequence',
      render: (_, record) =>
        filteredEntries.findIndex((entry) => entry.id === record.id) + 1,
      title: 'No.',
      width: 56,
    },
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 150,
    },
    {
      dataIndex: 'identifier',
      title: 'Identifier',
      width: 180,
    },
    {
      dataIndex: 'matchRule',
      render: (matchRule: PriorityListEntry['matchRule']) =>
        matchRuleLabels[matchRule],
      title: 'Match Rule',
      width: 150,
    },
    {
      dataIndex: 'reason',
      ellipsis: true,
      title: 'Reason',
      width: 320,
    },
    {
      dataIndex: 'createdAt',
      title: 'Created Date',
      width: 130,
    },
    {
      dataIndex: 'createdBy',
      title: 'Created By',
      width: 100,
    },
  ]

  return (
    <AdminPage className="priority-list-management" title="Priority List">
        {notice && (
          <Alert
            showIcon
            className="routing-config-page__notice"
            message={notice}
            type="success"
          />
        )}
        <BaseCard compact>
          <AdminToolbar
            actions={
              <>
                <BaseButton variant="primary" onClick={handleSearch}>
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </>
            }
            filters={
              <>
                <AdminFilterField label="Channel" width={220}>
                  <Select
                    allowClear
                    maxTagCount="responsive"
                    mode="multiple"
                    options={enabledChannelOptions}
                    placeholder="All Channels"
                    value={filterDraft.channels}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        channels: value,
                      }))
                    }
                  />
                </AdminFilterField>
                <AdminFilterField label="Identifier" width={220}>
                  <Input
                    placeholder="Identifier"
                    value={filterDraft.identifier}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        identifier: event.target.value,
                      }))
                    }
                  />
                </AdminFilterField>
                <AdminFilterField label="Match Rule" width={180}>
                  <Select
                    allowClear
                    options={matchRuleOptions}
                    placeholder="All Match Rules"
                    value={filterDraft.matchRule || undefined}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        matchRule: value ?? '',
                      }))
                    }
                  />
                </AdminFilterField>
              </>
            }
            primaryActions={
              <div className="call-management-list__add-actions">
                <BaseButton
                  icon={<PlusOutlined />}
                  variant="primary"
                  onClick={() => openCreateModal('batch')}
                >
                  Batch Add
                </BaseButton>
                <BaseButton
                  disabled={selectedCount === 0}
                  variant="danger"
                  onClick={openDeleteConfirm}
                >
                  {selectedCount > 0 ? `Delete (${selectedCount})` : 'Delete'}
                </BaseButton>
              </div>
            }
          />
          <AdminTable<PriorityListEntry>
            columns={columns}
            dataSource={filteredEntries}
            pagination={{}}
            rowSelection={{
              preserveSelectedRowKeys: true,
              selectedRowKeys: selectedEntryIds,
              onChange: (selectedRowKeys) =>
                setSelectedEntryIds(selectedRowKeys.map(String)),
            }}
            rowKey="id"
          />
        </BaseCard>
        <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title="Batch Add Priority List"
        width={720}
        onCancel={closeModal}
      >
        <div className="routing-config-crud-modal__sections">
          {submitAttempted && validationErrors.length > 0 && (
            <Alert
              showIcon
              className="routing-config-crud-modal__validation"
              description={
                <ul>
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              }
              message="Please fix the form."
              type="warning"
            />
          )}
          <div className="routing-config-crud-modal__form">
            <AdminFormField label="Channel" required>
              <Select
                maxTagCount="responsive"
                mode="multiple"
                options={channelFormOptions}
                placeholder="Select channels"
                value={draft.channels}
                onChange={(value) => updateDraft('channels', value)}
              />
            </AdminFormField>
            <AdminFormField
              className="routing-config-crud-modal__field--full call-management-list__number-field--batch"
              label={
                <span className="priority-list-management__identifier-label">
                  Identifier
                  <Tooltip title={identifierTooltip}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              required
            >
              <Input.TextArea
                rows={8}
                placeholder="Use semicolons for batch add"
                value={draft.identifiers}
                onChange={(event) =>
                  updateDraft('identifiers', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Match Rule" required>
              <Select
                options={matchRuleOptions}
                value={draft.matchRule}
                onChange={(value) => updateDraft('matchRule', value)}
              />
            </AdminFormField>
            <AdminFormField label="Reason" required fullWidth>
              <Input.TextArea
                rows={3}
                value={draft.reason}
                onChange={(event) => updateDraft('reason', event.target.value)}
              />
            </AdminFormField>
          </div>
          {saveWarning && (
            <Alert
              showIcon
              className="priority-list-management__save-warning"
              message={saveWarning}
              type="warning"
            />
          )}
          {duplicateRows.length > 0 && (
            <div className="priority-list-management__duplicate-panel">
              <Alert
                showIcon
                message="Duplicate records will be skipped automatically."
                type="info"
              />
              <div className="priority-list-management__duplicate-table">
                <strong>Channel</strong>
                <strong>Identifier</strong>
                <strong>Match Rule</strong>
                <strong>Existing No.</strong>
                {duplicateRows.map((row) => (
                  <div
                    className="priority-list-management__duplicate-row"
                    key={row.key}
                  >
                    <span>{row.channel}</span>
                    <span>{row.identifier}</span>
                    <span>{matchRuleLabels[row.matchRule]}</span>
                    <span>{row.existingNo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeModal}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={handleSave}>
            Save
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
      <AdminModal
        destroyOnClose
        open={deleteConfirmOpen}
        title="Delete Priority List Records"
        width={520}
        onCancel={closeDeleteConfirm}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes selected records in the current demo session."
            message={`Delete ${selectedCount} selected ${
              selectedCount === 1 ? 'record' : 'records'
            }?`}
            type="warning"
          />
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeDeleteConfirm}>
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={handleDeleteSelected}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
