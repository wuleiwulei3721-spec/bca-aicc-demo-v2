export type VerificationV2QuestionGroup =
  | 'alternative'
  | 'branch'
  | 'customer'
  | 'dynamic'
  | 'layering'
  | 'mandatory'
  | 'static'

export type VerificationV2BaseQuestionGroup =
  | 'alternative'
  | 'dynamic'
  | 'mandatory'
  | 'static'

export type VerificationV2QuestionBlockType =
  | VerificationV2BaseQuestionGroup
  | 'custom'

export type VerificationV2CustomerSegment =
  | 'organization-business'
  | 'priority'
  | 'regular'
  | 'solitaire'

export type VerificationV2RuleStatus = 'disabled' | 'enabled'

export type VerificationV2OrganizationSegment = 'none' | 'o1-o3' | 'o4-o5'

export type VerificationV2SpecialScenarioMode = 'append' | 'replace'

export interface VerificationV2Question {
  id: string
  questionName: string
}

export interface VerificationV2QuestionGroupConfig {
  askInOrder: boolean
  questionIds: string[]
  requiredCorrect: number
}

export interface VerificationV2QuestionBlock {
  blockType?: VerificationV2QuestionBlockType
  id: string
  name: string
  questionIds: string[]
  requiredCorrect: number
}

export interface VerificationV2Scenario {
  agentHint?: string
  id: string
  isDefault: boolean
  maxWrongAttempts?: number | null
  name: string
  questionBlocks: VerificationV2QuestionBlock[]
}

export interface VerificationV2SpecialScenario {
  askInOrder: boolean
  id: string
  mode: VerificationV2SpecialScenarioMode
  name: string
  questionIds: string[]
  requiredCorrect: number
}

export interface VerificationV2OrganizationOverrideRule {
  enabled: boolean
  firstThreeMustBeAskedFirst: boolean
  requiredBySegment: Record<
    Exclude<VerificationV2OrganizationSegment, 'none'>,
    number
  >
}

export interface VerificationV2SpecialRules {
  organizationOverride: VerificationV2OrganizationOverrideRule
  scenarios: VerificationV2SpecialScenario[]
}

export interface VerificationV2Rule {
  channelCodes: string[]
  customerSegments: VerificationV2CustomerSegment[]
  groups?: Record<
    VerificationV2BaseQuestionGroup,
    VerificationV2QuestionGroupConfig
  >
  id: string
  maxWrongAttempts: number | null
  scenarios?: VerificationV2Scenario[]
  skillQueueCode: string
  specialRules: VerificationV2SpecialRules
  status: VerificationV2RuleStatus
  updatedAt: string
  updatedBy?: string
}

export type VerificationV2RuleMatchType =
  | 'exact'
  | 'none'

export interface VerificationV2RuleMatch {
  matchType: VerificationV2RuleMatchType
  rule: VerificationV2Rule | null
}

export interface VerificationV2DemoConditions {
  channelCode: string
  customerSegment: VerificationV2CustomerSegment
  organizationSegment: VerificationV2OrganizationSegment
  scenarioId: string
  skillQueueCode: string
}

export interface VerificationV2EffectiveQuestion {
  blockId: string
  group: VerificationV2QuestionGroup
  groupLabel?: string
  id: string
  questionName: string
}

export interface VerificationV2EffectiveRequirement {
  blockId: string
  group: VerificationV2QuestionGroup
  label: string
  requiredCount: number
}

export interface VerificationV2EffectiveRule {
  agentHint?: string
  correctRequired: number
  maxWrongAttempts: number | null
  matchedSpecialRules: string[]
  questions: VerificationV2EffectiveQuestion[]
  questionGroupLabels: Partial<Record<VerificationV2QuestionGroup, string>>
  requiredBlocks: VerificationV2EffectiveRequirement[]
  scenarioId: string
  scenarioName: string
  sourceRule: VerificationV2Rule
}
