import type { ColumnsType } from 'antd/es/table'
import type { AdminTableProps } from './AdminTable'

export const adminPageSizeOptions = [10, 20, 50, 100]

export type AdminTableVariant = 'modal' | 'page'

const adminDefaultPageSizeByVariant: Record<AdminTableVariant, number> = {
  modal: 10,
  page: 10,
}

export function renderAdminPaginationTotal(
  total: number,
  range: [number, number],
) {
  return `${range[0]}-${range[1]} / ${total} records`
}

export function createAdminPagination(
  variant: AdminTableVariant = 'page',
  pagination: AdminTableProps['pagination'] = {},
) {
  if (pagination === false) {
    return false
  }

  const paginationObject = typeof pagination === 'object' ? pagination : {}

  return {
    ...paginationObject,
    defaultPageSize: adminDefaultPageSizeByVariant[variant],
    pageSizeOptions: adminPageSizeOptions,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: renderAdminPaginationTotal,
  }
}

export function createAdminActionsColumn<RecordType extends object>(
  column: ColumnsType<RecordType>[number],
) {
  return {
    fixed: 'right' as const,
    title: 'Actions',
    width: 120,
    ...column,
  }
}
