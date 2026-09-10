import { EditOutlined } from '@ant-design/icons'
import { Alert, Input, Radio, Select, Switch } from 'antd'
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
  LimitedTextArea,
  StatusBadge,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useAuthStore, useCallManagementStore } from '../../store'
import type {
  BusyReason,
  BusyReasonProductivityType,
  BusyReasonStatus,
} from '../../types'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

type BusyReasonModalMode = 'edit' | null

interface BusyReasonFilters {
  keyword: string
  productivityType: '' | BusyReasonProductivityType
  status: '' | BusyReasonStatus
}

const defaultFilters: BusyReasonFilters = {
  keyword: '',
  productivityType: '',
  status: '',
}

const statusOptions: Array<{ label: string; value: '' | BusyReasonStatus }> = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

const productivityTypeOptions: Array<{
  label: string
  value: BusyReasonProductivityType
}> = [
  { label: 'Productive', value: 'Productive' },
  { label: 'Non-Productive', value: 'Non-Productive' },
]

const productivityTypeFilterOptions: Array<{
  label: string
  value: '' | BusyReasonProductivityType
}> = [{ label: 'All', value: '' }, ...productivityTypeOptions]

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
  const authSession = useAuthStore((state) => state.session)
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
  const { notify } = useOperationFeedback()
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
        const productivityTypeMatched = appliedFilters.productivityType
          ? reason.productivityType === appliedFilters.productivityType
          : true

        return keywordMatched && productivityTypeMatched && statusMatched
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
      errors.push('AUX Reason is required.')
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
  }

  const openEditModal = (record: BusyReason) => {
    setDraft({ ...record })
    setModalMode('edit')
    setSubmitAttempted(false)
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
      updatedAt: formatCallManagementDateTime(new Date()),
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
    }

    upsertBusyReason(nextRecord)
    notify('AUX Reason saved.')
    closeModal()
  }

  const columns: ColumnsType<BusyReason> = [
    {
      dataIndex: 'busyReasonId',
      title: 'ID',
      width: 82,
    },
    {
      dataIndex: 'busyReasonName',
      title: 'AUX Reason',
      width: 160,
    },
    {
      dataIndex: 'productivityType',
      title: 'Productivity Type',
      width: 126,
    },
    {
      dataIndex: 'status',
      render: (value: BusyReasonStatus) => renderStatusBadge(value),
      title: 'Status',
      width: 96,
    },
    {
      dataIndex: 'supportsOutbound',
      title: 'Support Outbound',
      width: 120,
      render: (value: boolean) => (
        <StatusBadge
          dot
          label={value ? 'Enabled' : 'Disabled'}
          size="small"
          status={value ? 'success' : 'disabled'}
        />
      ),
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 220,
    },
    {
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => formatCallManagementDateTime(updatedAt),
      title: 'Updated Time',
      width: 154,
    },
    {
      dataIndex: 'updatedBy',
      ellipsis: true,
      title: 'Updated By',
      width: 126,
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
      width: 76,
    },
  ]

  return (
    <AdminPage className="busy-reason-config" title="AUX Reason Management">
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
                  placeholder="ID / AUX Reason / Remark"
                    value={filterDraft.keyword}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        keyword: event.target.value,
                      }))
                    }
                  />
                </AdminFilterField>
                <AdminFilterField label="Productivity Type" width={180}>
                  <Select
                    options={productivityTypeFilterOptions}
                    value={filterDraft.productivityType}
                    onChange={(value) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        productivityType: value,
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
          />
        </BaseCard>
      <AdminModal
        destroyOnClose
        open={modalMode === 'edit' && Boolean(draft)}
        title="Edit AUX Reason"
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
                  AUX Reason <strong>*</strong>
                </span>
                <Input
                  value={draft.busyReasonName}
                  onChange={(event) =>
                    updateDraft('busyReasonName', event.target.value)
                  }
                />
              </label>
              <label className="global-control-config__field">
                <span>
                  Productivity Type <strong>*</strong>
                </span>
                <Radio.Group
                  optionType="button"
                  options={productivityTypeOptions}
                  value={draft.productivityType}
                  onChange={(event) =>
                    updateDraft('productivityType', event.target.value)
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
              <label className="global-control-config__field">
                <span>Support Outbound</span>
                <span className="busy-reason-config__switch-row">
                  <Switch
                    checked={draft.supportsOutbound}
                    disabled={draft.status !== 'Active'}
                    size="small"
                    onChange={(checked) =>
                      updateDraft('supportsOutbound', checked)
                    }
                  />
                  <em>
                    {draft.supportsOutbound && draft.status === 'Active'
                      ? 'Enabled'
                      : 'Disabled'}
                  </em>
                </span>
              </label>
              <label className="global-control-config__field busy-reason-config__field--full">
                <span>Remark</span>
                <LimitedTextArea
                  rows={3}
                  value={draft.remark}
                  onChange={(event) => updateDraft('remark', event.target.value)}
                />
              </label>
              <label className="global-control-config__field">
                <span>Updated Time</span>
                <em>{formatCallManagementDateTime(draft.updatedAt)}</em>
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
