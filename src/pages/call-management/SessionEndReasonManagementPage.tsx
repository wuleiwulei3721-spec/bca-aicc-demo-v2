import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
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
  LimitedTextArea,
  StatusBadge,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useAuthStore, useCallManagementStore } from '../../store'
import type {
  SessionEndMediaType,
  SessionEndReasonEntry,
  SessionEndReasonStatus,
} from '../../types'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

type SessionEndReasonModalMode = 'create' | 'edit' | null

interface SessionEndReasonFilters {
  keyword: string
  mediaType: '' | SessionEndMediaType
  status: '' | SessionEndReasonStatus
}

interface SessionEndReasonDraft {
  id?: string
  mediaTypes: SessionEndMediaType[]
  reasonName: string
  remark: string
  status: SessionEndReasonStatus
}

const defaultFilters: SessionEndReasonFilters = {
  keyword: '',
  mediaType: '',
  status: '',
}

const defaultDraft: SessionEndReasonDraft = {
  mediaTypes: ['Voice'],
  reasonName: '',
  remark: '',
  status: 'Active',
}

const mediaTypeOptions: Array<{
  label: string
  value: SessionEndMediaType
}> = [
  { label: 'Voice', value: 'Voice' },
  { label: 'Video', value: 'Video' },
  { label: 'DM', value: 'DM' },
]

const mediaTypeFilterOptions: Array<{
  label: string
  value: '' | SessionEndMediaType
}> = [
  { label: 'All Media', value: '' },
  ...mediaTypeOptions,
]

const statusOptions: Array<{
  label: string
  value: '' | SessionEndReasonStatus
}> = [
  { label: 'All Status', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function getNextSessionEndReasonId(entries: SessionEndReasonEntry[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^SER(\d+)$/.exec(entry.id)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 0) + 1

  return `SER${String(nextSequence).padStart(3, '0')}`
}

function renderStatusBadge(status: SessionEndReasonStatus) {
  return (
    <StatusBadge
      dot
      label={status === 'Active' ? 'Enabled' : 'Disabled'}
      size="small"
      status={status === 'Active' ? 'success' : 'disabled'}
    />
  )
}

function renderMediaTags(mediaTypes: SessionEndMediaType[]) {
  return (
    <span className="session-end-reason-management__media-tags">
      {mediaTypes.map((mediaType) => (
        <span
          className="session-end-reason-management__media-tag"
          key={mediaType}
        >
          {mediaType}
        </span>
      ))}
    </span>
  )
}

export function SessionEndReasonManagementPage() {
  const authSession = useAuthStore((state) => state.session)
  const entries = useCallManagementStore(
    (state) => state.sessionEndReasonEntries,
  )
  const addEntry = useCallManagementStore(
    (state) => state.addSessionEndReasonEntry,
  )
  const updateEntry = useCallManagementStore(
    (state) => state.updateSessionEndReasonEntry,
  )
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteSessionEndReasonEntries,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<SessionEndReasonFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] =
    useState<SessionEndReasonEntry | null>(null)
  const [draft, setDraft] =
    useState<SessionEndReasonDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<SessionEndReasonFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<SessionEndReasonModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const keyword = normalizeValue(appliedFilters.keyword)
        const searchMatched = keyword
          ? [
              entry.id,
              entry.reasonName,
              entry.mediaTypes.join(' '),
              entry.status,
              entry.remark,
            ]
              .join(' ')
              .toLowerCase()
              .includes(keyword)
          : true
        const mediaMatched = appliedFilters.mediaType
          ? entry.mediaTypes.includes(appliedFilters.mediaType)
          : true
        const statusMatched = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true

        return searchMatched && mediaMatched && statusMatched
      }),
    [appliedFilters, entries],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedReasonName = normalizeValue(draft.reasonName)

    if (!normalizedReasonName) {
      errors.push('Reason Name is required.')
    }

    if (draft.mediaTypes.length === 0) {
      errors.push('Applicable Media is required.')
    }

    if (
      normalizedReasonName &&
      entries.some(
        (entry) =>
          entry.id !== draft.id &&
          normalizeValue(entry.reasonName) === normalizedReasonName,
      )
    ) {
      errors.push('Reason Name already exists.')
    }

    return errors
  }, [draft.id, draft.mediaTypes.length, draft.reasonName, entries, modalMode])

  const updateDraft = <Key extends keyof SessionEndReasonDraft>(
    key: Key,
    value: SessionEndReasonDraft[Key],
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

  const openEditModal = (entry: SessionEndReasonEntry) => {
    setDraft({
      ...entry,
      mediaTypes: [...entry.mediaTypes],
    })
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

    const nextEntry: SessionEndReasonEntry = {
      id:
        modalMode === 'edit' && draft.id
          ? draft.id
          : getNextSessionEndReasonId(entries),
      mediaTypes: draft.mediaTypes,
      reasonName: draft.reasonName.trim(),
      remark: draft.remark.trim(),
      status: draft.status,
      updatedAt: formatCallManagementDateTime(new Date()),
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      notify('Session end reason updated.')
    } else {
      addEntry(nextEntry)
      notify('Session end reason added.')
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    deleteEntries([deleteTarget.id])
    notify('Session end reason deleted.')
    setDeleteTarget(null)
  }

  const columns: ColumnsType<SessionEndReasonEntry> = [
    {
      key: 'sequence',
      render: (_, record) =>
        filteredEntries.findIndex((entry) => entry.id === record.id) + 1,
      title: 'No.',
      width: 72,
    },
    {
      dataIndex: 'reasonName',
      title: 'Reason Name',
      width: 250,
    },
    {
      dataIndex: 'mediaTypes',
      render: (mediaTypes: SessionEndMediaType[]) =>
        renderMediaTags(mediaTypes),
      title: 'Applicable Media',
      width: 180,
    },
    {
      dataIndex: 'status',
      render: (status: SessionEndReasonStatus) => renderStatusBadge(status),
      title: 'Status',
      width: 110,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 260,
    },
    {
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => formatCallManagementDateTime(updatedAt),
      title: 'Updated Time',
      width: 156,
    },
    {
      dataIndex: 'updatedBy',
      ellipsis: true,
      title: 'Updated By',
      width: 132,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`Edit ${record.reasonName}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.reasonName}`}
            title="Delete"
            type="button"
            onClick={() => {
              setDeleteTarget(record)
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 96,
    },
  ]

  return (
    <AdminPage
      className="session-end-reason-management"
      title="Abnormal End Reasons"
    >
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
              <AdminFilterField label="Keyword" width={260}>
                <Input
                  allowClear
                  placeholder="Reason / remark"
                  value={filterDraft.keyword}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      keyword: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Applicable Media" width={200}>
                <Select
                  options={mediaTypeFilterOptions}
                  value={filterDraft.mediaType}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      mediaType: value,
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
        <AdminTable<SessionEndReasonEntry>
          columns={columns}
          dataSource={filteredEntries}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={
          modalMode === 'edit'
            ? 'Edit Session End Reason'
            : 'Add Session End Reason'
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
              message="Please fix the form."
              type="warning"
            />
          )}
          <div className="routing-config-crud-modal__form">
            {modalMode === 'edit' && (
              <AdminFormField label="ID">
                <Input disabled value={draft.id ?? ''} />
              </AdminFormField>
            )}
            <AdminFormField label="Reason Name" required>
              <Input
                placeholder="Reason Name"
                value={draft.reasonName}
                onChange={(event) =>
                  updateDraft('reasonName', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Applicable Media" required>
              <Select
                mode="multiple"
                options={mediaTypeOptions}
                placeholder="Select media"
                value={draft.mediaTypes}
                onChange={(value) =>
                  updateDraft('mediaTypes', value as SessionEndMediaType[])
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
              <LimitedTextArea
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
        destroyOnClose
        open={Boolean(deleteTarget)}
        title="Delete Session End Reason"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the session end reason from the current demo session."
            message={`Delete session end reason ${
              deleteTarget?.reasonName ?? ''
            }?`}
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
