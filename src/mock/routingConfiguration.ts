import type {
  AccessEntry,
  AccessSite,
  BusinessType,
  Channel,
  ChannelAccount,
  ChannelBusinessConfig,
  ChannelMedia,
  ChannelMediaRuleBinding,
  ChannelMediaBusinessConfig,
  ChannelType,
  LanguageType,
  MediaServiceRulePlan,
  MediaType,
  MediaTypeCode,
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

const textBusinessConfig: ChannelMediaBusinessConfig = {
  accessSuccessWelcomeMessage:
    'Hello, BANK 1 digital assistant is ready to help you.',
  agentEndReminder:
    'Thank you for contacting BANK 1. We are glad to assist you.',
  agentNoReplyAutoResponseMessage:
    'Please hold on. We are still processing your request.',
  agentNoReplyBreachSeconds: 120,
  agentNoReplyTimeoutSeconds: 120,
  agentNoReplyWarningSeconds: 60,
  agentTimeoutNotice:
    'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
  assignedAgentGreeting:
    'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
  customerNoReplyTimeoutMinutes: 5,
  customerTimeoutNotice:
    'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
  exceptionWorkTimePlanCode: '',
  maxConcurrentAccess: 50,
  minScanIntervalSeconds: 30,
  outsideServiceHoursMessage: 'Sorry, we are currently outside service hours.',
  preTimeoutReminderMessage:
    'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
  preTimeoutReminderMinutes: 1,
  queueTimeoutMessage: 'All agents are currently busy. Please try again later.',
  queueWaitingMessage: 'All agents are currently busy. Please wait.',
  webchatRecallLimitSeconds: 120,
}

const voiceBusinessConfig: ChannelMediaBusinessConfig = {
  ...textBusinessConfig,
  accessSuccessWelcomeMessage:
    'Hello, BANK 1 voice assistant is ready to help you.',
}

const videoBusinessConfig: ChannelMediaBusinessConfig = {
  ...textBusinessConfig,
  accessSuccessWelcomeMessage:
    'Hello, BANK 1 video assistant is ready to help you.',
}

const nonDmBusinessConfig: ChannelMediaBusinessConfig = {
  ...textBusinessConfig,
  accessSuccessWelcomeMessage:
    'Hello, BANK 1 social service assistant is ready to help you.',
}

const buildBusinessConfig = (
  mediaTypes: MediaTypeCode[],
): ChannelBusinessConfig =>
  Object.fromEntries(
    mediaTypes.map((mediaCode) => {
      const config =
        mediaCode === 'VOICE'
          ? voiceBusinessConfig
          : mediaCode === 'VIDEO'
            ? videoBusinessConfig
            : mediaCode === 'NON_DM'
              ? nonDmBusinessConfig
              : textBusinessConfig

      return [mediaCode, { ...config }]
    }),
  ) as ChannelBusinessConfig

export const channelTypes: ChannelType[] = [
  {
    accessParameterFields: [],
    category: 'voice',
    channelTypeCode: 'PHONE',
    channelTypeName: 'Phone',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['VOICE'],
  },
  {
    accessParameterFields: [
      { key: 'tenantId', label: 'Tenant ID', required: true },
      { key: 'appId', label: 'App ID', required: true },
      { key: 'webhookUrl', label: 'Webhook URL', required: true },
      {
        key: 'signatureSecretRef',
        label: 'Signature Secret Ref',
        required: true,
      },
    ],
    category: 'owned-digital',
    channelTypeCode: 'BANKAPP',
    channelTypeName: 'Bankapp',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
  },
  {
    accessParameterFields: [
      { key: 'widgetId', label: 'Widget ID', required: true },
      { key: 'allowedDomain', label: 'Allowed Domain', required: true },
      { key: 'webhookUrl', label: 'Webhook URL', required: true },
      {
        key: 'signatureSecretRef',
        label: 'Signature Secret Ref',
        required: true,
      },
    ],
    category: 'messaging',
    channelTypeCode: 'WEBCHAT',
    channelTypeName: 'Webchat',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
  },
  {
    accessParameterFields: [
      { key: 'wabaId', label: 'WABA ID', required: true },
      { key: 'metaAppId', label: 'Meta App ID', required: true },
      {
        key: 'webhookVerifyTokenRef',
        label: 'Webhook Verify Token Ref',
        required: true,
      },
      { key: 'accessTokenRef', label: 'Access Token Ref', required: true },
    ],
    category: 'messaging',
    channelTypeCode: 'WHATSAPP',
    channelTypeName: 'WhatsApp',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT'],
  },
  {
    accessParameterFields: [
      { key: 'protocol', label: 'Protocol', required: true },
      { key: 'imapHost', label: 'IMAP Host', required: true },
      { key: 'imapPort', label: 'IMAP Port', required: true },
      { key: 'imapSecurity', label: 'IMAP Security', required: true },
      { key: 'smtpHost', label: 'SMTP Host', required: true },
      { key: 'smtpPort', label: 'SMTP Port', required: true },
      { key: 'smtpSecurity', label: 'SMTP Security', required: true },
      { key: 'pollingIntervalSeconds', label: 'Polling Interval', required: true },
      { key: 'authSecretRef', label: 'Auth Secret Ref', required: true },
    ],
    category: 'email',
    channelTypeCode: 'EMAIL',
    channelTypeName: 'Email',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT'],
  },
  {
    accessParameterFields: [
      { key: 'metaAppId', label: 'Meta App ID', required: true },
      {
        key: 'webhookVerifyTokenRef',
        label: 'Webhook Verify Token Ref',
        required: true,
      },
      { key: 'accessTokenRef', label: 'Access Token Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'INSTAGRAM',
    channelTypeName: 'Instagram',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'organizationId', label: 'Organization ID', required: true },
      { key: 'developerAppId', label: 'Developer App ID', required: true },
      { key: 'oauthClientId', label: 'OAuth Client ID', required: true },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'LINKEDIN',
    channelTypeName: 'LinkedIn',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'metaAppId', label: 'Meta App ID', required: true },
      {
        key: 'webhookVerifyTokenRef',
        label: 'Webhook Verify Token Ref',
        required: true,
      },
      { key: 'pageAccessTokenRef', label: 'Page Access Token Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'FACEBOOK',
    channelTypeName: 'Facebook',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'appId', label: 'App ID', required: true },
      { key: 'webhookEnvironment', label: 'Webhook Environment', required: true },
      { key: 'oauthClientId', label: 'OAuth Client ID', required: true },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'X',
    channelTypeName: 'X',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'appId', label: 'App ID', required: true },
      { key: 'clientKey', label: 'Client Key', required: true },
      { key: 'webhookUrl', label: 'Webhook URL', required: true },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'TIKTOK',
    channelTypeName: 'Tik Tok',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'googleProjectId', label: 'Google Project ID', required: true },
      { key: 'oauthClientId', label: 'OAuth Client ID', required: true },
      { key: 'oauthSecretRef', label: 'OAuth Secret Ref', required: true },
    ],
    category: 'social',
    channelTypeCode: 'YOUTUBE',
    channelTypeName: 'YouTube',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['TEXT', 'NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'issuerId', label: 'Issuer ID', required: true },
      { key: 'keyId', label: 'Key ID', required: true },
      { key: 'appId', label: 'App ID', required: true },
      {
        key: 'privateKeySecretRef',
        label: 'Private Key Secret Ref',
        required: true,
      },
    ],
    category: 'app-store',
    channelTypeCode: 'APPSTORE',
    channelTypeName: 'AppStore',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['NON_DM'],
  },
  {
    accessParameterFields: [
      { key: 'packageName', label: 'Package Name', required: true },
      { key: 'googleProjectId', label: 'Google Project ID', required: true },
      {
        key: 'serviceAccountEmail',
        label: 'Service Account Email',
        required: true,
      },
      {
        key: 'serviceAccountSecretRef',
        label: 'Service Account Secret Ref',
        required: true,
      },
    ],
    category: 'app-store',
    channelTypeCode: 'PLAYSTORE',
    channelTypeName: 'PlayStore',
    licenseStatus: 'Licensed',
    status: 'Active',
    supportedMediaTypes: ['NON_DM'],
  },
]

export const channels: Channel[] = [
  {
    accessConfig: {},
    businessConfig: {
      VOICE: {
        ...voiceBusinessConfig,
        exceptionWorkTimePlanCode: 'WTP_3_WRONG_INPUT_ZH',
      },
    },
    channelCode: 'PHONE',
    channelId: '101',
    channelName: 'Phone',
    channelTypeCode: 'PHONE',
    mediaTypes: ['VOICE'],
    status: 'Active',
  },
  {
    accessConfig: {
      appId: 'bankapp-bank1-prod',
      signatureSecretRef: 'secret://aicc/bankapp/signature',
      tenantId: 'tenant-bank1',
      webhookUrl: 'https://aicc.bank1.example/hooks/bankapp',
    },
    businessConfig: buildBusinessConfig(['VOICE', 'VIDEO', 'TEXT']),
    channelCode: 'BANKAPP',
    channelId: '201',
    channelName: 'Bankapp',
    channelTypeCode: 'BANKAPP',
    mediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
    status: 'Active',
  },
  {
    accessConfig: {
      allowedDomain: 'www.bank1.example',
      signatureSecretRef: 'secret://aicc/webchat/signature',
      webhookUrl: 'https://aicc.bank1.example/hooks/webchat',
      widgetId: 'widget-bank1-main',
    },
    businessConfig: buildBusinessConfig(['VOICE', 'VIDEO', 'TEXT']),
    channelCode: 'WEBCHAT',
    channelId: '202',
    channelName: 'Webchat',
    channelTypeCode: 'WEBCHAT',
    mediaTypes: ['VOICE', 'VIDEO', 'TEXT'],
    status: 'Active',
  },
  {
    accessConfig: {
      accessTokenRef: 'secret://aicc/whatsapp/access-token',
      metaAppId: 'meta-bank1-service',
      wabaId: 'waba-bank1-main',
      webhookVerifyTokenRef: 'secret://aicc/whatsapp/verify-token',
    },
    businessConfig: buildBusinessConfig(['TEXT']),
    channelCode: 'WHATSAPP',
    channelId: '301',
    channelName: 'WhatsApp',
    channelTypeCode: 'WHATSAPP',
    mediaTypes: ['TEXT'],
    status: 'Active',
  },
  {
    accessConfig: {
      authSecretRef: 'secret://aicc/email/contact-auth',
      imapHost: 'imap.bank1.example',
      imapPort: '993',
      imapSecurity: 'SSL',
      pollingIntervalSeconds: '30',
      protocol: 'IMAP/SMTP',
      smtpHost: 'smtp.bank1.example',
      smtpPort: '587',
      smtpSecurity: 'STARTTLS',
    },
    businessConfig: buildBusinessConfig(['TEXT']),
    channelCode: 'EMAIL',
    channelId: '401',
    channelName: 'Email Contact',
    channelTypeCode: 'EMAIL',
    mediaTypes: ['TEXT'],
    status: 'Active',
  },
  {
    accessConfig: {
      authSecretRef: 'secret://aicc/email/priority-auth',
      imapHost: 'imap.priority.bank1.example',
      imapPort: '993',
      imapSecurity: 'SSL',
      pollingIntervalSeconds: '60',
      protocol: 'IMAP/SMTP',
      smtpHost: 'smtp.priority.bank1.example',
      smtpPort: '465',
      smtpSecurity: 'SSL',
    },
    businessConfig: buildBusinessConfig(['TEXT']),
    channelCode: 'EMAIL_PRIORITY',
    channelId: '402',
    channelName: 'Email Priority',
    channelTypeCode: 'EMAIL',
    mediaTypes: ['TEXT'],
    status: 'Active',
  },
  {
    accessConfig: {
      accessTokenRef: 'secret://aicc/instagram/access-token',
      metaAppId: 'meta-bank1-service',
      webhookVerifyTokenRef: 'secret://aicc/instagram/verify-token',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'INSTAGRAM',
    channelId: '501',
    channelName: 'Instagram',
    channelTypeCode: 'INSTAGRAM',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      developerAppId: 'linkedin-bank1-service',
      oauthClientId: 'linkedin-client-bank1',
      oauthSecretRef: 'secret://aicc/linkedin/oauth',
      organizationId: '100001',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'LINKEDIN',
    channelId: '502',
    channelName: 'LinkedIn',
    channelTypeCode: 'LINKEDIN',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      metaAppId: 'meta-bank1-service',
      pageAccessTokenRef: 'secret://aicc/facebook/page-token',
      webhookVerifyTokenRef: 'secret://aicc/facebook/verify-token',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'FACEBOOK',
    channelId: '503',
    channelName: 'Facebook',
    channelTypeCode: 'FACEBOOK',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      appId: 'x-bank1-service',
      oauthClientId: 'x-client-bank1',
      oauthSecretRef: 'secret://aicc/x/oauth',
      webhookEnvironment: 'prod',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'X',
    channelId: '504',
    channelName: 'X',
    channelTypeCode: 'X',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      appId: 'tiktok-bank1-service',
      clientKey: 'tiktok-client-bank1',
      oauthSecretRef: 'secret://aicc/tiktok/oauth',
      webhookUrl: 'https://aicc.bank1.example/hooks/tiktok',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'TIKTOK',
    channelId: '505',
    channelName: 'Tik Tok',
    channelTypeCode: 'TIKTOK',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      googleProjectId: 'bank1-aicc',
      oauthClientId: 'youtube-client-bank1',
      oauthSecretRef: 'secret://aicc/youtube/oauth',
    },
    businessConfig: buildBusinessConfig(['TEXT', 'NON_DM']),
    channelCode: 'YOUTUBE',
    channelId: '506',
    channelName: 'YouTube',
    channelTypeCode: 'YOUTUBE',
    mediaTypes: ['TEXT', 'NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      appId: '1234567890',
      issuerId: 'issuer-bank1',
      keyId: 'key-bank1-appstore',
      privateKeySecretRef: 'secret://aicc/appstore/private-key',
    },
    businessConfig: buildBusinessConfig(['NON_DM']),
    channelCode: 'APPSTORE',
    channelId: '601',
    channelName: 'AppStore',
    channelTypeCode: 'APPSTORE',
    mediaTypes: ['NON_DM'],
    status: 'Active',
  },
  {
    accessConfig: {
      googleProjectId: 'bank1-aicc',
      packageName: 'com.bank1.mobile',
      serviceAccountEmail: 'aicc-playstore@bank1-aicc.iam.gserviceaccount.com',
      serviceAccountSecretRef: 'secret://aicc/playstore/service-account',
    },
    businessConfig: buildBusinessConfig(['NON_DM']),
    channelCode: 'PLAYSTORE',
    channelId: '602',
    channelName: 'PlayStore',
    channelTypeCode: 'PLAYSTORE',
    mediaTypes: ['NON_DM'],
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
  {
    mediaCode: 'NON_DM',
    mediaName: 'Non-DM',
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
    channelCode: 'BANKAPP',
    channelMediaCode: 'BANKAPP_TEXT',
    extensionConfig: 'BankID binding, customer app session',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'BANKAPP',
    channelMediaCode: 'BANKAPP_VOICE',
    extensionConfig: 'OpenEye app voice handoff',
    maxConcurrency: 50,
    mediaCode: 'VOICE',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'BANKAPP',
    channelMediaCode: 'BANKAPP_VIDEO',
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
    channelCode: 'EMAIL_PRIORITY',
    channelMediaCode: 'EMAIL_PRIORITY_TEXT',
    extensionConfig: 'Priority mailbox polling with dedicated mail servers',
    maxConcurrency: 50,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 60,
    scanMode: 'polling',
    status: 'Active',
  },
  {
    channelCode: 'INSTAGRAM',
    channelMediaCode: 'INSTAGRAM_NON_DM',
    extensionConfig: 'Comments, replies, and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'LINKEDIN',
    channelMediaCode: 'LINKEDIN_NON_DM',
    extensionConfig: 'Comments, replies, and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'FACEBOOK',
    channelMediaCode: 'FACEBOOK_NON_DM',
    extensionConfig: 'Comments, replies, and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'X',
    channelMediaCode: 'X_NON_DM',
    extensionConfig: 'Replies and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'TIKTOK',
    channelMediaCode: 'TIKTOK_NON_DM',
    extensionConfig: 'Comments, replies, and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'YOUTUBE',
    channelMediaCode: 'YOUTUBE_NON_DM',
    extensionConfig: 'Comments, replies, and mentions',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: null,
    scanMode: 'webhook',
    status: 'Active',
  },
  {
    channelCode: 'APPSTORE',
    channelMediaCode: 'APPSTORE_NON_DM',
    extensionConfig: 'Review import and reply workflow',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: 30,
    scanMode: 'polling',
    status: 'Active',
  },
  {
    channelCode: 'PLAYSTORE',
    channelMediaCode: 'PLAYSTORE_NON_DM',
    extensionConfig: 'Review import and reply workflow',
    maxConcurrency: 50,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: 30,
    scanMode: 'polling',
    status: 'Active',
  },
]

export const mediaServiceRulePlans: MediaServiceRulePlan[] = [
  {
    accessSuccessWelcomeMessage: '您好，智能小助手为您提供服务。',
    agentNoReplyAutoResponseMessage: '请稍候，我们正在处理。',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: '很高兴为您服务，祝您生活愉快！',
    assignedAgentGreeting:
      '尊敬的{customerName}您好，{agentName}将为您服务，若您超过{timeoutMinutes}分钟未回复，会话将自动关闭，请您及时查看。',
    agentTimeoutNotice: '客户超时未回复，会话自动关闭。',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      '未收到您的回复，已自动关闭服务，若有需要可再次联系客服。',
    description: 'Default rule plan for text-based customer service channels.',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      '抱歉，工作时间为{workTime}，请在此时间联系我们。',
    planCode: 'MSRP_TEXT_STANDARD',
    planName: 'Standard Text Service',
    preTimeoutReminderMessage:
      '系统未收到回复，将在{reminderMinutes}分钟后结束会话。',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage: '当前人工服务繁忙，请稍后再试。',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      '当前人工服务繁忙，预计等待{estimatedWaitMinutes}分钟。',
    status: 'Active',
    updatedAt: '2026-06-03',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  },
  {
    accessSuccessWelcomeMessage: '您好，优先服务智能助手为您提供服务。',
    agentNoReplyAutoResponseMessage:
      '请稍候，我们正在优先处理您的请求。',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: '很高兴为您提供优先服务，祝您生活愉快！',
    assignedAgentGreeting:
      '尊敬的{customerName}您好，{agentName}将优先为您服务，若您超过{timeoutMinutes}分钟未回复，会话将自动关闭，请您及时查看。',
    agentTimeoutNotice: '客户超时未回复，优先服务会话自动关闭。',
    customerNoReplyTimeoutMinutes: 8,
    customerTimeoutNotice:
      '未收到您的回复，优先服务已自动关闭，若有需要可再次联系客服。',
    description: 'Priority text service with longer customer timeout.',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'TEXT',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      '抱歉，优先服务工作时间为{workTime}，请在此时间联系我们。',
    planCode: 'MSRP_TEXT_PRIORITY',
    planName: 'Priority Text Service',
    preTimeoutReminderMessage:
      '系统未收到回复，将在{reminderMinutes}分钟后结束优先服务会话。',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage: '当前优先服务坐席繁忙，请稍后再试。',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      '当前优先服务坐席繁忙，预计等待{estimatedWaitMinutes}分钟。',
    status: 'Active',
    updatedAt: '2026-06-03',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  },
  {
    accessSuccessWelcomeMessage: '您好，语音智能小助手为您提供服务。',
    agentNoReplyAutoResponseMessage: '请稍候，我们正在处理。',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: '很高兴为您服务，祝您生活愉快！',
    assignedAgentGreeting:
      '尊敬的{customerName}您好，{agentName}将为您服务。',
    agentTimeoutNotice: '客户超时未回复，会话自动关闭。',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      '未收到您的回复，已自动关闭服务，若有需要可再次联系客服。',
    description: 'Standard voice service access rule plan.',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'VOICE',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      '抱歉，工作时间为{workTime}，请在此时间联系我们。',
    planCode: 'MSRP_VOICE_STANDARD',
    planName: 'Standard Voice Service',
    preTimeoutReminderMessage:
      '系统未收到回复，将在{reminderMinutes}分钟后结束会话。',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage: '当前人工服务繁忙，请稍后再试。',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      '当前人工服务繁忙，预计等待{estimatedWaitMinutes}分钟。',
    status: 'Active',
    updatedAt: '2026-06-04',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  },
  {
    accessSuccessWelcomeMessage: '您好，视频智能小助手为您提供服务。',
    agentNoReplyAutoResponseMessage: '请稍候，我们正在处理。',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder: '很高兴为您服务，祝您生活愉快！',
    assignedAgentGreeting:
      '尊敬的{customerName}您好，{agentName}将为您服务。',
    agentTimeoutNotice: '客户超时未回复，会话自动关闭。',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      '未收到您的回复，已自动关闭服务，若有需要可再次联系客服。',
    description: 'Standard video service access rule plan.',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'VIDEO',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      '抱歉，工作时间为{workTime}，请在此时间联系我们。',
    planCode: 'MSRP_VIDEO_STANDARD',
    planName: 'Standard Video Service',
    preTimeoutReminderMessage:
      '系统未收到回复，将在{reminderMinutes}分钟后结束会话。',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage: '当前人工服务繁忙，请稍后再试。',
    queueTimeoutMinutes: 10,
    queueWaitingMessage:
      '当前人工服务繁忙，预计等待{estimatedWaitMinutes}分钟。',
    status: 'Active',
    updatedAt: '2026-06-04',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  },
  {
    accessSuccessWelcomeMessage:
      'Hello, BANK 1 social service assistant is ready to help you.',
    agentNoReplyAutoResponseMessage:
      'Please hold on. We are still processing your request.',
    agentNoReplyBreachSeconds: 120,
    agentNoReplyTimeoutSeconds: 120,
    agentNoReplyWarningSeconds: 60,
    agentEndReminder:
      'Thank you for contacting BANK 1. We are glad to assist you.',
    assignedAgentGreeting:
      'Hello {customerName}, {agentName} will assist you. If you do not reply within {timeoutMinutes} minutes, the conversation will be closed automatically.',
    agentTimeoutNotice:
      'The customer did not reply within the configured timeout. The conversation has been closed automatically.',
    customerNoReplyTimeoutMinutes: 5,
    customerTimeoutNotice:
      'We did not receive your reply. The service has been closed automatically. Please contact us again if you need help.',
    description:
      'Standard non-DM service for social comments, replies, mentions, and app reviews.',
    maxConcurrentAccess: 50,
    maxQueueCustomers: 20,
    mediaCode: 'NON_DM',
    minScanIntervalSeconds: 30,
    nonWorkingTimeMessage:
      'Sorry, we are currently outside service hours.',
    planCode: 'MSRP_NON_DM_STANDARD',
    planName: 'Standard Non-DM Service',
    preTimeoutReminderMessage:
      'We have not received your reply. This conversation will close in {reminderMinutes} minute(s).',
    preTimeoutReminderMinutes: 1,
    queueTimeoutMessage:
      'All agents are currently busy. Please try again later.',
    queueTimeoutMinutes: 10,
    queueWaitingMessage: 'All agents are currently busy. Please wait.',
    status: 'Active',
    updatedAt: '2026-07-02',
    updatedBy: 'Admin',
    webchatRecallLimitSeconds: 120,
  },
]

export const channelMediaRuleBindings: ChannelMediaRuleBinding[] = channels
  .flatMap((channel) =>
    channel.mediaTypes
      .filter((mediaCode) => mediaCode === 'TEXT' || mediaCode === 'NON_DM')
      .map((mediaCode) => ({
        bindingCode: `${channel.channelCode}_${mediaCode}`,
        channelCode: channel.channelCode,
        mediaCode,
        rulePlanCode:
          mediaCode === 'NON_DM'
            ? 'MSRP_NON_DM_STANDARD'
            : channel.channelCode === 'BANKAPP'
              ? 'MSRP_TEXT_PRIORITY'
              : 'MSRP_TEXT_STANDARD',
        status: 'Active',
      })),
  )

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
    sourceBusinessCode: 'MENU_PERBANKAN',
    status: 'Active',
  },
  {
    businessName: 'Card Lost',
    businessTypeCode: '02',
    projectCode: routingProjectCode,
    sourceBusinessCode: 'MENU_KARTU_KREDIT',
    status: 'Active',
  },
  {
    businessName: 'Loan Information',
    businessTypeCode: '03',
    projectCode: routingProjectCode,
    sourceBusinessCode: 'MENU_LOAN_INFORMATION',
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
    channelCode: 'BANKAPP',
    mediaCode: 'VOICE',
    ratioGroupCode: 'RATIO_BANKAPP_VOICE_DEFAULT',
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
    channelCode: 'BANKAPP',
    mediaCode: 'VIDEO',
    ratioGroupCode: 'RATIO_BANKAPP_VIDEO_DEFAULT',
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
    channelCode: 'BANKAPP',
    mediaCode: 'TEXT',
    ratioGroupCode: 'RATIO_BANKAPP_TEXT_DEFAULT',
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

export const channelAccounts: ChannelAccount[] = [
  {
    account: 'bankapp-bank1-prod',
    accountCode: 'ACC_BANKAPP_BANK1',
    accountName: 'BANK 1 Bankapp',
    channelCode: 'BANKAPP',
    credentialRef: 'secret://aicc/bankapp/main',
    purpose: 'BankApp official service account.',
    status: 'Active',
  },
  {
    account: 'widget-bank1-main',
    accountCode: 'ACC_WEBCHAT_BANK1',
    accountName: 'BANK 1 Webchat',
    channelCode: 'WEBCHAT',
    credentialRef: 'secret://aicc/webchat/main',
    purpose: 'Public website webchat widget.',
    status: 'Active',
  },
  {
    account: '628100001',
    accountCode: 'ACC_WA_BANK1_MAIN',
    accountName: 'BANK 1 WhatsApp Main',
    channelCode: 'WHATSAPP',
    credentialRef: 'secret://aicc/whatsapp/main',
    purpose: 'Main WhatsApp customer service number.',
    status: 'Active',
  },
  {
    account: 'contact@bank1.example',
    accountCode: 'ACC_EMAIL_CONTACT',
    accountName: 'BANK 1 Contact Mailbox',
    channelCode: 'EMAIL',
    credentialRef: 'secret://aicc/email/contact',
    purpose: 'General email service mailbox.',
    status: 'Active',
  },
  {
    account: 'priority@bank1.example',
    accountCode: 'ACC_EMAIL_PRIORITY',
    accountName: 'BANK 1 Priority Mailbox',
    channelCode: 'EMAIL_PRIORITY',
    credentialRef: 'secret://aicc/email/priority',
    purpose: 'Priority customer email mailbox with separate mail servers.',
    status: 'Active',
  },
  {
    account: 'bank1.official',
    accountCode: 'ACC_INSTAGRAM_BANK1',
    accountName: 'BANK 1 Instagram',
    channelCode: 'INSTAGRAM',
    credentialRef: 'secret://aicc/instagram/main',
    purpose: 'Official Instagram service account.',
    status: 'Active',
  },
  {
    account: 'bank1.priority',
    accountCode: 'ACC_INSTAGRAM_PRIORITY',
    accountName: 'BANK 1 Instagram Priority',
    channelCode: 'INSTAGRAM',
    credentialRef: 'secret://aicc/instagram/priority',
    purpose: 'Priority segment Instagram service account.',
    status: 'Active',
  },
  {
    account: 'urn:li:organization:100001',
    accountCode: 'ACC_LINKEDIN_BANK1',
    accountName: 'BANK 1 LinkedIn',
    channelCode: 'LINKEDIN',
    credentialRef: 'secret://aicc/linkedin/main',
    purpose: 'Official LinkedIn organization account.',
    status: 'Active',
  },
  {
    account: 'fb-page-bank1-main',
    accountCode: 'ACC_FACEBOOK_BANK1',
    accountName: 'BANK 1 Facebook',
    channelCode: 'FACEBOOK',
    credentialRef: 'secret://aicc/facebook/main',
    purpose: 'Official Facebook page account.',
    status: 'Active',
  },
  {
    account: '@bank1care',
    accountCode: 'ACC_X_BANK1',
    accountName: 'BANK 1 X',
    channelCode: 'X',
    credentialRef: 'secret://aicc/x/main',
    purpose: 'Official X customer care handle.',
    status: 'Active',
  },
  {
    account: 'bank1.official',
    accountCode: 'ACC_TIKTOK_BANK1',
    accountName: 'BANK 1 Tik Tok',
    channelCode: 'TIKTOK',
    credentialRef: 'secret://aicc/tiktok/main',
    purpose: 'Official Tik Tok account.',
    status: 'Active',
  },
  {
    account: 'UC_BANK1_SERVICE',
    accountCode: 'ACC_YOUTUBE_BANK1',
    accountName: 'BANK 1 YouTube',
    channelCode: 'YOUTUBE',
    credentialRef: 'secret://aicc/youtube/main',
    purpose: 'Official YouTube channel comments and messages.',
    status: 'Active',
  },
  {
    account: '1234567890',
    accountCode: 'ACC_APPSTORE_BANK1',
    accountName: 'BANK 1 AppStore',
    channelCode: 'APPSTORE',
    credentialRef: 'secret://aicc/appstore/main',
    purpose: 'BANK 1 mobile app review account.',
    status: 'Active',
  },
  {
    account: 'com.bank1.mobile',
    accountCode: 'ACC_PLAYSTORE_BANK1',
    accountName: 'BANK 1 PlayStore',
    channelCode: 'PLAYSTORE',
    credentialRef: 'secret://aicc/playstore/main',
    purpose: 'BANK 1 mobile app review account.',
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
    accountCode: 'ACC_BANKAPP_BANK1',
    channelMediaCode: 'BANKAPP_TEXT',
    entryCode: 'ENTRY_BANKAPP_CHAT',
    entryValue: 'bank1://service/chat',
    status: 'Active',
  },
  {
    accountCode: 'ACC_BANKAPP_BANK1',
    channelMediaCode: 'BANKAPP_VOICE',
    entryCode: 'ENTRY_BANKAPP_VOICE',
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
  {
    accountCode: 'ACC_EMAIL_PRIORITY',
    channelMediaCode: 'EMAIL_PRIORITY_TEXT',
    entryCode: 'ENTRY_EMAIL_PRIORITY',
    entryValue: 'priority@bank1.example',
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
  {
    description:
      'Chinese service window for callers who enter invalid IVR input three consecutive times.',
    holidayRules: [],
    planCode: 'WTP_3_WRONG_INPUT_ZH',
    planName: 'Input error - Chinese',
    ramadanSchedule: {
      dateFrom: '',
      dateTo: '',
      enabled: false,
      workSchedules: [],
    },
    specialWorkingPlans: [],
    status: 'Active',
    updatedAt: '2026-06-05',
    updatedBy: 'Admin',
    workSchedules: [
      {
        ruleId: 'WS_3_WRONG_INPUT_ZH_WEEKDAY',
        timeRanges: [{ endTime: '20:00', startTime: '08:00' }],
        weekdays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      },
      {
        ruleId: 'WS_3_WRONG_INPUT_ZH_WEEKEND',
        timeRanges: [{ endTime: '15:00', startTime: '09:00' }],
        weekdays: ['SAT', 'SUN'],
      },
    ],
  },
]

const createSkillQueue = ({
  assignedAgentCount,
  maxQueueCustomers = 100,
  platformSkillId,
  queueTimeoutMinutes = 10,
  skillQueueCode,
  skillQueueName,
  vdnCode = 'VDN_RETAIL_IN',
  workTimePlanCode = '',
}: {
  assignedAgentCount: number
  maxQueueCustomers?: number
  platformSkillId: string
  queueTimeoutMinutes?: number
  skillQueueCode: string
  skillQueueName: string
  vdnCode?: string
  workTimePlanCode?: string
}): SkillQueue => ({
  assignedAgentCount,
  maxQueueCustomers,
  nonWorkingTimeMessage:
    'Service hours are currently closed. Please contact us during working hours.',
  platformSkillId,
  prompts: [
    {
      mediaCode: 'TEXT',
      promptType: 'Timeout Message',
      value: 'Queue timeout. Please start a new conversation.',
    },
  ],
  queueTimeoutMessage:
    'All agents are busy. Please start a new conversation later.',
  queueTimeoutMinutes,
  queueWaitingMessage:
    'All agents are busy. Estimated waiting time is {estimatedWaitMinutes} minutes.',
  skillQueueCode,
  skillQueueName,
  status: 'Active',
  supportsVideo: false,
  vdnCode,
  workTimePlanCode,
})

export const skillQueues: SkillQueue[] = [
  createSkillQueue({
    assignedAgentCount: 24,
    maxQueueCustomers: 120,
    platformSkillId: 'GX-SK-1001',
    skillQueueCode: 'SQ_GENERAL_ID',
    skillQueueName: 'Perbankan',
  }),
  createSkillQueue({
    assignedAgentCount: 18,
    maxQueueCustomers: 80,
    platformSkillId: 'GX-SK-1002',
    queueTimeoutMinutes: 7,
    skillQueueCode: 'SQ_CARD_PRIORITY',
    skillQueueName: 'Kartu Kredit',
    vdnCode: 'VDN_CARD_URGENT',
  }),
  createSkillQueue({
    assignedAgentCount: 12,
    platformSkillId: 'GX-SK-1003',
    skillQueueCode: 'SQ_PRIO_SOLI_PERBANKAN',
    skillQueueName: 'Prio Soli Perbankan',
  }),
  createSkillQueue({
    assignedAgentCount: 10,
    platformSkillId: 'GX-SK-1004',
    skillQueueCode: 'SQ_PRIO_SOLI_KARTU_KREDIT',
    skillQueueName: 'Prio Soli Kartu Kredit',
    vdnCode: 'VDN_CARD_URGENT',
  }),
  createSkillQueue({
    assignedAgentCount: 16,
    platformSkillId: 'GX-SK-1005',
    skillQueueCode: 'SQ_BANK_BISNIS',
    skillQueueName: 'Bank Bisnis',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 10,
    platformSkillId: 'GX-SK-1006',
    skillQueueCode: 'SQ_PERSONAL_BANKER',
    skillQueueName: 'Personal Banker',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 14,
    platformSkillId: 'GX-SK-1007',
    skillQueueCode: 'SQ_LAYANAN_CABANG',
    skillQueueName: 'Layanan Cabang',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 14,
    platformSkillId: 'GX-SK-1008',
    skillQueueCode: 'SQ_DIGITAL_EN',
    skillQueueName: 'KlikBank Bisnis',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 12,
    platformSkillId: 'GX-SK-1009',
    skillQueueCode: 'SQ_KPR',
    skillQueueName: 'KPR',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 12,
    platformSkillId: 'GX-SK-1010',
    skillQueueCode: 'SQ_PERSONAL_LOAN',
    skillQueueName: 'Personal Loan',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 10,
    platformSkillId: 'GX-SK-1011',
    skillQueueCode: 'SQ_MERCHANT_SOLUTION',
    skillQueueName: 'Merchant Solution',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
  createSkillQueue({
    assignedAgentCount: 12,
    platformSkillId: 'GX-SK-1012',
    skillQueueCode: 'SQ_PAYLATER',
    skillQueueName: 'Paylater',
    workTimePlanCode: 'WTP_BANK_HOURS',
  }),
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
        factorValueCode: 'BANKAPP',
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
  ...channelAccounts.map((account) => ({
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
