import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLoginRoute, RequireAuth } from './components/AuthRouteGuards'
import { isModuleVisible } from './config/moduleVisibility'
import {
  AgentWorkspace,
  BlacklistManagementPage,
  BusyReasonManagementPage,
  CallRecordQueryPage,
  CommonLinkManagementPage,
  CommonNumberManagementPage,
  CommonPhraseManagementPage,
  BusinessTypesPage,
  ChannelsPage,
  DesignSystem,
  EmployeeProfileManagementPage,
  GlobalControlConfigurationPage,
  PriorityListManagementPage,
  SensitiveWordManagementPage,
  SessionEndReasonManagementPage,
  SitesPage,
  SiteAccessVolumePage,
  SkillQueuesPage,
  SkillRoutingRulesPage,
  VerificationRuleV2Page,
  VdnPage,
  WorkingTimePlansPage,
} from './pages'

const callManagementRoutes = [
  {
    path: 'call-management',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
  {
    path: 'call-management/verification-rules',
    element: <VerificationRuleV2Page />,
  },
  {
    path: 'call-management/verification-rule-v2',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
  {
    path: 'call-management/routing-configuration',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
  {
    path: 'call-management/global-control-configuration',
    element: <GlobalControlConfigurationPage />,
  },
  {
    path: 'call-management/blacklist',
    element: <BlacklistManagementPage />,
  },
  {
    path: 'call-management/priority-list',
    element: <PriorityListManagementPage />,
  },
  {
    path: 'call-management/common-phrases',
    element: <CommonPhraseManagementPage />,
  },
  {
    path: 'call-management/common-links',
    element: <CommonLinkManagementPage />,
  },
  {
    path: 'call-management/common-numbers',
    element: <CommonNumberManagementPage />,
  },
  {
    path: 'call-management/sensitive-words',
    element: <SensitiveWordManagementPage />,
  },
  {
    path: 'call-management/busy-reasons',
    element: <BusyReasonManagementPage />,
  },
  {
    path: 'call-management/session-end-reasons',
    element: <SessionEndReasonManagementPage />,
  },
  {
    path: 'call-management/call-record-query',
    element: <CallRecordQueryPage />,
  },
  {
    path: 'call-management/text-channel-settings',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
  {
    path: 'call-management/*',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
]

const routingConfigRoutes = isModuleVisible('routing-config')
  ? [
      {
        path: 'routing-config',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/route-elements',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/vdn',
        element: <VdnPage />,
      },
      {
        path: 'routing-config/sites',
        element: <SitesPage />,
      },
      {
        path: 'routing-config/channel-types',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/channels',
        element: <ChannelsPage />,
      },
      {
        path: 'routing-config/media-service-rule-plans',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/business-types',
        element: <BusinessTypesPage />,
      },
      {
        path: 'routing-config/skill-queues',
        element: <SkillQueuesPage />,
      },
      {
        path: 'routing-config/access-accounts',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/site-access-volume',
        element: <SiteAccessVolumePage />,
      },
      {
        path: 'routing-config/skill-routing-rules',
        element: <SkillRoutingRulesPage />,
      },
      {
        path: 'routing-config/working-time-plans',
        element: <WorkingTimePlansPage />,
      },
    ]
  : [
      {
        path: 'routing-config',
        element: <Navigate replace to="/" />,
      },
      {
        path: 'routing-config/*',
        element: <Navigate replace to="/" />,
      },
    ]

const designSystemRoute = isModuleVisible('design-system')
  ? [
      {
        path: 'design-system',
        element: <DesignSystem />,
      },
    ]
  : [
      {
        path: 'design-system',
        element: <Navigate replace to="/" />,
      },
    ]

const employeeManagementRoutes = isModuleVisible('employee-management')
  ? [
      {
        path: 'employee-management',
        element: (
          <Navigate replace to="/employee-management/employee-profiles" />
        ),
      },
      {
        path: 'employee-management/employee-profiles',
        element: <EmployeeProfileManagementPage />,
      },
      {
        path: 'employee-management/*',
        element: (
          <Navigate replace to="/employee-management/employee-profiles" />
        ),
      },
    ]
  : [
      {
        path: 'employee-management',
        element: <Navigate replace to="/" />,
      },
      {
        path: 'employee-management/*',
        element: <Navigate replace to="/" />,
      },
    ]

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicLoginRoute />,
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <AgentWorkspace />,
      },
      ...designSystemRoute,
      ...callManagementRoutes,
      ...routingConfigRoutes,
      ...employeeManagementRoutes,
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
