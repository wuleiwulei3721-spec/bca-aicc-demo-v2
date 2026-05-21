import { PhoneOutlined } from '@ant-design/icons'
import type { ComponentProps } from 'react'

type PhoneIconProps = ComponentProps<typeof PhoneOutlined>

export function PhoneIcon({ className, ...props }: PhoneIconProps) {
  return (
    <PhoneOutlined
      className={['aicc-phone-icon', className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
