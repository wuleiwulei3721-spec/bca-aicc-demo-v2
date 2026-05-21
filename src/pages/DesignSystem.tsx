import {
  AudioMutedOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined,
  MailOutlined,
  PauseCircleOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactNode } from 'react'
import {
  BaseButton,
  BaseCard,
  BaseTable,
  BaseTabs,
  CustomerInformationPanel,
  PageContainer,
  PhoneIcon,
  SearchInput,
  StatusBadge,
  TimelineFlow,
  ToolbarButton,
} from '../components'
import {
  callFlowDetail,
  customerJourney,
  inboundCustomer,
  ticketingHistory,
} from '../mock/inbound'
import { ChannelTag } from './inbound/components/ChannelTag'

const colors = [
  ['Primary Blue', '#1769E0', 'Primary CTA, active toolbar, key links'],
  ['Gradient Blue', '#0B4FA8 to #1686CF', 'Global header, high-emphasis shell'],
  ['Background', '#F4F7FB', 'Application canvas'],
  ['Card Background', '#FFFFFF', 'Cards, tables, modal body'],
  ['Subtle Background', '#F8FBFF', 'Highlighted card body, empty state'],
  ['Border', '#DDE6F2', 'Card, table, form divider'],
  ['Hover', '#F3F8FF', 'Rows, buttons, selectable surfaces'],
  ['Active', '#DBEAFF', 'Pressed and focused controls'],
  ['Selected', '#E8F1FF', 'Selected menu, tabs, tags'],
  ['Success', '#1F9D67', 'Ready, verified, passed'],
  ['Warning', '#D9822B', 'Not ready, AUX, pending verification'],
  ['Error', '#D64545', 'Failed, danger, hang up'],
  ['Disabled', '#EEF2F7', 'Unavailable controls'],
]

const typography = [
  ['Page Title', '20px', '600', '28px', 'Workspace page heading'],
  ['Section Header', '15px', '700', '22px', 'Modal title and major sections'],
  ['Card Title', '12px', '650', '16px', 'Dense card header'],
  ['Body Text', '13px', '400-600', '20px', 'Primary content'],
  ['Secondary Text', '12px', '600', '18px', 'Metadata and labels'],
  ['Caption', '11px', '650', '16px', 'Badges, compact hints'],
  ['Status Text', '11px', '650', '18px', 'Status badge labels'],
]

const spacing = [
  ['Page Padding', '12px shell / 24px standard', 'Workspace content in shell'],
  ['Card Padding', '10px compact / 16px standard', 'Card body content'],
  ['Module Gap', '8px compact / 16px standard', 'Panel and module rhythm'],
  ['Row Gap', '6px-8px', 'Lists, tables, chat messages'],
  ['Modal Gap', '10px body / 8px footer buttons', 'Modal content sections'],
]

const buttonStates = ['Default', 'Hover', 'Active', 'Disabled', 'Selected']

interface DemoRecord {
  key: string
  owner: string
  queue: string
  status: string
  time: string
}

const tableColumns: ColumnsType<DemoRecord> = [
  {
    dataIndex: 'owner',
    title: 'Owner',
    width: 160,
  },
  {
    dataIndex: 'queue',
    title: 'Queue',
  },
  {
    dataIndex: 'status',
    title: 'Status',
    width: 120,
    render: (value: string) => (
      <StatusBadge
        label={value}
        size="small"
        status={value === 'Verified' ? 'verified' : 'warning'}
      />
    ),
  },
  {
    dataIndex: 'time',
    title: 'Time',
    width: 90,
  },
]

const tableData: DemoRecord[] = [
  {
    key: '1',
    owner: 'Rina Putri',
    queue: 'Credit Card Service',
    status: 'Verified',
    time: '05:23',
  },
  {
    key: '2',
    owner: 'Andi Saputra',
    queue: 'Priority Banking',
    status: 'Pending',
    time: '02:11',
  },
]

function DesignSection({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section className="design-system-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function DesignSystem() {
  return (
    <PageContainer
      description="Unified UI rules and reusable components for Online Chat, Video Call, Dashboard, Admin, Supervisor, and future AICC modules."
      eyebrow="BANK 1 AICC"
      title="UI Design System"
    >
      <div className="design-system-page">
        <DesignSection title="1. Color System">
          <div className="design-token-grid design-token-grid--colors">
            {colors.map(([name, value, usage]) => (
              <div className="design-color-token" key={name}>
                <span
                  className="design-color-token__swatch"
                  style={
                    name === 'Gradient Blue'
                      ? { background: 'var(--aicc-primary-gradient)' }
                      : { background: value }
                  }
                />
                <div>
                  <strong>{name}</strong>
                  <code>{value}</code>
                  <p>{usage}</p>
                </div>
              </div>
            ))}
          </div>
        </DesignSection>

        <DesignSection title="2. Typography">
          <div className="design-spec-table">
            {typography.map(([name, size, weight, lineHeight, usage]) => (
              <div className="design-spec-row" key={name}>
                <strong>{name}</strong>
                <span>{size}</span>
                <span>{weight}</span>
                <span>{lineHeight}</span>
                <p>{usage}</p>
              </div>
            ))}
          </div>
        </DesignSection>

        <DesignSection title="3. Spacing System">
          <div className="design-spacing-grid">
            {spacing.map(([name, value, usage]) => (
              <div className="design-spacing-token" key={name}>
                <strong>{name}</strong>
                <code>{value}</code>
                <span>{usage}</span>
              </div>
            ))}
          </div>
        </DesignSection>

        <DesignSection title="4. Button System">
          <div className="design-component-grid">
            <BaseCard compact title="Button Variants">
              <Space size={8} wrap>
                <BaseButton icon={<PhoneIcon />} variant="primary">
                  Primary Button
                </BaseButton>
                <BaseButton icon={<SearchOutlined />}>Secondary Button</BaseButton>
                <BaseButton icon={<SettingOutlined />} variant="ghost">
                  Ghost Button
                </BaseButton>
                <BaseButton icon={<SearchOutlined />} />
                <BaseButton icon={<SwapOutlined />} variant="toolbar">
                  Toolbar Button
                </BaseButton>
                <BaseButton icon={<DisconnectOutlined />} variant="danger">
                  Danger Button
                </BaseButton>
              </Space>
            </BaseCard>
            <BaseCard compact title="States">
              <div className="design-button-state-grid">
                {buttonStates.map((state) => (
                  <BaseButton
                    disabled={state === 'Disabled'}
                    key={state}
                    selected={state === 'Selected'}
                    type={state === 'Active' ? 'primary' : undefined}
                  >
                    {state}
                  </BaseButton>
                ))}
              </div>
            </BaseCard>
          </div>
        </DesignSection>

        <DesignSection title="5. Status System">
          <div className="design-status-grid">
            <StatusBadge dot label="Ready" status="ready" />
            <StatusBadge dot label="Not Ready" status="not-ready" />
            <StatusBadge dot label="AUX" status="aux" />
            <StatusBadge label="Talking" status="talking" />
            <StatusBadge label="Hold" status="hold" />
            <StatusBadge label="Mute" status="mute" />
            <StatusBadge label="Verified" status="verified" />
            <StatusBadge label="Failed" status="failed" />
          </div>
        </DesignSection>

        <DesignSection title="6. Card System">
          <div className="design-component-grid design-component-grid--cards">
            <CustomerInformationPanel
              accessChannelNode={<ChannelTag compact value="Phone" />}
              customer={inboundCustomer}
            />
            <BaseCard compact expandable expanded title="Customer Journey">
              <div className="design-list-demo">
                {customerJourney.slice(0, 2).map((item) => (
                  <button className="inbound-compact-row" key={item.id} type="button">
                    <ChannelTag compact value={item.channel} />
                    <span className="inbound-compact-row__main">{item.summary}</span>
                    <StatusBadge
                      label={item.result}
                      size="small"
                      status={item.result === 'Success' ? 'success' : 'failed'}
                    />
                    <span className="inbound-compact-row__date">{item.date}</span>
                  </button>
                ))}
              </div>
            </BaseCard>
            <BaseCard compact title="Ticketing History">
              <div className="design-list-demo">
                {ticketingHistory.slice(0, 2).map((item) => (
                  <button className="inbound-compact-row" key={item.id} type="button">
                    <span className="inbound-ticket-type">{item.ticketType}</span>
                    <StatusBadge label={item.ticketNumber} size="small" status="neutral" />
                    <span className="inbound-compact-row__date">{item.createdDate}</span>
                  </button>
                ))}
              </div>
            </BaseCard>
            <BaseCard compact title="Next Best Action">
              <button className="inbound-action-row" type="button">
                <span className="inbound-action-service">
                  Mastercard Credit Card Activation
                </span>
                <span className="inbound-compact-row__date">22 Dec</span>
              </button>
            </BaseCard>
            <BaseCard compact title="Quick Action">
              <div className="inbound-quick-grid">
                <button className="inbound-quick-action" type="button">
                  Unblock BANK 1 ID
                </button>
                <button className="inbound-quick-action" type="button">
                  Card Replacement
                </button>
              </div>
            </BaseCard>
          </div>
        </DesignSection>

        <DesignSection title="7. Modal System">
          <div className="design-modal-surface">
            <div className="design-modal-surface__header">
              <strong>Transfer Modal</strong>
              <button aria-label="Close modal preview" type="button">
                x
              </button>
            </div>
            <div className="design-modal-surface__body">
              <BaseTabs
                defaultActiveKey="agent"
                items={[
                  {
                    key: 'agent',
                    label: 'Transfer Agent',
                    children: (
                      <div className="aicc-transfer-panel">
                        <div className="aicc-transfer-search">
                          <SearchInput placeholder="Search name or employee ID" />
                          <BaseButton icon={<SearchOutlined />} type="primary">
                            Search
                          </BaseButton>
                        </div>
                        <BaseTable
                          columns={tableColumns}
                          dataSource={tableData}
                          pagination={false}
                          rowKey="key"
                          size="small"
                        />
                      </div>
                    ),
                  },
                  {
                    key: 'number',
                    label: 'Transfer Number',
                    children: <Input placeholder="Enter phone number" />,
                  },
                ]}
                variant="modal"
              />
            </div>
            <div className="design-modal-surface__footer">
              <BaseButton>Cancel</BaseButton>
              <BaseButton type="primary">Confirm</BaseButton>
            </div>
          </div>
          <div className="design-contract-grid">
            {[
              'Transfer Modal',
              'Outbound Modal',
              'Internal Chat Modal',
              'Settings Modal',
              'Verification Modal',
              'Call Flow Detail Modal',
              'Send Email Modal',
            ].map((name) => (
              <code key={name}>{name}</code>
            ))}
          </div>
        </DesignSection>

        <DesignSection title="8. Table System">
          <BaseTable
            clickableRows
            columns={tableColumns}
            dataSource={tableData}
            pagination={{ pageSize: 5 }}
            rowKey="key"
            size="small"
          />
        </DesignSection>

        <DesignSection title="9. Tabs System">
          <div className="design-component-grid">
            <BaseCard compact title="Toolbar Tabs">
              <BaseTabs
                defaultActiveKey="online"
                items={[
                  { key: 'online', label: 'Online Chat', children: 'Workspace tab' },
                  { key: 'video', label: 'Video Call', children: 'Workspace tab' },
                ]}
                type="card"
                variant="toolbar"
              />
            </BaseCard>
            <BaseCard compact title="Modal Tabs">
              <BaseTabs
                defaultActiveKey="search"
                items={[
                  { key: 'search', label: 'Search Area', children: 'Modal content' },
                  { key: 'form', label: 'Form Area', children: 'Modal content' },
                ]}
                variant="modal"
              />
            </BaseCard>
            <BaseCard compact title="Assistant Tabs">
              <BaseTabs
                defaultActiveKey="assistant"
                items={[
                  { key: 'assistant', label: 'Assistant', children: 'AI assistant' },
                  { key: 'connection', label: 'Connection', children: 'System connection' },
                ]}
                variant="assistant"
              />
            </BaseCard>
          </div>
        </DesignSection>

        <DesignSection title="10. Timeline / Journey System">
          <BaseCard compact title="IVR Journey / Transfer Flow">
            <TimelineFlow
              items={callFlowDetail.ivrJourney.map((step) => ({
                id: step.id,
                meta: step.actionTime,
                title: step.nodeName,
              }))}
            />
          </BaseCard>
        </DesignSection>

        <DesignSection title="11. Chat System">
          <BaseCard compact title="Internal Chat / Assistant Chat">
            <div className="design-chat-demo">
              <div className="aicc-internal-chat__message">
                <span>Customer identity has been verified.</span>
                <em>14:22</em>
              </div>
              <div className="aicc-internal-chat__message aicc-internal-chat__message--self">
                <span>Please proceed with credit card activation.</span>
                <em>14:23</em>
              </div>
              <footer className="aicc-internal-chat__composer">
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  placeholder="Type internal message"
                />
                <div className="aicc-internal-chat__composer-actions">
                  <span>
                    <button aria-label="Email template" type="button">
                      <MailOutlined />
                    </button>
                  </span>
                  <BaseButton icon={<SendOutlined />} type="primary">
                    Send
                  </BaseButton>
                </div>
              </footer>
            </div>
          </BaseCard>
        </DesignSection>

        <DesignSection title="12. Toolbar System">
          <div className="design-toolbar-preview">
            <ToolbarButton flashing icon={<PhoneIcon />} tone="incoming">
              Answer
            </ToolbarButton>
            <ToolbarButton active icon={<PauseCircleOutlined />}>
              Hold
            </ToolbarButton>
            <ToolbarButton icon={<AudioMutedOutlined />}>Mute</ToolbarButton>
            <ToolbarButton selected icon={<SwapOutlined />}>
              Transfer
            </ToolbarButton>
            <ToolbarButton icon={<DisconnectOutlined />} tone="danger">
              Hang Up
            </ToolbarButton>
            <ToolbarButton icon={<CheckCircleOutlined />} tone="ready">
              Ready
            </ToolbarButton>
            <ToolbarButton disabled icon={<CloseCircleOutlined />}>
              Disabled
            </ToolbarButton>
          </div>
        </DesignSection>

        <DesignSection title="Reusable Component Contracts">
          <div className="design-contract-grid">
            {[
              'BaseCard',
              'BaseModal',
              'BaseTable',
              'BaseTabs',
              'StatusBadge',
              'ToolbarButton',
              'SearchInput',
              'TimelineFlow',
              'CustomerInformationPanel',
            ].map((name) => (
              <code key={name}>{name}</code>
            ))}
          </div>
        </DesignSection>
      </div>
    </PageContainer>
  )
}
