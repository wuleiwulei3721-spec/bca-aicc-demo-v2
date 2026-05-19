import {
  AudioMutedOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PauseCircleOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'
import type { ReactNode } from 'react'

export type StatusBadgeStatus =
  | 'ready'
  | 'not-ready'
  | 'aux'
  | 'talking'
  | 'hold'
  | 'mute'
  | 'verified'
  | 'failed'
  | 'warning'
  | 'disabled'
  | 'selected'
  | 'success'
  | 'error'
  | 'neutral'

interface StatusBadgeProps {
  children?: ReactNode
  className?: string
  dot?: boolean
  icon?: ReactNode
  label?: ReactNode
  size?: 'small' | 'default'
  status: StatusBadgeStatus
}

const defaultIcons: Partial<Record<StatusBadgeStatus, ReactNode>> = {
  ready: <CheckCircleOutlined />,
  'not-ready': <CloseCircleOutlined />,
  aux: <ExclamationCircleOutlined />,
  talking: <PhoneOutlined />,
  hold: <PauseCircleOutlined />,
  mute: <AudioMutedOutlined />,
  verified: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  disabled: <MinusCircleOutlined />,
  success: <CheckCircleOutlined />,
  error: <CloseCircleOutlined />,
}

export function StatusBadge({
  children,
  className,
  dot,
  icon,
  label,
  size = 'default',
  status,
}: StatusBadgeProps) {
  const badgeClassName = [
    'aicc-status-badge',
    `aicc-status-badge--${status}`,
    size === 'small' ? 'aicc-status-badge--small' : '',
    dot ? 'aicc-status-badge--with-dot' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={badgeClassName} icon={!dot ? icon ?? defaultIcons[status] : undefined}>
      {dot && <span className="aicc-status-badge__dot" />}
      {label ?? children}
    </Tag>
  )
}
