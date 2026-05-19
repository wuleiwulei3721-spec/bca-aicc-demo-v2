import { Table } from 'antd'
import type { TableProps } from 'antd'

export function AppTable<RecordType extends object = object>({
  className,
  size = 'middle',
  pagination,
  ...props
}: TableProps<RecordType>) {
  const tableClassName = ['aicc-table', className].filter(Boolean).join(' ')

  return (
    <Table<RecordType>
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
