import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import type { InputProps } from 'antd'

export function SearchInput({
  className,
  placeholder = 'Search',
  ...props
}: InputProps) {
  const inputClassName = ['aicc-search-input', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Input
      allowClear
      className={inputClassName}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      {...props}
    />
  )
}
