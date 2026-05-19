import { BaseTable } from './BaseTable'
import type { BaseTableProps } from './BaseTable'

export function AppTable<RecordType extends object = object>({
  className,
  size = 'middle',
  pagination,
  ...props
}: BaseTableProps<RecordType>) {
  const tableClassName = ['aicc-table', className].filter(Boolean).join(' ')

  return (
    <BaseTable<RecordType>
      className={tableClassName}
      pagination={
        pagination === false
          ? false
          : {
              showSizeChanger: true,
              showQuickJumper: true,
              ...pagination,
            }
      }
      size={size}
      {...props}
    />
  )
}
