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

export function ChannelTag({ value, compact, duration }: ChannelTagProps) {
  return (
    <Tag
      className={[
        'inbound-channel-tag',
        channelClassNames[value],
        compact ? 'inbound-channel-tag--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      icon={renderIcon(value)}
    >
      <span className="inbound-channel-tag__label">
        {channelDisplayLabels[value] ?? value}
      </span>
      {duration && (
        <span className="inbound-channel-tag__duration">
          <span aria-hidden="true" className="inbound-channel-tag__separator">
            &middot;
          </span>
          {duration}
        </span>
      )}
    </Tag>
  )
}
