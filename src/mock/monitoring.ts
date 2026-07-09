export type MonitoringHomeViewKey = 'home-tl' | 'home-spv' | 'home-om'
export type MonitoringMonitorViewKey = 'monitor-tl' | 'monitor-om'
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

export const defaultMonitoringHomeViewKey: MonitoringHomeViewKey = 'home-om'

export const defaultMonitoringMonitorViewKey: MonitoringMonitorViewKey =
  'monitor-tl'

export const monitoringScreenshotViews: MonitoringScreenshotView[] = [
  {
    alt: 'Home Agent monitoring dashboard',
    imageSrc: '/screenshots/monitoring/home-om.png',
    key: 'home-om',
    kind: 'home',
    label: 'Home-Agent',
  },
  {
    alt: 'Home TL monitoring dashboard',
    imageSrc: '/screenshots/monitoring/home-tl.png',
    key: 'home-tl',
    kind: 'home',
    label: 'Home-TL',
  },
  {
    alt: 'Home SPV monitoring dashboard',
    imageSrc: '/screenshots/monitoring/home-spv.png',
    key: 'home-spv',
    kind: 'home',
    label: 'Home-SPV',
  },
  {
    alt: 'Monitor TL agent monitoring dashboard',
    imageSrc: '/screenshots/monitoring/monitor-tl.png',
    key: 'monitor-tl',
    kind: 'monitor',
    label: 'Monitor-TL',
  },
  {
    alt: 'Monitor OM agent monitoring dashboard',
    imageSrc: '/screenshots/monitoring/monitor-om.png',
    key: 'monitor-om',
    kind: 'monitor',
    label: 'Monitor-OM',
  },
]

export const monitoringScreenshotViewByKey = Object.fromEntries(
  monitoringScreenshotViews.map((view) => [view.key, view]),
) as Record<MonitoringViewKey, MonitoringScreenshotView>
