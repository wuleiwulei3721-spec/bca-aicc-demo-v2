import { bankAppVideoCustomer, inboundCustomer } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type { CustomerInformation } from '../../types'
import { OpenEyeVideoWindow } from './components/OpenEyeVideoWindow'
import { InteractionWorkspace } from './InteractionWorkspace'

const videoCallCustomer: CustomerInformation = {
  ...inboundCustomer,
  accessChannel: 'Video',
}

export function VideoCallPage() {
  const showOpenEyeVideoWindow = useAppStore(
    (state) => state.isOpenEyeVideoWindowVisible,
  )
  const isScreenShareActive = useAppStore(
    (state) => state.isScreenShareActive,
  )
  const bankAppVideoShareState = useAppStore(
    (state) => state.bankAppVideoShareState,
  )
  const videoCallPopupSource = useAppStore(
    (state) => state.videoCallPopupSource,
  )
  const startBankAppVideoShareSelection = useAppStore(
    (state) => state.startBankAppVideoShareSelection,
  )
  const confirmBankAppVideoScreenShare = useAppStore(
    (state) => state.confirmBankAppVideoScreenShare,
  )
  const customer =
    videoCallPopupSource === 'bankapp-video'
      ? bankAppVideoCustomer
      : videoCallCustomer

  return (
    <InteractionWorkspace
      ariaLabel="Video call workspace"
      customer={customer}
      overlay={
        showOpenEyeVideoWindow ? (
          <OpenEyeVideoWindow
            bankAppVideoShareState={bankAppVideoShareState}
            isBankAppVideo={videoCallPopupSource === 'bankapp-video'}
            isScreenShareActive={isScreenShareActive}
            onConfirmScreenShare={confirmBankAppVideoScreenShare}
            onStartScreenShare={startBankAppVideoShareSelection}
          />
        ) : null
      }
    />
  )
}
