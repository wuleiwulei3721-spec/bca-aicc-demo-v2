import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Alert, Input, Popover, Select, Switch } from 'antd'
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
  StatusBadge,
} from '../../components'
import { isCommonPhraseDemoMode } from '../../config/commonPhraseMode'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import {
  useAppStore,
  useAuthStore,
  useCommonPhraseStore,
} from '../../store'
import type {
  CommonPhraseCategory,
  CommonPhraseEntry,
  CommonPhraseStatus,
} from '../../types'
import type { CommonPhraseQuery } from '../../api/commonPhraseApi'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

type CommonPhraseModalMode = 'create' | 'edit' | null

interface CommonPhraseFilters {
  phraseText: string
  shortcutCode: string
  status: '' | CommonPhraseStatus
}

interface CommonPhraseDraft {
  categoryId: string
  phraseId?: string
  phraseText: string
  remark: string
  shortcutCode: string
  status: CommonPhraseStatus
}

const allCategoriesKey = '__all__'
const commonPhraseTabKey = 'page:call-management-common-phrases'
const COMMON_PHRASE_SHORTCUT_CODE_MAX_LENGTH = 50
const COMMON_PHRASE_MAX_LENGTH = 2000
const COMMON_PHRASE_REMARK_MAX_LENGTH = 2000

const defaultFilters: CommonPhraseFilters = {
  phraseText: '',
  shortcutCode: '',
  status: '',
}

const defaultDraft: CommonPhraseDraft = {
  categoryId: '',
  phraseText: '',
  remark: '',
  shortcutCode: '',
  status: 'Active',
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

const statusOptions: Array<{
  label: string
  value: '' | CommonPhraseStatus
}> = [
  { label: 'All Statuses', value: '' },
  { label: 'Enabled', value: 'Active' },
  { label: 'Disabled', value: 'Disabled' },
]

function toQuery(
  filters: CommonPhraseFilters,
  categoryId: string,
): CommonPhraseQuery {
  return {
    categoryId: categoryId === allCategoriesKey ? undefined : categoryId,
    phraseText: filters.phraseText.trim() || undefined,
    shortcutCode: filters.shortcutCode.trim() || undefined,
    status: filters.status || undefined,
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'The Common Phrase request failed.'
}

function renderStatusBadge(status: CommonPhraseStatus) {
  return (
    <StatusBadge
      dot
      label={status === 'Active' ? 'Enabled' : 'Disabled'}
      size="small"
      status={status === 'Active' ? 'success' : 'disabled'}
    />
  )
}

export function CommonPhraseManagementPage() {
  const activeWorkspaceTabKey = useAppStore(
    (state) => state.activeWorkspaceTabKey,
  )
  const authSession = useAuthStore((state) => state.session)
  const categories = useCommonPhraseStore((state) => state.categories)
  const categoryCounts = useCommonPhraseStore((state) => state.categoryCounts)
  const entries = useCommonPhraseStore((state) => state.entries)
  const error = useCommonPhraseStore((state) => state.error)
  const isLoading = useCommonPhraseStore((state) => state.isLoading)
  const isMutating = useCommonPhraseStore((state) => state.isMutating)
  const load = useCommonPhraseStore((state) => state.load)
  const createCategory = useCommonPhraseStore((state) => state.createCategory)
  const renameCategory = useCommonPhraseStore((state) => state.renameCategory)
  const deleteCategory = useCommonPhraseStore((state) => state.deleteCategory)
  const createPhrase = useCommonPhraseStore((state) => state.createPhrase)
  const updatePhrase = useCommonPhraseStore((state) => state.updatePhrase)
  const deletePhrase = useCommonPhraseStore((state) => state.deletePhrase)
  const movePhrases = useCommonPhraseStore((state) => state.movePhrases)
  const [appliedFilters, setAppliedFilters] =
    useState<CommonPhraseFilters>(defaultFilters)
  const [categorySearch, setCategorySearch] = useState('')
  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<CommonPhraseCategory | null>(null)
  const [deleteEntryTarget, setDeleteEntryTarget] =
    useState<CommonPhraseEntry | null>(null)
  const [draft, setDraft] = useState<CommonPhraseDraft>(defaultDraft)
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [filterDraft, setFilterDraft] =
    useState<CommonPhraseFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<CommonPhraseModalMode>(null)
  const [movePopoverOpen, setMovePopoverOpen] = useState(false)
  const [moveTargetCategoryId, setMoveTargetCategoryId] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const { notify } = useOperationFeedback()
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(allCategoriesKey)
  const [selectedPhraseIds, setSelectedPhraseIds] = useState<string[]>([])
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const appliedQueryRef = useRef<CommonPhraseQuery>(
    toQuery(defaultFilters, allCategoriesKey),
  )

  const isPageActive = activeWorkspaceTabKey === commonPhraseTabKey

  useEffect(() => {
    appliedQueryRef.current = toQuery(appliedFilters, selectedCategoryId)
  }, [appliedFilters, selectedCategoryId])

  useEffect(() => {
    if (!isPageActive) {
      return
    }

    void load(appliedQueryRef.current).catch(() => undefined)
  }, [isPageActive, load])

  const categoryNameById = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.categoryId,
          category.categoryName,
        ]),
      ),
    [categories],
  )
  const selectedRecords = useMemo(() => {
    const selectedIdSet = new Set(selectedPhraseIds)

    return entries.filter((entry) => selectedIdSet.has(entry.phraseId))
  }, [entries, selectedPhraseIds])
  const selectedRecordCategoryIds = useMemo(
    () => new Set(selectedRecords.map((entry) => entry.categoryId)),
    [selectedRecords],
  )
  const isCrossCategorySelectionFromAll =
    selectedCategoryId === allCategoriesKey &&
    selectedRecordCategoryIds.size > 1
  const allEntryCount = useMemo(
    () =>
      Object.values(categoryCounts).reduce(
        (total, count) => total + count,
        0,
      ),
    [categoryCounts],
  )
  const visibleCategories = useMemo(() => {
    const keyword = normalizeValue(categorySearch)

    return categories.filter((category) =>
      keyword
        ? category.categoryName.toLowerCase().includes(keyword)
        : true,
    )
  }, [categories, categorySearch])
  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const shortcutKeyword = normalizeValue(appliedFilters.shortcutCode)
        const phraseKeyword = normalizeValue(appliedFilters.phraseText)
        const categoryMatched =
          selectedCategoryId === allCategoriesKey
            ? true
            : entry.categoryId === selectedCategoryId
        const shortcutMatched = shortcutKeyword
          ? entry.shortcutCode.toLowerCase().includes(shortcutKeyword)
          : true
        const phraseMatched = phraseKeyword
          ? entry.phraseText.toLowerCase().includes(phraseKeyword)
          : true
        const statusMatched = appliedFilters.status
          ? entry.status === appliedFilters.status
          : true

        return categoryMatched && shortcutMatched && phraseMatched && statusMatched
      }),
    [appliedFilters, entries, selectedCategoryId],
  )
  const moveCategoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        disabled:
          !isCrossCategorySelectionFromAll &&
          selectedRecordCategoryIds.has(category.categoryId),
        label: category.categoryName,
        value: category.categoryId,
      })),
    [categories, isCrossCategorySelectionFromAll, selectedRecordCategoryIds],
  )
  const canMoveSelected =
    selectedPhraseIds.length > 0 &&
    moveCategoryOptions.some((option) => !option.disabled)
  const defaultPhraseCategoryId =
    selectedCategoryId !== allCategoriesKey
      ? selectedCategoryId
      : categories[0]?.categoryId ?? ''
  const canAddPhrase = Boolean(defaultPhraseCategoryId)

  const isDuplicateCategoryName = (
    categoryName: string,
    exceptCategoryId = '',
  ) => {
    const normalizedName = normalizeValue(categoryName)

    return categories.some(
      (category) =>
        category.categoryId !== exceptCategoryId &&
        normalizeValue(category.categoryName) === normalizedName,
    )
  }

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const shortcutCode = draft.shortcutCode.trim()
    const phraseText = draft.phraseText.trim()
    const remark = draft.remark.trim()

    if (!shortcutCode) {
      errors.push('Shortcut Code is required.')
    } else if (shortcutCode.length > COMMON_PHRASE_SHORTCUT_CODE_MAX_LENGTH) {
      errors.push(
        `Shortcut Code must be ${COMMON_PHRASE_SHORTCUT_CODE_MAX_LENGTH} characters or fewer.`,
      )
    } else {
      const normalizedShortcutCode = normalizeValue(shortcutCode)
      const hasDuplicateShortcutCode = entries.some(
        (entry) =>
          entry.phraseId !== draft.phraseId &&
          normalizeValue(entry.shortcutCode) === normalizedShortcutCode,
      )

      if (hasDuplicateShortcutCode) {
        errors.push('Shortcut Code already exists.')
      }
    }

    if (!phraseText) {
      errors.push('Common Phrase is required.')
    } else if (phraseText.length > COMMON_PHRASE_MAX_LENGTH) {
      errors.push(
        `Common Phrase must be ${COMMON_PHRASE_MAX_LENGTH} characters or fewer.`,
      )
    }

    if (!draft.categoryId || !categoryNameById.has(draft.categoryId)) {
      errors.push('Category is required.')
    }

    if (remark.length > COMMON_PHRASE_REMARK_MAX_LENGTH) {
      errors.push(
        `Remark must be ${COMMON_PHRASE_REMARK_MAX_LENGTH} characters or fewer.`,
      )
    }

    return errors
  }, [
    categoryNameById,
    draft.categoryId,
    draft.phraseId,
    draft.phraseText,
    draft.remark,
    draft.shortcutCode,
    entries,
    modalMode,
  ])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setSelectedPhraseIds([])
    setMovePopoverOpen(false)
    setMoveTargetCategoryId('')
    void load(toQuery(appliedFilters, categoryId)).catch(() => undefined)
  }

  const handleCreateCategory = async () => {
    const categoryName = newCategoryName.trim()

    if (!categoryName || isDuplicateCategoryName(categoryName)) {
      return
    }

    try {
      const category = await createCategory(categoryName)
      setNewCategoryName('')
      setSelectedCategoryId(category.categoryId)
      notify('Common phrase category added.')
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const startRenameCategory = (category: CommonPhraseCategory) => {
    setEditingCategoryId(category.categoryId)
    setEditingCategoryName(category.categoryName)
  }

  const cancelRenameCategory = () => {
    setEditingCategoryId('')
    setEditingCategoryName('')
  }

  const handleRenameCategory = async () => {
    const categoryName = editingCategoryName.trim()

    if (
      !editingCategoryId ||
      !categoryName ||
      isDuplicateCategoryName(categoryName, editingCategoryId)
    ) {
      return
    }

    try {
      await renameCategory(editingCategoryId, categoryName)
      cancelRenameCategory()
      notify('Common phrase category renamed.')
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) {
      return
    }

    const deletedCategoryId = deleteCategoryTarget.categoryId

    try {
      await deleteCategory(deletedCategoryId)
      setDeleteCategoryTarget(null)
      setSelectedPhraseIds([])

      const nextCategoryId =
        selectedCategoryId === deletedCategoryId
          ? allCategoriesKey
          : selectedCategoryId

      if (selectedCategoryId === deletedCategoryId) {
        setSelectedCategoryId(allCategoriesKey)
      }
      await load(toQuery(appliedFilters, nextCategoryId))
      notify('Common phrase category and related phrases deleted.')
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const updateDraft = <Key extends keyof CommonPhraseDraft>(
    key: Key,
    value: CommonPhraseDraft[Key],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  const openCreateModal = () => {
    if (!canAddPhrase) {
      return
    }

    setDraft({
      ...defaultDraft,
      categoryId: defaultPhraseCategoryId,
    })
    setModalMode('create')
    setSubmitAttempted(false)
  }

  const openEditModal = (entry: CommonPhraseEntry) => {
    setDraft({ ...entry })
    setModalMode('edit')
    setSubmitAttempted(false)
  }

  const closeModal = () => {
    setDraft(defaultDraft)
    setModalMode(null)
    setSubmitAttempted(false)
  }

  const handleSavePhrase = async () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const input = {
      categoryId: draft.categoryId,
      phraseText: draft.phraseText.trim(),
      remark: draft.remark.trim(),
      shortcutCode: draft.shortcutCode.trim(),
      status: draft.status,
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
    }

    try {
      if (modalMode === 'edit' && draft.phraseId) {
        await updatePhrase(draft.phraseId, input)
        notify('Common phrase updated.')
      } else {
        await createPhrase(input)
        notify('Common phrase added.')
      }

      closeModal()
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const handleDeleteEntry = async () => {
    if (!deleteEntryTarget) {
      return
    }

    try {
      await deletePhrase(deleteEntryTarget.phraseId)
      setSelectedPhraseIds((currentIds) =>
        currentIds.filter((phraseId) => phraseId !== deleteEntryTarget.phraseId),
      )
      setDeleteEntryTarget(null)
      notify('Common phrase deleted.')
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
    setSelectedPhraseIds([])
    void load(toQuery(filterDraft, selectedCategoryId)).catch(() => undefined)
  }

  const handleReset = () => {
    setAppliedFilters(defaultFilters)
    setFilterDraft(defaultFilters)
    setSelectedPhraseIds([])
    void load(toQuery(defaultFilters, selectedCategoryId)).catch(() => undefined)
  }

  const handleMoveSelected = async () => {
    if (!moveTargetCategoryId || selectedPhraseIds.length === 0) {
      return
    }

    const movedCount = selectedRecords.filter(
      (entry) => entry.categoryId !== moveTargetCategoryId,
    ).length

    try {
      await movePhrases(
        selectedPhraseIds,
        moveTargetCategoryId,
        formatAuditActor(authSession?.employeeId, authSession?.displayName),
      )
      notify(
        movedCount === 1
          ? 'Selected common phrase moved.'
          : `${movedCount} selected common phrases moved.`,
      )
      setSelectedPhraseIds([])
      setMovePopoverOpen(false)
      setMoveTargetCategoryId('')
    } catch (error) {
      notify(errorMessage(error), 'error')
    }
  }

  const movePopoverContent = (
    <div className="common-phrase-management__move-popover">
      <Select
        options={moveCategoryOptions}
        placeholder="Select category"
        value={moveTargetCategoryId || undefined}
        onChange={(value) => setMoveTargetCategoryId(value)}
      />
      <div>
        <BaseButton
          size="small"
          variant="secondary"
          onClick={() => {
            setMovePopoverOpen(false)
            setMoveTargetCategoryId('')
          }}
        >
          Cancel
        </BaseButton>
        <BaseButton
          disabled={!moveTargetCategoryId}
          size="small"
          variant="primary"
          onClick={handleMoveSelected}
        >
          Confirm
        </BaseButton>
      </div>
    </div>
  )

  const columns: ColumnsType<CommonPhraseEntry> = [
    {
      dataIndex: 'shortcutCode',
      title: 'Shortcut Code',
      width: 100,
    },
    {
      dataIndex: 'phraseText',
      ellipsis: true,
      title: 'Common Phrase',
      width: 250,
    },
    {
      dataIndex: 'categoryId',
      render: (categoryId: string) =>
        categoryNameById.get(categoryId) ?? 'Unknown Category',
      title: 'Category',
      width: 96,
    },
    {
      dataIndex: 'sortOrder',
      title: 'Sort Order',
      width: 84,
    },
    {
      dataIndex: 'status',
      render: (status: CommonPhraseStatus) => renderStatusBadge(status),
      title: 'Status',
      width: 92,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
      width: 190,
    },
    {
      dataIndex: 'createdAt',
      render: (createdAt: string) => formatCallManagementDateTime(createdAt),
      title: 'Created Time',
      width: 146,
    },
    {
      dataIndex: 'createdBy',
      title: 'Created By',
      width: 145,
    },
    {
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => formatCallManagementDateTime(updatedAt),
      title: 'Updated Time',
      width: 146,
    },
    {
      dataIndex: 'updatedBy',
      title: 'Updated By',
      width: 145,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions">
          <button
            aria-label={`Edit ${record.shortcutCode}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.shortcutCode}`}
            title="Delete"
            type="button"
            onClick={() => {
              setDeleteEntryTarget(record)
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 86,
    },
  ]

  return (
    <AdminPage
      className="common-phrase-management"
      title="Common Phrase"
    >
      {isCommonPhraseDemoMode && (
        <Alert
          description="Changes are available for this demo session and reset after a page refresh."
          message="Common Phrase Demo Mode"
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
              onClick={() =>
                void load(toQuery(appliedFilters, selectedCategoryId)).catch(
                  () => undefined,
                )
              }
            >
              Retry
            </BaseButton>
          }
          closable
          description={error}
          message="Common Phrase API error"
          showIcon
          type="error"
        />
      )}
      <div className="common-phrase-management__layout">
        <BaseCard compact className="common-phrase-management__categories">
          <div className="common-phrase-management__category-search">
            <Input
              allowClear
              placeholder="Search category"
              value={categorySearch}
              onChange={(event) => setCategorySearch(event.target.value)}
            />
          </div>
          <button
            className={[
              'common-phrase-management__category-item',
              selectedCategoryId === allCategoriesKey
                ? 'is-selected'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            onClick={() => selectCategory(allCategoriesKey)}
          >
            <span>All Categories</span>
            <em>{allEntryCount}</em>
          </button>
          <div className="common-phrase-management__category-list">
            {visibleCategories.map((category) => {
              const isEditing = editingCategoryId === category.categoryId

              return (
                <div
                  className={[
                    'common-phrase-management__category-row',
                    selectedCategoryId === category.categoryId
                      ? 'is-selected'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={category.categoryId}
                >
                  {isEditing ? (
                    <div className="common-phrase-management__category-edit">
                      <Input
                        autoFocus
                        value={editingCategoryName}
                        onChange={(event) =>
                          setEditingCategoryName(event.target.value)
                        }
                        onPressEnter={handleRenameCategory}
                      />
                      <button
                        aria-label="Save category name"
                        type="button"
                        onClick={handleRenameCategory}
                      >
                        <CheckOutlined />
                      </button>
                      <button
                        aria-label="Cancel category name"
                        type="button"
                        onClick={cancelRenameCategory}
                      >
                        <CloseOutlined />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="common-phrase-management__category-main"
                        type="button"
                        onClick={() => selectCategory(category.categoryId)}
                      >
                        <span>{category.categoryName}</span>
                        <em>{categoryCounts[category.categoryId] ?? 0}</em>
                      </button>
                      <div className="common-phrase-management__category-actions">
                        <button
                          aria-label={`Rename ${category.categoryName}`}
                          title="Rename"
                          type="button"
                          onClick={() => startRenameCategory(category)}
                        >
                          <EditOutlined />
                        </button>
                        <button
                          aria-label={`Delete ${category.categoryName}`}
                          title="Delete"
                          type="button"
                          onClick={() => {
                            setDeleteCategoryTarget(category)
                          }}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <div className="common-phrase-management__category-create">
            <Input
              placeholder="New category"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              onPressEnter={handleCreateCategory}
            />
            <BaseButton
              disabled={
                !newCategoryName.trim() ||
                isDuplicateCategoryName(newCategoryName) ||
                isMutating
              }
              icon={<FolderAddOutlined />}
              variant="primary"
              onClick={handleCreateCategory}
            >
              Add
            </BaseButton>
          </div>
        </BaseCard>
        <BaseCard compact className="common-phrase-management__content">
          <AdminToolbar
            actions={
              <>
                <BaseButton
                  disabled={isLoading || isMutating}
                  variant="primary"
                  onClick={handleSearch}
                >
                  Search
                </BaseButton>
                <BaseButton
                  disabled={isLoading || isMutating}
                  variant="secondary"
                  onClick={handleReset}
                >
                  Reset
                </BaseButton>
              </>
            }
            filters={
              <>
                <AdminFilterField label="Shortcut Code" width={220}>
                  <Input
                    placeholder="Shortcut Code"
                    value={filterDraft.shortcutCode}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        shortcutCode: event.target.value,
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
                <AdminFilterField label="Common Phrase" width={260}>
                  <Input
                    placeholder="Common Phrase"
                    value={filterDraft.phraseText}
                    onChange={(event) =>
                      setFilterDraft((currentDraft) => ({
                        ...currentDraft,
                        phraseText: event.target.value,
                      }))
                    }
                  />
                </AdminFilterField>
              </>
            }
            primaryActions={
              <div className="call-management-list__add-actions">
                <BaseButton
                  disabled={!canAddPhrase || isMutating}
                  icon={<PlusOutlined />}
                  loading={isMutating}
                  title={
                    canAddPhrase
                      ? undefined
                      : 'Create a category before adding a phrase.'
                  }
                  variant="primary"
                  onClick={openCreateModal}
                >
                  Add
                </BaseButton>
                <Popover
                  content={movePopoverContent}
                  open={movePopoverOpen}
                  placement="bottomRight"
                  trigger="click"
                  onOpenChange={(open) => {
                    if (!canMoveSelected) {
                      setMovePopoverOpen(false)
                      return
                    }

                    setMovePopoverOpen(open)
                    if (!open) {
                      setMoveTargetCategoryId('')
                    }
                  }}
                >
                  <BaseButton
                    disabled={!canMoveSelected || isMutating}
                    icon={<SwapOutlined />}
                    variant="secondary"
                  >
                    Move to Category
                  </BaseButton>
                </Popover>
              </div>
            }
          />
          <AdminTable<CommonPhraseEntry>
            columns={columns}
            dataSource={filteredEntries}
            horizontalScroll={1400}
            loading={isLoading}
            pagination={{}}
            rowKey="phraseId"
            rowSelection={{
              preserveSelectedRowKeys: true,
              selectedRowKeys: selectedPhraseIds,
              onChange: (selectedRowKeys) =>
                setSelectedPhraseIds(selectedRowKeys.map(String)),
            }}
          />
        </BaseCard>
      </div>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={modalMode === 'edit' ? 'Edit Common Phrase' : 'Add Common Phrase'}
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
            <AdminFormField label="Shortcut Code" required>
              <LimitedInput
                maxLength={COMMON_PHRASE_SHORTCUT_CODE_MAX_LENGTH}
                value={draft.shortcutCode}
                onChange={(event) =>
                  updateDraft('shortcutCode', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Category" required>
              <Select
                options={categories.map((category) => ({
                  label: category.categoryName,
                  value: category.categoryId,
                }))}
                value={draft.categoryId || undefined}
                onChange={(value) => updateDraft('categoryId', value)}
              />
            </AdminFormField>
            <AdminFormField label="Common Phrase" required fullWidth>
              <LimitedTextArea
                maxLength={COMMON_PHRASE_MAX_LENGTH}
                rows={5}
                value={draft.phraseText}
                onChange={(event) =>
                  updateDraft('phraseText', event.target.value)
                }
              />
            </AdminFormField>
            <AdminFormField label="Remark" fullWidth>
              <LimitedTextArea
                maxLength={COMMON_PHRASE_REMARK_MAX_LENGTH}
                rows={3}
                value={draft.remark}
                onChange={(event) => updateDraft('remark', event.target.value)}
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
          </div>
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeModal}>
            Cancel
          </BaseButton>
          <BaseButton
            loading={isMutating}
            variant="primary"
            onClick={handleSavePhrase}
          >
            Save
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
      <AdminModal
        destroyOnClose
        open={Boolean(deleteEntryTarget)}
        title="Delete Common Phrase"
        width={520}
        onCancel={() => setDeleteEntryTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the selected common phrase in the current demo session."
            message={`Delete shortcut ${
              deleteEntryTarget?.shortcutCode ?? ''
            }?`}
            type="warning"
          />
        </div>
        <AdminModalFooter>
          <BaseButton
            variant="secondary"
            onClick={() => setDeleteEntryTarget(null)}
          >
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={handleDeleteEntry}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
      <AdminModal
        destroyOnClose
        open={Boolean(deleteCategoryTarget)}
        title="Delete Common Phrase Category"
        width={560}
        onCancel={() => setDeleteCategoryTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the category and all common phrases under it in the current demo session."
            message={`Delete category ${
              deleteCategoryTarget?.categoryName ?? ''
            }?`}
            type="warning"
          />
        </div>
        <AdminModalFooter>
          <BaseButton
            variant="secondary"
            onClick={() => setDeleteCategoryTarget(null)}
          >
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={confirmDeleteCategory}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
