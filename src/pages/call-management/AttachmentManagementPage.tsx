import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef, useState } from 'react'
import { AdminCategoryPanel, AdminFormField, AdminModal, AdminModalFooter, AdminPage, AdminTable, BaseButton, BaseCard, LimitedTextArea, StatusBadge } from '../../components'
import { AttachmentFilters } from '../../components/attachments/AttachmentFilters'
import { emptyAttachmentFilters, filterAttachments } from '../../components/attachments/attachmentFilterModel'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { useAuthStore } from '../../store/authStore'
import { downloadAttachment, useAttachmentStore } from '../../store/attachmentStore'
import { getCategoryDepth, getCategoryDescendantIds, getCategoryPath } from '../../utils/categoryTree'
import type { AttachmentInput } from '../../store/attachmentStore'
import type { AttachmentCategory, AttachmentEntry } from '../../types/attachment'
import { formatAttachmentSize, getAttachmentKind, validateLibraryFile } from '../../utils/attachmentRules'
import { formatAuditActor, formatCallManagementDateTime } from '../../utils/audit'

const messageOf = (error: unknown) => error instanceof Error ? error.message : 'The attachment operation failed.'
const allCategoriesKey = '__all__'
export function AttachmentManagementPage() {
  const { entries, categories, removeEntry, addCategory, updateCategory, removeCategory } = useAttachmentStore()
  const { notify } = useOperationFeedback()
  const [draft, setDraft] = useState(emptyAttachmentFilters)
  const [filters, setFilters] = useState(emptyAttachmentFilters)
  const [selectedCategoryId, setSelectedCategoryId] = useState(allCategoriesKey)
  const [categorySearch, setCategorySearch] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState('')
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<AttachmentCategory | null>(null)
  const [editor, setEditor] = useState<AttachmentEntry | 'new' | null>(null)
  const [createParentId, setCreateParentId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AttachmentEntry | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const selectedId = categories.some((category) => category.id === selectedCategoryId) ? selectedCategoryId : allCategoriesKey
  const defaultCategoryId = selectedId !== allCategoriesKey ? selectedId : categories[0]?.id ?? ''
  const data = filterAttachments(entries, { ...filters, category: selectedId === allCategoriesKey ? '' : selectedId }, true, categories)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(data.length / pageSize)))
  const duplicateCategoryName = (name: string, parentId: string | null, exceptId = '') => categories.some((category) => category.id !== exceptId && (category.parentId ?? null) === parentId && category.name.trim().toLowerCase() === name.trim().toLowerCase())
  const cancelRename = () => { setEditingCategoryId(''); setEditingCategoryName('') }
  const createCategory = () => {
    if (!newCategoryName.trim() || duplicateCategoryName(newCategoryName, createParentId)) return
    try {
      const category = addCategory(newCategoryName, createParentId)
      setNewCategoryName(''); setCreateParentId(null); setCategorySearch(''); setSelectedCategoryId(category.id); setPage(1)
      notify('Category added.')
    } catch (error) { notify(messageOf(error), 'error') }
  }
  const renameCategory = () => {
    if (!editingCategoryId || !editingCategoryName.trim() || duplicateCategoryName(editingCategoryName, categories.find((category) => category.id === editingCategoryId)?.parentId ?? null, editingCategoryId)) return
    try { updateCategory(editingCategoryId, editingCategoryName); cancelRename(); notify('Category updated.') } catch (error) { notify(messageOf(error), 'error') }
  }
  const columns: ColumnsType<AttachmentEntry> = [
    { title: 'ID', dataIndex: 'id', width: 85, ellipsis: true },
    { title: 'Name', dataIndex: 'fileName', width: 200, ellipsis: true },
    { title: 'Category', key: 'category', width: 250, render: (_, entry) => { const path = getCategoryPath(categories, entry.categoryId) || 'Unavailable'; return <span title={path} style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{path}</span> } },
    { title: 'Type', key: 'kind', width: 65, render: (_, entry) => getAttachmentKind(entry)?.toUpperCase() },
    { title: 'Size', key: 'size', width: 85, render: (_, entry) => formatAttachmentSize(entry.size) },
    { title: 'Status', key: 'status', width: 100, render: (_, entry) => <StatusBadge dot size="small" status={entry.status === 'Active' ? 'success' : 'disabled'} label={entry.status === 'Active' ? 'Enabled' : 'Disabled'} /> },
    { title: 'Updated Time', dataIndex: 'updatedAt', width: 145, render: (value: string) => formatCallManagementDateTime(value) },
    { title: 'Updated By', dataIndex: 'updatedBy', width: 105, ellipsis: true },
    { title: 'Actions', key: 'actions', fixed: 'right', width: 100, render: (_, entry) => <div className="routing-config-crud__row-actions">
      <button aria-label={`Download ${entry.fileName}`} title="Download" type="button" style={{ width: 24, height: 24 }} onClick={() => { if (!downloadAttachment(entry.contentId, entry.fileName)) notify('File content is unavailable in this session.', 'error') }}><DownloadOutlined /></button>
      <button aria-label={`Edit ${entry.fileName}`} title="Edit" type="button" onClick={() => setEditor(entry)}><EditOutlined /></button>
      <button aria-label={`Delete ${entry.fileName}`} title="Delete" type="button" onClick={() => setDeleteTarget(entry)}><DeleteOutlined /></button>
    </div> },
  ]
  return <AdminPage className="attachments-scope common-phrase-management" title="Attachment Management">
    <div className="common-phrase-management__layout">
      <AdminCategoryPanel
        hierarchy maxDepth={5} createParentId={createParentId} createParentLabel={createParentId ? getCategoryPath(categories, createParentId) : undefined}
        onChildCreate={(id) => { setCategorySearch(''); setCreateParentId(id); setNewCategoryName('') }}
        onCreateParentReset={() => { setCreateParentId(null); setNewCategoryName('') }}
        items={categories.map((category) => {
          const subtree = getCategoryDescendantIds(categories, category.id)
          const count = entries.filter((entry) => subtree.has(entry.categoryId)).length
          return { ...category, count, deleteTitle: 'Delete folder and all its contents' }
        })}
        selectedId={selectedId} allId={allCategoriesKey} totalCount={entries.length}
        search={categorySearch} newName={newCategoryName} renameId={editingCategoryId} renameName={editingCategoryName}
        maxNameLength={100} canCreate={Boolean(newCategoryName.trim()) && !duplicateCategoryName(newCategoryName, createParentId) && (!createParentId || (categories.some((category) => category.id === createParentId) && getCategoryDepth(categories, createParentId) < 5))}
        onSearchChange={setCategorySearch} onSelect={(id) => { setSelectedCategoryId(id); setPage(1) }}
        onNewNameChange={setNewCategoryName} onCreate={createCategory}
        onRenameStart={(id) => {
          const category = categories.find((item) => item.id === id)
          if (category) { setEditingCategoryId(id); setEditingCategoryName(category.name) }
        }}
        onRenameNameChange={setEditingCategoryName} onRenameSave={renameCategory} onRenameCancel={cancelRename}
        onDelete={(id) => setDeleteCategoryTarget(categories.find((category) => category.id === id) ?? null)}
      />
      <BaseCard compact className="common-phrase-management__content">
        <AttachmentFilters management showCategory={false} value={draft} categories={categories} onChange={setDraft}
          onSearch={() => { setFilters({ ...draft }); setPage(1) }}
          onReset={() => { setDraft(emptyAttachmentFilters); setFilters(emptyAttachmentFilters); setPage(1) }}
          primaryActions={<div className="call-management-list__add-actions"><BaseButton disabled={!defaultCategoryId} title={defaultCategoryId ? undefined : 'Create a category before adding an attachment.'} icon={<PlusOutlined />} variant="primary" onClick={() => { if (defaultCategoryId) setEditor('new') }}>Add</BaseButton></div>}
        />
        <AdminTable<AttachmentEntry> rowKey="id" columns={columns} dataSource={data} horizontalScroll={1190}
          pagination={{ current: currentPage, pageSize, total: data.length, onChange: (nextPage, nextSize) => { setPage(nextSize === pageSize ? nextPage : 1); setPageSize(nextSize) } }}
          locale={{ emptyText: 'No attachments found. Add an attachment or reset your filters.' }} />
      </BaseCard>
    </div>
    {editor && <AttachmentEditor key={typeof editor === 'string' ? editor : editor.id} entry={editor === 'new' ? undefined : editor} defaultCategoryId={defaultCategoryId} onClose={() => setEditor(null)} />}
    <AdminModal open={Boolean(deleteTarget)} title="Delete Attachment" width={520} onCancel={() => setDeleteTarget(null)}>
      <div className="routing-config-crud-modal__delete"><Alert type="warning" showIcon title={`Delete ${deleteTarget?.fileName ?? 'attachment'}?`} description="The attachment will be removed from the library. Previously sent attachments remain available." /></div>
      <AdminModalFooter><BaseButton variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</BaseButton><BaseButton variant="danger" onClick={() => {
        if (!deleteTarget) return
        try {
          removeEntry(deleteTarget.id)
          setPage(Math.min(currentPage, Math.max(1, Math.ceil(data.filter((entry) => entry.id !== deleteTarget.id).length / pageSize))))
          notify('Attachment deleted.'); setDeleteTarget(null)
        } catch (error) { notify(messageOf(error), 'error') }
      }}>Delete</BaseButton></AdminModalFooter>
    </AdminModal>
    <AdminModal open={Boolean(deleteCategoryTarget)} title="Delete Category" width={520} onCancel={() => setDeleteCategoryTarget(null)}>
      <div className="routing-config-crud-modal__delete"><Alert type="warning" showIcon title={`Delete ${deleteCategoryTarget?.name ?? 'category'}?`} description="Deleting this folder will also delete all its subfolders and files." /></div>
      <AdminModalFooter><BaseButton variant="secondary" onClick={() => setDeleteCategoryTarget(null)}>Cancel</BaseButton><BaseButton variant="danger" disabled={!deleteCategoryTarget} onClick={() => {
        if (!deleteCategoryTarget) return
        try {
          const subtree = getCategoryDescendantIds(categories, deleteCategoryTarget.id)
          removeCategory(deleteCategoryTarget.id)
          if (subtree.has(selectedCategoryId)) { setSelectedCategoryId(allCategoriesKey); setCategorySearch(''); setPage(1) }
          else setPage(Math.min(currentPage, Math.max(1, Math.ceil(data.filter((entry) => !subtree.has(entry.categoryId)).length / pageSize))))
          if (subtree.has(editingCategoryId)) cancelRename()
          if (createParentId && subtree.has(createParentId)) { setCreateParentId(null); setNewCategoryName('') }
          if (subtree.has(draft.category)) setDraft({ ...draft, category: '' })
          if (subtree.has(filters.category)) setFilters({ ...filters, category: '' })
          if (editor && subtree.has(editor === 'new' ? defaultCategoryId : editor.categoryId)) setEditor(null)
          if (deleteTarget && subtree.has(deleteTarget.categoryId)) setDeleteTarget(null)
          setDeleteCategoryTarget(null); notify('Folder and its contents deleted.')
        } catch (error) { notify(messageOf(error), 'error') }
      }}>Delete</BaseButton></AdminModalFooter>
    </AdminModal>
  </AdminPage>
}

function AttachmentEditor({ entry, defaultCategoryId, onClose }: { entry?: AttachmentEntry; defaultCategoryId: string; onClose: () => void }) {
  const { categories, addEntry, updateEntry } = useAttachmentStore()
  const session = useAuthStore((state) => state.session)
  const { notify } = useOperationFeedback()
  const [draft, setDraft] = useState<AttachmentInput>(() => ({ categoryId: entry?.categoryId ?? defaultCategoryId, remark: entry?.remark ?? '', status: entry?.status ?? 'Active' }))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileName = draft.file?.name ?? entry?.fileName
  const [error, setError] = useState('')
  const [fileError, setFileError] = useState('')
  const save = () => {
    if (fileError) return
    try {
      const input = { ...draft, updatedBy: formatAuditActor(session?.employeeId, session?.displayName) }
      if (entry) updateEntry(entry.id, input)
      else addEntry(input)
      notify(entry ? 'Attachment updated.' : 'Attachment added.')
      onClose()
    } catch (failure) { setError(messageOf(failure)) }
  }
  return <AdminModal className="attachments-editor" open title={entry ? 'Edit Attachment' : 'Add Attachment'} width={720} onCancel={onClose}>
    <div className="routing-config-crud-modal__sections">
      {error && <Alert className="routing-config-crud-modal__validation" type="error" showIcon title="Please fix the form." description={error} />}
      <div className="routing-config-crud-modal__form">
        <AdminFormField label="Category" required><Select placeholder="Choose a category" value={draft.categoryId || undefined} options={categories.map((category) => ({ value: category.id, label: getCategoryPath(categories, category.id) }))} onChange={(categoryId) => setDraft({ ...draft, categoryId })} /></AdminFormField>
        <AdminFormField label="File" required={!entry} fullWidth helper="Images, videos and PDF only. Maximum 20 MB.">
          <div className="attachments-scope">
            <input ref={fileInputRef} hidden type="file" accept="image/*,video/*,.pdf" onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (!file) return
              setDraft((current) => ({ ...current, file }))
              setFileError(validateLibraryFile(file).join(' '))
              setError('')
            }} />
            <BaseButton variant="secondary" onClick={() => fileInputRef.current?.click()}>{fileName ? 'Replace File' : 'Select File'}</BaseButton>
            {fileName && <p className="attachments-remark">{fileName}</p>}
            {fileError && <small className="attachments-error" role="alert">{fileError}</small>}
          </div>
        </AdminFormField>
        <AdminFormField label="Remark (optional)" fullWidth><LimitedTextArea maxLength={2000} rows={3} value={draft.remark} onChange={(event) => setDraft({ ...draft, remark: event.target.value })} /></AdminFormField>
        <AdminFormField label="Status"><span className="busy-reason-config__switch-row"><Switch size="small" checked={draft.status === 'Active'} onChange={(checked) => setDraft({ ...draft, status: checked ? 'Active' : 'Disabled' })} /><em>{draft.status === 'Active' ? 'Enabled' : 'Disabled'}</em></span></AdminFormField>
      </div>
    </div>
    <AdminModalFooter><BaseButton variant="secondary" onClick={onClose}>Cancel</BaseButton><BaseButton variant="primary" onClick={save}>Save</BaseButton></AdminModalFooter>
  </AdminModal>
}

