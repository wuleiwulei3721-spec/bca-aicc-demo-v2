import {
  bankAppVideoGuestCustomer,
  bankAppVideoCustomer,
  inboundCustomer,
} from '../../mock/inbound'
import { useAppStore } from '../../store'
import type { CallInteraction } from '../../store'
import type { CustomerInformation } from '../../types'
import { OpenEyeVideoWindow } from './components/OpenEyeVideoWindow'
import { InteractionWorkspace } from './InteractionWorkspace'

const videoCallCustomer: CustomerInformation = {
  ...inboundCustomer,
  accessChannel: 'Video',
}

interface VideoCallPageProps {
  interaction: CallInteraction
  isCurrentActive: boolean
}

export function VideoCallPage({
  interaction,
  isCurrentActive,
}: VideoCallPageProps) {
  const showOpenEyeVideoWindow = useAppStore(
    (state) => state.isOpenEyeVideoWindowVisible,
  )
  const bankAppVideoShareState = useAppStore(
    (state) => state.bankAppVideoShareState,
  )
  const isBankAppVideo = interaction.source === 'bankapp-video'
  const customer = isBankAppVideo
    ? interaction.bankAppCustomerType === 'guest'
      ? bankAppVideoGuestCustomer
      : bankAppVideoCustomer
    : videoCallCustomer

  return (
    <InteractionWorkspace
      accessMenuLabel="Business Menu Selection Record"
      accessMenuName={interaction.businessMenuName}
      ariaLabel="Video call workspace"
      customer={customer}
      showIvrJourney={false}
      overlay={
        isCurrentActive && showOpenEyeVideoWindow ? (
          <OpenEyeVideoWindow
            bankAppVideoShareState={bankAppVideoShareState}
            isBankAppVideo={isBankAppVideo}
          />
        ) : null
      }
    />
  )
}
