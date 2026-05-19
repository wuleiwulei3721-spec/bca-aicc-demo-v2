import { useState } from 'react'
import { InputNumber } from 'antd'
import { AppButton, BaseModal } from '../../components'

interface ToolbarSettingsModalProps {
  autoAnswerSeconds: number
  open: boolean
  onClose: () => void
  onConfirm: (seconds: number) => void
}

export function ToolbarSettingsModal({
  autoAnswerSeconds,
  open,
  onClose,
  onConfirm,
}: ToolbarSettingsModalProps) {
  const [draftSeconds, setDraftSeconds] = useState(autoAnswerSeconds)

  return (
    <BaseModal
      className="aicc-transfer-modal aicc-toolbar-settings-modal"
      kind="settings"
      open={open}
      title="Settings"
      width={520}
      onCancel={onClose}
    >
      <div className="aicc-toolbar-settings">
        <label>
          <span>Automatically answer the call after ringing for</span>
          <InputNumber
            min={1}
            max={60}
            value={draftSeconds}
            onChange={(value) => setDraftSeconds(value ?? autoAnswerSeconds)}
          />
          <span>seconds</span>
        </label>
        <div className="aicc-toolbar-settings__footer">
          <AppButton onClick={onClose}>Cancel</AppButton>
          <AppButton type="primary" onClick={() => onConfirm(draftSeconds)}>
            Confirm
          </AppButton>
        </div>
      </div>
    </BaseModal>
  )
}
