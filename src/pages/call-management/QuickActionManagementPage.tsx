import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
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
  StatusBadge,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useCallManagementStore } from '../../store'
import type {
  QuickActionEntry,
  QuickActionReorderDirection,
  QuickActionStatus,
} from '../../types'

type QuickActionModalMode = 'create' | 'edit' | null

interface QuickActionFilters {
  actionName: string
  status: '' | QuickActionStatus
}

interface QuickActionDraft {
  actionName: string
  id?: string
  linkAddress: string
  remark: string
  status: QuickActionStatus
  updatedAt?: string
  updatedBy?: string
}

const defaultFilters: QuickActionFilters = {
  actionName: '',
  status: '',
}

const defaultDraft: QuickActionDraft = {
  actionName: '',
  linkAddress: '',
  remark: '',
  status: 'Active',
}

const statusOptions: Array<{
  label: string
  value: '' | QuickActionStatus
}> = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function getNextQuickActionId(entries: QuickActionEntry[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^QA(\d+)$/.exec(entry.id)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 0) + 1

  return `QA${String(nextSequence).padStart(3, '0')}`
}

function formatDateTime(value?: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const pad = (part: number) => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function renderStatusBadge(status: QuickActionStatus) {
  return (
    <StatusBadge
      dot
      label={status === 'Active' ? 'Enabled' : 'Disabled'}
      size="small"
      status={status === 'Active' ? 'success' : 'disabled'}
    />
  )
}

export function QuickActionManagementPage() {
  const entries = useCallManagementStore((state) => state.quickActionEntries)
  const addEntry = useCallManagementStore((state) => state.addQuickActionEntry)
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteQuickActionEntries,
  )
  const moveEntry = useCallManagementStore(
    (state) => state.moveQuickActionEntry,
  )
  const updateEntry = useCallManagementStore(
    (state) => state.updateQuickActionEntry,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<QuickActionFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] = useState<QuickActionEntry | null>(
    null,
  )
  const [draft, setDraft] = useState<QuickActionDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<QuickActionFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<QuickActionModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const auditActor = 'Admin'

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      ),
    [entries],
  )

  const filteredEntries = useMemo(
    () =>
      sortedEntries.filter((entry) => {
        const actionKeyword = normalizeValue(appliedFilters.actionName)
        const actionMatched = actionKeyword
          ? entry.actionName.toLowerCase().includes(actionKeyword)
          : true
        const statusMatched = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true

        return actionMatched && statusMatched
      }),
    [appliedFilters, sortedEntries],
  )

  const reorderLocked = Boolean(
    appliedFilters.actionName || appliedFilters.status,
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedName = normalizeValue(draft.actionName)
    const normalizedLink = normalizeValue(draft.linkAddress)

    if (!normalizedName) {
      errors.push('Action Name is required.')
    }

    if (!normalizedLink) {
      errors.push('Link Address is required.')
    } else if (!isValidHttpUrl(draft.linkAddress.trim())) {
      errors.push('Link Address must start with http:// or https://.')
    }

    if (
      normalizedName &&
      entries.some(
        (entry) =>
          entry.id !== draft.id &&
          normalizeValue(entry.actionName) === normalizedName,
      )
    ) {
      errors.push('Action Name already exists.')
    }

    return errors
  }, [draft.actionName, draft.id, draft.linkAddress, entries, modalMode])

  const updateDraft = <Key extends keyof QuickActionDraft>(
    key: Key,
    value: QuickActionDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
  }

  const handleReset = () => {
    setAppliedFilters(defaultFilters)
    setFilterDraft(defaultFilters)
  }

  const openCreateModal = () => {
    setDraft(defaultDraft)
    setModalMode('create')
    setSubmitAttempted(false)
  }

  const openEditModal = (entry: QuickActionEntry) => {
    setDraft({ ...entry })
    setModalMode('edit')
    setSubmitAttempted(false)
  }

  const closeModal = () => {
    setDraft(defaultDraft)
    setModalMode(null)
    setSubmitAttempted(false)
  }

  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const now = new Date().toISOString()
    const currentEntry = entries.find((entry) => entry.id === draft.id)
    const nextEntry: QuickActionEntry = {
      actionName: draft.actionName.trim(),
      id:
        modalMode === 'edit' && draft.id
          ? draft.id
          : getNextQuickActionId(entries),
      linkAddress: draft.linkAddress.trim(),
      remark: draft.remark.trim(),
      sortOrder: currentEntry?.sortOrder ?? 0,
      status: draft.status,
      updatedAt: now,
      updatedBy: auditActor,
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      notify('Quick action updated.')
    } else {
      addEntry(nextEntry)
      notify('Quick action added.')
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    deleteEntries([deleteTarget.id], auditActor)
    notify('Quick action deleted.')
    setDeleteTarget(null)
  }

  const handleReorder = (
    entryId: string,
    direction: QuickActionReorderDirection,
  ) => {
    moveEntry(entryId, direction, auditActor)
    notify('Quick action order updated.')
  }

  const getReorderState = (entry: QuickActionEntry) => {
    const index = sortedEntries.findIndex((item) => item.id === entry.id)
    const lastIndex = sortedEntries.length - 1

    return { index, lastIndex }
  }

  const columns: ColumnsType<QuickActionEntry> = [
    {
      dataIndex: 'sortOrder',
      title: 'Order',
      width: 52,
    },
    {
      dataIndex: 'actionName',
      title: 'Action Name',
      width: 172,
    },
    {
      dataIndex: 'linkAddress',
      ellipsis: true,
      title: 'Link Address',
      width: 230,
    },
    {
      dataIndex: 'status',
      render: (status: QuickActionStatus) => renderStatusBadge(status),
      title: 'Status',
      width: 96,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 150,
    },
    {
      dataIndex: 'updatedBy',
      ellipsis: true,
      title: 'Modified By',
      width: 80,
    },
    {
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => formatDateTime(updatedAt),
      title: 'Modified Time',
      width: 140,
    },
    {
      render: (_, record) => {
        const { index, lastIndex } = getReorderState(record)
        const isFirst = index === 0
        const isLast = index === lastIndex
        const reorderTitle = reorderLocked
          ? 'Clear search and filters to adjust order'
          : undefined

        return (
          <div className="routing-config-crud__row-actions">
            <button
              aria-label={`Move ${record.actionName} to top`}
              disabled={reorderLocked || isFirst}
              title={reorderTitle ?? 'Move to Top'}
              type="button"
              onClick={() => handleReorder(record.id, 'top')}
            >
              <VerticalAlignTopOutlined />
            </button>
            <button
              aria-label={`Move ${record.actionName} up`}
              disabled={reorderLocked || isFirst}
              title={reorderTitle ?? 'Move Up'}
              type="button"
              onClick={() => handleReorder(record.id, 'up')}
            >
              <ArrowUpOutlined />
            </button>
            <button
              aria-label={`Move ${record.actionName} down`}
              disabled={reorderLocked || isLast}
              title={reorderTitle ?? 'Move Down'}
              type="button"
              onClick={() => handleReorder(record.id, 'down')}
            >
              <ArrowDownOutlined />
            </button>
            <button
              aria-label={`Move ${record.actionName} to bottom`}
              disabled={reorderLocked || isLast}
              title={reorderTitle ?? 'Move to Bottom'}
              type="button"
              onClick={() => handleReorder(record.id, 'bottom')}
            >
              <VerticalAlignBottomOutlined />
            </button>
            <button
              aria-label={`Edit ${record.actionName}`}
              title="Edit"
              type="button"
              onClick={() => openEditModal(record)}
            >
              <EditOutlined />
            </button>
            <button
              aria-label={`Delete ${record.actionName}`}
              title="Delete"
              type="button"
              onClick={() => {
                setDeleteTarget(record)
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
        )
      },
      title: 'Actions',
      width: 164,
    },
  ]

  return (
    <AdminPage className="quick-action-management" title="Quick Action Management">
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
              <AdminFilterField label="Action Name" width={260}>
                <Input
                  placeholder="Action Name"
                  value={filterDraft.actionName}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      actionName: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Status" width={160}>
                <Select
                  options={statusOptions}
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
                Add
              </BaseButton>
            </div>
          }
        />
        <AdminTable<QuickActionEntry>
          columns={columns}
          dataSource={filteredEntries}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnHidden
        open={Boolean(modalMode)}
        title={
          modalMode === 'edit' ? 'Edit Quick Action' : 'Add Quick Action'
        }
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
              title="Please fix the form."
              type="warning"
            />
          )}
          <div className="routing-config-crud-modal__form">
            {modalMode === 'edit' && (
              <AdminFormField label="ID">
                <Input disabled value={draft.id ?? ''} />
              </AdminFormField>
            )}
            <AdminFormField label="Action Name" required>
              <Input
                placeholder="Action Name"
                value={draft.actionName}
                onChange={(event) =>
                  updateDraft('actionName', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Link Address" fullWidth required>
              <Input
                placeholder="https://example.com"
                value={draft.linkAddress}
                onChange={(event) =>
                  updateDraft('linkAddress', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Status">
              <span className="busy-reason-config__switch-row">
                <Switch
                  checked={draft.status === 'Active'}
                  size="small"
                  onChange={(checked) =>
                    updateDraft('status', checked ? 'Active' : 'Disabled')
                  }
                />
                <em>{draft.status === 'Active' ? 'Enabled' : 'Disabled'}</em>
              </span>
            </AdminFormField>
            <AdminFormField label="Remark" fullWidth>
              <Input.TextArea
                rows={3}
                value={draft.remark}
                onChange={(event) => updateDraft('remark', event.target.value)}
              />
            </AdminFormField>
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
        destroyOnHidden
        open={Boolean(deleteTarget)}
        title="Delete Quick Action"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the quick action from the current demo session."
            title={`Delete quick action ${deleteTarget?.actionName ?? ''}?`}
            type="warning"
          />
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={handleDelete}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
