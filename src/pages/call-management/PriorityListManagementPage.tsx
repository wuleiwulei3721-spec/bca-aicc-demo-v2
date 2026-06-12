import { PlusOutlined } from '@ant-design/icons'
import { Alert, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  BaseButton,
  BaseCard,
  BaseModal,
  BaseTable,
  PageContainer,
} from '../../components'
import {
  useAuthStore,
  useCallManagementStore,
  useRoutingConfigStore,
} from '../../store'
import type { PriorityListEntry } from '../../types'

type PriorityListModalMode = 'batch' | 'single' | null

interface PriorityListFilters {
  channel: string
  priorityNumber: string
}

interface PriorityListDraft {
  channel: string
  priorityNumbers: string
  remark: string
}

const defaultFilters: PriorityListFilters = {
  channel: '',
  priorityNumber: '',
}

const defaultDraft: PriorityListDraft = {
  channel: '',
  priorityNumbers: '',
  remark: '',
}

function formatSavedTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function parsePriorityNumbers(value: string) {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
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
      priorityListEntries.filter((entry) => {
        const numberKeyword = appliedFilters.priorityNumber
          .trim()
          .toLowerCase()
        const channelMatched = appliedFilters.channel
          ? entry.channel === appliedFilters.channel
          : true
        const numberMatched = numberKeyword
          ? entry.priorityNumber.toLowerCase().includes(numberKeyword)
          : true

        return channelMatched && numberMatched
      }),
    [appliedFilters, priorityListEntries],
  )

  const parsedNumbers = useMemo(
    () => parsePriorityNumbers(draft.priorityNumbers),
    [draft.priorityNumbers],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []

    if (!draft.channel) {
      errors.push('Channel is required. Please enable a channel first.')
    }

    if (!draft.priorityNumbers.trim()) {
      errors.push('Priority Number is required.')
    } else if (parsedNumbers.length === 0) {
      errors.push('At least one priority number is required.')
    }

    return errors
  }, [draft.channel, draft.priorityNumbers, modalMode, parsedNumbers.length])

  const updateDraft = <Key extends keyof PriorityListDraft>(
    key: Key,
    value: PriorityListDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
    setNotice('')
  }

  const createDefaultDraft = (): PriorityListDraft => ({
    ...defaultDraft,
    channel: enabledChannelOptions[0]?.value ?? '',
  })

  const openCreateModal = (mode: Exclude<PriorityListModalMode, null>) => {
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
    const baseSequence = getNextSequence(priorityListEntries)
    const createdAt = formatSavedTime(new Date())
    const createdBy = authSession?.displayName ?? 'Admin'
    const remark = draft.remark.trim()
    const nextEntries: PriorityListEntry[] = uniqueNumbers.map(
      (priorityNumber, index) => ({
        channel: draft.channel,
        createdAt,
        createdBy,
        id: `PL${String(baseSequence + index + 1).padStart(3, '0')}`,
        priorityNumber,
        remark,
      }),
    )

    addPriorityListEntries(nextEntries)
    setNotice(
      nextEntries.length === 1
        ? 'Priority number added.'
        : `${nextEntries.length} priority numbers added.`,
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
      width: 76,
    },
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 150,
    },
    {
      dataIndex: 'priorityNumber',
      title: 'Priority Number',
      width: 180,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 360,
    },
    {
      dataIndex: 'createdAt',
      title: 'Created Date',
      width: 160,
    },
    {
      dataIndex: 'createdBy',
      title: 'Created By',
      width: 130,
    },
  ]

  return (
    <PageContainer title="Priority List Management">
      <section className="routing-config-page priority-list-management">
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
                  style={{ width: 180 }}
                >
                  <span>Channel</span>
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
                </label>
                <label
                  className="routing-config-page__filter"
                  style={{ width: 220 }}
                >
                  <span>Priority Number</span>
                  <Input
                    placeholder="Priority number"
                    value={filterDraft.priorityNumber}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        priorityNumber: event.target.value,
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
            <div className="routing-config-page__add-action call-management-list__add-actions">
              <BaseButton
                icon={<PlusOutlined />}
                variant="secondary"
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
          </div>
          <BaseTable<PriorityListEntry>
            columns={columns}
            dataSource={filteredEntries}
            pagination={{
              defaultPageSize: 20,
              pageSizeOptions: [10, 20, 50, 100],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} records`,
            }}
            rowSelection={{
              preserveSelectedRowKeys: true,
              selectedRowKeys: selectedEntryIds,
              onChange: (selectedRowKeys) =>
                setSelectedEntryIds(selectedRowKeys.map(String)),
            }}
            rowKey="id"
            scroll={{ x: 1060 }}
            size="small"
          />
        </BaseCard>
      </section>
      <BaseModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
        open={Boolean(modalMode)}
        title={isBatchMode ? 'Batch Add Priority List' : 'Add Priority List'}
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
            <label className="routing-config-crud-modal__field">
              <span>Channel</span>
              <Select
                options={channelFormOptions}
                value={draft.channel}
                onChange={(value) => updateDraft('channel', value)}
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
                Priority Number <strong>*</strong>
              </span>
              {isBatchMode ? (
                <Input.TextArea
                  rows={6}
                  placeholder="Use semicolons for batch add"
                  value={draft.priorityNumbers}
                  onChange={(event) =>
                    updateDraft('priorityNumbers', event.target.value)
                  }
                />
              ) : (
                <Input
                  placeholder="Priority number"
                  value={draft.priorityNumbers}
                  onChange={(event) =>
                    updateDraft('priorityNumbers', event.target.value)
                  }
                />
              )}
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
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={handleSave}>
            Save
          </BaseButton>
        </div>
      </BaseModal>
      <BaseModal
        className="routing-config-crud-modal"
        destroyOnClose
        kind="detail"
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
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeDeleteConfirm}>
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={handleDeleteSelected}>
            Delete
          </BaseButton>
        </div>
      </BaseModal>
    </PageContainer>
  )
}
