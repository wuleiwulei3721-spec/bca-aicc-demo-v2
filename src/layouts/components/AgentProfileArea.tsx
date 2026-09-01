import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Modal } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState } from 'react'
import { AgentAvatar } from '../../components'
import { headerAgentProfile } from '../../mock/agent'
import { useCallManagementStore } from '../../store'
import type { AgentStatus } from '../../types'
import { formatAgentDisplay } from '../../utils/agentDisplay'
import {
  createAuxStatus,
  getAuxReason,
  isAuxStatus,
  isPreAuxStatus,
} from '../../utils/agentStatus'
import { AgentSettingsModal } from './AgentSettingsModal'

export type AgentPresence = 'away' | 'busy' | 'offline' | 'ready'

const presenceClassName: Record<AgentPresence, string> = {
  away: 'aicc-agent-status--away',
  busy: 'aicc-agent-status--busy',
  offline: 'aicc-agent-status--offline',
  ready: 'aicc-agent-status--ready',
}

function formatAgentStatus(status: AgentStatus) {
  if (isPreAuxStatus(status)) {
    return `Pre-AUX: ${getAuxReason(status)}`
  }

  if (isAuxStatus(status)) {
    return `AUX: ${getAuxReason(status)}`
  }

  return status
}

interface AgentProfileAreaProps {
  agentName?: string
  employeeId?: string
  presence: AgentPresence
  roleName?: string
  status: AgentStatus
  teamName?: string
  hasActiveCustomerInteraction: boolean
  systemSoundEnabled: boolean
  onBlockedSignOut: () => void
  onServiceSignIn: () => void
  onStatusChange: (status: AgentStatus) => void
  onSystemSoundEnabledChange: (enabled: boolean) => void
}

export function AgentProfileArea({
  agentName = headerAgentProfile.name,
  employeeId,
  presence,
  roleName = headerAgentProfile.role,
  status,
  teamName = headerAgentProfile.team,
  hasActiveCustomerInteraction,
  systemSoundEnabled,
  onBlockedSignOut,
  onServiceSignIn,
  onStatusChange,
  onSystemSoundEnabledChange,
}: AgentProfileAreaProps) {
  const isSignedIn = status !== 'Unsigned'
  const formattedStatus = formatAgentStatus(status)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const busyReasons = useCallManagementStore((state) => state.busyReasons)
  const enabledBusyReasons = useMemo(
    () =>
      busyReasons
        .filter((reason) => reason.status === 'Active')
        .sort((left, right) =>
          left.busyReasonId.localeCompare(right.busyReasonId),
        ),
    [busyReasons],
  )

  const currentStatusItem: MenuProps['items'][number] = {
    key: 'current-agent-status',
    disabled: true,
    label: formattedStatus,
  }
  const readyItem: MenuProps['items'][number] = {
    key: 'ready',
    label: 'Ready',
  }
  const signOutItem: MenuProps['items'][number] = {
    key: 'sign-out',
    label: 'Sign Out',
  }
  const settingsItem: MenuProps['items'][number] = {
    key: 'agent-settings',
    label: 'Settings',
  }
  const auxReasonsItem: MenuProps['items'][number] = {
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
  }

  const signedInMenuItems: MenuProps['items'] =
    status === 'Not Ready'
      ? [
          currentStatusItem,
          { key: 'divider-ready', type: 'divider' },
          readyItem,
          { key: 'divider-aux-reasons', type: 'divider' },
          auxReasonsItem,
          { key: 'divider-sign-out', type: 'divider' },
          signOutItem,
          { key: 'divider-agent-settings', type: 'divider' },
          settingsItem,
        ]
      : status === 'Ready'
        ? [
            currentStatusItem,
            { key: 'divider-aux-reasons', type: 'divider' },
            auxReasonsItem,
            { key: 'divider-agent-settings', type: 'divider' },
            settingsItem,
          ]
        : isPreAuxStatus(status)
          ? [
              currentStatusItem,
              { key: 'divider-ready', type: 'divider' },
              readyItem,
              { key: 'divider-agent-settings', type: 'divider' },
              settingsItem,
            ]
          : [
              currentStatusItem,
              { key: 'divider-ready', type: 'divider' },
              readyItem,
              { key: 'divider-sign-out', type: 'divider' },
              signOutItem,
              { key: 'divider-agent-settings', type: 'divider' },
              settingsItem,
            ]

  const actionItems: MenuProps['items'] = isSignedIn
    ? signedInMenuItems
    : [
        { key: 'sign-in', label: 'Sign In' },
        { key: 'divider-agent-settings', type: 'divider' },
        settingsItem,
      ]

  const handleActionClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'sign-in') {
      onServiceSignIn()
      return
    }

    if (key === 'sign-out') {
      if (hasActiveCustomerInteraction) {
        onBlockedSignOut()
        return
      }

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

    if (key === 'ready') {
      onStatusChange('Ready')
      return
    }

    if (key === 'agent-settings') {
      setIsSettingsOpen(true)
      return
    }

    const selectedReason = enabledBusyReasons.find(
      (reason) => key === `aux-reason-${reason.busyReasonId}`,
    )

    if (selectedReason) {
      onStatusChange(createAuxStatus(selectedReason.busyReasonName))
    }
  }

  return (
    <>
      <div className="aicc-agent-profile">
        <span className="aicc-agent-profile__avatar-wrap">
          <AgentAvatar
            className="aicc-agent-profile__avatar"
            name={agentName}
            size={34}
          />
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
            {roleName} - {formatAgentDisplay(employeeId, agentName, ' ')}
          </span>
          <span className="aicc-agent-profile__team">
            {teamName} | {formattedStatus}
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
      <AgentSettingsModal
        open={isSettingsOpen}
        systemSoundEnabled={systemSoundEnabled}
        onClose={() => setIsSettingsOpen(false)}
        onSystemSoundEnabledChange={onSystemSoundEnabledChange}
      />
    </>
  )
}
