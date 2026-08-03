import type { PriorityListEntry } from '../types'

interface PriorityListSeed {
  channels: string[]
  createdBy: string
  identifiers: string[]
  reason: string
}

const priorityListSeeds: PriorityListSeed[] = [
  {
    channels: ['Bankapp'],
    createdBy: 'Admin',
    identifiers: ['BANKID00045678'],
    reason: 'BankApp customer identifier for priority queue.',
  },
  {
    channels: ['Phone'],
    createdBy: 'Admin',
    identifiers: ['08129876543', '08123456789', '08122222222'],
    reason: 'Phone priority customer batch.',
  },
  {
    channels: ['Instagram', 'X', 'Tik Tok', 'YouTube', 'Facebook'],
    createdBy: 'Supervisor',
    identifiers: ['Bank', 'Bank_1', 'Bank_2', 'Bank_3'],
    reason: 'Social media account priority batch.',
  },
  {
    channels: ['Webchat', 'Email Contact', 'Email Priority'],
    createdBy: 'Supervisor',
    identifiers: ['123@gmail.com', '@ojk.co.id', '@bi.go.id'],
    reason: 'Email and webchat priority batch.',
  },
]

const partialMatchSeedIdentifiers = new Set(['@ojk.co.id', '@bi.go.id'])

function getSeedMatchRule(
  identifier: string,
): PriorityListEntry['matchRule'] {
  return partialMatchSeedIdentifiers.has(identifier.trim().toLowerCase())
    ? 'partial_match'
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
          matchRule: getSeedMatchRule(identifier),
          reason: seed.reason,
        })),
      ),
    )
    .map((entry, index) => ({
      ...entry,
      createdAt: `2026-06-15 09:${String(index).padStart(2, '0')}`,
      id: `PL${String(index + 1).padStart(3, '0')}`,
    }))
