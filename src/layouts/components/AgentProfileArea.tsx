import {
  CoffeeOutlined,
  DownOutlined,
  LoginOutlined,
  PoweroffOutlined,
} from '@ant-design/icons'
import { Alert, Avatar, Dropdown, Radio } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState } from 'react'
import { BaseButton, BaseModal } from '../../components'
import { headerAgentProfile } from '../../mock/agent'
import { useCallManagementStore } from '../../store'
import type { AgentStatus } from '../../types'

export type AgentPresence = 'away' | 'busy' | 'offline' | 'ready'

const presenceClassName: Record<AgentPresence, string> = {
  away: 'aicc-agent-status--away',
  busy: 'aicc-agent-status--busy',
  offline: 'aicc-agent-status--offline',
  ready: 'aicc-agent-status--ready',
}

interface AgentProfileAreaProps {
  presence: AgentPresence
  status: AgentStatus
  onStatusChange: (status: AgentStatus) => void
}

export function AgentProfileArea({
  presence,
  status,
  onStatusChange,
}: AgentProfileAreaProps) {
  const isSignedIn = status !== 'Unsigned'
  const busyReasons = useCallManagementStore((state) => state.busyReasons)
  const [isAuxReasonModalOpen, setIsAuxReasonModalOpen] = useState(false)
  const [selectedBusyReasonId, setSelectedBusyReasonId] = useState('')
  const enabledBusyReasons = useMemo(
    () =>
      busyReasons
        .filter((reason) => reason.status === 'Active')
        .sort((left, right) => {
          if (left.isDefault !== right.isDefault) {
            return left.isDefault ? -1 : 1
          }

          return left.busyReasonId.localeCompare(right.busyReasonId)
        }),
    [busyReasons],
  )
  const defaultBusyReasonId =
    enabledBusyReasons.find((reason) => reason.isDefault)?.busyReasonId ??
    enabledBusyReasons[0]?.busyReasonId ??
    ''

  const actionItems: MenuProps['items'] = isSignedIn
    ? [
        {
          key: 'aux',
          disabled: enabledBusyReasons.length === 0,
          icon: <CoffeeOutlined />,
          label:
            enabledBusyReasons.length > 0 ? 'AUX' : 'AUX (No enabled reason)',
        },
        {
          key: 'divider-sign-out',
          type: 'divider',
        },
        {
          key: 'sign-out',
          icon: <PoweroffOutlined />,
          label: 'Sign Out',
        },
      ]
    : [
        {
          key: 'sign-in',
          icon: <LoginOutlined />,
          label: 'Sign In',
        },
      ]

  const handleActionClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'sign-in') {
      onStatusChange('Ready')
      return
    }

    if (key === 'sign-out') {
      onStatusChange('Unsigned')
      return
    }

    if (key === 'aux' && enabledBusyReasons.length > 0) {
      setSelectedBusyReasonId(defaultBusyReasonId)
      setIsAuxReasonModalOpen(true)
    }
  }

  const handleAuxConfirm = () => {
    const selectedReason = enabledBusyReasons.find(
      (reason) => reason.busyReasonId === selectedBusyReasonId,
    )

    if (!selectedReason) {
      return
    }

    onStatusChange(`AUX - ${selectedReason.busyReasonName}`)
    setIsAuxReasonModalOpen(false)
  }

  return (
    <>
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
            {headerAgentProfile.role} - {headerAgentProfile.name}
          </span>
          <span className="aicc-agent-profile__team">
            {headerAgentProfile.team}
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

      <BaseModal
        className="aicc-aux-reason-modal"
        destroyOnClose
        kind="detail"
        open={isAuxReasonModalOpen}
        title="Select AUX Reason"
        width={460}
        onCancel={() => setIsAuxReasonModalOpen(false)}
      >
        {enabledBusyReasons.length > 0 ? (
          <Radio.Group
            className="aicc-aux-reason-list"
            value={selectedBusyReasonId}
            onChange={(event) =>
              setSelectedBusyReasonId(String(event.target.value))
            }
          >
            {enabledBusyReasons.map((reason) => (
              <label
                className={[
                  'aicc-aux-reason-list__item',
                  selectedBusyReasonId === reason.busyReasonId
                    ? 'aicc-aux-reason-list__item--selected'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={reason.busyReasonId}
              >
                <Radio value={reason.busyReasonId} />
                <span className="aicc-aux-reason-list__content">
                  <strong>{reason.busyReasonName}</strong>
                </span>
              </label>
            ))}
          </Radio.Group>
        ) : (
          <Alert
            showIcon
            message="No enabled AUX reason is available."
            type="warning"
          />
        )}

        <div className="aicc-modal-footer">
          <BaseButton
            variant="secondary"
            onClick={() => setIsAuxReasonModalOpen(false)}
          >
            Cancel
          </BaseButton>
          <BaseButton
            disabled={!selectedBusyReasonId}
            variant="primary"
            onClick={handleAuxConfirm}
          >
            Confirm
          </BaseButton>
        </div>
      </BaseModal>
    </>
  )
}
