import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Alert, InputNumber, Select } from 'antd'
import { useMemo, useState } from 'react'
import { BaseButton, BaseCard, PageContainer } from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { defaultGlobalControlConfiguration } from '../../mock/globalControlConfiguration'
import { useAppStore, useCallManagementStore } from '../../store'
import { formatCallManagementDateTime } from '../../utils/audit'
import type {
  GlobalControlAnswerMode,
  GlobalControlConfiguration,
  GlobalControlSignInStatus,
} from '../../types'

const answerModeOptions: Array<{
  label: string
  value: GlobalControlAnswerMode
}> = [
  { label: 'Auto Answer', value: 'auto' },
  { label: 'Manual Answer', value: 'manual' },
]

const signInStatusOptions: Array<{
  label: string
  value: GlobalControlSignInStatus
}> = [
  { label: 'Ready', value: 'ready' },
  { label: 'Not Ready', value: 'not-ready' },
]

function normalizeNumber(value: number | null, fallback: number, min: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback
  }

  return Math.max(min, value)
}

interface NumberFieldProps {
  disabled?: boolean
  label: string
  min?: number
  required?: boolean
  unit: string
  value: number
  onChange: (value: number) => void
}

function NumberField({
  disabled = false,
  label,
  min = 1,
  onChange,
  required = true,
  unit,
  value,
}: NumberFieldProps) {
  return (
    <label className="global-control-config__field">
      <span>
        {label} {required && <strong>*</strong>}
      </span>
      <div className="global-control-config__number-control">
        <InputNumber
          disabled={disabled}
          min={min}
          value={value}
          onChange={(nextValue) =>
            onChange(normalizeNumber(nextValue, value, min))
          }
        />
        <em>{unit}</em>
      </div>
    </label>
  )
}

interface SelectFieldProps<Value extends string> {
  label: string
  options: Array<{ label: string; value: Value }>
  value: Value
  onChange: (value: Value) => void
}

function SelectField<Value extends string>({
  label,
  onChange,
  options,
  value,
}: SelectFieldProps<Value>) {
  return (
    <label className="global-control-config__field">
      <span>
        {label} <strong>*</strong>
      </span>
      <Select options={options} value={value} onChange={onChange} />
    </label>
  )
}

export function GlobalControlConfigurationPage() {
  const savedConfiguration = useCallManagementStore(
    (state) => state.globalControlConfiguration,
  )
  const updateGlobalControlConfiguration = useCallManagementStore(
    (state) => state.updateGlobalControlConfiguration,
  )
  const resetGlobalControlConfiguration = useCallManagementStore(
    (state) => state.resetGlobalControlConfiguration,
  )
  const syncLiveChat2RetentionLimit = useAppStore(
    (state) => state.syncLiveChat2RetentionLimit,
  )
  const [config, setConfig] = useState<GlobalControlConfiguration>(
    () => ({ ...savedConfiguration }),
  )
  const [savedAt, setSavedAt] = useState(
    formatCallManagementDateTime(new Date()),
  )
  const { notify } = useOperationFeedback()

  const updateConfig = <Key extends keyof GlobalControlConfiguration>(
    key: Key,
    value: GlobalControlConfiguration[Key],
  ) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      [key]: value,
    }))
  }

  const validationErrors = useMemo(() => {
    const errors: string[] = []

    if (!config.answerMode) {
      errors.push('Answer Mode is required.')
    }

    if (config.answerMode === 'auto' && config.autoAnswerSeconds <= 0) {
      errors.push('Answer Delay must be greater than 0 seconds.')
    }

    if (!config.signInDefaultStatus) {
      errors.push('Status after Sign-in is required.')
    }

    if (config.autoCancelAcwSeconds <= 0) {
      errors.push('Auto Cancel ACW Duration must be greater than 0 seconds.')
    }

    if (config.idleAutoLogOutMinutes < 0) {
      errors.push('System Idle Log-out Timeout cannot be less than 0 minutes.')
    }

    if (config.idleAutoLogOutMinutes > 0) {
      if (config.idleWarningMinutes <= 0) {
        errors.push('Auto Log-out Warning Lead Time must be greater than 0 minutes.')
      }

      if (config.idleWarningMinutes >= config.idleAutoLogOutMinutes) {
        errors.push(
          'Auto Log-out Warning Lead Time must be less than System Idle Log-out Timeout.',
        )
      }
    }

    if (config.maxDigitalMediaServices <= 0) {
      errors.push('Max Digital Media Services must be greater than 0.')
    }

    if (config.maxLiveChatEndedSessionRetention <= 0) {
      errors.push('Max Live Chat Ended Session Retention must be greater than 0.')
    }

    return errors
  }, [config])

  const hasValidationErrors = validationErrors.length > 0

  const handleSave = () => {
    if (hasValidationErrors) {
      return
    }

    const nextSavedAt = formatCallManagementDateTime(new Date())
    updateGlobalControlConfiguration(config)
    syncLiveChat2RetentionLimit()
    setSavedAt(nextSavedAt)
    notify(`Global control configuration saved at ${nextSavedAt}.`)
  }

  const handleReset = () => {
    resetGlobalControlConfiguration()
    syncLiveChat2RetentionLimit()
    setConfig({ ...defaultGlobalControlConfiguration })
    const nextSavedAt = formatCallManagementDateTime(new Date())
    setSavedAt(nextSavedAt)
    notify(`Global control configuration reset at ${nextSavedAt}.`)
  }

  return (
    <PageContainer
      extra={
        <div className="global-control-config__header-actions">
          <span>Last saved {savedAt}</span>
          <BaseButton
            icon={<ReloadOutlined />}
            variant="secondary"
            onClick={handleReset}
          >
            Reset to Default
          </BaseButton>
          <BaseButton
            disabled={hasValidationErrors}
            icon={<SaveOutlined />}
            variant="primary"
            onClick={handleSave}
          >
            Save
          </BaseButton>
        </div>
      }
      title="Global Control Configuration"
    >
      <section className="global-control-config">

        {hasValidationErrors && (
          <Alert
            showIcon
            className="global-control-config__notice"
            description={
              <ul>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            }
            message="Please fix the configuration."
            type="warning"
          />
        )}

        <div className="global-control-config__grid">
          <BaseCard compact title="Answer Configuration">
            <div className="global-control-config__row">
              <SelectField
                label="Answer Mode"
                options={answerModeOptions}
                value={config.answerMode}
                onChange={(value) => updateConfig('answerMode', value)}
              />
              {config.answerMode === 'auto' && (
                <NumberField
                  label="Answer Delay"
                  unit="sec"
                  value={config.autoAnswerSeconds}
                  onChange={(value) => updateConfig('autoAnswerSeconds', value)}
                />
              )}
            </div>
          </BaseCard>

          <BaseCard compact title="Sign-in and ACW">
            <div className="global-control-config__row">
              <SelectField
                label="Status after Sign-in"
                options={signInStatusOptions}
                value={config.signInDefaultStatus}
                onChange={(value) =>
                  updateConfig('signInDefaultStatus', value)
                }
              />
              <NumberField
                label="Auto Cancel ACW Duration"
                unit="sec"
                value={config.autoCancelAcwSeconds}
                onChange={(value) => updateConfig('autoCancelAcwSeconds', value)}
              />
            </div>
          </BaseCard>

          <BaseCard compact title="Inactivity Control">
            <div className="global-control-config__row">
              <NumberField
                label="System Idle Log-out Timeout"
                min={0}
                unit="min"
                value={config.idleAutoLogOutMinutes}
                onChange={(value) =>
                  updateConfig('idleAutoLogOutMinutes', value)
                }
              />
              <NumberField
                disabled={config.idleAutoLogOutMinutes === 0}
                label="Auto Log-out Warning Lead Time"
                required={config.idleAutoLogOutMinutes > 0}
                unit="min"
                value={config.idleWarningMinutes}
                onChange={(value) => updateConfig('idleWarningMinutes', value)}
              />
            </div>
          </BaseCard>

          <BaseCard compact title="Digital Media Capacity">
            <div className="global-control-config__row">
              <NumberField
                label="Max Digital Media Services"
                unit="items"
                value={config.maxDigitalMediaServices}
                onChange={(value) =>
                  updateConfig('maxDigitalMediaServices', value)
                }
              />
              <NumberField
                label="Max Live Chat Ended Session Retention"
                unit="items"
                value={config.maxLiveChatEndedSessionRetention}
                onChange={(value) =>
                  updateConfig('maxLiveChatEndedSessionRetention', value)
                }
              />
            </div>
          </BaseCard>
        </div>
      </section>
    </PageContainer>
  )
}
