import { UserOutlined } from '@ant-design/icons'
import type { CSSProperties } from 'react'

interface IdentityAvatarProps {
  className?: string
  name?: string
  size?: number
}

function getFirstDisplayCharacter(name = '') {
  return Array.from(name.trim())[0]?.toUpperCase() ?? '?'
}

function getAvatarStyle(size?: number): CSSProperties | undefined {
  if (!size) {
    return undefined
  }

  return {
    '--aicc-identity-avatar-size': `${size}px`,
  } as CSSProperties
}

export function AgentAvatar({
  className,
  name,
  size,
}: IdentityAvatarProps) {
  return (
    <span
      aria-label={name ? `${name} avatar` : 'Agent avatar'}
      className={['aicc-identity-avatar', 'aicc-identity-avatar--agent', className]
        .filter(Boolean)
        .join(' ')}
      role="img"
      style={getAvatarStyle(size)}
    >
      {getFirstDisplayCharacter(name)}
    </span>
  )
}

export function CustomerAvatar({ className, size }: IdentityAvatarProps) {
  return (
    <span
      aria-label="Customer avatar"
      className={[
        'aicc-identity-avatar',
        'aicc-identity-avatar--customer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      style={getAvatarStyle(size)}
    >
      <UserOutlined />
    </span>
  )
}
