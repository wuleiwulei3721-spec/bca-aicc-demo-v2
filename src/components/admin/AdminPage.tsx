import type { ReactNode } from 'react'
import { PageContainer } from '../PageContainer'

export interface AdminPageProps {
  children?: ReactNode
  className?: string
  description?: ReactNode
  eyebrow?: ReactNode
  extra?: ReactNode
  title?: ReactNode
}

export function AdminPage({
  children,
  className,
  description,
  eyebrow,
  extra,
  title,
}: AdminPageProps) {
  const pageClassName = ['aicc-admin-page', 'routing-config-page', className]
    .filter(Boolean)
    .join(' ')

  return (
    <PageContainer
      className="aicc-page-container--admin"
      description={description}
      eyebrow={eyebrow}
      extra={extra}
      title={title}
    >
      <section className={pageClassName}>{children}</section>
    </PageContainer>
  )
}
