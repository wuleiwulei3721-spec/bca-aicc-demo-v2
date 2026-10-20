import { FileImageOutlined, FileOutlined, FilePdfOutlined, VideoCameraOutlined } from '@ant-design/icons'
import type { AttachmentReference } from '../../types/attachment'
import { getAttachmentUrl } from '../../store/attachmentStore'
import { formatAttachmentSize, getAttachmentKind } from '../../utils/attachmentRules'
import './AttachmentMessage.less'

export interface AttachmentMessageProps {
  reference: AttachmentReference
  variant?: 'conversation' | 'record'
}

export function AttachmentMessage({ reference, variant = 'conversation' }: AttachmentMessageProps) {
  const kind = getAttachmentKind(reference)
  const url = kind === 'image' ? getAttachmentUrl(reference.contentId) : undefined
  const record = variant === 'record'
  const icon = kind === 'pdf' ? <FilePdfOutlined /> : kind === 'image' ? <FileImageOutlined /> : kind === 'video' ? <VideoCameraOutlined /> : <FileOutlined />

  return <div className={`attachment-message attachment-message--${variant}`}>
    {record ? <>
      <span className="attachment-message__icon" aria-hidden="true">{icon}</span>
      <small className="attachment-message__size">{formatAttachmentSize(reference.size)}</small>
    </> : <div className="attachment-message__content">
      {kind === 'image' && url && <img className="attachment-message__thumbnail" src={url} alt={reference.fileName} loading="lazy" width={200} height={140} />}
      <span className="attachment-message__metadata">
        <span className="attachment-message__icon" aria-hidden="true">{icon}</span>
        <span className="attachment-message__details">
          <span className="attachment-message__filename" title={reference.fileName}>{reference.fileName}</span>
          <small className="attachment-message__size">{formatAttachmentSize(reference.size)}</small>
        </span>
      </span>
    </div>}
    {kind === 'image' && !url && <small className="attachment-message__unavailable" role="status">File content is unavailable in this session.</small>}
  </div>
}
