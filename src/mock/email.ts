import type {
  EmailMessage,
  EmailTemplate,
} from '../types'
import type { CustomerInformation } from '../types'

const dimasCustomer: CustomerInformation = {
  accessChannel: 'Email',
  accessDuration: '09:59',
  profile: {
    avatarInitials: 'DA',
    avatarUrl: '',
    cisNumber: '00000078987',
    customerType: 'Priority Customer',
    crmContacts: {
      Email: ['dimas.abimanyu@example.com'],
      Phone: ['087825100234'],
      WhatsApp: ['+62 878 2510 0234'],
    },
    email: 'dimas.abimanyu@example.com',
    name: 'Dimas Abimanyu Prabowo',
    phoneNumber: '087825100234',
  },
  verificationStatus: 'Unverified',
}

const sitiCustomer: CustomerInformation = {
  accessChannel: 'Email',
  accessDuration: '39:59',
  profile: {
    avatarInitials: 'SA',
    avatarUrl: '',
    cisNumber: '00000056231',
    customerType: 'Regular Customer',
    crmContacts: {
      Email: ['siti.aminah@example.com'],
      Phone: ['081234560118'],
    },
    email: 'siti.aminah@example.com',
    name: 'Siti Aminah',
    phoneNumber: '081234560118',
  },
  verificationStatus: 'Unverified',
}

const agusCustomer: CustomerInformation = {
  accessChannel: 'Email',
  accessDuration: '29:59',
  profile: {
    avatarInitials: 'AW',
    avatarUrl: '',
    cisNumber: '00000061342',
    customerType: 'Regular Customer',
    crmContacts: {
      Email: ['agus.wijaya@example.com'],
      Phone: ['081234560229'],
    },
    email: 'agus.wijaya@example.com',
    name: 'Agus Wijaya',
    phoneNumber: '081234560229',
  },
  verificationStatus: 'Unverified',
}

const disputeBody = `
  <p>Halo BANK 1,</p>
  <p>Saya ingin mengajukan sanggahan terhadap transaksi yang muncul pada tagihan kartu kredit saya. Nomor kartu yang digunakan berakhiran 1234.</p>
  <section class="email-message-rich__banner">
    <strong>Sanggahan Transaksi Kartu Kredit BANK 1</strong>
    <span>Service request received through the Email channel</span>
  </section>
  <section class="email-message-rich__transaction">
    <div><span>Merchant</span><strong>AMAZON.COM DIGITAL</strong></div>
    <div><span>Date</span><strong>17 July 2026</strong></div>
    <div><span>Amount</span><strong>IDR 1,450,000</strong></div>
  </section>
  <p>Saya tidak pernah melakukan transaksi tersebut. Mohon bantuan untuk melakukan pemblokiran kartu dan pemeriksaan lebih lanjut.</p>
`

const activationBody = `
  <p>Halo BANK 1,</p>
  <p>Saya belum dapat menyelesaikan aktivasi mobile banking setelah mengganti perangkat. Mohon bantuan untuk memeriksa status perangkat saya.</p>
`

const limitBody = `
  <p>Halo BANK 1,</p>
  <p>Saya ingin menanyakan persyaratan kenaikan limit kartu kredit dan dokumen yang perlu dikirimkan.</p>
`

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'template-dispute-follow-up',
    name: 'Transaction dispute follow-up',
    attachmentName: 'dispute-follow-up.pdf',
    bodyHtml:
      '<p>Halo Bapak/Ibu,</p><p>Terima kasih telah menghubungi BANK 1. Laporan sanggahan transaksi Anda telah kami terima dan akan kami tindak lanjuti sesuai prosedur.</p><p>Salam,<br>BANK 1 Customer Service</p>',
    localizedBodyHtml: {
      EN: '<p>Dear Customer,</p><p>Thank you for contacting BANK 1. Your transaction dispute report has been received and will be followed up according to our procedure.</p>',
      ID: '<p>Halo Bapak/Ibu,</p><p>Terima kasih telah menghubungi BANK 1. Laporan sanggahan transaksi Anda telah kami terima dan akan kami tindak lanjuti sesuai prosedur.</p>',
    },
  },
  {
    id: 'template-document-request',
    name: 'Document request',
    bodyHtml:
      '<p>Halo Bapak/Ibu,</p><p>Mohon melengkapi dokumen pendukung agar permintaan dapat diproses lebih lanjut.</p><p>Salam,<br>BANK 1 Customer Service</p>',
    localizedBodyHtml: {
      EN: '<p>Dear Customer,</p><p>Please complete the supporting documents so your request can be processed further.</p>',
      ID: '<p>Halo Bapak/Ibu,</p><p>Mohon melengkapi dokumen pendukung agar permintaan dapat diproses lebih lanjut.</p>',
    },
  },
  {
    id: 'template-general-response',
    name: 'General service response',
    bodyHtml:
      '<p>Halo Bapak/Ibu,</p><p>Terima kasih telah menghubungi BANK 1. Permintaan Anda sedang kami proses.</p><p>Salam,<br>BANK 1 Customer Service</p>',
    localizedBodyHtml: {
      EN: '<p>Dear Customer,</p><p>Thank you for contacting BANK 1. Your request is being processed by our service team.</p>',
      ID: '<p>Halo Bapak/Ibu,</p><p>Terima kasih telah menghubungi BANK 1. Permintaan Anda sedang kami proses.</p>',
    },
  },
]

function cloneCustomer(customer: CustomerInformation): CustomerInformation {
  return {
    ...customer,
    profile: {
      ...customer.profile,
      crmContacts: customer.profile.crmContacts
        ? Object.fromEntries(
            Object.entries(customer.profile.crmContacts).map(
              ([channel, values]) => [channel, values ? [...values] : values],
            ),
          )
        : undefined,
    },
  }
}

export function createEmailDemoMessages(now = Date.now()): EmailMessage[] {
  const minutesAgo = (minutes: number) => now - minutes * 60 * 1000

  return [
    {
      id: 'email-inbox-001',
      threadId: 'email-thread-dispute',
      folder: 'inbox',
      direction: 'inbound',
      handlingStatus: 'new',
      sender: 'dimas.abimanyu@example.com',
      receiver: 'contact@bank1.demo',
      subject: 'Disputed credit card transaction',
      preview: 'Saya ingin mengajukan sanggahan terhadap transaksi...',
      bodyHtml: disputeBody,
      sentAt: minutesAgo(10),
      customer: cloneCustomer(dimasCustomer),
      hasAttachment: true,
      isRead: false,
      slaStartedAt: minutesAgo(10),
      slaTargetSeconds: 40 * 60,
    },
    {
      id: 'email-inbox-002',
      threadId: 'email-thread-activation',
      folder: 'inbox',
      direction: 'inbound',
      handlingStatus: 'new',
      sender: 'siti.aminah@example.com',
      receiver: 'contact@bank1.demo',
      subject: 'Mobile banking activation failed',
      preview: 'Saya belum dapat menyelesaikan aktivasi mobile banking...',
      bodyHtml: activationBody,
      sentAt: minutesAgo(40),
      customer: cloneCustomer(sitiCustomer),
      isRead: false,
      slaStartedAt: minutesAgo(40),
      slaTargetSeconds: 40 * 60,
    },
    {
      id: 'email-inbox-003',
      threadId: 'email-thread-limit',
      folder: 'inbox',
      direction: 'inbound',
      handlingStatus: 'read',
      sender: 'agus.wijaya@example.com',
      receiver: 'contact@bank1.demo',
      subject: 'Credit card limit increase request',
      preview: 'Saya ingin menanyakan persyaratan kenaikan limit...',
      bodyHtml: limitBody,
      sentAt: minutesAgo(30),
      customer: cloneCustomer(agusCustomer),
      isRead: true,
      slaStartedAt: minutesAgo(30),
      slaTargetSeconds: 40 * 60,
    },
    {
      id: 'email-sent-001',
      threadId: 'email-thread-dispute',
      folder: 'sent',
      direction: 'outbound',
      handlingStatus: 'sent',
      emailStatus: 'closed',
      sender: 'contact@bank1.demo',
      receiver: 'dimas.abimanyu@example.com',
      subject: 'RE: Disputed credit card transaction',
      preview: 'Laporan sanggahan transaksi Anda telah kami terima...',
      bodyHtml:
        '<p>Halo Bapak Dimas,</p><p>Laporan sanggahan transaksi Anda telah kami terima. Silakan membalas email ini apabila ada dokumen pendukung tambahan.</p><p>Salam,<br>BANK 1 Customer Service</p>',
      sentAt: minutesAgo(24 * 60),
      customer: cloneCustomer(dimasCustomer),
      isRead: true,
    },
    {
      id: 'email-draft-001',
      threadId: 'email-thread-activation',
      folder: 'drafts',
      direction: 'outbound',
      handlingStatus: 'draft',
      sender: 'contact@bank1.demo',
      receiver: 'siti.aminah@example.com',
      subject: 'RE: Mobile banking activation failed',
      preview: 'Terima kasih telah menghubungi BANK 1...',
      bodyHtml:
        '<p>Halo Ibu Siti,</p><p>Terima kasih telah menghubungi BANK 1. Kami sedang memeriksa status perangkat Anda.</p>',
      sentAt: minutesAgo(18),
      customer: cloneCustomer(sitiCustomer),
      isRead: true,
    },
    {
      id: 'email-draft-failed-001',
      threadId: 'email-thread-limit',
      folder: 'drafts',
      direction: 'outbound',
      handlingStatus: 'failed',
      sender: 'contact@bank1.demo',
      receiver: 'agus.wijaya@example.com',
      subject: 'RE: Credit card limit increase request',
      preview: 'Previous send attempt failed. Please review and resend...',
      bodyHtml:
        '<p>Halo Bapak Agus,</p><p>Previous send attempt failed. Please review the requested limit information before resending.</p>',
      sentAt: minutesAgo(8),
      customer: cloneCustomer(agusCustomer),
      isRead: true,
    },
    {
      id: 'email-trash-001',
      threadId: 'email-thread-address',
      folder: 'trash',
      originalFolder: 'inbox',
      direction: 'inbound',
      handlingStatus: 'trashed',
      sender: 'siti.aminah@example.com',
      receiver: 'contact@bank1.demo',
      subject: 'Update registered mailing address',
      preview: 'Mohon informasi cara memperbarui alamat surat...',
      bodyHtml:
        '<p>Halo BANK 1,</p><p>Mohon informasi cara memperbarui alamat surat yang terdaftar pada rekening saya.</p>',
      sentAt: minutesAgo(3 * 24 * 60),
      customer: cloneCustomer(sitiCustomer),
      isRead: true,
    },
  ]
}
