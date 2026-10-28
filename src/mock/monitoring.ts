export type MonitoringHomeViewKey = 'home-agent' | 'home-tl-spv'
export type MonitoringMonitorViewKey = 'monitor-rtfm-om'
export type MonitoringViewKey =
  | MonitoringHomeViewKey
  | MonitoringMonitorViewKey

interface MonitoringScreenshotViewBase {
  alt: string
  imageSrc: string
  label: string
}

export interface MonitoringHomeScreenshotView
  extends MonitoringScreenshotViewBase {
  key: MonitoringHomeViewKey
  kind: 'home'
}

export interface MonitoringMonitorScreenshotView
  extends MonitoringScreenshotViewBase {
  key: MonitoringMonitorViewKey
  kind: 'monitor'
}

export type MonitoringScreenshotView =
  | MonitoringHomeScreenshotView
  | MonitoringMonitorScreenshotView

export const defaultMonitoringHomeViewKey: MonitoringHomeViewKey = 'home-agent'

export const defaultMonitoringMonitorViewKey: MonitoringMonitorViewKey =
  'monitor-rtfm-om'

export const monitoringScreenshotViews: MonitoringScreenshotView[] = [
  {
    alt: 'Home Agent monitoring dashboard',
    imageSrc: '/screenshots/monitoring/home-agent.png',
    key: 'home-agent',
    kind: 'home',
    label: 'Home-Agent',
  },
  {
    alt: 'Home TL and SPV monitoring dashboard',
    imageSrc: '/screenshots/monitoring/home-tl-spv.png',
    key: 'home-tl-spv',
    kind: 'home',
    label: 'Home-TL SPV',
  },
  {
    alt: 'Monitor RTFM and OM dashboard with AI Assistant Fail SLA popup',
    imageSrc: '/screenshots/monitoring/monitor-rtfm-om.png',
    key: 'monitor-rtfm-om',
    kind: 'monitor',
    label: 'Monitor-RTFM OM',
  },
]

export const monitoringScreenshotViewByKey = Object.fromEntries(
  monitoringScreenshotViews.map((view) => [view.key, view]),
) as Record<MonitoringViewKey, MonitoringScreenshotView>
