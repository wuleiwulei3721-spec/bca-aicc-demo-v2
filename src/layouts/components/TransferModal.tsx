import { useMemo, useState } from 'react'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import { Dropdown, Input, Select, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  SearchInput,
} from '../../components'
import {
  transferAgents,
  transferSkills,
  transferSystemNumbers,
} from '../../mock/transfer'
import type {
  TransferAgent,
  TransferSkill,
  TransferSystemNumber,
} from '../../types'

interface TransferModalProps {
  open: boolean
  variant?: TransferModalVariant
  onClose: () => void
}

type TransferModalVariant = 'call' | 'conversation'

const callAgentActions = ['Consult', 'Transfer', 'Conference']
const conversationPrimaryAgentActions = [
  'Request Transfer',
  'Request Conference',
]
const conversationOverflowAgentActions: MenuProps['items'] = [
  {
    key: 'force-transfer',
    label: 'Force Transfer',
  },
  {
    key: 'force-conference',
    label: 'Force Conference',
  },
]

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
      <Dropdown
        menu={{
          items: conversationOverflowAgentActions,
          onClick: () => onComplete(),
        }}
        placement="bottomRight"
        trigger={['click']}
      >
        <AppButton
          aria-label="More transfer actions"
          className="aicc-transfer-agent-actions__more"
          icon={<DownOutlined />}
          size="small"
          title="More actions"
        />
      </Dropdown>
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

  const filteredAgents = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return transferAgents
    }

    return transferAgents.filter((agent) =>
      [agent.name, agent.employeeId].some((value) =>
        value.toLowerCase().includes(normalizedKeyword),
      ),
    )
  }, [keyword])

  const columns: ColumnsType<TransferAgent> = [
    {
      dataIndex: 'marker',
      title: '',
      width: 64,
      render: (marker?: TransferAgent['marker']) =>
        marker ? <Tag className="aicc-transfer-tag">{marker}</Tag> : null,
    },
    {
      dataIndex: 'employeeId',
      title: 'Employee ID',
      width: 110,
    },
    {
      dataIndex: 'department',
      title: 'Department',
      width: 140,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      width: 150,
    },
    {
      dataIndex: 'extension',
      title: 'Extension',
      width: 90,
    },
    {
      key: 'actions',
      title: 'Actions',
      width: variant === 'conversation' ? 286 : 250,
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

  const columns: ColumnsType<TransferSkill> = [
    {
      dataIndex: 'skillId',
      title: 'Skill ID',
      width: 120,
    },
    {
      dataIndex: 'skillName',
      title: 'Skill Name',
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

function TransferNumberTab({
  onCancel,
  onComplete,
}: {
  onCancel: () => void
  onComplete: () => void
}) {
  const [selectedNumber, setSelectedNumber] = useState<string>()
  const [manualNumber, setManualNumber] = useState('')

  return (
    <div className="aicc-modal-section aicc-transfer-number">
      <section className="aicc-transfer-number__field">
        <span>System Number</span>
        <Select
          allowClear
          showSearch
          filterOption={(input, option) =>
            String(option?.label ?? '')
              .toLowerCase()
              .includes(input.trim().toLowerCase())
          }
          options={transferSystemNumbers.map(
            (number: TransferSystemNumber) => ({
              label: `${number.label} (${number.number})`,
              value: number.id,
            }),
          )}
          placeholder="Select maintained number"
          value={selectedNumber}
          onChange={setSelectedNumber}
        />
      </section>
      <section className="aicc-transfer-number__field">
        <span>Manual Number</span>
        <Input
          placeholder="Enter phone number"
          value={manualNumber}
          onChange={(event) => setManualNumber(event.target.value)}
        />
      </section>
      <div className="aicc-modal-footer aicc-transfer-number__actions">
        <AppButton onClick={onCancel}>Cancel</AppButton>
        <AppButton type="primary" onClick={onComplete}>
          Transfer
        </AppButton>
        <AppButton onClick={onComplete}>Conference</AppButton>
      </div>
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
            children: (
              <TransferNumberTab onCancel={onClose} onComplete={onClose} />
            ),
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
