import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicLayout } from './layouts'
import { AgentWorkspace } from './pages'

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
        path: '*',
        element: <Navigate replace to="/" />,
      },
    ],
  },
])
