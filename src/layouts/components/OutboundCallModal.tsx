import { useMemo, useState } from 'react'
import { PhoneOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  AppButton,
  AppTable,
  BaseModal,
  BaseTabs,
  SearchInput,
} from '../../components'
import { transferAgents } from '../../mock/transfer'
import type { TransferAgent } from '../../types'

interface OutboundCallModalProps {
  open: boolean
  onClose: () => void
}

function CallNumberTab({ onComplete }: { onComplete: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <div className="aicc-outbound-number">
      <Input
        placeholder="Enter phone number"
        prefix={<PhoneOutlined />}
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      <AppButton icon={<PhoneOutlined />} type="primary" onClick={onComplete}>
        Call
      </AppButton>
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
    <div className="aicc-transfer-panel">
      <div className="aicc-transfer-search">
        <SearchInput
          placeholder="Search name or employee ID"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <AppButton icon={<SearchOutlined />} type="primary">
          Search
        </AppButton>
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
      children: <CallNumberTab onComplete={onClose} />,
    },
    {
      key: 'agent',
      label: 'Call Agent',
      children: <CallAgentTab onComplete={onClose} />,
    },
  ]

  return (
    <BaseModal
      className="aicc-transfer-modal"
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
