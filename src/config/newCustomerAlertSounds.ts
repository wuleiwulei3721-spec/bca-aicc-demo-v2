export interface NewCustomerAlertSound {
  label: string
  value: string
}

export const newCustomerAlertSounds: NewCustomerAlertSound[] = [
  { label: 'Alert 01 - Single Chime', value: 'new-customer-alert-01.wav' },
  { label: 'Alert 02 - Double Chime', value: 'new-customer-alert-02.wav' },
  { label: 'Alert 03 - Triple Chime', value: 'new-customer-alert-03.wav' },
  { label: 'Alert 04 - Rising Chime', value: 'new-customer-alert-04.wav' },
  { label: 'Alert 05 - Falling Chime', value: 'new-customer-alert-05.wav' },
]

export function getNewCustomerAlertSoundUrl(sound: string) {
  return `/audio/new-customer-alerts/${sound}`
}
