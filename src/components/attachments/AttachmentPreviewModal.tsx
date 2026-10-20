import { Alert } from 'antd'
import { useState } from 'react'
import { BaseButton, BaseModal } from '..'
import type { AttachmentReference } from '../../types/attachment'
import { getAttachmentUrl, useAttachmentStore } from '../../store/attachmentStore'
import { formatAttachmentSize, getAttachmentKind } from '../../utils/attachmentRules'

function PreviewFailure({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false)
  return <div>
    <video src={url} aria-label={name} controls preload="metadata" onError={() => setFailed(true)} />
    {failed && <p role="status">This video cannot be played here. Use Download.</p>}
  </div>
}

export interface AttachmentPreviewModalProps { reference: AttachmentReference | null; onClose: () => void; showRemark?: boolean }
export function AttachmentPreviewModal({ reference, onClose, showRemark = true }: AttachmentPreviewModalProps) {
  const entries = useAttachmentStore((state) => state.entries)
  if (!reference) return null
  const url = getAttachmentUrl(reference.contentId)
  const kind = getAttachmentKind(reference)
  const current = entries.find((entry) => entry.id === reference.attachmentId && entry.contentId === reference.contentId)
  return <BaseModal className="attachments-preview" open title={reference.name} width={960} zIndex={1500} styles={{ body: { maxHeight: 'calc(100dvh - 240px)', overflowY: 'auto' } }} onCancel={onClose} footer={<BaseButton onClick={onClose}>Close</BaseButton>}>
    <div className="attachments-scope">
      <div className="attachments-details"><strong>{reference.fileName}</strong><span>{formatAttachmentSize(reference.size)}</span>{url && <BaseButton href={url} download={reference.fileName}>Download</BaseButton>}</div>
      {showRemark && current?.remark && <p className="attachments-remark">{current.remark}</p>}
      {!url ? <Alert type="warning" showIcon title="File content is unavailable in this session." description="Select a current library attachment to continue. Legacy references have no downloadable content." /> : <div className="attachments-preview__media">
        {kind === 'image' ? <img src={url} alt={reference.name} /> : kind === 'video' ? <PreviewFailure key={reference.contentId} url={url} name={reference.name} /> : kind === 'pdf' ? <iframe src={url} title={reference.name} /> : <p>Preview is unavailable. Use Download to open the file.</p>}
      </div>}
    </div>
  </BaseModal>
}
