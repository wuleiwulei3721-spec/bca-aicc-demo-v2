import type { BaseTableProps } from '../BaseTable'
import { BaseTable } from '../BaseTable'
import { createAdminPagination, type AdminTableVariant } from './adminTableUtils'

export interface AdminTableProps<RecordType extends object = object>
  extends BaseTableProps<RecordType> {
  horizontalScroll?: number | string
  tableVariant?: AdminTableVariant
  verticalScroll?: number | string
}

export function AdminTable<RecordType extends object = object>({
  className,
  horizontalScroll,
  pagination,
  scroll,
  tableVariant = 'page',
  verticalScroll,
  ...props
}: AdminTableProps<RecordType>) {
  const tableClassName = [
    'aicc-admin-table',
    tableVariant === 'modal' ? 'aicc-admin-table--modal' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedScroll =
    scroll ??
    (horizontalScroll || verticalScroll
      ? {
          ...(horizontalScroll ? { x: horizontalScroll } : {}),
          ...(verticalScroll ? { y: verticalScroll } : {}),
        }
      : undefined)

  return (
    <BaseTable<RecordType>
      className={tableClassName}
      pagination={createAdminPagination(tableVariant, pagination)}
      scroll={resolvedScroll}
      size="small"
      {...props}
    />
  )
}
