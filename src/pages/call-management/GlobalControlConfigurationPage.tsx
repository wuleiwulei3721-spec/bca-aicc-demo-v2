import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { Alert, InputNumber, Select } from 'antd'
import { useMemo, useState } from 'react'
import { BaseButton, BaseCard, PageContainer } from '../../components'
import { defaultGlobalControlConfiguration } from '../../mock/globalControlConfiguration'
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

function cloneDefaultConfig(): GlobalControlConfiguration {
  return { ...defaultGlobalControlConfiguration }
}

function formatSavedTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

function normalizePositiveNumber(value: number | null, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback
  }

  return Math.max(1, value)
}

interface NumberFieldProps {
  label: string
  unit: string
  value: number
  onChange: (value: number) => void
}

function NumberField({ label, onChange, unit, value }: NumberFieldProps) {
  return (
    <label className="global-control-config__field">
      <span>
        {label} <strong>*</strong>
      </span>
      <div className="global-control-config__number-control">
        <InputNumber
          min={1}
          value={value}
          onChange={(nextValue) =>
            onChange(normalizePositiveNumber(nextValue, value))
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
  const [config, setConfig] = useState<GlobalControlConfiguration>(
    cloneDefaultConfig,
  )
  const [savedAt, setSavedAt] = useState(formatSavedTime(new Date()))
  const [savedNotice, setSavedNotice] = useState('')

  const updateConfig = <Key extends keyof GlobalControlConfiguration>(
    key: Key,
    value: GlobalControlConfiguration[Key],
  ) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      [key]: value,
    }))
    setSavedNotice('')
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

    if (config.idleAutoSignOutMinutes <= 0) {
      errors.push('Auto Sign-out Duration must be greater than 0 minutes.')
    }

    if (config.idleWarningMinutes <= 0) {
      errors.push('Early Warning Duration must be greater than 0 minutes.')
    }

    if (config.idleWarningMinutes >= config.idleAutoSignOutMinutes) {
      errors.push('Early Warning Duration must be less than Auto Sign-out Duration.')
    }

    if (config.maxTextMediaServices <= 0) {
      errors.push('Max Text Media Services must be greater than 0.')
    }

    return errors
  }, [config])

  const hasValidationErrors = validationErrors.length > 0

  const handleSave = () => {
    if (hasValidationErrors) {
      return
    }

    const nextSavedAt = formatSavedTime(new Date())
    setSavedAt(nextSavedAt)
    setSavedNotice(`Global control configuration saved at ${nextSavedAt}.`)
  }

  const handleReset = () => {
    setConfig(cloneDefaultConfig())
    setSavedNotice('')
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
        {savedNotice && (
          <Alert
            showIcon
            className="global-control-config__notice"
            message={savedNotice}
            type="success"
          />
        )}

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
                label="Auto Sign-out Duration"
                unit="min"
                value={config.idleAutoSignOutMinutes}
                onChange={(value) =>
                  updateConfig('idleAutoSignOutMinutes', value)
                }
              />
              <NumberField
                label="Early Warning Duration"
                unit="min"
                value={config.idleWarningMinutes}
                onChange={(value) => updateConfig('idleWarningMinutes', value)}
              />
            </div>
          </BaseCard>

          <BaseCard compact title="Text Media Capacity">
            <div className="global-control-config__row global-control-config__row--single">
              <NumberField
                label="Max Text Media Services"
                unit="items"
                value={config.maxTextMediaServices}
                onChange={(value) =>
                  updateConfig('maxTextMediaServices', value)
                }
              />
            </div>
          </BaseCard>
        </div>
      </section>
    </PageContainer>
  )
}
