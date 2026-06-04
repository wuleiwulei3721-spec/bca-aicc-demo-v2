import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicLayout } from './layouts'
import { AgentWorkspace, DesignSystem } from './pages'

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
        path: 'call-management',
        element: <Navigate replace to="/" />,
      },
      {
        path: 'call-management/*',
        element: <Navigate replace to="/" />,
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
