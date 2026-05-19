import { BaseButton } from './BaseButton'
import type { BaseButtonProps } from './BaseButton'

export function AppButton({
  className,
  size = 'middle',
  ...props
}: BaseButtonProps) {
  const buttonClassName = ['aicc-button', className].filter(Boolean).join(' ')

  return <BaseButton className={buttonClassName} size={size} {...props} />
}
