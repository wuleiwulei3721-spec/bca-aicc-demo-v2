import {
  EditOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { Checkbox, DatePicker, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import {
  AdminFilterField,
  AdminFormField,
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
} from '../../components'
import { useCallManagementStore } from '../../store'
import type {
  CallRecord,
  CallRecordChannel,
  CallRecordEndReason,
  CallRecordMediaType,
  CallRecordSummary,
  ServiceEndedBy,
} from '../../types'

const { RangePicker } = DatePicker
const OPEN_EYE_REPLAY_SRC =
  '/screenshots/haloapp-v18/openeye-video-replay.png'

type CallRecordDateRange = [Dayjs, Dayjs]

interface CallRecordFilters {
  channel: 'All' | CallRecordChannel
  dateRange: CallRecordDateRange
  endedBy: 'All' | ServiceEndedBy
  endReason: 'All' | CallRecordEndReason
  keyword: string
  mediaType: 'All' | CallRecordMediaType
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

const endedByOptions: Array<{
  label: string
  value: CallRecordFilters['endedBy']
}> = [
  { label: 'All Ended By', value: 'All' },
  { label: 'Agent', value: 'Agent' },
  { label: 'Customer', value: 'Customer' },
  { label: 'System', value: 'System' },
]

const cwuBusinessTypeOptions = [
  'Credit Card',
  'Debit Card',
  'Mobile Banking',
  'Account Service',
  'Investment',
  'Wealth Management',
  'Loan',
  'Paylater',
  'Dispute',
  'Branch Service',
  'Others',
]

const endReasonOptions: Array<{
  label: string
  value: CallRecordFilters['endReason']
}> = [
  { label: 'All Reasons', value: 'All' },
  { label: 'Normal', value: 'Normal' },
  { label: 'Hening & Tidak Ada Respons', value: 'Hening & Tidak Ada Respons' },
  { label: 'Problem Teknis', value: 'Problem Teknis' },
  {
    label: 'Nasabah Tidak Ada Respons Lebih Lanjut',
    value: 'Nasabah Tidak Ada Respons Lebih Lanjut',
  },
  { label: 'Customer Timeout', value: 'Customer Timeout' },
  { label: 'Connection Lost', value: 'Connection Lost' },
  { label: 'System Error', value: 'System Error' },
  { label: 'Channel Gateway Error', value: 'Channel Gateway Error' },
]

function createDefaultFilters(): CallRecordFilters {
  return {
    channel: 'All',
    dateRange: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')],
    endedBy: 'All',
    endReason: 'All',
    keyword: '',
    mediaType: 'All',
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

function formatPlaybackClock(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatQueueName(queueName: string) {
  return queueName.trim() || '-'
}

function formatServiceTime(record: CallRecord) {
  return `${formatDateTime(record.startedAt)} - ${formatDateTime(record.endedAt)}`
}

function isEditableRecord(record: CallRecord) {
  return dayjs().diff(dayjs(record.endedAt), 'hour', true) <= 24
}

function createSearchText(record: CallRecord) {
  return [
    record.recordNo,
    record.channel,
    record.mediaType,
    record.customerName,
    record.customerId,
    record.contact,
    record.agentId,
    record.agentName,
    record.queueName,
    record.endedBy,
    record.endReason,
    record.summary.businessTypes.join(' '),
    record.summary.description,
    record.summary.ticketNo,
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
    (filters.channel === 'All' || record.channel === filters.channel) &&
    (filters.mediaType === 'All' || record.mediaType === filters.mediaType) &&
    (filters.endedBy === 'All' || record.endedBy === filters.endedBy) &&
    (filters.endReason === 'All' ||
      record.endReason === filters.endReason) &&
    (!rangeStart || startedAt.isSame(rangeStart, 'second') || startedAt.isAfter(rangeStart)) &&
    (!rangeEnd || startedAt.isSame(rangeEnd, 'second') || startedAt.isBefore(rangeEnd))
  )
}

function cloneSummary(summary: CallRecordSummary): CallRecordSummary {
  return {
    ...summary,
    businessTypes: [...summary.businessTypes],
  }
}

function getPlaybackProgressPercent(record: CallRecord, playbackSeconds: number) {
  if (record.durationSeconds <= 0) {
    return 0
  }

  return Math.min(100, (playbackSeconds / record.durationSeconds) * 100)
}

function getSpeakerName(record: CallRecord, speaker: CallRecord['transcript'][number]['speaker']) {
  if (speaker === 'Agent') {
    return record.agentName
  }

  if (speaker === 'Customer') {
    return record.customerName
  }

  return 'System'
}

function getSpeakerInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function renderTranscriptLine(record: CallRecord, line: CallRecord['transcript'][number]) {
  const speakerName = getSpeakerName(record, line.speaker)

  if (line.speaker === 'System') {
    return (
      <div className="call-record-query__chat-system" key={line.id}>
        <span>{line.time}</span>
        <p>{line.text}</p>
      </div>
    )
  }

  return (
    <article
      className={[
        'call-record-query__chat-message',
        `call-record-query__chat-message--${line.speaker.toLowerCase()}`,
      ].join(' ')}
      key={line.id}
    >
      <div className="call-record-query__chat-avatar">
        {getSpeakerInitials(speakerName)}
      </div>
      <div className="call-record-query__chat-main">
        <div className="call-record-query__chat-meta">
          <strong>{speakerName}</strong>
          <span>{line.time}</span>
        </div>
        <p className="call-record-query__chat-bubble">{line.text}</p>
      </div>
    </article>
  )
}

export function CallRecordQueryPage() {
  const callRecords = useCallManagementStore((state) => state.callRecords)
  const updateCallRecordSummary = useCallManagementStore(
    (state) => state.updateCallRecordSummary,
  )
  const [appliedFilters, setAppliedFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [draftFilters, setDraftFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [editRecordId, setEditRecordId] = useState<string | null>(null)
  const [playbackRecordId, setPlaybackRecordId] = useState<string | null>(null)
  const [playbackSeconds, setPlaybackSeconds] = useState(0)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [summaryDraft, setSummaryDraft] = useState<CallRecordSummary | null>(null)

  const selectedRecord = useMemo(
    () =>
      selectedRecordId
        ? callRecords.find((record) => record.id === selectedRecordId) ?? null
        : null,
    [callRecords, selectedRecordId],
  )

  const editRecord = useMemo(
    () =>
      editRecordId
        ? callRecords.find((record) => record.id === editRecordId) ?? null
        : null,
    [callRecords, editRecordId],
  )

  const filteredRecords = useMemo(
    () =>
      callRecords
        .filter((record) => recordMatchesFilters(record, appliedFilters))
        .sort((first, second) => Date.parse(second.startedAt) - Date.parse(first.startedAt)),
    [appliedFilters, callRecords],
  )

  const isPlaybackPlaying =
    Boolean(selectedRecord) && playbackRecordId === selectedRecord?.id

  useEffect(() => {
    if (!selectedRecord || !isPlaybackPlaying) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setPlaybackSeconds((currentSeconds) => {
        if (currentSeconds >= selectedRecord.durationSeconds) {
          window.clearInterval(timer)
          setPlaybackRecordId(null)
          return selectedRecord.durationSeconds
        }

        return Math.min(currentSeconds + 1, selectedRecord.durationSeconds)
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isPlaybackPlaying, selectedRecord])

  const openDetail = (record: CallRecord) => {
    setPlaybackRecordId(null)
    setPlaybackSeconds(0)
    setSelectedRecordId(record.id)
  }

  const closeDetail = () => {
    setPlaybackRecordId(null)
    setPlaybackSeconds(0)
    setSelectedRecordId(null)
  }

  const openSummaryEditor = (record: CallRecord) => {
    setEditRecordId(record.id)
    setSummaryDraft(cloneSummary(record.summary))
  }

  const closeSummaryEditor = () => {
    setEditRecordId(null)
    setSummaryDraft(null)
  }

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
  }

  const handleReset = () => {
    const nextFilters = createDefaultFilters()

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  const updateSummaryDraft = <Key extends keyof CallRecordSummary>(
    key: Key,
    value: CallRecordSummary[Key],
  ) => {
    setSummaryDraft((currentDraft) =>
      currentDraft ? { ...currentDraft, [key]: value } : currentDraft,
    )
  }

  const handleSaveSummary = () => {
    if (
      !editRecord ||
      !summaryDraft ||
      !isEditableRecord(editRecord) ||
      summaryDraft.businessTypes.length === 0 ||
      !summaryDraft.description.trim()
    ) {
      return
    }

    const nextSummary = {
      businessTypes: summaryDraft.businessTypes,
      description: summaryDraft.description.trim(),
      ticketNo: editRecord.summary.ticketNo,
    }

    updateCallRecordSummary(editRecord.id, nextSummary)
    closeSummaryEditor()
  }

  const togglePlayback = (record: CallRecord) => {
    if (playbackRecordId === record.id) {
      setPlaybackRecordId(null)
      return
    }

    if (playbackSeconds >= record.durationSeconds) {
      setPlaybackSeconds(0)
    }

    setPlaybackRecordId(record.id)
  }

  const renderPlayerControls = (record: CallRecord) => (
    <div className="call-record-query__player-controls">
      <button
        aria-label={isPlaybackPlaying ? 'Pause playback' : 'Play playback'}
        type="button"
        onClick={() => togglePlayback(record)}
      >
        {isPlaybackPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
      </button>
      <div className="call-record-query__player-progress">
        <span
          style={{
            width: `${getPlaybackProgressPercent(record, playbackSeconds)}%`,
          }}
        />
      </div>
      <strong>
        {formatPlaybackClock(playbackSeconds)} /{' '}
        {formatPlaybackClock(record.durationSeconds)}
      </strong>
    </div>
  )

  const renderTranscriptLog = (
    record: CallRecord,
    modifierClassName?: string,
  ) => (
    <div
      className={[
        'call-record-query__chat-log',
        modifierClassName ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {record.transcript.map((line) => renderTranscriptLine(record, line))}
    </div>
  )

  const columns: ColumnsType<CallRecord> = [
    {
      dataIndex: 'recordNo',
      title: 'Record No.',
      width: 138,
    },
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 96,
    },
    {
      dataIndex: 'mediaType',
      title: 'Media',
      width: 82,
    },
    {
      dataIndex: 'customerName',
      ellipsis: true,
      title: 'Customer Name',
      width: 142,
    },
    {
      dataIndex: 'customerId',
      title: 'Customer ID',
      width: 118,
    },
    {
      dataIndex: 'contact',
      ellipsis: true,
      title: 'Contact',
      width: 158,
    },
    {
      dataIndex: 'agentName',
      ellipsis: true,
      title: 'Agent Name',
      width: 132,
    },
    {
      dataIndex: 'agentId',
      title: 'Agent ID',
      width: 92,
    },
    {
      dataIndex: 'queueName',
      ellipsis: true,
      render: (value: string) => formatQueueName(value),
      title: 'Queue',
      width: 156,
    },
    {
      key: 'serviceTime',
      render: (_, record) => formatServiceTime(record),
      title: 'Service Time',
      width: 282,
    },
    {
      dataIndex: 'durationSeconds',
      render: (value: number) => formatDuration(value),
      title: 'Duration',
      width: 96,
    },
    {
      dataIndex: 'endedBy',
      title: 'Ended By',
      width: 104,
    },
    {
      dataIndex: 'endReason',
      ellipsis: true,
      title: 'End Reason',
      width: 168,
    },
    {
      fixed: 'right',
      render: (_, record) => {
        const editable = isEditableRecord(record)

        return (
          <div className="routing-config-crud__row-actions call-record-query__row-actions">
            <button
              aria-label={`View ${record.recordNo}`}
              title="View"
              type="button"
              onClick={() => openDetail(record)}
            >
              <EyeOutlined />
            </button>
            {editable && (
              <button
                aria-label={`Edit CWU ${record.recordNo}`}
                title="Edit CWU"
                type="button"
                onClick={() => openSummaryEditor(record)}
              >
                <EditOutlined />
              </button>
            )}
          </div>
        )
      },
      title: 'Actions',
      width: 96,
    },
  ]

  const canEditRecord = editRecord ? isEditableRecord(editRecord) : false
  const canSaveSummary = Boolean(
    canEditRecord &&
      summaryDraft &&
      summaryDraft.businessTypes.length > 0 &&
      summaryDraft.description.trim(),
  )

  return (
    <AdminPage
      className="call-record-query"
      title="Call Record Query"
      description="Current agent view for Phone, BankApp Voice, BankApp Video, BankApp, Webchat, and WhatsApp records."
    >
      <BaseCard compact>
        <AdminToolbar
          actions={
            <>
              <BaseButton variant="primary" onClick={handleSearch}>
                Search
              </BaseButton>
              <BaseButton variant="secondary" onClick={handleReset}>
                Reset
              </BaseButton>
            </>
          }
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
              <AdminFilterField label="End Reason" width={190}>
                <Select
                  options={endReasonOptions}
                  value={draftFilters.endReason}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      endReason: value,
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
            </>
          }
        />
        <AdminTable<CallRecord>
          columns={columns}
          dataSource={filteredRecords}
          horizontalScroll={1860}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        className="call-record-query__detail-modal"
        open={Boolean(selectedRecord)}
        title={
          selectedRecord
            ? `Call Record Detail - ${selectedRecord.recordNo}`
            : 'Call Record Detail'
        }
        width={1120}
        onCancel={closeDetail}
      >
        {selectedRecord && (
          <div className="call-record-query__detail">
            <section className="call-record-query__content-panel">
              {selectedRecord.mediaType !== 'Video' && (
                <div className="call-record-query__panel-header">
                  <div>
                    <strong>
                      {selectedRecord.mediaType === 'DM'
                        ? 'Conversation'
                        : 'Recording Playback'}
                    </strong>
                  </div>
                </div>
              )}
              {selectedRecord.mediaType === 'Video' ? (
                <div className="call-record-query__video-detail">
                  <section className="call-record-query__video-column">
                    <div className="call-record-query__column-title">
                      Video Replay
                    </div>
                    <div className="call-record-query__media-player call-record-query__media-player--video">
                      <div className="call-record-query__openeye-replay">
                        <img
                          alt="OpenEye video replay"
                          draggable={false}
                          src={OPEN_EYE_REPLAY_SRC}
                        />
                      </div>
                      {renderPlayerControls(selectedRecord)}
                    </div>
                  </section>
                  <section className="call-record-query__video-transcript">
                    <div className="call-record-query__column-title">
                      Auto Transcript
                    </div>
                    {renderTranscriptLog(selectedRecord)}
                  </section>
                </div>
              ) : selectedRecord.mediaType === 'Voice' ? (
                <>
                  <div className="call-record-query__media-player call-record-query__media-player--voice">
                    {renderPlayerControls(selectedRecord)}
                  </div>
                  <div className="call-record-query__chat-heading">
                    <strong>Auto Transcript</strong>
                  </div>
                  {renderTranscriptLog(selectedRecord)}
                </>
              ) : (
                renderTranscriptLog(
                  selectedRecord,
                  'call-record-query__chat-log--dm',
                )
              )}
            </section>
            <section className="call-record-query__summary-panel">
              <div className="call-record-query__column-title call-record-query__cwu-title">
                CWU
              </div>
              <div className="call-record-query__summary-card call-record-query__cwu-card">
                <div className="call-record-query__cwu-fields">
                  <div>
                    <span>Ticket No.</span>
                    <strong>{selectedRecord.summary.ticketNo}</strong>
                  </div>
                  <div>
                    <span>Business Type</span>
                    <div className="call-record-query__business-tags">
                      {selectedRecord.summary.businessTypes.length > 0 ? (
                        selectedRecord.summary.businessTypes.map((businessType) => (
                          <span
                            className="call-record-query__business-tag"
                            key={businessType}
                          >
                            {businessType}
                          </span>
                        ))
                      ) : (
                        <strong>-</strong>
                      )}
                    </div>
                  </div>
                  <div>
                    <span>Summary</span>
                    <p>{selectedRecord.summary.description}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeDetail}>
            Close
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
      <AdminModal
        destroyOnClose
        className="call-record-query__summary-modal"
        open={Boolean(editRecord)}
        title={
          editRecord ? `Edit CWU - ${editRecord.recordNo}` : 'Edit CWU'
        }
        width={680}
        onCancel={closeSummaryEditor}
      >
        {editRecord && summaryDraft && (
          <div className="call-record-query__summary-form">
            <AdminFormField label="Ticket No." fullWidth>
              <div className="call-record-query__readonly-field">
                {summaryDraft.ticketNo}
              </div>
            </AdminFormField>
            <AdminFormField label="Business Type" fullWidth>
              <Checkbox.Group
                className="call-record-query__business-type-options"
                options={cwuBusinessTypeOptions}
                value={summaryDraft.businessTypes}
                onChange={(checkedValues) =>
                  updateSummaryDraft(
                    'businessTypes',
                    checkedValues.map((value) => String(value)),
                  )
                }
              />
            </AdminFormField>
            <AdminFormField label="Summary" fullWidth>
              <Input.TextArea
                className="call-record-query__summary-textarea"
                rows={7}
                value={summaryDraft.description}
                onChange={(event) =>
                  updateSummaryDraft('description', event.target.value)
                }
              />
            </AdminFormField>
          </div>
        )}
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeSummaryEditor}>
            Cancel
          </BaseButton>
          <BaseButton
            disabled={!canSaveSummary}
            variant="primary"
            onClick={handleSaveSummary}
          >
            Save
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
