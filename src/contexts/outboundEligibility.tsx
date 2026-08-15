import { createContext, useContext } from 'react'

export interface OutboundEligibility {
  hasOutboundAccess: boolean
}

export const OutboundEligibilityContext = createContext<OutboundEligibility>({
  hasOutboundAccess: false,
})

export function useOutboundEligibility() {
  return useContext(OutboundEligibilityContext)
}
