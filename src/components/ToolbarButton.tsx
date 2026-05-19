import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ToolbarButtonTone =
  | 'default'
  | 'primary'
  | 'ready'
  | 'danger'
  | 'incoming'

export interface ToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  flashing?: boolean
  icon?: ReactNode
  label?: ReactNode
  selected?: boolean
  tone?: ToolbarButtonTone
}

export function ToolbarButton({
  active,
  children,
  className,
  flashing,
  icon,
  label,
  selected,
  tone = 'default',
  type = 'button',
  ...props
}: ToolbarButtonProps) {
  const buttonClassName = [
    'aicc-toolbar-button',
    `aicc-toolbar-button--${tone}`,
    active ? 'aicc-toolbar-button--active' : '',
    selected ? 'aicc-toolbar-button--selected' : '',
    flashing ? 'aicc-toolbar-button--flashing' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={buttonClassName} type={type} {...props}>
      {icon}
      {(label || children) && <span>{label ?? children}</span>}
    </button>
  )
}
