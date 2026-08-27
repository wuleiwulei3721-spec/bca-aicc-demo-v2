import {
  AudioOutlined,
  GlobalOutlined,
  MessageOutlined,
  MobileOutlined,
  VideoCameraOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'
import { PhoneIcon } from '../../../components'
import type { AccessChannel, JourneyChannel } from '../../../types'

type ChannelTagValue = AccessChannel | JourneyChannel

interface ChannelTagProps {
  value: ChannelTagValue
  compact?: boolean
  duration?: string
  label?: string
  transferredFrom?: string
}

const channelClassNames: Record<string, string> = {
  BankApp: 'inbound-channel-tag--bankapp',
  Phone: 'inbound-channel-tag--phone',
  Video: 'inbound-channel-tag--video',
  'BankApp Voice': 'inbound-channel-tag--bankapp',
  'BankApp Video': 'inbound-channel-tag--bankapp',
  Webchat: 'inbound-channel-tag--webchat',
  'Webchat Voice': 'inbound-channel-tag--webchat',
  Email: 'inbound-channel-tag--email',
  X: 'inbound-channel-tag--x',
  Instagram: 'inbound-channel-tag--instagram',
  TikTok: 'inbound-channel-tag--tiktok',
  WhatsApp: 'inbound-channel-tag--whatsapp',
}

const channelDisplayLabels: Partial<Record<ChannelTagValue, string>> = {
  BankApp: 'BankApp',
  'BankApp Voice': 'BankApp',
  'BankApp Video': 'BankApp',
  Phone: 'PSTN',
  Video: 'Video Call',
}

function renderIcon(value: ChannelTagValue) {
  if (value === 'Phone') {
    return <PhoneIcon />
  }

  if (value === 'Video') {
    return <VideoCameraOutlined />
  }

  if (
    value === 'BankApp' ||
    value === 'BankApp Voice' ||
    value === 'BankApp Video'
  ) {
    return <MobileOutlined />
  }

  if (value === 'WhatsApp') {
    return <WhatsAppOutlined />
  }

  if (value === 'Webchat') {
    return <GlobalOutlined />
  }

  if (value.includes('Voice')) {
    return <AudioOutlined />
  }

  return <MessageOutlined />
}

export function ChannelTag({
  value,
  compact,
  duration,
  label,
  transferredFrom,
}: ChannelTagProps) {
  return (
    <Tag
      className={[
        'inbound-channel-tag',
        channelClassNames[value],
        compact ? 'inbound-channel-tag--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="inbound-channel-tag__icon">
        {renderIcon(value)}
      </span>
      <span className="inbound-channel-tag__label">
        {label ?? channelDisplayLabels[value] ?? value}
      </span>
      {duration && (
        <span className="inbound-channel-tag__duration">
          {duration}
        </span>
      )}
      {transferredFrom && (
        <span
          className="inbound-channel-tag__transfer"
          title={`Transferred from ${transferredFrom}`}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 1024 1024"
          >
            <path d="M408.67 229.78c-10.38-8.45-25.58-7.24-34.03 3.13-3.62 4.34-5.79 10.13-5.55 15.69v109.57c-53.82 3.86-325.58 101.85-303.86 446.01 63.72-118.02 151.32-244.25 303.62-256.07v128.64c0 13.28 10.62 24.38 23.89 24.38 6.03 0 12.07-2.17 16.41-6.28l242.07-221.8c10.14-8.69 11.58-23.89 2.9-34.03-0.97-0.97-1.93-2.17-2.9-2.9L408.67 229.78z m475.7 556.07c-3.86 6.28-10.14 10.62-17.14 12.07h-5.79c-5.31 0-10.62-1.45-15.21-4.34l-11.83-7.97c-11.83-8.21-15.21-24.13-7.48-36.2 85.2-148.67 85.2-331.37 0-480.04-7.48-12.55-4.1-28.72 7.96-37.17l11.83-7.72c12.55-8.45 29.69-5.07 37.89 7.48 0 0.24 0.24 0.24 0.24 0.48 100.41 171.11 100.17 382.77-0.47 553.41z m-128.64-97.51c-4.34 6.03-10.62 9.89-17.86 11.1h-4.34c-6.03 0-11.83-1.93-16.65-5.55l-11.1-8.45c-11.58-8.93-14.24-25.1-5.79-37.17 56.72-84.47 56.72-194.77 0-279.24-8.21-11.83-5.79-28.24 5.79-37.17l11.1-8.45c11.58-9.41 28.48-7.48 37.89 4.1 0.48 0.48 0.97 1.21 1.21 1.69 73.36 108.62 73.36 250.78-0.25 359.14z" />
          </svg>
        </span>
      )}
    </Tag>
  )
}
