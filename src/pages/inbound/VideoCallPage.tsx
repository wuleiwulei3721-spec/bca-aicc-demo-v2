import { inboundCustomer } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type { CustomerInformation } from '../../types'
import { OpenEyeVideoWindow } from './components/OpenEyeVideoWindow'
import { InteractionWorkspace } from './InteractionWorkspace'

const videoCallCustomer: CustomerInformation = {
  ...inboundCustomer,
  accessChannel: 'Haloapps Video',
}

export function VideoCallPage() {
  const showOpenEyeVideoWindow = useAppStore(
    (state) => state.isOpenEyeVideoWindowVisible,
  )

  return (
    <InteractionWorkspace
      ariaLabel="Video call workspace"
      customer={videoCallCustomer}
      overlay={showOpenEyeVideoWindow ? <OpenEyeVideoWindow /> : null}
    />
  )
}
