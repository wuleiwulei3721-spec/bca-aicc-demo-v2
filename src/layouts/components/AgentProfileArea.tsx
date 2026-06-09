import { DownOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Modal } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo } from 'react'
import { agentServiceModeOptions } from '../../mock/auth'
import { headerAgentProfile } from '../../mock/agent'
import { useCallManagementStore } from '../../store'
import type { AgentServiceMode, AgentStatus } from '../../types'

export type AgentPresence = 'away' | 'busy' | 'offline' | 'ready'

const presenceClassName: Record<AgentPresence, string> = {
  away: 'aicc-agent-status--away',
  busy: 'aicc-agent-status--busy',
  offline: 'aicc-agent-status--offline',
  ready: 'aicc-agent-status--ready',
}

interface AgentProfileAreaProps {
  agentName?: string
  presence: AgentPresence
  roleName?: string
  serviceMode: AgentServiceMode | null
  status: AgentStatus
  teamName?: string
  onServiceSignIn: (mode: AgentServiceMode) => void
  onStatusChange: (status: AgentStatus) => void
}

export function AgentProfileArea({
  agentName = headerAgentProfile.name,
  presence,
  roleName = headerAgentProfile.role,
  serviceMode,
  status,
  teamName = headerAgentProfile.team,
  onServiceSignIn,
  onStatusChange,
}: AgentProfileAreaProps) {
  const isSignedIn = status !== 'Unsigned'
  const busyReasons = useCallManagementStore((state) => state.busyReasons)
  const serviceModeLabel = serviceMode
    ? (agentServiceModeOptions.find((option) => option.value === serviceMode)
        ?.label ?? serviceMode)
    : ''
  const enabledBusyReasons = useMemo(
    () =>
      busyReasons
        .filter((reason) => reason.status === 'Active')
        .sort((left, right) =>
          left.busyReasonId.localeCompare(right.busyReasonId),
        ),
    [busyReasons],
  )

  const signInItems = agentServiceModeOptions.map((option) => ({
    key: `sign-in-${option.value}`,
    label: option.label,
  }))

  const actionItems: MenuProps['items'] = isSignedIn
    ? [
        {
          key: 'current-service-mode',
          disabled: true,
          label: serviceModeLabel
            ? `Signed in: ${serviceModeLabel}`
            : 'Signed in',
        },
        {
          key: 'divider-current-service-mode',
          type: 'divider',
        },
        {
          key: 'aux-reasons',
          label: 'AUX',
          type: 'group',
          children:
            enabledBusyReasons.length > 0
              ? enabledBusyReasons.map((reason) => ({
                  key: `aux-reason-${reason.busyReasonId}`,
                  label: reason.busyReasonName,
                }))
              : [
                  {
                    key: 'no-enabled-aux-reason',
                    disabled: true,
                    label: 'No enabled AUX reason',
                  },
                ],
        },
        {
          key: 'divider-sign-out',
          type: 'divider',
        },
        {
          key: 'sign-out',
          label: 'Sign Out',
        },
      ]
    : [
        {
          key: 'sign-in',
          label: 'Sign In',
          type: 'group',
          children: signInItems,
        },
      ]

  const handleActionClick: MenuProps['onClick'] = ({ key }) => {
    const selectedSignInMode = agentServiceModeOptions.find(
      (option) => key === `sign-in-${option.value}`,
    )

    if (selectedSignInMode) {
      onServiceSignIn(selectedSignInMode.value)
      return
    }

    if (key === 'sign-out') {
      Modal.confirm({
        cancelText: 'Cancel',
        centered: true,
        content:
          'This will sign out the current media session and return the agent status to Unsigned.',
        okText: 'Sign Out',
        title: 'Confirm Sign Out',
        onOk: () => onStatusChange('Unsigned'),
      })
      return
    }

    const selectedReason = enabledBusyReasons.find(
      (reason) => key === `aux-reason-${reason.busyReasonId}`,
    )

    if (selectedReason) {
      onStatusChange(`AUX - ${selectedReason.busyReasonName}`)
    }
  }

  return (
    <div className="aicc-agent-profile">
      <span className="aicc-agent-profile__avatar-wrap">
        <Avatar
          className="aicc-agent-profile__avatar"
          size={34}
          src={headerAgentProfile.avatarUrl}
        >
          BK
        </Avatar>
        <span
          className={[
            'aicc-agent-profile__status-dot',
            presenceClassName[presence],
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </span>

      <span className="aicc-agent-profile__meta">
        <span className="aicc-agent-profile__name">
          {roleName} - {agentName}
        </span>
        <span className="aicc-agent-profile__team">
          {teamName}
          {serviceModeLabel ? ` | ${serviceModeLabel}` : ''}
        </span>
      </span>

      <Dropdown
        classNames={{ root: 'aicc-agent-status-menu' }}
        menu={{ items: actionItems, onClick: handleActionClick }}
        placement="bottomRight"
        trigger={['click']}
      >
        <button
          aria-label="Agent status menu"
          className="aicc-agent-profile__action"
          type="button"
        >
          <DownOutlined />
        </button>
      </Dropdown>
    </div>
  )
}
