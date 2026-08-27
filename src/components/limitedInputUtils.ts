import type { ChangeEvent } from 'react'

export function clampLimitedChange<
  Element extends HTMLInputElement | HTMLTextAreaElement,
>(event: ChangeEvent<Element>, maxLength: number) {
  if (event.target.value.length > maxLength) {
    event.target.value = event.target.value.slice(0, maxLength)
  }

  return event
}
