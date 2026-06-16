import type { PriorityListEntry } from '../types'

const emailDomainMatchChannels = new Set([
  'Webchat',
  'Email Contact',
  'Email Priority',
])

const domainLabelPattern = '[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?'
const emailDomainIdentifierPattern = new RegExp(
  `^@(?=.{1,253}$)(?:${domainLabelPattern}\\.)+${domainLabelPattern}$`,
)

interface PriorityListSeed {
  channels: string[]
  createdBy: string
  identifiers: string[]
  remark: string
}

const priorityListSeeds: PriorityListSeed[] = [
  {
    channels: ['Bankapp'],
    createdBy: 'Admin',
    identifiers: ['BANKID00045678'],
    remark: 'BankApp customer identifier for priority queue.',
  },
  {
    channels: ['Phone'],
    createdBy: 'Admin',
    identifiers: ['08129876543', '08123456789', '08122222222'],
    remark: 'Phone priority customer batch.',
  },
  {
    channels: ['Instagram', 'X', 'Tik Tok', 'YouTube', 'Facebook'],
    createdBy: 'Supervisor',
    identifiers: ['Bank', 'Bank_1', 'Bank_2', 'Bank_3'],
    remark: 'Social media account priority batch.',
  },
  {
    channels: ['Webchat', 'Email Contact', 'Email Priority'],
    createdBy: 'Supervisor',
    identifiers: ['123@gmail.com', '@ojk.co.id', '@bi.go.id'],
    remark: 'Email and webchat priority batch.',
  },
]

function getPriorityListMatchRule(
  channel: string,
  identifier: string,
): PriorityListEntry['matchRule'] {
  return emailDomainMatchChannels.has(channel) &&
    emailDomainIdentifierPattern.test(identifier.trim())
    ? 'email_domain_match'
    : 'exact_match'
}

export const defaultPriorityListEntries: PriorityListEntry[] =
  priorityListSeeds
    .flatMap((seed) =>
      seed.identifiers.flatMap((identifier) =>
        seed.channels.map((channel) => ({
          channel,
          createdBy: seed.createdBy,
          identifier,
          matchRule: getPriorityListMatchRule(channel, identifier),
          remark: seed.remark,
        })),
      ),
    )
    .map((entry, index) => ({
      ...entry,
      createdAt: `2026-06-15 09:${String(index).padStart(2, '0')}`,
      id: `PL${String(index + 1).padStart(3, '0')}`,
    }))
