import { AppButton, BaseModal } from '../../components'

type ToolbarDisplayMode = 'icon' | 'text'

const toolbarDisplayOptions: Array<{
  label: string
  value: ToolbarDisplayMode
}> = [
  { label: 'Icon + Text', value: 'text' },
  { label: 'Icon Only', value: 'icon' },
]

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
      width={420}
      onCancel={onClose}
    >
      <div className="aicc-toolbar-settings">
        <div className="aicc-toolbar-settings__row">
          <span className="aicc-toolbar-settings__label">
            Toolbar display
          </span>
          <div
            aria-label="Toolbar display"
            className="aicc-segmented-control"
            role="group"
          >
            {toolbarDisplayOptions.map((option) => (
              <button
                aria-pressed={option.value === displayMode}
                className={
                  option.value === displayMode
                    ? 'aicc-segmented-control__button aicc-segmented-control__button--active'
                    : 'aicc-segmented-control__button'
                }
                key={option.value}
                type="button"
                onClick={() => onDisplayModeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
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
