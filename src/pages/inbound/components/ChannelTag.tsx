import {
  AudioOutlined,
  MessageOutlined,
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
  Phone: 'inbound-channel-tag--phone',
  'Haloapps Voice': 'inbound-channel-tag--voice',
  'Webchat Voice': 'inbound-channel-tag--webchat',
  Email: 'inbound-channel-tag--email',
  X: 'inbound-channel-tag--x',
  Instagram: 'inbound-channel-tag--instagram',
  TikTok: 'inbound-channel-tag--tiktok',
  WhatsApp: 'inbound-channel-tag--whatsapp',
}

const channelDisplayLabels: Partial<Record<ChannelTagValue, string>> = {
  Phone: 'PSTN',
}

function renderIcon(value: ChannelTagValue) {
  if (value === 'Phone') {
    return <PhoneIcon />
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
