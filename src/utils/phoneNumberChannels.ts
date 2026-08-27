const PHONE_NUMBER_CHANNELS = new Set(['Phone', 'WhatsApp'])

export function isPhoneNumberChannel(channel: string) {
  return PHONE_NUMBER_CHANNELS.has(channel.trim())
}
