import { Button } from 'antd'
import type { ButtonProps } from 'antd'

export function AppButton({ className, size = 'middle', ...props }: ButtonProps) {
  const buttonClassName = ['aicc-button', className].filter(Boolean).join(' ')

  return <Button className={buttonClassName} size={size} {...props} />
}
