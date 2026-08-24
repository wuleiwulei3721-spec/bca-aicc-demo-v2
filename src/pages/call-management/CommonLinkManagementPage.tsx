import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Input } from 'antd'
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
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useCallManagementStore } from '../../store'
import type { CommonLinkEntry } from '../../types'

type CommonLinkModalMode = 'create' | 'edit' | null

interface CommonLinkFilters {
  websiteName: string
  websiteUrl: string
}

interface CommonLinkDraft {
  id?: string
  remark: string
  websiteName: string
  websiteUrl: string
}

const defaultFilters: CommonLinkFilters = {
  websiteName: '',
  websiteUrl: '',
}

const defaultDraft: CommonLinkDraft = {
  remark: '',
  websiteName: '',
  websiteUrl: '',
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function getNextCommonLinkId(entries: CommonLinkEntry[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^CL(\d+)$/.exec(entry.id)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 0) + 1

  return `CL${String(nextSequence).padStart(3, '0')}`
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function CommonLinkManagementPage() {
  const entries = useCallManagementStore((state) => state.commonLinkEntries)
  const addEntry = useCallManagementStore((state) => state.addCommonLinkEntry)
  const updateEntry = useCallManagementStore(
    (state) => state.updateCommonLinkEntry,
  )
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteCommonLinkEntries,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<CommonLinkFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] = useState<CommonLinkEntry | null>(null)
  const [draft, setDraft] = useState<CommonLinkDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<CommonLinkFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<CommonLinkModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const nameKeyword = normalizeValue(appliedFilters.websiteName)
        const urlKeyword = normalizeValue(appliedFilters.websiteUrl)
        const nameMatched = nameKeyword
          ? entry.websiteName.toLowerCase().includes(nameKeyword)
          : true
        const urlMatched = urlKeyword
          ? entry.websiteUrl.toLowerCase().includes(urlKeyword)
          : true

        return nameMatched && urlMatched
      }),
    [appliedFilters, entries],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedName = normalizeValue(draft.websiteName)
    const normalizedUrl = normalizeValue(draft.websiteUrl)

    if (!normalizedName) {
      errors.push('Website Name is required.')
    }

    if (!normalizedUrl) {
      errors.push('Website URL is required.')
    } else if (!isValidHttpUrl(draft.websiteUrl.trim())) {
      errors.push('Website URL must start with http:// or https://.')
    }

    if (
      normalizedName &&
      entries.some(
        (entry) =>
          entry.id !== draft.id &&
          normalizeValue(entry.websiteName) === normalizedName,
      )
    ) {
      errors.push('Website Name already exists.')
    }

    if (
      normalizedUrl &&
      entries.some(
        (entry) =>
          entry.id !== draft.id &&
          normalizeValue(entry.websiteUrl) === normalizedUrl,
      )
    ) {
      errors.push('Website URL already exists.')
    }

    return errors
  }, [draft.id, draft.websiteName, draft.websiteUrl, entries, modalMode])

  const updateDraft = <Key extends keyof CommonLinkDraft>(
    key: Key,
    value: CommonLinkDraft[Key],
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

  const openEditModal = (entry: CommonLinkEntry) => {
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

    const nextEntry: CommonLinkEntry = {
      id:
        modalMode === 'edit' && draft.id
          ? draft.id
          : getNextCommonLinkId(entries),
      remark: draft.remark.trim(),
      websiteName: draft.websiteName.trim(),
      websiteUrl: draft.websiteUrl.trim(),
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      notify('Common link updated.')
    } else {
      addEntry(nextEntry)
      notify('Common link added.')
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    deleteEntries([deleteTarget.id])
    notify('Common link deleted.')
    setDeleteTarget(null)
  }

  const columns: ColumnsType<CommonLinkEntry> = [
    {
      key: 'sequence',
      render: (_, record) =>
        filteredEntries.findIndex((entry) => entry.id === record.id) + 1,
      title: 'No.',
      width: 72,
    },
    {
      dataIndex: 'websiteName',
      title: 'Website Name',
      width: 240,
    },
    {
      dataIndex: 'websiteUrl',
      ellipsis: true,
      title: 'Website URL',
      width: 360,
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
            aria-label={`Edit ${record.websiteName}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.websiteName}`}
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
      width: 100,
    },
  ]

  return (
    <AdminPage className="common-link-management" title="Common Link">
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
              <AdminFilterField label="Website Name" width={260}>
                <Input
                  placeholder="Website Name"
                  value={filterDraft.websiteName}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      websiteName: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Website URL" width={260}>
                <Input
                  placeholder="Website URL"
                  value={filterDraft.websiteUrl}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      websiteUrl: event.target.value,
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
        <AdminTable<CommonLinkEntry>
          columns={columns}
          dataSource={filteredEntries}
          horizontalScroll={1132}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={modalMode === 'edit' ? 'Edit Common Link' : 'Add Common Link'}
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
            <AdminFormField label="Website Name" required>
              <Input
                placeholder="Website Name"
                value={draft.websiteName}
                onChange={(event) =>
                  updateDraft('websiteName', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Website URL" required>
              <Input
                placeholder="https://example.com"
                value={draft.websiteUrl}
                onChange={(event) =>
                  updateDraft('websiteUrl', event.target.value)
                }
              />
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
        title="Delete Common Link"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the common link from the current demo session."
            message={`Delete common link ${deleteTarget?.websiteName ?? ''}?`}
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
