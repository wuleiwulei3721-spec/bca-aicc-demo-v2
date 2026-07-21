import { EditOutlined } from '@ant-design/icons'
import { Alert, Input, Select, Switch } from 'antd'
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
  StatusBadge,
} from '../../components'
import { useCallManagementStore } from '../../store'
import type { BusyReason, BusyReasonStatus } from '../../types'

type BusyReasonModalMode = 'edit' | null

interface BusyReasonFilters {
  keyword: string
  status: '' | BusyReasonStatus
}

const defaultFilters: BusyReasonFilters = {
  keyword: '',
  status: '',
}

const statusOptions: Array<{ label: string; value: '' | BusyReasonStatus }> = [
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

function renderStatusBadge(status: BusyReasonStatus) {
  return (
    <StatusBadge
      dot
      label={status === 'Active' ? 'Enabled' : 'Disabled'}
      size="small"
      status={status === 'Active' ? 'success' : 'disabled'}
    />
  )
}

export function BusyReasonManagementPage() {
  const busyReasons = useCallManagementStore((state) => state.busyReasons)
  const upsertBusyReason = useCallManagementStore(
    (state) => state.upsertBusyReason,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<BusyReasonFilters>(defaultFilters)
  const [filterDraft, setFilterDraft] =
    useState<BusyReasonFilters>(defaultFilters)
  const [draft, setDraft] = useState<BusyReason | null>(null)
  const [modalMode, setModalMode] = useState<BusyReasonModalMode>(null)
  const [notice, setNotice] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const filteredReasons = useMemo(
    () =>
      busyReasons.filter((reason) => {
        const keyword = appliedFilters.keyword.trim().toLowerCase()
        const keywordMatched = keyword
          ? [
              reason.busyReasonId,
              reason.busyReasonName,
              reason.remark,
            ].some((value) => value.toLowerCase().includes(keyword))
          : true
        const statusMatched = appliedFilters.status
          ? reason.status === appliedFilters.status
          : true

        return keywordMatched && statusMatched
      }),
    [appliedFilters, busyReasons],
  )

  const validationErrors = useMemo(() => {
    if (!draft) {
      return []
    }

    const errors: string[] = []
    const trimmedName = draft.busyReasonName.trim()

    if (!trimmedName) {
      errors.push('Busy Reason is required.')
    }

    return errors
  }, [draft])

  const updateDraft = <Key extends keyof BusyReason>(
    key: Key,
    value: BusyReason[Key],
  ) => {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            [key]: value,
          }
        : currentDraft,
    )
    setNotice('')
  }

  const openEditModal = (record: BusyReason) => {
    setDraft({ ...record })
    setModalMode('edit')
    setSubmitAttempted(false)
    setNotice('')
  }

  const closeModal = () => {
    setModalMode(null)
    setDraft(null)
    setSubmitAttempted(false)
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
  }

  const handleReset = () => {
    setFilterDraft(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  const handleSave = () => {
    setSubmitAttempted(true)

    if (!draft || validationErrors.length > 0) {
      return
    }

    const nextRecord: BusyReason = {
      ...draft,
      busyReasonName: draft.busyReasonName.trim(),
      remark: draft.remark.trim(),
      updatedAt: formatSavedTime(new Date()),
      updatedBy: 'Admin',
    }

    upsertBusyReason(nextRecord)
    setNotice('Busy reason saved.')
    closeModal()
  }

  const columns: ColumnsType<BusyReason> = [
    {
      dataIndex: 'busyReasonId',
      title: 'ID',
      width: 120,
    },
    {
      dataIndex: 'busyReasonName',
      title: 'Busy Reason',
      width: 180,
    },
    {
      dataIndex: 'status',
      render: (value: BusyReasonStatus) => renderStatusBadge(value),
      title: 'Status',
      width: 120,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 320,
    },
    {
      dataIndex: 'updatedAt',
      title: 'Updated Date',
      width: 160,
    },
    {
      dataIndex: 'updatedBy',
      title: 'Updated By',
      width: 120,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`Edit ${record.busyReasonId}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 88,
    },
  ]

  return (
    <AdminPage className="busy-reason-config" title="Busy Reason">
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
                <AdminFilterField label="Keyword" width={260}>
                  <Input
                    placeholder="ID / Busy Reason / Remark"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        keyword: event.target.value,
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
          />
          <AdminTable<BusyReason>
            columns={columns}
            dataSource={filteredReasons}
            pagination={{}}
            rowKey="busyReasonId"
            horizontalScroll={1010}
          />
        </BaseCard>
      <AdminModal
        destroyOnClose
        open={modalMode === 'edit' && Boolean(draft)}
        title="Edit Busy Reason"
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
          {draft && (
            <div className="busy-reason-config__modal-grid">
              <label className="global-control-config__field">
                <span>ID</span>
                <em>{draft.busyReasonId}</em>
              </label>
              <label className="global-control-config__field">
                <span>
                  Busy Reason <strong>*</strong>
                </span>
                <Input
                  value={draft.busyReasonName}
                  onChange={(event) =>
                    updateDraft('busyReasonName', event.target.value)
                  }
                />
              </label>
              <label className="global-control-config__field">
                <span>Status</span>
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
              </label>
              <label className="global-control-config__field busy-reason-config__field--full">
                <span>Remark</span>
                <Input.TextArea
                  rows={3}
                  value={draft.remark}
                  onChange={(event) => updateDraft('remark', event.target.value)}
                />
              </label>
              <label className="global-control-config__field">
                <span>Updated Date</span>
                <em>{draft.updatedAt}</em>
              </label>
              <label className="global-control-config__field">
                <span>Updated By</span>
                <em>{draft.updatedBy}</em>
              </label>
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
    </AdminPage>
  )
}
