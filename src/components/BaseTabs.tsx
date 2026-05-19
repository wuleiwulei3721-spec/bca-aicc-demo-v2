import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

export type BaseTabsVariant = 'toolbar' | 'modal' | 'assistant'

export interface BaseTabsProps extends TabsProps {
  variant?: BaseTabsVariant
}

export function BaseTabs({
  className,
  variant = 'toolbar',
  ...props
}: BaseTabsProps) {
  const tabsClassName = [
    'aicc-tabs',
    `aicc-tabs--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <Tabs className={tabsClassName} {...props} />
}
