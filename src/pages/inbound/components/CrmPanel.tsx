import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  BankOutlined,
  BulbOutlined,
  CloseOutlined,
  FileDoneOutlined,
  MessageOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { BaseTabs } from '../../../components'
import type { CrmWorkspaceTab } from '../../../types'
import {
  ConversationWorkspace,
  type ConversationWorkspaceConfig,
} from './ConversationWorkspace'

const CRM_TAB_KEY = 'crm'
export const CONVERSATION_TAB_KEY = 'conversation'
const CRM_SCREENSHOT_SRC = '/screenshots/crm-workspace.jpg'

interface CrmPanelProps {
  activeKey: string
  conversation?: ConversationWorkspaceConfig
  conversationContent?: ReactNode
  conversationKey?: string
  workspaceTabs: CrmWorkspaceTab[]
  onActiveKeyChange: (activeKey: string) => void
  onCloseTab: (tabKey: string) => void
}

function renderCrmTabLabel(label: string, icon: ReactNode) {
  return (
    <span className="inbound-crm-tab-label" title={label}>
      <span className="inbound-crm-tab-label__icon">{icon}</span>
      <span className="inbound-crm-tab-label__text">{label}</span>
    </span>
  )
}

function renderWorkspaceTabIcon(kind: CrmWorkspaceTab['kind']) {
  if (kind === 'next-best-action') {
    return <BulbOutlined />
  }

  if (kind === 'quick-action') {
    return <ThunderboltOutlined />
  }

  return <FileDoneOutlined />
}

function CrmScreenshotArea() {
  const [screenshotLoaded, setScreenshotLoaded] = useState(false)

  return (
    <div
      className={[
        'inbound-system-shot',
        'inbound-system-shot--crm',
        screenshotLoaded && 'inbound-system-shot--loaded',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        alt="CRM system screenshot"
        src={CRM_SCREENSHOT_SRC}
        onError={() => setScreenshotLoaded(false)}
        onLoad={() => setScreenshotLoaded(true)}
      />
      <div className="inbound-system-shot__fallback">
        <div className="inbound-crm-system">
          <aside className="inbound-crm-system__nav">
            <strong>BANK 1 CRM</strong>
            {[
              'Profil Nasabah',
              'Rekening & Kartu',
              'Ticketing',
              'Penawaran',
              'Aktivitas',
            ].map((item, index) => (
              <span
                className={index === 0 ? 'inbound-crm-system__nav-active' : ''}
                key={item}
              >
                {item}
              </span>
            ))}
          </aside>
          <section className="inbound-crm-system__main">
            <div className="inbound-crm-system__identity">
              <div>
                <span>CIS Number</span>
                <strong>00000078987</strong>
              </div>
              <div>
                <span>Nama Nasabah</span>
                <strong>Dimas Abimanyu Prabowo</strong>
              </div>
              <div>
                <span>Segmentasi</span>
                <strong>Nasabah Prioritas</strong>
              </div>
              <div>
                <span>Status Verifikasi</span>
                <strong>Terverifikasi Sebagian</strong>
              </div>
            </div>
            <div className="inbound-crm-system__grid">
              <section>
                <h3>Ringkasan Produk</h3>
                {[
                  ['Tahapan BANK 1', 'Aktif', 'IDR 248.500.000'],
                  ['Kartu Kredit Mastercard', 'Perlu Aktivasi', 'Limit IDR 65.000.000'],
                  ['BANK 1 Mobile', 'Aktif', 'Perangkat terdaftar'],
                  ['KPR', 'Prospek', 'Pra-kualifikasi tersedia'],
                ].map(([product, status, value]) => (
                  <div className="inbound-crm-system__row" key={product}>
                    <strong>{product}</strong>
                    <span>{status}</span>
                    <em>{value}</em>
                  </div>
                ))}
              </section>
              <section>
                <h3>Aktivitas Terakhir</h3>
                {[
                  ['14:18', 'Panggilan masuk melalui IVR kartu kredit'],
                  ['13 Oct', 'Laporan kartu hilang dibuat'],
                  ['03 Nov', 'Aktivasi mobile banking selesai'],
                  ['22 Dec', 'Klaim promosi dalam proses review'],
                ].map(([time, activity]) => (
                  <div className="inbound-crm-system__activity" key={activity}>
                    <span>{time}</span>
                    <p>{activity}</p>
                  </div>
                ))}
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function WorkspaceBusinessDetail({ tab }: { tab: CrmWorkspaceTab }) {
  const actionLabel =
    tab.kind === 'ticket'
      ? 'Update Ticket'
      : tab.kind === 'next-best-action'
        ? 'Buat Penawaran'
        : 'Proses Aksi'
  const statusLabel =
    tab.kind === 'ticket'
      ? 'Dalam Penanganan'
      : tab.kind === 'next-best-action'
        ? 'Direkomendasikan'
        : 'Siap Diproses'

  return (
    <div className="inbound-crm-detail">
      <div className="inbound-crm-detail__summary">
        <section>
          <span>Jenis Layanan</span>
          <strong>{tab.title}</strong>
          <p>{tab.description}</p>
        </section>
        <section>
          <span>Referensi</span>
          <strong>{tab.reference}</strong>
          <p>{tab.crmLink}</p>
        </section>
        <section>
          <span>Status</span>
          <strong>{statusLabel}</strong>
          <p>Dibuka dari panel interaksi inbound.</p>
        </section>
      </div>

      <div className="inbound-crm-detail__body">
        <section className="inbound-crm-detail__form">
          <h3>Detail CRM</h3>
          {[
            ['Nama Nasabah', 'Dimas Abimanyu Prabowo'],
            ['Nomor Ponsel', '087825100234'],
            ['Segmen', 'Nasabah Prioritas'],
            ['Unit Penanganan', 'Credit Card Service'],
            ['Prioritas SLA', 'High - same day handling'],
          ].map(([label, value]) => (
            <label key={label}>
              <span>{label}</span>
              <input readOnly value={value} />
            </label>
          ))}
          <label>
            <span>Catatan Agen</span>
            <textarea
              readOnly
              value={`Nasabah terverifikasi melalui panggilan inbound. Lanjutkan proses ${tab.title.toLowerCase()} sesuai prosedur BANK 1.`}
            />
          </label>
        </section>

        <aside className="inbound-crm-detail__side">
          <h3>Checklist</h3>
          {[
            'Validasi data nasabah',
            'Konfirmasi kanal komunikasi',
            'Cek histori tiket dan produk aktif',
            'Sampaikan ringkasan tindakan kepada nasabah',
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
          <button type="button">{actionLabel}</button>
        </aside>
      </div>
    </div>
  )
}

export function CrmPanel({
  activeKey,
  conversation,
  conversationContent,
  conversationKey,
  workspaceTabs,
  onActiveKeyChange,
  onCloseTab,
}: CrmPanelProps) {
  const items = useMemo<TabsProps['items']>(
    () => [
      {
        key: CRM_TAB_KEY,
        closable: false,
        label: renderCrmTabLabel('CRM', <BankOutlined />),
        children: <CrmScreenshotArea />,
      },
      ...(conversation || conversationContent
        ? [
            {
              key: CONVERSATION_TAB_KEY,
              closable: false,
              label: renderCrmTabLabel('Conversation', <MessageOutlined />),
              children: conversationContent ?? (
                <ConversationWorkspace
                  key={conversationKey ?? conversation?.session.id}
                  {...conversation!}
                />
              ),
            },
          ]
        : []),
      ...workspaceTabs.map((tab) => ({
        key: tab.key,
        closable: true,
        label: renderCrmTabLabel(
          tab.kind === 'ticket' && tab.reference ? tab.reference : tab.title,
          renderWorkspaceTabIcon(tab.kind),
        ),
        children: <WorkspaceBusinessDetail tab={tab} />,
      })),
    ],
    [conversation, conversationContent, conversationKey, workspaceTabs],
  )

  const handleEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action !== 'remove' || typeof targetKey !== 'string') {
      return
    }

    onCloseTab(targetKey)
  }

  return (
    <div className="inbound-center-panel">
      <BaseTabs
        activeKey={activeKey}
        className="inbound-crm-workspace-tabs"
        hideAdd
        items={items}
        removeIcon={<CloseOutlined />}
        type="editable-card"
        variant="toolbar"
        onChange={onActiveKeyChange}
        onEdit={handleEdit}
      />
    </div>
  )
}
