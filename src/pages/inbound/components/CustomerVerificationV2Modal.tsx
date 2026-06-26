import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import { Select, Space } from 'antd'
import { useMemo, useState } from 'react'
import { AppButton } from '../../../components'
import { useRoutingConfigStore } from '../../../store'
import type {
  VerificationStatus,
  VerificationV2CustomerSegment,
  VerificationV2DemoConditions,
  VerificationV2EffectiveQuestion,
  VerificationV2EffectiveRule,
  VerificationV2Question,
  VerificationV2QuestionGroup,
  VerificationV2Rule,
} from '../../../types'
import {
  buildEffectiveVerificationV2Rule,
  findVerificationV2RuleMatch,
  getDefaultVerificationV2Scenario,
  getVerificationV2RuleScenarios,
  verificationV2CustomerSegmentOptions,
  verificationV2QuestionGroupLabels,
  verificationV2QuestionGroupOrder,
} from '../../../utils/verificationRuleV2'

export type VerificationV2QuestionStepStatus =
  | 'correct'
  | 'skipped'
  | 'wrong'

interface CustomerVerificationV2ModalProps {
  initialConditions: VerificationV2DemoConditions
  questionBank: VerificationV2Question[]
  readonlyConditions?: boolean
  rules: VerificationV2Rule[]
  onFinish: (status: VerificationStatus) => void
}

interface CustomerVerificationV2PanelProps
  extends CustomerVerificationV2ModalProps {
  variant?: 'compact' | 'modal'
}

interface RequirementItem {
  altUsed: number
  currentCount: number
  id: string
  label: string
  requiredCount: number
  tone: 'empty' | 'met' | 'progress'
}

interface QuestionBlockGroup {
  group: VerificationV2QuestionGroup
  id: string
  label: string
  questions: VerificationV2EffectiveQuestion[]
  requirement: RequirementItem | null
}

function getCounts(
  effectiveRule: VerificationV2EffectiveRule | null,
  questionStatuses: Record<string, VerificationV2QuestionStepStatus>,
) {
  const correctByBlock = {} as Record<string, number>
  const correctByGroup = {} as Record<VerificationV2QuestionGroup, number>
  let correctCount = 0
  let skippedCount = 0
  let wrongCount = 0

  effectiveRule?.questions.forEach((question) => {
    const status = questionStatuses[question.id]

    if (status === 'correct') {
      correctCount += 1
      correctByBlock[question.blockId] =
        (correctByBlock[question.blockId] ?? 0) + 1
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
    correctByBlock,
    correctByGroup,
    correctCount,
    skippedCount,
    wrongCount,
  }
}

function getRequirementItems(
  effectiveRule: VerificationV2EffectiveRule,
  counts: ReturnType<typeof getCounts>,
) {
  let alternativePool = counts.correctByGroup.alternative ?? 0

  return verificationV2QuestionGroupOrder
    .flatMap((group) =>
      effectiveRule.requiredBlocks
        .filter((block) => block.group === group)
        .map((block) => {
          const requiredCount = block.requiredCount
          const actualCount = counts.correctByBlock[block.blockId] ?? 0
          const canUseAlternative = group === 'dynamic' || group === 'static'
          const altUsed = canUseAlternative
            ? Math.min(Math.max(requiredCount - actualCount, 0), alternativePool)
            : 0

          if (altUsed > 0) {
            alternativePool -= altUsed
          }

          const currentCount = actualCount + altUsed
          const tone =
            currentCount >= requiredCount
              ? 'met'
              : currentCount > 0
                ? 'progress'
                : 'empty'

          return {
            altUsed,
            currentCount,
            id: block.blockId,
            label: block.label,
            requiredCount,
            tone,
          }
        }),
    )
}

function evaluateRule(
  effectiveRule: VerificationV2EffectiveRule | null,
  questionStatuses: Record<string, VerificationV2QuestionStepStatus>,
) {
  const counts = getCounts(effectiveRule, questionStatuses)

  if (!effectiveRule) {
    return {
      ...counts,
      failed: false,
      passed: false,
      requirementItems: [] as RequirementItem[],
    }
  }

  const requirementItems = getRequirementItems(effectiveRule, counts)
  const requirementsMet = requirementItems.every(
    (item) => item.currentCount >= item.requiredCount,
  )
  const failed =
    effectiveRule.maxWrongAttempts !== null &&
    counts.wrongCount > 0 &&
    counts.wrongCount >= effectiveRule.maxWrongAttempts

  return {
    ...counts,
    failed,
    passed:
      !failed &&
      requirementsMet &&
      counts.correctCount >= effectiveRule.correctRequired,
    requirementItems,
  }
}

function getActionClass(
  action: VerificationV2QuestionStepStatus,
  selected: boolean,
) {
  const actionName = action === 'skipped' ? 'skip' : action

  return [
    'inbound-verify-action',
    `inbound-verify-action--${actionName}`,
    selected ? 'inbound-verify-action--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function getQuestionBlockGroups(
  effectiveRule: VerificationV2EffectiveRule | null,
  requirementItems: RequirementItem[],
): QuestionBlockGroup[] {
  if (!effectiveRule) {
    return []
  }

  const requirementByBlock = new Map(
    requirementItems.map((item) => [item.id, item]),
  )

  return effectiveRule.questions.reduce<QuestionBlockGroup[]>(
    (groups, question) => {
      const existingGroup = groups.find((group) => group.id === question.blockId)

      if (existingGroup) {
        existingGroup.questions.push(question)
        return groups
      }

      groups.push({
        group: question.group,
        id: question.blockId,
        label:
          question.groupLabel ?? verificationV2QuestionGroupLabels[question.group],
        questions: [question],
        requirement: requirementByBlock.get(question.blockId) ?? null,
      })

      return groups
    },
    [],
  )
}

export function CustomerVerificationV2Panel({
  initialConditions,
  questionBank,
  readonlyConditions = false,
  rules,
  variant = 'modal',
  onFinish,
}: CustomerVerificationV2PanelProps) {
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const [conditions, setConditions] =
    useState<VerificationV2DemoConditions>(initialConditions)
  const [questionStatuses, setQuestionStatuses] = useState<
    Record<string, VerificationV2QuestionStepStatus>
  >({})

  const skillQueueOptions = useMemo(
    () =>
      skillQueues
        .filter((skillQueue) => skillQueue.status === 'Active')
        .map((skillQueue) => ({
          label: skillQueue.skillQueueName,
          value: skillQueue.skillQueueCode,
        })),
    [skillQueues],
  )
  const skillQueueNameByCode = useMemo(
    () =>
      Object.fromEntries(
        skillQueues.map((skillQueue) => [
          skillQueue.skillQueueCode,
          skillQueue.skillQueueName,
        ]),
      ) as Record<string, string>,
    [skillQueues],
  )
  const ruleMatch = useMemo(
    () => findVerificationV2RuleMatch(rules, conditions),
    [conditions, rules],
  )
  const matchedRule = ruleMatch.rule
  const verificationScenarioOptions = useMemo(
    () =>
      (matchedRule ? getVerificationV2RuleScenarios(matchedRule) : []).map(
        (scenario) => ({
        label: scenario.name,
        value: scenario.id,
        }),
      ),
    [matchedRule],
  )
  const defaultScenarioId = matchedRule
    ? getDefaultVerificationV2Scenario(matchedRule)?.id
    : ''
  const selectedVerificationScenarioId = verificationScenarioOptions.some(
    (option) => option.value === conditions.scenarioId,
  )
    ? conditions.scenarioId
    : defaultScenarioId
  const shouldShowScenarioSelector = verificationScenarioOptions.length > 1
  const effectiveRule = useMemo(
    () =>
      matchedRule
        ? buildEffectiveVerificationV2Rule(
            matchedRule,
            questionBank,
            {
              ...conditions,
              scenarioId: selectedVerificationScenarioId,
            },
          )
        : null,
    [conditions, matchedRule, questionBank, selectedVerificationScenarioId],
  )
  const evaluation = evaluateRule(effectiveRule, questionStatuses)
  const wrongLimit = effectiveRule?.maxWrongAttempts ?? null
  const wrongText =
    effectiveRule && wrongLimit !== null
      ? `Wrong ${evaluation.wrongCount}/${wrongLimit}`
      : ''
  const applyFailedLabel =
    effectiveRule && wrongLimit !== null
      ? `Apply Failed ${evaluation.wrongCount}/${wrongLimit}`
      : 'Apply Failed'
  const applyVerifiedLabel = effectiveRule
    ? `Apply Verified ${evaluation.correctCount}/${effectiveRule.correctRequired}`
    : 'Apply Verified'
  const questionBlockGroups = getQuestionBlockGroups(
    effectiveRule,
    evaluation.requirementItems,
  )

  const updateConditions = (patch: Partial<VerificationV2DemoConditions>) => {
    const nextConditions = {
      ...conditions,
      ...patch,
    }
    const nextRuleMatch = findVerificationV2RuleMatch(rules, nextConditions)
    const nextEffectiveRule = nextRuleMatch.rule
      ? buildEffectiveVerificationV2Rule(
          nextRuleMatch.rule,
          questionBank,
          nextConditions,
        )
      : null
    const nextQuestionIds = new Set(
      nextEffectiveRule?.questions.map((question) => question.id) ?? [],
    )
    const nextQuestionStatuses = Object.fromEntries(
      Object.entries(questionStatuses).filter(([questionId]) =>
        nextQuestionIds.has(questionId),
      ),
    )
    setConditions(nextConditions)
    setQuestionStatuses(nextQuestionStatuses)
  }

  const handleQuestionAction = (
    question: VerificationV2EffectiveQuestion,
    status: VerificationV2QuestionStepStatus,
  ) => {
    const nextQuestionStatuses = {
      ...questionStatuses,
      [question.id]: status,
    }

    setQuestionStatuses(nextQuestionStatuses)
  }

  const resetProgress = () => {
    setQuestionStatuses({})
  }

  const renderQuestionActions = (question: VerificationV2EffectiveQuestion) => {
    const status = questionStatuses[question.id]

    return (
      <Space
        className="inbound-verification-list__actions"
        size={5}
        wrap={false}
      >
        <AppButton
          aria-label="Mark correct"
          className={getActionClass('correct', status === 'correct')}
          disabled={false}
          icon={<CheckOutlined />}
          size="small"
          onClick={() => handleQuestionAction(question, 'correct')}
        />
        <AppButton
          aria-label="Mark wrong"
          className={getActionClass('wrong', status === 'wrong')}
          danger
          disabled={false}
          icon={<CloseOutlined />}
          size="small"
          onClick={() => handleQuestionAction(question, 'wrong')}
        />
        <AppButton
          aria-label="Skip question"
          className={getActionClass('skipped', status === 'skipped')}
          disabled={false}
          icon={<MinusOutlined />}
          size="small"
          onClick={() => handleQuestionAction(question, 'skipped')}
        />
      </Space>
    )
  }

  const renderConditionControls = () => (
    <>
      <label className="inbound-verification-workflow__business">
        <span>{variant === 'compact' ? 'Segment' : 'Customer Segment'}</span>
        {readonlyConditions ? (
          <strong className="inbound-verification-workflow__readonly">
            {verificationV2CustomerSegmentOptions.find(
              (option) => option.value === conditions.customerSegment,
            )?.label ?? conditions.customerSegment}
          </strong>
        ) : (
          <Select
            className="inbound-verification-workflow__business-select"
            options={verificationV2CustomerSegmentOptions}
            popupMatchSelectWidth={false}
            size="small"
            value={conditions.customerSegment}
            onChange={(customerSegment) =>
              updateConditions({
                customerSegment:
                  customerSegment as VerificationV2CustomerSegment,
              })
            }
          />
        )}
      </label>
      <label className="inbound-verification-workflow__business">
        <span>Skill</span>
        {readonlyConditions ? (
          <strong className="inbound-verification-workflow__readonly">
            {skillQueueNameByCode[conditions.skillQueueCode] ??
              conditions.skillQueueCode}
          </strong>
        ) : (
          <Select
            className="inbound-verification-workflow__business-select"
            options={skillQueueOptions}
            popupMatchSelectWidth={false}
            size="small"
            value={conditions.skillQueueCode}
            onChange={(skillQueueCode) =>
              updateConditions({ skillQueueCode })
            }
          />
        )}
      </label>
      {shouldShowScenarioSelector && (
        <label className="inbound-verification-workflow__business">
          <span>Scenario</span>
          <Select
            className="inbound-verification-workflow__business-select"
            options={verificationScenarioOptions}
            popupMatchSelectWidth={false}
            size="small"
            value={selectedVerificationScenarioId}
            onChange={(scenarioId) =>
              updateConditions({
                scenarioId:
                  scenarioId as VerificationV2DemoConditions['scenarioId'],
              })
            }
          />
        </label>
      )}
    </>
  )

  if (variant === 'compact') {
    return (
      <div className="inbound-verification-workflow inbound-verification-workflow--v2 inbound-verification-workflow--compact">
        <div className="inbound-verification-workflow__toolbar inbound-verification-workflow__toolbar--v2 inbound-verification-workflow__toolbar--compact">
          {renderConditionControls()}
        </div>

        {effectiveRule?.agentHint && (
          <div className="inbound-verification-workflow__rulecopy inbound-verification-workflow__rulecopy--compact">
            <span className="inbound-verification-workflow__hint">
              {effectiveRule.agentHint}
            </span>
          </div>
        )}

        <div className="inbound-verification-list inbound-verification-list--grouped">
          {effectiveRule ? (
            questionBlockGroups.map((group) => {
              const requirement = group.requirement

              return (
                <section
                  className="inbound-verification-question-group"
                  key={group.id}
                >
                  <header className="inbound-verification-question-group__header">
                    <span
                      className={`inbound-verification-list__group inbound-verification-list__group--${group.group}`}
                    >
                      {group.label}
                      {requirement && (
                        <em
                          className={`inbound-verification-question-group__count inbound-verification-question-group__count--${requirement.tone}`}
                        >
                          ({requirement.currentCount}/{requirement.requiredCount}
                          {requirement.altUsed > 0
                            ? ` ALT +${requirement.altUsed}`
                            : ''}
                          )
                        </em>
                      )}
                    </span>
                  </header>
                  <div className="inbound-verification-question-group__body">
                    {group.questions.map((question, index) => (
                      <div
                        className="inbound-verification-list__row"
                        key={question.id}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div className="inbound-verification-list__content">
                          <strong>{question.questionName}</strong>
                        </div>
                        {renderQuestionActions(question)}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="inbound-verification-list__empty">
              No questions configured for this KBV scenario.
            </div>
          )}
        </div>

        <div className="aicc-modal-footer inbound-verification-modal__footer inbound-verification-modal__footer--compact">
          <div className="inbound-verification-compact-actions">
            <AppButton size="small" onClick={resetProgress}>
              Clear All
            </AppButton>
            <AppButton
              danger
              disabled={!effectiveRule}
              size="small"
              onClick={() => onFinish('Verification Failed')}
            >
              {applyFailedLabel}
            </AppButton>
            <AppButton
              disabled={!evaluation.passed}
              size="small"
              type="primary"
              onClick={() => onFinish('Verified')}
            >
              {applyVerifiedLabel}
            </AppButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={[
        'inbound-verification-workflow',
        'inbound-verification-workflow--v2',
        variant === 'compact'
          ? 'inbound-verification-workflow--compact'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'inbound-verification-workflow__toolbar',
          'inbound-verification-workflow__toolbar--v2',
          variant === 'compact'
            ? 'inbound-verification-workflow__toolbar--compact'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {renderConditionControls()}
      </div>

      <div className="inbound-verification-workflow__rulebar">
        <div className="inbound-verification-workflow__progressline">
          <strong>
            {effectiveRule
              ? `Need ${effectiveRule.correctRequired} correct`
              : 'No KBV Rule Available'}
          </strong>
          {evaluation.requirementItems.length > 0 && (
            <div className="inbound-verification-requirement-track">
              {evaluation.requirementItems.map((item) => (
                <span
                  className={`inbound-verification-requirement inbound-verification-requirement--${item.tone}`}
                  key={item.id}
                >
                  {item.label} {item.currentCount}/{item.requiredCount}
                  {item.altUsed > 0 ? ` (+${item.altUsed} alt)` : ''}
                </span>
              ))}
            </div>
          )}
          {effectiveRule && wrongLimit !== null && (
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
        </div>
        {effectiveRule?.agentHint && (
          <div className="inbound-verification-workflow__rulecopy">
            <span className="inbound-verification-workflow__hint">
              {effectiveRule.agentHint}
            </span>
          </div>
        )}
      </div>

      <div className="inbound-verification-list">
        {effectiveRule ? (
          effectiveRule.questions.map((question, index) => {
            return (
              <div
                className="inbound-verification-list__row"
                key={question.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span
                  className={`inbound-verification-list__group inbound-verification-list__group--${question.group}`}
                >
                  {question.groupLabel ??
                    verificationV2QuestionGroupLabels[question.group]}
                </span>
                <div className="inbound-verification-list__content">
                  <strong>{question.questionName}</strong>
                </div>
                {renderQuestionActions(question)}
              </div>
            )
          })
        ) : (
          <div className="inbound-verification-list__empty">
            No questions configured for this KBV scenario.
          </div>
        )}
      </div>

      <div className="aicc-modal-footer inbound-verification-modal__footer">
        <AppButton size="small" onClick={resetProgress}>
          Clear All
        </AppButton>
        <AppButton
          danger
          disabled={!effectiveRule}
          size="small"
          onClick={() => onFinish('Verification Failed')}
        >
          Apply Failed
        </AppButton>
        <AppButton
          disabled={!evaluation.passed}
          size="small"
          type="primary"
          onClick={() => onFinish('Verified')}
        >
          Apply Verified
        </AppButton>
      </div>
    </div>
  )
}

export function CustomerVerificationV2Modal(
  props: CustomerVerificationV2ModalProps,
) {
  return <CustomerVerificationV2Panel {...props} variant="modal" />
}
