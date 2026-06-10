import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicLayout } from './layouts'
import {
  AgentWorkspace,
  BusyReasonManagementPage,
  BusinessTypesPage,
  ChannelsPage,
  DesignSystem,
  GlobalControlConfigurationPage,
  RoutingConfigurationPage,
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
        path: 'call-management/global-control-configuration',
        element: <GlobalControlConfigurationPage />,
      },
      {
        path: 'call-management/busy-reasons',
        element: <BusyReasonManagementPage />,
      },
      {
        path: 'call-management/text-channel-settings',
        element: <TextChannelSettingsPage />,
      },
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
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
