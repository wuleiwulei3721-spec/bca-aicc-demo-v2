import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StarFilled,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import {
  AdminModal,
  AdminModalFooter,
  BaseButton,
} from '../../components'
import type { CallRecord } from '../../types'

const OPEN_EYE_REPLAY_SRC =
  '/screenshots/haloapp-v18/openeye-video-replay.png'
const SCREEN_RECORDING_REPLAY_SRC =
  '/screenshots/interaction-log/pstn-active-call-screen.png'

type CallRecordPlaybackSource = 'screen' | 'video' | 'voice'

interface CallRecordDetailModalProps {
  onClose: () => void
  record: CallRecord | null
}

function formatPlaybackClock(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60)
  const seconds = durationSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getPlaybackProgressPercent(record: CallRecord, playbackSeconds: number) {
  if (record.durationSeconds <= 0) {
    return 0
  }

  return Math.min(100, (playbackSeconds / record.durationSeconds) * 100)
}

function getSpeakerName(
  record: CallRecord,
  speaker: CallRecord['transcript'][number]['speaker'],
) {
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

function renderTranscriptLine(
  record: CallRecord,
  line: CallRecord['transcript'][number],
) {
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

export function CallRecordDetailModal({
  onClose,
  record,
}: CallRecordDetailModalProps) {
  const [playbackRecordId, setPlaybackRecordId] = useState<string | null>(null)
  const [playbackSource, setPlaybackSource] =
    useState<CallRecordPlaybackSource | null>(null)
  const [isPlaybackRunning, setIsPlaybackRunning] = useState(false)
  const [playbackSeconds, setPlaybackSeconds] = useState(0)

  const isPlaybackPlaying =
    Boolean(record) &&
    playbackRecordId === record?.id &&
    Boolean(playbackSource) &&
    isPlaybackRunning

  useEffect(() => {
    if (!record || !isPlaybackPlaying) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setPlaybackSeconds((currentSeconds) => {
        if (currentSeconds >= record.durationSeconds) {
          window.clearInterval(timer)
          setIsPlaybackRunning(false)
          return record.durationSeconds
        }

        return Math.min(currentSeconds + 1, record.durationSeconds)
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isPlaybackPlaying, record])

  const closeDetail = () => {
    setPlaybackRecordId(null)
    setPlaybackSource(null)
    setIsPlaybackRunning(false)
    setPlaybackSeconds(0)
    onClose()
  }

  const togglePlayback = (
    targetRecord: CallRecord,
    source: CallRecordPlaybackSource,
  ) => {
    if (playbackRecordId === targetRecord.id && playbackSource === source) {
      if (isPlaybackRunning) {
        setIsPlaybackRunning(false)
        return
      }

      if (playbackSeconds >= targetRecord.durationSeconds) {
        setPlaybackSeconds(0)
      }

      setIsPlaybackRunning(true)
      return
    }

    setPlaybackSeconds(0)
    setPlaybackRecordId(targetRecord.id)
    setPlaybackSource(source)
    setIsPlaybackRunning(true)
  }

  const renderPlayerControls = (
    targetRecord: CallRecord,
    source: CallRecordPlaybackSource,
  ) => {
    const isCurrentPlayerPlaying =
      playbackRecordId === targetRecord.id &&
      playbackSource === source &&
      isPlaybackRunning
    const isCurrentPlayer =
      playbackRecordId === targetRecord.id && playbackSource === source
    const currentSeconds = isCurrentPlayer ? playbackSeconds : 0

    return (
      <div className="call-record-query__player-controls">
        <button
          aria-label={isCurrentPlayerPlaying ? 'Pause playback' : 'Play playback'}
          type="button"
          onClick={() => togglePlayback(targetRecord, source)}
        >
          {isCurrentPlayerPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </button>
        <div className="call-record-query__player-progress">
          <span
            style={{
              width: `${getPlaybackProgressPercent(targetRecord, currentSeconds)}%`,
            }}
          />
        </div>
        <strong>
          {formatPlaybackClock(currentSeconds)} /{' '}
          {formatPlaybackClock(targetRecord.durationSeconds)}
        </strong>
      </div>
    )
  }

  const renderTranscriptLog = (
    targetRecord: CallRecord,
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
      {targetRecord.transcript.map((line) => renderTranscriptLine(targetRecord, line))}
    </div>
  )

  const renderCwuPanel = (targetRecord: CallRecord) => (
    <div className="call-record-query__summary-stack">
      <section className="call-record-query__summary-panel call-record-query__summary-panel--tickets">
        <div className="call-record-query__column-title">Ticket</div>
        <div className="call-record-query__summary-card call-record-query__cwu-card">
          <div className="call-record-query__ticket-content">
            {targetRecord.summary.tickets.length > 0 ? (
              targetRecord.summary.tickets.map((ticket) => (
                <article className="call-record-query__ticket-entry" key={ticket.id}>
                  <span className="call-record-query__field-label">
                    {ticket.id}
                  </span>
                  <div className="call-record-query__business-tags">
                    {ticket.categories.length > 0 ? (
                      ticket.categories.map((category) => (
                        <span className="call-record-query__business-tag" key={category}>
                          {category}
                        </span>
                      ))
                    ) : (
                      <strong>-</strong>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="call-record-query__ticket-empty">-</div>
            )}
            <div className="call-record-query__ticket-summary">
              <span className="call-record-query__field-label">Summary</span>
              <p>{targetRecord.summary.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="call-record-query__summary-panel call-record-query__summary-panel--satisfaction">
        <div className="call-record-query__column-title">Satisfaction</div>
        <div className="call-record-query__satisfaction-fields">
          <div>
            <span className="call-record-query__field-label">Rating Score</span>
            {targetRecord.ratingScore === null ? (
              <strong>-</strong>
            ) : (
              <div
                aria-label={`${targetRecord.ratingScore} out of 5 stars`}
                className="call-record-query__rating-score"
                role="img"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <StarFilled
                    className={
                      index < targetRecord.ratingScore
                        ? 'call-record-query__rating-star--filled'
                        : 'call-record-query__rating-star'
                    }
                    key={index}
                  />
                ))}
                <strong>{targetRecord.ratingScore}</strong>
              </div>
            )}
          </div>
          <div>
            <span className="call-record-query__field-label">Feedback</span>
            <p>{targetRecord.ratingFeedback ?? '-'}</p>
          </div>
        </div>
      </section>
    </div>
  )

  const detailModalWidth =
    record?.mediaType === 'Voice'
      ? 1320
      : record?.mediaType === 'Video'
        ? 1180
        : 960
  const detailClassName = [
    'call-record-query__detail',
    record?.mediaType === 'Voice' ? 'call-record-query__detail--voice' : '',
    record?.mediaType === 'Video' ? 'call-record-query__detail--video' : '',
    record?.mediaType === 'DM' ? 'call-record-query__detail--dm' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AdminModal
      destroyOnClose
      className="call-record-query__detail-modal"
      open={Boolean(record)}
      title={
        record
          ? `Interaction Log Detail - ${record.recordNo}`
          : 'Interaction Log Detail'
      }
      width={detailModalWidth}
      onCancel={closeDetail}
    >
      {record && (
        <div className={detailClassName}>
          {record.mediaType === 'Voice' ? (
            <>
              <section className="call-record-query__media-panel call-record-query__media-panel--voice">
                <section className="call-record-query__playback-section">
                  <div className="call-record-query__column-title">
                    Voice Recording Playback
                  </div>
                  <div className="call-record-query__media-player call-record-query__media-player--voice">
                    {renderPlayerControls(record, 'voice')}
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
                    {renderPlayerControls(record, 'screen')}
                  </div>
                </section>
              </section>
              <section className="call-record-query__content-panel">
                <div className="call-record-query__column-title">Auto Transcript</div>
                {renderTranscriptLog(record)}
              </section>
              {renderCwuPanel(record)}
            </>
          ) : record.mediaType === 'Video' ? (
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
                  {renderPlayerControls(record, 'video')}
                </div>
              </section>
              <section className="call-record-query__content-panel">
                <div className="call-record-query__column-title">Auto Transcript</div>
                {renderTranscriptLog(record)}
              </section>
              {renderCwuPanel(record)}
            </>
          ) : (
            <>
              <section className="call-record-query__content-panel">
                <div className="call-record-query__column-title">Conversation</div>
                {renderTranscriptLog(record, 'call-record-query__chat-log--dm')}
              </section>
              {renderCwuPanel(record)}
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
  )
}
