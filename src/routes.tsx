import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLoginRoute, RequireAuth } from './components/AuthRouteGuards'
import { featureFlags } from './config/featureFlags'
import {
  AgentWorkspace,
  BlacklistManagementPage,
  BusyReasonManagementPage,
  CommonLinkManagementPage,
  CommonPhraseManagementPage,
  BusinessTypesPage,
  ChannelsPage,
  DesignSystem,
  GlobalControlConfigurationPage,
  PriorityListManagementPage,
  SensitiveWordManagementPage,
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
    path: 'call-management/sensitive-words',
    element: <SensitiveWordManagementPage />,
  },
  {
    path: 'call-management/busy-reasons',
    element: <BusyReasonManagementPage />,
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

const routingConfigRoutes = featureFlags.enableRoutingConfigMenus
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
      {
        path: 'design-system',
        element: <DesignSystem />,
      },
      ...callManagementRoutes,
      ...routingConfigRoutes,
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
