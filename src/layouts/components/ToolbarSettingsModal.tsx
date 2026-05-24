import { Segmented } from 'antd'
import { AppButton, BaseModal } from '../../components'

type ToolbarDisplayMode = 'icon' | 'text'

interface ToolbarSettingsModalProps {
  displayMode: ToolbarDisplayMode
  open: boolean
  onClose: () => void
  onConfirm: () => void
  onDisplayModeChange: (displayMode: ToolbarDisplayMode) => void
}

export function ToolbarSettingsModal({
  displayMode,
  open,
  onClose,
  onConfirm,
  onDisplayModeChange,
}: ToolbarSettingsModalProps) {
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
        <div className="aicc-toolbar-settings__section">
          <div>
            <strong>Toolbar display</strong>
            <span>Choose how call control buttons are displayed.</span>
          </div>
          <Segmented
            options={[
              { label: 'Icon + Text', value: 'text' },
              { label: 'Icon Only', value: 'icon' },
            ]}
            value={displayMode}
            onChange={(value) =>
              onDisplayModeChange(value as ToolbarDisplayMode)
            }
          />
        </div>
        <div className="aicc-modal-footer aicc-toolbar-settings__footer">
          <AppButton onClick={onClose}>Cancel</AppButton>
          <AppButton type="primary" onClick={onConfirm}>
            Confirm
          </AppButton>
        </div>
      </div>
    </BaseModal>
  )
}
