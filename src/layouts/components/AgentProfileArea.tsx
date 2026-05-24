import {
  BankOutlined,
  CoffeeOutlined,
  DownOutlined,
  LoginOutlined,
  PoweroffOutlined,
} from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { headerAgentProfile } from '../../mock/agent'
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

  const actionItems: MenuProps['items'] = isSignedIn
    ? [
        {
          key: 'AUX - Ibadah',
          icon: <BankOutlined />,
          label: 'AUX - Ibadah',
        },
        {
          key: 'AUX - Makan',
          icon: <CoffeeOutlined />,
          label: 'AUX - Makan',
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

    if (key === 'AUX - Ibadah' || key === 'AUX - Makan') {
      onStatusChange(key)
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
  )
}
