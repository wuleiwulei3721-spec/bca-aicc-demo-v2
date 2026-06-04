import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicLayout } from './layouts'
import {
  AccessAccountsPage,
  AgentWorkspace,
  BusinessTypesPage,
  ChannelsPage,
  DesignSystem,
  MediaServiceRulePlansPage,
  RoutingConfigurationPage,
  RouteElementsPage,
  SitesPage,
  SiteAccessVolumePage,
  SkillQueuesPage,
  SkillRoutingRulesPage,
  TextChannelSettingsPage,
  VdnPage,
  WorkingTimePlansPage,
} from './pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <AgentWorkspace />,
      },
      {
        path: 'design-system',
        element: <DesignSystem />,
      },
      {
        path: 'call-management/routing-configuration',
        element: <RoutingConfigurationPage />,
      },
      {
        path: 'call-management/text-channel-settings',
        element: <TextChannelSettingsPage />,
      },
      {
        path: 'routing-config',
        element: <Navigate replace to="/routing-config/route-elements" />,
      },
      {
        path: 'routing-config/route-elements',
        element: <RouteElementsPage />,
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
        path: 'routing-config/channels',
        element: <ChannelsPage />,
      },
      {
        path: 'routing-config/media-service-rule-plans',
        element: <MediaServiceRulePlansPage />,
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
        element: <AccessAccountsPage />,
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
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
