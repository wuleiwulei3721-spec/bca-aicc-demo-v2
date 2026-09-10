import type { CSSProperties, ComponentProps } from 'react'
import {
  getChannelLogoSrc,
  type ChannelLogoChannel,
  type ChannelLogoVariant,
} from './channelLogoUtils'

export type { ChannelLogoChannel, ChannelLogoVariant } from './channelLogoUtils'

type ChannelLogoProps = Omit<ComponentProps<'img'>, 'src'> & {
  channel: ChannelLogoChannel
  variant?: ChannelLogoVariant
  size?: number
}

export function ChannelLogo({
  channel,
  className,
  size,
  variant = 'standard',
  ...props
}: ChannelLogoProps) {
  const style = size
    ? ({ '--channel-logo-size': `${size}px` } as CSSProperties)
    : undefined
  return (
    <img
      {...props}
      alt={props.alt ?? ''}
      aria-hidden={props.alt ? undefined : true}
      className={['channel-logo', className].filter(Boolean).join(' ')}
      draggable={false}
      src={getChannelLogoSrc(channel, variant)}
      style={{ ...style, ...props.style }}
    />
  )
}
