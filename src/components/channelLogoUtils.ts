export type ChannelLogoVariant = 'standard' | 'livechat'

export type ChannelLogoChannel =
  | 'Phone'
  | 'Video'
  | 'Email'
  | 'BankApp'
  | 'BankApp Voice'
  | 'BankApp Video'
  | 'WhatsApp'
  | 'Webchat'
  | 'Webchat Voice'
  | 'Facebook'
  | 'Instagram'
  | 'X'
  | 'TikTok'
  | 'YouTube'
  | 'LinkedIn'
  | 'App Store'
  | 'Google Play'
  | 'Play Store'

const standardLogoFiles: Record<string, string> = {
  'App Store': 'app-store.png',
  BankApp: 'bankapp.png',
  'BankApp Video': 'bankapp.png',
  'BankApp Voice': 'bankapp.png',
  Email: 'email.png',
  Facebook: 'facebook.png',
  Instagram: 'instagram.png',
  LinkedIn: 'linkedin.png',
  Phone: 'phone.png',
  'Google Play': 'play-store.png',
  'Play Store': 'play-store.png',
  TikTok: 'tiktok.png',
  Video: 'bankapp.png',
  Webchat: 'webchat.png',
  'Webchat Voice': 'webchat.png',
  WhatsApp: 'whatsapp.png',
  X: 'x.png',
  YouTube: 'youtube.png',
}

const liveChatLogoFiles: Record<string, string> = {
  BankApp: 'bankapp.png',
  Webchat: 'webchat.png',
  WhatsApp: 'whatsapp.png',
}

export function getChannelLogoSrc(
  channel: ChannelLogoChannel,
  variant: ChannelLogoVariant = 'standard',
) {
  const base = '/channel-logos'
  if (variant === 'livechat') {
    const file = liveChatLogoFiles[channel.replace(/ (Voice|Video)$/, '')]
    if (file) return `${base}/livechat/${file}`
  }

  return `${base}/${standardLogoFiles[channel] ?? standardLogoFiles.Phone}`
}
