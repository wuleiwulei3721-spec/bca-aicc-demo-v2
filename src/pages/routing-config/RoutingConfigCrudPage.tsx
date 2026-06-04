import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Input, InputNumber, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BaseButton,
  BaseCard,
  BaseModal,
  BaseTable,
  PageContainer,
  SearchInput,
} from '../../components'
import type { RoutingConfigStatus } from '../../types'
import { RoutingConfigStatusBadge } from './RoutingConfigStatusBadge'

export type RoutingConfigFieldValue =
  | boolean
  | number
  | string
  | string[]
  | null
  | undefined

export type RoutingConfigDraft = Record<string, RoutingConfigFieldValue>

export interface RoutingConfigSelectOption {
  disabled?: boolean
  label: string
  value: string
}

export interface RoutingConfigField {
  addonAfter?: string
  helper?: string
  key: string
  label: string
  fullWidth?: boolean
  max?: number
  min?: number
  options?: RoutingConfigSelectOption[]
  readOnly?: boolean
  readOnlyOnEdit?: boolean
  required?: boolean
  rows?: number
  switchLabels?: {
    checked: string
    unchecked: string
  }
  type:
    | 'multiSelect'
    | 'number'
    | 'select'
    | 'statusSwitch'
    | 'switch'
    | 'textarea'
    | 'text'
}

type RoutingConfigFilterValue = string | string[]

interface RoutingConfigFieldContext<RecordType extends object> {
  currentRecord: RecordType | null
  draft: RoutingConfigDraft
  mode: ModalMode | null
}

interface RoutingConfigTextFilter<RecordType extends object> {
  key: string
  label: string
  match?: (record: RecordType, value: string) => boolean
  options?: RoutingConfigSelectOption[]
  placeholder?: string
  type: 'select' | 'text'
  width?: number
}

interface RoutingConfigMultiSelectFilter<RecordType extends object> {
  key: string
  label: string
  match?: (record: RecordType, value: string[]) => boolean
  options?: RoutingConfigSelectOption[]
  placeholder?: string
  type: 'multiSelect'
  width?: number
}

export type RoutingConfigFilter<RecordType extends object> =
  | RoutingConfigTextFilter<RecordType>
  | RoutingConfigMultiSelectFilter<RecordType>

interface RoutingConfigCrudPageProps<RecordType extends object> {
  actionColumnTitle?: string
  actionLabels?: {
    delete: string
    edit: string
    view: string
  }
  addButtonText?: string
  columns: ColumnsType<RecordType>
  createDraft: () => RoutingConfigDraft
  data: RecordType[]
  description?: ReactNode
  draftToRecord: (
    draft: RoutingConfigDraft,
    currentRecord: RecordType | null,
  ) => RecordType
  emptyFilterLabel?: string
  entityName?: string
  eyebrow?: ReactNode
  extraContent?: ReactNode
  fields:
    | RoutingConfigField[]
    | ((
        context: RoutingConfigFieldContext<RecordType>,
      ) => RoutingConfigField[])
  filters?: Array<RoutingConfigFilter<RecordType>>
  getDeleteBlockReason?: (record: RecordType) => string | null
  idField: keyof RecordType
  modalLabels?: {
    add?: string
    cancel?: string
    close?: string
    delete?: string
    edit?: string
    save?: string
    view?: string
  }
  recordToDraft: (record: RecordType) => RoutingConfigDraft
  resetButtonText?: string
  searchFields: Array<keyof RecordType>
  searchButtonText?: string
  tableScrollX?: number
  title: string
  validationMessage?: string
  validateDraft?: (
    draft: RoutingConfigDraft,
    currentRecord: RecordType | null,
  ) => string[]
  onDelete: (record: RecordType) => void
  onSave: (record: RecordType) => void
}

type ModalMode = 'add' | 'delete' | 'edit' | 'view'

function createInitialFilterValues<RecordType extends object>(
  filters?: Array<RoutingConfigFilter<RecordType>>,
) {
  return (filters ?? []).reduce<Record<string, RoutingConfigFilterValue>>(
    (currentValues, filter) => ({
      ...currentValues,
      [filter.key]: filter.type === 'multiSelect' ? [] : '',
    }),
    {},
  )
}

function getSearchText<RecordType extends object>(
  record: RecordType,
  searchFields: Array<keyof RecordType>,
) {
  return searchFields
    .map((field) => String(record[field] ?? ''))
    .join(' ')
    .toLowerCase()
}

function formatViewValue(
  field: RoutingConfigField,
  value: RoutingConfigFieldValue,
) {
  if (field.type === 'number') {
    const displayValue = value ?? ''

    return field.addonAfter
      ? `${displayValue} ${field.addonAfter}`
      : String(displayValue)
  }

  if (field.type === 'switch') {
    return value ? 'Yes' : 'No'
  }

  if (field.type === 'multiSelect' && Array.isArray(value)) {
    const optionLabels = new Map(
      field.options?.map((option) => [option.value, option.label]) ?? [],
    )

    return value.map((item) => optionLabels.get(item) ?? item).join(', ')
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (field.type === 'select') {
    return (
      field.options?.find((option) => option.value === value)?.label ??
      String(value ?? '')
    )
  }

  if (field.type === 'statusSwitch') {
    return (
      <RoutingConfigStatusBadge
        status={(value === 'Disabled' ? 'Disabled' : 'Active') as RoutingConfigStatus}
      />
    )
  }

  return String(value ?? '')
}

function renderFieldInput(
  field: RoutingConfigField,
  value: RoutingConfigFieldValue,
  disabled: boolean,
  onChange: (value: RoutingConfigFieldValue) => void,
) {
  if (field.type === 'number') {
    return (
      <InputNumber
        addonAfter={field.addonAfter}
        disabled={disabled}
        max={field.max}
        min={field.min ?? 0}
        value={typeof value === 'number' ? value : 0}
        onChange={(nextValue) => onChange(nextValue ?? 0)}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <Select
        disabled={disabled}
        options={field.options}
        value={typeof value === 'string' ? value : undefined}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'multiSelect') {
    return (
      <Select
        disabled={disabled}
        maxTagCount="responsive"
        mode="multiple"
        options={field.options}
        value={Array.isArray(value) ? value : []}
        onChange={(nextValue) => onChange(nextValue)}
      />
    )
  }

  if (field.type === 'switch') {
    return (
      <Switch
        checked={Boolean(value)}
        checkedChildren="On"
        disabled={disabled}
        unCheckedChildren="Off"
        onChange={onChange}
      />
    )
  }

  if (field.type === 'statusSwitch') {
    const isChecked = value !== 'Disabled'
    const statusText = isChecked
      ? field.switchLabels?.checked ?? 'Enabled'
      : field.switchLabels?.unchecked ?? 'Disabled'

    return (
      <span className="routing-config-status-control">
        <Switch
          checked={isChecked}
          className="routing-config-status-switch"
          disabled={disabled}
          size="small"
          onChange={(checked) => onChange(checked ? 'Active' : 'Disabled')}
        />
        <span className="routing-config-status-control__text">
          {statusText}
        </span>
      </span>
    )
  }

  if (field.type === 'textarea') {
    return (
      <Input.TextArea
        disabled={disabled}
        rows={field.rows ?? 3}
        value={String(value ?? '')}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  return (
    <Input
      disabled={disabled}
      value={String(value ?? '')}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export function RoutingConfigCrudPage<RecordType extends object>({
  actionColumnTitle = 'Actions',
  actionLabels = {
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
  },
  addButtonText = 'Add',
  columns,
  createDraft,
  data,
  draftToRecord,
  emptyFilterLabel = 'All',
  entityName,
  extraContent,
  fields,
  filters,
  getDeleteBlockReason,
  idField,
  modalLabels,
  recordToDraft,
  resetButtonText = 'Reset',
  searchFields,
  searchButtonText = 'Search',
  tableScrollX,
  title,
  validationMessage = 'Please resolve validation issues.',
  validateDraft,
  onDelete,
  onSave,
}: RoutingConfigCrudPageProps<RecordType>) {
  const [draft, setDraft] = useState<RoutingConfigDraft>({})
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDraft, setSearchDraft] = useState('')
  const [filterDraft, setFilterDraft] = useState(() =>
    createInitialFilterValues(filters),
  )
  const [appliedFilters, setAppliedFilters] = useState(() =>
    createInitialFilterValues(filters),
  )
  const [notice, setNotice] = useState<string | null>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const hasConfiguredFilters = Boolean(filters?.length)
  const paginationConfig = {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} records`,
  }

  const filteredData = useMemo(() => {
    if (hasConfiguredFilters && filters) {
      return data.filter((record) =>
        filters.every((filter) => {
          const rawFilterValue = appliedFilters[filter.key]

          if (filter.type === 'multiSelect') {
            const selectedValues = Array.isArray(rawFilterValue)
              ? rawFilterValue
              : []

            if (selectedValues.length === 0) {
              return true
            }

            if (filter.match) {
              return filter.match(record, selectedValues)
            }

            const recordValue = (record as Record<string, unknown>)[filter.key]

            if (Array.isArray(recordValue)) {
              return selectedValues.some((value) => recordValue.includes(value))
            }

            return selectedValues.includes(String(recordValue ?? ''))
          }

          const filterValue =
            typeof rawFilterValue === 'string' ? rawFilterValue.trim() : ''

          if (!filterValue) {
            return true
          }

          if (filter.match) {
            return filter.match(record, filterValue)
          }

          return String(
            (record as Record<string, unknown>)[filter.key] ?? '',
          )
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        }),
      )
    }

    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return data
    }

    return data.filter((record) =>
      getSearchText(record, searchFields).includes(query),
    )
  }, [
    appliedFilters,
    data,
    filters,
    hasConfiguredFilters,
    searchFields,
    searchQuery,
  ])

  const validationErrors = useMemo(
    () => validateDraft?.(draft, selectedRecord) ?? [],
    [draft, selectedRecord, validateDraft],
  )
  const visibleValidationErrors = submitAttempted ? validationErrors : []
  const deleteBlockReason =
    modalMode === 'delete' && selectedRecord && getDeleteBlockReason
      ? getDeleteBlockReason(selectedRecord)
      : null
  const isReadOnly = modalMode === 'view' || modalMode === 'delete'
  const resolvedFields = useMemo(
    () =>
      typeof fields === 'function'
        ? fields({
            currentRecord: selectedRecord,
            draft,
            mode: modalMode,
          })
        : fields,
    [draft, fields, modalMode, selectedRecord],
  )
  const modalTitle =
    modalMode === 'add'
      ? modalLabels?.add ?? `Add ${entityName ?? title}`
      : modalMode === 'edit'
        ? modalLabels?.edit ?? `Edit ${entityName ?? title}`
        : modalMode === 'delete'
          ? modalLabels?.delete ?? `Delete ${entityName ?? title}`
          : modalLabels?.view ?? `View ${entityName ?? title}`

  const openModal = (mode: ModalMode, record?: RecordType) => {
    setSelectedRecord(record ?? null)
    setDraft(record ? recordToDraft(record) : createDraft())
    setModalMode(mode)
    setNotice(null)
    setSubmitAttempted(false)
  }

  const closeModal = () => {
    setDraft({})
    setModalMode(null)
    setSelectedRecord(null)
    setSubmitAttempted(false)
  }

  const handleSave = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const nextRecord = draftToRecord(draft, selectedRecord)
    onSave(nextRecord)
    setNotice(`${title} saved locally for this demo session.`)
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedRecord || deleteBlockReason) {
      return
    }

    onDelete(selectedRecord)
    setNotice(`${title} deleted locally for this demo session.`)
    closeModal()
  }

  const handleSearch = () => {
    if (hasConfiguredFilters) {
      setAppliedFilters(filterDraft)
      return
    }

    setSearchQuery(searchDraft)
  }

  const handleReset = () => {
    if (!hasConfiguredFilters) {
      setSearchDraft('')
      setSearchQuery('')
      return
    }

    const resetValues = createInitialFilterValues(filters)

    setFilterDraft(resetValues)
    setAppliedFilters(resetValues)
  }

  const actionColumns: ColumnsType<RecordType> = [
    ...columns,
    {
      fixed: 'right',
      title: actionColumnTitle,
      width: 156,
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`${actionLabels.view} ${String(record[idField])}`}
            title={actionLabels.view}
            type="button"
            onClick={() => openModal('view', record)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`${actionLabels.edit} ${String(record[idField])}`}
            title={actionLabels.edit}
            type="button"
            onClick={() => openModal('edit', record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`${actionLabels.delete} ${String(record[idField])}`}
            title={actionLabels.delete}
            type="button"
            onClick={() => openModal('delete', record)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer title={title}>
      <section className="routing-config-page">
        {notice && (
          <Alert
            showIcon
            className="routing-config-page__notice"
            message={notice}
            type="success"
          />
        )}
        {extraContent}
        <BaseCard compact>
          <div className="routing-config-page__admin-toolbar">
            <div className="routing-config-page__query-group">
              {hasConfiguredFilters && filters ? (
                <div className="routing-config-page__filters">
                  {filters.map((filter) => (
                    <label
                      key={filter.key}
                      className="routing-config-page__filter"
                      style={{ width: filter.width }}
                    >
                      <span>{filter.label}</span>
                      {filter.type === 'multiSelect' ? (
                        <Select
                          maxTagCount="responsive"
                          mode="multiple"
                          options={filter.options}
                          placeholder={filter.placeholder}
                          value={
                            Array.isArray(filterDraft[filter.key])
                              ? filterDraft[filter.key]
                              : []
                          }
                          onChange={(value) =>
                            setFilterDraft((currentValues) => ({
                              ...currentValues,
                              [filter.key]: value,
                            }))
                          }
                        />
                      ) : filter.type === 'select' ? (
                        <Select
                          options={[
                            { label: emptyFilterLabel, value: '' },
                            ...(filter.options ?? []),
                          ]}
                          value={
                            typeof filterDraft[filter.key] === 'string'
                              ? filterDraft[filter.key]
                              : ''
                          }
                          onChange={(value) =>
                            setFilterDraft((currentValues) => ({
                              ...currentValues,
                              [filter.key]: value,
                            }))
                          }
                        />
                      ) : (
                        <Input
                          placeholder={filter.placeholder}
                          value={
                            typeof filterDraft[filter.key] === 'string'
                              ? filterDraft[filter.key]
                              : ''
                          }
                          onChange={(event) =>
                            setFilterDraft((currentValues) => ({
                              ...currentValues,
                              [filter.key]: event.target.value,
                            }))
                          }
                          onPressEnter={handleSearch}
                        />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="routing-config-page__filters">
                  <label
                    className="routing-config-page__filter"
                    style={{ width: 240 }}
                  >
                    <span>Keyword</span>
                    <SearchInput
                      placeholder={`Search ${title}`}
                      value={searchDraft}
                      onChange={(event) => setSearchDraft(event.target.value)}
                      onPressEnter={handleSearch}
                    />
                  </label>
                </div>
              )}
              <div className="routing-config-page__admin-actions">
                <BaseButton variant="primary" onClick={handleSearch}>
                  {searchButtonText}
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  {resetButtonText}
                </BaseButton>
              </div>
            </div>
            <div className="routing-config-page__add-action">
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={() => openModal('add')}
              >
                {addButtonText}
              </BaseButton>
            </div>
          </div>
          <BaseTable<RecordType>
            columns={actionColumns}
            dataSource={filteredData}
            pagination={paginationConfig}
            rowKey={(record) => String(record[idField])}
            scroll={tableScrollX ? { x: tableScrollX } : undefined}
            size="small"
          />
        </BaseCard>
      </section>

      <BaseModal
        className="routing-config-crud-modal"
        kind="detail"
        open={Boolean(modalMode)}
        title={modalTitle}
        width={720}
        onCancel={closeModal}
      >
        {modalMode === 'delete' ? (
          <div className="routing-config-crud-modal__delete">
            {deleteBlockReason ? (
              <Alert
                showIcon
                message="This record cannot be deleted."
                type="warning"
                description={deleteBlockReason}
              />
            ) : (
              <Alert
                showIcon
                message={`Delete ${String(selectedRecord?.[idField] ?? '')}?`}
                type="warning"
                description="This only changes the current demo session."
              />
            )}
          </div>
        ) : (
          <div
            className={`routing-config-crud-modal__form ${
              resolvedFields.length <= 3
                ? 'routing-config-crud-modal__form--compact'
                : ''
            }`}
          >
            {visibleValidationErrors.length > 0 && (
              <Alert
                showIcon
                className="routing-config-crud-modal__validation"
                message={validationMessage}
                type="warning"
                description={
                  <ul>
                    {visibleValidationErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                }
              />
            )}
            {resolvedFields.map((field) => {
              const disabled =
                isReadOnly ||
                Boolean(field.readOnly) ||
                (modalMode === 'edit' && Boolean(field.readOnlyOnEdit))
              const value = draft[field.key]
              const fieldClassName = `routing-config-crud-modal__field${
                field.fullWidth ? ' routing-config-crud-modal__field--full' : ''
              }`

              return (
                <label key={field.key} className={fieldClassName}>
                  <span>
                    {field.label}
                    {field.required && <strong>*</strong>}
                  </span>
                  {isReadOnly ? (
                    <em>{formatViewValue(field, value)}</em>
                  ) : (
                    renderFieldInput(field, value, disabled, (nextValue) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        [field.key]: nextValue,
                      })),
                    )
                  )}
                  {field.helper && <small>{field.helper}</small>}
                </label>
              )
            })}
          </div>
        )}
        <div className="routing-config-crud-modal__footer">
          <BaseButton variant="secondary" onClick={closeModal}>
            {isReadOnly
              ? modalLabels?.close ?? 'Close'
              : modalLabels?.cancel ?? 'Cancel'}
          </BaseButton>
          {modalMode === 'delete' && !deleteBlockReason && (
            <BaseButton variant="danger" onClick={handleDelete}>
              {modalLabels?.delete ?? 'Delete'}
            </BaseButton>
          )}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <BaseButton variant="primary" onClick={handleSave}>
              {modalLabels?.save ?? 'Save'}
            </BaseButton>
          )}
        </div>
      </BaseModal>
    </PageContainer>
  )
}
