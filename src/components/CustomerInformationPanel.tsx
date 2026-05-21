import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  CheckOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Avatar } from 'antd'
import type { CustomerInformation, VerificationStatus } from '../types'
import { BaseCard } from './BaseCard'
import { BaseButton } from './BaseButton'
import { PhoneIcon } from './PhoneIcon'
import { StatusBadge } from './StatusBadge'

export type CustomerOutboundRequestStatus =
  | 'idle'
  | 'requesting'
  | 'approved'

export interface CustomerInformationPanelProps {
  accessChannelNode?: ReactNode
  className?: string
  customer: CustomerInformation
  headerExtra?: ReactNode
  onOpenCallFlow?: () => void
  onRequestOutbound?: () => void
  onSendEmail?: () => void
  onStartOutbound?: () => void
  onVerify?: () => void
  outboundRequestStatus?: CustomerOutboundRequestStatus
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
  headerExtra,
  onOpenCallFlow,
  onRequestOutbound,
  onSendEmail,
  onStartOutbound,
  onVerify,
  outboundRequestStatus = 'idle',
  verificationStatus,
}: CustomerInformationPanelProps) {
  const [internalVerificationStatus] = useState(customer.verificationStatus)
  const status = verificationStatus ?? internalVerificationStatus
  const badge = verificationBadge(status)
  const { profile } = customer
  const outboundRequestLabel =
    outboundRequestStatus === 'requesting'
      ? 'Requesting...'
      : outboundRequestStatus === 'approved'
        ? 'Call'
        : 'Request Outbound'
  const handleOutboundClick =
    outboundRequestStatus === 'approved'
      ? onStartOutbound
      : onRequestOutbound

  return (
    <BaseCard
      className={className}
      compact
      headerExtra={headerExtra}
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
              <div
                className={[
                  'aicc-customer-info__phone-row',
                  `aicc-customer-info__phone-row--${outboundRequestStatus}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="aicc-customer-info__phone-value">
                  <PhoneIcon />
                  {profile.phoneNumber}
                </span>
                {(onRequestOutbound || onStartOutbound) && (
                  <button
                    className={[
                      'aicc-customer-info__outbound-request',
                      `aicc-customer-info__outbound-request--${outboundRequestStatus}`,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={
                      outboundRequestStatus === 'requesting' ||
                      !handleOutboundClick
                    }
                    title={
                      outboundRequestStatus === 'approved'
                        ? 'Start outbound call'
                        : 'Request TL approval for outbound call'
                    }
                    type="button"
                    onClick={handleOutboundClick}
                  >
                    {outboundRequestStatus === 'approved' && <CheckOutlined />}
                    <span>{outboundRequestLabel}</span>
                  </button>
                )}
              </div>
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
