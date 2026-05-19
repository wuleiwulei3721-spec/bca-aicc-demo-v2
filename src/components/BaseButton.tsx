import { Button } from 'antd'
import type { ButtonProps } from 'antd'

export type BaseButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'toolbar'
  | 'danger'

export interface BaseButtonProps extends Omit<ButtonProps, 'variant'> {
  selected?: boolean
  variant?: BaseButtonVariant
}

export function BaseButton({
  className,
  danger,
  selected,
  variant = 'secondary',
  type,
  size = 'middle',
  ...props
}: BaseButtonProps) {
  const resolvedType = type ?? (variant === 'primary' ? 'primary' : 'default')
  const buttonClassName = [
    'aicc-button',
    `aicc-button--${variant}`,
    selected ? 'aicc-button--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Button
      className={buttonClassName}
      danger={danger || variant === 'danger'}
      size={size}
      type={resolvedType}
      {...props}
    />
  )
}
