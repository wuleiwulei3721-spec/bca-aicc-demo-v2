import { useMemo, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  SearchInput,
} from '../../components'
import { transferAgents, transferSkills } from '../../mock/transfer'
import { useCallManagementStore } from '../../store'
import type {
  CommonNumberEntry,
  TransferAgent,
  TransferAgentStatus,
  TransferSkill,
} from '../../types'

interface TransferModalProps {
  open: boolean
  variant?: TransferModalVariant
  onClose: () => void
}

type TransferModalVariant = 'call' | 'conversation'

const callAgentActions = ['Consult', 'Transfer', 'Conference']
const conversationPrimaryAgentActions = ['Transfer', 'Conference']
const allFilterValue = 'all'
const transferStatusClassNames: Record<TransferAgentStatus, string> = {
  Ready: 'ready',
  Talking: 'talking',
  'Not Ready': 'not-ready',
}

function renderAgentStatus(status: TransferAgentStatus) {
  return (
    <Tag
      className={`aicc-transfer-status-tag aicc-transfer-status-tag--${transferStatusClassNames[status]}`}
    >
      {status}
    </Tag>
  )
}

function rowActions(actions: string[], onComplete: () => void) {
  return (
    <Space className="aicc-transfer-row-actions" size={4}>
      {actions.map((action) => (
        <AppButton key={action} size="small" onClick={onComplete}>
          {action}
        </AppButton>
      ))}
    </Space>
  )
}

function ConversationAgentActions({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="aicc-transfer-agent-actions">
      {conversationPrimaryAgentActions.map((action) => (
        <AppButton key={action} size="small" onClick={onComplete}>
          {action}
        </AppButton>
      ))}
    </div>
  )
}

function TransferAgentTab({
  variant,
  onComplete,
}: {
  variant: TransferModalVariant
  onComplete: () => void
}) {
  const [keyword, setKeyword] = useState('')
  const [skillQueue, setSkillQueue] = useState(allFilterValue)

  const skillQueueOptions = useMemo(
    () => Array.from(new Set(transferAgents.map((agent) => agent.skillName))),
    [],
  )

  const filteredAgents = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return transferAgents.filter((agent) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [agent.name, agent.employeeId].some((value) =>
          value.toLowerCase().includes(normalizedKeyword),
        )
      const matchesSkillQueue =
        skillQueue === allFilterValue || agent.skillName === skillQueue

      return matchesKeyword && matchesSkillQueue
    })
  }, [keyword, skillQueue])

  const columns: ColumnsType<TransferAgent> = [
    {
      dataIndex: 'marker',
      title: '',
      width: 42,
      render: (marker?: TransferAgent['marker']) =>
        marker ? <Tag className="aicc-transfer-tag">{marker}</Tag> : null,
    },
    {
      dataIndex: 'employeeId',
      title: 'Employee ID',
      width: 92,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      ellipsis: true,
      width: 142,
    },
    {
      dataIndex: 'skillName',
      title: 'Skill Name',
      ellipsis: true,
      width: 136,
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 90,
      render: renderAgentStatus,
    },
    {
      dataIndex: 'extension',
      title: 'Extension',
      width: 70,
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 180,
      render: () =>
        variant === 'conversation' ? (
          <ConversationAgentActions onComplete={onComplete} />
        ) : (
          rowActions(callAgentActions, onComplete)
        ),
    },
  ]

  return (
    <div className="aicc-modal-section aicc-transfer-panel">
      <div className="aicc-modal-toolbar aicc-transfer-search">
        <SearchInput
          placeholder="Search name or employee ID"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Select
          className="aicc-transfer-filter"
          options={[
            { label: 'All skill queues', value: allFilterValue },
            ...skillQueueOptions.map((skill) => ({
              label: skill,
              value: skill,
            })),
          ]}
          value={skillQueue}
          onChange={setSkillQueue}
        />
        <AppButton icon={<SearchOutlined />} type="primary">
          Search
        </AppButton>
        <span className="aicc-transfer-search__meta">
          {filteredAgents.length} agents
        </span>
      </div>
      <AppTable<TransferAgent>
        columns={columns}
        dataSource={filteredAgents}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        size="small"
      />
    </div>
  )
}

function TransferSkillTab({ onComplete }: { onComplete: () => void }) {
  const [keyword, setKeyword] = useState('')

  const filteredSkills = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return transferSkills
    }

    return transferSkills.filter((skill) =>
      skill.skillName.toLowerCase().includes(normalizedKeyword),
    )
  }, [keyword])

  const skillAgentCounts = useMemo(
    () =>
      transferAgents.reduce<Record<string, { ready: number; total: number }>>(
        (counts, agent) => {
          const current = counts[agent.skillName] ?? { ready: 0, total: 0 }
          counts[agent.skillName] = {
            ready: current.ready + (agent.status === 'Ready' ? 1 : 0),
            total: current.total + 1,
          }

          return counts
        },
        {},
      ),
    [],
  )

  const columns: ColumnsType<TransferSkill> = [
    {
      dataIndex: 'skillId',
      title: 'Skill ID',
      width: 120,
    },
    {
      dataIndex: 'skillName',
      title: 'Skill Name',
      ellipsis: true,
    },
    {
      align: 'center',
      key: 'agentCount',
      title: 'Agents',
      width: 78,
      render: (_, skill) => skillAgentCounts[skill.skillName]?.total ?? 0,
    },
    {
      align: 'center',
      key: 'readyCount',
      title: 'Ready',
      width: 78,
      render: (_, skill) => skillAgentCounts[skill.skillName]?.ready ?? 0,
    },
    {
      key: 'action',
      title: 'Action',
      width: 120,
      render: () => rowActions(['Transfer'], onComplete),
    },
  ]

  return (
    <div className="aicc-modal-section aicc-transfer-panel">
      <div className="aicc-modal-toolbar aicc-transfer-search">
        <SearchInput
          placeholder="Search skill name"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <AppButton icon={<SearchOutlined />} type="primary">
          Search
        </AppButton>
        <span className="aicc-transfer-search__meta">
          {filteredSkills.length} skills
        </span>
      </div>
      <AppTable<TransferSkill>
        columns={columns}
        dataSource={filteredSkills}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        size="small"
      />
    </div>
  )
}

function TransferNumberTab({ onComplete }: { onComplete: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <div className="aicc-modal-section aicc-transfer-number">
      <div className="aicc-transfer-number__line">
        <Input
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <AppButton type="primary" onClick={onComplete}>
          Transfer
        </AppButton>
      </div>
    </div>
  )
}

function TransferIvrTab({ onComplete }: { onComplete: () => void }) {
  const commonNumbers = useCallManagementStore(
    (state) => state.commonNumberEntries,
  )
  const activeNumbers = useMemo(
    () => commonNumbers.filter((entry) => entry.status === 'Active'),
    [commonNumbers],
  )
  const columns: ColumnsType<CommonNumberEntry> = [
    {
      dataIndex: 'name',
      ellipsis: true,
      title: 'Name',
      width: 180,
    },
    {
      dataIndex: 'number',
      title: 'Number',
      width: 120,
    },
    {
      dataIndex: 'remark',
      ellipsis: true,
      title: 'Remark',
    },
    {
      key: 'action',
      title: 'Action',
      width: 110,
      render: () => rowActions(['Transfer'], onComplete),
    },
  ]

  return (
    <div className="aicc-modal-section aicc-transfer-panel">
      <div className="aicc-modal-toolbar aicc-transfer-search">
        <span className="aicc-transfer-search__meta">
          {activeNumbers.length} active IVR numbers
        </span>
      </div>
      <AppTable<CommonNumberEntry>
        columns={columns}
        dataSource={activeNumbers}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        size="small"
      />
    </div>
  )
}

export function TransferModal({
  open,
  variant = 'call',
  onClose,
}: TransferModalProps) {
  const items = [
    {
      key: 'agent',
      label: 'Transfer Agent',
      children: <TransferAgentTab variant={variant} onComplete={onClose} />,
    },
    {
      key: 'skill',
      label: 'Transfer Skill',
      children: <TransferSkillTab onComplete={onClose} />,
    },
    ...(variant === 'call'
      ? [
          {
            key: 'number',
            label: 'Transfer Number',
            children: <TransferNumberTab onComplete={onClose} />,
          },
          {
            key: 'ivr',
            label: 'Transfer IVR',
            children: <TransferIvrTab onComplete={onClose} />,
          },
        ]
      : []),
  ]

  return (
    <BaseModal
      className="aicc-transfer-modal"
      kind="transfer"
      open={open}
      title="Transfer"
      width={860}
      onCancel={onClose}
    >
      <BaseTabs
        className="aicc-transfer-tabs"
        defaultActiveKey="agent"
        items={items}
        variant="modal"
      />
    </BaseModal>
  )
}
