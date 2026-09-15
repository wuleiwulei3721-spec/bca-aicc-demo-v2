import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Input } from 'antd'
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
  LimitedInput,
  LimitedTextArea,
} from '../../components'
import type { CommonLinkQuery } from '../../api/commonLinkApi'
import { isCommonLinkDemoMode } from '../../config/commonLinkMode'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useAppStore, useAuthStore, useCommonLinkStore } from '../../store'
import type { CommonLinkEntry } from '../../types'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

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

const COMMON_LINK_NAME_MAX_LENGTH = 200
const COMMON_LINK_URL_MAX_LENGTH = 200
const COMMON_LINK_REMARK_MAX_LENGTH = 2000
const commonLinkTabKey = 'page:call-management-common-links'

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

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)

    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function toQuery(filters: CommonLinkFilters): CommonLinkQuery {
  return {
    websiteName: filters.websiteName.trim() || undefined,
    websiteUrl: filters.websiteUrl.trim() || undefined,
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The Common Link request failed.'
}

export function CommonLinkManagementPage() {
  const activeWorkspaceTabKey = useAppStore(
    (state) => state.activeWorkspaceTabKey,
  )
  const authSession = useAuthStore((state) => state.session)
  const entries = useCommonLinkStore((state) => state.entries)
  const error = useCommonLinkStore((state) => state.error)
  const isLoading = useCommonLinkStore((state) => state.isLoading)
  const isMutating = useCommonLinkStore((state) => state.isMutating)
  const load = useCommonLinkStore((state) => state.load)
  const createEntry = useCommonLinkStore((state) => state.create)
  const updateEntry = useCommonLinkStore((state) => state.update)
  const deleteEntry = useCommonLinkStore((state) => state.delete)
  const [appliedFilters, setAppliedFilters] =
    useState<CommonLinkFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] = useState<CommonLinkEntry | null>(null)
  const [draft, setDraft] = useState<CommonLinkDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<CommonLinkFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<CommonLinkModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const appliedQueryRef = useRef<CommonLinkQuery>(toQuery(defaultFilters))
  const isPageActive = activeWorkspaceTabKey === commonLinkTabKey

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
    } else if (normalizedName.length > COMMON_LINK_NAME_MAX_LENGTH) {
      errors.push(
        `Website Name must be ${COMMON_LINK_NAME_MAX_LENGTH} characters or fewer.`,
      )
    }

    if (!normalizedUrl) {
      errors.push('Website URL is required.')
    } else if (normalizedUrl.length > COMMON_LINK_URL_MAX_LENGTH) {
      errors.push(
        `Website URL must be ${COMMON_LINK_URL_MAX_LENGTH} characters or fewer.`,
      )
    } else if (!isValidHttpUrl(draft.websiteUrl.trim())) {
      errors.push('Website URL must start with http:// or https://.')
    }

    if (draft.remark.trim().length > COMMON_LINK_REMARK_MAX_LENGTH) {
      errors.push(
        `Remark must be ${COMMON_LINK_REMARK_MAX_LENGTH} characters or fewer.`,
      )
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
  }, [
    draft.id,
    draft.remark,
    draft.websiteName,
    draft.websiteUrl,
    entries,
    modalMode,
  ])

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

  const handleSave = async () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const input = {
      remark: draft.remark.trim(),
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
      websiteName: draft.websiteName.trim(),
      websiteUrl: draft.websiteUrl.trim(),
    }

    try {
      if (modalMode === 'edit' && draft.id) {
        await updateEntry(draft.id, input)
        notify('Common link updated.')
      } else {
        await createEntry(input)
        notify('Common link added.')
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
      notify('Common link deleted.')
      setDeleteTarget(null)
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
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
      width: 210,
    },
    {
      dataIndex: 'websiteUrl',
      ellipsis: true,
      title: 'Website URL',
      width: 300,
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
      width: 96,
    },
  ]

  return (
    <AdminPage className="common-link-management" title="Common Link">
      {isCommonLinkDemoMode && (
        <Alert
          description="Changes are available for this demo session and reset after a page refresh."
          message="Common Link Demo Mode"
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
          message="Common Link API error"
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
        <AdminTable<CommonLinkEntry>
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
              <LimitedInput
                maxLength={COMMON_LINK_NAME_MAX_LENGTH}
                placeholder="Website Name"
                value={draft.websiteName}
                onChange={(event) =>
                  updateDraft('websiteName', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Website URL" required>
              <LimitedInput
                maxLength={COMMON_LINK_URL_MAX_LENGTH}
                placeholder="https://example.com"
                value={draft.websiteUrl}
                onChange={(event) =>
                  updateDraft('websiteUrl', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Remark" fullWidth>
              <LimitedTextArea
                maxLength={COMMON_LINK_REMARK_MAX_LENGTH}
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
        title="Delete Common Link"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the common link from the configured data source."
            message={`Delete common link ${deleteTarget?.websiteName ?? ''}?`}
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
