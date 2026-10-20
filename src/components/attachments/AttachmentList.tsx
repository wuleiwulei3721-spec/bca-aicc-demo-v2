import { useState } from 'react'
import { BaseButton } from '..'
import type { AttachmentReference } from '../../types/attachment'
import { getAttachmentContent, getAttachmentUrl, useAttachmentStore } from '../../store/attachmentStore'
import { formatAttachmentSize, validateCurrentReference } from '../../utils/attachmentRules'
import { AttachmentPreviewModal } from './AttachmentPreviewModal'

export interface AttachmentListProps { attachments: AttachmentReference[]; onRemove?: (reference: AttachmentReference) => void; removeOnly?: boolean }
export function AttachmentList({ attachments, onRemove, removeOnly = false }: AttachmentListProps) {
  const entries = useAttachmentStore((state) => state.entries)
  const [preview, setPreview] = useState<AttachmentReference | null>(null)
  return <div className="attachments-scope">
    {attachments.length === 0 && <span className="attachments-muted">No attachments selected.</span>}
    <ul className="attachments-list">{attachments.map((ref) => {
      const errors = onRemove ? validateCurrentReference(ref, entries) : []
      if (!getAttachmentContent(ref.contentId)) errors.push('File content is unavailable in this session.')
      const url = removeOnly ? undefined : getAttachmentUrl(ref.contentId)
      return <li key={ref.attachmentId}><div className="attachments-list__name"><strong>{ref.name}</strong><small>{ref.name !== ref.fileName ? `${ref.fileName} · ` : ''}{formatAttachmentSize(ref.size)}</small>{errors.length > 0 && <small className="attachments-error" role="status">{errors.join(' ')}</small>}</div><div className="attachments-actions">
        {!removeOnly && <><BaseButton size="small" onClick={() => setPreview(ref)}>Preview</BaseButton><BaseButton size="small" disabled={!url} href={url} download={ref.fileName}>Download</BaseButton></>}{onRemove && <BaseButton size="small" onClick={() => onRemove(ref)}>Remove</BaseButton>}
      </div></li>
    })}</ul>{!removeOnly && <AttachmentPreviewModal reference={preview} onClose={() => setPreview(null)} />}
  </div>
}
