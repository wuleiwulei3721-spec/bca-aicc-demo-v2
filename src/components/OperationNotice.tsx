import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

export type OperationNoticeTone = 'error' | 'info' | 'success'

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
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={`aicc-operation-notice aicc-operation-notice--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {tone === 'success' ? (
        <CheckCircleOutlined />
      ) : tone === 'error' ? (
        <CloseCircleOutlined />
      ) : (
        <InfoCircleOutlined />
      )}
      <span>{message}</span>
    </div>
  )
}
