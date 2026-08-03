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
import { useAuthStore, useCallManagementStore } from '../../store'
import type {
  CommonNumberEntry,
  TransferAgent,
  TransferAgentStatus,
  TransferSkill,
} from '../../types'

interface TransferModalProps {
  canTransferToNumber?: boolean
  open: boolean
  variant?: TransferModalVariant
  consultedAgentId?: string | null
  onClose: () => void
  onConsultAgent?: (agent: TransferAgent | null) => void
  onTransferToAgent?: (agent: TransferAgent) => void
  onConferenceWithAgent?: (agent: TransferAgent) => void
  onTransferToSkill?: (skill: TransferSkill) => void
  onTransferToNumber?: (number: string) => void
  onTransferToIvr?: (entry: CommonNumberEntry) => void
  onTransferToNumberFailed?: () => void
}

type TransferModalVariant = 'call' | 'conversation'
type TransferAgentScope = 'all' | 'leaders-only'

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
  agentScope,
  consultedAgentId,
  variant,
  onConferenceWithAgent,
  onConsultAgent,
  onTransferToAgent,
  onComplete,
}: {
  agentScope: TransferAgentScope
  consultedAgentId?: string | null
  variant: TransferModalVariant
  onConferenceWithAgent?: (agent: TransferAgent) => void
  onConsultAgent?: (agent: TransferAgent | null) => void
  onTransferToAgent?: (agent: TransferAgent) => void
  onComplete: () => void
}) {
  const [keyword, setKeyword] = useState('')
  const [skillQueue, setSkillQueue] = useState(allFilterValue)

  const visibleAgents = useMemo(
    () =>
      transferAgents.filter(
        (agent) => agentScope === 'all' || agent.marker === 'SPV' || agent.marker === 'TL',
      ),
    [agentScope],
  )

  const skillQueueOptions = useMemo(
    () => Array.from(new Set(visibleAgents.map((agent) => agent.skillName))),
    [visibleAgents],
  )

  const filteredAgents = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return visibleAgents
      .filter((agent) => {
        const matchesKeyword =
          !normalizedKeyword ||
          [agent.name, agent.employeeId].some((value) =>
            value.toLowerCase().includes(normalizedKeyword),
          )
        const matchesSkillQueue =
          skillQueue === allFilterValue || agent.skillName === skillQueue
        const isAvailableForCallTransfer =
          variant === 'conversation' || agent.status === 'Ready'

        return (
          matchesKeyword && matchesSkillQueue && isAvailableForCallTransfer
        )
      })
      .sort((left, right) => {
        const priority = (agent: TransferAgent) =>
          agent.marker === 'SPV' ? 0 : agent.marker === 'TL' ? 1 : 2

        return priority(left) - priority(right)
      })
  }, [keyword, skillQueue, variant, visibleAgents])

  const columns: ColumnsType<TransferAgent> = [
    {
      dataIndex: 'marker',
      title: '',
      width: 52,
      render: (marker?: TransferAgent['marker']) =>
        marker ? <Tag className="aicc-transfer-tag">{marker}</Tag> : null,
    },
    {
      dataIndex: 'employeeId',
      title: 'Employee ID',
      width: 88,
    },
    {
      dataIndex: 'name',
      title: 'Name',
      ellipsis: true,
      width: 118,
    },
    {
      dataIndex: 'skillName',
      title: 'Skill Name',
      ellipsis: true,
      width: 112,
    },
    {
      dataIndex: 'status',
      title: 'Status',
      width: 82,
      render: renderAgentStatus,
    },
    {
      dataIndex: 'extension',
      title: 'Extension',
      width: 64,
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 248,
      render: (_, agent) => {
        if (variant === 'conversation') {
          return <ConversationAgentActions onComplete={onComplete} />
        }

        const isConsultedAgent = consultedAgentId === agent.id
        const hasActiveConsultation = Boolean(consultedAgentId)

        return (
          <Space className="aicc-transfer-row-actions" size={4}>
            <AppButton
              disabled={hasActiveConsultation && !isConsultedAgent}
              size="small"
              variant={isConsultedAgent ? 'danger' : 'secondary'}
              onClick={() => onConsultAgent?.(isConsultedAgent ? null : agent)}
            >
              {isConsultedAgent ? 'Cancel Consult' : 'Consult'}
            </AppButton>
            <AppButton
              disabled={!isConsultedAgent}
              size="small"
              onClick={() => onTransferToAgent?.(agent)}
            >
              Transfer
            </AppButton>
            <AppButton
              disabled={!isConsultedAgent}
              size="small"
              onClick={() => onConferenceWithAgent?.(agent)}
            >
              Conference
            </AppButton>
          </Space>
        )
      },
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
        className="aicc-transfer-agent-table"
        columns={columns}
        dataSource={filteredAgents}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        scroll={{ x: 764 }}
        size="small"
        tableLayout="fixed"
      />
    </div>
  )
}

function TransferSkillTab({
  onComplete,
  onTransferToSkill,
}: {
  onComplete: () => void
  onTransferToSkill?: (skill: TransferSkill) => void
}) {
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
      render: (_, skill) => (
        <AppButton
          size="small"
          onClick={() => {
            if (onTransferToSkill) {
              onTransferToSkill(skill)
              return
            }

            onComplete()
          }}
        >
          Transfer
        </AppButton>
      ),
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
  onTransferToNumberFailed,
  onTransferToNumber,
}: {
  onTransferToNumberFailed?: () => void
  onTransferToNumber?: (number: string) => void
}) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const normalizedPhoneNumber = phoneNumber.trim()

  return (
    <div className="aicc-modal-section aicc-transfer-number">
      <div className="aicc-transfer-number__line">
        <Input
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <AppButton
          disabled={!normalizedPhoneNumber}
          title="Transfer to external number"
          type="primary"
          onClick={() => {
            if (normalizedPhoneNumber.endsWith('000')) {
              onTransferToNumberFailed?.()
              return
            }

            onTransferToNumber?.(normalizedPhoneNumber)
          }}
        >
          Transfer
        </AppButton>
      </div>
    </div>
  )
}

function TransferIvrTab({
  onComplete,
  onTransferToIvr,
}: {
  onComplete: () => void
  onTransferToIvr?: (entry: CommonNumberEntry) => void
}) {
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
      render: (_, entry) => (
        <AppButton
          size="small"
          onClick={() => {
            if (onTransferToIvr) {
              onTransferToIvr(entry)
              return
            }

            onComplete()
          }}
        >
          Transfer
        </AppButton>
      ),
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
  canTransferToNumber = false,
  open,
  variant = 'call',
  consultedAgentId,
  onClose,
  onConferenceWithAgent,
  onConsultAgent,
  onTransferToAgent,
  onTransferToIvr,
  onTransferToNumber,
  onTransferToNumberFailed,
  onTransferToSkill,
}: TransferModalProps) {
  const authSession = useAuthStore((state) => state.session)
  const agentScope: TransferAgentScope =
    variant === 'conversation' && authSession?.role === 'agent'
      ? 'leaders-only'
      : 'all'
  const items = [
    {
      key: 'agent',
      label: 'Transfer Agent',
      children: (
        <TransferAgentTab
          agentScope={agentScope}
          consultedAgentId={consultedAgentId}
          variant={variant}
          onComplete={onClose}
          onConferenceWithAgent={onConferenceWithAgent}
          onConsultAgent={onConsultAgent}
          onTransferToAgent={onTransferToAgent}
        />
      ),
    },
    {
      key: 'skill',
      label: 'Transfer Skill',
      children: (
        <TransferSkillTab
          onComplete={onClose}
          onTransferToSkill={onTransferToSkill}
        />
      ),
    },
    ...(variant === 'call'
      ? [
          ...(canTransferToNumber
            ? [
                {
                  key: 'number',
                  label: 'Transfer Number',
                  children: (
                    <TransferNumberTab
                      onTransferToNumberFailed={onTransferToNumberFailed}
                      onTransferToNumber={onTransferToNumber}
                    />
                  ),
                },
              ]
            : []),
          {
            key: 'ivr',
            label: 'Transfer IVR',
            children: (
              <TransferIvrTab
                onComplete={onClose}
                onTransferToIvr={onTransferToIvr}
              />
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
