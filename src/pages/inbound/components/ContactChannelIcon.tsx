import { ChannelLogo } from '../../../components'
import type { ContactType } from './contactManagementData'

function getModifier(type: ContactType) {
  return type.toLowerCase().replace(/\s+/g, '-')
}

export function ContactChannelIcon({ type }: { type: ContactType }) {
  return (
    <span
      aria-hidden="true"
      className={`inbound-contact-channel-icon inbound-contact-channel-icon--${getModifier(type)}`}
    >
      <ChannelLogo channel={type} />
    </span>
  )
}
