export const CONTACT_SECTIONS = [
  {
    title: 'Communication Channels',
    types: ['Phone', 'WhatsApp', 'BankApp', 'Email'],
  },
  {
    title: 'Social Media',
    types: ['Facebook', 'Instagram', 'X', 'TikTok', 'YouTube', 'LinkedIn'],
  },
  {
    title: 'App Store Channels',
    types: ['App Store', 'Play Store'],
  },
] as const

export const CUSTOMER_CONTACT_DETAIL_SECTIONS = [
  {
    title: 'Communication Channels',
    types: ['Phone', 'BankApp', 'Email'],
  },
  {
    title: 'Social Media',
    types: ['Facebook', 'Instagram', 'X', 'TikTok', 'LinkedIn'],
  },
] as const

export type ContactType =
  (typeof CONTACT_SECTIONS)[number]['types'][number]

export const CONTACT_TYPES: ContactType[] = CONTACT_SECTIONS.flatMap(
  (section) => section.types,
)

export interface ContactRecord {
  id: string
  value: string
}

export type ContactGroups = Record<ContactType, ContactRecord[]>
