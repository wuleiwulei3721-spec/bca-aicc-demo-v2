import { DownloadOutlined } from '@ant-design/icons'
import { Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { AdminModalFooter, AdminTable, BaseButton, BaseModal } from '..'
import type { AttachmentChannel, AttachmentEntry, AttachmentReference } from '../../types/attachment'
import { downloadAttachment, getAttachmentContent, useAttachmentStore } from '../../store/attachmentStore'
import { getCategoryPath } from '../../utils/categoryTree'
import { createReference, formatAttachmentSize, getAttachmentKind, validateCurrentReference } from '../../utils/attachmentRules'
import { AttachmentFilters } from './AttachmentFilters'
import { emptyAttachmentFilters, filterAttachments } from './attachmentFilterModel'

export interface AttachmentPickerModalProps {
  open: boolean
  channel: AttachmentChannel
  selected: AttachmentReference[]
  onConfirm: (references: AttachmentReference[]) => void
  onCancel: () => void
}
export function AttachmentPickerModal(props: AttachmentPickerModalProps) {
  return props.open ? <PickerSession key={props.channel} {...props} /> : null
}
function PickerSession({ channel, selected, onConfirm, onCancel }: AttachmentPickerModalProps) {
  const { entries, categories } = useAttachmentStore()
  const [draft, setDraft] = useState(emptyAttachmentFilters)
  const [filters, setFilters] = useState(emptyAttachmentFilters)
  const [keys, setKeys] = useState<string[]>(() => channel === 'livechat' ? selected.slice(0, 1).map((ref) => ref.attachmentId) : [])
  const [error, setError] = useState('')
  const [revisions, setRevisions] = useState<Map<string, AttachmentReference>>(() => new Map(selected.map((ref) => [ref.attachmentId, ref])))
  const existing = new Set(selected.map((ref) => ref.attachmentId))
  const data = filterAttachments(entries.filter((entry) => entry.status === 'Active'), { ...filters, kind: '' }, false, categories)
  const confirm = () => {
    const latest = useAttachmentStore.getState().entries
    const ids = channel === 'email' ? keys.filter((id) => !existing.has(id)) : keys
    const chosen = ids.map((id) => latest.find((entry) => entry.id === id))
    if (chosen.some((entry) => !entry)) { setError('A selected attachment was removed. Review your selection.'); return }
    const refs = ids.map((id) => revisions.get(id))
    if (refs.some((ref) => !ref)) { setError('Review your selection and select the attachment again.'); return }
    const currentRefs = refs.filter((ref): ref is AttachmentReference => Boolean(ref))
    const errors = currentRefs.flatMap((ref) => validateCurrentReference(ref, latest))
    if (currentRefs.some((ref) => !getAttachmentContent(ref.contentId))) errors.push('File content is unavailable in this session.')
    if (!currentRefs.length) errors.push('Select an attachment to continue.')
    if (channel === 'livechat' && currentRefs.length > 1) errors.push('Select one file.')
    if (errors.length) { setError(errors.join(' ')); return }
    onConfirm(currentRefs)
  }
  const columns: ColumnsType<AttachmentEntry> = [
    { title: 'ID', dataIndex: 'id', width: 85, ellipsis: true },
    { title: 'Name', dataIndex: 'fileName', ellipsis: true },
    { title: 'Category', key: 'category', width: 250, render: (_, entry) => { const path = getCategoryPath(categories, entry.categoryId) || 'Unavailable'; return <span title={path} style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{path}</span> } },
    { title: 'Type', key: 'kind', width: 80, render: (_, entry) => getAttachmentKind(entry)?.toUpperCase() },
    { title: 'Size', key: 'size', width: 100, render: (_, entry) => formatAttachmentSize(entry.size) },
    { title: 'Actions', key: 'actions', width: 70, render: (_, entry) => <div className="routing-config-crud__row-actions"><button aria-label={`Download ${entry.fileName}`} title="Download" type="button" style={{ width: 24, height: 24 }} onClick={() => { if (!downloadAttachment(entry.contentId, entry.fileName)) setError('File content is unavailable in this session.') }}><DownloadOutlined /></button></div> },
  ]
  return <BaseModal className="attachments-picker" open title={channel === 'livechat' ? 'Select Attachment' : 'Select Attachments'} width={1040} zIndex={1400} styles={{ body: { maxHeight: 'calc(100dvh - 240px)', overflowY: 'auto' } }} onCancel={onCancel}>
    <div className="attachments-scope">
      {channel === 'livechat' && <p>Select one file.</p>}
      <AttachmentFilters showType={false} value={draft} categories={categories} onChange={setDraft} onSearch={() => setFilters({ ...draft })} onReset={() => { setDraft(emptyAttachmentFilters); setFilters(emptyAttachmentFilters) }} />
      {error && <Alert type="error" showIcon title={error} />}
      <AdminTable<AttachmentEntry> rowKey="id" tableVariant="modal" verticalScroll={320} columns={columns} dataSource={data} locale={{ emptyText: 'No matching active attachments. Try different filters.' }} rowSelection={{
        type: channel === 'email' ? 'checkbox' : 'radio', preserveSelectedRowKeys: true,
        selectedRowKeys: channel === 'email' ? [...new Set([...existing, ...keys])] : keys,
        getCheckboxProps: (entry) => ({ disabled: channel === 'email' && existing.has(entry.id) }),
        onChange: (next) => {
          const ids = next.map(String)
          setRevisions((current) => new Map(ids.flatMap((id) => {
            const previous = keys.includes(id) ? current.get(id) : undefined
            const entry = entries.find((item) => item.id === id)
            const reference = previous ?? (entry ? createReference(entry) : undefined)
            return reference ? [[id, reference] as const] : []
          })))
          setKeys(ids); setError('')
        },
      }} />
      <AdminModalFooter><span className="attachments-muted">{channel === 'email' ? `${keys.filter((id) => !existing.has(id)).length} new selected` : `${keys.length} selected`}</span><BaseButton onClick={onCancel}>Cancel</BaseButton><BaseButton variant="primary" onClick={confirm}>Add</BaseButton></AdminModalFooter>
    </div>
  </BaseModal>
}
