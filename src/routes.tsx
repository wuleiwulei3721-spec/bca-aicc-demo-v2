import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLoginRoute, RequireAuth } from './components/AuthRouteGuards'
import { WorkspacePageRouteOpener } from './components/WorkspacePageRouteOpener'
import { isModuleVisible } from './config/moduleVisibility'
import { workspacePageTabDefinitions } from './config/workspacePageTabs'
import { AgentWorkspace, TlOutboundApprovalPage } from './pages'

const workspacePageRoutes = workspacePageTabDefinitions
  .filter((definition) => isModuleVisible(definition.moduleKey))
  .map((definition) => ({
    path: definition.routePath.replace(/^\//, ''),
    element: <WorkspacePageRouteOpener tabKey={definition.tabKey} />,
  }))

const callManagementFallbackRoutes = [
  {
    path: 'call-management',
    element: <Navigate replace to="/call-management/verification-rules" />,
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
    path: 'call-management/text-channel-settings',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
  {
    path: 'call-management/*',
    element: <Navigate replace to="/call-management/verification-rules" />,
  },
]

const routingConfigFallbackRoutes = isModuleVisible('routing-config')
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
        path: 'routing-config/channel-types',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/media-service-rule-plans',
        element: <Navigate replace to="/routing-config/channels" />,
      },
      {
        path: 'routing-config/access-accounts',
        element: <Navigate replace to="/routing-config/channels" />,
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

const employeeManagementFallbackRoutes = isModuleVisible('employee-management')
  ? [
      {
        path: 'employee-management',
        element: (
          <Navigate replace to="/employee-management/employee-profiles" />
        ),
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

const socialMediaFallbackRoutes = isModuleVisible('social-media')
  ? [
      {
        path: 'social-media',
        element: <Navigate replace to="/social-media/interaction-log" />,
      },
      {
        path: 'social-media/*',
        element: <Navigate replace to="/social-media/interaction-log" />,
      },
    ]
  : [
      {
        path: 'social-media',
        element: <Navigate replace to="/" />,
      },
      {
        path: 'social-media/*',
        element: <Navigate replace to="/" />,
      },
    ]

export const router = createBrowserRouter([
  {
    path: '/tl-outbound-approval',
    element: <TlOutboundApprovalPage />,
  },
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
      ...workspacePageRoutes,
      ...callManagementFallbackRoutes,
      ...socialMediaFallbackRoutes,
      ...routingConfigFallbackRoutes,
      ...employeeManagementFallbackRoutes,
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
