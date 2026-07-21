import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Checkbox,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminFormField,
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
  StatusBadge,
} from '../../components'
import { useAppStore, useRoutingConfigStore } from '../../store'
import type {
  VerificationV2CustomerSegment,
  VerificationV2Question,
  VerificationV2QuestionBlock,
  VerificationV2QuestionBlockType,
  VerificationV2Rule,
  VerificationV2RuleStatus,
  VerificationV2Scenario,
} from '../../types'
import { CustomerVerificationV2Panel } from '../inbound/components/CustomerVerificationV2Modal'
import {
  cloneVerificationV2QuestionBlock,
  cloneVerificationV2Rule,
  createEmptyVerificationV2QuestionBlock,
  createEmptyVerificationV2Rule,
  findVerificationV2Question,
  formatVerificationV2Timestamp,
  getDefaultVerificationV2Scenario,
  getVerificationV2RuleScenarios,
  getVerificationV2QuestionBlockType,
  getVerificationV2ScenarioQuestionCount,
  getVerificationV2ScenarioCorrectRequired,
  normalizeVerificationV2QuestionBlock,
  verificationV2BaseGroupOrder,
  verificationV2CustomerSegmentLabels,
  verificationV2CustomerSegmentOptions,
  verificationV2QuestionBlockTypeLabels,
} from '../../utils/verificationRuleV2'

type RuleModalMode = 'create' | 'edit' | 'view'

interface QuestionDraft {
  id: string | null
  questionName: string
}

interface QuestionDeleteContext {
  question: VerificationV2Question
  referenceCount: number
  referencedRuleCount: number
}

interface QuestionBankFilters {
  questionName: string
}

interface RuleFilters {
  channelCodes: string[]
  customerSegments: VerificationV2CustomerSegment[]
  skillQueueCodes: string[]
  status: '' | VerificationV2RuleStatus
}

interface QuestionPickerState {
  target: {
    blockId: string
    scenarioId: string
  }
  searchText: string
  selectedQuestionIds: string[]
}

type ScenarioCreateMode = 'blank' | 'copy-current'

interface ScenarioCreateDraft {
  mode: ScenarioCreateMode
  name: string
}

const defaultQuestionDraft: QuestionDraft = {
  id: null,
  questionName: '',
}

const defaultQuestionBankFilters: QuestionBankFilters = {
  questionName: '',
}

const defaultRuleFilters: RuleFilters = {
  channelCodes: [],
  customerSegments: [],
  skillQueueCodes: [],
  status: '',
}

const defaultScenarioCreateDraft: ScenarioCreateDraft = {
  mode: 'copy-current',
  name: '',
}

const verificationV2AllowedChannelCodes = ['PHONE', 'BANKAPP']

const ruleStatusOptions: Array<{
  label: string
  value: '' | VerificationV2RuleStatus
}> = [
  { label: 'All', value: '' },
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
]

function getNextRuleSequence(rules: VerificationV2Rule[]) {
  return rules.reduce((maxSequence, rule) => {
    const match = /^v2-rule-(\d+)$/.exec(rule.id)

    return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
  }, rules.length)
}

function createQuestionId(questionName: string) {
  const slug =
    questionName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'question'

  return `v2-q-${slug}-${Date.now().toString(36)}`
}

function createConfigId(
  prefix: string,
  name: string,
  existingIds: string[],
) {
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || prefix
  let nextId = slug
  let sequence = 2

  while (existingIds.includes(nextId)) {
    nextId = `${slug}-${sequence}`
    sequence += 1
  }

  return nextId
}

function normalizeQuestionName(questionName: string) {
  return questionName.trim().replace(/\s+/g, ' ').toLowerCase()
}

function moveItem(values: string[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction

  if (nextIndex < 0 || nextIndex >= values.length) {
    return values
  }

  const nextValues = [...values]
  const [item] = nextValues.splice(index, 1)
  nextValues.splice(nextIndex, 0, item)

  return nextValues
}

function removeItem(values: string[], index: number) {
  return values.filter((_, itemIndex) => itemIndex !== index)
}

function normalizeScenarios(
  scenarios: VerificationV2Scenario[],
): VerificationV2Scenario[] {
  const nextScenarios =
    scenarios.length > 0
      ? scenarios.map((scenario) => ({
          ...scenario,
          agentHint: scenario.agentHint ?? '',
          maxWrongAttempts:
            scenario.maxWrongAttempts === undefined
              ? null
              : scenario.maxWrongAttempts,
          questionBlocks: scenario.questionBlocks.map(
            cloneVerificationV2QuestionBlock,
          ),
        }))
      : [
        {
          agentHint: '',
          id: 'default',
            isDefault: true,
            maxWrongAttempts: null,
            name: 'Default',
            questionBlocks: [],
          },
        ]
  const defaultScenarioIndex = nextScenarios.findIndex(
    (scenario) => scenario.isDefault,
  )

  return nextScenarios.map((scenario, index) => ({
    ...scenario,
    isDefault:
      defaultScenarioIndex >= 0
        ? index === defaultScenarioIndex
        : index === 0,
  }))
}

function getRuleValidationErrors(rule: VerificationV2Rule) {
  const errors: string[] = []
  const scenarios = getVerificationV2RuleScenarios(rule)

  if (rule.channelCodes.length === 0) {
    errors.push('Channel is required.')
  }

  if (!rule.skillQueueCode) {
    errors.push('Skill Queue is required.')
  }

  if (rule.customerSegments.length === 0) {
    errors.push('Customer Segment is required.')
  }

  if (scenarios.length === 0) {
    errors.push('At least one Verification Scenario is required.')
  }

  const normalizedScenarioNames = new Set<string>()

  scenarios.forEach((scenario) => {
    const scenarioName = scenario.name.trim()
    const scenarioQuestionCount = getVerificationV2ScenarioQuestionCount(scenario)

    if (!scenarioName) {
      errors.push('Verification Scenario Name is required.')
    }

    const normalizedScenarioName = scenarioName.toLowerCase()

    if (normalizedScenarioNames.has(normalizedScenarioName)) {
      errors.push(`Verification Scenario "${scenarioName}" is duplicated.`)
    }

    normalizedScenarioNames.add(normalizedScenarioName)

    const fixedBlockTypes = new Set<VerificationV2QuestionBlockType>()

    scenario.questionBlocks.forEach((block) => {
      const normalizedBlock = normalizeVerificationV2QuestionBlock(block)
      const blockType = normalizedBlock.blockType ?? 'custom'
      const blockName = block.name.trim()

      if (!blockName) {
        errors.push(
          `Question Block name is required in ${
            scenarioName || scenario.id
          }.`,
        )
      }

      if (blockType !== 'custom') {
        if (fixedBlockTypes.has(blockType)) {
          errors.push(
            `${verificationV2QuestionBlockTypeLabels[blockType]} can only be configured once in one scenario.`,
          )
        }

        fixedBlockTypes.add(blockType)
      }

      if (normalizedBlock.requiredCorrect > normalizedBlock.questionIds.length) {
        errors.push(
          `Question Block "${blockName || block.id}" required count cannot exceed selected questions.`,
        )
      }
    })

    if (
      scenario.maxWrongAttempts !== null &&
      scenario.maxWrongAttempts !== undefined &&
      scenario.maxWrongAttempts > scenarioQuestionCount
    ) {
      errors.push(
        `Max Wrong in scenario "${scenarioName || scenario.id}" cannot exceed selected questions.`,
      )
    }
  })

  return errors
}

export function VerificationRuleV2Page() {
  const verificationV2QuestionBank = useAppStore(
    (state) => state.verificationV2QuestionBank,
  )
  const verificationV2Rules = useAppStore((state) => state.verificationV2Rules)
  const upsertVerificationV2Question = useAppStore(
    (state) => state.upsertVerificationV2Question,
  )
  const upsertVerificationV2Rule = useAppStore(
    (state) => state.upsertVerificationV2Rule,
  )
  const deleteVerificationV2Rule = useAppStore(
    (state) => state.deleteVerificationV2Rule,
  )
  const deleteVerificationV2Question = useAppStore(
    (state) => state.deleteVerificationV2Question,
  )
  const channels = useRoutingConfigStore((state) => state.channels)
  const skillQueues = useRoutingConfigStore((state) => state.skillQueues)
  const [questionBankOpen, setQuestionBankOpen] = useState(false)
  const [questionBankFilters, setQuestionBankFilters] =
    useState<QuestionBankFilters>(defaultQuestionBankFilters)
  const [ruleFilters, setRuleFilters] =
    useState<RuleFilters>(defaultRuleFilters)
  const [ruleFilterDraft, setRuleFilterDraft] =
    useState<RuleFilters>(defaultRuleFilters)
  const [questionEditorOpen, setQuestionEditorOpen] = useState(false)
  const [questionDraft, setQuestionDraft] =
    useState<QuestionDraft>(defaultQuestionDraft)
  const [questionSubmitAttempted, setQuestionSubmitAttempted] = useState(false)
  const [questionValidationError, setQuestionValidationError] = useState('')
  const [ruleDraft, setRuleDraft] = useState<VerificationV2Rule | null>(null)
  const [ruleMode, setRuleMode] = useState<RuleModalMode>('view')
  const [activeScenarioId, setActiveScenarioId] = useState('default')
  const [renamingScenarioId, setRenamingScenarioId] = useState<string | null>(
    null,
  )
  const [scenarioCreateOpen, setScenarioCreateOpen] = useState(false)
  const [scenarioCreateDraft, setScenarioCreateDraft] =
    useState<ScenarioCreateDraft>(defaultScenarioCreateDraft)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<VerificationV2Rule | null>(
    null,
  )
  const [questionDeleteContext, setQuestionDeleteContext] =
    useState<QuestionDeleteContext | null>(null)
  const [ruleSubmitAttempted, setRuleSubmitAttempted] = useState(false)
  const [questionPicker, setQuestionPicker] =
    useState<QuestionPickerState | null>(null)

  const activeChannelOptions = useMemo(
    () =>
      channels
        .filter(
          (channel) =>
            channel.status === 'Active' &&
            verificationV2AllowedChannelCodes.includes(channel.channelCode),
        )
        .map((channel) => ({
          label: channel.channelName,
          value: channel.channelCode,
        })),
    [channels],
  )
  const activeSkillQueueOptions = useMemo(
    () =>
      skillQueues
        .filter((skillQueue) => skillQueue.status === 'Active')
        .map((skillQueue) => ({
          label: skillQueue.skillQueueName,
          value: skillQueue.skillQueueCode,
        })),
    [skillQueues],
  )
  const filteredQuestionBank = useMemo(
    () =>
      verificationV2QuestionBank.filter((question) => {
        const keyword = questionBankFilters.questionName.trim().toLowerCase()

        return !keyword || question.questionName.toLowerCase().includes(keyword)
      }),
    [questionBankFilters, verificationV2QuestionBank],
  )
  const channelNameByCode = useMemo(
    () =>
      Object.fromEntries(
        channels.map((channel) => [channel.channelCode, channel.channelName]),
      ) as Record<string, string>,
    [channels],
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
  const filteredRules = useMemo(
    () =>
      verificationV2Rules.filter((rule) => {
        if (
          ruleFilters.channelCodes.length > 0 &&
          !rule.channelCodes.some((channelCode) =>
            ruleFilters.channelCodes.includes(channelCode),
          )
        ) {
          return false
        }

        if (
          ruleFilters.skillQueueCodes.length > 0 &&
          !ruleFilters.skillQueueCodes.includes(rule.skillQueueCode)
        ) {
          return false
        }

        if (
          ruleFilters.customerSegments.length > 0 &&
          !rule.customerSegments.some((segment) =>
            ruleFilters.customerSegments.includes(segment),
          )
        ) {
          return false
        }

        if (ruleFilters.status && rule.status !== ruleFilters.status) {
          return false
        }

        return true
      }),
    [ruleFilters, verificationV2Rules],
  )
  const ruleValidationErrors = ruleDraft
    ? getRuleValidationErrors(ruleDraft)
    : []
  const isRuleViewMode = ruleMode === 'view'
  const draftScenarios = ruleDraft
    ? getVerificationV2RuleScenarios(ruleDraft)
    : []
  const activeScenario =
    draftScenarios.find((scenario) => scenario.id === activeScenarioId) ??
    (ruleDraft ? getDefaultVerificationV2Scenario(ruleDraft) : null) ??
    draftScenarios[0] ??
    null
  const activeScenarioCorrectRequired =
    getVerificationV2ScenarioCorrectRequired(activeScenario)
  const activeScenarioQuestionCount =
    getVerificationV2ScenarioQuestionCount(activeScenario)
  const activeScenarioFixedBlockTypes = new Set(
    activeScenario?.questionBlocks
      .map((block) => getVerificationV2QuestionBlockType(block))
      .filter((blockType) => blockType !== 'custom') ?? [],
  )
  const addableFixedBlockTypes = verificationV2BaseGroupOrder.filter(
    (blockType) => !activeScenarioFixedBlockTypes.has(blockType),
  )
  const filteredQuestionPickerQuestions = questionPicker
    ? verificationV2QuestionBank.filter((question) => {
        const keyword = questionPicker.searchText.trim().toLowerCase()

        return (
          !keyword || question.questionName.toLowerCase().includes(keyword)
        )
      })
    : []

  const updateRuleDraft = (nextRule: VerificationV2Rule) => {
    setRuleDraft({
      ...nextRule,
      scenarios: normalizeScenarios(getVerificationV2RuleScenarios(nextRule)),
    })
  }

  const patchRuleDraft = (patch: Partial<VerificationV2Rule>) => {
    if (!ruleDraft) {
      return
    }

    updateRuleDraft({
      ...ruleDraft,
      ...patch,
    })
  }

  const updateDraftScenarios = (
    nextScenarios: VerificationV2Scenario[],
    nextActiveScenarioId = activeScenarioId,
  ) => {
    if (!ruleDraft) {
      return
    }

    const normalizedScenarios = normalizeScenarios(nextScenarios)

    updateRuleDraft({
      ...ruleDraft,
      scenarios: normalizedScenarios,
    })

    if (
      !normalizedScenarios.some(
        (scenario) => scenario.id === nextActiveScenarioId,
      )
    ) {
      setActiveScenarioId(
        normalizedScenarios.find((scenario) => scenario.isDefault)?.id ??
          normalizedScenarios[0]?.id ??
          'default',
      )
      return
    }

    setActiveScenarioId(nextActiveScenarioId)
  }

  const updateScenario = (
    scenarioId: string,
    patch: Partial<VerificationV2Scenario>,
  ) => {
    updateDraftScenarios(
      draftScenarios.map((scenario) =>
        scenario.id === scenarioId
          ? {
              ...scenario,
              ...patch,
            }
          : scenario,
      ),
      scenarioId,
    )
  }

  const updateQuestionBlock = (
    scenarioId: string,
    blockId: string,
    patch: Partial<VerificationV2QuestionBlock>,
  ) => {
    updateDraftScenarios(
      draftScenarios.map((scenario) => {
        if (scenario.id !== scenarioId) {
          return scenario
        }

        return {
          ...scenario,
          questionBlocks: scenario.questionBlocks.map((block) => {
            if (block.id !== blockId) {
              return block
            }

            const nextBlock = normalizeVerificationV2QuestionBlock({
              ...block,
              ...patch,
            })

            if (nextBlock.requiredCorrect > nextBlock.questionIds.length) {
              nextBlock.requiredCorrect = nextBlock.questionIds.length
            }

            return nextBlock
          }),
        }
      }),
      scenarioId,
    )
  }

  const handleSearchRules = () => {
    setRuleFilters({
      channelCodes: [...ruleFilterDraft.channelCodes],
      customerSegments: [...ruleFilterDraft.customerSegments],
      skillQueueCodes: [...ruleFilterDraft.skillQueueCodes],
      status: ruleFilterDraft.status,
    })
  }

  const handleResetRuleFilters = () => {
    setRuleFilterDraft(defaultRuleFilters)
    setRuleFilters(defaultRuleFilters)
  }

  const openRuleModal = (mode: RuleModalMode, rule?: VerificationV2Rule) => {
    setRuleMode(mode)
    setRuleSubmitAttempted(false)

    if (rule) {
      const nextRule = cloneVerificationV2Rule(rule)
      const defaultScenario = getDefaultVerificationV2Scenario(nextRule)
      setRuleDraft(nextRule)
      setActiveScenarioId(defaultScenario?.id ?? 'default')
      return
    }

    const nextRule = createEmptyVerificationV2Rule(
      {
        channelCodes: [activeChannelOptions[0]?.value ?? 'PHONE'],
        customerSegments: ['regular'],
        skillQueueCode: activeSkillQueueOptions[0]?.value ?? 'SQ_GENERAL_ID',
      },
      getNextRuleSequence(verificationV2Rules) + 1,
    )
    const defaultScenario = getDefaultVerificationV2Scenario(nextRule)
    setRuleDraft(nextRule)
    setActiveScenarioId(defaultScenario?.id ?? 'default')
  }

  const closeRuleModal = () => {
    setRuleDraft(null)
    setRuleSubmitAttempted(false)
    setActiveScenarioId('default')
    setRenamingScenarioId(null)
    setScenarioCreateOpen(false)
    setScenarioCreateDraft(defaultScenarioCreateDraft)
    setPreviewOpen(false)
    setQuestionPicker(null)
  }

  const closeDeleteRuleConfirm = () => {
    setRuleToDelete(null)
  }

  const closeDeleteQuestionConfirm = () => {
    setQuestionDeleteContext(null)
  }

  const deleteRule = () => {
    if (!ruleToDelete) {
      return
    }

    deleteVerificationV2Rule(ruleToDelete.id)

    if (ruleDraft?.id === ruleToDelete.id) {
      closeRuleModal()
    }

    closeDeleteRuleConfirm()
  }

  const getQuestionReferenceStats = (questionId: string) => {
    let referenceCount = 0
    const referencedRuleIds = new Set<string>()

    verificationV2Rules.forEach((rule) => {
      let ruleReferenceCount = 0

      getVerificationV2RuleScenarios(rule).forEach((scenario) => {
        scenario.questionBlocks.forEach((block) => {
          ruleReferenceCount += block.questionIds.filter(
            (id) => id === questionId,
          ).length
        })
      })

      if (ruleReferenceCount > 0) {
        referencedRuleIds.add(rule.id)
        referenceCount += ruleReferenceCount
      }
    })

    return {
      referenceCount,
      referencedRuleCount: referencedRuleIds.size,
    }
  }

  const requestDeleteQuestion = (question: VerificationV2Question) => {
    const referenceStats = getQuestionReferenceStats(question.id)

    if (referenceStats.referenceCount === 0) {
      deleteVerificationV2Question(question.id)
      return
    }

    setQuestionDeleteContext({
      question,
      ...referenceStats,
    })
  }

  const confirmDeleteQuestion = () => {
    if (!questionDeleteContext) {
      return
    }

    deleteVerificationV2Question(questionDeleteContext.question.id)
    closeDeleteQuestionConfirm()
  }

  const saveRule = () => {
    if (!ruleDraft) {
      return
    }

    setRuleSubmitAttempted(true)

    if (ruleValidationErrors.length > 0) {
      return
    }

    const normalizedScenarios = normalizeScenarios(
      getVerificationV2RuleScenarios(ruleDraft),
    )
    const defaultScenario =
      normalizedScenarios.find((scenario) => scenario.isDefault) ??
      normalizedScenarios[0]

    upsertVerificationV2Rule({
      ...ruleDraft,
      maxWrongAttempts:
        defaultScenario?.maxWrongAttempts === undefined
          ? ruleDraft.maxWrongAttempts
          : defaultScenario.maxWrongAttempts,
      scenarios: normalizedScenarios,
      specialRules: {
        ...ruleDraft.specialRules,
        organizationOverride: {
          ...ruleDraft.specialRules.organizationOverride,
          enabled: false,
        },
      },
      updatedAt: formatVerificationV2Timestamp(new Date()),
      updatedBy: 'Admin',
    })
    closeRuleModal()
  }

  const openScenarioCreateModal = () => {
    setScenarioCreateDraft({
      mode: 'copy-current',
      name: `Scenario ${draftScenarios.length + 1}`,
    })
    setScenarioCreateOpen(true)
  }

  const closeScenarioCreateModal = () => {
    setScenarioCreateDraft(defaultScenarioCreateDraft)
    setScenarioCreateOpen(false)
  }

  const addScenario = () => {
    if (!ruleDraft) {
      return
    }

    const scenarioName =
      scenarioCreateDraft.name.trim() || `Scenario ${draftScenarios.length + 1}`
    const questionBlocks =
      scenarioCreateDraft.mode === 'copy-current' && activeScenario
        ? activeScenario.questionBlocks.map(cloneVerificationV2QuestionBlock)
        : []
    const nextScenario: VerificationV2Scenario = {
      agentHint:
        scenarioCreateDraft.mode === 'copy-current' && activeScenario
          ? activeScenario.agentHint ?? ''
          : '',
      id: createConfigId(
        'scenario',
        scenarioName,
        draftScenarios.map((scenario) => scenario.id),
      ),
      isDefault: false,
      maxWrongAttempts:
        scenarioCreateDraft.mode === 'copy-current' && activeScenario
          ? activeScenario.maxWrongAttempts === undefined
            ? null
            : activeScenario.maxWrongAttempts
          : null,
      name: scenarioName,
      questionBlocks,
    }

    updateDraftScenarios(
      [...draftScenarios, nextScenario],
      nextScenario.id,
    )
    closeScenarioCreateModal()
  }

  const deleteScenario = (scenarioId: string) => {
    const scenario = draftScenarios.find((item) => item.id === scenarioId)

    if (!scenario || scenario.isDefault || draftScenarios.length <= 1) {
      return
    }

    setRenamingScenarioId(null)
    updateDraftScenarios(
      draftScenarios.filter((item) => item.id !== scenarioId),
    )
  }

  const addQuestionBlock = (blockType: VerificationV2QuestionBlockType) => {
    if (!activeScenario) {
      return
    }

    const block = createEmptyVerificationV2QuestionBlock(
      activeScenario.questionBlocks.length + 1,
      blockType,
    )
    const nextBlock = {
      ...block,
      id: createConfigId(
        'block',
        block.name,
        activeScenario.questionBlocks.map((item) => item.id),
      ),
    }

    updateScenario(activeScenario.id, {
      questionBlocks: [...activeScenario.questionBlocks, nextBlock],
    })
  }

  const deleteQuestionBlock = (scenarioId: string, blockId: string) => {
    const scenario = draftScenarios.find((item) => item.id === scenarioId)

    if (!scenario) {
      return
    }

    updateScenario(scenarioId, {
      questionBlocks: scenario.questionBlocks.filter(
        (block) => block.id !== blockId,
      ),
    })
  }

  const openQuestionPicker = (scenarioId: string, blockId: string) => {
    if (!ruleDraft || isRuleViewMode) {
      return
    }

    const scenario = draftScenarios.find((item) => item.id === scenarioId)
    const block = scenario?.questionBlocks.find((item) => item.id === blockId)

    if (!block) {
      return
    }

    setQuestionPicker({
      target: {
        blockId,
        scenarioId,
      },
      searchText: '',
      selectedQuestionIds: [...block.questionIds],
    })
  }

  const closeQuestionPicker = () => {
    setQuestionPicker(null)
  }

  const updateQuestionPickerSelection = (
    questionId: string,
    checked: boolean,
  ) => {
    setQuestionPicker((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        selectedQuestionIds: checked
          ? [...current.selectedQuestionIds, questionId]
          : current.selectedQuestionIds.filter(
              (selectedQuestionId) => selectedQuestionId !== questionId,
            ),
      }
    })
  }

  const confirmQuestionPicker = () => {
    if (!questionPicker) {
      return
    }

    updateQuestionBlock(
      questionPicker.target.scenarioId,
      questionPicker.target.blockId,
      {
        questionIds: questionPicker.selectedQuestionIds,
      },
    )
    closeQuestionPicker()
  }

  const openQuestionEditor = (question?: VerificationV2Question) => {
    setQuestionDraft(
      question
        ? {
            id: question.id,
            questionName: question.questionName,
          }
        : defaultQuestionDraft,
    )
    setQuestionSubmitAttempted(false)
    setQuestionValidationError('')
    setQuestionEditorOpen(true)
  }

  const closeQuestionEditor = () => {
    setQuestionDraft(defaultQuestionDraft)
    setQuestionSubmitAttempted(false)
    setQuestionValidationError('')
    setQuestionEditorOpen(false)
  }

  const saveQuestion = () => {
    setQuestionSubmitAttempted(true)

    const questionName = questionDraft.questionName.trim()

    if (!questionName) {
      setQuestionValidationError('Question Name is required.')
      return
    }

    const normalizedQuestionName = normalizeQuestionName(questionName)
    const duplicatedQuestion = verificationV2QuestionBank.find(
      (question) =>
        question.id !== questionDraft.id &&
        normalizeQuestionName(question.questionName) === normalizedQuestionName,
    )

    if (duplicatedQuestion) {
      setQuestionValidationError('Question Name already exists.')
      return
    }

    upsertVerificationV2Question({
      id: questionDraft.id ?? createQuestionId(questionName),
      questionName,
    })
    closeQuestionEditor()
  }

  const questionColumns: ColumnsType<VerificationV2Question> = [
    {
      dataIndex: 'questionName',
      key: 'questionName',
      title: 'Question Name',
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 96,
      render: (_, question) => (
        <div className="verification-rules-page__row-actions">
          <button
            aria-label={`Edit ${question.id}`}
            type="button"
            onClick={() => openQuestionEditor(question)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${question.id}`}
            type="button"
            onClick={() => requestDeleteQuestion(question)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]

  const columns: ColumnsType<VerificationV2Rule> = [
    {
      key: 'channelCodes',
      title: 'Channel',
      width: 128,
      render: (_, rule) => (
        <div className="verification-rule-v2-tags">
          {rule.channelCodes.map((channelCode) => (
            <Tag key={channelCode}>{channelNameByCode[channelCode]}</Tag>
          ))}
        </div>
      ),
    },
    {
      dataIndex: 'skillQueueCode',
      key: 'skillQueueCode',
      title: 'Skill Queue',
      width: 150,
      render: (value: string) => skillQueueNameByCode[value] ?? value,
    },
    {
      key: 'customerSegments',
      title: 'Customer Segment',
      width: 168,
      render: (_, rule) => (
        <div className="verification-rule-v2-tags">
          {rule.customerSegments.map((segment) => (
            <Tag key={segment}>
              {verificationV2CustomerSegmentLabels[segment]}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      key: 'correctRequired',
      title: 'Correct Required',
      width: 104,
      render: (_, rule) =>
        getVerificationV2ScenarioCorrectRequired(
          getDefaultVerificationV2Scenario(rule),
        ),
    },
    {
      key: 'maxWrongAttempts',
      title: 'Max Wrong',
      width: 80,
      render: (_, rule) => {
        const defaultScenario = getDefaultVerificationV2Scenario(rule)
        return defaultScenario?.maxWrongAttempts ?? '-'
      },
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
      width: 96,
      render: (value: VerificationV2RuleStatus) => (
        <StatusBadge
          label={value === 'enabled' ? 'Enabled' : 'Disabled'}
          size="small"
          status={value === 'enabled' ? 'success' : 'disabled'}
        />
      ),
    },
    {
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      title: 'Updated By',
      width: 88,
      render: (value: string | undefined) => value ?? 'Admin',
    },
    {
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      title: 'Updated Time',
      width: 112,
    },
    {
      fixed: 'right',
      key: 'actions',
      title: 'Actions',
      width: 112,
      render: (_, rule) => (
        <div className="verification-rules-page__row-actions">
          <button
            aria-label={`View ${rule.id}`}
            type="button"
            onClick={() => openRuleModal('view', rule)}
          >
            <EyeOutlined />
          </button>
          <button
            aria-label={`Edit ${rule.id}`}
            type="button"
            onClick={() => openRuleModal('edit', rule)}
          >
            <EditOutlined />
          </button>
          <button
            aria-label={`Delete ${rule.id}`}
            type="button"
            onClick={() => setRuleToDelete(rule)}
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ]

  const renderQuestionOrderList = (
    questionIds: string[],
    onMove: (index: number, direction: -1 | 1) => void,
    onRemove?: (index: number) => void,
  ) => (
    <div className="verification-rule-v2-order-list">
      {questionIds.map((questionId, index) => {
        const question = findVerificationV2Question(
          verificationV2QuestionBank,
          questionId,
        )

        return (
          <div key={`${questionId}-${index}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{question?.questionName ?? questionId}</strong>
            {!isRuleViewMode && (
              <Space size={4}>
                <button
                  aria-label="Move question up"
                  disabled={index === 0}
                  type="button"
                  onClick={() => onMove(index, -1)}
                >
                  <ArrowUpOutlined />
                </button>
                <button
                  aria-label="Move question down"
                  disabled={index === questionIds.length - 1}
                  type="button"
                  onClick={() => onMove(index, 1)}
                >
                  <ArrowDownOutlined />
                </button>
                {onRemove && (
                  <button
                    aria-label="Remove question"
                    type="button"
                    onClick={() => onRemove(index)}
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </Space>
            )}
          </div>
        )
      })}
    </div>
  )

  const renderQuestionBlockConfig = (
    scenario: VerificationV2Scenario,
    rawBlock: VerificationV2QuestionBlock,
  ) => {
    const block = normalizeVerificationV2QuestionBlock(rawBlock)
    const blockType = getVerificationV2QuestionBlockType(block)
    const isCustomBlock = blockType === 'custom'
    const isAlternative = blockType === 'alternative'

    return (
      <div className="verification-rule-v2-group" key={block.id}>
        <div className="verification-rule-v2-group__toolbar">
          {isCustomBlock ? (
            <label className="verification-rule-v2-group__scenario">
              <Input
                disabled={isRuleViewMode}
                placeholder="Block Name"
                value={block.name}
                onChange={(event) =>
                  updateQuestionBlock(scenario.id, block.id, {
                    name: event.target.value,
                  })
                }
              />
            </label>
          ) : (
            <strong className="verification-rule-v2-group__title">
              {verificationV2QuestionBlockTypeLabels[blockType]}
              {isAlternative && (
                <Tooltip title="Alternative questions only replace Dynamic or Static questions. They do not have a separate required count.">
                  <QuestionCircleOutlined className="verification-rule-v2-group__title-help" />
                </Tooltip>
              )}
            </strong>
          )}
          <div className="verification-rule-v2-group__question-controls">
            <BaseButton
              disabled={isRuleViewMode}
              icon={<PlusOutlined />}
              size="small"
              onClick={() => openQuestionPicker(scenario.id, block.id)}
            >
              Questions
            </BaseButton>
            {!isAlternative && (
              <label className="verification-rule-v2-group__correct">
                <span>Correct</span>
                <InputNumber
                  disabled={isRuleViewMode}
                  max={block.questionIds.length}
                  min={0}
                  value={block.requiredCorrect}
                  onChange={(value) =>
                    updateQuestionBlock(scenario.id, block.id, {
                      requiredCorrect: Math.max(0, Number(value ?? 0)),
                    })
                  }
                />
              </label>
            )}
          </div>
          {!isRuleViewMode && (
            <button
              aria-label={`Delete ${block.name || block.id} block`}
              className="verification-rule-v2-group__delete"
              type="button"
              onClick={() => deleteQuestionBlock(scenario.id, block.id)}
            >
              <DeleteOutlined />
            </button>
          )}
        </div>
        {renderQuestionOrderList(
          block.questionIds,
          (index, direction) =>
            updateQuestionBlock(scenario.id, block.id, {
              questionIds: moveItem(block.questionIds, index, direction),
            }),
          (index) =>
            updateQuestionBlock(scenario.id, block.id, {
              questionIds: removeItem(block.questionIds, index),
            }),
        )}
      </div>
    )
  }

  const questionPickerBlock =
    questionPicker && ruleDraft
      ? getVerificationV2RuleScenarios(ruleDraft)
          .find((scenario) => scenario.id === questionPicker.target.scenarioId)
          ?.questionBlocks.find(
            (block) => block.id === questionPicker.target.blockId,
          )
      : null
  const previewRule = ruleDraft
    ? cloneVerificationV2Rule({
        ...ruleDraft,
        scenarios: normalizeScenarios(getVerificationV2RuleScenarios(ruleDraft)),
        specialRules: {
          ...ruleDraft.specialRules,
          organizationOverride: {
            ...ruleDraft.specialRules.organizationOverride,
            enabled: false,
          },
        },
        status: 'enabled',
      })
    : null
  const previewDefaultScenario = previewRule
    ? getDefaultVerificationV2Scenario(previewRule)
    : null
  const previewInitialConditions =
    previewRule && previewDefaultScenario
      ? {
          channelCode: previewRule.channelCodes[0] ?? 'PHONE',
          customerSegment: previewRule.customerSegments[0] ?? 'regular',
          organizationSegment: 'none' as const,
          scenarioId: activeScenario?.id ?? previewDefaultScenario.id,
          skillQueueCode: previewRule.skillQueueCode,
        }
      : null
  const previewRuleConfigKey =
    previewRule?.scenarios
      ?.map(
        (scenario) =>
          `${scenario.id}:${scenario.maxWrongAttempts ?? 'none'}:${
            scenario.agentHint ?? ''
          }:${scenario.questionBlocks
            .map(
              (block) =>
                `${block.id}:${block.requiredCorrect}:${block.questionIds.join(
                  '.',
                )}`,
            )
            .join('/')}`,
      )
      .join('|') ?? ''
  const previewKey =
    previewRule && previewInitialConditions
      ? [
          previewRule.id,
          previewInitialConditions.channelCode,
          previewInitialConditions.customerSegment,
          previewInitialConditions.skillQueueCode,
          previewInitialConditions.scenarioId,
          previewRule.customerSegments.join(','),
          previewRule.channelCodes.join(','),
          previewRuleConfigKey,
        ].join('|')
      : undefined

  return (
    <AdminPage
      className="verification-rules-page verification-rule-v2-page"
      title="Verification Rules"
    >
      <BaseCard compact>
        <AdminToolbar
          actions={
            <>
              <BaseButton variant="primary" onClick={handleSearchRules}>
                Search
              </BaseButton>
              <BaseButton variant="secondary" onClick={handleResetRuleFilters}>
                Reset
              </BaseButton>
            </>
          }
          filters={
            <>
              <AdminFilterField label="Channel" width={220}>
                <Select
                  allowClear
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) =>
                    `+${omittedValues.length}`
                  }
                  mode="multiple"
                  options={activeChannelOptions}
                  placeholder="All channels"
                  value={ruleFilterDraft.channelCodes}
                  onChange={(channelCodes) =>
                    setRuleFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      channelCodes,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Skill Queue" width={240}>
                <Select
                  allowClear
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) =>
                    `+${omittedValues.length}`
                  }
                  mode="multiple"
                  options={activeSkillQueueOptions}
                  placeholder="All skill queues"
                  value={ruleFilterDraft.skillQueueCodes}
                  onChange={(skillQueueCodes) =>
                    setRuleFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      skillQueueCodes,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Customer Segment" width={220}>
                <Select
                  allowClear
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) =>
                    `+${omittedValues.length}`
                  }
                  mode="multiple"
                  options={verificationV2CustomerSegmentOptions}
                  placeholder="All segments"
                  value={ruleFilterDraft.customerSegments}
                  onChange={(customerSegments) =>
                    setRuleFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      customerSegments:
                        customerSegments as VerificationV2CustomerSegment[],
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Status" width={150}>
                <Select
                  options={ruleStatusOptions}
                  value={ruleFilterDraft.status}
                  onChange={(status) =>
                    setRuleFilterDraft((currentDraft) => ({
                      ...currentDraft,
                      status,
                    }))
                  }
                />
              </AdminFilterField>
            </>
          }
          primaryActions={
            <div className="call-management-list__add-actions">
              <BaseButton
                icon={<BookOutlined />}
                variant="secondary"
                onClick={() => setQuestionBankOpen(true)}
              >
                Question Bank
              </BaseButton>
              <BaseButton
                icon={<PlusOutlined />}
                variant="primary"
                onClick={() => openRuleModal('create')}
              >
                Add
              </BaseButton>
            </div>
          }
        />
        <AdminTable<VerificationV2Rule>
          columns={columns}
          dataSource={filteredRules}
          pagination={{}}
          rowKey="id"
          horizontalScroll={1080}
        />
      </BaseCard>

      <AdminModal
        destroyOnClose
        open={Boolean(ruleToDelete)}
        title="Delete Verification Rule"
        width={520}
        onCancel={closeDeleteRuleConfirm}
      >
        <div className="routing-config-crud-modal__delete">
          <Alert
            showIcon
            description="This deletes the rule in the current demo session. Question Bank items are not deleted."
            message={
              ruleToDelete
                ? `Delete ${ruleToDelete.id}?`
                : 'Delete this verification rule?'
            }
            type="warning"
          />
        </div>
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeDeleteRuleConfirm}>
            Cancel
          </BaseButton>
          <BaseButton variant="danger" onClick={deleteRule}>
            Delete
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>

      <AdminModal
        centered
        className="verification-rule-v2-modal"
        open={Boolean(ruleDraft)}
        title={
          ruleMode === 'create'
            ? 'Add Verification Rule'
            : ruleMode === 'edit'
              ? 'Edit Verification Rule'
              : 'View Verification Rule'
        }
        width={1080}
        onCancel={closeRuleModal}
      >
        {ruleDraft && (
          <div className="verification-rule-v2-modal__content">
            <div className="verification-rule-v2-modal__scroll">
              {ruleSubmitAttempted && ruleValidationErrors.length > 0 && (
                <Alert
                  showIcon
                  message={ruleValidationErrors.join(' ')}
                  type="error"
                />
              )}
              <div className="verification-rule-v2-modal__form">
                <AdminFormField label="Channel" required>
                  <Select
                    disabled={isRuleViewMode}
                    maxTagCount={1}
                    maxTagPlaceholder={(omittedValues) =>
                      `+${omittedValues.length}`
                    }
                    mode="multiple"
                    options={activeChannelOptions}
                    value={ruleDraft.channelCodes}
                    onChange={(channelCodes) => patchRuleDraft({ channelCodes })}
                  />
                </AdminFormField>
                <AdminFormField label="Skill Queue" required>
                  <Select
                    disabled={isRuleViewMode}
                    options={activeSkillQueueOptions}
                    value={ruleDraft.skillQueueCode}
                    onChange={(skillQueueCode) =>
                      patchRuleDraft({ skillQueueCode })
                    }
                  />
                </AdminFormField>
                <AdminFormField label="Customer Segment" required>
                  <Select
                    disabled={isRuleViewMode}
                    maxTagCount={1}
                    maxTagPlaceholder={(omittedValues) =>
                      `+${omittedValues.length}`
                    }
                    mode="multiple"
                    options={verificationV2CustomerSegmentOptions}
                    value={ruleDraft.customerSegments}
                    onChange={(customerSegments) =>
                      patchRuleDraft({
                        customerSegments:
                          customerSegments as VerificationV2CustomerSegment[],
                      })
                    }
                  />
                </AdminFormField>
                <AdminFormField
                  className="verification-rule-v2-modal__switch-field"
                  label="Status"
                >
                  <span>
                    <Switch
                      checked={ruleDraft.status === 'enabled'}
                      disabled={isRuleViewMode}
                      size="small"
                      onChange={(checked) =>
                        patchRuleDraft({
                          status: checked ? 'enabled' : 'disabled',
                        })
                      }
                    />
                  </span>
                </AdminFormField>
              </div>

              <section className="verification-rule-v2-section">
              <div className="verification-rule-v2-section__title">
                <strong>Question Configuration</strong>
              </div>
              <div className="verification-rule-v2-scenario-strip">
                <div className="verification-rule-v2-scenario-strip__header">
                  <span>Verification Scenario</span>
                  {!isRuleViewMode && (
                    <BaseButton
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={openScenarioCreateModal}
                    >
                      Scenario
                    </BaseButton>
                  )}
                </div>
                <div
                  className="verification-rule-v2-scenario-tabs"
                  role="tablist"
                >
                  {draftScenarios.map((scenario) => {
                    const isActiveScenario = scenario.id === activeScenario?.id
                    const isRenamingScenario =
                      renamingScenarioId === scenario.id && !isRuleViewMode

                    return (
                      <div
                        className={[
                          'verification-rule-v2-scenario-tab',
                          isActiveScenario
                            ? 'verification-rule-v2-scenario-tab--active'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        key={scenario.id}
                        role="presentation"
                      >
                        {isRenamingScenario ? (
                          <Input
                            autoFocus
                            className="verification-rule-v2-scenario-tab__input"
                            placeholder="Scenario Name"
                            value={scenario.name}
                            onBlur={() => setRenamingScenarioId(null)}
                            onChange={(event) =>
                              updateScenario(scenario.id, {
                                name: event.target.value,
                              })
                            }
                            onPressEnter={() => setRenamingScenarioId(null)}
                          />
                        ) : (
                          <button
                            aria-selected={isActiveScenario}
                            className="verification-rule-v2-scenario-tab__main"
                            role="tab"
                            type="button"
                            onClick={() => setActiveScenarioId(scenario.id)}
                          >
                            <strong>
                              {scenario.name || 'Default Scenario'}
                            </strong>
                          </button>
                        )}
                        {!isRuleViewMode && (
                          <span className="verification-rule-v2-scenario-tab__actions">
                            <button
                              aria-label={`Rename ${scenario.name}`}
                              type="button"
                              onClick={() => {
                                setActiveScenarioId(scenario.id)
                                setRenamingScenarioId(scenario.id)
                              }}
                            >
                              <EditOutlined />
                            </button>
                            {!scenario.isDefault && (
                              <button
                                aria-label={`Delete ${scenario.name}`}
                                type="button"
                                onClick={() => deleteScenario(scenario.id)}
                              >
                                <DeleteOutlined />
                              </button>
                            )}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {activeScenario && (
                <div className="verification-rule-v2-scenario-policy">
                  <AdminFormField label="Correct Required">
                    <InputNumber disabled value={activeScenarioCorrectRequired} />
                  </AdminFormField>
                  <AdminFormField
                    className="verification-rule-v2-modal__max-wrong-field"
                    label="Max Wrong"
                  >
                    <div className="verification-rule-v2-modal__max-wrong-control">
                      <span className="verification-rule-v2-modal__max-wrong-toggle">
                        <Switch
                          checked={
                            activeScenario.maxWrongAttempts === null ||
                            activeScenario.maxWrongAttempts === undefined
                          }
                          disabled={isRuleViewMode}
                          size="small"
                          onChange={(noLimit) =>
                            updateScenario(activeScenario.id, {
                              maxWrongAttempts: noLimit
                                ? null
                                : Math.min(3, activeScenarioQuestionCount),
                            })
                          }
                        />
                        <em>No Limit</em>
                      </span>
                      {activeScenario.maxWrongAttempts !== null &&
                        activeScenario.maxWrongAttempts !== undefined && (
                          <>
                            <InputNumber
                              disabled={isRuleViewMode}
                              max={activeScenarioQuestionCount}
                              min={0}
                              value={activeScenario.maxWrongAttempts}
                              onChange={(value) =>
                                updateScenario(activeScenario.id, {
                                  maxWrongAttempts: Math.min(
                                    activeScenarioQuestionCount,
                                    Math.max(0, Number(value ?? 0)),
                                  ),
                                })
                              }
                            />
                          </>
                        )}
                    </div>
                  </AdminFormField>
                  <AdminFormField
                    className="verification-rule-v2-scenario-policy__hint"
                    label="Agent Hint"
                  >
                    <Input
                      disabled={isRuleViewMode}
                      placeholder="Optional hint for agent"
                      value={activeScenario.agentHint ?? ''}
                      onChange={(event) =>
                        updateScenario(activeScenario.id, {
                          agentHint: event.target.value,
                        })
                      }
                    />
                  </AdminFormField>
                </div>
              )}
              {!isRuleViewMode && activeScenario && (
                <div className="verification-rule-v2-block-add-actions">
                  {addableFixedBlockTypes.map((blockType) => (
                    <BaseButton
                      icon={<PlusOutlined />}
                      key={blockType}
                      size="small"
                      onClick={() => addQuestionBlock(blockType)}
                    >
                      {verificationV2QuestionBlockTypeLabels[blockType]}
                    </BaseButton>
                  ))}
                  <BaseButton
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => addQuestionBlock('custom')}
                  >
                    Custom Block
                  </BaseButton>
                </div>
              )}
              <div className="verification-rule-v2-groups">
                {activeScenario?.questionBlocks.map((block) =>
                  renderQuestionBlockConfig(activeScenario, block),
                )}
                {(!activeScenario ||
                  activeScenario.questionBlocks.length === 0) && (
                    <div className="verification-rule-v2-empty-groups">
                      No question configured.
                    </div>
                  )}
              </div>
              </section>
            </div>

            <AdminModalFooter className="verification-rule-config-modal__footer">
              <BaseButton
                disabled={!previewRule || !previewInitialConditions}
                onClick={() => setPreviewOpen(true)}
              >
                Preview
              </BaseButton>
              <BaseButton onClick={closeRuleModal}>
                {isRuleViewMode ? 'Close' : 'Cancel'}
              </BaseButton>
              {!isRuleViewMode && (
                <BaseButton variant="primary" onClick={saveRule}>
                  Save
                </BaseButton>
              )}
            </AdminModalFooter>
          </div>
        )}
      </AdminModal>

      <AdminModal
        centered
        open={scenarioCreateOpen}
        title="Add Verification Scenario"
        width={520}
        onCancel={closeScenarioCreateModal}
      >
        <div className="verification-rule-v2-scenario-create">
          <label>
            <span>Scenario Name</span>
            <Input
              placeholder="Scenario Name"
              value={scenarioCreateDraft.name}
              onChange={(event) =>
                setScenarioCreateDraft((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <div className="verification-rule-v2-scenario-create__field">
            <span id="verification-scenario-create-from-label">
              Create From
            </span>
            <Radio.Group
              aria-labelledby="verification-scenario-create-from-label"
              buttonStyle="solid"
              className="verification-rule-v2-scenario-create__mode-group"
              value={scenarioCreateDraft.mode}
              onChange={(event) =>
                setScenarioCreateDraft((current) => ({
                  ...current,
                  mode: event.target.value as ScenarioCreateMode,
                }))
              }
            >
              <Radio.Button value="copy-current">
                Copy current scenario
              </Radio.Button>
              <Radio.Button value="blank">Blank scenario</Radio.Button>
            </Radio.Group>
          </div>
          <AdminModalFooter className="verification-rule-config-modal__footer">
            <BaseButton onClick={closeScenarioCreateModal}>Cancel</BaseButton>
            <BaseButton variant="primary" onClick={addScenario}>
              Add
            </BaseButton>
          </AdminModalFooter>
        </div>
      </AdminModal>

      <AdminModal
        centered
        className="inbound-verification-modal"
        open={previewOpen}
        title="Customer Verification Preview"
        width={820}
        onCancel={() => setPreviewOpen(false)}
      >
        {previewRule && previewInitialConditions && (
          <CustomerVerificationV2Panel
            key={previewKey}
            initialConditions={previewInitialConditions}
            questionBank={verificationV2QuestionBank}
            readonlyConditions
            rules={[previewRule]}
            variant="compact"
            onFinish={() => setPreviewOpen(false)}
          />
        )}
      </AdminModal>

      <AdminModal
        centered
        className="verification-rule-v2-question-picker-modal"
        open={Boolean(questionPicker)}
        title={
          questionPickerBlock
            ? `Select Questions - ${questionPickerBlock.name}`
            : 'Select Questions'
        }
        width={820}
        onCancel={closeQuestionPicker}
      >
        {questionPicker && (
          <div className="verification-rule-v2-question-picker">
            <Input
              allowClear
              placeholder="Search question name"
              value={questionPicker.searchText}
              onChange={(event) =>
                setQuestionPicker((current) =>
                  current
                    ? {
                        ...current,
                        searchText: event.target.value,
                      }
                    : current,
                )
              }
            />
            <div className="verification-rule-v2-question-picker__list">
              {filteredQuestionPickerQuestions.map((question) => (
                <label
                  className="verification-rule-v2-question-picker__item"
                  key={question.id}
                >
                  <Checkbox
                    checked={questionPicker.selectedQuestionIds.includes(
                      question.id,
                    )}
                    onChange={(event) =>
                      updateQuestionPickerSelection(
                        question.id,
                        event.target.checked,
                      )
                    }
                  />
                  <span>{question.questionName}</span>
                </label>
              ))}
              {filteredQuestionPickerQuestions.length === 0 && (
                <div className="verification-rule-v2-question-picker__empty">
                  No enabled question matched.
                </div>
              )}
            </div>
            <AdminModalFooter className="verification-rule-config-modal__footer">
              <span className="verification-rule-v2-question-picker__count">
                {questionPicker.selectedQuestionIds.length} selected
              </span>
              <BaseButton onClick={closeQuestionPicker}>Cancel</BaseButton>
              <BaseButton variant="primary" onClick={confirmQuestionPicker}>
                Confirm
              </BaseButton>
            </AdminModalFooter>
          </div>
        )}
      </AdminModal>

      <AdminModal
        centered
        className="verification-rule-v2-question-bank-modal"
        open={questionBankOpen}
        title="Question Bank"
        width={920}
        onCancel={() => setQuestionBankOpen(false)}
      >
        <div className="verification-rule-v2-question-bank">
          <div className="verification-rule-v2-question-bank__toolbar">
            <Input
              allowClear
              placeholder="Search question name"
              value={questionBankFilters.questionName}
              onChange={(event) =>
                setQuestionBankFilters((current) => ({
                  ...current,
                  questionName: event.target.value,
                }))
              }
            />
            <BaseButton
              onClick={() =>
                setQuestionBankFilters(defaultQuestionBankFilters)
              }
            >
              Reset
            </BaseButton>
            <BaseButton
              icon={<PlusOutlined />}
              variant="primary"
              onClick={() => openQuestionEditor()}
            >
              Add Question
            </BaseButton>
          </div>
          <AdminTable<VerificationV2Question>
            columns={questionColumns}
            dataSource={filteredQuestionBank}
            rowKey="id"
            tableVariant="modal"
          />
        </div>
      </AdminModal>

      <AdminModal
        centered
        open={Boolean(questionDeleteContext)}
        title="Delete Question"
        width={520}
        onCancel={closeDeleteQuestionConfirm}
      >
        {questionDeleteContext && (
          <>
            <Alert
              showIcon
              description={`This question is referenced ${questionDeleteContext.referenceCount} time(s) in ${questionDeleteContext.referencedRuleCount} rule(s). Deleting it will remove the question from those rule configurations.`}
              message="This question is already referenced."
              type="warning"
            />
            <AdminModalFooter>
              <BaseButton
                variant="secondary"
                onClick={closeDeleteQuestionConfirm}
              >
                Cancel
              </BaseButton>
              <BaseButton
                danger
                variant="primary"
                onClick={confirmDeleteQuestion}
              >
                Delete
              </BaseButton>
            </AdminModalFooter>
          </>
        )}
      </AdminModal>

      <AdminModal
        centered
        className="verification-rule-v2-question-editor-modal"
        open={questionEditorOpen}
        title={questionDraft.id ? 'Edit Question' : 'Add Question'}
        width={560}
        onCancel={closeQuestionEditor}
      >
        <div className="verification-rule-v2-question-editor">
          <label>
            <span>Question Name</span>
            <Input
              placeholder="Question Name"
              status={
                questionSubmitAttempted &&
                (!questionDraft.questionName.trim() || questionValidationError)
                  ? 'error'
                  : undefined
              }
              value={questionDraft.questionName}
              onChange={(event) => {
                setQuestionDraft((current) => ({
                  ...current,
                  questionName: event.target.value,
                }))
                setQuestionValidationError('')
              }}
            />
          </label>
          {questionSubmitAttempted && questionValidationError && (
            <Alert showIcon message={questionValidationError} type="error" />
          )}
          <AdminModalFooter className="verification-rule-config-modal__footer">
            <BaseButton onClick={closeQuestionEditor}>Cancel</BaseButton>
            <BaseButton variant="primary" onClick={saveQuestion}>
              Save
            </BaseButton>
          </AdminModalFooter>
        </div>
      </AdminModal>
    </AdminPage>
  )
}
