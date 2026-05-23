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
}

const channelClassNames: Record<string, string> = {
  BankApp: 'inbound-channel-tag--haloapps',
  Phone: 'inbound-channel-tag--phone',
  Video: 'inbound-channel-tag--video',
  'Haloapps Voice': 'inbound-channel-tag--haloapps',
  'Haloapps Video': 'inbound-channel-tag--haloapps',
  Haloapps: 'inbound-channel-tag--haloapps',
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
  'Haloapps Voice': 'BankApp',
  'Haloapps Video': 'BankApp',
  Haloapps: 'BankApp',
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
    value === 'Haloapps' ||
    value === 'Haloapps Voice' ||
    value === 'Haloapps Video'
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

export function ChannelTag({ value, compact }: ChannelTagProps) {
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
      {channelDisplayLabels[value] ?? value}
    </Tag>
  )
}
