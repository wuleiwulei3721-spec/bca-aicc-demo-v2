import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Input, Select } from 'antd'
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
import {
  sensitiveWordCategoryLabels,
  sensitiveWordCategoryOptions,
} from '../../mock/sensitiveWords'
import { useCallManagementStore } from '../../store'
import type { SensitiveWordCategory, SensitiveWordEntry } from '../../types'

type SensitiveWordModalMode = 'create' | 'edit' | null

interface SensitiveWordFilters {
  category: '' | SensitiveWordCategory
  word: string
}

interface SensitiveWordDraft {
  category: SensitiveWordCategory
  id?: string
  remark: string
  word: string
}

const defaultFilters: SensitiveWordFilters = {
  category: '',
  word: '',
}

const defaultDraft: SensitiveWordDraft = {
  category: 'security-credential',
  remark: '',
  word: '',
}

const allCategoryOptions: Array<{
  label: string
  value: '' | SensitiveWordCategory
}> = [{ label: 'All', value: '' }, ...sensitiveWordCategoryOptions]

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function getNextSensitiveWordId(entries: SensitiveWordEntry[]) {
  const nextSequence =
    entries.reduce((maxSequence, entry) => {
      const match = /^SW(\d+)$/.exec(entry.id)

      return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
    }, 0) + 1

  return `SW${String(nextSequence).padStart(3, '0')}`
}

export function SensitiveWordManagementPage() {
  const entries = useCallManagementStore((state) => state.sensitiveWordEntries)
  const addEntry = useCallManagementStore(
    (state) => state.addSensitiveWordEntry,
  )
  const updateEntry = useCallManagementStore(
    (state) => state.updateSensitiveWordEntry,
  )
  const deleteEntries = useCallManagementStore(
    (state) => state.deleteSensitiveWordEntries,
  )
  const [appliedFilters, setAppliedFilters] =
    useState<SensitiveWordFilters>(defaultFilters)
  const [deleteTarget, setDeleteTarget] =
    useState<SensitiveWordEntry | null>(null)
  const [draft, setDraft] = useState<SensitiveWordDraft>(defaultDraft)
  const [filterDraft, setFilterDraft] =
    useState<SensitiveWordFilters>(defaultFilters)
  const [modalMode, setModalMode] = useState<SensitiveWordModalMode>(null)
  const { notify } = useOperationFeedback()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const wordKeyword = normalizeValue(appliedFilters.word)
        const wordMatched = wordKeyword
          ? entry.word.toLowerCase().includes(wordKeyword)
          : true
        const categoryMatched = appliedFilters.category
          ? entry.category === appliedFilters.category
          : true

        return wordMatched && categoryMatched
      }),
    [appliedFilters, entries],
  )

  const validationErrors = useMemo(() => {
    if (!modalMode) {
      return []
    }

    const errors: string[] = []
    const normalizedWord = normalizeValue(draft.word)

    if (!normalizedWord) {
      errors.push('Sensitive Word is required.')
    }

    if (
      normalizedWord &&
      entries.some(
        (entry) =>
          entry.id !== draft.id && normalizeValue(entry.word) === normalizedWord,
      )
    ) {
      errors.push('Sensitive Word already exists.')
    }

    return errors
  }, [draft.id, draft.word, entries, modalMode])

  const updateDraft = <Key extends keyof SensitiveWordDraft>(
    key: Key,
    value: SensitiveWordDraft[Key],
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
    setFilterDraft(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  const openCreateModal = () => {
    setDraft(defaultDraft)
    setModalMode('create')
    setSubmitAttempted(false)
  }

  const openEditModal = (entry: SensitiveWordEntry) => {
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

    const nextEntry: SensitiveWordEntry = {
      category: draft.category,
      id:
        modalMode === 'edit' && draft.id
          ? draft.id
          : getNextSensitiveWordId(entries),
      remark: draft.remark.trim(),
      word: draft.word.trim(),
    }

    if (modalMode === 'edit') {
      updateEntry(nextEntry)
      notify('Sensitive word updated.')
    } else {
      addEntry(nextEntry)
      notify('Sensitive word added.')
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) {
      return
    }

    deleteEntries([deleteTarget.id])
    notify('Sensitive word deleted.')
    setDeleteTarget(null)
  }

  const columns: ColumnsType<SensitiveWordEntry> = [
    {
      key: 'sequence',
      render: (_, record) =>
        filteredEntries.findIndex((entry) => entry.id === record.id) + 1,
      title: 'No.',
      width: 72,
    },
    {
      dataIndex: 'word',
      title: 'Sensitive Word',
      width: 220,
    },
    {
      dataIndex: 'category',
      render: (category: SensitiveWordCategory) =>
        sensitiveWordCategoryLabels[category],
      title: 'Category',
      width: 260,
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
            aria-label={`Edit ${record.word}`}
            title="Edit"
            type="button"
            onClick={() => openEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${record.word}`}
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
    <AdminPage
      className="sensitive-word-management"
      title="Sensitive Word"
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
              <AdminFilterField label="Sensitive Word" width={260}>
                <Input
                  placeholder="Sensitive Word"
                  value={filterDraft.word}
                  onChange={(event) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      word: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Category" width={220}>
                <Select
                  options={allCategoryOptions}
                  value={filterDraft.category}
                  onChange={(value) =>
                    setFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      category: value,
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
        <AdminTable<SensitiveWordEntry>
          columns={columns}
          dataSource={filteredEntries}
          horizontalScroll={1012}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        open={Boolean(modalMode)}
        title={
          modalMode === 'edit' ? 'Edit Sensitive Word' : 'Add Sensitive Word'
        }
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
            {modalMode === 'edit' && (
              <AdminFormField label="ID">
                <Input disabled value={draft.id ?? ''} />
              </AdminFormField>
            )}
            <AdminFormField label="Sensitive Word" required>
              <Input
                placeholder="Sensitive Word"
                value={draft.word}
                onChange={(event) => updateDraft('word', event.target.value)}
              />
            </AdminFormField>
            <AdminFormField label="Category" required>
              <Select
                options={sensitiveWordCategoryOptions}
                value={draft.category}
                onChange={(value) => updateDraft('category', value)}
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
        title="Delete Sensitive Word"
        width={520}
        onCancel={() => setDeleteTarget(null)}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the sensitive word from the current demo session."
            message={`Delete sensitive word ${deleteTarget?.word ?? ''}?`}
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
