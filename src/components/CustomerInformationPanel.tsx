import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ClockCircleOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { Avatar } from 'antd'
import type { CustomerInformation, VerificationStatus } from '../types'
import { BaseCard } from './BaseCard'
import { BaseButton } from './BaseButton'
import { StatusBadge } from './StatusBadge'

export interface CustomerInformationPanelProps {
  accessChannelNode?: ReactNode
  className?: string
  customer: CustomerInformation
  onOpenCallFlow?: () => void
  onSendEmail?: () => void
  onVerify?: () => void
  verificationStatus?: VerificationStatus
}

function verificationBadge(status: VerificationStatus) {
  if (status === 'Verified') {
    return { label: 'Verified', status: 'verified' as const }
  }

  if (status === 'Verification Failed') {
    return { label: 'Failed', status: 'failed' as const }
  }

  return { label: 'Unverified', status: 'warning' as const }
}

export function CustomerInformationPanel({
  accessChannelNode,
  className,
  customer,
  onOpenCallFlow,
  onSendEmail,
  onVerify,
  verificationStatus,
}: CustomerInformationPanelProps) {
  const [internalVerificationStatus] = useState(customer.verificationStatus)
  const status = verificationStatus ?? internalVerificationStatus
  const badge = verificationBadge(status)
  const { profile } = customer

  return (
    <BaseCard
      className={className}
      compact
      title="Customer Information"
      tone="highlight"
    >
      <div className="aicc-customer-info">
        <div className="aicc-customer-info__identity">
          <div className="aicc-customer-info__avatar-wrap">
            <Avatar
              className="aicc-customer-info__avatar"
              size={58}
              src={profile.avatarUrl}
            >
              {profile.avatarInitials}
            </Avatar>
            <StatusBadge label="Priority" size="small" status="selected" />
          </div>

          <div className="aicc-customer-info__main">
            <div className="aicc-customer-info__name">{profile.name}</div>
            <div className="aicc-customer-info__facts">
              <span>
                <PhoneOutlined />
                {profile.phoneNumber}
              </span>
              <button
                className="aicc-customer-info__fact-action"
                title="Send email"
                type="button"
                onClick={onSendEmail}
              >
                <MailOutlined />
                {profile.email}
              </button>
              <span>
                <IdcardOutlined />
                {profile.cisNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="aicc-customer-info__access-strip">
          <button
            className="aicc-customer-info__channel-action"
            disabled={!onOpenCallFlow}
            title="View call flow detail"
            type="button"
            onClick={onOpenCallFlow}
          >
            {accessChannelNode ?? customer.accessChannel}
          </button>
          <span>
            <ClockCircleOutlined />
            {customer.accessDuration}
          </span>
          <StatusBadge
            className="aicc-customer-info__verification"
            label={badge.label}
            size="small"
            status={badge.status}
          />
          <BaseButton size="small" type="primary" onClick={onVerify}>
            Verify
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  )
}
