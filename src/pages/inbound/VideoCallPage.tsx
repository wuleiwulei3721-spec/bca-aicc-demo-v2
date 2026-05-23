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
  const videoCallPopupSource = useAppStore(
    (state) => state.videoCallPopupSource,
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
          <OpenEyeVideoWindow isScreenShareActive={isScreenShareActive} />
        ) : null
      }
    />
  )
}
