import { useMemo, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Select, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  SearchInput,
} from '../../components'
import { useExternalOperationApproval } from '../../hooks/useExternalOperationApproval'
import { useOperationFeedback } from '../../contexts/operationFeedbackContext'
import { transferAgents } from '../../mock/transfer'
import { externalOutboundReasonOptions } from '../../types'
import type {
  ExternalOutboundReason,
  TransferAgent,
  TransferAgentStatus,
} from '../../types'

interface OutboundCallModalProps {
  open: boolean
  hasOutboundAccess: boolean
  onClose: () => void
  onCallNumber: (phoneNumber: string) => void
  requiresOutboundApproval: boolean
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
  hasOutboundAccess,
  onCallNumber,
  requiresOutboundApproval,
}: {
  hasOutboundAccess: boolean
  onCallNumber: (phoneNumber: string) => void
  requiresOutboundApproval: boolean
}) {
  const { notify } = useOperationFeedback()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [outboundReason, setOutboundReason] =
    useState<ExternalOutboundReason | null>(null)
  const normalizedPhoneNumber = phoneNumber.trim()
  const { consume, isApproved, isPending, request, status } =
    useExternalOperationApproval({
      outboundReason: outboundReason ?? undefined,
      targetNumber: normalizedPhoneNumber,
      type: 'outbound-number',
    })

  const handleRequestApproval = () => {
    if (
      !requiresOutboundApproval ||
      !normalizedPhoneNumber ||
      !outboundReason ||
      isPending ||
      isApproved
    ) {
      return
    }

    const result = request()

    if (result.popupBlocked) {
      notify('TL approval window was blocked. Allow pop-ups and try again.', 'error')
    }
  }

  const approvalLabel = !outboundReason
    ? 'Request Approval'
    : isPending
    ? 'Requesting...'
    : isApproved
      ? 'Approved'
      : status === 'rejected'
        ? 'Request Again'
        : 'Request Approval'

  return (
    <div
      className={[
        'aicc-modal-section',
        'aicc-outbound-number',
        !requiresOutboundApproval && 'aicc-outbound-number--direct',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="aicc-outbound-number__field">
        <label htmlFor="aicc-outbound-phone-number">Phone Number</label>
        <Input
          id="aicc-outbound-phone-number"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <Select<ExternalOutboundReason>
          aria-label="Outbound reason"
          className="aicc-outbound-number__reason"
          options={externalOutboundReasonOptions}
          placeholder="Select reason"
          value={outboundReason}
          onChange={setOutboundReason}
        />
        {requiresOutboundApproval && (
          <AppButton
            className="aicc-outbound-number__approval"
            disabled={
              !normalizedPhoneNumber ||
              !outboundReason ||
              isPending ||
              isApproved
            }
            onClick={handleRequestApproval}
          >
            {approvalLabel}
          </AppButton>
        )}
        <AppButton
          disabled={
            !hasOutboundAccess ||
            !normalizedPhoneNumber ||
            !outboundReason ||
            (requiresOutboundApproval && !isApproved)
          }
          title={
            !hasOutboundAccess
              ? 'Switch to outbound AUX'
              : !outboundReason
              ? 'Select a reason before requesting TL approval'
              : !requiresOutboundApproval
                ? 'Call external number'
              : isApproved
              ? 'Call approved external number'
              : 'Request TL approval before placing this call'
          }
          type="primary"
          onClick={() => {
            if (requiresOutboundApproval) {
              consume()
            }
            onCallNumber(normalizedPhoneNumber)
          }}
        >
          Call
        </AppButton>
      </div>
    </div>
  )
}

function CallAgentTab({
  hasOutboundAccess,
  onComplete,
}: {
  hasOutboundAccess: boolean
  onComplete: () => void
}) {
  const [keyword, setKeyword] = useState('')
  const [skillQueue, setSkillQueue] = useState(allFilterValue)
  const visibleAgents = useMemo(
    () =>
      transferAgents.filter(
        (agent) => agent.marker === 'SPV' || agent.marker === 'TL',
      ),
    [],
  )

  const skillQueueOptions = useMemo(
    () => Array.from(new Set(visibleAgents.map((agent) => agent.skillName))),
    [visibleAgents],
  )

  const filteredAgents = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return visibleAgents.filter((agent) => {
      const matchesKeyword =
        !normalizedKeyword ||
        [agent.name, agent.employeeId].some((value) =>
          value.toLowerCase().includes(normalizedKeyword),
        )
      const matchesSkillQueue =
        skillQueue === allFilterValue || agent.skillName === skillQueue

      return matchesKeyword && matchesSkillQueue
    })
  }, [keyword, skillQueue, visibleAgents])

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
          <AppButton
            disabled={!hasOutboundAccess}
            size="small"
            title={!hasOutboundAccess ? 'Switch to outbound AUX' : undefined}
            onClick={onComplete}
          >
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

export function OutboundCallModal({
  hasOutboundAccess,
  open,
  onClose,
  onCallNumber,
  requiresOutboundApproval,
}: OutboundCallModalProps) {
  const items = [
    {
      key: 'number',
      label: 'Call Number',
      children: (
        <CallNumberTab
          hasOutboundAccess={hasOutboundAccess}
          requiresOutboundApproval={requiresOutboundApproval}
          onCallNumber={onCallNumber}
        />
      ),
    },
    {
      key: 'agent',
      label: 'Call Agent',
      children: (
        <CallAgentTab
          hasOutboundAccess={hasOutboundAccess}
          onComplete={onClose}
        />
      ),
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
