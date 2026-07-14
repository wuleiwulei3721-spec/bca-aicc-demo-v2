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
  StatusBadge,
} from '../../components'
import { useCallManagementStore } from '../../store'
import type { CommonNumberEntry, CommonNumberStatus } from '../../types'

type CommonNumberModalMode = 'create' | 'edit' | null

interface CommonNumberFilters {
  name: string
  number: string
  status: '' | CommonNumberStatus
}

interface CommonNumberDraft {
  id?: string
  name: string
  number: string
  remark: string
  status: CommonNumberStatus
}

const defaultFilters: CommonNumberFilters = {
  name: '',
  number: '',
  status: '',
}

const defaultDraft: CommonNumberDraft = {
  name: '',
  number: '',
  remark: '',
  status: 'Active',
}

const statusOptions: Array<{
  label: string
  value: '' | CommonNumberStatus
}> = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function getNextCommonNumberId(entries: CommonNumberEntry[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^CN(\d+)$/.exec(entry.id)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 0) + 1

  return `CN${String(nextSequence).padStart(3, '0')}`
}

function renderStatusBadge(status: CommonNumberStatus) {
  return (
    <StatusBadge
      dot
      label={status === 'Active' ? 'Enabled' : 'Disabled'}
      size="small"
      status={status === 'Active' ? 'success' : 'disabled'}
    />
  )
}

export function CommonNumberManagementPage() {
  const entries = useCallManagementStore((state) => state.commonNumberEntries)
  const addEntry = useCallManagementStore((state) => state.addCommonNumberEntry)
  const updateEntry = useCallManagementStore(
    (state) => state.updateCommonNumberEntry,
  )
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteCommonNumberEntries,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<CommonNumberFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] =
    useState<CommonNumberEntry | null>(null)
  const [draft, setDraft] = useState<CommonNumberDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<CommonNumberFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<CommonNumberModalMode>(null)
  const [notice, setNotice] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const nameKeyword = normalizeValue(appliedFilters.name)
        const numberKeyword = normalizeValue(appliedFilters.number)
        const nameMatched = nameKeyword
          ? entry.name.toLowerCase().includes(nameKeyword)
          : true
        const numberMatched = numberKeyword
          ? entry.number.toLowerCase().includes(numberKeyword)
          : true
        const statusMatched = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true

        return nameMatched && numberMatched && statusMatched
      }),
    [appliedFilters, entries],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedName = normalizeValue(draft.name)
    const normalizedNumber = normalizeValue(draft.number)

    if (!normalizedName) {
      errors.push('Name is required.')
    }

    if (!normalizedNumber) {
      errors.push('Number is required.')
    }

    if (
      normalizedName &&
      entries.some(
        (entry) =>
          entry.id !== draft.id && normalizeValue(entry.name) === normalizedName,
      )
    ) {
      errors.push('Name already exists.')
    }

    if (
      normalizedNumber &&
      entries.some(
        (entry) =>
          entry.id !== draft.id &&
          normalizeValue(entry.number) === normalizedNumber,
      )
    ) {
      errors.push('Number already exists.')
    }

    return errors
  }, [draft.id, draft.name, draft.number, entries, modalMode])

  const updateDraft = <Key extends keyof CommonNumberDraft>(
    key: Key,
    value: CommonNumberDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
    setNotice('')
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
    setNotice('')
  }

  const openEditModal = (entry: CommonNumberEntry) => {
    setDraft({ ...entry })
    setModalMode('edit')
    setSubmitAttempted(false)
    setNotice('')
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

    const nextEntry: CommonNumberEntry = {
      id:
        modalMode === 'edit' && draft.id
          ? draft.id
          : getNextCommonNumberId(entries),
      name: draft.name.trim(),
      number: draft.number.trim(),
      remark: draft.remark.trim(),
      status: draft.status,
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      setNotice('Common number updated.')
    } else {
      addEntry(nextEntry)
      setNotice('Common number added.')
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    deleteEntries([deleteTarget.id])
    setNotice('Common number deleted.')
    setDeleteTarget(null)
  }

  const columns: ColumnsType<CommonNumberEntry> = [
    {
      key: 'sequence',
      render: (_, record) =>
        filteredEntries.findIndex((entry) => entry.id === record.id) + 1,
      title: 'No.',
      width: 72,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 220,
    },
    {
      dataIndex: 'number',
      title: 'Number',
      width: 180,
    },
    {
      dataIndex: 'status',
      render: (status: CommonNumberStatus) => renderStatusBadge(status),
      title: 'Status',
      width: 140,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 360,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`Edit ${record.name}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.name}`}
            title="Delete"
            type="button"
            onClick={() => {
              setDeleteTarget(record)
              setNotice('')
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 100,
    },
  ]

  return (
    <AdminPage
      className="common-number-management"
      title="Common Number"
    >
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
              <AdminFilterField label="Name" width={240}>
                <Input
                  placeholder="Name"
                  value={filterDraft.name}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      name: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Number" width={220}>
                <Input
                  placeholder="Number"
                  value={filterDraft.number}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      number: event.target.value,
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
        <AdminTable<CommonNumberEntry>
          columns={columns}
          dataSource={filteredEntries}
          horizontalScroll={1072}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={
          modalMode === 'edit' ? 'Edit Common Number' : 'Add Common Number'
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
            <AdminFormField label="Name" required>
              <Input
                placeholder="Name"
                value={draft.name}
                onChange={(event) => updateDraft('name', event.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Number" required>
              <Input
                placeholder="Number"
                value={draft.number}
                onChange={(event) => updateDraft('number', event.target.value)}
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
        destroyOnClose
        open={Boolean(deleteTarget)}
        title="Delete Common Number"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the common number from the current demo session."
            message={`Delete common number ${deleteTarget?.name ?? ''}?`}
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
