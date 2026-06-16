import type {
  AccessChannel,
  VerificationV2BaseQuestionGroup,
  VerificationV2CustomerSegment,
  VerificationV2DemoConditions,
  VerificationV2EffectiveQuestion,
  VerificationV2EffectiveRequirement,
  VerificationV2EffectiveRule,
  VerificationV2OrganizationSegment,
  VerificationV2Question,
  VerificationV2QuestionBlock,
  VerificationV2QuestionBlockType,
  VerificationV2QuestionGroup,
  VerificationV2QuestionGroupConfig,
  VerificationV2Rule,
  VerificationV2RuleMatch,
  VerificationV2Scenario,
  VerificationV2SpecialScenarioMode,
} from '../types'

export const verificationV2DefaultSkillQueueCode = 'SQ_GENERAL_ID'

export const verificationV2BaseGroupOrder: VerificationV2BaseQuestionGroup[] = [
  'mandatory',
  'dynamic',
  'static',
  'alternative',
]

export const verificationV2QuestionBlockTypeLabels: Record<
  VerificationV2QuestionBlockType,
  string
> = {
  alternative: 'Alternative',
  custom: 'Custom Block',
  dynamic: 'Dynamic',
  mandatory: 'Mandatory',
  static: 'Static',
}

export const verificationV2QuestionGroupOrder: VerificationV2QuestionGroup[] = [
  'mandatory',
  'dynamic',
  'static',
  'alternative',
  'layering',
  'branch',
  'customer',
]

export const verificationV2QuestionGroupLabels: Record<
  VerificationV2QuestionGroup,
  string
> = {
  alternative: 'Alternative',
  branch: 'Branch',
  customer: 'Customer',
  dynamic: 'Dynamic',
  layering: 'Layering',
  mandatory: 'Mandatory',
  static: 'Static',
}

export const verificationV2CustomerSegmentLabels: Record<
  VerificationV2CustomerSegment,
  string
> = {
  regular: 'Layanan Reguler',
  priority: 'Layanan Prioritas',
  solitaire: 'Solitaire',
  'organization-business': 'Organisasi/Bisnis',
}

export const verificationV2CustomerSegmentOrder: VerificationV2CustomerSegment[] =
  ['regular', 'priority', 'solitaire', 'organization-business']

export const verificationV2CustomerSegmentOptions =
  verificationV2CustomerSegmentOrder.map((value) => ({
    label: verificationV2CustomerSegmentLabels[value],
    value,
  }))

export const verificationV2OrganizationSegmentLabels: Record<
  VerificationV2OrganizationSegment,
  string
> = {
  none: 'None',
  'o1-o3': 'O1-O3',
  'o4-o5': 'O4-O5',
}

export const verificationV2SpecialScenarioModeLabels: Record<
  VerificationV2SpecialScenarioMode,
  string
> = {
  append: 'Append',
  replace: 'Replace',
}

export const verificationV2SpecialScenarioModeOptions = Object.entries(
  verificationV2SpecialScenarioModeLabels,
).map(([value, label]) => ({
  label,
  value: value as VerificationV2SpecialScenarioMode,
}))

function createVerificationV2BlockId(name: string, fallback: string) {
  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 36) || fallback

  return slug
}

export function getVerificationV2BlockGroup(
  block: Pick<VerificationV2QuestionBlock, 'blockType' | 'name'> | string,
): VerificationV2QuestionGroup {
  if (typeof block !== 'string') {
    const blockType = getVerificationV2QuestionBlockType(block)

    if (blockType !== 'custom') {
      return blockType
    }
  }

  const blockName = typeof block === 'string' ? block : block.name
  const normalizedName = blockName.trim().toLowerCase()

  if (normalizedName.includes('alternative')) {
    return 'alternative'
  }

  if (normalizedName.includes('branch') || normalizedName.includes('cabang')) {
    return 'branch'
  }

  if (
    normalizedName.includes('customer') ||
    normalizedName.includes('nasabah')
  ) {
    return 'customer'
  }

  if (normalizedName.includes('dynamic')) {
    return 'dynamic'
  }

  if (
    normalizedName.includes('layering') ||
    normalizedName.includes('ato') ||
    normalizedName.includes('add-on')
  ) {
    return 'layering'
  }

  if (normalizedName.includes('mandatory')) {
    return 'mandatory'
  }

  return 'static'
}

export function getVerificationV2QuestionBlockType(
  block: Pick<VerificationV2QuestionBlock, 'blockType' | 'name'>,
): VerificationV2QuestionBlockType {
  if (block.blockType) {
    return block.blockType
  }

  const normalizedName = block.name.trim().toLowerCase()
  const fixedType = verificationV2BaseGroupOrder.find(
    (type) =>
      normalizedName ===
      verificationV2QuestionBlockTypeLabels[type].toLowerCase(),
  )

  return fixedType ?? 'custom'
}

export function normalizeVerificationV2QuestionBlock(
  block: VerificationV2QuestionBlock,
): VerificationV2QuestionBlock {
  const blockType = getVerificationV2QuestionBlockType(block)

  return {
    ...block,
    blockType,
    name:
      blockType === 'custom'
        ? block.name
        : verificationV2QuestionBlockTypeLabels[blockType],
    questionIds: [...block.questionIds],
    requiredCorrect: blockType === 'alternative' ? 0 : block.requiredCorrect,
  }
}

export function createEmptyVerificationV2QuestionBlock(
  sequence: number,
  blockType: VerificationV2QuestionBlockType = 'custom',
): VerificationV2QuestionBlock {
  return {
    blockType,
    id: blockType === 'custom' ? `custom-block-${sequence}` : blockType,
    name:
      blockType === 'custom'
        ? `Custom Block ${sequence}`
        : verificationV2QuestionBlockTypeLabels[blockType],
    questionIds: [],
    requiredCorrect: 0,
  }
}

export function cloneVerificationV2QuestionBlock(
  block: VerificationV2QuestionBlock,
): VerificationV2QuestionBlock {
  return normalizeVerificationV2QuestionBlock(block)
}

export function cloneVerificationV2Scenario(
  scenario: VerificationV2Scenario,
): VerificationV2Scenario {
  return {
    ...scenario,
    agentHint: scenario.agentHint ?? '',
    maxWrongAttempts:
      scenario.maxWrongAttempts === undefined ? null : scenario.maxWrongAttempts,
    questionBlocks: scenario.questionBlocks.map(cloneVerificationV2QuestionBlock),
  }
}

export function createDefaultVerificationV2Scenario(
  questionBlocks: VerificationV2QuestionBlock[] = [],
): VerificationV2Scenario {
  return {
    agentHint: '',
    id: 'default',
    isDefault: true,
    maxWrongAttempts: null,
    name: 'Default',
    questionBlocks: questionBlocks.map(normalizeVerificationV2QuestionBlock),
  }
}

export function getVerificationV2ScenarioCorrectRequired(
  scenario: VerificationV2Scenario | null | undefined,
) {
  return (
    scenario?.questionBlocks.reduce(
      (sum, block) =>
        sum + normalizeVerificationV2QuestionBlock(block).requiredCorrect,
      0,
    ) ?? 0
  )
}

export function getVerificationV2ScenarioQuestionCount(
  scenario: VerificationV2Scenario | null | undefined,
) {
  return (
    scenario?.questionBlocks.reduce(
      (sum, block) => sum + block.questionIds.length,
      0,
    ) ?? 0
  )
}

export function cloneVerificationV2QuestionBank(
  questionBank: VerificationV2Question[],
) {
  return questionBank.map((question) => ({ ...question }))
}

export function cloneVerificationV2Rules(rules: VerificationV2Rule[]) {
  return rules.map(cloneVerificationV2Rule)
}

export function cloneVerificationV2Rule(
  rule: VerificationV2Rule,
): VerificationV2Rule {
  const scenarios = getVerificationV2RuleScenarios(rule)

  return {
    ...rule,
    channelCodes: [...rule.channelCodes],
    customerSegments: [...rule.customerSegments],
    groups: rule.groups
      ? (Object.fromEntries(
          Object.entries(rule.groups).map(([group, config]) => [
            group,
            cloneVerificationV2GroupConfig(config),
          ]),
        ) as VerificationV2Rule['groups'])
      : undefined,
    scenarios: scenarios.map(cloneVerificationV2Scenario),
    specialRules: {
      organizationOverride: {
        ...rule.specialRules.organizationOverride,
        requiredBySegment: {
          ...rule.specialRules.organizationOverride.requiredBySegment,
        },
      },
      scenarios: (rule.specialRules.scenarios ?? []).map((scenario) => ({
        ...scenario,
        mode: scenario.mode ?? 'append',
        questionIds: [...scenario.questionIds],
      })),
    },
  }
}

export function createEmptyVerificationV2Rule(
  defaults: Pick<
    VerificationV2Rule,
    'channelCodes' | 'customerSegments' | 'skillQueueCode'
  >,
  sequence: number,
): VerificationV2Rule {
  return {
    channelCodes: [...defaults.channelCodes],
    customerSegments: [...defaults.customerSegments],
    id: `v2-rule-${String(sequence).padStart(3, '0')}`,
    maxWrongAttempts: null,
    scenarios: [createDefaultVerificationV2Scenario()],
    skillQueueCode: defaults.skillQueueCode,
    specialRules: {
      organizationOverride: {
        enabled: false,
        firstThreeMustBeAskedFirst: false,
        requiredBySegment: {
          'o1-o3': 3,
          'o4-o5': 5,
        },
      },
      scenarios: [],
    },
    status: 'enabled',
    updatedAt: formatVerificationV2Timestamp(new Date()),
    updatedBy: 'Admin',
  }
}

export function cloneVerificationV2GroupConfig(
  config: VerificationV2QuestionGroupConfig,
): VerificationV2QuestionGroupConfig {
  return {
    ...config,
    questionIds: [...config.questionIds],
  }
}

export function createEmptyVerificationV2GroupConfig(
  requiredCorrect = 0,
): VerificationV2QuestionGroupConfig {
  return {
    askInOrder: true,
    questionIds: [],
    requiredCorrect,
  }
}

function buildQuestionBlocksFromLegacyGroups(
  groups: VerificationV2Rule['groups'],
) {
  if (!groups) {
    return []
  }

  return verificationV2BaseGroupOrder
    .map((group) => {
      const config = groups[group]

      return {
        blockType: group,
        id: createVerificationV2BlockId(
          verificationV2QuestionGroupLabels[group],
          group,
        ),
        name: verificationV2QuestionGroupLabels[group],
        questionIds: [...config.questionIds],
        requiredCorrect: group === 'alternative' ? 0 : config.requiredCorrect,
      }
    })
    .filter(
      (block) => block.questionIds.length > 0 || block.requiredCorrect > 0,
    )
}

function buildScenarioFromLegacySpecialScenario(
  baseScenario: VerificationV2Scenario,
  scenario: NonNullable<VerificationV2Rule['specialRules']>['scenarios'][number],
) {
  const scenarioMode = scenario.mode ?? 'append'
  const scenarioBlock: VerificationV2QuestionBlock = {
    blockType: 'custom',
    id: createVerificationV2BlockId(scenario.name, scenario.id),
    name: scenario.name,
    questionIds: [...scenario.questionIds],
    requiredCorrect: scenario.requiredCorrect,
  }

  return {
    id: scenario.id,
    isDefault: false,
    maxWrongAttempts: baseScenario.maxWrongAttempts,
    name: scenario.name,
    questionBlocks:
      scenarioMode === 'replace'
        ? [scenarioBlock]
        : [
            ...baseScenario.questionBlocks.map(
              cloneVerificationV2QuestionBlock,
            ),
            scenarioBlock,
          ],
  }
}

function buildLegacyVerificationV2Scenarios(
  rule: VerificationV2Rule,
): VerificationV2Scenario[] {
  const defaultScenario = {
    ...createDefaultVerificationV2Scenario(
      buildQuestionBlocksFromLegacyGroups(rule.groups),
    ),
    maxWrongAttempts: rule.maxWrongAttempts,
  }
  const scenarios = [defaultScenario]

  rule.specialRules.scenarios.forEach((scenario) => {
    scenarios.push(buildScenarioFromLegacySpecialScenario(defaultScenario, scenario))
  })

  return scenarios
}

export function getVerificationV2RuleScenarios(rule: VerificationV2Rule) {
  const scenarios =
    rule.scenarios && rule.scenarios.length > 0
      ? rule.scenarios
      : buildLegacyVerificationV2Scenarios(rule)
  const hasDefaultScenario = scenarios.some((scenario) => scenario.isDefault)
  const legacyScenarioIds = new Set([
    'default',
    ...(rule.specialRules.scenarios ?? []).map((scenario) => scenario.id),
  ])

  return scenarios.map((scenario, index) => ({
    ...scenario,
    agentHint: scenario.agentHint ?? '',
    isDefault: hasDefaultScenario ? scenario.isDefault : index === 0,
    maxWrongAttempts:
      scenario.maxWrongAttempts === undefined ||
      (scenario.maxWrongAttempts === null &&
        rule.maxWrongAttempts !== null &&
        Boolean(rule.groups) &&
        legacyScenarioIds.has(scenario.id))
        ? rule.maxWrongAttempts
        : scenario.maxWrongAttempts,
    questionBlocks: scenario.questionBlocks.map(
      normalizeVerificationV2QuestionBlock,
    ),
  }))
}

export function getDefaultVerificationV2Scenario(rule: VerificationV2Rule) {
  const scenarios = getVerificationV2RuleScenarios(rule)

  return (
    scenarios.find((scenario) => scenario.isDefault) ?? scenarios[0] ?? null
  )
}

export function formatVerificationV2Timestamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function getVerificationV2BaseCorrectRequired(rule: VerificationV2Rule) {
  return getVerificationV2ScenarioCorrectRequired(
    getDefaultVerificationV2Scenario(rule),
  )
}

export function getVerificationV2BaseQuestionCount(rule: VerificationV2Rule) {
  return getVerificationV2ScenarioQuestionCount(
    getDefaultVerificationV2Scenario(rule),
  )
}

export function getVerificationV2RuleQuestionCount(rule: VerificationV2Rule) {
  return Math.max(
    0,
    ...getVerificationV2RuleScenarios(rule).map(
      getVerificationV2ScenarioQuestionCount,
    ),
  )
}

export function findVerificationV2Question(
  questionBank: VerificationV2Question[],
  questionId: string,
) {
  return questionBank.find((question) => question.id === questionId)
}

export function buildVerificationV2Questions(
  questionBank: VerificationV2Question[],
  questionIds: string[],
  group: VerificationV2QuestionGroup,
  options: {
    blockId?: string
    groupLabel?: string
  } = {},
): VerificationV2EffectiveQuestion[] {
  return questionIds
    .map((questionId) => findVerificationV2Question(questionBank, questionId))
    .filter((question): question is VerificationV2Question => Boolean(question))
    .map((question) => ({
      blockId: options.blockId ?? group,
      group,
      groupLabel: options.groupLabel,
      id: question.id,
      questionName: question.questionName,
    }))
}

export function findMatchingVerificationV2Rule(
  rules: VerificationV2Rule[],
  conditions: Pick<
    VerificationV2DemoConditions,
    'channelCode' | 'customerSegment' | 'skillQueueCode'
  >,
) {
  return (
    rules.find(
      (rule) =>
        rule.status === 'enabled' &&
        rule.channelCodes.includes(conditions.channelCode) &&
        rule.skillQueueCode === conditions.skillQueueCode &&
        rule.customerSegments.includes(conditions.customerSegment),
    ) ?? null
  )
}

export function findVerificationV2RuleMatch(
  rules: VerificationV2Rule[],
  conditions: Pick<
    VerificationV2DemoConditions,
    'channelCode' | 'customerSegment' | 'skillQueueCode'
  >,
): VerificationV2RuleMatch {
  const exactRule =
    rules.find(
      (rule) =>
        rule.status === 'enabled' &&
        rule.channelCodes.includes(conditions.channelCode) &&
        rule.skillQueueCode === conditions.skillQueueCode &&
        rule.customerSegments.includes(conditions.customerSegment),
    ) ?? null

  if (exactRule) {
    return {
      matchType: 'exact',
      rule: exactRule,
    }
  }

  return {
    matchType: 'none',
    rule: null,
  }
}

export function buildEffectiveVerificationV2Rule(
  rule: VerificationV2Rule,
  questionBank: VerificationV2Question[],
  conditions: VerificationV2DemoConditions,
): VerificationV2EffectiveRule {
  const questions: VerificationV2EffectiveQuestion[] = []
  const questionGroupLabels: Partial<Record<VerificationV2QuestionGroup, string>> =
    {}
  const requiredBlocks: VerificationV2EffectiveRequirement[] = []
  const matchedSpecialRules: string[] = []
  const scenarios = getVerificationV2RuleScenarios(rule)
  const defaultScenario =
    scenarios.find((scenario) => scenario.isDefault) ?? scenarios[0]
  const selectedScenario =
    scenarios.find((scenario) => scenario.id === conditions.scenarioId) ??
    defaultScenario

  selectedScenario?.questionBlocks.forEach((block) => {
    const group = getVerificationV2BlockGroup(block)
    questionGroupLabels[group] = block.name

    questions.push(
      ...buildVerificationV2Questions(
        questionBank,
        block.questionIds,
        group,
        {
          blockId: block.id,
          groupLabel: block.name,
        },
      ),
    )

    if (block.requiredCorrect > 0) {
      requiredBlocks.push({
        blockId: block.id,
        group,
        label: block.name,
        requiredCount: block.requiredCorrect,
      })
    }
  })

  let correctRequired = getVerificationV2ScenarioCorrectRequired(
    selectedScenario,
  )

  if (selectedScenario && !selectedScenario.isDefault) {
    matchedSpecialRules.push(selectedScenario.name)
  }

  if (
    rule.specialRules.organizationOverride.enabled &&
    conditions.customerSegment === 'organization-business' &&
    conditions.organizationSegment !== 'none'
  ) {
    const required =
      rule.specialRules.organizationOverride.requiredBySegment[
        conditions.organizationSegment
      ]
    const label =
      conditions.organizationSegment === 'o1-o3' ? 'O1-O3' : 'O4-O5'
    matchedSpecialRules.push(`Organization Segment ${label}`)
    correctRequired = Math.max(correctRequired, required)

    if (rule.specialRules.organizationOverride.firstThreeMustBeAskedFirst) {
      matchedSpecialRules.push('First 3 questions must be asked first')
    }
  }

  return {
    agentHint: selectedScenario?.agentHint?.trim() || undefined,
    correctRequired,
    matchedSpecialRules,
    maxWrongAttempts:
      selectedScenario?.maxWrongAttempts === undefined
        ? rule.maxWrongAttempts
        : selectedScenario.maxWrongAttempts,
    questions,
    questionGroupLabels,
    requiredBlocks,
    scenarioId: selectedScenario?.id ?? 'default',
    scenarioName: selectedScenario?.name ?? 'Default',
    sourceRule: rule,
  }
}

export function getDefaultVerificationV2ChannelCode(
  accessChannel: AccessChannel,
) {
  if (accessChannel === 'Phone') {
    return 'PHONE'
  }

  if (accessChannel === 'WhatsApp') {
    return 'WHATSAPP'
  }

  if (accessChannel === 'Webchat') {
    return 'WEBCHAT'
  }

  if (
    accessChannel === 'BankApp' ||
    accessChannel === 'BankApp Voice' ||
    accessChannel === 'BankApp Video' ||
    accessChannel === 'Video'
  ) {
    return 'BANKAPP'
  }

  return 'PHONE'
}

export function getDefaultVerificationV2SkillQueueCode(
  accessChannel: AccessChannel,
  accessMenuName?: string,
) {
  const menuName = accessMenuName?.toLowerCase() ?? ''
  const isPrioSoliMenu =
    menuName.includes('prio') ||
    menuName.includes('priority') ||
    menuName.includes('prioritas') ||
    menuName.includes('soli') ||
    menuName.includes('solitaire')

  if (
    isPrioSoliMenu &&
    (menuName.includes('kartu') || menuName.includes('credit'))
  ) {
    return 'SQ_PRIO_SOLI_KARTU_KREDIT'
  }

  if (isPrioSoliMenu) {
    return 'SQ_PRIO_SOLI_PERBANKAN'
  }

  if (menuName.includes('kartu') || menuName.includes('credit')) {
    return 'SQ_CARD_PRIORITY'
  }

  if (menuName.includes('paylater')) {
    return 'SQ_PAYLATER'
  }

  if (menuName.includes('merchant') || menuName.includes('edc')) {
    return 'SQ_MERCHANT_SOLUTION'
  }

  if (menuName.includes('kpr') || menuName.includes('rumah')) {
    return 'SQ_KPR'
  }

  if (menuName.includes('bisnis') || menuName.includes('business')) {
    return 'SQ_BANK_BISNIS'
  }

  if (accessChannel === 'Webchat') {
    return 'SQ_PAYLATER'
  }

  return 'SQ_GENERAL_ID'
}
