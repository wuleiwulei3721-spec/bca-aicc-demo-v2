import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { AgentWorkspace } from '../pages/AgentWorkspace'

export function WorkspacePageRouteOpener({ tabKey }: { tabKey: string }) {
  const navigate = useNavigate()
  const openWorkspacePageTab = useAppStore(
    (state) => state.openWorkspacePageTab,
  )

  useEffect(() => {
    openWorkspacePageTab(tabKey)
    navigate('/', { replace: true })
  }, [navigate, openWorkspacePageTab, tabKey])

  return <AgentWorkspace />
}

