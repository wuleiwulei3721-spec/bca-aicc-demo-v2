import { useMemo, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  PhoneIcon,
  SearchInput,
} from '../../components'
import { transferAgents } from '../../mock/transfer'
import type { TransferAgent } from '../../types'

interface OutboundCallModalProps {
  open: boolean
  onClose: () => void
}

function CallNumberTab({
  onCancel,
  onComplete,
}: {
  onCancel: () => void
  onComplete: () => void
}) {
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <div className="aicc-modal-section aicc-outbound-number">
      <label className="aicc-outbound-number__field">
        <span>Phone Number</span>
        <Input
          placeholder="Enter phone number"
          prefix={<PhoneIcon />}
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </label>
      <div className="aicc-modal-footer aicc-outbound-number__actions">
        <AppButton onClick={onCancel}>Cancel</AppButton>
        <AppButton icon={<PhoneIcon />} type="primary" onClick={onComplete}>
          Call
        </AppButton>
      </div>
    </div>
  )
}

function CallAgentTab({ onComplete }: { onComplete: () => void }) {
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
      key: 'action',
      title: 'Action',
      width: 90,
      render: () => (
        <Space size={4}>
          <AppButton size="small" onClick={onComplete}>
            Call
          </AppButton>
        </Space>
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

export function OutboundCallModal({ open, onClose }: OutboundCallModalProps) {
  const items = [
    {
      key: 'number',
      label: 'Call Number',
      children: <CallNumberTab onCancel={onClose} onComplete={onClose} />,
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
