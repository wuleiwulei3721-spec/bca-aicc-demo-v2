import type { ReactNode } from 'react'
import type { BaseModalProps } from '../BaseModal'
import { BaseModal } from '../BaseModal'

export type AdminModalProps = BaseModalProps

export function AdminModal({ className, kind = 'detail', ...props }: AdminModalProps) {
  return (
    <BaseModal
      className={['aicc-admin-modal', 'routing-config-crud-modal', className]
        .filter(Boolean)
        .join(' ')}
      kind={kind}
      {...props}
    />
  )
}

export interface AdminModalFooterProps {
  children?: ReactNode
  className?: string
}

export function AdminModalFooter({
  children,
  className,
}: AdminModalFooterProps) {
  return (
    <div
      className={['aicc-admin-modal__footer', 'routing-config-crud-modal__footer', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
