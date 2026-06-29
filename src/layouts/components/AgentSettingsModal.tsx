import { Switch } from 'antd'
import { AppButton, BaseModal } from '../../components'

interface AgentSettingsModalProps {
  open: boolean
  systemSoundEnabled: boolean
  onClose: () => void
  onSystemSoundEnabledChange: (enabled: boolean) => void
}

export function AgentSettingsModal({
  open,
  systemSoundEnabled,
  onClose,
  onSystemSoundEnabledChange,
}: AgentSettingsModalProps) {
  return (
    <BaseModal
      className="aicc-transfer-modal aicc-agent-settings-modal"
      kind="settings"
      open={open}
      title="Agent Settings"
      width={460}
      onCancel={onClose}
    >
      <div className="aicc-agent-settings">
        <div className="aicc-agent-settings__row">
          <span>System prompt sound</span>
          <Switch
            checked={systemSoundEnabled}
            checkedChildren="On"
            unCheckedChildren="Off"
            onChange={onSystemSoundEnabledChange}
          />
        </div>

        <div className="aicc-modal-footer aicc-agent-settings__footer">
          <AppButton type="primary" onClick={onClose}>
            Done
          </AppButton>
        </div>
      </div>
    </BaseModal>
  )
}
