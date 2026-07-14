import { PlusOutlined } from '@ant-design/icons'
import { Alert, Input, InputNumber, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
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
} from '../../types'

type BlacklistModalMode = 'batch' | 'single' | null

interface BlacklistFilters {
  channel: '' | BlacklistChannel
  restrictedNumber: string
  restrictionPolicy: '' | BlacklistRestrictionPolicy
}

interface BlacklistDraft {
  channel: BlacklistChannel
  remark: string
  restrictedNumbers: string
  restrictionPolicy: BlacklistRestrictionPolicy
  validityDays: number | null
}

const defaultFilters: BlacklistFilters = {
  channel: '',
  restrictedNumber: '',
  restrictionPolicy: '',
}

const defaultDraft: BlacklistDraft = {
  channel: '',
  remark: '',
  restrictedNumbers: '',
  restrictionPolicy: 'block-transfer-to-agent',
  validityDays: null,
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

function formatSavedTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function parseRestrictedNumbers(value: string) {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
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
  const routingChannels = useRoutingConfigStore((state) => state.channels)
  const [appliedFilters, setAppliedFilters] =
    useState<BlacklistFilters>(defaultFilters)
  const [filterDraft, setFilterDraft] =
    useState<BlacklistFilters>(defaultFilters)
  const [draft, setDraft] = useState<BlacklistDraft>(defaultDraft)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [modalMode, setModalMode] = useState<BlacklistModalMode>(null)
  const [notice, setNotice] = useState('')
  const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const isBatchMode = modalMode === 'batch'
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
  const channelFilterOptions = useMemo(
    () => [{ label: 'All', value: '' }, ...enabledChannelOptions],
    [enabledChannelOptions],
  )
  const channelFormOptions = useMemo(
    () => enabledChannelOptions,
    [enabledChannelOptions],
  )
  const filteredEntries = useMemo(
    () =>
      blacklistEntries.filter((entry) => {
        const numberKeyword = appliedFilters.restrictedNumber
          .trim()
          .toLowerCase()
        const channelMatched = appliedFilters.channel
          ? entry.channel === appliedFilters.channel
          : true
        const numberMatched = numberKeyword
          ? entry.restrictedNumber.toLowerCase().includes(numberKeyword)
          : true
        const policyMatched = appliedFilters.restrictionPolicy
          ? entry.restrictionPolicy === appliedFilters.restrictionPolicy
          : true

        return channelMatched && numberMatched && policyMatched
      }),
    [appliedFilters, blacklistEntries],
  )

  const parsedNumbers = useMemo(
    () => parseRestrictedNumbers(draft.restrictedNumbers),
    [draft.restrictedNumbers],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []

    if (!draft.channel) {
      errors.push('Channel is required. Please enable a channel first.')
    }

    if (!draft.restrictedNumbers.trim()) {
      errors.push('Restricted Number is required.')
    } else if (parsedNumbers.length === 0) {
      errors.push('At least one restricted number is required.')
    }

    return errors
  }, [draft.channel, draft.restrictedNumbers, modalMode, parsedNumbers.length])

  const updateDraft = <Key extends keyof BlacklistDraft>(
    key: Key,
    value: BlacklistDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
    setNotice('')
  }

  const createDefaultDraft = (): BlacklistDraft => ({
    ...defaultDraft,
    channel: enabledChannelOptions[0]?.value ?? '',
  })

  const openCreateModal = (mode: Exclude<BlacklistModalMode, null>) => {
    setDraft(createDefaultDraft())
    setModalMode(mode)
    setSubmitAttempted(false)
    setNotice('')
  }

  const closeModal = () => {
    setDraft(createDefaultDraft())
    setModalMode(null)
    setSubmitAttempted(false)
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

    const uniqueNumbers = Array.from(new Set(parsedNumbers))
    const baseSequence = getNextSequence(blacklistEntries)
    const createdAt = formatSavedTime(new Date())
    const createdBy = authSession?.displayName ?? 'Admin'
    const remark = draft.remark.trim()
    const nextEntries: BlacklistEntry[] = uniqueNumbers.map(
      (restrictedNumber, index) => ({
        channel: draft.channel,
        createdAt,
        createdBy,
        id: `BL${String(baseSequence + index + 1).padStart(3, '0')}`,
        remark,
        restrictedNumber,
        restrictionPolicy: draft.restrictionPolicy,
        validityDays: draft.validityDays,
      }),
    )

    addBlacklistEntries(nextEntries)
    setNotice(
      nextEntries.length === 1
        ? 'Blacklist number added.'
        : `${nextEntries.length} blacklist numbers added.`,
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
      dataIndex: 'restrictedNumber',
      title: 'Restricted Number',
      width: 140,
    },
    {
      dataIndex: 'restrictionPolicy',
      render: (value: BlacklistRestrictionPolicy) =>
        restrictionPolicyLabels[value],
      title: 'Restriction Policy',
      width: 156,
    },
    {
      dataIndex: 'validityDays',
      render: (value: number | null) => value ?? 'Permanent',
      title: 'Validity Days',
      width: 104,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 230,
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
                <AdminFilterField label="Restricted Number" width={240}>
                  <Input
                    placeholder="Restricted number"
                    value={filterDraft.restrictedNumber}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        restrictedNumber: event.target.value,
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
              </>
            }
            primaryActions={
              <div className="call-management-list__add-actions">
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={() => openCreateModal('single')}
              >
                Add
              </BaseButton>
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
        title={isBatchMode ? 'Batch Add Blacklist' : 'Add Blacklist'}
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
            <label className="routing-config-crud-modal__field">
              <span>Channel</span>
              <Select
                options={channelFormOptions}
                value={draft.channel}
                onChange={(value) => updateDraft('channel', value)}
              />
            </label>
            <label className="routing-config-crud-modal__field">
              <span>Restriction Policy</span>
              <Select
                options={formRestrictionPolicyOptions}
                value={draft.restrictionPolicy}
                onChange={(value) => updateDraft('restrictionPolicy', value)}
              />
            </label>
            <label
              className={[
                'routing-config-crud-modal__field',
                isBatchMode
                  ? 'routing-config-crud-modal__field--full call-management-list__number-field--batch'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>
                Restricted Number <strong>*</strong>
              </span>
              {isBatchMode ? (
                <Input.TextArea
                  rows={8}
                  placeholder="Use semicolons for batch add"
                  value={draft.restrictedNumbers}
                  onChange={(event) =>
                    updateDraft('restrictedNumbers', event.target.value)
                  }
                />
              ) : (
                <Input
                  placeholder="Restricted number"
                  value={draft.restrictedNumbers}
                  onChange={(event) =>
                    updateDraft('restrictedNumbers', event.target.value)
                  }
                />
              )}
            </label>
            <label className="routing-config-crud-modal__field">
              <span>Validity Days</span>
              <InputNumber
                min={1}
                placeholder="Permanent if blank"
                value={draft.validityDays ?? undefined}
                onChange={(value) =>
                  updateDraft('validityDays', value ?? null)
                }
              />
              <small>Leave blank for permanent validity.</small>
            </label>
            <label className="routing-config-crud-modal__field routing-config-crud-modal__field--full">
              <span>Remark</span>
              <Input.TextArea
                rows={3}
                value={draft.remark}
                onChange={(event) => updateDraft('remark', event.target.value)}
              />
            </label>
          </div>
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
