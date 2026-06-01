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
        text: 'Thank you for waiting. I am checking the latest record now.',
      },
      {
        code: 'ac',
        id: 'my-ac',
        text: 'I have submitted the request. Please wait for confirmation.',
      },
      {
        code: 'ae',
        id: 'my-ae',
        text: 'The ticket has been created and will be followed up by the related team.',
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
        text: 'Please provide your registered mobile number for verification.',
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
        text: 'For your security, please do not share OTP or PIN in this chat.',
      },
      {
        code: 'af',
        id: 'public-af',
        text: 'Is there anything else I can help you with today?',
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
