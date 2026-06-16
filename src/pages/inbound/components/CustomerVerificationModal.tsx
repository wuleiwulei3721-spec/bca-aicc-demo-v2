import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Popover, Select, Space, Tooltip } from 'antd'
import { AppButton } from '../../../components'
import type { BankAppPinVerificationStatus } from '../../../store'
import type {
  VerificationBusinessType,
  VerificationBusinessTypeOption,
  VerificationChannelType,
  VerificationQuestion,
  VerificationQuestionGroup,
  VerificationRule,
  VerificationStatus,
} from '../../../types'

export type QuestionStepStatus = 'correct' | 'wrong' | 'skipped'

interface CustomerVerificationModalProps {
  activeQuestionIndex: number
  businessTypes: VerificationBusinessTypeOption[]
  channelType: VerificationChannelType
  pinStatus: BankAppPinVerificationStatus
  questionStatuses: Record<string, QuestionStepStatus>
  rule: VerificationRule | null
  selectedBusinessType: VerificationBusinessType
  onBusinessTypeChange: (businessType: VerificationBusinessType) => void
  onFinish: (status: VerificationStatus) => void
  onQuestionAction: (
    question: VerificationQuestion,
    questionIndex: number,
    status: QuestionStepStatus,
  ) => void
  onReset: () => void
  onSendPinVerification: () => void
}

const channelTypeLabels: Record<VerificationChannelType, string> = {
  'bankapp-registered': 'BankApp Registered',
  'bankapp-unregistered': 'BankApp Unregistered',
  phone: 'PSTN / Phone',
  video: 'Video',
  webchat: 'Webchat',
  whatsapp: 'WhatsApp',
}

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

function getCounts(
  rule: VerificationRule | null,
  questionStatuses: Record<string, QuestionStepStatus>,
) {
  const correctByGroup = {} as Record<VerificationQuestionGroup, number>
  let correctCount = 0
  let skippedCount = 0
  let wrongCount = 0

  rule?.questions.forEach((question) => {
    const status = questionStatuses[question.id]

    if (status === 'correct') {
      correctCount += 1
      correctByGroup[question.group] =
        (correctByGroup[question.group] ?? 0) + 1
    }

    if (status === 'wrong') {
      wrongCount += 1
    }

    if (status === 'skipped') {
      skippedCount += 1
    }
  })

  return {
    correctByGroup,
    correctCount,
    skippedCount,
    wrongCount,
  }
}

function evaluateRule(
  rule: VerificationRule | null,
  questionStatuses: Record<string, QuestionStepStatus>,
) {
  const counts = getCounts(rule, questionStatuses)

  if (!rule) {
    return {
      ...counts,
      failed: false,
      passed: false,
      remainingRequirements: ['No verification rule configured.'],
    }
  }

  const remainingRequirements: string[] = []

  groupDisplayOrder.forEach((group) => {
    const requiredCount = rule.requiredGroups[group]

    if (!requiredCount) {
      return
    }

    const answeredCount = counts.correctByGroup[group] ?? 0

    if (answeredCount < requiredCount) {
      remainingRequirements.push(
        `${groupLabels[group]} ${answeredCount}/${requiredCount}`,
      )
    }
  })

  if (counts.correctCount < rule.correctRequired) {
    remainingRequirements.push(
      `Total correct ${counts.correctCount}/${rule.correctRequired}`,
    )
  }

  const failed =
    rule.maxWrongAttempts !== null &&
    counts.wrongCount >= rule.maxWrongAttempts

  return {
    ...counts,
    failed,
    passed: !failed && remainingRequirements.length === 0,
    remainingRequirements,
  }
}

function getRequirementItems(
  rule: VerificationRule,
  evaluation: ReturnType<typeof evaluateRule>,
) {
  return groupDisplayOrder
    .map((group) => {
      const requiredCount = rule.requiredGroups[group] ?? 0

      if (requiredCount <= 0) {
        return null
      }

      const currentCount = evaluation.correctByGroup[group] ?? 0
      const tone =
        currentCount >= requiredCount
          ? 'met'
          : currentCount > 0
            ? 'progress'
            : 'empty'

      return {
        currentCount,
        group,
        label: groupLabels[group],
        requiredCount,
        tone,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
}

function getActionClass(action: QuestionStepStatus, selected: boolean) {
  const actionName = action === 'skipped' ? 'skip' : action

  return [
    'inbound-verify-action',
    `inbound-verify-action--${actionName}`,
    selected ? 'inbound-verify-action--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function CustomerVerificationModal({
  activeQuestionIndex,
  businessTypes,
  channelType,
  pinStatus,
  questionStatuses,
  rule,
  selectedBusinessType,
  onBusinessTypeChange,
  onFinish,
  onQuestionAction,
  onReset,
  onSendPinVerification,
}: CustomerVerificationModalProps) {
  const evaluation = evaluateRule(rule, questionStatuses)
  const isBankAppPinPending = channelType === 'bankapp-unregistered'
  const isQuestionActionDisabled = !rule || isBankAppPinPending
  const wrongLimit = rule?.maxWrongAttempts ?? null
  const enabledBusinessTypes = businessTypes.filter((item) => item.enabled)
  const workflowStatus = evaluation.failed
    ? 'Failed'
    : evaluation.passed
      ? 'Passed'
      : isBankAppPinPending
        ? 'PIN Required'
        : 'In Progress'
  const statusTone = evaluation.failed
    ? 'failed'
    : evaluation.passed
      ? 'passed'
      : 'active'
  const ruleNotes = rule?.notes ?? []
  const requirementItems = rule ? getRequirementItems(rule, evaluation) : []
  const wrongText = rule
    ? wrongLimit === null
      ? `Wrong ${evaluation.wrongCount}`
      : `Wrong ${evaluation.wrongCount}/${wrongLimit}`
    : ''
  const emptyRuleText = isBankAppPinPending
    ? 'Complete BankApp PIN to load registered verification rules.'
    : 'No verification rule configured for this combination.'

  return (
    <div className="inbound-verification-workflow">
      <div className="inbound-verification-workflow__toolbar">
        <div className="inbound-verification-workflow__meta">
          <span>Channel Type</span>
          <strong>{channelTypeLabels[channelType]}</strong>
        </div>
        <label className="inbound-verification-workflow__business">
          <span>Business Type</span>
          <Select
            className="inbound-verification-workflow__business-select"
            popupMatchSelectWidth={false}
            size="small"
            value={selectedBusinessType}
            options={enabledBusinessTypes.map((item) => ({
              label: item.label,
              value: item.code,
            }))}
            onChange={(value) =>
              onBusinessTypeChange(value as VerificationBusinessType)
            }
          />
        </label>
        <strong
          className={`inbound-verification-workflow__status inbound-verification-workflow__status--${statusTone}`}
        >
          {workflowStatus}
        </strong>
      </div>

      {isBankAppPinPending && (
        <div className="inbound-verification-pin">
          <div>
            <strong>PIN required</strong>
            <span>Send a secure 4-digit PIN page to BANK App.</span>
          </div>
          <AppButton
            size="small"
            type={pinStatus === 'sent' ? undefined : 'primary'}
            onClick={onSendPinVerification}
          >
            {pinStatus === 'sent' ? 'PIN Sent' : 'Send PIN Verification'}
          </AppButton>
        </div>
      )}

      <div className="inbound-verification-workflow__rulebar">
        <div className="inbound-verification-workflow__rulecopy">
          <strong>
            {rule ? `Need ${rule.correctRequired} correct` : workflowStatus}
          </strong>
          {!rule && <span>{emptyRuleText}</span>}
        </div>
        {requirementItems.length > 0 && (
          <div className="inbound-verification-requirement-track">
            {requirementItems.map((item) => (
              <span
                className={`inbound-verification-requirement inbound-verification-requirement--${item.tone}`}
                key={item.group}
              >
                {item.label} {item.currentCount}/{item.requiredCount}
              </span>
            ))}
          </div>
        )}
        {rule && (
          <span
            className={`inbound-verification-workflow__wrong ${
              evaluation.failed
                ? 'inbound-verification-workflow__wrong--failed'
                : ''
            }`}
          >
            {wrongText}
          </span>
        )}
        {ruleNotes.length > 0 && (
          <Popover
            content={
              <ul className="inbound-verification-rule-notes">
                {ruleNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            }
            placement="bottomRight"
            trigger="click"
          >
            <AppButton
              aria-label="Show rule details"
              className="inbound-verification-workflow__info"
              icon={<QuestionCircleOutlined />}
              size="small"
            />
          </Popover>
        )}
      </div>

      <div className="inbound-verification-list">
        {rule ? (
          rule.questions.map((question, index) => {
            const status = questionStatuses[question.id]
            const isActive = !status && index === activeQuestionIndex

            return (
              <div
                className={[
                  'inbound-verification-list__row',
                  isActive ? 'inbound-verification-list__row--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={question.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span
                  className={`inbound-verification-list__group inbound-verification-list__group--${question.group}`}
                >
                  {groupLabels[question.group]}
                </span>
                <div className="inbound-verification-list__content">
                  <strong>
                    {question.question}
                    {question.notes && (
                      <Tooltip title={question.notes}>
                        <QuestionCircleOutlined className="inbound-verification-list__note-icon" />
                      </Tooltip>
                    )}
                  </strong>
                </div>
                <Space size={5} wrap={false}>
                  <Tooltip title="Correct">
                    <AppButton
                      className={getActionClass('correct', status === 'correct')}
                      disabled={isQuestionActionDisabled}
                      icon={<CheckOutlined />}
                      size="small"
                      onClick={() =>
                        onQuestionAction(question, index, 'correct')
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Wrong">
                    <AppButton
                      className={getActionClass('wrong', status === 'wrong')}
                      disabled={isQuestionActionDisabled}
                      icon={<CloseOutlined />}
                      size="small"
                      onClick={() => onQuestionAction(question, index, 'wrong')}
                    />
                  </Tooltip>
                  <Tooltip title="Skip">
                    <AppButton
                      className={getActionClass(
                        'skipped',
                        status === 'skipped',
                      )}
                      disabled={isQuestionActionDisabled}
                      icon={<MinusOutlined />}
                      size="small"
                      onClick={() =>
                        onQuestionAction(question, index, 'skipped')
                      }
                    >
                      Skip
                    </AppButton>
                  </Tooltip>
                </Space>
              </div>
            )
          })
        ) : (
          <div className="inbound-verification-list__empty">
            {isBankAppPinPending
              ? 'Complete PIN verification to load questions.'
              : 'No questions configured for this verification combination.'}
          </div>
        )}
      </div>

      <div className="aicc-modal-footer inbound-verification-modal__footer">
        <AppButton size="small" onClick={onReset}>
          Clear All
        </AppButton>
        {evaluation.failed ? (
          <AppButton
            danger
            size="small"
            onClick={() => onFinish('Verification Failed')}
          >
            Apply Failed
          </AppButton>
        ) : (
          <AppButton
            disabled={!evaluation.passed}
            size="small"
            type="primary"
            onClick={() => onFinish('Verified')}
          >
            Apply Verified
          </AppButton>
        )}
      </div>
    </div>
  )
}
