import {
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { Checkbox, InputNumber, Select, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  BaseButton,
  BaseCard,
  StatusBadge,
} from '../../components'
import { verificationBusinessTypes } from '../../mock/inbound'
import { useAppStore } from '../../store'
import type {
  VerificationBusinessType,
  VerificationChannelType,
  VerificationQuestion,
  VerificationQuestionGroup,
  VerificationRule,
  VerificationRuleStatus,
} from '../../types'

type RuleModalMode = 'view' | 'edit'

const channelTypeLabels: Record<VerificationChannelType, string> = {
  'bankapp-registered': 'BankApp Registered',
  'bankapp-unregistered': 'BankApp Unregistered',
  phone: 'PSTN / Phone',
  video: 'Video',
  webchat: 'Webchat',
  whatsapp: 'WhatsApp',
}

const configurableChannelTypes: VerificationChannelType[] = [
  'phone',
  'bankapp-registered',
  'whatsapp',
  'webchat',
  'video',
]

const groupLabels: Record<VerificationQuestionGroup, string> = {
  alternative: 'Alternative',
  dynamic: 'Dynamic',
  layering: 'Layering',
  mandatory: 'Mandatory',
  special: 'Special',
  static: 'Static',
}

const groupDisplayOrder: VerificationQuestionGroup[] = [
  'mandatory',
  'dynamic',
  'static',
  'alternative',
  'layering',
  'special',
]

const businessTypeLabels = Object.fromEntries(
  verificationBusinessTypes.map((item) => [item.code, item.label]),
) as Record<VerificationBusinessType, string>

function cloneRule(rule: VerificationRule): VerificationRule {
  return {
    ...rule,
    notes: [...rule.notes],
    questions: rule.questions.map((question) => ({ ...question })),
    requiredGroups: { ...rule.requiredGroups },
  }
}

function normalizeNumber(value: number | null, fallback: number) {
  return typeof value === 'number' && !Number.isNaN(value)
    ? Math.max(0, Math.round(value))
    : fallback
}

function getRequiredRuleText(rule: VerificationRule) {
  const groupText = groupDisplayOrder
    .map((group) => {
      const count = rule.requiredGroups[group] ?? 0
      return count > 0 ? `${count} ${groupLabels[group]}` : null
    })
    .filter(Boolean)
    .join(', ')

  return groupText
    ? `Need ${rule.correctRequired}: ${groupText}`
    : `Need ${rule.correctRequired}`
}

function getQuestionSetText(rule: VerificationRule) {
  const counts = rule.questions.reduce(
    (current, question) => ({
      ...current,
      [question.group]: (current[question.group] ?? 0) + 1,
    }),
    {} as Partial<Record<VerificationQuestionGroup, number>>,
  )

  return groupDisplayOrder
    .map((group) => {
      const count = counts[group] ?? 0
      return count > 0 ? `${count} ${groupLabels[group]}` : null
    })
    .filter(Boolean)
    .join(' | ')
}

function buildRuleSummary(rule: VerificationRule) {
  const groupText = groupDisplayOrder
    .map((group) => {
      const count = rule.requiredGroups[group] ?? 0
      return count > 0 ? `${count} ${groupLabels[group].toLowerCase()}` : null
    })
    .filter(Boolean)
    .join(', ')
  const wrongText =
    rule.maxWrongAttempts === null
      ? 'No wrong limit.'
      : `Max wrong: ${rule.maxWrongAttempts}.`

  return groupText
    ? `${rule.correctRequired} correct answers: ${groupText}. ${wrongText}`
    : `${rule.correctRequired} correct answers. ${wrongText}`
}

function getQuestionCatalog(
  rules: VerificationRule[],
  businessType: VerificationBusinessType,
) {
  const questionById = new Map<string, VerificationQuestion>()

  rules
    .filter((rule) => rule.businessType === businessType)
    .forEach((rule) => {
      rule.questions.forEach((question) => {
        if (!questionById.has(question.id)) {
          questionById.set(question.id, question)
        }
      })
    })

  return Array.from(questionById.values()).sort(
    (left, right) => left.sequence - right.sequence,
  )
}

export function VerificationRulesPage() {
  const verificationRules = useAppStore((state) => state.verificationRules)
  const updateVerificationRule = useAppStore(
    (state) => state.updateVerificationRule,
  )
  const resetVerificationRules = useAppStore(
    (state) => state.resetVerificationRules,
  )
  const [modalMode, setModalMode] = useState<RuleModalMode>('view')
  const [draftRule, setDraftRule] = useState<VerificationRule | null>(null)

  const businessOptions = verificationBusinessTypes
    .filter((item) => item.enabled)
    .map((item) => ({
      label: item.label,
      value: item.code,
    }))
  const channelOptions = configurableChannelTypes.map((channelType) => ({
    label: channelTypeLabels[channelType],
    value: channelType,
  }))
  const isViewMode = modalMode === 'view'
  const questionCatalog = useMemo(
    () =>
      draftRule
        ? getQuestionCatalog(verificationRules, draftRule.businessType)
        : [],
    [draftRule, verificationRules],
  )

  const columns: ColumnsType<VerificationRule> = [
    {
      dataIndex: 'channelType',
      key: 'channelType',
      title: 'Channel Type',
      width: 160,
      render: (value: VerificationChannelType) => channelTypeLabels[value],
    },
    {
      dataIndex: 'businessType',
      key: 'businessType',
      title: 'Business Type',
      width: 140,
      render: (value: VerificationBusinessType) => businessTypeLabels[value],
    },
    {
      key: 'requiredRule',
      title: 'Required Rule',
      width: 260,
      render: (_, rule) => getRequiredRuleText(rule),
    },
    {
      key: 'questionSet',
      title: 'Question Set',
      render: (_, rule) => getQuestionSetText(rule),
    },
    {
      dataIndex: 'maxWrongAttempts',
      key: 'maxWrongAttempts',
      title: 'Max Wrong',
      width: 100,
      render: (value: number | null) => value ?? 'No limit',
    },
    {
      dataIndex: 'needLayering',
      key: 'needLayering',
      title: 'Layering',
      width: 100,
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
      width: 110,
      render: (value: VerificationRuleStatus) => (
        <StatusBadge
          label={value === 'enabled' ? 'Enabled' : 'Disabled'}
          size="small"
          status={value === 'enabled' ? 'success' : 'disabled'}
        />
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 96,
      render: (_, rule) => (
        <div className="verification-rules-page__row-actions">
          <button
            aria-label={`View ${rule.id}`}
            type="button"
            onClick={() => {
              setModalMode('view')
              setDraftRule(cloneRule(rule))
            }}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${rule.id}`}
            type="button"
            onClick={() => {
              setModalMode('edit')
              setDraftRule(cloneRule(rule))
            }}
          >
            <EditOutlined />
          </button>
        </div>
      ),
    },
  ]

  const updateDraftRule = (nextRule: VerificationRule) => {
    setDraftRule({
      ...nextRule,
      summary: buildRuleSummary(nextRule),
    })
  }

  const updateRequiredGroup = (
    group: VerificationQuestionGroup,
    value: number | null,
  ) => {
    if (!draftRule) {
      return
    }

    updateDraftRule({
      ...draftRule,
      requiredGroups: {
        ...draftRule.requiredGroups,
        [group]: normalizeNumber(value, draftRule.requiredGroups[group] ?? 0),
      },
    })
  }

  const handleBusinessTypeChange = (businessType: VerificationBusinessType) => {
    if (!draftRule) {
      return
    }

    const nextQuestions = getQuestionCatalog(verificationRules, businessType)
    updateDraftRule({
      ...draftRule,
      businessType,
      questions: nextQuestions,
    })
  }

  const handleQuestionToggle = (
    question: VerificationQuestion,
    checked: boolean,
  ) => {
    if (!draftRule) {
      return
    }

    const selectedIds = new Set(draftRule.questions.map((item) => item.id))

    if (checked) {
      selectedIds.add(question.id)
    } else {
      selectedIds.delete(question.id)
    }

    updateDraftRule({
      ...draftRule,
      questions: questionCatalog.filter((item) => selectedIds.has(item.id)),
    })
  }

  const handleSave = () => {
    if (!draftRule) {
      return
    }

    updateVerificationRule({
      ...draftRule,
      summary: buildRuleSummary(draftRule),
    })
    setDraftRule(null)
  }

  return (
    <AdminPage
      extra={
        <BaseButton icon={<ReloadOutlined />} onClick={resetVerificationRules}>
          Reset Demo Rules
        </BaseButton>
      }
      title="Verification Rules"
    >
      <div className="verification-rules-page">
        <BaseCard compact>
          <AdminTable<VerificationRule>
            columns={columns}
            dataSource={verificationRules}
            pagination={false}
            rowKey="id"
          />
        </BaseCard>
      </div>

      <AdminModal
        centered
        className="verification-rule-config-modal"
        open={Boolean(draftRule)}
        title={
          isViewMode ? 'View Verification Rule' : 'Edit Verification Rule'
        }
        width={920}
        onCancel={() => setDraftRule(null)}
      >
        {draftRule && (
          <div className="verification-rule-config-modal__content">
            <div className="verification-rule-config-modal__form">
              <label>
                <span>Channel Type</span>
                <Select
                  disabled={isViewMode}
                  options={channelOptions}
                  value={draftRule.channelType}
                  onChange={(value) =>
                    updateDraftRule({
                      ...draftRule,
                      channelType: value as VerificationChannelType,
                    })
                  }
                />
              </label>
              <label>
                <span>Business Type</span>
                <Select
                  disabled={isViewMode}
                  options={businessOptions}
                  value={draftRule.businessType}
                  onChange={(value) =>
                    handleBusinessTypeChange(value as VerificationBusinessType)
                  }
                />
              </label>
              <label>
                <span>Status</span>
                <Select
                  disabled={isViewMode}
                  options={[
                    { label: 'Enabled', value: 'enabled' },
                    { label: 'Disabled', value: 'disabled' },
                  ]}
                  value={draftRule.status}
                  onChange={(value) =>
                    updateDraftRule({
                      ...draftRule,
                      status: value as VerificationRuleStatus,
                    })
                  }
                />
              </label>
              <label>
                <span>Correct Required</span>
                <InputNumber
                  disabled={isViewMode}
                  min={1}
                  value={draftRule.correctRequired}
                  onChange={(value) =>
                    updateDraftRule({
                      ...draftRule,
                      correctRequired: normalizeNumber(
                        value,
                        draftRule.correctRequired,
                      ),
                    })
                  }
                />
              </label>
              <label>
                <span>Max Wrong Attempts</span>
                <InputNumber
                  disabled={isViewMode}
                  min={1}
                  value={draftRule.maxWrongAttempts ?? undefined}
                  onChange={(value) =>
                    updateDraftRule({
                      ...draftRule,
                      maxWrongAttempts:
                        typeof value === 'number' ? normalizeNumber(value, 3) : null,
                    })
                  }
                />
              </label>
              <label className="verification-rule-config-modal__switch-field">
                <span>Need Layering</span>
                <span>
                  <Switch
                    checked={draftRule.needLayering}
                    disabled={isViewMode}
                    size="small"
                    onChange={(checked) =>
                      updateDraftRule({
                        ...draftRule,
                        needLayering: checked,
                      })
                    }
                  />
                  <em>{draftRule.needLayering ? 'Yes' : 'No'}</em>
                </span>
              </label>
            </div>

            <BaseCard compact title="Required Counts">
              <div className="verification-rule-config-modal__groups">
                {groupDisplayOrder.map((group) => (
                  <label key={group}>
                    <span>{groupLabels[group]}</span>
                    <InputNumber
                      disabled={isViewMode}
                      min={0}
                      value={draftRule.requiredGroups[group] ?? 0}
                      onChange={(value) => updateRequiredGroup(group, value)}
                    />
                  </label>
                ))}
              </div>
            </BaseCard>

            <BaseCard compact title="Question Set">
              <div className="verification-rule-config-modal__questions">
                {questionCatalog.map((question) => (
                  <label key={question.id}>
                    <Checkbox
                      checked={draftRule.questions.some(
                        (item) => item.id === question.id,
                      )}
                      disabled={isViewMode}
                      onChange={(event) =>
                        handleQuestionToggle(question, event.target.checked)
                      }
                    />
                    <span>{String(question.sequence).padStart(2, '0')}</span>
                    <strong>{groupLabels[question.group]}</strong>
                    <em>{question.question}</em>
                  </label>
                ))}
              </div>
            </BaseCard>

            <AdminModalFooter className="verification-rule-config-modal__footer">
              <BaseButton onClick={() => setDraftRule(null)}>
                {isViewMode ? 'Close' : 'Cancel'}
              </BaseButton>
              {!isViewMode && (
                <BaseButton variant="primary" onClick={handleSave}>
                  Save
                </BaseButton>
              )}
            </AdminModalFooter>
          </div>
        )}
      </AdminModal>
    </AdminPage>
  )
}
