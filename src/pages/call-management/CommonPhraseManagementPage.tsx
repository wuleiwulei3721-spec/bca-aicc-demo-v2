import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  PlusOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Alert, Input, Popover, Select } from 'antd'
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
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useAuthStore, useCallManagementStore } from '../../store'
import type { CommonPhraseCategory, CommonPhraseEntry } from '../../types'
import {
  formatAuditActor,
  formatCallManagementDateTime,
} from '../../utils/audit'

type CommonPhraseModalMode = 'create' | 'edit' | null

interface CommonPhraseFilters {
  phraseText: string
  shortcutCode: string
}

interface CommonPhraseDraft {
  categoryId: string
  phraseId?: string
  phraseText: string
  shortcutCode: string
}

const allCategoriesKey = '__all__'
const COMMON_PHRASE_MAX_LENGTH = 100

const defaultFilters: CommonPhraseFilters = {
  phraseText: '',
  shortcutCode: '',
}

const defaultDraft: CommonPhraseDraft = {
  categoryId: '',
  phraseText: '',
  shortcutCode: '',
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function createEntityId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

export function CommonPhraseManagementPage() {
  const authSession = useAuthStore((state) => state.session)
  const categories = useCallManagementStore(
    (state) => state.commonPhraseCategories,
  )
  const entries = useCallManagementStore((state) => state.commonPhraseEntries)
  const addCategory = useCallManagementStore(
    (state) => state.addCommonPhraseCategory,
  )
  const renameCategory = useCallManagementStore(
    (state) => state.renameCommonPhraseCategory,
  )
  const deleteCategory = useCallManagementStore(
    (state) => state.deleteCommonPhraseCategory,
  )
  const addEntry = useCallManagementStore((state) => state.addCommonPhraseEntry)
  const updateEntry = useCallManagementStore(
    (state) => state.updateCommonPhraseEntry,
  )
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteCommonPhraseEntries,
  )
  const moveEntries = useCallManagementStore(
    (state) => state.moveCommonPhraseEntries,
  )
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
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()

    entries.forEach((entry) => {
      counts.set(entry.categoryId, (counts.get(entry.categoryId) ?? 0) + 1)
    })

    return counts
  }, [entries])
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

        return categoryMatched && shortcutMatched && phraseMatched
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

    if (!shortcutCode) {
      errors.push('Shortcut Code is required.')
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

    return errors
  }, [
    categoryNameById,
    draft.categoryId,
    draft.phraseId,
    draft.phraseText,
    draft.shortcutCode,
    entries,
    modalMode,
  ])

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setSelectedPhraseIds([])
    setMovePopoverOpen(false)
    setMoveTargetCategoryId('')
  }

  const handleCreateCategory = () => {
    const categoryName = newCategoryName.trim()

    if (!categoryName || isDuplicateCategoryName(categoryName)) {
      return
    }

    const category: CommonPhraseCategory = {
      categoryId: createEntityId('public-category'),
      categoryName,
    }

    addCategory(category)
    setNewCategoryName('')
    setSelectedCategoryId(category.categoryId)
    notify('Common phrase category added.')
  }

  const startRenameCategory = (category: CommonPhraseCategory) => {
    setEditingCategoryId(category.categoryId)
    setEditingCategoryName(category.categoryName)
  }

  const cancelRenameCategory = () => {
    setEditingCategoryId('')
    setEditingCategoryName('')
  }

  const handleRenameCategory = () => {
    const categoryName = editingCategoryName.trim()

    if (
      !editingCategoryId ||
      !categoryName ||
      isDuplicateCategoryName(categoryName, editingCategoryId)
    ) {
      return
    }

    renameCategory(editingCategoryId, categoryName)
    cancelRenameCategory()
    notify('Common phrase category renamed.')
  }

  const confirmDeleteCategory = () => {
    if (!deleteCategoryTarget) {
      return
    }

    const deletedCategoryId = deleteCategoryTarget.categoryId

    deleteCategory(deletedCategoryId)
    setDeleteCategoryTarget(null)
    setSelectedPhraseIds([])

    if (selectedCategoryId === deletedCategoryId) {
      setSelectedCategoryId(allCategoriesKey)
    }

    notify('Common phrase category and related phrases deleted.')
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

  const handleSavePhrase = () => {
    setSubmitAttempted(true)

    if (validationErrors.length > 0) {
      return
    }

    const nextEntry: CommonPhraseEntry = {
      categoryId: draft.categoryId,
      phraseId: draft.phraseId ?? createEntityId('public-phrase'),
      phraseText: draft.phraseText.trim(),
      shortcutCode: draft.shortcutCode.trim(),
      updatedAt: formatCallManagementDateTime(new Date()),
      updatedBy: formatAuditActor(
        authSession?.employeeId,
        authSession?.displayName,
      ),
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      notify('Common phrase updated.')
    } else {
      addEntry(nextEntry)
      notify('Common phrase added.')
    }

    closeModal()
  }

  const handleDeleteEntry = () => {
    if (!deleteEntryTarget) {
      return
    }

    deleteEntries([deleteEntryTarget.phraseId])
    setSelectedPhraseIds((currentIds) =>
      currentIds.filter((phraseId) => phraseId !== deleteEntryTarget.phraseId),
    )
    setDeleteEntryTarget(null)
    notify('Common phrase deleted.')
  }

  const handleSearch = () => {
    setAppliedFilters({ ...filterDraft })
    setSelectedPhraseIds([])
  }

  const handleReset = () => {
    setAppliedFilters(defaultFilters)
    setFilterDraft(defaultFilters)
    setSelectedPhraseIds([])
  }

  const handleMoveSelected = () => {
    if (!moveTargetCategoryId || selectedPhraseIds.length === 0) {
      return
    }

    const movedCount = selectedRecords.filter(
      (entry) => entry.categoryId !== moveTargetCategoryId,
    ).length

    moveEntries(
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
      width: 280,
    },
    {
      dataIndex: 'categoryId',
      render: (categoryId: string) =>
        categoryNameById.get(categoryId) ?? 'Unknown Category',
      title: 'Category',
      width: 96,
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
      width: 170,
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
            <em>{entries.length}</em>
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
                        <em>{categoryCounts.get(category.categoryId) ?? 0}</em>
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
                isDuplicateCategoryName(newCategoryName)
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
                  disabled={!canAddPhrase}
                  icon={<PlusOutlined />}
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
                    disabled={!canMoveSelected}
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
              <Input
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
          </div>
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeModal}>
            Cancel
          </BaseButton>
          <BaseButton variant="primary" onClick={handleSavePhrase}>
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
