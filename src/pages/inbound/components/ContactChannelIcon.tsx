import {
  AppleFilled,
  FacebookFilled,
  InstagramFilled,
  LinkedinFilled,
  MailOutlined,
  MobileOutlined,
  TikTokFilled,
  WhatsAppOutlined,
  XOutlined,
  YoutubeFilled,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import { PhoneIcon } from '../../../components'
import type { ContactType } from './contactManagementData'

function PlayStoreIcon() {
  return (
    <svg
      aria-hidden="true"
      className="inbound-contact-channel-icon__play-store-icon"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M4.6 3.6v16.8l8.1-8.4z" fill="#34a853" />
      <path d="M12.7 12 4.6 3.6l10.5 6z" fill="#4285f4" />
      <path d="M12.7 12 4.6 20.4l10.5-6z" fill="#fbbc04" />
      <path d="m15.1 9.6 4.3 2.4-4.3 2.4-2.4-2.4z" fill="#ea4335" />
    </svg>
  )
}

const contactIcons: Record<ContactType, ReactNode> = {
  Phone: <PhoneIcon />,
  WhatsApp: <WhatsAppOutlined />,
  BankApp: <MobileOutlined />,
  Email: <MailOutlined />,
  Facebook: <FacebookFilled />,
  Instagram: <InstagramFilled />,
  X: <XOutlined />,
  TikTok: <TikTokFilled />,
  YouTube: <YoutubeFilled />,
  LinkedIn: <LinkedinFilled />,
  'App Store': <AppleFilled />,
  'Play Store': <PlayStoreIcon />,
}

function getModifier(type: ContactType) {
  return type.toLowerCase().replace(/\s+/g, '-')
}

export function ContactChannelIcon({ type }: { type: ContactType }) {
  return (
    <span
      aria-hidden="true"
      className={`inbound-contact-channel-icon inbound-contact-channel-icon--${getModifier(type)}`}
    >
      {contactIcons[type]}
    </span>
  )
}
