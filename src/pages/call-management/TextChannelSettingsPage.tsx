import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SaveOutlined,
  SendOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Alert, Input, InputNumber, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  BaseButton,
  BaseCard,
  BaseTable,
  BaseTabs,
  PageContainer,
  StatusBadge,
} from '../../components'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import {
  defaultTextChannelSettings,
  textChannelAlertRecipients,
  textChannelMessageVariables,
  textChannelMetas,
} from '../../mock/textChannelSettings'
import type {
  TextChannelConfigCode,
  TextChannelMessageTemplates,
  TextChannelQueueAlertConfig,
  TextChannelSettingsConfig,
  TextChannelSettingsStatus,
} from '../../types'
import { formatCallManagementDateTime } from '../../utils/audit'

const { TextArea } = Input

const minuteUnitOptions = [
  {
    label: 'min',
    value: 'minutes',
  },
]

const customerUnitOptions = [
  {
    label: 'customers',
    value: 'customers',
  },
]

const channelMetaByCode = Object.fromEntries(
  textChannelMetas.map((channel) => [channel.code, channel]),
) as Record<TextChannelConfigCode, (typeof textChannelMetas)[number]>

const messageFieldLabels: Record<keyof TextChannelMessageTemplates, string> = {
  agentEndMessage: 'Agent end message',
  agentNoReplyAutoResponseMessage: 'Agent no-reply auto response',
  autoCloseAgentMessage: 'Agent workspace auto-close notice',
  autoCloseCustomerMessage: 'Customer auto-close message',
  firstAccessReminder: 'First access reminder',
  preCloseReminder: 'Pre-close reminder',
  welcomeMessage: 'Welcome message',
}

function normalizePositiveNumber(value: number | null, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback
  }

  return Math.max(1, value)
}

function cloneDefaultConfig(): TextChannelSettingsConfig {
  return {
    customerTimeout: { ...defaultTextChannelSettings.customerTimeout },
    messages: { ...defaultTextChannelSettings.messages },
    queueAlerts: defaultTextChannelSettings.queueAlerts.map((alert) => ({
      ...alert,
    })),
    serviceRules: { ...defaultTextChannelSettings.serviceRules },
  }
}

interface NumberSettingProps {
  description?: string
  label: string
  max?: number
  min?: number
  unitOptions?: Array<{ label: string; value: string }>
  unitValue?: string
  value: number
  onChange: (value: number) => void
}

function NumberSetting({
  description,
  label,
  max,
  min = 1,
  unitOptions = minuteUnitOptions,
  unitValue = 'minutes',
  value,
  onChange,
}: NumberSettingProps) {
  return (
    <label className="text-channel-settings__field">
      <span>{label}</span>
      <div className="text-channel-settings__number-control">
        <InputNumber
          max={max}
          min={min}
          value={value}
          onChange={(nextValue) =>
            onChange(normalizePositiveNumber(nextValue, value))
          }
        />
        <Select
          aria-label={`${label} unit`}
          options={unitOptions}
          value={unitValue}
        />
      </div>
      {description && <em>{description}</em>}
    </label>
  )
}

interface MessageTemplateEditorProps {
  field: keyof TextChannelMessageTemplates
  helper?: string
  maxLength?: number
  value: string
  onChange: (field: keyof TextChannelMessageTemplates, value: string) => void
}

function MessageTemplateEditor({
  field,
  helper,
  maxLength = 500,
  value,
  onChange,
}: MessageTemplateEditorProps) {
  const insertVariable = (variable: string) => {
    const separator = value.endsWith(' ') || value.length === 0 ? '' : ' '
    onChange(field, `${value}${separator}${variable}`)
  }

  return (
    <div className="text-channel-settings__message-field">
      <div className="text-channel-settings__message-head">
        <label htmlFor={`text-channel-${field}`}>
          {messageFieldLabels[field]}
        </label>
        <span>
          {value.length} / {maxLength}
        </span>
      </div>
      {helper && <p>{helper}</p>}
      <TextArea
        id={`text-channel-${field}`}
        maxLength={maxLength}
        rows={3}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
      <div
        aria-label={`${messageFieldLabels[field]} variables`}
        className="text-channel-settings__variables"
      >
        {textChannelMessageVariables.map((variable) => (
          <button
            key={variable}
            type="button"
            onClick={() => insertVariable(variable)}
          >
            {variable}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TextChannelSettingsPage() {
  const [activeTabKey, setActiveTabKey] = useState('service-rules')
  const [config, setConfig] = useState<TextChannelSettingsConfig>(
    cloneDefaultConfig,
  )
  const [savedAt, setSavedAt] = useState(
    formatCallManagementDateTime('2026-06-01 14:30:00'),
  )
  const { notify } = useOperationFeedback()
  const [status, setStatus] = useState<TextChannelSettingsStatus>('Draft')

  const validationErrors = useMemo(() => {
    const errors: string[] = []

    if (config.serviceRules.maxConcurrentCustomersPerAgent < 1) {
      errors.push('Max concurrent customers per agent must be at least 1.')
    }

    if (
      config.serviceRules.agentNoReplyBreachMinutes <=
      config.serviceRules.agentNoReplyWarningMinutes
    ) {
      errors.push('Red SLA reminder must be later than yellow SLA reminder.')
    }

    if (
      config.customerTimeout.preCloseReminderMinutes >=
      config.customerTimeout.autoCloseMinutes
    ) {
      errors.push('Pre-close reminder must be earlier than auto-close timeout.')
    }

    return errors
  }, [config])

  const hasValidationErrors = validationErrors.length > 0

  const updateServiceRule = (
    key: keyof TextChannelSettingsConfig['serviceRules'],
    value: number,
  ) => {
    setConfig((current) => ({
      ...current,
      serviceRules: {
        ...current.serviceRules,
        [key]: value,
      },
    }))
    setStatus('Draft')
  }

  const updateCustomerTimeout = (
    key: keyof TextChannelSettingsConfig['customerTimeout'],
    value: number,
  ) => {
    setConfig((current) => ({
      ...current,
      customerTimeout: {
        ...current.customerTimeout,
        [key]: value,
      },
    }))
    setStatus('Draft')
  }

  const updateMessage = (
    field: keyof TextChannelMessageTemplates,
    value: string,
  ) => {
    setConfig((current) => ({
      ...current,
      messages: {
        ...current.messages,
        [field]: value,
      },
    }))
    setStatus('Draft')
  }

  const updateQueueAlert = (
    channel: TextChannelConfigCode,
    patch: Partial<TextChannelQueueAlertConfig>,
  ) => {
    setConfig((current) => ({
      ...current,
      queueAlerts: current.queueAlerts.map((alert) =>
        alert.channel === channel ? { ...alert, ...patch } : alert,
      ),
    }))
    setStatus('Draft')
  }

  const applySave = (nextStatus: TextChannelSettingsStatus) => {
    const nextSavedAt = formatCallManagementDateTime(new Date())
    setSavedAt(nextSavedAt)
    notify(
      nextStatus === 'Published'
        ? 'Configuration published for demo preview.'
        : 'Draft saved locally for this demo session.',
    )
    setStatus(nextStatus)

  }

  const queueAlertColumns: ColumnsType<TextChannelQueueAlertConfig> = [
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 180,
      render: (channel: TextChannelConfigCode) => {
        const meta = channelMetaByCode[channel]

        return (
          <div className="text-channel-settings__channel-cell">
            <span
              className={`text-channel-settings__channel-icon text-channel-settings__channel-icon--${meta.tone}`}
            >
              {meta.label.slice(0, 1)}
            </span>
            <strong>{meta.label}</strong>
          </div>
        )
      },
    },
    {
      dataIndex: 'threshold',
      title: 'Queue Threshold',
      width: 180,
      render: (threshold: number, record) => (
        <InputNumber
          min={1}
          value={threshold}
          onChange={(nextValue) =>
            updateQueueAlert(record.channel, {
              threshold: normalizePositiveNumber(nextValue, threshold),
            })
          }
        />
      ),
    },
    {
      dataIndex: 'recipients',
      title: 'Recipients',
      render: (recipients: string, record) => (
        <Select
          options={textChannelAlertRecipients.map((recipient) => ({
            label: recipient,
            value: recipient,
          }))}
          value={recipients}
          onChange={(nextRecipients) =>
            updateQueueAlert(record.channel, { recipients: nextRecipients })
          }
        />
      ),
    },
    {
      dataIndex: 'enabled',
      title: 'Status',
      width: 120,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          checkedChildren="On"
          unCheckedChildren="Off"
          onChange={(nextEnabled) =>
            updateQueueAlert(record.channel, { enabled: nextEnabled })
          }
        />
      ),
    },
  ]

  const serviceRulesNode = (
    <div className="text-channel-settings__grid text-channel-settings__grid--service">
      <BaseCard compact title="Service Capacity">
        <div className="text-channel-settings__form-grid">
          <NumberSetting
            description="Maximum number of text-channel conversations one agent can handle at the same time."
            label="Max concurrent customers per agent"
            unitOptions={customerUnitOptions}
            unitValue="customers"
            value={config.serviceRules.maxConcurrentCustomersPerAgent}
            onChange={(value) =>
              updateServiceRule('maxConcurrentCustomersPerAgent', value)
            }
          />
          <NumberSetting
            description="Time after which the system sends an automatic message if the agent does not reply."
            label="Agent no-reply auto response"
            value={config.serviceRules.agentNoReplyAutoResponseMinutes}
            onChange={(value) =>
              updateServiceRule('agentNoReplyAutoResponseMinutes', value)
            }
          />
        </div>
        <MessageTemplateEditor
          field="agentNoReplyAutoResponseMessage"
          helper="Sent to the customer when the agent has not replied within the configured time."
          value={config.messages.agentNoReplyAutoResponseMessage}
          onChange={updateMessage}
        />
      </BaseCard>

      <BaseCard compact title="Webchat Recall">
        <div className="text-channel-settings__scoped-rule">
          <StatusBadge label="Webchat only" size="small" status="selected" />
          <NumberSetting
            description="Time limit for agents to recall an unsent or recently sent Webchat message."
            label="Recall time limit"
            value={config.serviceRules.webchatRecallLimitMinutes}
            onChange={(value) =>
              updateServiceRule('webchatRecallLimitMinutes', value)
            }
          />
        </div>
      </BaseCard>

      <BaseCard compact title="Agent No-reply SLA">
        <div className="text-channel-settings__sla-rules">
          <div className="text-channel-settings__sla-row">
            <span className="text-channel-settings__sla-dot text-channel-settings__sla-dot--warning" />
            <NumberSetting
              description="Conversation timer turns yellow at service level warning."
              label="Yellow reminder"
              value={config.serviceRules.agentNoReplyWarningMinutes}
              onChange={(value) =>
                updateServiceRule('agentNoReplyWarningMinutes', value)
              }
            />
          </div>
          <div className="text-channel-settings__sla-row">
            <span className="text-channel-settings__sla-dot text-channel-settings__sla-dot--breach" />
            <NumberSetting
              description="Conversation timer turns red after breach threshold."
              label="Red reminder"
              value={config.serviceRules.agentNoReplyBreachMinutes}
              onChange={(value) =>
                updateServiceRule('agentNoReplyBreachMinutes', value)
              }
            />
          </div>
        </div>
      </BaseCard>
    </div>
  )

  const timeoutNode = (
    <div className="text-channel-settings__grid text-channel-settings__grid--timeout">
      <BaseCard compact title="Customer Access Messages">
        <div className="text-channel-settings__message-stack">
          <MessageTemplateEditor
            field="welcomeMessage"
            helper="Sent after the customer enters a text-channel conversation."
            value={config.messages.welcomeMessage}
            onChange={updateMessage}
          />
          <MessageTemplateEditor
            field="firstAccessReminder"
            helper="Sent when the customer first accesses the service to explain timeout rules."
            value={config.messages.firstAccessReminder}
            onChange={updateMessage}
          />
        </div>
      </BaseCard>

      <BaseCard compact title="Customer No-reply Timeout">
        <div className="text-channel-settings__timeout-layout">
          <div className="text-channel-settings__timeline">
            <div>
              <span>1</span>
              <strong>First access reminder</strong>
              <p>Explain the {config.customerTimeout.autoCloseMinutes} min auto-close rule.</p>
            </div>
            <div>
              <span>2</span>
              <strong>Pre-close reminder</strong>
              <p>
                Send {config.customerTimeout.preCloseReminderMinutes} min before
                auto-close.
              </p>
            </div>
            <div>
              <span>3</span>
              <strong>Auto-close conversation</strong>
              <p>Close after {config.customerTimeout.autoCloseMinutes} min without customer reply.</p>
            </div>
          </div>

          <div className="text-channel-settings__timeout-form">
            <div className="text-channel-settings__form-grid">
              <NumberSetting
                description="How long to wait before closing a conversation with no customer reply."
                label="Interaction close timeout"
                value={config.customerTimeout.autoCloseMinutes}
                onChange={(value) =>
                  updateCustomerTimeout('autoCloseMinutes', value)
                }
              />
              <NumberSetting
                description="How long before auto-close to send the final reminder."
                label="Interaction close reminder"
                value={config.customerTimeout.preCloseReminderMinutes}
                onChange={(value) =>
                  updateCustomerTimeout('preCloseReminderMinutes', value)
                }
              />
            </div>
            <MessageTemplateEditor
              field="preCloseReminder"
              value={config.messages.preCloseReminder}
              onChange={updateMessage}
            />
            <MessageTemplateEditor
              field="autoCloseCustomerMessage"
              value={config.messages.autoCloseCustomerMessage}
              onChange={updateMessage}
            />
            <MessageTemplateEditor
              field="autoCloseAgentMessage"
              helper="Displayed in the agent workspace when the system closes the conversation."
              value={config.messages.autoCloseAgentMessage}
              onChange={updateMessage}
            />
          </div>
        </div>
      </BaseCard>

      <BaseCard compact title="Agent End Message">
        <MessageTemplateEditor
          field="agentEndMessage"
          helper="Sent to the customer when the agent actively ends the conversation."
          value={config.messages.agentEndMessage}
          onChange={updateMessage}
        />
      </BaseCard>
    </div>
  )

  const alertsNode = (
    <div className="text-channel-settings__grid">
      <BaseCard
        compact
        headerExtra={
          <StatusBadge
            dot
            label="Monitoring enabled"
            size="small"
            status="success"
          />
        }
        title="Channel Queue Alerts"
      >
        <p className="text-channel-settings__card-intro">
          Notify monitoring users when the queue size of a text channel exceeds
          the configured threshold.
        </p>
        <BaseTable<TextChannelQueueAlertConfig>
          columns={queueAlertColumns}
          dataSource={config.queueAlerts}
          pagination={false}
          rowKey="channel"
          size="small"
        />
      </BaseCard>

      <div className="text-channel-settings__alert-summary">
        {config.queueAlerts.map((alert) => {
          const meta = channelMetaByCode[alert.channel]

          return (
            <BaseCard
              key={alert.channel}
              compact
              title={`${meta.label} Alert Rule`}
            >
              <div className="text-channel-settings__summary-row">
                <BellOutlined />
                <span>Queue threshold</span>
                <strong>{alert.threshold} customers</strong>
              </div>
              <div className="text-channel-settings__summary-row">
                <CheckCircleOutlined />
                <span>Recipients</span>
                <strong>{alert.recipients}</strong>
              </div>
            </BaseCard>
          )
        })}
      </div>
    </div>
  )

  return (
    <PageContainer
      description="Configure service capacity, text-channel message rules, customer inactivity timeout, and queue monitoring alerts."
      eyebrow="Call Management"
      extra={
        <div className="text-channel-settings__header-actions">
          <StatusBadge
            label={status}
            size="small"
            status={status === 'Published' ? 'success' : 'warning'}
          />
          <span>Last saved {savedAt}</span>
          <BaseButton
            disabled={hasValidationErrors}
            icon={<SaveOutlined />}
            variant="secondary"
            onClick={() => applySave('Draft')}
          >
            Save Draft
          </BaseButton>
          <BaseButton
            disabled={hasValidationErrors}
            icon={<SendOutlined />}
            variant="primary"
            onClick={() => applySave('Published')}
          >
            Publish
          </BaseButton>
        </div>
      }
      title="Text Channel Settings"
    >
      <section className="text-channel-settings">

        {hasValidationErrors && (
          <Alert
            showIcon
            className="text-channel-settings__notice"
            message="Please resolve configuration issues before saving."
            type="warning"
            description={
              <ul>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            }
          />
        )}

        <div className="text-channel-settings__overview">
          <div>
            <MessageOutlined />
            <span>Max active customers</span>
            <strong>
              {config.serviceRules.maxConcurrentCustomersPerAgent} per agent
            </strong>
          </div>
          <div>
            <ClockCircleOutlined />
            <span>Customer auto-close</span>
            <strong>{config.customerTimeout.autoCloseMinutes} min</strong>
          </div>
          <div>
            <WarningOutlined />
            <span>Queue alert threshold</span>
            <strong>{config.queueAlerts[0]?.threshold ?? 10} default</strong>
          </div>
        </div>

        <BaseTabs
          activeKey={activeTabKey}
          className="text-channel-settings__tabs"
          items={[
            {
              children: serviceRulesNode,
              key: 'service-rules',
              label: 'Service Rules',
            },
            {
              children: timeoutNode,
              key: 'timeout-messages',
              label: 'Customer Timeout & Messages',
            },
            {
              children: alertsNode,
              key: 'channel-alerts',
              label: 'Channel Queue Alerts',
            },
          ]}
          variant="toolbar"
          onChange={setActiveTabKey}
        />
      </section>
    </PageContainer>
  )
}
