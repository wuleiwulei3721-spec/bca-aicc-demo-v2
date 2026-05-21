import { useState } from 'react'
import { ApiOutlined, RobotOutlined } from '@ant-design/icons'
import { BaseTabs } from '../../../components'

const ASSISTANT_SCREENSHOT_SRC = '/screenshots/assistant-workspace.jpg'

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

function ConnectionSystemArea() {
  return (
    <div className="inbound-system-shot inbound-system-shot--assistant">
      <div className="inbound-system-shot__fallback inbound-system-shot__fallback--visible">
        <div className="inbound-connection-system">
          {[
            ['CRM Core', 'Connected', '42 ms'],
            ['Knowledge Base', 'Connected', '58 ms'],
            ['Voice Analytics', 'Streaming', 'Live'],
            ['Case Workflow', 'Connected', '31 ms'],
          ].map(([system, status, latency]) => (
            <section key={system}>
              <strong>{system}</strong>
              <span>{status}</span>
              <em>{latency}</em>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AssistantPanel() {
  return (
    <div className="inbound-right-panel">
      <BaseTabs
        className="inbound-assistant-tabs"
        defaultActiveKey="assistant"
        items={[
          {
            key: 'assistant',
            label: (
              <span>
                <RobotOutlined />
                Assistant
              </span>
            ),
            children: <AssistantScreenshotArea />,
          },
          {
            key: 'connection',
            label: (
              <span>
                <ApiOutlined />
                Connection
              </span>
            ),
            children: <ConnectionSystemArea />,
          },
        ]}
        variant="assistant"
      />
    </div>
  )
}
