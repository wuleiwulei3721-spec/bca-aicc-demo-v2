import { PlusOutlined } from '@ant-design/icons'
import { Alert, Input, Select, Switch } from 'antd'
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
import type {
  BlacklistChannel,
  BlacklistEntry,
  BlacklistRestrictionPolicy,
  BlacklistStatus,
} from '../../types'

type BlacklistModalMode = 'batch' | null

interface BlacklistFilters {
  channel: '' | BlacklistChannel
  identifier: string
  restrictionPolicy: '' | BlacklistRestrictionPolicy
  status: '' | BlacklistStatus
}

interface BlacklistDraft {
  channels: BlacklistChannel[]
  countryCode: string
  identifiers: string
  phoneNumbers: string
  reason: string
  restrictionPolicy: BlacklistRestrictionPolicy
  status: BlacklistStatus
}

interface BlacklistDuplicateRow {
  channel: string
  countryCode: string
  existingNo: number
  identifier: string
  key: string
  restrictionPolicy: BlacklistRestrictionPolicy
  status: BlacklistStatus
}

const defaultFilters: BlacklistFilters = {
  channel: '',
  identifier: '',
  restrictionPolicy: '',
  status: '',
}

const defaultDraft: BlacklistDraft = {
  channels: [],
  countryCode: '062',
  identifiers: '',
  phoneNumbers: '',
  reason: '',
  restrictionPolicy: 'block-transfer-to-agent',
  status: 'Active',
}

const restrictionPolicyLabels: Record<BlacklistRestrictionPolicy, string> = {
  'block-access': 'Prohibit Access',
  'block-transfer-to-agent': 'Prohibit Transfer to Agent',
}

const restrictionPolicyOptions: Array<{
  label: string
  value: '' | BlacklistRestrictionPolicy
}> = [
  { label: 'All', value: '' },
  ...Object.entries(restrictionPolicyLabels).map(([value, label]) => ({
    label,
    value: value as BlacklistRestrictionPolicy,
  })),
]

const formRestrictionPolicyOptions = Object.entries(restrictionPolicyLabels).map(
  ([value, label]) => ({
    label,
    value: value as BlacklistRestrictionPolicy,
  }),
)

const blacklistStatusOptions: Array<{
  label: string
  value: '' | BlacklistStatus
}> = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

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

function getDuplicateKey(
  channel: string,
  countryCode: string,
  identifier: string,
  restrictionPolicy: BlacklistRestrictionPolicy,
) {
  const normalizedChannel = channel.trim().toLowerCase()
  const normalizedIdentifier = normalizeIdentifier(identifier)

  return normalizedChannel === 'phone'
    ? `${normalizedChannel}::${normalizeIdentifier(countryCode)}::${normalizedIdentifier}::${restrictionPolicy}`
    : `${normalizedChannel}::${normalizedIdentifier}`
}

function getIdentifierDisplay(entry: BlacklistEntry) {
  return entry.identifier
}

function getNextSequence(entries: BlacklistEntry[]) {
  return entries.reduce((maxSequence, entry) => {
    const match = /^BL(\d+)$/.exec(entry.id)

    return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
  }, 0)
}

export function BlacklistManagementPage() {
  const authSession = useAuthStore((state) => state.session)
  const blacklistEntries = useCallManagementStore(
    (state) => state.blacklistEntries,
  )
  const addBlacklistEntries = useCallManagementStore(
    (state) => state.addBlacklistEntries,
  )
  const deleteBlacklistEntries = useCallManagementStore(
    (state) => state.deleteBlacklistEntries,
  )
  const updateBlacklistEntryStatus = useCallManagementStore(
    (state) => state.updateBlacklistEntryStatus,
  )
  const routingChannels = useRoutingConfigStore((state) => state.channels)
  const [appliedFilters, setAppliedFilters] =
    useState<BlacklistFilters>(defaultFilters)
  const [filterDraft, setFilterDraft] =
    useState<BlacklistFilters>(defaultFilters)
  const [draft, setDraft] = useState<BlacklistDraft>(defaultDraft)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [modalMode, setModalMode] = useState<BlacklistModalMode>(null)
  const [notice, setNotice] = useState('')
  const [saveWarning, setSaveWarning] = useState('')
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const selectedCount = selectedEntryIds.length
  const isPhoneMode = draft.channels.includes('Phone')
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
  const channelFilterOptions = useMemo(
    () => [{ label: 'All', value: '' }, ...enabledChannelOptions],
    [enabledChannelOptions],
  )
  const channelFormOptions = useMemo(
    () =>
      enabledChannelOptions.map((option) => ({
        ...option,
        disabled:
          option.value === 'Phone'
            ? draft.channels.length > 0 && !isPhoneMode
            : isPhoneMode,
      })),
    [draft.channels.length, enabledChannelOptions, isPhoneMode],
  )
  const filteredEntries = useMemo(
    () =>
      blacklistEntries.filter((entry) => {
        const identifierKeyword = appliedFilters.identifier
          .trim()
          .toLowerCase()
        const channelMatched = appliedFilters.channel
          ? entry.channel === appliedFilters.channel
          : true
        const identifierMatched = identifierKeyword
          ? getIdentifierDisplay(entry).toLowerCase().includes(identifierKeyword)
          : true
        const policyMatched = appliedFilters.restrictionPolicy
          ? entry.restrictionPolicy === appliedFilters.restrictionPolicy
          : true
        const statusMatched = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true

        return (
          channelMatched &&
          identifierMatched &&
          policyMatched &&
          statusMatched
        )
      }),
    [appliedFilters, blacklistEntries],
  )

  const parsedIdentifiers = useMemo(
    () => parseIdentifiers(isPhoneMode ? draft.phoneNumbers : draft.identifiers),
    [draft.identifiers, draft.phoneNumbers, isPhoneMode],
  )

  const existingBlacklistKeys = useMemo(() => {
    const existingKeys = new Map<string, BlacklistDuplicateRow>()

    blacklistEntries.forEach((entry, index) => {
      const key = getDuplicateKey(
        entry.channel,
        entry.countryCode ?? '',
        entry.identifier,
        entry.restrictionPolicy,
      )

      existingKeys.set(key, {
        channel: entry.channel,
        countryCode: entry.channel === 'Phone' ? entry.countryCode || '-' : '-',
        existingNo: index + 1,
        identifier: entry.identifier,
        key,
        restrictionPolicy: entry.restrictionPolicy,
        status: entry.status,
      })
    })

    return existingKeys
  }, [blacklistEntries])

  const duplicateRows = useMemo(() => {
    if (!modalMode || draft.channels.length === 0) {
      return []
    }

    const countryCode = isPhoneMode ? draft.countryCode.trim() : ''
    const restrictionPolicy = isPhoneMode
      ? draft.restrictionPolicy
      : 'block-transfer-to-agent'

    return getUniqueIdentifiers(parsedIdentifiers).flatMap((identifier) =>
      draft.channels.flatMap((channel) => {
        const key = getDuplicateKey(
          channel,
          countryCode,
          identifier,
          restrictionPolicy,
        )
        const existingRecord = existingBlacklistKeys.get(key)

        return existingRecord
          ? [
              {
                channel,
                countryCode: isPhoneMode ? countryCode || '-' : '-',
                existingNo: existingRecord.existingNo,
                identifier,
                key,
                restrictionPolicy,
                status: existingRecord.status,
              },
            ]
          : []
      }),
    )
  }, [
    draft.channels,
    draft.countryCode,
    draft.restrictionPolicy,
    existingBlacklistKeys,
    isPhoneMode,
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

    if (isPhoneMode && !draft.countryCode.trim()) {
      errors.push('Country Code is required.')
    }

    const identifierValue = isPhoneMode
      ? draft.phoneNumbers
      : draft.identifiers

    if (!identifierValue.trim()) {
      errors.push(isPhoneMode ? 'Phone Number is required.' : 'Identifier is required.')
    } else if (parsedIdentifiers.length === 0) {
      errors.push(
        isPhoneMode
          ? 'At least one phone number is required.'
          : 'At least one identifier is required.',
      )
    }

    if (!draft.reason.trim()) {
      errors.push('Reason is required.')
    }

    return errors
  }, [
    draft.channels.length,
    draft.countryCode,
    draft.identifiers,
    draft.phoneNumbers,
    draft.reason,
    isPhoneMode,
    modalMode,
    parsedIdentifiers.length,
  ])

  const updateDraft = <Key extends keyof BlacklistDraft>(
    key: Key,
    value: BlacklistDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
    setNotice('')
    setSaveWarning('')
  }

  const handleChannelChange = (channels: BlacklistChannel[]) => {
    const nextIsPhoneMode = channels.includes('Phone')

    setDraft((currentDraft) => ({
      ...currentDraft,
      channels,
      restrictionPolicy: nextIsPhoneMode
        ? currentDraft.restrictionPolicy
        : 'block-transfer-to-agent',
    }))
    setNotice('')
    setSaveWarning('')
  }

  const createDefaultDraft = (): BlacklistDraft => ({ ...defaultDraft })

  const openCreateModal = () => {
    setDraft(createDefaultDraft())
    setModalMode('batch')
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

    const uniqueChannels = Array.from(new Set(draft.channels))
    const uniqueIdentifiers = getUniqueIdentifiers(parsedIdentifiers)
    const baseSequence = getNextSequence(blacklistEntries)
    const createdAt = formatSavedTime(new Date())
    const createdBy = authSession?.displayName ?? 'Admin'
    const countryCode = draft.countryCode.trim()
    const reason = draft.reason.trim()
    const restrictionPolicy = isPhoneMode
      ? draft.restrictionPolicy
      : 'block-transfer-to-agent'
    const nextEntries: BlacklistEntry[] = []

    uniqueChannels.forEach((channel) => {
      uniqueIdentifiers.forEach((identifier) => {
        const key = getDuplicateKey(
          channel,
          countryCode,
          identifier,
          restrictionPolicy,
        )

        if (existingBlacklistKeys.has(key)) {
          return
        }

        nextEntries.push({
          channel,
          countryCode: isPhoneMode ? countryCode : undefined,
          createdAt,
          createdBy,
          id: `BL${String(baseSequence + nextEntries.length + 1).padStart(
            3,
            '0',
          )}`,
          identifier,
          phoneNumber: isPhoneMode ? identifier : undefined,
          reason,
          restrictionPolicy,
          status: draft.status,
        })
      })
    })

    if (nextEntries.length === 0) {
      setSaveWarning('All selected identifiers already exist.')
      return
    }

    addBlacklistEntries(nextEntries)
    setNotice(
      nextEntries.length === 1
        ? `Blacklist identifier added.${
            duplicateRows.length > 0
              ? ` ${duplicateRows.length} duplicate record(s) skipped.`
              : ''
          }`
        : `${nextEntries.length} blacklist identifiers added.${
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

    deleteBlacklistEntries(selectedEntryIds)
    setSelectedEntryIds([])
    setDeleteConfirmOpen(false)
    setNotice(
      deletedCount === 1
        ? 'Selected blacklist record deleted.'
        : `${deletedCount} selected blacklist records deleted.`,
    )
  }

  const handleStatusChange = (entry: BlacklistEntry, enabled: boolean) => {
    const nextStatus: BlacklistStatus = enabled ? 'Active' : 'Disabled'

    updateBlacklistEntryStatus(entry.id, nextStatus)
    setNotice(
      `Blacklist record ${nextStatus === 'Active' ? 'enabled' : 'disabled'}.`,
    )
  }

  const columns: ColumnsType<BlacklistEntry> = [
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
      width: 112,
    },
    {
      dataIndex: 'countryCode',
      render: (countryCode: string | undefined, entry) =>
        entry.channel === 'Phone' ? countryCode || '-' : '-',
      title: 'Country Code',
      width: 108,
    },
    {
      dataIndex: 'identifier',
      render: (_, entry) => getIdentifierDisplay(entry),
      title: 'Identifier',
      width: 168,
    },
    {
      dataIndex: 'restrictionPolicy',
      render: (value: BlacklistRestrictionPolicy) =>
        restrictionPolicyLabels[value],
      title: 'Restriction Policy',
      width: 156,
    },
    {
      dataIndex: 'reason',
      ellipsis: true,
      title: 'Reason',
      width: 230,
    },
    {
      dataIndex: 'status',
      render: (status: BlacklistStatus, entry) => (
        <span className="routing-config-status-control">
          <Switch
            checked={status === 'Active'}
            className="routing-config-status-switch"
            size="small"
            onChange={(enabled) => handleStatusChange(entry, enabled)}
          />
          <span className="routing-config-status-control__text">
            {status === 'Active' ? 'Enabled' : 'Disabled'}
          </span>
        </span>
      ),
      title: 'Status',
      width: 150,
    },
    {
      dataIndex: 'createdAt',
      title: 'Created Date',
      width: 124,
    },
    {
      dataIndex: 'createdBy',
      title: 'Created By',
      width: 100,
    },
  ]

  return (
    <AdminPage className="blacklist-management" title="Blacklist">
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
                <AdminFilterField label="Channel" width={200}>
                  <Select
                    options={channelFilterOptions}
                    value={filterDraft.channel}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        channel: value,
                      }))
                    }
                  />
                </AdminFilterField>
                <AdminFilterField label="Identifier" width={240}>
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
                <AdminFilterField label="Restriction Policy" width={220}>
                  <Select
                    options={restrictionPolicyOptions}
                    value={filterDraft.restrictionPolicy}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        restrictionPolicy: value,
                      }))
                    }
                  />
                </AdminFilterField>
                <AdminFilterField label="Status" width={160}>
                  <Select
                    options={blacklistStatusOptions}
                    value={filterDraft.status}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        status: value,
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
                onClick={openCreateModal}
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
          <AdminTable<BlacklistEntry>
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
        title="Batch Add Blacklist"
        width={760}
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
                aria-required
                maxTagCount="responsive"
                mode="multiple"
                options={channelFormOptions}
                placeholder="Select channels"
                value={draft.channels}
                onChange={handleChannelChange}
              />
            </AdminFormField>
            <label className="routing-config-crud-modal__field">
              <span>Restriction Policy</span>
              <Select
                disabled={!isPhoneMode}
                options={formRestrictionPolicyOptions}
                value={
                  isPhoneMode
                    ? draft.restrictionPolicy
                    : 'block-transfer-to-agent'
                }
                onChange={(value) => updateDraft('restrictionPolicy', value)}
              />
            </label>
            <AdminFormField label="Status">
              <span className="busy-reason-config__switch-row">
                <Switch
                  checked={draft.status === 'Active'}
                  size="small"
                  onChange={(enabled) =>
                    updateDraft('status', enabled ? 'Active' : 'Disabled')
                  }
                />
                <em>{draft.status === 'Active' ? 'Enabled' : 'Disabled'}</em>
              </span>
            </AdminFormField>
            {isPhoneMode ? (
              <>
                <AdminFormField label="Country Code" required>
                  <Input
                    aria-required
                    placeholder="Country code"
                    value={draft.countryCode}
                    onChange={(event) =>
                      updateDraft('countryCode', event.target.value)
                    }
                  />
                </AdminFormField>
                <AdminFormField
                  className="routing-config-crud-modal__field--full call-management-list__number-field--batch"
                  label="Phone Number"
                  required
                >
                  <Input.TextArea
                    aria-required
                    rows={8}
                    placeholder="Use semicolons for batch add"
                    value={draft.phoneNumbers}
                    onChange={(event) =>
                      updateDraft('phoneNumbers', event.target.value)
                    }
                  />
                </AdminFormField>
              </>
            ) : (
              <AdminFormField
                className="routing-config-crud-modal__field--full call-management-list__number-field--batch"
                label="Identifier"
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
            )}
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
              className="blacklist-management__save-warning"
              message={saveWarning}
              type="warning"
            />
          )}
          {duplicateRows.length > 0 && (
            <div className="blacklist-management__duplicate-panel">
              <Alert
                showIcon
                message="Duplicate records will be skipped automatically."
                type="info"
              />
              <div className="blacklist-management__duplicate-table">
                <strong>Channel</strong>
                <strong>Country Code</strong>
                <strong>Identifier</strong>
                <strong>Restriction Policy</strong>
                <strong>Status</strong>
                <strong>Existing No.</strong>
                {duplicateRows.map((row) => (
                  <div className="blacklist-management__duplicate-row" key={row.key}>
                    <span>{row.channel}</span>
                    <span>{row.countryCode}</span>
                    <span>{row.identifier}</span>
                    <span>{restrictionPolicyLabels[row.restrictionPolicy]}</span>
                    <span>{row.status === 'Active' ? 'Enabled' : 'Disabled'}</span>
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
        title="Delete Blacklist Records"
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
