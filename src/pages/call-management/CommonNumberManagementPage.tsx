import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Input, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { isCommonNumberDemoMode } from '../../config/commonNumberMode'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import {
  useAppStore,
  useAuthStore,
  useCommonNumberStore,
} from '../../store'
import type { CommonNumberQuery } from '../../api/commonNumberApi'
import type { CommonNumberEntry, CommonNumberStatus } from '../../types'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

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

const commonNumberTabKey = 'page:call-management-common-numbers'
const COMMON_NUMBER_REMARK_MAX_LENGTH = 2000

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

function toQuery(filters: CommonNumberFilters): CommonNumberQuery {
  return {
    name: filters.name.trim() || undefined,
    number: filters.number.trim() || undefined,
    status: filters.status || undefined,
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The Common Number request failed.'
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
  const activeWorkspaceTabKey = useAppStore(
    (state) => state.activeWorkspaceTabKey,
  )
  const authSession = useAuthStore((state) => state.session)
  const entries = useCommonNumberStore((state) => state.entries)
  const error = useCommonNumberStore((state) => state.error)
  const isLoading = useCommonNumberStore((state) => state.isLoading)
  const isMutating = useCommonNumberStore((state) => state.isMutating)
  const load = useCommonNumberStore((state) => state.load)
  const createEntry = useCommonNumberStore((state) => state.create)
  const updateEntry = useCommonNumberStore((state) => state.update)
  const deleteEntry = useCommonNumberStore((state) => state.delete)
  const [appliedFilters, setAppliedFilters] =
    useState<CommonNumberFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] =
    useState<CommonNumberEntry | null>(null)
  const [draft, setDraft] = useState<CommonNumberDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<CommonNumberFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<CommonNumberModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const appliedQueryRef = useRef<CommonNumberQuery>(toQuery(defaultFilters))
  const isPageActive = activeWorkspaceTabKey === commonNumberTabKey

  useEffect(() => {
    appliedQueryRef.current = toQuery(appliedFilters)
  }, [appliedFilters])

  useEffect(() => {
    if (isPageActive) {
      void load(appliedQueryRef.current).catch(() => undefined)
    }
  }, [isPageActive, load])

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
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
    void load(toQuery(filterDraft)).catch(() => undefined)
  }

  const handleReset = () => {
    setAppliedFilters(defaultFilters)
    setFilterDraft(defaultFilters)
    void load(toQuery(defaultFilters)).catch(() => undefined)
  }

  const openCreateModal = () => {
    setDraft(defaultDraft)
    setModalMode('create')
    setSubmitAttempted(false)
  }

  const openEditModal = (entry: CommonNumberEntry) => {
    setDraft({ ...entry })
    setModalMode('edit')
    setSubmitAttempted(false)
  }

  const closeModal = () => {
    setDraft(defaultDraft)
    setModalMode(null)
    setSubmitAttempted(false)
  }

  const handleSave = async () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const input = {
      name: draft.name.trim(),
      number: draft.number.trim(),
      remark: draft.remark.trim(),
      status: draft.status,
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
    }

    try {
      if (modalMode === 'edit' && draft.id) {
        await updateEntry(draft.id, input)
        notify('Common number updated.')
      } else {
        await createEntry(input)
        notify('Common number added.')
      }
      closeModal()
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteEntry(deleteTarget.id)
      notify('Common number deleted.')
      setDeleteTarget(null)
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
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
      width: 190,
    },
    {
      dataIndex: 'number',
      title: 'Number',
      width: 140,
    },
    {
      dataIndex: 'status',
      render: (status: CommonNumberStatus) => renderStatusBadge(status),
      title: 'Status',
      width: 110,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 250,
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
      className="common-number-management"
      title="Common Number"
  >
      {isCommonNumberDemoMode && (
        <Alert
          description="Changes are available for this demo session and reset after a page refresh."
          message="Common Number Demo Mode"
          showIcon
          type="info"
        />
      )}
      {error && (
        <Alert
          action={
            <BaseButton
              size="small"
              variant="secondary"
              onClick={() => void load(appliedQueryRef.current).catch(() => undefined)}
            >
              Retry
            </BaseButton>
          }
          closable
          description={error}
          message="Common Number API error"
          showIcon
          type="error"
        />
      )}
      <BaseCard compact>
        <AdminToolbar
          actions={
            <>
              <BaseButton disabled={isLoading || isMutating} variant="primary" onClick={handleSearch}>
                Search
              </BaseButton>
              <BaseButton disabled={isLoading || isMutating} variant="secondary" onClick={handleReset}>
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
                disabled={isMutating}
                loading={isMutating}
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
          loading={isLoading}
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
              <LimitedTextArea
                maxLength={COMMON_NUMBER_REMARK_MAX_LENGTH}
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
          <BaseButton loading={isMutating} variant="primary" onClick={handleSave}>
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
          <BaseButton loading={isMutating} variant="danger" onClick={handleDelete}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
