import { Modal } from 'antd'
import type { ModalProps } from 'antd'

export type BaseModalKind =
  | 'standard'
  | 'transfer'
  | 'outbound'
  | 'internal-chat'
  | 'settings'
  | 'verification'
  | 'detail'
  | 'email'

export interface BaseModalProps extends ModalProps {
  kind?: BaseModalKind
}

export function BaseModal({
  children,
  className,
  footer = null,
  kind = 'standard',
  ...props
}: BaseModalProps) {
  const modalClassName = [
    'aicc-modal',
    `aicc-modal--${kind}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Modal className={modalClassName} footer={footer} {...props}>
      <div className="aicc-modal__body">{children}</div>
    </Modal>
  )
}
