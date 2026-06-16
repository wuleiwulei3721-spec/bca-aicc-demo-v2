import type { ReactNode } from 'react'

export interface AdminFormFieldProps {
  children?: ReactNode
  className?: string
  fullWidth?: boolean
  helper?: ReactNode
  label: ReactNode
  required?: boolean
}

export function AdminFormField({
  children,
  className,
  fullWidth,
  helper,
  label,
  required,
}: AdminFormFieldProps) {
  return (
    <label
      className={[
        'aicc-admin-form-field',
        'routing-config-crud-modal__field',
        fullWidth ? 'routing-config-crud-modal__field--full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>
        {label}
        {required && <strong>*</strong>}
      </span>
      {children}
      {helper && <small>{helper}</small>}
    </label>
  )
}
