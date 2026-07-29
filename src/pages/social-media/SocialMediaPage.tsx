import { useMemo, useState } from 'react'
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CommentOutlined,
  EyeOutlined,
  LeftOutlined,
  MessageOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PoweroffOutlined,
  SendOutlined,
  SmileOutlined,
  StarFilled,
} from '@ant-design/icons'
import { BaseButton } from '../../components'
import { useNow } from '../../hooks/useNow'

type SocialMediaView = 'conversation' | 'post-detail'
type SocialMediaWorkbenchTab = 'crm' | 'conversation'
type SocialMediaChannel =
  | 'facebook'
  | 'instagram'
  | 'x'
  | 'youtube'
  | 'linkedin'
  | 'tiktok'
  | 'appstore'
  | 'googleplay'
type SocialMediaType = 'chats' | 'cmts' | 'reviews' | 'at'
type ReplyProgressTone = 'active' | 'warning' | 'expired'

type SocialMediaCommentMedia =
  | {
      alt: string
      caption: string
      kind: 'image'
      src: string
    }
  | {
      caption: string
      kind: 'video'
      posterSrc: string
      src: string
      title: string
    }

interface SocialMediaFilterOption<T extends string> {
  activeButtonChrome?: boolean
  activeIconSrc: string
  activeIconSprite?: boolean
  activeSpritePosition?: string
  activeChipSrc?: string
  chipSrc?: string
  color: string
  iconSrc: string
  key: T
  label: string
  logoSrc: string
  queueIconSrc?: string
}

interface SocialMediaItem {
  avatarSrc: string
  channel: SocialMediaChannel
  commentMedia?: SocialMediaCommentMedia[]
  customer: string
  handle: string
  id: string
  initialReplySeconds: number
  post: string
  preview: string
  queue: string
  replies: number
  status: 'pending' | 'replied' | 'review'
  title: string
  type: SocialMediaType
  unread: number
}

const REPLY_TIMEOUT_SECONDS = 5 * 60
const REVIEW_DISPLAY_DATE = '2024/03/17'
const DEFAULT_REVIEW_REPLY =
  'Hello! I will help you to apply for a credit card activation.'
const CHAT_DISPLAY_DATE = 'TODAY, 23 SEP 2025'
const DEFAULT_CHAT_REPLY =
  'Thanks for the detailed feedback. We will share this with the product team and follow up once the update is reviewed.'
const LONG_CHAT_MESSAGE =
  "Could you introduce a new feature that allows me to copy all the text highlighted and marked with a single click? After reading the entire book, I really want to copy all the highlighted content and collect it. The toolbar for highlighting annotations in the current version is really not as user-friendly as the old version (with black background and graphical symbols). The current options for selecting colors, deleting annotations, and copying are too awkward. I'm completely unaccustomed to the text-based toolbar. The icon-based toolbar in the old version was much better. Please change it back to the old version! I don't know if it's just my illusion, but the color of the highlighted annotations has become darker, which makes me feel uncomfortable compared to the old version. The visual effect of the highlighted border turning into an arc is not good at all. Please restore it to the original right angle. Really, really, it will affect my reading mood and efficiency. Why is the cross to exit reading set in the top right corner? I'm used to exiting from the top left corner and can't accept it at all. The page and progress display during reading are also extremely unaccustomed. Please, please change it back to the old version. The old version is much more comfortable! Please, please change it back to the old version. It really affects my reading mood!!"

const socialMediaAsset = (fileName: string) =>
  `/social-media-assets/${fileName}`

const socialMediaAvatar = (fileName: string) =>
  socialMediaAsset(`avatars/${fileName}`)

const allFilterIcon = socialMediaAsset('all.svg')
const allFilterIconActive = socialMediaAsset('all-active.svg')
const crmIcon = socialMediaAsset('crm.svg')
const crmIconActive = socialMediaAsset('crm-active.svg')
const crmScreenshot = socialMediaAsset('crm-screenshot.png')
const cwuWindows = [
  socialMediaAsset('cwu/cwu-window-1.svg'),
  socialMediaAsset('cwu/cwu-window-2.svg'),
  socialMediaAsset('cwu/cwu-window-3.svg'),
  socialMediaAsset('cwu/cwu-window-4.svg'),
]
const COMMENT_VIDEO_LOOP_SECONDS = 3
const scenicWaterfallVideoSrc =
  'https://upload.wikimedia.org/wikipedia/commons/5/52/Video_%C5%A0%C3%BAtovsk%C3%BD_vodop%C3%A1d.webm'
const CWU_GROUPED_DROPDOWN_INDEX = 0
const CWU_FLAT_DROPDOWN_INDEX = 1
const CWU_INITIAL_FORM_INDEX = 2
const CWU_SELECTED_FORM_INDEX = 3

const channelOptions: SocialMediaFilterOption<SocialMediaChannel>[] = [
  {
    activeIconSrc: socialMediaAsset('facebook-active.svg'),
    color: '#1877F2',
    iconSrc: socialMediaAsset('facebook.svg'),
    key: 'facebook',
    label: 'Facebook',
    logoSrc: socialMediaAsset('logos/facebook-logo.png'),
  },
  {
    activeIconSrc: socialMediaAsset('instagram-active.svg'),
    color: '#E4405F',
    iconSrc: socialMediaAsset('instagram.svg'),
    key: 'instagram',
    label: 'Instagram',
    logoSrc: socialMediaAsset('logos/instagram-logo.png'),
  },
  {
    activeIconSrc: socialMediaAsset('x-active.svg'),
    color: '#111827',
    iconSrc: socialMediaAsset('x.svg'),
    key: 'x',
    label: 'X',
    logoSrc: socialMediaAsset('logos/x-logo.png'),
  },
  {
    activeIconSprite: false,
    activeIconSrc: socialMediaAsset('youtube-active.svg'),
    color: '#FF0000',
    iconSrc: socialMediaAsset('youtube.svg'),
    key: 'youtube',
    label: 'YouTube',
    logoSrc: socialMediaAsset('logos/youtube-logo.png'),
  },
  {
    activeIconSrc: socialMediaAsset('linkedin-active.svg'),
    color: '#0A66C2',
    iconSrc: socialMediaAsset('linkedin.svg'),
    key: 'linkedin',
    label: 'LinkedIn',
    logoSrc: socialMediaAsset('logos/linkedin-logo.png'),
  },
  {
    activeIconSrc: socialMediaAsset('tiktok-active.svg'),
    color: '#111827',
    iconSrc: socialMediaAsset('tiktok.svg'),
    key: 'tiktok',
    label: 'TikTok',
    logoSrc: socialMediaAsset('logos/tiktok-logo.png'),
  },
  {
    activeIconSrc: socialMediaAsset('appstore-active.svg'),
    color: '#1473E6',
    iconSrc: socialMediaAsset('appstore.svg'),
    key: 'appstore',
    label: 'App Store',
    logoSrc: socialMediaAsset('logos/appstore-logo.png'),
  },
  {
    activeIconSprite: false,
    activeIconSrc: socialMediaAsset('googleplay-active.svg'),
    color: '#25B46B',
    iconSrc: socialMediaAsset('googleplay.svg'),
    key: 'googleplay',
    label: 'Google Play',
    logoSrc: socialMediaAsset('logos/googleplay-logo.png'),
  },
]

const typeOptions: SocialMediaFilterOption<SocialMediaType>[] = [
  {
    activeChipSrc: socialMediaAsset('chats-active.svg'),
    activeIconSrc: socialMediaAsset('chats-active.svg'),
    chipSrc: socialMediaAsset('chats.svg'),
    color: '#1D6FEA',
    iconSrc: socialMediaAsset('chats.svg'),
    key: 'chats',
    label: 'Chats',
    queueIconSrc: socialMediaAsset('type-icons/chats.png'),
  },
  {
    activeChipSrc: socialMediaAsset('cmts-active.svg'),
    activeIconSrc: socialMediaAsset('cmts-active.svg'),
    chipSrc: socialMediaAsset('cmts.svg'),
    color: '#B35CFF',
    iconSrc: socialMediaAsset('cmts.svg'),
    key: 'cmts',
    label: 'Cmts',
    queueIconSrc: socialMediaAsset('type-icons/cmts.png'),
  },
  {
    activeChipSrc: socialMediaAsset('at-active.svg'),
    activeIconSrc: socialMediaAsset('at-active.svg'),
    chipSrc: socialMediaAsset('at.svg'),
    color: '#18A870',
    iconSrc: socialMediaAsset('at.svg'),
    key: 'at',
    label: 'AT',
    queueIconSrc: socialMediaAsset('type-icons/at.png'),
  },
  {
    activeChipSrc: socialMediaAsset('reviews-active.svg'),
    activeIconSrc: socialMediaAsset('reviews-active.svg'),
    chipSrc: socialMediaAsset('reviews.svg'),
    color: '#F6A623',
    iconSrc: socialMediaAsset('reviews.svg'),
    key: 'reviews',
    label: 'Reviews',
    queueIconSrc: socialMediaAsset('type-icons/reviews.png'),
  },
]

const socialMediaItems: SocialMediaItem[] = [
  {
    avatarSrc: socialMediaAvatar('avatar-01.jpg'),
    channel: 'instagram',
    commentMedia: [
      {
        alt: 'Sunny coastal village shared by the commenter',
        caption: 'Customer image attachment',
        kind: 'image',
        src: socialMediaAsset('comments/comment-image-01.png'),
      },
      {
        alt: 'Cliffside village by the sea shared by the commenter',
        caption: 'Follow-up image attachment',
        kind: 'image',
        src: socialMediaAsset('comments/comment-image-02.png'),
      },
    ],
    customer: 'Dimas Abimanyu Prabowo',
    handle: '@dimas.ap',
    id: 'sm-001',
    initialReplySeconds: 59,
    post:
      'Up to 50% off on all summer essentials! Get yours before they run out. All cards and digital payment options are supported.',
    preview: 'Need help with card activation',
    queue: 'Credit card activation',
    replies: 3,
    status: 'pending',
    title: 'BANK 1 Official Support',
    type: 'cmts',
    unread: 1,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-02.jpg'),
    channel: 'facebook',
    commentMedia: [
      {
        alt: 'Blue sea dome travel image shared in the comment',
        caption: 'Reference image',
        kind: 'image',
        src: socialMediaAsset('comments/comment-image-03.png'),
      },
    ],
    customer: 'Guest',
    handle: 'Guest account',
    id: 'sm-002',
    initialReplySeconds: 239,
    post:
      'Payment failed after checkout but the balance has already been deducted. Please help me confirm the transaction.',
    preview: 'Payment dispute on FB comment',
    queue: 'Payment dispute',
    replies: 2,
    status: 'review',
    title: 'BANK 1 Facebook Page',
    type: 'cmts',
    unread: 2,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-03.jpg'),
    channel: 'x',
    customer: 'Michael Chen',
    handle: '@michaelchen',
    id: 'sm-003',
    initialReplySeconds: 899,
    post: LONG_CHAT_MESSAGE,
    preview: 'Account verification needed',
    queue: 'Account verification',
    replies: 5,
    status: 'pending',
    title: 'X Inbox',
    type: 'chats',
    unread: 2,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-04.jpg'),
    channel: 'instagram',
    customer: 'Emma Davis',
    handle: '@emmadavis',
    id: 'sm-004',
    initialReplySeconds: 1499,
    post:
      'Can I replace my damaged credit card through branch pickup? The delivery address changed last week.',
    preview: 'Credit card replacement',
    queue: 'Card replacement',
    replies: 12,
    status: 'pending',
    title: 'Instagram DM',
    type: 'chats',
    unread: 12,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-05.jpg'),
    channel: 'linkedin',
    customer: 'Nadia Putri',
    handle: 'Nadia Putri',
    id: 'sm-005',
    initialReplySeconds: 432,
    post:
      'Our corporate card onboarding team needs confirmation for the requested limit change.',
    preview: 'Corporate card onboarding',
    queue: 'Corporate service',
    replies: 1,
    status: 'replied',
    title: 'LinkedIn Inbox',
    type: 'chats',
    unread: 0,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-06.jpg'),
    channel: 'tiktok',
    commentMedia: [
      {
        alt: 'Coastal city image shared by the commenter',
        caption: 'Image comment',
        kind: 'image',
        src: socialMediaAsset('comments/comment-image-04.png'),
      },
      {
        alt: 'Lake and mountain landscape shared by the commenter',
        caption: 'Image comment',
        kind: 'image',
        src: socialMediaAsset('comments/comment-image-05.png'),
      },
      {
        caption: 'Short landscape video comment',
        kind: 'video',
        posterSrc: socialMediaAsset('comments/comment-image-05.png'),
        src: scenicWaterfallVideoSrc,
        title: 'Waterfall video comment',
      },
    ],
    customer: 'Rafi Aditya',
    handle: '@rafiaditya',
    id: 'sm-006',
    initialReplySeconds: 568,
    post:
      'The branch queue video was helpful. I want to know whether online appointment slots are available today.',
    preview: 'Branch appointment question',
    queue: 'Branch service',
    replies: 4,
    status: 'pending',
    title: 'TikTok comment',
    type: 'cmts',
    unread: 4,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-07.jpg'),
    channel: 'youtube',
    customer: 'Sari Handayani',
    handle: '@sarihandayani',
    id: 'sm-007',
    initialReplySeconds: 341,
    post:
      'Five stars for the mobile banking tutorial. Please add a video for credit-card reward redemption.',
    preview: 'Positive tutorial review',
    queue: 'Product review',
    replies: 0,
    status: 'review',
    title: 'YouTube Review',
    type: 'reviews',
    unread: 0,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-08.jpg'),
    channel: 'facebook',
    customer: 'Budi Santoso',
    handle: '@budisantoso',
    id: 'sm-008',
    initialReplySeconds: 662,
    post:
      'Can the agent check why my card limit request is still pending after two business days?',
    preview: 'Tagged support for limit request',
    queue: 'Limit request',
    replies: 2,
    status: 'pending',
    title: 'Facebook mention',
    type: 'at',
    unread: 2,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-09.jpg'),
    channel: 'appstore',
    customer: 'Maya Larasati',
    handle: 'App Store review',
    id: 'sm-009',
    initialReplySeconds: 281,
    post:
      'The new app flow is faster, but I cannot find the card statement download option after the update.',
    preview: 'App review needs guidance',
    queue: 'Mobile app review',
    replies: 1,
    status: 'review',
    title: 'App Store Review',
    type: 'reviews',
    unread: 1,
  },
  {
    avatarSrc: socialMediaAvatar('avatar-10.jpg'),
    channel: 'googleplay',
    customer: 'Andi Pratama',
    handle: 'Google Play user',
    id: 'sm-010',
    initialReplySeconds: 126,
    post:
      'I updated the app and tagged support because QR payment setup still asks for verification twice.',
    preview: 'QR payment setup mention',
    queue: 'App verification',
    replies: 2,
    status: 'pending',
    title: 'Google Play Mention',
    type: 'at',
    unread: 2,
  },
]

const allChannelKeys = channelOptions.map((option) => option.key)
const allTypeKeys = typeOptions.map((option) => option.key)
const defaultSocialMediaItemId =
  socialMediaItems.find((item) => item.type === 'chats')?.id ??
  socialMediaItems[0].id

function toggleValue<T extends string>(values: T[], value: T) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }

  return [...values, value]
}

function getChannelOption(channel: SocialMediaChannel) {
  return channelOptions.find((option) => option.key === channel)!
}

function getTypeOption(type: SocialMediaType) {
  return typeOptions.find((option) => option.key === type)!
}

function formatReplyElapsed(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${minutes}m${seconds.toString().padStart(2, '0')}s`
}

function getReplyProgress(
  item: SocialMediaItem,
  now: number,
  pageStartedAt: number,
) {
  const elapsedSeconds =
    item.initialReplySeconds +
    Math.max(0, Math.floor((now - pageStartedAt) / 1000))
  const progress = Math.min(
    100,
    (elapsedSeconds / REPLY_TIMEOUT_SECONDS) * 100,
  )
  const tone: ReplyProgressTone =
    elapsedSeconds >= REPLY_TIMEOUT_SECONDS
      ? 'expired'
      : elapsedSeconds >= REPLY_TIMEOUT_SECONDS * 0.75
        ? 'warning'
        : 'active'

  return {
    elapsedSeconds,
    label: formatReplyElapsed(elapsedSeconds),
    progress,
    tone,
  }
}

function getPostTitle(item: SocialMediaItem) {
  return item.type === 'reviews' ? 'Mid-Year Summer Sale' : item.title
}

function getPostCopy(item: SocialMediaItem) {
  if (item.type === 'reviews') {
    return 'Up to 50% off on all summer essentials! Get yours before they run out. on all 5 ...'
  }

  return item.post
}

function getPostContextLabel(item: SocialMediaItem) {
  return item.type === 'reviews'
    ? 'Original Reviews Context'
    : 'Original Post Context'
}

function getReviewCopy(item: SocialMediaItem) {
  if (item.type === 'reviews') {
    return 'Hello! I need help with my credit card activation.'
  }

  return `${item.preview}.`
}

function ReviewStars({ compact }: { compact?: boolean }) {
  return (
    <span
      aria-label="5 star rating"
      className={`social-media-page__review-stars${
        compact ? ' social-media-page__review-stars--compact' : ''
      }`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <StarFilled key={index} />
      ))}
    </span>
  )
}

function CommentMediaAttachments({
  media,
}: {
  media?: SocialMediaCommentMedia[]
}) {
  if (!media?.length) {
    return null
  }

  return (
    <div
      className={`social-media-page__comment-media-grid${
        media.length === 1
          ? ' social-media-page__comment-media-grid--single'
          : ''
      }`}
    >
      {media.map((mediaItem) => (
        <figure
          className="social-media-page__comment-media"
          key={`${mediaItem.kind}-${mediaItem.src}`}
        >
          {mediaItem.kind === 'image' ? (
            <img alt={mediaItem.alt} src={mediaItem.src} />
          ) : (
            <video
              aria-label={mediaItem.title}
              autoPlay
              controls
              muted
              playsInline
              poster={mediaItem.posterSrc}
              preload="metadata"
              onLoadedMetadata={(event) => {
                event.currentTarget.currentTime = 0
              }}
              onTimeUpdate={(event) => {
                if (
                  event.currentTarget.currentTime >=
                  COMMENT_VIDEO_LOOP_SECONDS
                ) {
                  event.currentTarget.currentTime = 0
                }
              }}
            >
              <source src={mediaItem.src} type="video/webm" />
            </video>
          )}
          <figcaption>{mediaItem.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function SearchGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="social-media-page__search-glyph"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        d="M7.2 2.2a5 5 0 1 0 3.12 8.91l2.28 2.27a.72.72 0 0 0 1.02-1.02l-2.27-2.28A5 5 0 0 0 7.2 2.2Zm0 1.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

function FilterGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="social-media-page__button-glyph"
      focusable="false"
      viewBox="0 0 16 16"
    >
      <path
        d="M2.5 3.25c0-.41.34-.75.75-.75h9.5a.75.75 0 0 1 .57 1.24L9.25 8.47v3.33a.75.75 0 0 1-1.08.67l-1.65-.82a.75.75 0 0 1-.42-.67V8.47L1.93 3.74a.75.75 0 0 1 .57-.49Zm1.42.75 3.48 3.96c.12.14.2.32.2.5v2.05l.15.07V8.46c0-.18.07-.36.19-.5L11.42 4Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}

function RefreshGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="social-media-page__button-glyph"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 16 16"
    >
      <path d="M12.33 5.36A4.7 4.7 0 0 0 3.52 6.4" />
      <path d="M12.33 2.92v2.44H9.88" />
      <path d="M3.67 10.64a4.7 4.7 0 0 0 8.81-1.04" />
      <path d="M3.67 13.08v-2.44h2.45" />
    </svg>
  )
}

function SocialChannelMark({ channel }: { channel: SocialMediaChannel }) {
  const option = getChannelOption(channel)

  return (
    <span className="social-media-page__channel-mark" aria-hidden="true">
      <img
        alt=""
        className="social-media-page__channel-logo"
        src={option.logoSrc}
      />
    </span>
  )
}

function SocialFilterIcon({
  activeSprite,
  spritePosition,
  src,
}: {
  activeSprite?: boolean
  spritePosition?: string
  src: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`social-media-page__filter-icon${
        activeSprite ? ' social-media-page__filter-icon--active-sprite' : ''
      }`}
      style={{
        backgroundImage: `url(${src})`,
        ...(spritePosition ? { backgroundPosition: spritePosition } : {}),
      }}
    />
  )
}

function SocialAvatar({ item }: { item: SocialMediaItem }) {
  return (
    <span className="social-media-page__avatar">
      <img alt="" className="social-media-page__avatar-image" src={item.avatarSrc} />
      <SocialChannelMark channel={item.channel} />
    </span>
  )
}

function SocialTypeChip({
  active,
  compact,
  type,
}: {
  active?: boolean
  compact?: boolean
  type: SocialMediaType
}) {
  const option = getTypeOption(type)
  const src = active
    ? (option.activeChipSrc ?? option.activeIconSrc)
    : (option.chipSrc ?? option.iconSrc)

  return (
    <img
      alt=""
      aria-hidden="true"
      className={`social-media-page__type-chip-image${
        compact ? ' social-media-page__type-chip-image--compact' : ''
      }`}
      src={src}
    />
  )
}

function SocialQueueTypeIcon({ type }: { type: SocialMediaType }) {
  const option = getTypeOption(type)

  return (
    <img
      alt=""
      aria-hidden="true"
      className="social-media-page__queue-type-icon"
      src={option.queueIconSrc ?? option.iconSrc}
    />
  )
}

function CrmTabIcon({ active }: { active: boolean }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="social-media-page__workbench-tab-icon"
      src={active ? crmIconActive : crmIcon}
    />
  )
}

function BrandLogo() {
  return (
    <span aria-label="BANK 1" className="social-media-page__brand-logo">
      BANK 1
    </span>
  )
}

export function SocialMediaPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedChannels, setSelectedChannels] =
    useState<SocialMediaChannel[]>(allChannelKeys)
  const [selectedTypes, setSelectedTypes] =
    useState<SocialMediaType[]>(allTypeKeys)
  const [activeItemId, setActiveItemId] = useState(defaultSocialMediaItemId)
  const [view, setView] = useState<SocialMediaView>('conversation')
  const [activeWorkbenchTab, setActiveWorkbenchTab] =
    useState<SocialMediaWorkbenchTab>('conversation')
  const [isCwuOpen, setIsCwuOpen] = useState(false)
  const [activeCwuWindowIndex, setActiveCwuWindowIndex] = useState(0)
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({})
  const [reviewReplies, setReviewReplies] = useState<Record<string, string>>({})
  const [chatDrafts, setChatDrafts] = useState<Record<string, string>>({})
  const [chatReplies, setChatReplies] = useState<Record<string, string>>({})
  const [pageStartedAt] = useState(() => Date.now())
  const now = useNow(true)

  const filteredItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return socialMediaItems.filter((item) => {
      const matchesChannel = selectedChannels.includes(item.channel)
      const matchesType = selectedTypes.includes(item.type)
      const matchesSearch =
        !query ||
        [item.customer, item.handle, item.preview, item.queue, item.title]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesChannel && matchesType && matchesSearch
    })
  }, [searchValue, selectedChannels, selectedTypes])

  const activeItem =
    filteredItems.find((item) => item.id === activeItemId) ??
    filteredItems[0] ??
    null
  const activeChannel = activeItem
    ? getChannelOption(activeItem.channel)
    : channelOptions[0]
  const activeType = activeItem ? getTypeOption(activeItem.type) : typeOptions[0]
  const activeReplyProgress = activeItem
    ? getReplyProgress(activeItem, now, pageStartedAt)
    : null
  const activeCwuWindow = cwuWindows[activeCwuWindowIndex]
  const activeReviewDraft = activeItem ? (reviewDrafts[activeItem.id] ?? '') : ''
  const activeReviewReply = activeItem ? reviewReplies[activeItem.id] : ''
  const activeChatDraft = activeItem ? (chatDrafts[activeItem.id] ?? '') : ''
  const activeChatReply = activeItem ? chatReplies[activeItem.id] : ''
  const activeItemIsReplied =
    activeItem?.status === 'replied' ||
    Boolean(activeReviewReply) ||
    Boolean(activeChatReply)

  const openCwuWindow = () => {
    setActiveCwuWindowIndex(CWU_INITIAL_FORM_INDEX)
    setIsCwuOpen(true)
  }

  const sendReviewReply = () => {
    if (!activeItem || activeItem.type !== 'reviews') {
      return
    }

    const replyText = activeReviewDraft.trim() || DEFAULT_REVIEW_REPLY

    setReviewReplies((current) => ({
      ...current,
      [activeItem.id]: replyText,
    }))
    setReviewDrafts((current) => ({
      ...current,
      [activeItem.id]: '',
    }))
  }

  const sendChatReply = () => {
    if (!activeItem || activeItem.type !== 'chats') {
      return
    }

    const replyText = activeChatDraft.trim() || DEFAULT_CHAT_REPLY

    setChatReplies((current) => ({
      ...current,
      [activeItem.id]: replyText,
    }))
    setChatDrafts((current) => ({
      ...current,
      [activeItem.id]: '',
    }))
  }

  const areAllChannelsSelected =
    selectedChannels.length === allChannelKeys.length
  const areAllTypesSelected = selectedTypes.length === allTypeKeys.length

  return (
    <section className="social-media-page" aria-label="Social Media">
      <aside className="social-media-page__queue-panel">
        <div className="social-media-page__queue-toolbar">
          <label className="social-media-page__search-field">
            <SearchGlyph />
            <input
              aria-label="Search Social Media items"
              placeholder="Search"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>
          <button
            aria-label="Filter Social Media items"
            className={`social-media-page__svg-icon-button${
              isFilterOpen ? ' social-media-page__svg-icon-button--selected' : ''
            }`}
            title="Filter"
            type="button"
            onClick={() => setIsFilterOpen((open) => !open)}
          >
            <FilterGlyph />
          </button>
          <button
            aria-label="Refresh Social Media items"
            className="social-media-page__svg-icon-button"
            title="Refresh"
            type="button"
            onClick={() => {
              setSearchValue('')
              setSelectedChannels(allChannelKeys)
              setSelectedTypes(allTypeKeys)
              setView('conversation')
            }}
          >
            <RefreshGlyph />
          </button>
        </div>

        {isFilterOpen ? (
          <div className="social-media-page__filter-panel">
            <div className="social-media-page__filter-row social-media-page__filter-row--channels">
              <button
                aria-label="Toggle all social media channels"
                className={`social-media-page__filter-chip social-media-page__filter-chip--channel${
                  areAllChannelsSelected
                    ? ' social-media-page__filter-chip--active'
                    : ''
                }`}
                title="All"
                type="button"
                onClick={() =>
                  setSelectedChannels(
                    areAllChannelsSelected ? [] : allChannelKeys,
                  )
                }
              >
                <SocialFilterIcon
                  src={areAllChannelsSelected ? allFilterIconActive : allFilterIcon}
                />
              </button>
              {channelOptions.map((option) => {
                const isActive = selectedChannels.includes(option.key)

                return (
                  <button
                    key={option.key}
                    aria-label={`Filter channel ${option.label}`}
                    className={`social-media-page__filter-chip social-media-page__filter-chip--channel${
                      isActive ? ' social-media-page__filter-chip--active' : ''
                    }${
                      isActive && option.activeButtonChrome
                        ? ' social-media-page__filter-chip--chrome-active'
                        : ''
                    }`}
                    title={option.label}
                    type="button"
                    onClick={() =>
                      setSelectedChannels((current) =>
                        current.length === allChannelKeys.length
                          ? [option.key]
                          : toggleValue(current, option.key),
                      )
                    }
                  >
                    <SocialFilterIcon
                      activeSprite={
                        isActive &&
                        option.activeIconSprite !== false &&
                        !option.activeButtonChrome
                      }
                      spritePosition={
                        isActive ? option.activeSpritePosition : undefined
                      }
                      src={isActive ? option.activeIconSrc : option.iconSrc}
                    />
                  </button>
                )
              })}
            </div>

            <div className="social-media-page__filter-row social-media-page__filter-row--types">
              <button
                aria-label="Toggle all social media types"
                className={`social-media-page__filter-chip social-media-page__filter-chip--channel${
                  areAllTypesSelected
                    ? ' social-media-page__filter-chip--active'
                    : ''
                }`}
                title="All"
                type="button"
                onClick={() =>
                  setSelectedTypes(areAllTypesSelected ? [] : allTypeKeys)
                }
              >
                <SocialFilterIcon
                  src={areAllTypesSelected ? allFilterIconActive : allFilterIcon}
                />
              </button>
              {typeOptions.map((option) => {
                const isActive = selectedTypes.includes(option.key)

                return (
                  <button
                    key={option.key}
                    aria-label={`Filter type ${option.label}`}
                    className={`social-media-page__filter-chip social-media-page__filter-chip--type${
                      isActive ? ' social-media-page__filter-chip--active' : ''
                    }`}
                    title={option.label}
                    type="button"
                    onClick={() =>
                      setSelectedTypes((current) =>
                        current.length === allTypeKeys.length
                          ? [option.key]
                          : toggleValue(current, option.key),
                      )
                    }
                  >
                    <SocialTypeChip active={isActive} type={option.key} />
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="social-media-page__queue-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const type = getTypeOption(item.type)
              const isActive = activeItem?.id === item.id
              const replyProgress = getReplyProgress(item, now, pageStartedAt)
              const isChatReplySent =
                item.type === 'chats' && Boolean(chatReplies[item.id])
              const isReplySent =
                (item.type === 'reviews' && Boolean(reviewReplies[item.id])) ||
                isChatReplySent

              return (
                <button
                  key={item.id}
                  aria-label={`Open ${item.customer} ${type.label} item`}
                  className={`social-media-page__queue-card${
                    isActive ? ' social-media-page__queue-card--selected' : ''
                  }${
                    isChatReplySent
                      ? ' social-media-page__queue-card--chat-replied'
                      : ''
                  } social-media-page__queue-card--${replyProgress.tone}`}
                  type="button"
                  onClick={() => {
                    setActiveItemId(item.id)
                    setView('conversation')
                    setActiveWorkbenchTab('conversation')
                  }}
                >
                  <SocialAvatar item={item} />
                  <span className="social-media-page__queue-content">
                    <span className="social-media-page__queue-head">
                      <strong>{item.customer}</strong>
                      <span className="social-media-page__queue-badges">
                        <SocialQueueTypeIcon type={item.type} />
                        {isChatReplySent ? null : (
                          <span
                            className={`social-media-page__queue-time social-media-page__queue-time--${replyProgress.tone}`}
                          >
                            {replyProgress.label}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="social-media-page__queue-preview">
                      {item.preview} ...
                    </span>
                  </span>
                  {item.unread > 0 && !isChatReplySent ? (
                    <em className="social-media-page__queue-unread">
                      {item.unread}
                    </em>
                  ) : null}
                  {isReplySent ? null : (
                    <span
                      aria-label={`Reply progress ${replyProgress.label} of 5 minutes`}
                      aria-valuemax={REPLY_TIMEOUT_SECONDS}
                      aria-valuemin={0}
                      aria-valuenow={Math.min(
                        REPLY_TIMEOUT_SECONDS,
                        replyProgress.elapsedSeconds,
                      )}
                      className="social-media-page__queue-progress"
                      role="progressbar"
                    >
                      <span
                        className={`social-media-page__queue-progress-fill social-media-page__queue-progress-fill--${replyProgress.tone}`}
                        style={{ width: `${replyProgress.progress}%` }}
                      />
                    </span>
                  )}
                </button>
              )
            })
          ) : (
            <div className="social-media-page__empty">
              <strong>No social media items</strong>
              <span>Adjust channel or type filters.</span>
            </div>
          )}
        </div>
      </aside>

      <main className="social-media-page__workbench">
        <div className="social-media-page__workbench-tabs">
          <button
            aria-pressed={activeWorkbenchTab === 'crm'}
            className={`social-media-page__workbench-tab${
              activeWorkbenchTab === 'crm'
                ? ' social-media-page__workbench-tab--active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveWorkbenchTab('crm')}
          >
            <CrmTabIcon active={activeWorkbenchTab === 'crm'} />
            CRM
          </button>
          <button
            aria-pressed={activeWorkbenchTab === 'conversation'}
            className={`social-media-page__workbench-tab${
              activeWorkbenchTab === 'conversation'
                ? ' social-media-page__workbench-tab--active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveWorkbenchTab('conversation')}
          >
            <MessageOutlined />
            Conversation
          </button>
          <BaseButton
            aria-label="Create Social Media CWU"
            className="social-media-page__cwu-button"
            icon={<SendOutlined />}
            variant="primary"
            onClick={openCwuWindow}
          >
            CWU
          </BaseButton>
          {activeItem?.type === 'chats' &&
          activeWorkbenchTab === 'conversation' ? (
            <BaseButton
              aria-label="End Social Media service"
              className="social-media-page__end-service-button"
              icon={<PoweroffOutlined />}
              variant="danger"
            >
              End Service
            </BaseButton>
          ) : null}
          {isCwuOpen ? (
            <div
              aria-label="CWU Registration"
              className={`social-media-page__cwu-popover social-media-page__cwu-popover--window-${
                activeCwuWindowIndex + 1
              }`}
              role="dialog"
            >
              <img
                alt="CWU Registration floating window"
                className="social-media-page__cwu-popover-image"
                src={activeCwuWindow}
              />
              <button
                aria-label="Close CWU Registration"
                className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--close"
                type="button"
                onClick={() => setIsCwuOpen(false)}
              />
              {activeCwuWindowIndex === CWU_INITIAL_FORM_INDEX ? (
                <>
                  <button
                    aria-label="Open CWU Business Type select"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--select"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_GROUPED_DROPDOWN_INDEX)
                    }
                  />
                  <button
                    aria-label="Generate CWU summary"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--generate-initial"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_SELECTED_FORM_INDEX)
                    }
                  />
                  <button
                    aria-label="Cancel CWU Registration"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--cancel-initial"
                    type="button"
                    onClick={() => setIsCwuOpen(false)}
                  />
                  <button
                    aria-label="Confirm CWU Registration"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--confirm-initial"
                    type="button"
                    onClick={() => setIsCwuOpen(false)}
                  />
                </>
              ) : null}
              {activeCwuWindowIndex === CWU_GROUPED_DROPDOWN_INDEX ? (
                <>
                  <button
                    aria-label="Close CWU Business Type select"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--select-open"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_INITIAL_FORM_INDEX)
                    }
                  />
                  <button
                    aria-label="Select CWU grouped business type"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--grouped-options"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_SELECTED_FORM_INDEX)
                    }
                  />
                  <button
                    aria-label="Show CWU flat business type list"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--category-list"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_FLAT_DROPDOWN_INDEX)
                    }
                  />
                </>
              ) : null}
              {activeCwuWindowIndex === CWU_FLAT_DROPDOWN_INDEX ? (
                <>
                  <button
                    aria-label="Close CWU flat business type list"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--select-open"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_INITIAL_FORM_INDEX)
                    }
                  />
                  <button
                    aria-label="Select CWU flat business type"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--flat-options"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_SELECTED_FORM_INDEX)
                    }
                  />
                </>
              ) : null}
              {activeCwuWindowIndex === CWU_SELECTED_FORM_INDEX ? (
                <>
                  <button
                    aria-label="Edit CWU selected business type"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--business-options"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_GROUPED_DROPDOWN_INDEX)
                    }
                  />
                  <button
                    aria-label="Generate CWU selected summary"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--generate-selected"
                    type="button"
                    onClick={() =>
                      setActiveCwuWindowIndex(CWU_SELECTED_FORM_INDEX)
                    }
                  />
                  <button
                    aria-label="Cancel CWU selected Registration"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--cancel-selected"
                    type="button"
                    onClick={() => setIsCwuOpen(false)}
                  />
                  <button
                    aria-label="Confirm CWU selected Registration"
                    className="social-media-page__cwu-hotspot social-media-page__cwu-hotspot--confirm-selected"
                    type="button"
                    onClick={() => setIsCwuOpen(false)}
                  />
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {activeWorkbenchTab === 'crm' ? (
          <section
            aria-label="CRM information"
            className="social-media-page__crm-panel"
          >
            <img
              alt="CRM information page"
              className="social-media-page__crm-screenshot"
              src={crmScreenshot}
            />
          </section>
        ) : activeItem ? (
          view === 'post-detail' ? (
            <section className="social-media-page__detail">
              <div className="social-media-page__detail-header">
                <BaseButton
                  aria-label="Back to Social Media conversation"
                  icon={<LeftOutlined />}
                  variant="ghost"
                  onClick={() => setView('conversation')}
                >
                  Back
                </BaseButton>
                <div>
                  <strong>Post Detail</strong>
                  <span>
                    {activeChannel.label} / {activeType.label}
                  </span>
                </div>
              </div>

              <article className="social-media-page__detail-card">
                <div className="social-media-page__brand-row">
                  <BrandLogo />
                  <div>
                    <strong>{activeItem.title}</strong>
                    <span>{activeItem.handle}</span>
                  </div>
                  <span className="social-media-page__detail-status">
                    Original Post
                  </span>
                </div>
                <p>{activeItem.post}</p>
                <div className="social-media-page__detail-stats">
                  <span>
                    <EyeOutlined />
                    8.2K Views
                  </span>
                  <span>
                    <CommentOutlined />
                    {activeItem.replies} Replies
                  </span>
                  <span>
                    <ClockCircleOutlined />
                    {activeReplyProgress?.label}
                  </span>
                </div>
              </article>

              <div className="social-media-page__detail-thread">
                <strong>Related Conversation</strong>
                <p>{activeItem.preview}</p>
                <div className="social-media-page__agent-reply">
                  We have checked your request. Please continue the service in
                  this conversation and keep your account information private.
                </div>
              </div>
            </section>
          ) : (
            <section className="social-media-page__conversation">
              <div className="social-media-page__conversation-header">
                <div className="social-media-page__conversation-title">
                  <SocialChannelMark channel={activeItem.channel} />
                  <div className="social-media-page__conversation-heading">
                    <div className="social-media-page__conversation-heading-row">
                      <strong>{activeChannel.label}</strong>
                      <span className="social-media-page__conversation-handle">
                        @BANK 1 Support
                      </span>
                      <div className="social-media-page__conversation-tags">
                        <span className="social-media-page__conversation-type">
                          <SocialTypeChip active type={activeItem.type} />
                        </span>
                        <span>
                          {activeItemIsReplied ? (
                            <>
                              <CheckCircleFilled />
                              Replied
                            </>
                          ) : (
                            <>
                              <ClockCircleOutlined />
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeItem.type === 'chats' ? (
                <div className="social-media-page__chat-workspace">
                  <div className="social-media-page__chat-thread">
                    <span className="social-media-page__chat-date">
                      {CHAT_DISPLAY_DATE}
                    </span>
                    <div className="social-media-page__chat-message">
                      <SocialAvatar item={activeItem} />
                      <div className="social-media-page__chat-message-content">
                        <strong>{activeItem.customer}</strong>
                        <div className="social-media-page__chat-bubble">
                          <p>{activeItem.post}</p>
                        </div>
                        <span className="social-media-page__chat-time">
                          10:23
                        </span>
                      </div>
                    </div>

                    {activeChatReply ? (
                      <div className="social-media-page__chat-message social-media-page__chat-message--agent">
                        <div className="social-media-page__chat-message-content">
                          <strong>BANK 1 (Budi Kartika)</strong>
                          <div className="social-media-page__chat-bubble social-media-page__chat-bubble--agent">
                            <p>{activeChatReply}</p>
                          </div>
                          <span className="social-media-page__chat-time">
                            10:24
                          </span>
                        </div>
                        <span className="social-media-page__avatar social-media-page__avatar--agent">
                          BK
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="social-media-page__chat-composer">
                    <textarea
                      aria-label="Reply to chat"
                      placeholder="Type / for quick replies"
                      value={activeChatDraft}
                      onChange={(event) => {
                        setChatDrafts((current) => ({
                          ...current,
                          [activeItem.id]: event.target.value,
                        }))
                      }}
                    />
                    <div className="social-media-page__chat-composer-toolbar">
                      <span className="social-media-page__chat-composer-tools">
                        <SmileOutlined />
                        <PaperClipOutlined />
                        <ClockCircleOutlined />
                      </span>
                      <BaseButton
                        icon={<SendOutlined />}
                        variant="primary"
                        onClick={sendChatReply}
                      >
                        Send
                      </BaseButton>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <article className="social-media-page__post-card">
                    <div className="social-media-page__post-card-main">
                      <BrandLogo />
                      <div className="social-media-page__post-card-copy">
                        <span className="social-media-page__post-card-title">
                          <strong>{getPostTitle(activeItem)}</strong>
                          {activeItem.type === 'reviews' ? (
                            <ReviewStars compact />
                          ) : null}
                        </span>
                        <p>{getPostCopy(activeItem)}</p>
                      </div>
                    </div>
                    <div className="social-media-page__post-card-actions">
                      <span className="social-media-page__post-context">
                        {getPostContextLabel(activeItem)}
                      </span>
                      <BaseButton
                        aria-label="Open selected Social Media post detail"
                        className="social-media-page__view-post"
                        icon={<EyeOutlined />}
                        variant="primary"
                        onClick={() => setView('post-detail')}
                      >
                        View
                      </BaseButton>
                    </div>
                  </article>

                  {activeItem.type === 'reviews' ? (
                    <div className="social-media-page__review-workspace">
                      <div className="social-media-page__review-thread">
                        <div className="social-media-page__review-message">
                          <SocialAvatar item={activeItem} />
                          <div className="social-media-page__review-message-body">
                            <div className="social-media-page__review-author">
                              <strong>{activeItem.customer}</strong>
                              <ReviewStars />
                            </div>
                            <p>{getReviewCopy(activeItem)}</p>
                            <div className="social-media-page__review-actions">
                              <span>{REVIEW_DISPLAY_DATE}</span>
                              <button type="button">Reply</button>
                              <button type="button">Mark as Handled</button>
                            </div>
                          </div>
                          <span className="social-media-page__message-time">
                            {activeReplyProgress?.label}
                          </span>
                        </div>

                        {activeReviewReply ? (
                          <div className="social-media-page__review-message social-media-page__review-message--agent">
                            <span className="social-media-page__avatar social-media-page__avatar--review-agent">
                              BK
                            </span>
                            <div className="social-media-page__review-message-body">
                              <strong>BANK 1 (Budi Kartika)</strong>
                              <p>{activeReviewReply}</p>
                              <div className="social-media-page__review-actions">
                                <span>{REVIEW_DISPLAY_DATE}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="social-media-page__review-composer">
                        <textarea
                          aria-label="Reply to review"
                          placeholder="Type / for quick replies"
                          value={activeReviewDraft}
                          onChange={(event) => {
                            setReviewDrafts((current) => ({
                              ...current,
                              [activeItem.id]: event.target.value,
                            }))
                          }}
                        />
                        <div className="social-media-page__review-composer-toolbar">
                          <span className="social-media-page__review-composer-tools">
                            <SmileOutlined />
                            <PaperClipOutlined />
                            <ClockCircleOutlined />
                          </span>
                          <BaseButton
                            icon={<SendOutlined />}
                            variant="primary"
                            onClick={sendReviewReply}
                          >
                            Send
                          </BaseButton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="social-media-page__thread-tabs">
                        <span className="social-media-page__thread-tab--active">
                          <CommentOutlined />
                          Comments
                        </span>
                        <span>@ Mentions</span>
                        <BaseButton
                          className="social-media-page__pin-button"
                          icon={<MoreOutlined />}
                          title="More"
                        />
                      </div>

                      <div className="social-media-page__message-list">
                        <div className="social-media-page__message-row">
                          <SocialAvatar item={activeItem} />
                          <div className="social-media-page__message-body">
                            <strong>{activeItem.customer}</strong>
                            <p>{activeItem.preview}.</p>
                            <CommentMediaAttachments
                              media={activeItem.commentMedia}
                            />
                            <span>22Dec / Reply / Mark as Handled</span>
                          </div>
                          <span className="social-media-page__message-time">
                            {activeReplyProgress?.label}
                          </span>
                        </div>

                        <div className="social-media-page__message-row social-media-page__message-row--reply">
                          <span className="social-media-page__avatar social-media-page__avatar--agent">
                            BK
                          </span>
                          <div className="social-media-page__message-body">
                            <strong>BANK 1 (Budi Kartika)</strong>
                            <p>
                              Hi, we can help from here. Please share the
                              reference number in the secure chat channel.
                            </p>
                            <span>2 hours ago</span>
                          </div>
                        </div>

                        <div className="social-media-page__message-row">
                          <SocialAvatar item={activeItem} />
                          <div className="social-media-page__message-body">
                            <strong>{activeItem.customer}</strong>
                            <div className="social-media-page__embedded-post">
                              <span>{activeItem.handle}</span>
                              <p>{activeItem.post}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )
        ) : (
          <section className="social-media-page__conversation social-media-page__conversation--empty">
            <strong>No item selected</strong>
            <span>Choose at least one channel and one type.</span>
          </section>
        )}
      </main>

    </section>
  )
}
