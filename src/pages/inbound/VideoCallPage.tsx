import { bankAppVideoCustomer, inboundCustomer } from '../../mock/inbound'
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
  const isScreenShareActive = useAppStore(
    (state) => state.isScreenShareActive,
  )
  const bankAppVideoShareState = useAppStore(
    (state) => state.bankAppVideoShareState,
  )
  const startBankAppVideoShareSelection = useAppStore(
    (state) => state.startBankAppVideoShareSelection,
  )
  const confirmBankAppVideoScreenShare = useAppStore(
    (state) => state.confirmBankAppVideoScreenShare,
  )
  const isBankAppVideo = interaction.source === 'bankapp-video'
  const customer = isBankAppVideo ? bankAppVideoCustomer : videoCallCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Video call workspace"
      customer={customer}
      overlay={
        isCurrentActive && showOpenEyeVideoWindow ? (
          <OpenEyeVideoWindow
            bankAppVideoShareState={bankAppVideoShareState}
            isBankAppVideo={isBankAppVideo}
            isScreenShareActive={isScreenShareActive}
            onConfirmScreenShare={confirmBankAppVideoScreenShare}
            onStartScreenShare={startBankAppVideoShareSelection}
          />
        ) : null
      }
    />
  )
}
