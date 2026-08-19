import { EyeOutlined } from '@ant-design/icons'
import { DatePicker, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminModal,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
} from '../../components'
import { useCallManagementStore } from '../../store'
import type {
  CallRecord,
  CallRecordCallType,
  CallRecordChannel,
  CallRecordMediaType,
  CallRecordRatingScore,
  ServiceEndedBy,
} from '../../types'
import { CallRecordDetailModal } from './CallRecordDetailModal'

const { RangePicker } = DatePicker
const QM_DETAIL_REPLAY_SRC = '/screenshots/interaction-log/qm-detail.png'

type CallRecordDateRange = [Dayjs, Dayjs]

interface CallRecordFilters {
  callType: 'All' | CallRecordCallType
  channel: 'All' | CallRecordChannel
  dateRange: CallRecordDateRange
  endedBy: 'All' | ServiceEndedBy
  keyword: string
  mediaType: 'All' | CallRecordMediaType
  ratingScore: 'All' | CallRecordRatingScore
}

const channelOptions: Array<{ label: string; value: CallRecordFilters['channel'] }> = [
  { label: 'All Channels', value: 'All' },
  { label: 'Phone', value: 'Phone' },
  { label: 'BankApp', value: 'BankApp' },
  { label: 'Webchat', value: 'Webchat' },
  { label: 'WhatsApp', value: 'WhatsApp' },
]

const mediaTypeOptions: Array<{
  label: string
  value: CallRecordFilters['mediaType']
}> = [
  { label: 'All Media', value: 'All' },
  { label: 'Voice', value: 'Voice' },
  { label: 'Video', value: 'Video' },
  { label: 'DM', value: 'DM' },
]

const callTypeOptions: Array<{
  label: string
  value: CallRecordFilters['callType']
}> = [
  { label: 'All Call Types', value: 'All' },
  { label: 'Customer', value: 'Customer' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Conference', value: 'Conference' },
]

const endedByOptions: Array<{
  label: string
  value: CallRecordFilters['endedBy']
}> = [
  { label: 'All Ended By', value: 'All' },
  { label: 'Agent', value: 'Agent' },
  { label: 'Customer', value: 'Customer' },
  { label: 'System', value: 'System' },
]

const ratingScoreOptions: Array<{
  label: string
  value: CallRecordFilters['ratingScore']
}> = [
  { label: 'All Scores', value: 'All' },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

function createDefaultFilters(): CallRecordFilters {
  return {
    callType: 'All',
    channel: 'All',
    dateRange: [dayjs().startOf('day'), dayjs().endOf('day')],
    endedBy: 'All',
    keyword: '',
    mediaType: 'All',
    ratingScore: 'All',
  }
}

function normalizeValue(value: string) {
  return value.trim().toLowerCase()
}

function formatDateTime(value: string) {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function formatDuration(durationSeconds: number) {
  const hours = Math.floor(durationSeconds / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)
  const seconds = durationSeconds % 60

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(':')
}

function formatQueueName(queueName: string) {
  return queueName.trim() || '-'
}

function formatServiceTime(record: CallRecord) {
  return `${formatDateTime(record.startedAt)} - ${formatDateTime(record.endedAt)}`
}

function createSearchText(record: CallRecord) {
  return [
    record.recordNo,
    record.channel,
    record.mediaType,
    record.callType,
    record.customerName,
    record.customerId,
    record.contact,
    record.agentId,
    record.agentName,
    record.queueName,
    record.endedBy,
    record.ratingScore?.toString() ?? '',
    record.ratingFeedback ?? '',
    record.summary.description,
    record.summary.tickets.map((ticket) => ticket.id).join(' '),
    record.summary.tickets
      .map((ticket) => ticket.caseCategory)
      .join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

function recordMatchesFilters(record: CallRecord, filters: CallRecordFilters) {
  const keyword = normalizeValue(filters.keyword)
  const startedAt = dayjs(record.startedAt)
  const [rangeStart, rangeEnd] = filters.dateRange

  return (
    (!keyword || createSearchText(record).includes(keyword)) &&
    (filters.callType === 'All' || record.callType === filters.callType) &&
    (filters.channel === 'All' || record.channel === filters.channel) &&
    (filters.mediaType === 'All' || record.mediaType === filters.mediaType) &&
    (filters.endedBy === 'All' || record.endedBy === filters.endedBy) &&
    (filters.ratingScore === 'All' ||
      record.ratingScore === filters.ratingScore) &&
    (!rangeStart || startedAt.isSame(rangeStart, 'second') || startedAt.isAfter(rangeStart)) &&
    (!rangeEnd || startedAt.isSame(rangeEnd, 'second') || startedAt.isBefore(rangeEnd))
  )
}

export function CallRecordQueryPage() {
  const callRecords = useCallManagementStore((state) => state.callRecords)
  const [appliedFilters, setAppliedFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [draftFilters, setDraftFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [qmDetailRecordId, setQmDetailRecordId] = useState<string | null>(
    null,
  )

  const selectedRecord = useMemo(
    () =>
      selectedRecordId
        ? callRecords.find((record) => record.id === selectedRecordId) ?? null
        : null,
    [callRecords, selectedRecordId],
  )
  const qmDetailRecord = useMemo(
    () =>
      qmDetailRecordId
        ? callRecords.find((record) => record.id === qmDetailRecordId) ?? null
        : null,
    [callRecords, qmDetailRecordId],
  )

  const filteredRecords = useMemo(
    () =>
      callRecords
        .filter((record) => recordMatchesFilters(record, appliedFilters))
        .sort((first, second) => Date.parse(second.startedAt) - Date.parse(first.startedAt)),
    [appliedFilters, callRecords],
  )

  const openDetail = (record: CallRecord) => {
    setSelectedRecordId(record.id)
  }

  const closeDetail = () => {
    setSelectedRecordId(null)
  }

  const openQmDetail = (record: CallRecord) => {
    if (record.qmScore === null) {
      return
    }

    setQmDetailRecordId(record.id)
  }

  const closeQmDetail = () => {
    setQmDetailRecordId(null)
  }

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
  }

  const handleReset = () => {
    const nextFilters = createDefaultFilters()

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  const columns: ColumnsType<CallRecord> = [
    {
      dataIndex: 'recordNo',
      title: 'Record No.',
      width: 132,
    },
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 92,
    },
    {
      dataIndex: 'mediaType',
      title: 'Media',
      width: 78,
    },
    {
      dataIndex: 'callType',
      title: 'Call Type',
      width: 100,
    },
    {
      dataIndex: 'customerName',
      ellipsis: true,
      title: 'Customer Name',
      width: 126,
    },
    {
      dataIndex: 'customerId',
      title: 'Customer ID',
      width: 104,
    },
    {
      dataIndex: 'contact',
      ellipsis: true,
      title: 'Contact',
      width: 142,
    },
    {
      dataIndex: 'agentName',
      ellipsis: true,
      title: 'Agent Name',
      width: 126,
    },
    {
      dataIndex: 'agentId',
      title: 'Agent ID',
      width: 84,
    },
    {
      dataIndex: 'queueName',
      ellipsis: true,
      render: (value: string) => formatQueueName(value),
      title: 'Queue',
      width: 148,
    },
    {
      key: 'serviceTime',
      render: (_, record) => formatServiceTime(record),
      title: 'Service Time',
      width: 268,
    },
    {
      dataIndex: 'durationSeconds',
      render: (value: number) => formatDuration(value),
      title: 'Duration',
      width: 92,
    },
    {
      dataIndex: 'endedBy',
      title: 'Ended By',
      width: 96,
    },
    {
      align: 'center',
      dataIndex: 'ratingScore',
      render: (value: CallRecord['ratingScore']) => value ?? '-',
      title: 'Rating Score',
      width: 110,
    },
    {
      dataIndex: 'qmScore',
      render: (value: CallRecord['qmScore'], record) =>
        value === null ? (
          '-'
        ) : (
          <button
            aria-label={`View QM detail for ${record.recordNo}`}
            className="call-record-query__qm-score-link"
            title="View QM detail"
            type="button"
            onClick={() => openQmDetail(record)}
          >
            {value}
          </button>
        ),
      title: 'QM Score',
      width: 86,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions call-record-query__row-actions">
          <button
            aria-label={`View ${record.recordNo}`}
            title="View"
            type="button"
            onClick={() => openDetail(record)}
          >
            <EyeOutlined />
          </button>
        </div>
      ),
      title: 'Actions',
      width: 74,
    },
  ]

  return (
    <AdminPage
      className="call-record-query"
      title="Interaction Log"
      description="Current agent view for Phone, BankApp, Webchat, and WhatsApp interaction records."
    >
      <BaseCard compact>
        <AdminToolbar
          filters={
            <>
              <AdminFilterField label="Keyword" width={260}>
                <Input
                  allowClear
                  placeholder="Record / customer / agent"
                  value={draftFilters.keyword}
                  onChange={(event) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      keyword: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Channel" width={180}>
                <Select
                  options={channelOptions}
                  value={draftFilters.channel}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      channel: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Media Type" width={170}>
                <Select
                  options={mediaTypeOptions}
                  value={draftFilters.mediaType}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      mediaType: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Call Type" width={170}>
                <Select
                  options={callTypeOptions}
                  value={draftFilters.callType}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      callType: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Ended By" width={170}>
                <Select
                  options={endedByOptions}
                  value={draftFilters.endedBy}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      endedBy: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Rating Score" width={170}>
                <Select
                  options={ratingScoreOptions}
                  value={draftFilters.ratingScore}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      ratingScore: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Date Range" width={300}>
                <RangePicker
                  allowClear={false}
                  showTime
                  value={draftFilters.dateRange}
                  onChange={(value) => {
                    if (!value?.[0] || !value[1]) {
                      return
                    }

                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      dateRange: [value[0], value[1]],
                    }))
                  }}
                />
              </AdminFilterField>
              <div className="routing-config-page__admin-actions">
                <BaseButton variant="primary" onClick={handleSearch}>
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </div>
            </>
          }
        />
        <AdminTable<CallRecord>
          columns={columns}
          dataSource={filteredRecords}
          horizontalScroll={1858}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <CallRecordDetailModal record={selectedRecord} onClose={closeDetail} />
      <AdminModal
        centered
        closable={false}
        destroyOnClose
        keyboard={false}
        maskClosable={false}
        className="call-record-query__qm-detail-modal"
        open={Boolean(qmDetailRecord)}
        title={null}
        onCancel={closeQmDetail}
      >
        {qmDetailRecord && (
          <div className="call-record-query__qm-detail-preview">
            <img
              alt={`Third-party QM detail for ${qmDetailRecord.recordNo}`}
              draggable={false}
              src={QM_DETAIL_REPLAY_SRC}
            />
            <button
              aria-label={`Close QM detail for ${qmDetailRecord.recordNo}`}
              className="call-record-query__qm-detail-close-target"
              title="Close QM detail"
              type="button"
              onClick={closeQmDetail}
            />
          </div>
        )}
      </AdminModal>
    </AdminPage>
  )
}
