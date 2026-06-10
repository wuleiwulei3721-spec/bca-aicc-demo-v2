export type LiveChat2QuickReplyScope = 'my' | 'public'

export interface LiveChat2QuickReplyPhrase {
  code: string
  id: string
  text: string
}

export interface LiveChat2QuickReplyGroup {
  groupId: string
  groupName: string
  phrases: LiveChat2QuickReplyPhrase[]
  scope: LiveChat2QuickReplyScope
}

export interface LiveChat2QuickReplyOption extends LiveChat2QuickReplyPhrase {
  groupId: string
  groupName: string
  scope: LiveChat2QuickReplyScope
  source: string
}

export const defaultLiveChat2QuickReplyGroups: LiveChat2QuickReplyGroup[] = [
  {
    groupId: 'my-service',
    groupName: 'My Service',
    scope: 'my',
    phrases: [
      {
        code: 'aa',
        id: 'my-aa',
        text: 'Thank you for waiting. I am checking your latest BANK 1 record now.',
      },
      {
        code: 'ac',
        id: 'my-ac',
        text: 'I have submitted the service request. Please keep this chat open for confirmation.',
      },
      {
        code: 'ae',
        id: 'my-ae',
        text: 'Your case has been recorded. The related team will follow up through your registered contact.',
      },
    ],
  },
  {
    groupId: 'public-verification',
    groupName: 'Verification',
    scope: 'public',
    phrases: [
      {
        code: 'ab',
        id: 'public-ab',
        text: 'For verification, please confirm your registered mobile number and date of birth.',
      },
    ],
  },
  {
    groupId: 'public-security',
    groupName: 'Security',
    scope: 'public',
    phrases: [
      {
        code: 'ad',
        id: 'public-ad',
        text: 'For your security, never share OTP, PIN, CVV, password, or full card number in this chat.',
      },
      {
        code: 'af',
        id: 'public-af',
        text: 'I can help with one more request before we close this conversation.',
      },
    ],
  },
]

export function flattenLiveChat2QuickReplies(
  groups: LiveChat2QuickReplyGroup[],
): LiveChat2QuickReplyOption[] {
  return groups.flatMap((group) =>
    group.phrases.map((phrase) => ({
      ...phrase,
      groupId: group.groupId,
      groupName: group.groupName,
      scope: group.scope,
      source: group.groupName,
    })),
  )
}
