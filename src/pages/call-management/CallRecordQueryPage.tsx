import {
  EyeOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { DatePicker, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import {
  AdminFilterField,
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
  ServiceEndedBy,
} from '../../types'

const { RangePicker } = DatePicker
const OPEN_EYE_REPLAY_SRC =
  '/screenshots/haloapp-v18/openeye-video-replay.png'
const SCREEN_RECORDING_REPLAY_SRC =
  '/screenshots/interaction-log/pstn-active-call-screen.png'

type CallRecordDateRange = [Dayjs, Dayjs]
type CallRecordPlaybackSource = 'screen' | 'video' | 'voice'

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
    dateRange: [dayjs().startOf('day'), dayjs().endOf('day')],
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
  const [appliedFilters, setAppliedFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [draftFilters, setDraftFilters] = useState<CallRecordFilters>(() =>
    createDefaultFilters(),
  )
  const [playbackRecordId, setPlaybackRecordId] = useState<string | null>(null)
  const [playbackSource, setPlaybackSource] =
    useState<CallRecordPlaybackSource | null>(null)
  const [isPlaybackRunning, setIsPlaybackRunning] = useState(false)
  const [playbackSeconds, setPlaybackSeconds] = useState(0)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  const selectedRecord = useMemo(
    () =>
      selectedRecordId
        ? callRecords.find((record) => record.id === selectedRecordId) ?? null
        : null,
    [callRecords, selectedRecordId],
  )

  const filteredRecords = useMemo(
    () =>
      callRecords
        .filter((record) => recordMatchesFilters(record, appliedFilters))
        .sort((first, second) => Date.parse(second.startedAt) - Date.parse(first.startedAt)),
    [appliedFilters, callRecords],
  )

  const isPlaybackPlaying =
    Boolean(selectedRecord) &&
    playbackRecordId === selectedRecord?.id &&
    Boolean(playbackSource) &&
    isPlaybackRunning

  useEffect(() => {
    if (!selectedRecord || !isPlaybackPlaying) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setPlaybackSeconds((currentSeconds) => {
        if (currentSeconds >= selectedRecord.durationSeconds) {
          window.clearInterval(timer)
          setIsPlaybackRunning(false)
          return selectedRecord.durationSeconds
        }

        return Math.min(currentSeconds + 1, selectedRecord.durationSeconds)
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isPlaybackPlaying, selectedRecord])

  const openDetail = (record: CallRecord) => {
    setPlaybackRecordId(null)
    setPlaybackSource(null)
    setIsPlaybackRunning(false)
    setPlaybackSeconds(0)
    setSelectedRecordId(record.id)
  }

  const closeDetail = () => {
    setPlaybackRecordId(null)
    setPlaybackSource(null)
    setIsPlaybackRunning(false)
    setPlaybackSeconds(0)
    setSelectedRecordId(null)
  }

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
  }

  const handleReset = () => {
    const nextFilters = createDefaultFilters()

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  const togglePlayback = (record: CallRecord, source: CallRecordPlaybackSource) => {
    if (playbackRecordId === record.id && playbackSource === source) {
      if (isPlaybackRunning) {
        setIsPlaybackRunning(false)
        return
      }

      if (playbackSeconds >= record.durationSeconds) {
        setPlaybackSeconds(0)
      }

      setIsPlaybackRunning(true)
      return
    }

    if (
      playbackRecordId !== record.id ||
      playbackSource !== source ||
      playbackSeconds >= record.durationSeconds
    ) {
      setPlaybackSeconds(0)
    }

    setPlaybackRecordId(record.id)
    setPlaybackSource(source)
    setIsPlaybackRunning(true)
  }

  const renderPlayerControls = (
    record: CallRecord,
    source: CallRecordPlaybackSource,
  ) => {
    const isCurrentPlayerPlaying =
      playbackRecordId === record.id &&
      playbackSource === source &&
      isPlaybackRunning
    const isCurrentPlayer =
      playbackRecordId === record.id && playbackSource === source
    const currentSeconds = isCurrentPlayer ? playbackSeconds : 0

    return (
      <div className="call-record-query__player-controls">
        <button
          aria-label={isCurrentPlayerPlaying ? 'Pause playback' : 'Play playback'}
          type="button"
          onClick={() => togglePlayback(record, source)}
        >
          {isCurrentPlayerPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </button>
        <div className="call-record-query__player-progress">
          <span
            style={{
              width: `${getPlaybackProgressPercent(record, currentSeconds)}%`,
            }}
          />
        </div>
        <strong>
          {formatPlaybackClock(currentSeconds)} /{' '}
          {formatPlaybackClock(record.durationSeconds)}
        </strong>
      </div>
    )
  }

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
      dataIndex: 'endReason',
      ellipsis: true,
      title: 'End Reason',
      width: 150,
    },
    {
      dataIndex: 'qmScore',
      render: (value: CallRecord['qmScore']) => value ?? '-',
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

  const renderCwuPanel = (record: CallRecord) => (
    <section className="call-record-query__summary-panel">
      <div className="call-record-query__column-title call-record-query__cwu-title">
        CWU
      </div>
      <div className="call-record-query__summary-card call-record-query__cwu-card">
        <div className="call-record-query__cwu-fields">
          <div>
            <span>Ticket No.</span>
            <strong>{record.summary.ticketNo}</strong>
          </div>
          <div>
            <span>Business Type</span>
            <div className="call-record-query__business-tags">
              {record.summary.businessTypes.length > 0 ? (
                record.summary.businessTypes.map((businessType) => (
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
            <p>{record.summary.description}</p>
          </div>
        </div>
      </div>
    </section>
  )
  const detailModalWidth =
    selectedRecord?.mediaType === 'Voice'
      ? 1320
      : selectedRecord?.mediaType === 'Video'
        ? 1180
        : 960
  const detailClassName = [
    'call-record-query__detail',
    selectedRecord?.mediaType === 'Voice'
      ? 'call-record-query__detail--voice'
      : '',
    selectedRecord?.mediaType === 'Video'
      ? 'call-record-query__detail--video'
      : '',
    selectedRecord?.mediaType === 'DM'
      ? 'call-record-query__detail--dm'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AdminPage
      className="call-record-query"
      title="Interaction Log"
      description="Current agent view for Phone, BankApp Voice, BankApp Video, BankApp, Webchat, and WhatsApp interaction records."
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
          horizontalScroll={1798}
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
            ? `Interaction Log Detail - ${selectedRecord.recordNo}`
            : 'Interaction Log Detail'
        }
        width={detailModalWidth}
        onCancel={closeDetail}
      >
        {selectedRecord && (
          <div className={detailClassName}>
            {selectedRecord.mediaType === 'Voice' ? (
              <>
                <section className="call-record-query__media-panel call-record-query__media-panel--voice">
                  <section className="call-record-query__playback-section">
                    <div className="call-record-query__column-title">
                      Voice Recording Playback
                    </div>
                    <div className="call-record-query__media-player call-record-query__media-player--voice">
                      {renderPlayerControls(selectedRecord, 'voice')}
                    </div>
                  </section>
                  <section className="call-record-query__playback-section call-record-query__playback-section--screen">
                    <div className="call-record-query__column-title">
                      Screen Recording Playback
                    </div>
                    <div className="call-record-query__media-player call-record-query__media-player--screen">
                      <div className="call-record-query__screen-replay">
                        <img
                          alt="Agent screen recording replay"
                          draggable={false}
                          src={SCREEN_RECORDING_REPLAY_SRC}
                        />
                      </div>
                      {renderPlayerControls(selectedRecord, 'screen')}
                    </div>
                  </section>
                </section>
                <section className="call-record-query__content-panel">
                  <div className="call-record-query__column-title">
                    Auto Transcript
                  </div>
                  {renderTranscriptLog(selectedRecord)}
                </section>
                {renderCwuPanel(selectedRecord)}
              </>
            ) : selectedRecord.mediaType === 'Video' ? (
              <>
                <section className="call-record-query__media-panel call-record-query__media-panel--video">
                  <div className="call-record-query__column-title">
                    Video Recording Playback
                  </div>
                  <div className="call-record-query__media-player call-record-query__media-player--video">
                    <div className="call-record-query__openeye-replay">
                      <img
                        alt="OpenEye video replay"
                        draggable={false}
                        src={OPEN_EYE_REPLAY_SRC}
                      />
                    </div>
                    {renderPlayerControls(selectedRecord, 'video')}
                  </div>
                </section>
                <section className="call-record-query__content-panel">
                  <div className="call-record-query__column-title">
                    Auto Transcript
                  </div>
                  {renderTranscriptLog(selectedRecord)}
                </section>
                {renderCwuPanel(selectedRecord)}
              </>
            ) : (
              <>
                <section className="call-record-query__content-panel">
                  <div className="call-record-query__column-title">
                    Conversation
                  </div>
                  {renderTranscriptLog(
                    selectedRecord,
                    'call-record-query__chat-log--dm',
                  )}
                </section>
                {renderCwuPanel(selectedRecord)}
              </>
            )}
          </div>
        )}
        <AdminModalFooter>
          <BaseButton variant="secondary" onClick={closeDetail}>
            Close
          </BaseButton>
        </AdminModalFooter>
      </AdminModal>
    </AdminPage>
  )
}
