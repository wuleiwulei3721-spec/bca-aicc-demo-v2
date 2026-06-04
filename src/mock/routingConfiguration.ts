import type {
  AccessAccount,
  AccessEntry,
  AccessSite,
  BusinessType,
  Channel,
  ChannelMedia,
  ChannelMediaRuleBinding,
  LanguageType,
  MediaServiceRulePlan,
  MediaType,
  RouteFactor,
  RouteFactorCode,
  RoutingRule,
  SiteAccessRatioGroup,
  SkillQueue,
  VdnAccessPoint,
  WorkingTimePlan,
} from '../types'

export interface RouteFactorValueOption {
  factorCode: RouteFactorCode
  label: string
  value: string
}

export const routingProjectCode = 'BANK1'

export const routeFactors: RouteFactor[] = [
  {
    allowAny: true,
    displayOrder: 1,
    enabled: true,
    factorCode: '13',
    factorName: 'Access Site',
    required: true,
    sourceEntity: 'site',
    status: 'Active',
  },
  {
    allowAny: true,
    displayOrder: 2,
    enabled: true,
    factorCode: '11',
    factorName: 'Channel',
    required: true,
    sourceEntity: 'channel',
    status: 'Active',
  },
  {
    allowAny: true,
    displayOrder: 3,
    enabled: true,
    factorCode: '12',
    factorName: 'Media Type',
    required: true,
    sourceEntity: 'media_type',
    status: 'Active',
  },
  {
    allowAny: true,
    displayOrder: 4,
    enabled: false,
    factorCode: '14',
    factorName: 'Country',
    required: false,
    sourceEntity: 'country',
    status: 'Disabled',
  },
  {
    allowAny: true,
    displayOrder: 5,
    enabled: true,
    factorCode: '16',
    factorName: 'Language Type',
    required: false,
    sourceEntity: 'language',
    status: 'Active',
  },
  {
    allowAny: true,
    displayOrder: 6,
    enabled: true,
    factorCode: '15',
    factorName: 'Business Type',
    required: true,
    sourceEntity: 'business_type',
    status: 'Active',
  },
  {
    allowAny: true,
    displayOrder: 7,
    enabled: false,
    factorCode: '17',
    factorName: 'Access Account',
    required: false,
    sourceEntity: 'access_account',
    status: 'Disabled',
  },
  {
    allowAny: true,
    displayOrder: 8,
    enabled: false,
    factorCode: '18',
    factorName: 'Access Entry',
    required: false,
    sourceEntity: 'access_entry',
    status: 'Disabled',
  },
]

export const vdnAccessPoints: VdnAccessPoint[] = [
  {
    description: 'Primary inbound IVR access for retail banking service.',
    platformVdnId: 'GX-VDN-81001',
    status: 'Active',
    vdnCode: 'VDN_RETAIL_IN',
    vdnName: 'Retail Inbound VDN',
  },
  {
    description: 'Priority access for card loss and fraud handling.',
    platformVdnId: 'GX-VDN-81002',
    status: 'Active',
    vdnCode: 'VDN_CARD_URGENT',
    vdnName: 'Card Emergency VDN',
  },
]

export const accessSites: AccessSite[] = [
  {
    address: 'Jakarta Contact Center Floor 12',
    countryCode: 'ID',
    ownerName: 'Nina Kartika',
    ownerPhone: '+62-21-5550-1201',
    siteCode: 'SITE_JKT',
    siteName: 'Jakarta Site',
    status: 'Active',
  },
  {
    address: 'Surabaya Service Hub Floor 5',
    countryCode: 'ID',
    ownerName: 'Arif Santoso',
    ownerPhone: '+62-31-5550-0811',
    siteCode: 'SITE_SBY',
    siteName: 'Surabaya Site',
    status: 'Active',
  },
  {
    address: 'Singapore DR Contact Site',
    countryCode: 'SG',
    ownerName: 'Maya Tan',
    ownerPhone: '+65-6555-6610',
    siteCode: 'SITE_SG_DR',
    siteName: 'Singapore DR Site',
    status: 'Active',
  },
]

export const channels: Channel[] = [
  {
    channelCategory: 'voice',
    channelCode: 'PHONE',
    channelId: '101',
    channelName: 'Phone',
    maxConcurrency: 50,
    mediaTypes: ['VOICE'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'owned-digital',
    channelCode: 'HALOAPP',
    channelId: '201',
    channelName: 'Haloapp',
    maxConcurrency: 50,
    mediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'messaging',
    channelCode: 'WEBCHAT',
    channelId: '202',
    channelName: 'webchat',
    maxConcurrency: 50,
    mediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'messaging',
    channelCode: 'WHATSAPP',
    channelId: '301',
    channelName: 'WhatsApp',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'email',
    channelCode: 'EMAIL',
    channelId: '401',
    channelName: 'Email',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'INSTAGRAM',
    channelId: '501',
    channelName: 'Instagram',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'LINKEDIN',
    channelId: '502',
    channelName: 'LinkedIn',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'FACEBOOK',
    channelId: '503',
    channelName: 'Facebook',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'X',
    channelId: '504',
    channelName: 'X',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'TIKTOK',
    channelId: '505',
    channelName: 'Tik Tok',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'social',
    channelCode: 'YOUTUBE',
    channelId: '506',
    channelName: 'YouTube',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'app-store',
    channelCode: 'APPSTORE',
    channelId: '601',
    channelName: 'AppStore',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
  {
    channelCategory: 'app-store',
    channelCode: 'PLAYSTORE',
    channelId: '602',
    channelName: 'playstore',
    maxConcurrency: 50,
    mediaTypes: ['TEXT'],
    minScanIntervalSeconds: 30,
    status: 'Active',
  },
]

export const mediaTypes: MediaType[] = [
  {
    mediaCode: 'VOICE',
    mediaName: 'Voice',
    status: 'Active',
  },
  {
    mediaCode: 'VIDEO',
    mediaName: 'Video',
    status: 'Active',
  },
  {
    mediaCode: 'TEXT',
    mediaName: 'Text',
    status: 'Active',
  },
]

export const channelMediaSettings: ChannelMedia[] = [
  {
    channelCode: 'PHONE',
    channelMediaCode: 'PHONE_VOICE',
    extensionConfig: 'DNIS, IVR flow, emergency priority',
    maxConcurrency: 50,
    mediaCode: 'VOICE',
    minScanIntervalSeconds: null,
    scanMode: 'manual',
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    channelMediaCode: 'HALOAPP_TEXT',
    extensionConfig: 'BankID binding, customer app session',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    channelMediaCode: 'HALOAPP_VOICE',
    extensionConfig: 'OpenEye app voice handoff',
    maxConcurrency: 50,
    mediaCode: 'VOICE',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    channelMediaCode: 'HALOAPP_VIDEO',
    extensionConfig: 'OpenEye video and desktop share',
    maxConcurrency: 50,
    mediaCode: 'VIDEO',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'WEBCHAT',
    channelMediaCode: 'WEBCHAT_TEXT',
    extensionConfig: 'Website widget, recall within configured window',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'WHATSAPP',
    channelMediaCode: 'WHATSAPP_TEXT',
    extensionConfig: 'Business account webhook, template approval',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'EMAIL',
    channelMediaCode: 'EMAIL_TEXT',
    extensionConfig: 'Mailbox polling, async case creation',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    scanMode: 'polling',
    status: 'Active',
  },
  {
    channelCode: 'APPSTORE',
    channelMediaCode: 'APPSTORE_TEXT',
    extensionConfig: 'Review import and reply workflow',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    scanMode: 'polling',
    status: 'Active',
  },
  {
    channelCode: 'PLAYSTORE',
    channelMediaCode: 'PLAYSTORE_TEXT',
    extensionConfig: 'Review import and reply workflow',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    scanMode: 'polling',
    status: 'Active',
  },
]

export const mediaServiceRulePlans: MediaServiceRulePlan[] = [
  {
    agentEndMessage: 'Thank you for contacting us. Have a great day!',
    agentNoReplyAutoResponseMessage: 'Please wait, we are processing...',
    agentNoReplyAutoResponseMinutes: 2,
    agentNoReplyBreachMinutes: 2,
    agentNoReplyWarningMinutes: 1,
    assignedAgentGreeting: '{agentName} is now serving you.',
    autoCloseAgentNotice:
      'Customer timeout no reply, conversation closed automatically.',
    autoCloseTimeoutMinutes: 5,
    description: 'Default rule plan for text-based customer service channels.',
    firstAccessReminderMessage:
      'Hello, if you do not reply within {timeoutMinutes} minutes, this conversation will close automatically.',
    maxConcurrentCustomersPerAgent: 3,
    mediaCode: 'TEXT',
    nonWorkingTimeMessage:
      'Sorry, our working time is {workTime}. Please contact us during service hours.',
    planCode: 'MSRP_TEXT_STANDARD',
    planName: 'Standard Text Service',
    preCloseReminderMessage:
      'Please reply soon. This conversation will close in {reminderMinutes} minute.',
    preCloseReminderMinutes: 1,
    queueAlerts: [
      {
        channelCode: 'HALOAPP',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 10,
      },
      {
        channelCode: 'WEBCHAT',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 10,
      },
      {
        channelCode: 'WHATSAPP',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 10,
      },
    ],
    queueWaitingMessage:
      'Our agents are busy now. Estimated waiting time is {estimatedWaitMinutes} minutes.',
    status: 'Active',
    updatedAt: '2026-06-03',
    updatedBy: 'Admin',
    webchatRecallLimitMinutes: 2,
    welcomeMessage: 'Welcome. We are ready to help you.',
  },
  {
    agentEndMessage: 'Thank you for choosing priority service.',
    agentNoReplyAutoResponseMessage:
      'Please wait a moment, your request is being handled with priority.',
    agentNoReplyAutoResponseMinutes: 2,
    agentNoReplyBreachMinutes: 2,
    agentNoReplyWarningMinutes: 1,
    assignedAgentGreeting: '{agentName} is now assisting your priority request.',
    autoCloseAgentNotice:
      'Customer timeout no reply, priority conversation closed automatically.',
    autoCloseTimeoutMinutes: 8,
    description: 'Priority text service with longer customer timeout.',
    firstAccessReminderMessage:
      'Hello, this priority conversation will close if there is no reply within {timeoutMinutes} minutes.',
    maxConcurrentCustomersPerAgent: 2,
    mediaCode: 'TEXT',
    nonWorkingTimeMessage:
      'Sorry, priority service working time is {workTime}. Please contact us during service hours.',
    planCode: 'MSRP_TEXT_PRIORITY',
    planName: 'Priority Text Service',
    preCloseReminderMessage:
      'Please reply soon. Priority service will close this conversation in {reminderMinutes} minute.',
    preCloseReminderMinutes: 1,
    queueAlerts: [
      {
        channelCode: 'HALOAPP',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 8,
      },
      {
        channelCode: 'WEBCHAT',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 8,
      },
      {
        channelCode: 'WHATSAPP',
        enabled: true,
        recipients: 'Monitoring Team',
        threshold: 8,
      },
    ],
    queueWaitingMessage:
      'Priority agents are busy now. Estimated waiting time is {estimatedWaitMinutes} minutes.',
    status: 'Active',
    updatedAt: '2026-06-03',
    updatedBy: 'Admin',
    webchatRecallLimitMinutes: 2,
    welcomeMessage: 'Welcome to priority service.',
  },
]

export const channelMediaRuleBindings: ChannelMediaRuleBinding[] = channels
  .filter((channel) => channel.mediaTypes.includes('TEXT'))
  .map((channel) => ({
    bindingCode: `${channel.channelCode}_TEXT`,
    channelCode: channel.channelCode,
    mediaCode: 'TEXT',
    rulePlanCode:
      channel.channelCode === 'HALOAPP'
        ? 'MSRP_TEXT_PRIORITY'
        : 'MSRP_TEXT_STANDARD',
    status: 'Active',
  }))

export const languageTypes: LanguageType[] = [
  {
    languageCode: 'ID',
    languageName: 'Indonesian',
    locale: 'id-ID',
    status: 'Active',
  },
  {
    languageCode: 'EN',
    languageName: 'English',
    locale: 'en-US',
    status: 'Active',
  },
  {
    languageCode: 'ZH',
    languageName: 'Chinese',
    locale: 'zh-CN',
    status: 'Active',
  },
]

export const businessTypes: BusinessType[] = [
  {
    businessName: 'General Service',
    businessTypeCode: '01',
    projectCode: routingProjectCode,
    status: 'Active',
  },
  {
    businessName: 'Card Lost',
    businessTypeCode: '02',
    projectCode: routingProjectCode,
    status: 'Active',
  },
  {
    businessName: 'Loan Information',
    businessTypeCode: '03',
    projectCode: routingProjectCode,
    status: 'Active',
  },
]

export const siteAccessRatioGroups: SiteAccessRatioGroup[] = [
  {
    channelCode: 'WHATSAPP',
    mediaCode: 'TEXT',
    ratioGroupCode: 'RATIO_WHATSAPP_TEXT_DEFAULT',
    ratios: [
      {
        ratioPercent: 50,
        siteCode: 'SITE_JKT',
      },
      {
        ratioPercent: 30,
        siteCode: 'SITE_SBY',
      },
      {
        ratioPercent: 20,
        siteCode: 'SITE_SG_DR',
      },
    ],
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    mediaCode: 'VOICE',
    ratioGroupCode: 'RATIO_HALOAPP_VOICE_DEFAULT',
    ratios: [
      {
        ratioPercent: 34,
        siteCode: 'SITE_JKT',
      },
      {
        ratioPercent: 33,
        siteCode: 'SITE_SBY',
      },
      {
        ratioPercent: 33,
        siteCode: 'SITE_SG_DR',
      },
    ],
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    mediaCode: 'VIDEO',
    ratioGroupCode: 'RATIO_HALOAPP_VIDEO_DEFAULT',
    ratios: [
      {
        ratioPercent: 34,
        siteCode: 'SITE_JKT',
      },
      {
        ratioPercent: 33,
        siteCode: 'SITE_SBY',
      },
      {
        ratioPercent: 33,
        siteCode: 'SITE_SG_DR',
      },
    ],
    status: 'Active',
  },
  {
    channelCode: 'HALOAPP',
    mediaCode: 'TEXT',
    ratioGroupCode: 'RATIO_HALOAPP_TEXT_DEFAULT',
    ratios: [
      {
        ratioPercent: 60,
        siteCode: 'SITE_JKT',
      },
      {
        ratioPercent: 25,
        siteCode: 'SITE_SBY',
      },
      {
        ratioPercent: 15,
        siteCode: 'SITE_SG_DR',
      },
    ],
    status: 'Active',
  },
  {
    channelCode: 'PHONE',
    mediaCode: 'VOICE',
    ratioGroupCode: 'RATIO_PHONE_VOICE_DEFAULT',
    ratios: [
      {
        ratioPercent: 70,
        siteCode: 'SITE_JKT',
      },
      {
        ratioPercent: 30,
        siteCode: 'SITE_SBY',
      },
      {
        ratioPercent: 0,
        siteCode: 'SITE_SG_DR',
      },
    ],
    status: 'Active',
  },
]

export const accessAccounts: AccessAccount[] = [
  {
    accountCode: 'ACC_HALOAPP_BANK1',
    accountName: 'BANK 1 Haloapp',
    channelCode: 'HALOAPP',
    externalAccountId: 'haloapp-bank1-prod',
    extensionConfig: {
      tenantId: 'tenant-bank1',
      appId: 'haloapp-bank1-prod',
      webhookUrl: 'https://aicc.bank1.example/hooks/haloapp',
      signatureSecretRef: 'secret://aicc/haloapp/signature',
    },
    secretRef: 'secret://aicc/haloapp/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_WEBCHAT_BANK1',
    accountName: 'BANK 1 Webchat',
    channelCode: 'WEBCHAT',
    externalAccountId: 'widget-bank1-main',
    extensionConfig: {
      widgetId: 'widget-bank1-main',
      allowedDomain: 'www.bank1.example',
      webhookUrl: 'https://aicc.bank1.example/hooks/webchat',
      signatureSecretRef: 'secret://aicc/webchat/signature',
    },
    secretRef: 'secret://aicc/webchat/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_WA_BANK1_MAIN',
    accountName: 'BANK 1 WhatsApp Main',
    channelCode: 'WHATSAPP',
    externalAccountId: 'wa-business-628100001',
    extensionConfig: {
      wabaId: 'waba-bank1-main',
      phoneNumberId: '628100001',
      metaAppId: 'meta-bank1-service',
      webhookVerifyTokenRef: 'secret://aicc/whatsapp/verify-token',
    },
    secretRef: 'secret://aicc/whatsapp/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_EMAIL_CONTACT',
    accountName: 'BANK 1 Contact Mailbox',
    channelCode: 'EMAIL',
    externalAccountId: 'contact@bank1.example',
    extensionConfig: {
      mailboxAddress: 'contact@bank1.example',
      imapHost: 'imap.bank1.example',
      imapPort: '993',
      smtpHost: 'smtp.bank1.example',
      smtpPort: '587',
      authSecretRef: 'secret://aicc/email/contact-auth',
    },
    secretRef: 'secret://aicc/email/contact',
    status: 'Active',
  },
  {
    accountCode: 'ACC_INSTAGRAM_BANK1',
    accountName: 'BANK 1 Instagram',
    channelCode: 'INSTAGRAM',
    externalAccountId: 'ig-bank1-official',
    extensionConfig: {
      instagramAccountId: '17841400000000001',
      username: 'bank1.official',
      linkedPageId: 'fb-page-bank1-main',
      webhookVerifyTokenRef: 'secret://aicc/instagram/verify-token',
    },
    secretRef: 'secret://aicc/instagram/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_LINKEDIN_BANK1',
    accountName: 'BANK 1 LinkedIn',
    channelCode: 'LINKEDIN',
    externalAccountId: 'urn:li:organization:100001',
    extensionConfig: {
      organizationId: '100001',
      developerAppId: 'linkedin-bank1-service',
      oauthClientId: 'linkedin-client-bank1',
      oauthSecretRef: 'secret://aicc/linkedin/oauth',
    },
    secretRef: 'secret://aicc/linkedin/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_FACEBOOK_BANK1',
    accountName: 'BANK 1 Facebook',
    channelCode: 'FACEBOOK',
    externalAccountId: 'fb-page-bank1-main',
    extensionConfig: {
      pageId: 'fb-page-bank1-main',
      pageName: 'BANK 1',
      metaAppId: 'meta-bank1-service',
      webhookVerifyTokenRef: 'secret://aicc/facebook/verify-token',
    },
    secretRef: 'secret://aicc/facebook/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_X_BANK1',
    accountName: 'BANK 1 X',
    channelCode: 'X',
    externalAccountId: '@bank1care',
    extensionConfig: {
      appId: 'x-bank1-service',
      accountHandle: '@bank1care',
      webhookEnvironment: 'prod',
      oauthSecretRef: 'secret://aicc/x/oauth',
    },
    secretRef: 'secret://aicc/x/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_TIKTOK_BANK1',
    accountName: 'BANK 1 Tik Tok',
    channelCode: 'TIKTOK',
    externalAccountId: 'bank1.official',
    extensionConfig: {
      appId: 'tiktok-bank1-service',
      clientKey: 'tiktok-client-bank1',
      webhookUrl: 'https://aicc.bank1.example/hooks/tiktok',
      oauthSecretRef: 'secret://aicc/tiktok/oauth',
    },
    secretRef: 'secret://aicc/tiktok/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_YOUTUBE_BANK1',
    accountName: 'BANK 1 YouTube',
    channelCode: 'YOUTUBE',
    externalAccountId: 'UC_BANK1_SERVICE',
    extensionConfig: {
      channelId: 'UC_BANK1_SERVICE',
      googleProjectId: 'bank1-aicc',
      oauthClientId: 'youtube-client-bank1',
      oauthSecretRef: 'secret://aicc/youtube/oauth',
    },
    secretRef: 'secret://aicc/youtube/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_APPSTORE_BANK1',
    accountName: 'BANK 1 AppStore',
    channelCode: 'APPSTORE',
    externalAccountId: 'appstore-bank1-mobile',
    extensionConfig: {
      issuerId: 'issuer-bank1',
      keyId: 'key-bank1-appstore',
      appId: '1234567890',
      privateKeySecretRef: 'secret://aicc/appstore/private-key',
    },
    secretRef: 'secret://aicc/appstore/main',
    status: 'Active',
  },
  {
    accountCode: 'ACC_PLAYSTORE_BANK1',
    accountName: 'BANK 1 playstore',
    channelCode: 'PLAYSTORE',
    externalAccountId: 'com.bank1.mobile',
    extensionConfig: {
      packageName: 'com.bank1.mobile',
      googleProjectId: 'bank1-aicc',
      serviceAccountEmail: 'aicc-playstore@bank1-aicc.iam.gserviceaccount.com',
      serviceAccountSecretRef: 'secret://aicc/playstore/service-account',
    },
    secretRef: 'secret://aicc/playstore/main',
    status: 'Active',
  },
]

export const accessEntries: AccessEntry[] = [
  {
    accountCode: 'ACC_WA_BANK1_MAIN',
    channelMediaCode: 'WHATSAPP_TEXT',
    entryCode: 'ENTRY_WA_MAIN_TEXT',
    entryValue: '+62 810 0001',
    status: 'Active',
  },
  {
    accountCode: 'ACC_HALOAPP_BANK1',
    channelMediaCode: 'HALOAPP_TEXT',
    entryCode: 'ENTRY_HALOAPP_CHAT',
    entryValue: 'bank1://service/chat',
    status: 'Active',
  },
  {
    accountCode: 'ACC_HALOAPP_BANK1',
    channelMediaCode: 'HALOAPP_VOICE',
    entryCode: 'ENTRY_HALOAPP_VOICE',
    entryValue: 'bank1://service/voice',
    status: 'Active',
    vdnCode: 'VDN_RETAIL_IN',
  },
  {
    accountCode: 'ACC_EMAIL_CONTACT',
    channelMediaCode: 'EMAIL_TEXT',
    entryCode: 'ENTRY_EMAIL_CONTACT',
    entryValue: 'contact@bank1.example',
    status: 'Active',
  },
]

export const workingTimePlans: WorkingTimePlan[] = [
  {
    description: 'Regular bank service hours with holiday and special working overrides.',
    holidayRules: [
      {
        closedAllDay: false,
        dateFrom: '2026-01-01',
        dateTo: '2026-01-01',
        holidayName: 'New Year Holiday',
        nonWorkingRanges: [{ endTime: '23:59', startTime: '00:00' }],
        ruleId: 'HR_NEW_YEAR',
      },
    ],
    planCode: 'WTP_BANK_HOURS',
    planName: 'Bank Working Hours',
    ramadanSchedule: {
      dateFrom: '2026-02-18',
      dateTo: '2026-03-19',
      enabled: true,
      workSchedules: [
        {
          ruleId: 'RMD_WEEKDAY',
          timeRanges: [{ endTime: '15:00', startTime: '09:00' }],
          weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        },
        {
          ruleId: 'RMD_SATURDAY',
          timeRanges: [{ endTime: '13:00', startTime: '09:00' }],
          weekdays: ['SAT'],
        },
      ],
    },
    specialWorkingPlans: [
      {
        dateFrom: '2026-06-15',
        dateTo: '2026-06-15',
        reason: 'Campaign extended service',
        ruleId: 'SWP_CAMPAIGN',
        workingRanges: [{ endTime: '18:00', startTime: '09:00' }],
      },
    ],
    status: 'Active',
    updatedAt: '2025-04-10',
    updatedBy: 'Admin',
    workSchedules: [
      {
        ruleId: 'WS_WEEKDAY',
        timeRanges: [{ endTime: '20:00', startTime: '08:00' }],
        weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      },
      {
        ruleId: 'WS_SATURDAY',
        timeRanges: [{ endTime: '15:00', startTime: '09:00' }],
        weekdays: ['SAT'],
      },
    ],
  },
]

export const skillQueues: SkillQueue[] = [
  {
    assignedAgentCount: 24,
    maxQueueSize: 120,
    platformSkillId: 'GX-SK-1001',
    prompts: [
      {
        mediaCode: 'VOICE',
        promptType: 'Wait Audio',
        value: 'bank1-standard-waiting.wav',
      },
      {
        mediaCode: 'TEXT',
        promptType: 'Timeout Message',
        value: 'Queue timeout. Please start a new conversation.',
      },
    ],
    queueTimeoutSeconds: 600,
    skillQueueCode: 'SQ_GENERAL_ID',
    skillQueueName: 'General Service - Indonesian',
    status: 'Active',
    supportsVideo: false,
    vdnCode: 'VDN_RETAIL_IN',
    workTimePlanCode: '',
  },
  {
    assignedAgentCount: 18,
    maxQueueSize: 80,
    platformSkillId: 'GX-SK-1002',
    prompts: [
      {
        mediaCode: 'VOICE',
        promptType: 'Wait Audio',
        value: 'bank1-card-priority.wav',
      },
      {
        mediaCode: 'TEXT',
        promptType: 'Timeout Message',
        value: 'Card service is busy. Please wait or call emergency hotline.',
      },
    ],
    queueTimeoutSeconds: 420,
    skillQueueCode: 'SQ_CARD_PRIORITY',
    skillQueueName: 'Card Emergency Priority',
    status: 'Active',
    supportsVideo: false,
    vdnCode: 'VDN_CARD_URGENT',
    workTimePlanCode: '',
  },
  {
    assignedAgentCount: 14,
    maxQueueSize: 100,
    platformSkillId: 'GX-SK-1003',
    prompts: [
      {
        mediaCode: 'TEXT',
        promptType: 'Timeout Message',
        value: 'Digital banking agents are currently busy.',
      },
    ],
    queueTimeoutSeconds: 480,
    skillQueueCode: 'SQ_DIGITAL_EN',
    skillQueueName: 'Digital Service - English',
    status: 'Active',
    supportsVideo: true,
    vdnCode: 'VDN_RETAIL_IN',
    workTimePlanCode: 'WTP_BANK_HOURS',
  },
]

export const routingRules: RoutingRule[] = [
  {
    conditions: [
      {
        factorCode: '11',
        factorValueCode: 'PHONE',
      },
      {
        factorCode: '12',
        factorValueCode: 'VOICE',
      },
      {
        factorCode: '13',
        factorValueCode: '',
      },
      {
        factorCode: '15',
        factorValueCode: '02',
      },
      {
        factorCode: '16',
        factorValueCode: 'ID',
      },
    ],
    effectiveFrom: '2026-06-01',
    factorSetVersion: 'BANK1-RF-2026-06',
    priority: 100,
    ruleCode: 'RR-BANK1-7F4C21',
    status: 'Active',
    targetSkillQueueCode: 'SQ_CARD_PRIORITY',
    updatedAt: '2026-06-03 12:30',
    updatedBy: 'Admin',
  },
  {
    conditions: [
      {
        factorCode: '11',
        factorValueCode: 'WHATSAPP',
      },
      {
        factorCode: '12',
        factorValueCode: 'TEXT',
      },
      {
        factorCode: '13',
        factorValueCode: 'SITE_JKT',
      },
      {
        factorCode: '15',
        factorValueCode: '01',
      },
      {
        factorCode: '16',
        factorValueCode: 'ID',
      },
    ],
    effectiveFrom: '2026-06-01',
    factorSetVersion: 'BANK1-RF-2026-06',
    priority: 80,
    ruleCode: 'RR-BANK1-AB812D',
    status: 'Active',
    targetSkillQueueCode: 'SQ_GENERAL_ID',
    updatedAt: '2026-06-03 12:30',
    updatedBy: 'Admin',
  },
  {
    conditions: [
      {
        factorCode: '11',
        factorValueCode: 'WHATSAPP',
      },
      {
        factorCode: '12',
        factorValueCode: 'TEXT',
      },
      {
        factorCode: '13',
        factorValueCode: 'SITE_SBY',
      },
      {
        factorCode: '15',
        factorValueCode: '01',
      },
      {
        factorCode: '16',
        factorValueCode: 'ID',
      },
    ],
    effectiveFrom: '2026-06-01',
    factorSetVersion: 'BANK1-RF-2026-06',
    priority: 75,
    ruleCode: 'RR-BANK1-3D9A77',
    status: 'Active',
    targetSkillQueueCode: 'SQ_CARD_PRIORITY',
    updatedAt: '2026-06-03 12:54',
    updatedBy: 'Admin',
  },
  {
    conditions: [
      {
        factorCode: '11',
        factorValueCode: 'WHATSAPP',
      },
      {
        factorCode: '12',
        factorValueCode: 'TEXT',
      },
      {
        factorCode: '13',
        factorValueCode: 'SITE_SG_DR',
      },
      {
        factorCode: '15',
        factorValueCode: '01',
      },
      {
        factorCode: '16',
        factorValueCode: 'ID',
      },
    ],
    effectiveFrom: '2026-06-01',
    factorSetVersion: 'BANK1-RF-2026-06',
    priority: 72,
    ruleCode: 'RR-BANK1-8E1F64',
    status: 'Active',
    targetSkillQueueCode: 'SQ_DIGITAL_EN',
    updatedAt: '2026-06-03 12:54',
    updatedBy: 'Admin',
  },
  {
    conditions: [
      {
        factorCode: '11',
        factorValueCode: 'HALOAPP',
      },
      {
        factorCode: '12',
        factorValueCode: 'TEXT',
      },
      {
        factorCode: '13',
        factorValueCode: '',
      },
      {
        factorCode: '15',
        factorValueCode: '03',
      },
      {
        factorCode: '16',
        factorValueCode: 'EN',
      },
    ],
    effectiveFrom: '2026-06-01',
    factorSetVersion: 'BANK1-RF-2026-06',
    priority: 60,
    ruleCode: 'RR-BANK1-C19D02',
    status: 'Active',
    targetSkillQueueCode: 'SQ_DIGITAL_EN',
    updatedAt: '2026-06-03 12:30',
    updatedBy: 'Admin',
  },
]

export const routeFactorValueOptions: RouteFactorValueOption[] = [
  ...vdnAccessPoints.map((vdn) => ({
    factorCode: '10' as const,
    label: vdn.vdnName,
    value: vdn.vdnCode,
  })),
  ...channels.map((channel) => ({
    factorCode: '11' as const,
    label: channel.channelName,
    value: channel.channelCode,
  })),
  ...mediaTypes.map((mediaType) => ({
    factorCode: '12' as const,
    label: mediaType.mediaName,
    value: mediaType.mediaCode,
  })),
  ...accessSites.map((site) => ({
    factorCode: '13' as const,
    label: site.siteName,
    value: site.siteCode,
  })),
  {
    factorCode: '14',
    label: 'Indonesia',
    value: 'ID',
  },
  {
    factorCode: '14',
    label: 'Singapore',
    value: 'SG',
  },
  ...businessTypes.map((businessType) => ({
    factorCode: '15' as const,
    label: businessType.businessName,
    value: businessType.businessTypeCode,
  })),
  ...languageTypes.map((language) => ({
    factorCode: '16' as const,
    label: language.languageName,
    value: language.languageCode,
  })),
  ...accessAccounts.map((account) => ({
    factorCode: '17' as const,
    label: account.accountName,
    value: account.accountCode,
  })),
  ...accessEntries.map((entry) => ({
    factorCode: '18' as const,
    label: entry.entryValue,
    value: entry.entryCode,
  })),
]
