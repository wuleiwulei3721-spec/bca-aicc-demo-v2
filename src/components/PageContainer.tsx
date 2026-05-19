import type { ReactNode } from 'react'

export interface PageContainerProps {
  title?: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  extra?: ReactNode
  children?: ReactNode
}

export function PageContainer({
  title,
  description,
  eyebrow,
  extra,
  children,
}: PageContainerProps) {
  const hasHeader = Boolean(title || description || eyebrow || extra)

  return (
    <main className="aicc-page-container">
      {hasHeader && (
        <div className="aicc-page-container__header">
          <div>
            {eyebrow && (
              <div className="aicc-page-container__eyebrow">{eyebrow}</div>
            )}
            {title && <h1 className="aicc-page-container__title">{title}</h1>}
            {description && (
              <div className="aicc-page-container__description">
                {description}
              </div>
            )}
          </div>
          {extra && <div className="aicc-page-container__extra">{extra}</div>}
        </div>
      )}
      <div className="aicc-page-container__body">{children}</div>
    </main>
  )
}
