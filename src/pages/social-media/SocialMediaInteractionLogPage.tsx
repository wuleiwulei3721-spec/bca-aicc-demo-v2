import {
  EyeOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { DatePicker, Input, Modal, Select, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import {
  AgentAvatar,
  AdminFilterField,
  AdminModal,
  AdminModalFooter,
  AdminPage,
  AdminTable,
  AdminToolbar,
  BaseButton,
  BaseCard,
  CustomerAvatar,
  StatusBadge,
} from '../../components'
import {
  socialMediaInteractionAgents,
  socialMediaInteractionLogRecords,
} from '../../mock/socialMediaInteractionLog'
import { useAuthStore } from '../../store'
import type {
  SocialMediaInteractionAgentOption,
  SocialMediaInteractionChannel,
  SocialMediaInteractionLogRecord,
  SocialMediaMessageType,
} from '../../types/socialMediaInteractionLog'

const { RangePicker } = DatePicker

type OptionalDateRange = [Dayjs, Dayjs] | null

interface SocialMediaInteractionFilters {
  agentName: string
  bcaAccount: 'All' | string
  channel: 'All' | SocialMediaInteractionChannel
  customerAccount: string
  customerContactTime: [Dayjs, Dayjs]
  distributeToAgentTime: OptionalDateRange
  firstResponseTime: OptionalDateRange
  messageType: 'All' | SocialMediaMessageType
  responseDurationMax: string
  responseDurationMin: string
  summary: string
  team: 'All' | string
  ticketTypes: string[]
}

const channelOptions: Array<{
  label: string
  value: SocialMediaInteractionFilters['channel']
}> = [
  { label: 'All Channels', value: 'All' },
  { label: 'Twitter', value: 'Twitter' },
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'YouTube', value: 'YouTube' },
  { label: 'TikTok', value: 'TikTok' },
  { label: 'LinkedIn', value: 'LinkedIn' },
]

const messageTypeOptions: Array<{
  label: string
  value: SocialMediaInteractionFilters['messageType']
}> = [
  { label: 'All Message Types', value: 'All' },
  { label: 'Mention', value: 'Mention' },
  { label: 'Comment', value: 'Comment' },
  { label: 'Review', value: 'Review' },
  { label: 'Chat', value: 'Chat' },
]

const ticketTypeOptions = [
  'Account Opening',
  'ATM',
  'Card Service',
  'Fraud Report',
  'Login Issue',
  'Mobile Banking',
  'Promotion',
  'Service Feedback',
  'Transaction Inquiry',
].map((value) => ({ label: value, value }))

function createDefaultFilters(): SocialMediaInteractionFilters {
  return {
    agentName: '',
    bcaAccount: 'All',
    channel: 'All',
    customerAccount: '',
    customerContactTime: [
      dayjs().subtract(7, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
    distributeToAgentTime: null,
    firstResponseTime: null,
    messageType: 'All',
    responseDurationMax: '',
    responseDurationMin: '',
    summary: '',
    team: 'All',
    ticketTypes: [],
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

function parseDuration(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const match = trimmedValue.match(/^(\d{1,2}):([0-5]\d):([0-5]\d)$/)

  if (!match) {
    return Number.NaN
  }

  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
}

function getOptions(values: string[], allLabel: string) {
  return [
    { label: allLabel, value: 'All' },
    ...Array.from(new Set(values)).map((value) => ({
      label: value,
      value,
    })),
  ]
}

function isDateInRange(value: string, range: OptionalDateRange) {
  if (!range) {
    return true
  }

  const [rangeStart, rangeEnd] = range
  const recordDate = dayjs(value)

  return (
    (!rangeStart ||
      recordDate.isSame(rangeStart, 'second') ||
      recordDate.isAfter(rangeStart)) &&
    (!rangeEnd ||
      recordDate.isSame(rangeEnd, 'second') ||
      recordDate.isBefore(rangeEnd))
  )
}

function recordMatchesFilters(
  record: SocialMediaInteractionLogRecord,
  filters: SocialMediaInteractionFilters,
) {
  const customerAccount = normalizeValue(filters.customerAccount)
  const agentName = normalizeValue(filters.agentName)
  const summary = normalizeValue(filters.summary)
  const durationMin = parseDuration(filters.responseDurationMin)
  const durationMax = parseDuration(filters.responseDurationMax)

  return (
    (filters.channel === 'All' || record.channel === filters.channel) &&
    (filters.messageType === 'All' ||
      record.messageType === filters.messageType) &&
    (filters.team === 'All' || record.team === filters.team) &&
    (filters.bcaAccount === 'All' ||
      record.bcaAccount === filters.bcaAccount) &&
    (!customerAccount ||
      normalizeValue(record.customerAccount).includes(customerAccount)) &&
    (!agentName || normalizeValue(record.agentName).includes(agentName)) &&
    (!summary || normalizeValue(record.summary).includes(summary)) &&
    (filters.ticketTypes.length === 0 ||
      record.ticketTypes.some((ticketType) =>
        filters.ticketTypes.includes(ticketType),
      )) &&
    isDateInRange(record.customerContactTime, filters.customerContactTime) &&
    isDateInRange(record.distributeToAgentTime, filters.distributeToAgentTime) &&
    isDateInRange(record.firstResponseTime, filters.firstResponseTime) &&
    (durationMin === null || record.responseDurationSeconds >= durationMin) &&
    (durationMax === null || record.responseDurationSeconds <= durationMax)
  )
}

function hasInvalidDuration(filters: SocialMediaInteractionFilters) {
  return (
    Number.isNaN(parseDuration(filters.responseDurationMin)) ||
    Number.isNaN(parseDuration(filters.responseDurationMax))
  )
}

function canViewAllSocialMediaInteractions(roleName?: string) {
  return ['OM', 'RTFM', 'SPV', 'TL'].includes(roleName ?? '')
}

export function SocialMediaInteractionLogPage() {
  const authSession = useAuthStore((state) => state.session)
  const [appliedFilters, setAppliedFilters] =
    useState<SocialMediaInteractionFilters>(() => createDefaultFilters())
  const [draftFilters, setDraftFilters] =
    useState<SocialMediaInteractionFilters>(() => createDefaultFilters())
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [alertRecordId, setAlertRecordId] = useState<string | null>(null)
  const [isAgentLookupOpen, setIsAgentLookupOpen] = useState(false)
  const [agentLookupKeyword, setAgentLookupKeyword] = useState('')

  const teamOptions = useMemo(
    () =>
      getOptions(
        socialMediaInteractionLogRecords.map((record) => record.team),
        'All Teams',
      ),
    [],
  )
  const bcaAccountOptions = useMemo(
    () =>
      getOptions(
        socialMediaInteractionLogRecords.map((record) => record.bcaAccount),
        'All BCA Accounts',
      ),
    [],
  )
  const permissionScopedRecords = useMemo(() => {
    if (
      canViewAllSocialMediaInteractions(authSession?.roleName) ||
      !authSession
    ) {
      return socialMediaInteractionLogRecords
    }

    return socialMediaInteractionLogRecords.filter(
      (record) => record.agentName === authSession.displayName,
    )
  }, [authSession])
  const filteredRecords = useMemo(
    () =>
      permissionScopedRecords
        .filter((record) => recordMatchesFilters(record, appliedFilters))
        .sort(
          (first, second) =>
            Date.parse(second.customerContactTime) -
            Date.parse(first.customerContactTime),
        ),
    [appliedFilters, permissionScopedRecords],
  )
  const selectedRecord = useMemo(
    () =>
      selectedRecordId
        ? socialMediaInteractionLogRecords.find(
            (record) => record.id === selectedRecordId,
          ) ?? null
        : null,
    [selectedRecordId],
  )
  const alertRecord = useMemo(
    () =>
      alertRecordId
        ? socialMediaInteractionLogRecords.find(
            (record) => record.id === alertRecordId,
          ) ?? null
        : null,
    [alertRecordId],
  )
  const filteredAgentOptions = useMemo(() => {
    const keyword = normalizeValue(agentLookupKeyword)

    return socialMediaInteractionAgents.filter((agent) =>
      keyword
        ? [agent.name, agent.team, agent.role]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        : true,
    )
  }, [agentLookupKeyword])

  const handleSearch = () => {
    if (!draftFilters.customerContactTime) {
      Modal.warning({
        title: 'Customer Contact Time is required',
        content:
          'Please select a start and end value before running the query.',
      })
      return
    }

    if (hasInvalidDuration(draftFilters)) {
      Modal.warning({
        title: 'Invalid Response Duration',
        content: 'Please use HH:mm:ss for the duration range.',
      })
      return
    }

    setAppliedFilters({ ...draftFilters })
  }

  const handleReset = () => {
    const nextFilters = createDefaultFilters()

    setDraftFilters(nextFilters)
    setAppliedFilters(nextFilters)
  }

  const selectAgent = (agent: SocialMediaInteractionAgentOption) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      agentName: agent.name,
    }))
    setIsAgentLookupOpen(false)
  }

  const columns: ColumnsType<SocialMediaInteractionLogRecord> = [
    {
      dataIndex: 'channel',
      title: 'Channel',
      width: 106,
    },
    {
      dataIndex: 'messageType',
      title: 'Message Type',
      width: 126,
    },
    {
      dataIndex: 'customerAccount',
      ellipsis: true,
      title: 'Customer Account',
      width: 158,
    },
    {
      dataIndex: 'agentName',
      ellipsis: true,
      title: 'Agent Name',
      width: 136,
    },
    {
      dataIndex: 'team',
      ellipsis: true,
      title: 'Team',
      width: 190,
    },
    {
      dataIndex: 'bcaAccount',
      ellipsis: true,
      title: 'BCA Account',
      width: 146,
    },
    {
      dataIndex: 'customerContactTime',
      render: formatDateTime,
      title: 'Customer Contact Time',
      width: 188,
    },
    {
      dataIndex: 'distributeToAgentTime',
      render: formatDateTime,
      title: 'Distribute to Agent Time',
      width: 206,
    },
    {
      dataIndex: 'firstResponseTime',
      render: formatDateTime,
      title: 'First Response Time',
      width: 188,
    },
    {
      dataIndex: 'responseDurationSeconds',
      render: formatDuration,
      title: 'Response Duration',
      width: 150,
    },
    {
      dataIndex: 'ticketTypes',
      ellipsis: true,
      render: (value: string[]) => value.join(', '),
      title: 'Ticket Type',
      width: 190,
    },
    {
      dataIndex: 'summary',
      ellipsis: true,
      title: 'Summary',
      width: 300,
    },
    {
      align: 'center',
      dataIndex: 'qmScore',
      render: (value: SocialMediaInteractionLogRecord['qmScore']) =>
        value === null ? (
          '-'
        ) : (
          <span
            className={`social-interaction-log__qm-score ${
              value < 80 ? 'social-interaction-log__qm-score--warning' : ''
            }`}
          >
            {value}
          </span>
        ),
      title: 'QM',
      width: 82,
    },
    {
      align: 'center',
      dataIndex: 'alert',
      fixed: 'right',
      render: (value: boolean, record) =>
        value ? (
          <button
            className="social-interaction-log__alert-link"
            type="button"
            onClick={() => setAlertRecordId(record.id)}
          >
            Yes
          </button>
        ) : (
          <span className="social-interaction-log__alert-muted">No</span>
        ),
      title: 'Alert',
      width: 84,
    },
    {
      fixed: 'right',
      render: (_, record) => (
        <div className="routing-config-crud__row-actions social-interaction-log__row-actions">
          <button
            aria-label={`View ${record.id}`}
            title="View"
            type="button"
            onClick={() => setSelectedRecordId(record.id)}
          >
            <EyeOutlined />
          </button>
        </div>
      ),
      title: 'Action',
      width: 74,
    },
  ]

  return (
    <AdminPage
      className="social-interaction-log"
      description="Historical query for customer messages and agent replies received through social media channels."
      title="Social Media Interaction Log"
    >
      <BaseCard compact>
        <AdminToolbar
          filtersClassName="social-interaction-log__filters"
          filters={
            <>
              <AdminFilterField label="Channel" width={200}>
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
              <AdminFilterField label="Message Type" width={200}>
                <Select
                  options={messageTypeOptions}
                  value={draftFilters.messageType}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      messageType: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Customer Account" width={220}>
                <Input
                  allowClear
                  placeholder="Enter customer account"
                  value={draftFilters.customerAccount}
                  onChange={(event) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      customerAccount: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Agent Name" width={220}>
                <Input
                  allowClear
                  addonAfter={
                    <button
                      aria-label="Agent lookup"
                      className="social-interaction-log__lookup-trigger"
                      title="Agent lookup"
                      type="button"
                      onClick={() => setIsAgentLookupOpen(true)}
                    >
                      <TeamOutlined />
                    </button>
                  }
                  placeholder="Enter agent name"
                  value={draftFilters.agentName}
                  onChange={(event) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      agentName: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Team" width={210}>
                <Select
                  options={teamOptions}
                  value={draftFilters.team}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      team: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="BCA Account" width={210}>
                <Select
                  options={bcaAccountOptions}
                  value={draftFilters.bcaAccount}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      bcaAccount: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Ticket Type" width={220}>
                <Select
                  allowClear
                  mode="multiple"
                  maxTagCount="responsive"
                  options={ticketTypeOptions}
                  placeholder="All Ticket Types"
                  value={draftFilters.ticketTypes}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      ticketTypes: value,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Customer Contact Time" width={320}>
                <RangePicker
                  allowClear={false}
                  showTime
                  value={draftFilters.customerContactTime}
                  onChange={(value) => {
                    if (!value?.[0] || !value[1]) {
                      return
                    }

                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      customerContactTime: [value[0], value[1]],
                    }))
                  }}
                />
              </AdminFilterField>
              <AdminFilterField label="Distribute to Agent Time" width={320}>
                <RangePicker
                  showTime
                  value={draftFilters.distributeToAgentTime}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      distributeToAgentTime:
                        value?.[0] && value[1] ? [value[0], value[1]] : null,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="First Response Time" width={320}>
                <RangePicker
                  showTime
                  value={draftFilters.firstResponseTime}
                  onChange={(value) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      firstResponseTime:
                        value?.[0] && value[1] ? [value[0], value[1]] : null,
                    }))
                  }
                />
              </AdminFilterField>
              <AdminFilterField label="Response Duration" width={250}>
                <Input.Group compact>
                  <Input
                    className="social-interaction-log__duration-input"
                    placeholder="HH:mm:ss"
                    value={draftFilters.responseDurationMin}
                    onChange={(event) =>
                      setDraftFilters((currentFilters) => ({
                        ...currentFilters,
                        responseDurationMin: event.target.value,
                      }))
                    }
                  />
                  <Input
                    className="social-interaction-log__duration-input"
                    placeholder="HH:mm:ss"
                    value={draftFilters.responseDurationMax}
                    onChange={(event) =>
                      setDraftFilters((currentFilters) => ({
                        ...currentFilters,
                        responseDurationMax: event.target.value,
                      }))
                    }
                  />
                </Input.Group>
              </AdminFilterField>
              <AdminFilterField label="Summary" width={300}>
                <Input
                  allowClear
                  placeholder="Search summary keywords"
                  value={draftFilters.summary}
                  onChange={(event) =>
                    setDraftFilters((currentFilters) => ({
                      ...currentFilters,
                      summary: event.target.value,
                    }))
                  }
                />
              </AdminFilterField>
              <div className="routing-config-page__admin-actions">
                <BaseButton
                  icon={<SearchOutlined />}
                  variant="primary"
                  onClick={handleSearch}
                >
                  Search
                </BaseButton>
                <BaseButton variant="secondary" onClick={handleReset}>
                  Reset
                </BaseButton>
              </div>
            </>
          }
        />
        <div className="social-interaction-log__scope-note">
          {canViewAllSocialMediaInteractions(authSession?.roleName)
            ? 'Current role can view all social media interactions.'
            : 'Agent data scope: only interactions handled by the current agent are displayed.'}
        </div>
        <AdminTable<SocialMediaInteractionLogRecord>
          columns={columns}
          dataSource={filteredRecords}
          horizontalScroll={2260}
          pagination={{}}
          rowKey="id"
        />
      </BaseCard>
      <AdminModal
        destroyOnClose
        width={1280}
        className="social-interaction-log__view-modal"
        open={Boolean(selectedRecord)}
        title="View"
        footer={
          <AdminModalFooter>
            <BaseButton
              variant="primary"
              onClick={() => setSelectedRecordId(null)}
            >
              Close
            </BaseButton>
          </AdminModalFooter>
        }
        onCancel={() => setSelectedRecordId(null)}
      >
        {selectedRecord && (
          <div className="social-interaction-log__detail">
            <section className="social-interaction-log__conversation-panel">
              <header className="social-interaction-log__detail-header">
                <strong>Conversation</strong>
                <span>
                  {selectedRecord.channel} / {selectedRecord.messageType}
                </span>
              </header>
              <div className="social-interaction-log__conversation-list">
                {selectedRecord.conversation.map((message) => (
                  <article
                    className={`social-interaction-log__message ${
                      message.role === 'Agent'
                        ? 'social-interaction-log__message--agent'
                        : ''
                    }`}
                    key={message.id}
                  >
                    {message.role === 'Agent' ? (
                      <AgentAvatar
                        className="social-interaction-log__avatar"
                        name={message.sender}
                        size={34}
                      />
                    ) : (
                      <CustomerAvatar
                        className="social-interaction-log__avatar"
                        size={34}
                      />
                    )}
                    <div className="social-interaction-log__bubble">
                      <div className="social-interaction-log__bubble-meta">
                        <div>
                          <span>{message.role}</span>
                          <strong>{message.sender}</strong>
                        </div>
                        <time>{formatDateTime(message.messageTime)}</time>
                      </div>
                      <p>{message.content}</p>
                      {message.originalContentUrl && (
                        <a
                          href={message.originalContentUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          View Original Content
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <aside className="social-interaction-log__ticket-panel">
              <header className="social-interaction-log__detail-header">
                <strong>Ticket</strong>
                <span>{selectedRecord.id}</span>
              </header>
              <div className="social-interaction-log__ticket-body">
                <section>
                  <span className="call-record-query__field-label">Status</span>
                  <StatusBadge
                    dot
                    label={selectedRecord.status}
                    size="small"
                    status={
                      selectedRecord.status === 'Closed'
                        ? 'success'
                        : 'selected'
                    }
                  />
                </section>
                <section>
                  <span className="call-record-query__field-label">
                    Ticket Type
                  </span>
                  <div className="social-interaction-log__tag-list">
                    {selectedRecord.ticketTypes.map((ticketType) => (
                      <Tag key={ticketType}>{ticketType}</Tag>
                    ))}
                  </div>
                </section>
                <section>
                  <span className="call-record-query__field-label">Summary</span>
                  <p>{selectedRecord.summary}</p>
                </section>
              </div>
            </aside>
          </div>
        )}
      </AdminModal>
      <AdminModal
        destroyOnClose
        width={620}
        open={Boolean(alertRecord)}
        title="Alert Details"
        footer={
          <AdminModalFooter>
            <BaseButton variant="primary" onClick={() => setAlertRecordId(null)}>
              Close
            </BaseButton>
          </AdminModalFooter>
        }
        onCancel={() => setAlertRecordId(null)}
      >
        {alertRecord && (
          <div className="social-interaction-log__alert-detail">
            <section>
              <strong>{alertRecord.alertTitle ?? 'Interaction alert'}</strong>
              <p>{alertRecord.alertReason ?? 'This record requires review.'}</p>
            </section>
            <dl>
              <div>
                <dt>Interaction ID</dt>
                <dd>{alertRecord.id}</dd>
              </div>
              <div>
                <dt>Customer Account</dt>
                <dd>{alertRecord.customerAccount}</dd>
              </div>
              <div>
                <dt>Agent Name</dt>
                <dd>{alertRecord.agentName}</dd>
              </div>
              <div>
                <dt>QM</dt>
                <dd>{alertRecord.qmScore ?? '-'}</dd>
              </div>
              <div>
                <dt>First Response Time</dt>
                <dd>{formatDateTime(alertRecord.firstResponseTime)}</dd>
              </div>
              <div>
                <dt>Response Duration</dt>
                <dd>{formatDuration(alertRecord.responseDurationSeconds)}</dd>
              </div>
            </dl>
          </div>
        )}
      </AdminModal>
      <AdminModal
        destroyOnClose
        width={640}
        open={isAgentLookupOpen}
        title="Agent Lookup"
        footer={null}
        onCancel={() => setIsAgentLookupOpen(false)}
      >
        <div className="social-interaction-log__agent-lookup">
          <Input
            allowClear
            placeholder="Search agent or team"
            prefix={<SearchOutlined />}
            value={agentLookupKeyword}
            onChange={(event) => setAgentLookupKeyword(event.target.value)}
          />
          <AdminTable<SocialMediaInteractionAgentOption>
            columns={[
              {
                dataIndex: 'name',
                title: 'Agent Name',
              },
              {
                dataIndex: 'team',
                title: 'Team',
              },
              {
                dataIndex: 'role',
                title: 'Role',
                width: 86,
              },
              {
                fixed: 'right',
                render: (_, agent) => (
                  <BaseButton
                    size="small"
                    variant="secondary"
                    onClick={() => selectAgent(agent)}
                  >
                    Select
                  </BaseButton>
                ),
                title: 'Action',
                width: 92,
              },
            ]}
            dataSource={filteredAgentOptions}
            horizontalScroll={520}
            pagination={false}
            rowKey="name"
            tableVariant="modal"
          />
        </div>
      </AdminModal>
    </AdminPage>
  )
}
