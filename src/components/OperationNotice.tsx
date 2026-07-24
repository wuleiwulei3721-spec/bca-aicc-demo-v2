import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

export type OperationNoticeTone = 'error' | 'success'

interface OperationNoticeProps {
  message: string | null
  tone: OperationNoticeTone
}

export function OperationNotice({ message, tone }: OperationNoticeProps) {
  if (!message) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className={`aicc-operation-notice aicc-operation-notice--${tone}`}
      role="status"
    >
      {tone === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      <span>{message}</span>
    </div>
  )
}
