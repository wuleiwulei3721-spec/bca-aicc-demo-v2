import { useState } from 'react'
import {
  ApiOutlined,
  CloseOutlined,
  ExportOutlined,
  RobotOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import { BaseTabs } from '../../../components'
import { useCallManagementStore } from '../../../store'

const ASSISTANT_SCREENSHOT_SRC = '/screenshots/assistant-workspace.jpg'

export interface AssistantPanelExtraTab {
  children: ReactNode
  closable?: boolean
  icon?: ReactNode
  key: string
  title: string
}

function AssistantScreenshotArea() {
  const [screenshotLoaded, setScreenshotLoaded] = useState(false)

  return (
    <div
      className={[
        'inbound-system-shot',
        'inbound-system-shot--assistant',
        screenshotLoaded && 'inbound-system-shot--loaded',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        alt="Agent Assistant system screenshot"
        src={ASSISTANT_SCREENSHOT_SRC}
        onError={() => setScreenshotLoaded(false)}
        onLoad={() => setScreenshotLoaded(true)}
      />
      <div className="inbound-system-shot__fallback">
        <div className="inbound-assistant-system">
          <section className="inbound-assistant-system__insight">
            <span>Intent Terdeteksi</span>
            <strong>Laporan kartu hilang dan aktivasi kartu kredit</strong>
            <p>
              Nasabah meminta pemblokiran kartu lama, pengecekan status
              penggantian kartu, dan bantuan aktivasi kartu kredit Mastercard.
            </p>
          </section>
          <section className="inbound-assistant-system__timeline">
            {[
              ['14:19', 'IVR mengarahkan ke layanan kartu kredit.'],
              ['14:21', 'Verifikasi data nasabah sedang berlangsung.'],
              ['14:23', 'Rekomendasi aktivasi kartu kredit tersedia.'],
            ].map(([time, text]) => (
              <div key={text}>
                <span>{time}</span>
                <p>{text}</p>
              </div>
            ))}
          </section>
          <section className="inbound-assistant-system__suggestions">
            <strong>Suggested Response</strong>
            <p>
              Bapak Dimas, kami akan membantu memblokir kartu yang hilang dan
              melanjutkan proses penggantian kartu melalui sistem BANK 1.
            </p>
            <button type="button">Use Response</button>
          </section>
        </div>
      </div>
    </div>
  )
}

function CommonLinksArea() {
  const commonLinks = useCallManagementStore(
    (state) => state.commonLinkEntries,
  )

  return (
    <div className="inbound-system-shot inbound-system-shot--assistant">
      <div className="inbound-system-shot__fallback inbound-system-shot__fallback--visible">
        <div className="inbound-common-links-system">
          {commonLinks.length > 0 ? (
            commonLinks.map((link) => (
              <a
                className="inbound-common-links-system__link"
                href={link.websiteUrl}
                key={link.id}
                rel="noreferrer"
                target="_blank"
                title={`${link.websiteName} - ${link.websiteUrl}`}
              >
                <strong>{link.websiteName}</strong>
                <span>
                  <ExportOutlined />
                  Open
                </span>
                <em>{link.websiteUrl}</em>
              </a>
            ))
          ) : (
            <div className="inbound-common-links-system__empty">
              <strong>No common links</strong>
              <span>Add links in Call Management.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface AssistantPanelProps {
  activeKey?: string
  extraTabs?: AssistantPanelExtraTab[]
  onActiveKeyChange?: (activeKey: string) => void
  onCloseExtraTab?: (targetKey: string) => void
}

function renderAssistantTabLabel({
  closable = false,
  icon,
  key,
  title,
  onClose,
}: {
  closable?: boolean
  icon: ReactNode
  key: string
  title: string
  onClose?: (targetKey: string) => void
}) {
  return (
    <span
      className={[
        'inbound-assistant-tabs__label',
        closable ? 'inbound-assistant-tabs__label--closable' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      title={title}
    >
      <span className="inbound-assistant-tabs__label-icon">{icon}</span>
      <span className="inbound-assistant-tabs__label-text">{title}</span>
      {closable && (
        <button
          aria-label={`Close ${title}`}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onClose?.(key)
          }}
        >
          <CloseOutlined />
        </button>
      )}
    </span>
  )
}

export function AssistantPanel({
  activeKey,
  extraTabs = [],
  onActiveKeyChange,
  onCloseExtraTab,
}: AssistantPanelProps) {
  const [internalActiveKey, setInternalActiveKey] = useState('assistant')
  const currentActiveKey = activeKey ?? internalActiveKey
  const handleActiveKeyChange = (nextActiveKey: string) => {
    setInternalActiveKey(nextActiveKey)
    onActiveKeyChange?.(nextActiveKey)
  }

  return (
    <div className="inbound-right-panel">
      <BaseTabs
        activeKey={currentActiveKey}
        className="inbound-assistant-tabs"
        items={[
          {
            key: 'assistant',
            label: renderAssistantTabLabel({
              icon: <RobotOutlined />,
              key: 'assistant',
              title: 'Assistant',
            }),
            children: <AssistantScreenshotArea />,
          },
          {
            key: 'connection',
            label: renderAssistantTabLabel({
              icon: <ApiOutlined />,
              key: 'connection',
              title: 'Common Links',
            }),
            children: <CommonLinksArea />,
          },
          ...extraTabs.map((tab) => ({
            key: tab.key,
            label: renderAssistantTabLabel({
              closable: tab.closable !== false,
              icon: tab.icon,
              key: tab.key,
              title: tab.title,
              onClose: onCloseExtraTab,
            }),
            children: tab.children,
          })),
        ]}
        onChange={handleActiveKeyChange}
        variant="assistant"
      />
    </div>
  )
}
