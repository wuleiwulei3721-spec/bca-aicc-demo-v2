import {
  BranchesOutlined,
  CustomerServiceOutlined,
  IdcardOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import type { ModuleVisibilityKey } from './moduleVisibility'
import { DesignSystem } from '../pages/DesignSystem'
import {
  BlacklistManagementPage,
  BusyReasonManagementPage,
  CallRecordQueryPage,
  CommonLinkManagementPage,
  CommonNumberManagementPage,
  CommonPhraseManagementPage,
  GlobalControlConfigurationPage,
  PriorityListManagementPage,
  SensitiveWordManagementPage,
  SessionEndReasonManagementPage,
  VerificationRuleV2Page,
} from '../pages/call-management'
import { EmployeeProfileManagementPage } from '../pages/employee-management'
import {
  BusinessTypesPage,
  ChannelsPage,
  SiteAccessVolumePage,
  SitesPage,
  SkillQueuesPage,
  VdnPage,
  WorkingTimePlansPage,
} from '../pages/routing-config/RoutingConfigDataPages'
import { SkillRoutingRulesPage } from '../pages/routing-config/SkillRoutingRulesPage'

export interface WorkspacePageTabDefinition {
  element: ReactNode
  icon: ReactNode
  label: string
  menuKey: string
  moduleKey: ModuleVisibilityKey
  routePath: string
  tabKey: string
}

const callManagementIcon = <CustomerServiceOutlined />
const routingConfigIcon = <BranchesOutlined />
const employeeManagementIcon = <IdcardOutlined />
const designSystemIcon = <SettingOutlined />

export const workspacePageTabDefinitions: WorkspacePageTabDefinition[] = [
  {
    element: <VerificationRuleV2Page />,
    icon: callManagementIcon,
    label: 'Verification Rules',
    menuKey: 'call-management-verification-rules',
    moduleKey: 'call-management',
    routePath: '/call-management/verification-rules',
    tabKey: 'page:call-management-verification-rules',
  },
  {
    element: <GlobalControlConfigurationPage />,
    icon: callManagementIcon,
    label: 'Global Control Configuration',
    menuKey: 'call-management-global-control-configuration',
    moduleKey: 'call-management',
    routePath: '/call-management/global-control-configuration',
    tabKey: 'page:call-management-global-control-configuration',
  },
  {
    element: <BlacklistManagementPage />,
    icon: callManagementIcon,
    label: 'Blacklist',
    menuKey: 'call-management-blacklist',
    moduleKey: 'call-management',
    routePath: '/call-management/blacklist',
    tabKey: 'page:call-management-blacklist',
  },
  {
    element: <PriorityListManagementPage />,
    icon: callManagementIcon,
    label: 'Priority List',
    menuKey: 'call-management-priority-list',
    moduleKey: 'call-management',
    routePath: '/call-management/priority-list',
    tabKey: 'page:call-management-priority-list',
  },
  {
    element: <CommonPhraseManagementPage />,
    icon: callManagementIcon,
    label: 'Common Phrase',
    menuKey: 'call-management-common-phrases',
    moduleKey: 'call-management',
    routePath: '/call-management/common-phrases',
    tabKey: 'page:call-management-common-phrases',
  },
  {
    element: <CommonLinkManagementPage />,
    icon: callManagementIcon,
    label: 'Common Link',
    menuKey: 'call-management-common-links',
    moduleKey: 'call-management',
    routePath: '/call-management/common-links',
    tabKey: 'page:call-management-common-links',
  },
  {
    element: <CommonNumberManagementPage />,
    icon: callManagementIcon,
    label: 'Common Number',
    menuKey: 'call-management-common-numbers',
    moduleKey: 'call-management',
    routePath: '/call-management/common-numbers',
    tabKey: 'page:call-management-common-numbers',
  },
  {
    element: <SensitiveWordManagementPage />,
    icon: callManagementIcon,
    label: 'Sensitive Word',
    menuKey: 'call-management-sensitive-words',
    moduleKey: 'call-management',
    routePath: '/call-management/sensitive-words',
    tabKey: 'page:call-management-sensitive-words',
  },
  {
    element: <BusyReasonManagementPage />,
    icon: callManagementIcon,
    label: 'Busy Reason',
    menuKey: 'call-management-busy-reasons',
    moduleKey: 'call-management',
    routePath: '/call-management/busy-reasons',
    tabKey: 'page:call-management-busy-reasons',
  },
  {
    element: <SessionEndReasonManagementPage />,
    icon: callManagementIcon,
    label: 'Abnormal End Reasons',
    menuKey: 'call-management-session-end-reasons',
    moduleKey: 'call-management',
    routePath: '/call-management/session-end-reasons',
    tabKey: 'page:call-management-session-end-reasons',
  },
  {
    element: <CallRecordQueryPage />,
    icon: callManagementIcon,
    label: 'Interaction Log',
    menuKey: 'call-management-call-record-query',
    moduleKey: 'call-management',
    routePath: '/call-management/call-record-query',
    tabKey: 'page:call-management-call-record-query',
  },
  {
    element: <VdnPage />,
    icon: routingConfigIcon,
    label: 'VDN',
    menuKey: 'routing-vdn',
    moduleKey: 'routing-config',
    routePath: '/routing-config/vdn',
    tabKey: 'page:routing-vdn',
  },
  {
    element: <SitesPage />,
    icon: routingConfigIcon,
    label: 'Access Sites',
    menuKey: 'routing-sites',
    moduleKey: 'routing-config',
    routePath: '/routing-config/sites',
    tabKey: 'page:routing-sites',
  },
  {
    element: <ChannelsPage />,
    icon: routingConfigIcon,
    label: 'Channels',
    menuKey: 'routing-channels',
    moduleKey: 'routing-config',
    routePath: '/routing-config/channels',
    tabKey: 'page:routing-channels',
  },
  {
    element: <BusinessTypesPage />,
    icon: routingConfigIcon,
    label: 'Business Types',
    menuKey: 'routing-business-types',
    moduleKey: 'routing-config',
    routePath: '/routing-config/business-types',
    tabKey: 'page:routing-business-types',
  },
  {
    element: <SkillQueuesPage />,
    icon: routingConfigIcon,
    label: 'Skill Queues',
    menuKey: 'routing-skill-queues',
    moduleKey: 'routing-config',
    routePath: '/routing-config/skill-queues',
    tabKey: 'page:routing-skill-queues',
  },
  {
    element: <SiteAccessVolumePage />,
    icon: routingConfigIcon,
    label: 'Site Access Volume',
    menuKey: 'routing-site-access-volume',
    moduleKey: 'routing-config',
    routePath: '/routing-config/site-access-volume',
    tabKey: 'page:routing-site-access-volume',
  },
  {
    element: <SkillRoutingRulesPage />,
    icon: routingConfigIcon,
    label: 'Skill Routing Rules',
    menuKey: 'routing-skill-routing-rules',
    moduleKey: 'routing-config',
    routePath: '/routing-config/skill-routing-rules',
    tabKey: 'page:routing-skill-routing-rules',
  },
  {
    element: <WorkingTimePlansPage />,
    icon: routingConfigIcon,
    label: 'Working Time Plans',
    menuKey: 'routing-working-time-plans',
    moduleKey: 'routing-config',
    routePath: '/routing-config/working-time-plans',
    tabKey: 'page:routing-working-time-plans',
  },
  {
    element: <EmployeeProfileManagementPage />,
    icon: employeeManagementIcon,
    label: 'Employee Profile',
    menuKey: 'employee-profile-management',
    moduleKey: 'employee-management',
    routePath: '/employee-management/employee-profiles',
    tabKey: 'page:employee-profile-management',
  },
  {
    element: <DesignSystem />,
    icon: designSystemIcon,
    label: 'Design System',
    menuKey: 'design-system',
    moduleKey: 'design-system',
    routePath: '/design-system',
    tabKey: 'page:design-system',
  },
]

export const workspacePageTabByMenuKey = Object.fromEntries(
  workspacePageTabDefinitions.map((definition) => [
    definition.menuKey,
    definition,
  ]),
) as Record<string, WorkspacePageTabDefinition>

export const workspacePageTabByRoutePath = Object.fromEntries(
  workspacePageTabDefinitions.map((definition) => [
    definition.routePath,
    definition,
  ]),
) as Record<string, WorkspacePageTabDefinition>

export const workspacePageTabByTabKey = Object.fromEntries(
  workspacePageTabDefinitions.map((definition) => [
    definition.tabKey,
    definition,
  ]),
) as Record<string, WorkspacePageTabDefinition>

export function getWorkspacePageTabByPathname(pathname: string) {
  return workspacePageTabByRoutePath[pathname] ?? null
}

export function isWorkspacePageTabKey(tabKey: string) {
  return tabKey.startsWith('page:')
}
