import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLoginRoute, RequireAuth } from './components/AuthRouteGuards'
import {
  AgentWorkspace,
  BusyReasonManagementPage,
  DesignSystem,
  TextChannelSettingsPage,
  VerificationRulesPage,
} from './pages'

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
      {
        path: 'call-management',
        element: <Navigate replace to="/call-management/verification-rules" />,
      },
      {
        path: 'call-management/verification-rules',
        element: <VerificationRulesPage />,
      },
      {
        path: 'call-management/text-channel-settings',
        element: <TextChannelSettingsPage />,
      },
      {
        path: 'call-management/busy-reasons',
        element: <BusyReasonManagementPage />,
      },
      {
        path: 'call-management/*',
        element: <Navigate replace to="/call-management/verification-rules" />,
      },
      {
        path: 'routing-config',
        element: <Navigate replace to="/" />,
      },
      {
        path: 'routing-config/*',
        element: <Navigate replace to="/" />,
      },
      {
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
