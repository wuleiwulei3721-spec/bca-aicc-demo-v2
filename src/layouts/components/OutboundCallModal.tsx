import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, message, Select, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  PhoneIcon,
  SearchInput,
} from '../../components'
import { useExternalOperationApproval } from '../../hooks/useExternalOperationApproval'
import { transferAgents } from '../../mock/transfer'
import type { TransferAgent, TransferAgentStatus } from '../../types'

interface OutboundCallModalProps {
  open: boolean
  onClose: () => void
}

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

function CallNumberTab({
  open,
  onComplete,
}: {
  open: boolean
  onComplete: () => void
}) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const normalizedPhoneNumber = phoneNumber.trim()
  const previousOpenRef = useRef(open)
  const { consume, isApproved, isPending, release, request, status } =
    useExternalOperationApproval({
      targetNumber: normalizedPhoneNumber,
      type: 'outbound-number',
    })

  useEffect(() => {
    if (previousOpenRef.current && !open) {
      release()
    }

    previousOpenRef.current = open
  }, [open, release])

  useEffect(() => () => release(), [release])

  const handleRequestApproval = () => {
    if (!normalizedPhoneNumber || isPending || isApproved) {
      return
    }

    const result = request()

    if (result.popupBlocked) {
      message.error('TL approval window was blocked. Allow pop-ups and try again.')
    }
  }

  const approvalLabel = isPending
    ? 'Requesting...'
    : isApproved
      ? 'Approved'
      : status === 'rejected'
        ? 'Request Again'
        : 'Request Approval'

  return (
    <div className="aicc-modal-section aicc-outbound-number">
      <div className="aicc-outbound-number__field">
        <label htmlFor="aicc-outbound-phone-number">Phone Number</label>
        <Input
          id="aicc-outbound-phone-number"
          placeholder="Enter phone number"
          prefix={<PhoneIcon />}
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <AppButton
          className="aicc-outbound-number__approval"
          disabled={!normalizedPhoneNumber || isPending || isApproved}
          onClick={handleRequestApproval}
        >
          {approvalLabel}
        </AppButton>
        <AppButton
          disabled={!isApproved}
          icon={<PhoneIcon />}
          title={
            isApproved
              ? 'Call approved external number'
              : 'Request TL approval before placing this call'
          }
          type="primary"
          onClick={() => {
            consume()
            onComplete()
          }}
        >
          Call
        </AppButton>
      </div>
    </div>
  )
}

function CallAgentTab({ onComplete }: { onComplete: () => void }) {
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
      key: 'action',
      title: 'Action',
      width: 74,
      render: () => (
        <div className="aicc-transfer-row-actions">
          <AppButton size="small" onClick={onComplete}>
            Call
          </AppButton>
        </div>
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

export function OutboundCallModal({ open, onClose }: OutboundCallModalProps) {
  const items = [
    {
      key: 'number',
      label: 'Call Number',
      children: <CallNumberTab open={open} onComplete={onClose} />,
    },
    {
      key: 'agent',
      label: 'Call Agent',
      children: <CallAgentTab onComplete={onClose} />,
    },
  ]

  return (
    <BaseModal
      className="aicc-transfer-modal aicc-outbound-modal"
      kind="outbound"
      open={open}
      title="Outbound Call"
      width={860}
      onCancel={onClose}
    >
      <BaseTabs
        className="aicc-transfer-tabs"
        defaultActiveKey="number"
        items={items}
        variant="modal"
      />
    </BaseModal>
  )
}
