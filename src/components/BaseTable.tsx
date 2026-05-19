import { Table } from 'antd'
import type { TableProps } from 'antd'

export interface BaseTableProps<RecordType extends object = object>
  extends TableProps<RecordType> {
  clickableRows?: boolean
}

export function BaseTable<RecordType extends object = object>({
  className,
  clickableRows,
  pagination,
  size = 'middle',
  ...props
}: BaseTableProps<RecordType>) {
  const tableClassName = [
    'aicc-table',
    clickableRows ? 'aicc-table--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Table<RecordType>
      className={tableClassName}
      pagination={
        pagination === false
          ? false
          : {
              showQuickJumper: true,
              showSizeChanger: true,
              ...pagination,
            }
      }
      size={size}
      {...props}
    />
  )
}
