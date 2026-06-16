import type { CSSProperties, ReactNode } from 'react'

export interface AdminToolbarProps {
  actions?: ReactNode
  className?: string
  filters?: ReactNode
  filtersClassName?: string
  primaryActions?: ReactNode
}

export function AdminToolbar({
  actions,
  className,
  filters,
  filtersClassName,
  primaryActions,
}: AdminToolbarProps) {
  return (
    <div
      className={['aicc-admin-toolbar', 'routing-config-page__admin-toolbar', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="aicc-admin-query-group routing-config-page__query-group">
        {filters && (
          <div
            className={[
              'aicc-admin-filters',
              'routing-config-page__filters',
              filtersClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {filters}
          </div>
        )}
        {actions && (
          <div className="aicc-admin-actions routing-config-page__admin-actions">
            {actions}
          </div>
        )}
      </div>
      {primaryActions && (
        <div className="aicc-admin-primary-actions routing-config-page__add-action">
          {primaryActions}
        </div>
      )}
    </div>
  )
}

export interface AdminFilterFieldProps {
  children?: ReactNode
  className?: string
  label: ReactNode
  style?: CSSProperties
  width?: number | string
}

export function AdminFilterField({
  children,
  className,
  label,
  style,
  width,
}: AdminFilterFieldProps) {
  return (
    <label
      className={['aicc-admin-filter', 'routing-config-page__filter', className]
        .filter(Boolean)
        .join(' ')}
      style={{ width, ...style }}
    >
      <span>{label}</span>
      {children}
    </label>
  )
}
