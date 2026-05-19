import type { ReactNode } from 'react'

interface EmbeddedPlaceholderProps {
  label: string
  title?: string
  children?: ReactNode
}

export function EmbeddedPlaceholder({
  label,
  title,
  children,
}: EmbeddedPlaceholderProps) {
  return (
    <div className="inbound-embedded">
      {title && (
        <div className="inbound-embedded__header">
          <h2>{title}</h2>
        </div>
      )}
      <div className="inbound-embedded__surface">
        <div className="inbound-system-mock">
          <div className="inbound-system-mock__rail">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="inbound-system-mock__main">
            <div className="inbound-system-mock__filters">
              <span />
              <span />
              <span />
            </div>
            <div className="inbound-system-mock__table">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
          <div className="inbound-system-mock__side">
            <span />
            <span />
            <span />
          </div>
        </div>
        {children}
        <div className="inbound-embedded__overlay">
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}
