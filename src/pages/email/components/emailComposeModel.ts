import type { EmailLanguage } from '../../../types'

export const BANK_EMAIL_ACCOUNT = 'contact@bank1.demo'
export const BANK_PUBLIC_WEBSITE = 'https://www.bca.co.id'
export const BANK_SIGNATURE_IMAGE = '/email-assets/bank-service-counter.jpg'
export const TEAM_LEADER_EMAIL = 'tl.budi.kartika@bank1.demo'
export const AGENT_NAME = 'Budi Kartika'
export const DEFAULT_EMAIL_LANGUAGE: EmailLanguage = 'ID'

function formatSignatureDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function createEmailSignature(language: EmailLanguage) {
  const dateLabel = language === 'EN' ? 'Date' : 'Tanggal'
  const regards = language === 'EN' ? 'Regards' : 'Salam'

  return `
    <section class="email-signature" data-public-mailbox="${BANK_EMAIL_ACCOUNT}" data-language="${language}">
      <p>${regards},</p>
      <p><strong>${AGENT_NAME}</strong><br>BANK 1 Customer Service</p>
      <p>${dateLabel}: ${formatSignatureDate()}</p>
      <p>
        <img src="${BANK_SIGNATURE_IMAGE}" alt="BANK 1 banking service" width="28" height="28" />
        <a href="${BANK_PUBLIC_WEBSITE}" target="_blank" rel="noreferrer">${BANK_PUBLIC_WEBSITE}</a>
      </p>
    </section>
  `
}
